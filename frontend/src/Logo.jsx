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
        {/* brain silhouette */}
        <path
          d="M32 12c-3-3-8-3-10 1-4-1-7 2-6 6-4 2-4 7 0 9-1 4 2 7 6 6 1 4 6 5 10 2 4 3 9 2 10-2 4 1 7-2 6-6 4-2 4-7 0-9 1-4-2-7-6-6-2-4-7-4-10-1Z"
          fill="none"
          stroke="rgba(244, 238, 221, 0.55)"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M32 12c-1 6 2 6 1 12-1 6 2 6 1 12-1 6 2 6 1 8"
          fill="none"
          stroke="rgba(244, 238, 221, 0.55)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        {/* loop threading through it */}
        <path
          d="M17 33c-4 0-7-3-7-6s3-6 7-6c5 0 6 9 11 9s7-3 7-6-3-6-7-6"
          fill="none"
          stroke="url(#logoGrad)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
      </svg>
      <span className="logo-word">
        Study<span className="logo-word-accent">Loop</span>
      </span>
    </div>
  );
}
