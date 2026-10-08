import { useId } from 'react'
import { scatter } from '../../lib/scatter'

/**
 * Il tavolo visto come l'interno di un uovo di Pasqua aperto: il bordo del guscio di
 * cioccolato rotto a zig-zag, fuori la carta stagnola arricciata e cangiante, e una
 * coccarda di nastro. Il viewBox è centrato sul tavolo e ne misura il raggio in 100.
 */

const FOIL_COLORS = [
  ['#fbe3f6', '#d47bd0', '#8e3f8c'],
  ['#ece6ff', '#9c84f0', '#5b45a8'],
  ['#fff5d8', '#f2c75c', '#a87b1c'],
  ['#e0f7fd', '#6cc7e2', '#2d7f99'],
  ['#ffe6ef', '#f08cb2', '#a8436c'],
]

const SEGMENTS = 30

const polar = (deg: number, radius: number) => {
  const rad = (deg * Math.PI) / 180
  return `${(radius * Math.cos(rad)).toFixed(2)} ${(radius * Math.sin(rad)).toFixed(2)}`
}

/** Crumpled foil: each piece has its own jagged outer edge and catches the light differently. */
const FOIL = Array.from({ length: SEGMENTS }, (_, i) => {
  const from = (360 / SEGMENTS) * i - 1
  const to = (360 / SEGMENTS) * (i + 1) + 1
  const mid = (from + to) / 2
  const outer = [from, (from + mid) / 2, mid, (mid + to) / 2, to].map(
    (deg, k) => polar(deg, 105.5 + scatter(i * 5 + k, 51) * 5),
  )
  return {
    d: `M${polar(from, 99)}L${outer.join('L')}L${polar(to, 99)}Z`,
    color: i % FOIL_COLORS.length,
    crinkle: `M${polar(mid - 3, 101.5 + scatter(i, 52) * 2)}L${polar(mid, 105 + scatter(i, 53) * 3)}L${polar(mid + 4, 102 + scatter(i, 54) * 2)}`,
  }
})

/** The broken shell: teeth of uneven height all around the rim. */
const SHELL = (() => {
  const teeth = 44
  const points: string[] = []
  for (let i = 0; i < teeth; i++) {
    const base = (360 / teeth) * i
    points.push(polar(base, 99.5))
    points.push(polar(base + 360 / teeth / 2, 103 + scatter(i, 55) * 4.5))
  }
  // The inner circle is cut out (even-odd), so only the broken rim is chocolate.
  return `M${points.join('L')}ZM96 0A96 96 0 1 0 -96 0A96 96 0 1 0 96 0Z`
})()

/** The ribbon rosette sits bottom right, clear of the text under the table. */
const ROSETTE = polar(45, 106)

export default function ChocolateEgg() {
  const id = useId().replace(/[^\w-]/g, '')

  return (
    <svg
      viewBox="-120 -120 240 240"
      className="pointer-events-none absolute -inset-[10%] z-1 overflow-visible"
      aria-hidden="true"
    >
      <defs>
        {FOIL_COLORS.map(([light, mid, dark], i) => (
          <linearGradient key={i} id={`${id}-foil-${i}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={light} />
            <stop offset="0.45" stopColor={mid} />
            <stop offset="0.7" stopColor={light} />
            <stop offset="1" stopColor={dark} />
          </linearGradient>
        ))}
      </defs>

      {FOIL.map((piece, i) => (
        <g key={i}>
          <path d={piece.d} fill={`url(#${id}-foil-${piece.color})`} />
          <path
            d={piece.crinkle}
            fill="none"
            stroke="#fff"
            strokeOpacity="0.7"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
        </g>
      ))}

      <path d={SHELL} fill="#3d1f0e" fillRule="evenodd" />
      <circle r="99.5" fill="none" stroke="#9a6438" strokeWidth="1.6" />
      <circle r="94.5" fill="none" stroke="#2a1408" strokeOpacity="0.35" strokeWidth="3" />

      <g transform={`translate(${ROSETTE}) scale(0.82)`}>
        <path d="M0 0C-4 10-2 18-8 24" fill="none" stroke="#f08cb2" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M0 0C5 9 9 13 6 21c-2 5 4 7 6 3" fill="none" stroke="#9c84f0" strokeWidth="2.4" strokeLinecap="round" />
        {[0, 72, 144, 216, 288].map((deg, i) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-7"
            rx="4.6"
            ry="8"
            transform={`rotate(${deg})`}
            fill={i % 2 ? '#f6b3d0' : '#f08cb2'}
            stroke="#c95f8c"
            strokeWidth="0.6"
          />
        ))}
        <circle r="4.2" fill="#fbe3f6" stroke="#c95f8c" strokeWidth="0.8" />
      </g>
    </svg>
  )
}
