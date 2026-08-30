export default function Mascot() {
  return (
    <div className="mascot" aria-hidden="true">
      <span className="mascot-orbit" />
      <svg viewBox="0 0 64 64" className="mascot-glyph">
        <path
          d="M20 40c-5 0-9-4-9-8s4-8 9-8c6 0 8 12 14 12s9-4 9-8-4-8-9-8"
          fill="none"
          stroke="var(--coral)"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
