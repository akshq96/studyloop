import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fetchNextQuestion, submitAnswer } from "./api";
import { playCorrect, playStreak, playWrong } from "./sound";
import DifficultyCurve from "./DifficultyCurve";

const DIFFICULTY_LABEL = { 1: "Easy", 2: "Medium", 3: "Hard" };
const LETTERS = ["A", "B", "C", "D"];
const STREAK_MILESTONES = new Set([3, 5, 8, 12, 16, 20]);

function streakEmoji(streak) {
  if (streak >= 8) return "🌟";
  if (streak >= 5) return "⚡";
  return "🔥";
}

export default function QuizScreen({ sessionId, concepts, totalRounds, onDone, onExit }) {
  const [question, setQuestion] = useState(null);
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [mastery, setMastery] = useState(
    Object.fromEntries(concepts.map((c) => [c.id, 50]))
  );
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [xpPopup, setXpPopup] = useState(null);
  const [difficultyHistory, setDifficultyHistory] = useState([]);
  const [confirmExit, setConfirmExit] = useState(false);

  async function loadNext() {
    setLoading(true);
    setSelected(null);
    setFeedback(null);
    const data = await fetchNextQuestion(sessionId);
    if (data.done) {
      onDone();
      return;
    }
    setQuestion(data.question);
    setRound(data.round);
    setLoading(false);
  }

  useEffect(() => {
    loadNext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!xpPopup) return;
    const t = setTimeout(() => setXpPopup(null), 900);
    return () => clearTimeout(t);
  }, [xpPopup]);

  async function handleAnswer(index) {
    if (feedback) return;
    setSelected(index);
    const result = await submitAnswer(sessionId, question.id, index);
    setFeedback(result);
    setMastery((m) => ({ ...m, [result.concept_id]: result.concept_mastery }));

    const newStreak = result.correct ? streak + 1 : 0;
    setStreak(newStreak);
    setDifficultyHistory((h) => [...h, { difficulty: question.difficulty, correct: result.correct }]);

    if (result.correct) {
      const gained = 10 + question.difficulty * 5 + Math.min(newStreak, 10) * 2;
      setXp((x) => x + gained);
      setXpPopup({ id: Date.now(), amount: gained });
      playCorrect();
      if (STREAK_MILESTONES.has(newStreak)) playStreak();
    } else {
      playWrong();
    }
  }

  const exitOverlay = (
    <AnimatePresence>
      {confirmExit && (
        <motion.div
          className="exit-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={() => setConfirmExit(false)}
        >
          <motion.div
            className="card exit-dialog"
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Exit this quiz?</h3>
            <p>Your progress on this attempt will be lost.</p>
            <div className="exit-dialog-actions">
              <button
                type="button"
                className="ghost-button"
                onClick={() => setConfirmExit(false)}
              >
                Keep going
              </button>
              <button type="button" className="exit-confirm-button" onClick={onExit}>
                Exit quiz
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (loading || !question) {
    return (
      <div className="screen quiz-layout">
        <div className="quiz-main">
          <button type="button" className="exit-button" onClick={() => setConfirmExit(true)}>
            ✕ Exit quiz
          </button>
          <div className="loading-text">
            <span className="spinner" />
            Loading next question…
          </div>
        </div>
        {exitOverlay}
      </div>
    );
  }

  const conceptName =
    concepts.find((c) => c.id === question.concept_id)?.name ?? "";
  const progressPct = Math.round(((round - 1) / totalRounds) * 100);

  return (
    <div className="screen quiz-layout">
      <aside className="mastery-panel card">
        <div className="xp-row">
          <span className="xp-badge">⭐ {xp} XP</span>
        </div>
        <h3>
          <span className="live-dot" />
          Live mastery
        </h3>
        {concepts.map((c) => (
          <div key={c.id} className="mastery-row">
            <div className="mastery-label">{c.name}</div>
            <div className="mastery-bar-track">
              <div
                className="mastery-bar-fill"
                style={{ width: `${mastery[c.id]}%` }}
              />
            </div>
          </div>
        ))}
      </aside>

      <div className="quiz-main">
        <div className="quiz-toolbar">
          <button type="button" className="exit-button" onClick={() => setConfirmExit(true)}>
            ✕ Exit quiz
          </button>
        </div>

        <div className="progress-row">
          <span className="round-label">
            {round} / {totalRounds}
          </span>
          <div className="progress-track">
            <div className="progress-track-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="streak-slot">
            <AnimatePresence>
              {xpPopup && (
                <motion.span
                  key={xpPopup.id}
                  className="xp-popup"
                  initial={{ opacity: 0, y: 0, scale: 0.8 }}
                  animate={{ opacity: 1, y: -26, scale: 1.1 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  +{xpPopup.amount}
                </motion.span>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {streak >= 2 && (
                <motion.span
                  key={streak}
                  className={`streak-badge ${STREAK_MILESTONES.has(streak) ? "streak-milestone" : ""}`}
                  initial={{ scale: 0.4, opacity: 0, rotate: -8 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 12 }}
                >
                  {streakEmoji(streak)} {streak}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <span className={`difficulty-pill difficulty-${question.difficulty}`}>
            {DIFFICULTY_LABEL[question.difficulty]}
          </span>
        </div>

        {difficultyHistory.length > 0 && <DifficultyCurve history={difficultyHistory} />}

        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <motion.div
              className="card question-card"
              animate={feedback && !feedback.correct ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              <div className="concept-tag">{conceptName}</div>
              <h2 className="question-text">{question.question}</h2>

              <div className="choices">
                {question.choices.map((choice, i) => {
                  let cls = "choice";
                  if (feedback) {
                    if (i === feedback.correct_index) cls += " choice-correct";
                    else if (i === selected) cls += " choice-wrong";
                  } else if (i === selected) {
                    cls += " choice-selected";
                  }
                  return (
                    <button
                      key={i}
                      className={cls}
                      disabled={!!feedback}
                      onClick={() => handleAnswer(i)}
                    >
                      <span className="choice-letter">{LETTERS[i]}</span>
                      {choice}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`card feedback ${feedback.correct ? "feedback-good" : "feedback-bad"}`}
              >
                <div className="feedback-heading">
                  {feedback.correct ? "✓ Correct!" : "✕ Not quite."}
                </div>
                <p>{feedback.explanation}</p>
                <p className="snippet">"{feedback.source_snippet}"</p>
                <button className="next-button" onClick={loadNext}>
                  Next question →
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      {exitOverlay}
    </div>
  );
}
