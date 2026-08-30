export default function Logo() {
  return (
    <div className="logo">
      <svg viewBox="0 0 64 64" className="logo-mark" aria-hidden="true">
        <rect width="64" height="64" rx="14" fill="#1c1a17" />
        <path
          d="M20 40c-5 0-9-4-9-8s4-8 9-8c6 0 8 12 14 12s9-4 9-8-4-8-9-8"
          fill="none"
          stroke="#ff5a36"
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
