/**
 * La corona di chi compie gli anni, al posto del cappellino: d'oro con le gemme e un
 * luccichio, nello stesso angolo per non coprire stellina, matita e badge.
 */
export default function Crown() {
  return (
    <svg
      viewBox="0 0 48 40"
      className="pointer-events-none absolute -top-[40%] -right-[22%] z-1 w-[62%] rotate-[18deg] drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]"
      aria-hidden="true"
    >
      <path d="M5 33L3 11l11 9 10-15 10 15 11-9-2 22z" fill="#ffd23f" stroke="#a8701a" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M5 33h38v5H5z" fill="#f2b81f" stroke="#a8701a" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="3" cy="10" r="2.6" fill="#ff6fa5" />
      <circle cx="24" cy="4" r="2.8" fill="#2ec4b6" />
      <circle cx="45" cy="10" r="2.6" fill="#ff6fa5" />
      <circle cx="14" cy="28" r="2.4" fill="#2ec4b6" />
      <path d="M24 24l3 4-3 4-3-4z" fill="#ff6fa5" />
      <circle cx="34" cy="28" r="2.4" fill="#2ec4b6" />
      <path
        className="origin-[40px_6px] animate-twinkle motion-reduce:animate-none"
        d="M40 1l1.2 3.8L45 6l-3.8 1.2L40 11l-1.2-3.8L35 6l3.8-1.2z"
        fill="#fff"
      />
    </svg>
  )
}
