import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { drillWeakSpots, fetchResults } from "./api";
import MasteryRing from "./MasteryRing";
import Confetti from "./Confetti";
import { playFinish } from "./sound";

function highlightText(materialText, weakSnippets) {
  if (!weakSnippets.length) return [materialText];

  const snippets = [...new Set(weakSnippets.map((w) => w.snippet))].filter(
    (s) => s && materialText.includes(s)
  );
  if (!snippets.length) return [materialText];

  const pattern = snippets
    .map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  const regex = new RegExp(`(${pattern})`, "g");
  return materialText.split(regex).map((chunk, i) =>
    snippets.includes(chunk) ? (
      <mark key={i} className="weak-highlight">
        {chunk}
      </mark>
    ) : (
      <span key={i}>{chunk}</span>
    )
  );
}

function buildStudyGuideText(results, overall) {
  const lines = [];
  lines.push("STUDYLOOP — STUDY GUIDE");
  lines.push(`Overall mastery: ${overall}%`);
  lines.push("");
  lines.push("CONCEPT BREAKDOWN");
  for (const c of results.concepts) {
    lines.push(`- ${c.name}: ${Math.round(c.mastery)}%${c.mastery < 60 ? "  (needs review)" : ""}`);
  }
  if (results.tips.length) {
    lines.push("");
    lines.push("FOCUS NEXT");
    for (const t of results.tips) lines.push(`- ${t}`);
  }
  if (results.weak_snippets.length) {
    lines.push("");
    lines.push("KEY PASSAGES TO REVIEW");
    const seen = new Set();
    for (const w of results.weak_snippets) {
      if (seen.has(w.snippet)) continue;
      seen.add(w.snippet);
      lines.push(`"${w.snippet}"`);
    }
  }
  return lines.join("\n");
}

function downloadStudyGuide(results, overall) {
  const text = buildStudyGuideText(results, overall);
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "studyloop-study-guide.txt";
  a.click();
  URL.revokeObjectURL(url);
}

export default function ResultsScreen({ sessionId, onRestart, onDrill }) {
  const [results, setResults] = useState(null);
  const [drilling, setDrilling] = useState(false);

  useEffect(() => {
    fetchResults(sessionId).then((data) => {
      setResults(data);
      const overall = Math.round(
        data.concepts.reduce((sum, c) => sum + c.mastery, 0) / data.concepts.length
      );
      if (overall >= 70) playFinish();
    });
  }, [sessionId]);

  if (!results) {
    return (
      <div className="screen">
        <div className="loading-text">
          <span className="spinner" />
          Crunching your results…
        </div>
      </div>
    );
  }

  const overall = Math.round(
    results.concepts.reduce((sum, c) => sum + c.mastery, 0) / results.concepts.length
  );
  const hasWeakSpots = results.concepts.some((c) => c.mastery < 60);

  async function handleDrill() {
    setDrilling(true);
    try {
      const data = await drillWeakSpots(sessionId);
      onDrill(data);
    } finally {
      setDrilling(false);
    }
  }

  return (
    <div className="screen results-layout">
      <div className="results-summary">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="card results-hero"
        >
          {overall >= 70 && <Confetti />}
          <h1>
            <span className="accent-word">{overall}%</span> overall mastery
          </h1>
          <p>Here's how you did across every concept in your notes.</p>
        </motion.div>

        <div className="card rings-grid">
          {results.concepts.map((c, i) => (
            <motion.div
              key={c.id}
              className="ring-cell"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
            >
              <MasteryRing value={c.mastery} size={84} stroke={8} />
              <div className="ring-cell-name">{c.name}</div>
            </motion.div>
          ))}
        </div>

        {results.tips.length > 0 && (
          <div className="card tips">
            <h3>Focus your next study session on</h3>
            <ul>
              {results.tips.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="results-actions">
          {hasWeakSpots && (
            <button className="btn-primary" onClick={handleDrill} disabled={drilling}>
              {drilling ? "Building drill…" : "Drill your weak spots →"}
            </button>
          )}
          <button className="next-button" onClick={() => downloadStudyGuide(results, overall)}>
            Download study guide
          </button>
          <button className="ghost-button" onClick={onRestart}>
            Study something else
          </button>
        </div>
      </div>

      <div className="card results-document">
        <h3>Your notes — weak spots highlighted</h3>
        <div className="document-text">
          {highlightText(results.material_text, results.weak_snippets)}
        </div>
      </div>
    </div>
  );
}
