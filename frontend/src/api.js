const BASE_URL = "http://localhost:8000";

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed (${res.status})`);
  }
  return res.json();
}

export async function uploadMaterial({ file, text, roundsPerConcept, startLevel }) {
  const form = new FormData();
  if (file) form.append("file", file);
  if (text) form.append("text", text);
  if (roundsPerConcept) form.append("rounds_per_concept", String(roundsPerConcept));
  if (startLevel) form.append("start_level", String(startLevel));
  const res = await fetch(`${BASE_URL}/api/upload`, { method: "POST", body: form });
  return handle(res);
}

export async function fetchNextQuestion(sessionId) {
  const res = await fetch(`${BASE_URL}/api/quiz/next`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId }),
  });
  return handle(res);
}

export async function submitAnswer(sessionId, questionId, selectedIndex) {
  const res = await fetch(`${BASE_URL}/api/quiz/answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: sessionId,
      question_id: questionId,
      selected_index: selectedIndex,
    }),
  });
  return handle(res);
}

export async function drillWeakSpots(sessionId) {
  const res = await fetch(`${BASE_URL}/api/quiz/drill`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId }),
  });
  return handle(res);
}

export async function fetchResults(sessionId) {
  const res = await fetch(`${BASE_URL}/api/results/${sessionId}`);
  return handle(res);
}
