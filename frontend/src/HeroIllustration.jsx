export default function HeroIllustration() {
  return (
    <div className="hero-illustration" aria-hidden="true">
      <div className="illus-glow" />
      <svg viewBox="0 0 420 420" className="illus-svg">
        <defs>
          <linearGradient id="loopGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--coral)" />
            <stop offset="100%" stopColor="var(--highlighter)" />
          </linearGradient>
          <filter id="loopBlur" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* dashed orbit ring */}
        <circle
          cx="210"
          cy="190"
          r="150"
          className="illus-ring"
          fill="none"
          stroke="var(--line-strong)"
          strokeWidth="1.5"
          strokeDasharray="3 9"
        />

        {/* floating quiz notepad */}
        <g className="illus-float-1">
          <rect x="36" y="52" width="98" height="118" rx="16" fill="var(--glass-strong)" stroke="var(--line-strong)" strokeWidth="1.5" />
          <rect x="52" y="76" width="58" height="6" rx="3" fill="var(--line-strong)" />
          <rect x="52" y="92" width="66" height="6" rx="3" fill="var(--line-strong)" />
          <rect x="52" y="108" width="44" height="6" rx="3" fill="var(--line-strong)" />
          <circle cx="112" cy="150" r="15" fill="var(--mint)" />
          <path d="M105 150l5 5 10-11" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* "?" thought bubble */}
        <g className="illus-float-2">
          <circle cx="330" cy="150" r="20" fill="var(--glass-strong)" stroke="var(--line-strong)" strokeWidth="1.5" />
          <text x="330" y="158" textAnchor="middle" fontFamily="var(--display-font)" fontWeight="600" fontSize="20" fill="var(--coral-deep)">?</text>
        </g>

        {/* desk lamp */}
        <ellipse cx="345" cy="118" rx="42" ry="52" fill="var(--highlighter)" opacity="0.22" className="illus-lamp-glow" />
        <path d="M292 168 Q316 108 356 92" fill="none" stroke="var(--ink-soft)" strokeWidth="4" strokeLinecap="round" />
        <path d="M340 76 L374 76 L382 108 L332 108 Z" fill="var(--ink-soft)" />
        <ellipse cx="292" cy="172" rx="20" ry="6" fill="var(--ink-soft)" />

        {/* pedestal shadow */}
        <ellipse cx="200" cy="330" rx="112" ry="14" fill="var(--ink)" opacity="0.08" />

        {/* book stack */}
        <g className="illus-float-3">
          <rect x="108" y="298" width="184" height="28" rx="7" fill="var(--coral)" transform="rotate(-2 200 312)" />
          <rect x="120" y="272" width="160" height="26" rx="7" fill="var(--mint)" transform="rotate(1.5 200 285)" />
          <rect x="134" y="248" width="132" height="24" rx="7" fill="var(--highlighter)" transform="rotate(-1 200 260)" />
        </g>

        {/* glowing infinity loop */}
        <g className="illus-float-4" filter="url(#loopBlur)">
          <path
            d="M148 232c-16 0-29-13-29-27s13-27 29-27c20 0 26 40 47 40s29-13 29-27-13-27-29-27"
            fill="none"
            stroke="url(#loopGrad)"
            strokeWidth="9"
            strokeLinecap="round"
            transform="translate(18 -38) scale(1.15)"
          />
        </g>

        {/* plant */}
        <g className="illus-float-2">
          <path d="M52 356c0-18 26-18 26 0v14H52z" fill="var(--coral-deep)" />
          <path d="M65 356c0-22-22-30-22-30s-4 24 22 30Z" fill="var(--mint)" />
          <path d="M65 356c0-26 24-32 24-32s6 26-24 32Z" fill="var(--mint-tint)" />
        </g>

        {/* sparkles */}
        <g fill="var(--highlighter)">
          <path className="illus-spark" d="M368 210l2.4 6.6 6.6 2.4-6.6 2.4-2.4 6.6-2.4-6.6-6.6-2.4 6.6-2.4z" />
          <path className="illus-spark illus-spark-b" d="M76 220l1.8 5 5 1.8-5 1.8-1.8 5-1.8-5-5-1.8 5-1.8z" />
        </g>
      </svg>
    </div>
  );
}
