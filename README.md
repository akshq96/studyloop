# StudyLoop

Upload your notes, take an AI-generated diagnostic quiz, and watch the difficulty
adapt per concept in real time — then see exactly which parts of your own notes
you need to review, highlighted in place.

## How it works

1. **Upload** — paste text or upload a PDF/txt file of study material.
2. **One Gemini call** extracts 4-5 key concepts and generates a bank of
   multiple-choice questions at three difficulty levels per concept, each
   grounded in a verbatim quote from your material.
3. **Adaptive quiz** — every answer updates a per-concept mastery score and
   difficulty level: get a concept right and the next question on it gets
   harder, get it wrong and the next one gets easier plus you see the exact
   line from your notes it came from.
4. **Results** — a mastery bar per concept, and your original notes rendered
   with the paragraphs you struggled with highlighted directly in place.

## Run it

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

## Design notes

- No database — everything lives in an in-memory session dict on the backend,
  which is fine for a single demo/session and keeps the stack simple.
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
