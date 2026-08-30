import json
import os

import google.generativeai as genai

MODEL = os.environ.get("GEMINI_MODEL", "gemini-3.6-flash")

_configured = False


def _ensure_configured():
    global _configured
    if not _configured:
        genai.configure(api_key=os.environ["GEMINI_API_KEY"])
        _configured = True


GENERATION_SYSTEM_PROMPT = """You are an expert tutor and assessment designer. You turn raw study \
material into a concept map and a bank of multiple-choice practice questions at three \
difficulty levels, so a student can be quizzed adaptively.

Rules:
- Identify 4 to 5 key concepts actually covered in the material. Do not invent concepts that \
aren't in the text.
- For each concept, write exactly 2 questions at each difficulty level (1=easy, 2=medium, \
3=hard) — 6 questions per concept total. Easy questions test recall of a definition or fact. \
Medium questions test understanding or application. Hard questions test synthesis, edge cases, \
or applying the concept in a new situation.
- Every one of the 6 questions for a concept must test a genuinely different fact, detail, or \
angle. Never write two questions that are really the same question in different words — if you \
notice two questions would have overlapping answers or explanations, replace one with a question \
about a different detail from the material.
- Every question is multiple-choice with exactly 4 choices and one correct answer. Vary which \
position (0, 1, 2, or 3) holds the correct answer from question to question — do not default to \
placing it first.
- Every question must include "source_snippet": a short verbatim quote (under 200 characters) \
copied EXACTLY from the provided material that the question is grounded in. Do not paraphrase \
the snippet.
- Every question must include a one or two sentence "explanation" a student can learn from, \
written so it makes sense even if they got the question wrong.
- Respond with a single JSON object matching this shape exactly:

{
  "concepts": [{"id": "c1", "name": "Concept name"}, ...],
  "questions": [
    {
      "id": "q1",
      "concept_id": "c1",
      "difficulty": 1,
      "question": "...",
      "choices": ["...", "...", "...", "..."],
      "correct_index": 0,
      "explanation": "...",
      "source_snippet": "..."
    },
    ...
  ]
}
"""


def generate_concepts_and_questions(material_text: str) -> dict:
    _ensure_configured()
    material_text = material_text[:15000]

    model = genai.GenerativeModel(MODEL, system_instruction=GENERATION_SYSTEM_PROMPT)
    response = model.generate_content(
        f"Study material:\n\n{material_text}\n\nGenerate the concept map and question bank as specified.",
        generation_config={
            "response_mime_type": "application/json",
            "max_output_tokens": 16384,
        },
    )

    data = json.loads(response.text)
    if not data.get("concepts") or not data.get("questions"):
        raise ValueError("Model response missing concepts or questions")
    return data


DRILL_SYSTEM_PROMPT = """You are an expert tutor writing a short focused drill for a student who is \
struggling with specific concepts from their study material.

For each concept listed below, write exactly 3 NEW multiple-choice questions — one easy \
(difficulty 1), one medium (difficulty 2), one hard (difficulty 3) — grounded in the study \
material.

Rules:
- Each concept lists the questions the student has ALREADY been asked. Your new questions must \
test different facts, details, or angles than every one of those — do not rephrase or lightly \
reword an already-asked question.
- Every question is multiple-choice with exactly 4 choices and one correct answer, with the \
correct answer's position varied (not always first).
- Every question must include "source_snippet": a short verbatim quote (under 200 characters) \
copied EXACTLY from the material.
- Every question must include a one or two sentence "explanation".
- Respond with a single JSON object: {"questions": [{"concept_id": "...", "difficulty": 1, \
"question": "...", "choices": ["...", "...", "...", "..."], "correct_index": 0, \
"explanation": "...", "source_snippet": "..."}, ...]}
"""


def generate_drill_questions(material_text: str, concepts: list, existing_by_concept: dict) -> list:
    _ensure_configured()
    material_text = material_text[:15000]

    blocks = []
    for c in concepts:
        already = existing_by_concept.get(c["id"], [])
        already_text = "\n".join(f"- {q}" for q in already) or "(none yet)"
        blocks.append(f'Concept "{c["name"]}" (concept_id: "{c["id"]}")\nAlready asked:\n{already_text}')
    concept_text = "\n\n".join(blocks)

    model = genai.GenerativeModel(MODEL, system_instruction=DRILL_SYSTEM_PROMPT)
    response = model.generate_content(
        f"Study material:\n\n{material_text}\n\nConcepts to drill:\n\n{concept_text}\n\n"
        "Generate the drill questions as specified.",
        generation_config={
            "response_mime_type": "application/json",
            "max_output_tokens": 8192,
        },
    )

    data = json.loads(response.text)
    questions = data.get("questions")
    if not questions:
        raise ValueError("Model response missing questions")
    return questions
