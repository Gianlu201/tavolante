const RADIUS = 106
const SEGMENT = (2 * Math.PI * RADIUS) / 8

/** Attorno al tavolo un salvagente a spicchi bianchi e rossi, con la sua corda. */
export default function LifeRing() {
  return (
    <svg
      viewBox="-120 -120 240 240"
      className="pointer-events-none absolute -inset-[10%] z-1 overflow-visible drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)]"
      aria-hidden="true"
    >
      <circle r={RADIUS} fill="none" stroke="#f6f3ee" strokeWidth="13" />
      <circle
        r={RADIUS}
        fill="none"
        stroke="#e3473f"
        strokeWidth="13"
        strokeDasharray={`${SEGMENT} ${SEGMENT}`}
        transform="rotate(-11)"
      />
      <circle r={RADIUS - 6.5} fill="none" stroke="#000" strokeOpacity="0.18" strokeWidth="1" />
      <circle r={RADIUS + 6.5} fill="none" stroke="#000" strokeOpacity="0.18" strokeWidth="1" />
      <circle r={RADIUS - 2.5} fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="1.6" strokeDasharray="22 40" />
      <circle r={RADIUS} fill="none" stroke="#e8d7b0" strokeWidth="1.3" strokeDasharray="5 2" />
      {[45, 135, 225, 315].map((deg) => (
        <rect
          key={deg}
          x={RADIUS - 8}
          y="-2.2"
          width="16"
          height="4.4"
          rx="2"
          fill="#e8d7b0"
          stroke="#b89b62"
          strokeWidth="0.6"
          transform={`rotate(${deg})`}
        />
      ))}
    </svg>
  )
}
