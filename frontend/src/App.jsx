import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "./Logo";
import UploadScreen from "./UploadScreen";
import QuizScreen from "./QuizScreen";
import ResultsScreen from "./ResultsScreen";
import AmbientField from "./AmbientField";
import "./App.css";

const STEPS = [
  {
    label: "Upload",
    icon: (
      <path d="M12 16V4M12 4l-4 4M12 4l4 4M5 16v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" />
    ),
  },
  {
    label: "Quiz",
    icon: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />,
  },
  {
    label: "Results",
    icon: (
      <>
        <path d="M8 21h8M12 17v4" />
        <path d="M17 5V3H7v2M5 5h14v3a7 7 0 0 1-14 0V5Z" />
      </>
    ),
  },
];

export default function App() {
  const [stage, setStage] = useState("upload");
  const [session, setSession] = useState(null);

  function handleReady(data) {
    setSession(data);
    setStage("quiz");
  }

  function handleDone() {
    setStage("results");
  }

  function handleRestart() {
    setSession(null);
    setStage("upload");
  }

  function handleDrill(data) {
    setSession((prev) => ({ ...prev, concepts: data.concepts, total_rounds: data.total_rounds }));
    setStage("quiz");
  }

  const stageIndex = { upload: 0, quiz: 1, results: 2 }[stage];

  return (
    <div className="app">
      <AmbientField />
      <header className="app-header">
        <Logo />
        <nav className="nav-pills">
          {STEPS.map((step, i) => (
            <div
              key={step.label}
              className={`nav-pill ${i === stageIndex ? "nav-pill-active" : ""} ${i < stageIndex ? "nav-pill-done" : ""}`}
            >
              <svg viewBox="0 0 24 24" className="nav-pill-icon" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {step.icon}
              </svg>
              <span>{step.label}</span>
            </div>
          ))}
        </nav>
      </header>

      <div className="app-body">
        <AnimatePresence mode="wait">
          {stage === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              style={{ width: "100%", display: "flex", justifyContent: "center" }}
            >
              <UploadScreen onReady={handleReady} />
            </motion.div>
          )}
          {stage === "quiz" && session && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              style={{ width: "100%", display: "flex", justifyContent: "center" }}
            >
              <QuizScreen
                sessionId={session.session_id}
                concepts={session.concepts}
                totalRounds={session.total_rounds}
                onDone={handleDone}
                onExit={handleRestart}
              />
            </motion.div>
          )}
          {stage === "results" && session && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              style={{ width: "100%", display: "flex", justifyContent: "center" }}
            >
              <ResultsScreen
                sessionId={session.session_id}
                onRestart={handleRestart}
                onDrill={handleDrill}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
