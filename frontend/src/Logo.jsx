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
        <path
          d="M20 40c-5 0-9-4-9-8s4-8 9-8c6 0 8 12 14 12s9-4 9-8-4-8-9-8"
          fill="none"
          stroke="url(#logoGrad)"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
      <span className="logo-word">
        Study<span className="logo-word-accent">Loop</span>
      </span>
    </div>
  );
}
