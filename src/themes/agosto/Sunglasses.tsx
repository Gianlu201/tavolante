/** Occhiali da sole appoggiati sulla testa, in alto a destra del posto. */
export default function Sunglasses() {
  return (
    <svg
      viewBox="0 0 52 22"
      className="pointer-events-none absolute -top-[14%] -right-[26%] z-1 w-[66%] rotate-[-18deg] drop-shadow-[0_2px_2px_rgba(0,0,0,0.45)]"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sunglasses-lens" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3a6d8c" />
          <stop offset="0.5" stopColor="#14202e" />
          <stop offset="1" stopColor="#0a0f17" />
        </linearGradient>
      </defs>
      <path d="M2 6h48" stroke="#f2c230" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M4 6h18c0 8-3 13-9 13S4 14 4 6zM30 6h18c0 8-3 13-9 13s-9-5-9-13z" fill="url(#sunglasses-lens)" stroke="#f2c230" strokeWidth="1.8" />
      <path d="M22 8q4-3 8 0" fill="none" stroke="#f2c230" strokeWidth="1.8" />
      <path d="M8 9l5 0M34 9l5 0" stroke="#fff" strokeOpacity="0.6" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}
