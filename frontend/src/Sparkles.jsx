import { motion } from "framer-motion";

function random(min, max) {
  return Math.random() * (max - min) + min;
}

export default function Sparkles({ count = 10 }) {
  const bits = Array.from({ length: count }, (_, i) => ({
    id: i,
    angle: (360 / count) * i + random(-12, 12),
    distance: random(38, 74),
    size: random(3, 7),
    delay: random(0, 0.12),
  }));

  return (
    <div className="sparkle-burst" aria-hidden="true">
      {bits.map((b) => {
        const rad = (b.angle * Math.PI) / 180;
        const x = Math.cos(rad) * b.distance;
        const y = Math.sin(rad) * b.distance;
        return (
          <motion.span
            key={b.id}
            className="sparkle-bit"
            style={{ width: b.size, height: b.size }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
            animate={{ x, y, opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.7, delay: b.delay, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}
