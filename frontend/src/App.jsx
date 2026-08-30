import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "./Logo";
import UploadScreen from "./UploadScreen";
import QuizScreen from "./QuizScreen";
import ResultsScreen from "./ResultsScreen";
import "./App.css";

const STEPS = ["Upload", "Quiz", "Results"];

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
      <div className="ink-blob ink-blob-1" />
      <div className="ink-blob ink-blob-2" />
      <header className="app-header">
        <Logo />
        <div className="steps">
          {STEPS.map((label, i) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {i > 0 && <div className="step-line" />}
              <div className={`step ${i === stageIndex ? "active" : ""} ${i < stageIndex ? "done" : ""}`}>
                <span className="step-dot" />
                {label}
              </div>
            </div>
          ))}
        </div>
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
