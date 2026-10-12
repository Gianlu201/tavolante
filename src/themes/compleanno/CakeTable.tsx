import { scatter } from '../../lib/scatter'
import { PARTY_COLORS } from './colors'

/**
 * Il tavolo è una torta vista dall'alto: ciuffi di panna lungo il bordo e codette
 * colorate sulla glassa. Il viewBox è centrato sul tavolo e ne misura il raggio in 100
 * unità, come la ghirlanda di Natale; le codette stanno fra il mazzo e il bordo.
 */

const polar = (angleDeg: number, radius: number) => {
  const rad = (angleDeg * Math.PI) / 180
  return { x: radius * Math.cos(rad), y: radius * Math.sin(rad) }
}

const DOLLOPS = Array.from({ length: 34 }, (_, i) => polar((360 / 34) * i, 104))

const SPRINKLES = Array.from({ length: 70 }, (_, i) => ({
  ...polar(scatter(i, 41) * 360, 34 + scatter(i, 42) * 60),
  rotate: scatter(i, 43) * 180,
  color: PARTY_COLORS[i % PARTY_COLORS.length],
}))

export default function CakeTable() {
  return (
    <svg
      viewBox="-120 -120 240 240"
      className="pointer-events-none absolute -inset-[10%] z-1 overflow-visible"
      aria-hidden="true"
    >
      {SPRINKLES.map((sprinkle, i) => (
        <rect
          key={i}
          x={sprinkle.x - 2.6}
          y={sprinkle.y - 0.9}
          width="5.2"
          height="1.8"
          rx="0.9"
          fill={sprinkle.color}
          opacity="0.9"
          transform={`rotate(${sprinkle.rotate} ${sprinkle.x} ${sprinkle.y})`}
        />
      ))}

      <circle r="103" fill="none" stroke="#f3c9d8" strokeWidth="9" />
      {DOLLOPS.map(({ x, y }, i) => (
        <g key={i}>
          <circle cx={x + 1} cy={y + 1.6} r="7" fill="#d9879f" />
          <circle cx={x} cy={y} r="7" fill="#fff6f9" />
          <path
            d={`M${x - 4} ${y + 1}q4-6 8 0`}
            fill="none"
            stroke="#f3c9d8"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <circle cx={x - 2} cy={y - 2.6} r="1.6" fill="#fff" />
        </g>
      ))}
    </svg>
  )
}
