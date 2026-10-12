import { PARTY_COLORS } from './colors'

/**
 * Cappellino a cono con il pompon, in alto a destra del posto e inclinato come quello di
 * Babbo Natale: lascia libere stellina, matita e badge del torneo. Uno diverso per posto.
 */
export default function PartyHat({ index }: { index: number }) {
  const color = PARTY_COLORS[index % PARTY_COLORS.length]
  const pompom = PARTY_COLORS[(index + 2) % PARTY_COLORS.length]

  return (
    <svg
      viewBox="0 0 40 50"
      className="pointer-events-none absolute -top-[44%] -right-[16%] z-1 w-[50%] rotate-[24deg] drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]"
      aria-hidden="true"
    >
      <path d="M4 44L20 8l16 36z" fill={color} />
      <path d="M20 8l16 36H26z" fill="#000" opacity="0.14" />
      {[
        [17, 22],
        [23, 30],
        [13, 35],
        [27, 39],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2" fill="#fff" opacity="0.9" />
      ))}
      <path d="M2 44q4.5-4 9 0t9 0 9 0 9 0" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="20" cy="7" r="5" fill={pompom} />
      <circle cx="18.4" cy="5.4" r="1.6" fill="#fff" opacity="0.7" />
    </svg>
  )
}
