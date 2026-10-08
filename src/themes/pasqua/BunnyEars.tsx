/**
 * Orecchie da coniglio che spuntano da dietro il posto: stanno sotto l'avatar, così
 * sembrano davvero sue, e lasciano in mezzo lo spazio per la stellina del vincitore.
 * La destra ogni tanto si piega.
 */
export default function BunnyEars() {
  return (
    <svg
      viewBox="0 0 60 44"
      className="pointer-events-none absolute -top-[56%] left-1/2 -z-1 w-[92%] -translate-x-1/2 overflow-visible"
      aria-hidden="true"
    >
      <g transform="rotate(-16 16 42)">
        <ellipse cx="16" cy="22" rx="7.5" ry="20" fill="#f7f3ee" stroke="#d9cfc4" strokeWidth="1" />
        <ellipse cx="16" cy="24" rx="3.6" ry="14" fill="#f6b3c8" />
      </g>
      <g className="origin-[44px_42px] animate-ear-flop motion-reduce:animate-none">
        <g transform="rotate(16 44 42)">
          <ellipse cx="44" cy="22" rx="7.5" ry="20" fill="#f7f3ee" stroke="#d9cfc4" strokeWidth="1" />
          <ellipse cx="44" cy="24" rx="3.6" ry="14" fill="#f6b3c8" />
        </g>
      </g>
    </svg>
  )
}
