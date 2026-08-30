import io
import random
import uuid

from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pypdf import PdfReader

import ai

app = FastAPI(title="StudyLoop API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SESSIONS: dict[str, dict] = {}

DEFAULT_ROUNDS_PER_CONCEPT = 3
DEFAULT_START_LEVEL = 2
MIN_LEVEL = 1
MAX_LEVEL = 3
CORRECT_DELTA = 15
WRONG_DELTA = -12
WEAK_THRESHOLD = 60
DRILL_ROUNDS_PER_CONCEPT = 3


def extract_text_from_pdf(raw: bytes) -> str:
    reader = PdfReader(io.BytesIO(raw))
    return "\n".join((page.extract_text() or "") for page in reader.pages)


def shuffle_choices(question: dict) -> dict:
    """Randomize which position holds the correct answer, independent of any
    positional bias in how the model generated the choices."""
    n = len(question["choices"])
    order = list(range(n))
    random.shuffle(order)
    question["choices"] = [question["choices"][i] for i in order]
    question["correct_index"] = order.index(question["correct_index"])
    return question


def build_session(material_text: str, rounds_per_concept: int, start_level: int) -> dict:
    generated = ai.generate_concepts_and_questions(material_text)
    concepts = generated["concepts"]
    questions = {q["id"]: shuffle_choices(q) for q in generated["questions"]}

    concept_state = {
        c["id"]: {"level": start_level, "mastery": 50, "correct": 0, "total": 0}
        for c in concepts
    }

    # Build the round-robin quiz order: each concept appears rounds_per_concept times, shuffled.
    order = []
    for _ in range(rounds_per_concept):
        round_concepts = [c["id"] for c in concepts]
        random.shuffle(round_concepts)
        order.extend(round_concepts)

    session = {
        "material_text": material_text,
        "concepts": concepts,
        "questions": questions,
        "concept_state": concept_state,
        "order": order,
        "order_index": 0,
        "asked_question_ids": set(),
        "history": [],
    }
    return session


def pick_question_for_concept(session: dict, concept_id: str) -> dict:
    target_level = session["concept_state"][concept_id]["level"]
    asked = session["asked_question_ids"]
    candidates = [
        q
        for q in session["questions"].values()
        if q["concept_id"] == concept_id and q["id"] not in asked
    ]
    if not candidates:
        return None

    def distance(q):
        return abs(q["difficulty"] - target_level)

    candidates.sort(key=distance)
    best_distance = distance(candidates[0])
    best = [q for q in candidates if distance(q) == best_distance]
    return random.choice(best)


class UploadTextBody(BaseModel):
    text: str


@app.post("/api/upload")
async def upload(
    file: UploadFile | None = File(None),
    text: str | None = Form(None),
    rounds_per_concept: int = Form(DEFAULT_ROUNDS_PER_CONCEPT),
    start_level: int = Form(DEFAULT_START_LEVEL),
):
    rounds_per_concept = max(1, min(6, rounds_per_concept))
    start_level = max(MIN_LEVEL, min(MAX_LEVEL, start_level))
    material_text = ""
    if file is not None:
        raw = await file.read()
        if file.filename and file.filename.lower().endswith(".pdf"):
            material_text = extract_text_from_pdf(raw)
        else:
            material_text = raw.decode("utf-8", errors="ignore")
    elif text:
        material_text = text

    material_text = material_text.strip()
    if len(material_text) < 200:
        raise HTTPException(
            status_code=400,
            detail="Please provide at least a few paragraphs of study material (200+ characters).",
        )

    try:
        session = build_session(material_text, rounds_per_concept, start_level)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"AI generation failed: {exc}")

    session_id = str(uuid.uuid4())
    SESSIONS[session_id] = session

    return {
        "session_id": session_id,
        "concepts": session["concepts"],
        "total_rounds": len(session["order"]),
    }


def get_session(session_id: str) -> dict:
    session = SESSIONS.get(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Unknown session_id")
    return session


@app.post("/api/quiz/next")
async def quiz_next(body: dict):
    session_id = body["session_id"]
    session = get_session(session_id)

    idx = session["order_index"]
    if idx >= len(session["order"]):
        return {"done": True}

    concept_id = session["order"][idx]
    question = pick_question_for_concept(session, concept_id)
    if question is None:
        # concept's bank exhausted, skip to next round slot
        session["order_index"] += 1
        return await quiz_next(body)

    session["asked_question_ids"].add(question["id"])

    return {
        "done": False,
        "round": idx + 1,
        "total_rounds": len(session["order"]),
        "question": {
            "id": question["id"],
            "concept_id": question["concept_id"],
            "difficulty": question["difficulty"],
            "question": question["question"],
            "choices": question["choices"],
        },
    }


@app.post("/api/quiz/answer")
async def quiz_answer(body: dict):
    session_id = body["session_id"]
    question_id = body["question_id"]
    selected_index = body["selected_index"]

    session = get_session(session_id)
    question = session["questions"].get(question_id)
    if question is None:
        raise HTTPException(status_code=404, detail="Unknown question_id")

    concept_id = question["concept_id"]
    state = session["concept_state"][concept_id]
    correct = selected_index == question["correct_index"]

    state["total"] += 1
    if correct:
        state["correct"] += 1
        state["level"] = min(MAX_LEVEL, state["level"] + 1)
        state["mastery"] = min(100, state["mastery"] + CORRECT_DELTA)
    else:
        state["level"] = max(MIN_LEVEL, state["level"] - 1)
        state["mastery"] = max(0, state["mastery"] + WRONG_DELTA)

    session["order_index"] += 1
    session["history"].append(
        {
            "question_id": question_id,
            "concept_id": concept_id,
            "correct": correct,
            "source_snippet": question["source_snippet"],
        }
    )

    return {
        "correct": correct,
        "correct_index": question["correct_index"],
        "explanation": question["explanation"],
        "source_snippet": question["source_snippet"],
        "concept_id": concept_id,
        "concept_mastery": state["mastery"],
        "concept_level": state["level"],
    }


@app.post("/api/quiz/drill")
async def quiz_drill(body: dict):
    session_id = body["session_id"]
    session = get_session(session_id)

    weak_ids = [
        cid
        for cid, state in session["concept_state"].items()
        if state["mastery"] < WEAK_THRESHOLD
    ]
    if not weak_ids:
        weak_ids = list(session["concept_state"].keys())

    weak_concepts = [c for c in session["concepts"] if c["id"] in weak_ids]
    existing_by_concept = {
        cid: [q["question"] for q in session["questions"].values() if q["concept_id"] == cid]
        for cid in weak_ids
    }

    try:
        new_questions = ai.generate_drill_questions(
            session["material_text"], weak_concepts, existing_by_concept
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Drill generation failed: {exc}")

    for q in new_questions:
        q["id"] = f"drill-{uuid.uuid4().hex[:8]}"
        shuffle_choices(q)
        session["questions"][q["id"]] = q

    order = []
    for _ in range(DRILL_ROUNDS_PER_CONCEPT):
        round_concepts = list(weak_ids)
        random.shuffle(round_concepts)
        order.extend(round_concepts)

    session["order"] = order
    session["order_index"] = 0

    return {"concepts": weak_concepts, "total_rounds": len(order)}


@app.get("/api/results/{session_id}")
async def results(session_id: str):
    session = get_session(session_id)
    concepts = []
    weak_snippets = []
    tips = []

    for c in session["concepts"]:
        state = session["concept_state"][c["id"]]
        concepts.append(
            {
                "id": c["id"],
                "name": c["name"],
                "mastery": state["mastery"],
                "correct": state["correct"],
                "total": state["total"],
            }
        )
        if state["mastery"] < WEAK_THRESHOLD:
            tips.append(f"Review {c['name']} — you're still shaky here.")

    weak_concept_ids = {c["id"] for c in concepts if c["mastery"] < WEAK_THRESHOLD}
    for h in session["history"]:
        if h["concept_id"] in weak_concept_ids and not h["correct"]:
            weak_snippets.append(
                {"concept_id": h["concept_id"], "snippet": h["source_snippet"]}
            )

    return {
        "concepts": concepts,
        "weak_snippets": weak_snippets,
        "tips": tips,
        "material_text": session["material_text"],
    }
