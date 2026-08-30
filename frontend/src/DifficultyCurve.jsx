import { motion } from "framer-motion";

const LEVEL_LABEL = { 1: "Easy", 2: "Medium", 3: "Hard" };
const COLORS = { 1: "#2f9e44", 2: "#d99a1b", 3: "#d62839" };

export default function DifficultyCurve({ history }) {
  if (history.length < 1) return null;

  const width = 100;
  const height = 34;
  const padX = 4;
  const padY = 6;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  const denom = Math.max(history.length - 1, 1);
  const points = history.map((h, i) => {
    const x = padX + (history.length === 1 ? innerW / 2 : (i / denom) * innerW);
    const y = padY + innerH - ((h.difficulty - 1) / 2) * innerH;
    return { x, y, correct: h.correct, difficulty: h.difficulty };
  });

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const last = points[points.length - 1];

  return (
    <div className="curve-card card">
      <div className="curve-header">
        <span>Difficulty curve</span>
        <span className="curve-current" style={{ color: COLORS[last.difficulty] }}>
          {LEVEL_LABEL[last.difficulty]}
        </span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="curve-svg" preserveAspectRatio="none">
        <line x1={padX} y1={padY} x2={width - padX} y2={padY} className="curve-gridline" />
        <line
          x1={padX}
          y1={padY + innerH / 2}
          x2={width - padX}
          y2={padY + innerH / 2}
          className="curve-gridline"
        />
        <line x1={padX} y1={padY + innerH} x2={width - padX} y2={padY + innerH} className="curve-gridline" />
        <motion.path
          d={path}
          fill="none"
          stroke="#ff5a36"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ d: path }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        {points.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={i === points.length - 1 ? 2.4 : 1.6}
            fill={p.correct ? "#2f9e44" : "#d62839"}
            stroke="#fffcf5"
            strokeWidth="0.6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          />
        ))}
      </svg>
    </div>
  );
}
