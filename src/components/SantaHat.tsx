/**
 * Cappellino di Babbo Natale appoggiato in alto a destra del posto, inclinato: lascia
 * libere la stellina del vincitore (in alto al centro), la matita (in basso a destra)
 * e i badge del torneo (in alto a sinistra). Le misure sono in % del posto.
 */
export default function SantaHat() {
  return (
    <svg
      viewBox="0 0 48 40"
      className="pointer-events-none absolute -top-[30%] -right-[21%] z-1 w-[64%] rotate-[28deg] drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]"
      aria-hidden="true"
    >
      <path
        d="M7 31C8 19 15 9 27 6c8-2 15 2 16 10-4-3-8-3-10 1-2 5 1 10 4 14z"
        fill="#c8262e"
      />
      <path
        d="M11 30c1-9 6-17 15-21"
        fill="none"
        stroke="#e8505a"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path d="M33 17c-2 5 1 10 4 14h-6c-1-5-1-10 2-14z" fill="#8f1219" />
      <rect x="3" y="27.5" width="38" height="9.5" rx="4.75" fill="#f6f2ea" />
      <circle cx="42.5" cy="16.5" r="5" fill="#f6f2ea" />
    </svg>
  )
}
