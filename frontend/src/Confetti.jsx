import { motion } from "framer-motion";

const COLORS = ["#E2723F", "#E9AC3F", "#6F9668", "#2B2A24"];

function random(min, max) {
  return Math.random() * (max - min) + min;
}

export default function Confetti({ count = 28 }) {
  const pieces = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: random(0, 100),
    color: COLORS[i % COLORS.length],
    delay: random(0, 0.25),
    duration: random(1.1, 1.7),
    rotate: random(-180, 180),
    drift: random(-40, 40),
    size: random(6, 11),
  }));

  return (
    <div className="confetti-layer" aria-hidden="true">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.4,
            background: p.color,
          }}
          initial={{ y: -20, x: 0, opacity: 1, rotate: 0 }}
          animate={{ y: 340, x: p.drift, opacity: 0, rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}
