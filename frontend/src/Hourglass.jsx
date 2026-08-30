const SAND_COLOR = {
  "": "#ffc93c",
  "timer-warn": "#f0a63c",
  "timer-danger": "#ff6a52",
};

export default function Hourglass({ pct, urgency, paused, seconds }) {
  const frac = Math.max(0, Math.min(1, pct / 100));
  const topH = 26 * frac;
  const topY = 10 + (26 - topH);
  const bottomH = 26 * (1 - frac);
  const sand = SAND_COLOR[urgency] || SAND_COLOR[""];

  return (
    <div className={`hourglass-wrap ${urgency}`} title={`${seconds}s left`}>
      <svg viewBox="0 0 64 80" className="hourglass-svg">
        <defs>
          <clipPath id="hg-top">
            <path d="M14 10 L50 10 L35 38 L29 38 Z" />
          </clipPath>
          <clipPath id="hg-bottom">
            <path d="M29 42 L35 42 L50 70 L14 70 Z" />
          </clipPath>
        </defs>

        {/* glass frame */}
        <path
          d="M10 6 H54 M10 74 H54 M14 10 L50 10 L35 38 L35 42 L50 70 L14 70 L29 42 L29 38 Z"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* draining sand (top) */}
        <rect x="10" y={topY} width="44" height={topH} fill={sand} clipPath="url(#hg-top)" />

        {/* collected sand (bottom) */}
        <rect x="10" y={70 - bottomH} width="44" height={bottomH} fill={sand} clipPath="url(#hg-bottom)" />

        {/* falling stream */}
        {!paused && frac > 0.02 && (
          <g className="hourglass-stream">
            <circle cx="32" cy="39" r="1.1" fill={sand} />
            <circle cx="32" cy="42" r="1.1" fill={sand} />
          </g>
        )}
      </svg>
    </div>
  );
}
