export default function Squiggle({ color = "#E2723F", width = 260 }) {
  return (
    <svg
      className="squiggle"
      viewBox="0 0 260 20"
      width={width}
      height={(20 / 260) * width}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M2 14 C 30 4, 50 4, 68 12 S 108 20, 132 10 S 172 2, 196 11 S 236 18, 258 8"
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}
