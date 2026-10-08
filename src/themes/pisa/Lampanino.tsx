/**
 * Un lampanino della Luminara appoggiato in alto a destra del posto: bicchierino di
 * vetro e fiammella che tremola. Lascia libere stellina, matita e badge del torneo.
 */
export default function Lampanino() {
  return (
    <svg
      viewBox="0 0 20 26"
      className="pointer-events-none absolute -top-[20%] -right-[8%] z-1 w-[32%] drop-shadow-[0_0_4px_rgba(255,180,70,0.85)]"
      aria-hidden="true"
    >
      <ellipse cx="10" cy="11" rx="5" ry="6.5" fill="#ffb23e" opacity="0.35" />
      <path
        d="M10 3c2.2 3 3.4 5.2 3.4 7.4A3.4 3.4 0 0 1 6.6 10.4C6.6 8.2 7.8 6 10 3z"
        fill="#ffd27a"
        className="origin-[50%_90%] animate-flame motion-reduce:animate-none [transform-box:fill-box]"
      />
      <path d="M4 14h12l-1.6 10H5.6z" fill="#f6efe0" opacity="0.88" />
      <path d="M5.2 16.5h9.6" stroke="#ffcf6e" strokeWidth="1.4" opacity="0.8" />
    </svg>
  )
}
