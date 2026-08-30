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
        {/* neurons + synapses inside each lobe read as brain cells within the loop */}
        <g stroke="#2B2A24" strokeWidth="1.1" strokeLinecap="round" opacity="0.5">
          <path d="M15 23 22 27M15 41 22 37M22 27 22 37M15 23 15 41" fill="none" />
          <path d="M49 23 42 27M49 41 42 37M42 27 42 37M49 23 49 41" fill="none" />
        </g>
        <g fill="#2B2A24" opacity="0.75">
          <circle cx="15" cy="23" r="1.6" />
          <circle cx="22" cy="27" r="1.6" />
          <circle cx="22" cy="37" r="1.6" />
          <circle cx="15" cy="41" r="1.6" />
          <circle cx="49" cy="23" r="1.6" />
          <circle cx="42" cy="27" r="1.6" />
          <circle cx="42" cy="37" r="1.6" />
          <circle cx="49" cy="41" r="1.6" />
        </g>
      </svg>
      <span className="logo-word">
        Study<span className="logo-word-accent">Loop</span>
      </span>
    </div>
  );
}
