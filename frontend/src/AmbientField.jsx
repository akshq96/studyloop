const SPARKS = [
  { x: 8, y: 14, delay: 0, size: 3 },
  { x: 18, y: 62, delay: 1.4, size: 2 },
  { x: 27, y: 30, delay: 2.8, size: 2 },
  { x: 40, y: 80, delay: 0.6, size: 3 },
  { x: 62, y: 18, delay: 2.1, size: 2 },
  { x: 72, y: 55, delay: 3.4, size: 3 },
  { x: 85, y: 12, delay: 1.1, size: 2 },
  { x: 91, y: 70, delay: 2.6, size: 2 },
  { x: 52, y: 45, delay: 0.2, size: 2 },
  { x: 12, y: 90, delay: 1.8, size: 2 },
];

export default function AmbientField() {
  return (
    <div className="ambient-field" aria-hidden="true">
      <div className="ink-blob ink-blob-1" />
      <div className="ink-blob ink-blob-2" />
      <div className="ink-blob ink-blob-3" />
      {SPARKS.map((s, i) => (
        <span
          key={i}
          className="ambient-spark"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
