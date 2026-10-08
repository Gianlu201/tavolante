import { scatter } from '../../lib/scatter'

const COLORS = ['#ffd23f', '#2ec4c4', '#e3408f', '#9bd93c', '#ff8c2e', '#8a5cf5', '#ffffff']

/** A curly streamer: a ribbon that winds along the rim between two angles. */
const streamer = (from: number, to: number, base: number, curls: number) => {
  const steps = 60
  const points = Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps
    const deg = from + (to - from) * t
    const rad = (deg * Math.PI) / 180
    const radius = base + 4.5 * Math.sin(t * curls * Math.PI * 2)
    return `${(radius * Math.cos(rad)).toFixed(2)} ${(radius * Math.sin(rad)).toFixed(2)}`
  })
  return `M${points.join('L')}`
}

const STREAMERS = Array.from({ length: 9 }, (_, i) => {
  const from = i * 40 + scatter(i, 71) * 12
  return {
    d: streamer(from, from + 55 + scatter(i, 72) * 25, 104 + scatter(i, 73) * 3, 5 + Math.round(scatter(i, 74) * 3)),
    color: COLORS[i % COLORS.length],
  }
})

const DOTS = Array.from({ length: 46 }, (_, i) => {
  const rad = scatter(i, 75) * Math.PI * 2
  const radius = 99 + scatter(i, 76) * 12
  return {
    x: radius * Math.cos(rad),
    y: radius * Math.sin(rad),
    color: COLORS[i % COLORS.length],
  }
})

/** Diamonds as on a harlequin's suit, barely visible on the felt. */
const DIAMONDS = (() => {
  const cells: { x: number; y: number; light: boolean }[] = []
  for (let row = -6; row <= 6; row++) {
    for (let col = -6; col <= 6; col++) {
      cells.push({ x: col * 18 + (row % 2 ? 9 : 0), y: row * 15, light: (row + col) % 2 === 0 })
    }
  }
  return cells
})()

/**
 * Il tavolo del Carnevale: rombi da Arlecchino appena accennati sul feltro e un bordo di
 * stelle filanti arricciate piene di coriandoli. Il viewBox è centrato sul tavolo.
 */
export default function StreamerRing() {
  return (
    <svg
      viewBox="-120 -120 240 240"
      className="pointer-events-none absolute -inset-[10%] z-1 overflow-visible"
      aria-hidden="true"
    >
      <defs>
        <clipPath id="carnival-felt">
          <circle r="99" />
        </clipPath>
      </defs>
      <g clipPath="url(#carnival-felt)">
        {DIAMONDS.map(({ x, y, light }, i) => (
          <path
            key={i}
            d={`M${x} ${y - 7.5}L${x + 9} ${y}L${x} ${y + 7.5}L${x - 9} ${y}Z`}
            fill={light ? '#fff' : '#000'}
            opacity={light ? 0.06 : 0.1}
          />
        ))}
      </g>
      {STREAMERS.map(({ d, color }, i) => (
        <path key={i} d={d} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {DOTS.map(({ x, y, color }, i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 ? 1.4 : 2} fill={color} />
      ))}
    </svg>
  )
}
