export default function Logo() {
  return (
    <div className="logo">
      <svg viewBox="0 0 64 64" className="logo-mark" aria-hidden="true">
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E2723F" />
            <stop offset="100%" stopColor="#E9AC3F" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="16" fill="#2B2A24" />
        {/* the two lobes double as an infinity loop and a pair of brain hemispheres */}
        <path
          d="M32 27C27 20 24 16 22 15 15 13 9 20 9 32 9 44 15 51 22 49 27 48 30 42 32 37 34 42 37 48 42 49 49 51 55 44 55 32 55 20 49 13 42 15 37 16 34 20 32 27Z"
          fill="url(#logoGrad)"
        />
        {/* faint fold lines hint at brain texture without competing with the loop */}
        <path
          d="M16 26c3 2 3 9 0 12M48 26c-3 2-3 9 0 12"
          fill="none"
          stroke="#2B2A24"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.32"
        />
      </svg>
      <span className="logo-word">
        Study<span className="logo-word-accent">Loop</span>
      </span>
    </div>
  );
}
