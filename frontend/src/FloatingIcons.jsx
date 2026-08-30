const ICONS = [
  {
    key: "book",
    style: { left: "5%", top: "22%" },
    float: "float-a",
    duration: "9s",
    delay: "0s",
    svg: (
      <path d="M4 5.5C4 4.7 4.7 4 5.5 4H11a1 1 0 0 1 1 1v15a1 1 0 0 0-1-1H5.5A1.5 1.5 0 0 1 4 17.5v-12ZM20 5.5c0-.8-.7-1.5-1.5-1.5H13a1 1 0 0 0-1 1v15a1 1 0 0 1 1-1h5.5a1.5 1.5 0 0 0 1.5-1.5v-12Z" />
    ),
  },
  {
    key: "star",
    style: { right: "6%", top: "16%" },
    float: "float-b",
    duration: "7.5s",
    delay: "1.2s",
    svg: (
      <path d="M12 3.5l2.35 5.36 5.82.55-4.4 3.86 1.33 5.73L12 15.9l-5.1 3.1 1.33-5.73-4.4-3.86 5.82-.55L12 3.5Z" />
    ),
  },
  {
    key: "bulb",
    style: { right: "3%", bottom: "26%" },
    float: "float-a",
    duration: "8.5s",
    delay: "2.4s",
    svg: (
      <>
        <path d="M9 18h6M10 21h4" />
        <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.45 1 1.18 1 1.95V16h5v-.15c0-.77.4-1.5 1-1.95A6 6 0 0 0 12 3Z" />
      </>
    ),
  },
  {
    key: "quest",
    style: { left: "4%", bottom: "18%" },
    float: "float-b",
    duration: "10s",
    delay: "0.6s",
    svg: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9.3a2.5 2.5 0 0 1 4.9.7c0 1.7-2.4 2-2.4 3.5" />
        <circle cx="12" cy="16.3" r="0.6" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    key: "spark",
    style: { left: "50%", top: "6%" },
    float: "float-a",
    duration: "11s",
    delay: "1.8s",
    svg: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />,
  },
];

export default function FloatingIcons() {
  return (
    <div className="floating-icons" aria-hidden="true">
      {ICONS.map((icon) => (
        <span
          key={icon.key}
          className={`floating-icon ${icon.float}`}
          style={{ ...icon.style, animationDuration: icon.duration, animationDelay: icon.delay }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            {icon.svg}
          </svg>
        </span>
      ))}
    </div>
  );
}
