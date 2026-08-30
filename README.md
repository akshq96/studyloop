# StudyLoop

**Upload your notes. Get a quiz that actually adapts to you.**

StudyLoop turns any block of study material — pasted text, a PDF, lecture notes —
into a diagnostic quiz that gets harder on what you know and easier on what you
don't, question by question, live. Every question is grounded in a verbatim
quote from your own material, so explanations point back to the exact line you
need to review, not a generic textbook answer.

Built for the SPEED September AI Challenge.

## Features

- **Adaptive difficulty engine** — per-concept mastery tracking that shifts
  question difficulty (Easy → Medium → Hard) after every answer, visualized
  live as a difficulty curve during the quiz
- **Source-grounded generation** — every question carries a verbatim quote
  from your notes; wrong answers show you exactly where the answer lives in
  your own material
- **Drill your weak spots** — one click regenerates a focused mini-quiz on
  just the concepts you're struggling with, with genuinely new questions
  (not repeats of what you've already seen)
- **Gamification** — XP with per-question point popups, streak badges that
  escalate through tiers, confetti on a strong finish, and
  Web Audio sound effects (no external audio files)
- **Configurable runs** — pick quiz length (Quick / Standard / Deep) and
  starting difficulty before you begin
- **Sample content** — one click loads a random sample across Biology,
  History, Computer Science, or Psychology, so you can try it instantly
  without your own notes
- **Downloadable study guide** — export a plain-text summary of your
  mastery, weak spots, and key passages to review later
- **Exit anytime** — a dedicated exit control with an in-app confirmation,
  no lost progress by accident

## How it works

1. **Upload** — paste text or upload a PDF/txt file of study material.
2. **One Gemini call** extracts 4–5 key concepts and generates a bank of
   multiple-choice questions across three difficulty levels per concept,
   each grounded in a verbatim quote from your material, with the correct
   answer's position shuffled to remove any model bias.
3. **Adaptive quiz** — every answer updates a per-concept mastery score and
   difficulty level: get a concept right and the next question on it gets
   harder; get it wrong and the next one gets easier, plus you see the exact
   line from your notes it came from.
4. **Results** — a mastery ring per concept, your original notes rendered
   with the paragraphs you struggled with highlighted in place, and an
   optional drill round or study-guide export.

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React (Vite), Framer Motion |
| Backend | FastAPI (Python) |
| AI | Google Gemini (`google-generativeai`) |
| State | In-memory per-session (no database) |

## Getting started

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # then fill in GEMINI_API_KEY (get one free at aistudio.google.com/apikey)
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

## Project structure

```
backend/
  main.py        # FastAPI app: upload, quiz/next, quiz/answer, quiz/drill, results
  ai.py          # Gemini prompts + calls (generation, drill regeneration)
frontend/
  src/
    UploadScreen.jsx     # upload form, sample picker, length/difficulty controls
    QuizScreen.jsx        # adaptive quiz, XP/streak/curve, exit flow
    ResultsScreen.jsx     # mastery rings, weak-spot highlighting, drill/export
    DifficultyCurve.jsx   # live SVG chart of difficulty over the quiz
    Confetti.jsx           sound.js   # celebratory/feedback effects
```

## Design notes

- No database — everything lives in an in-memory session dict on the
  backend, which is fine for a single session and keeps the stack simple.
- The concept + question bank is generated in a **single** upfront Gemini
  call rather than calling the model live on every answer. This keeps the
  quiz itself fast and deterministic (no mid-quiz latency or JSON-parsing
  risk during a live demo) while still adapting in real time from the
  student's perspective, since the next question shown genuinely changes
  based on their last answer.
- Every question carries a `source_snippet` quoted verbatim from the
  uploaded material. This is used both as the "why" explanation after a
  wrong answer and to highlight weak spots directly on the original notes
  in the results view.
- "Drill your weak spots" makes a second, smaller Gemini call scoped only
  to the weak concepts, explicitly told what's already been asked, so the
  regenerated questions are new rather than recycled.
