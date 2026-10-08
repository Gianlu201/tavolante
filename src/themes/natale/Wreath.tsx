import { scatter } from '../../lib/scatter'

/**
 * Ghirlanda di Natale attorno al tavolo. Il viewBox è centrato sul tavolo e ne misura
 * il raggio in 100 unità: con inset -10% l'SVG copre il 120% del tavolo e la ghirlanda
 * resta fra il bordo dei posti (93) e poco oltre il bordo del feltro.
 */

const polar = (angleDeg: number, radius: number) => {
  const rad = (angleDeg * Math.PI) / 180
  return { x: radius * Math.cos(rad), y: radius * Math.sin(rad) }
}

const NEEDLE_COLORS = ['#123f22', '#1a5a31', '#23713e', '#2f8a4f', '#3f9f5f']
const NEEDLES = Array.from({ length: 170 }, (_, i) => {
  const angle = (360 / 170) * i + (scatter(i, 1) - 0.5) * 3
  const { x, y } = polar(angle, 99 + scatter(i, 2) * 10)
  return {
    x,
    y,
    length: 6 + scatter(i, 3) * 4,
    tilt: angle + 90 + (scatter(i, 4) - 0.5) * 70,
    // Darker needles first, lighter ones on top: the wreath gets some volume.
    color: NEEDLE_COLORS[Math.min(NEEDLE_COLORS.length - 1, Math.floor(scatter(i, 5) * 5))],
  }
}).sort((a, b) => NEEDLE_COLORS.indexOf(a.color) - NEEDLE_COLORS.indexOf(b.color))

/** Snow settles on the upper arc only (SVG angles grow clockwise, -90 is the top). */
const SNOW = Array.from({ length: 30 }, (_, i) => {
  const angle = 205 + (130 / 29) * i + (scatter(i, 6) - 0.5) * 4
  const { x, y } = polar(angle, 106 + scatter(i, 7) * 3)
  return { x, y, rx: 4 + scatter(i, 8) * 4, ry: 2 + scatter(i, 9) * 1.4, tilt: angle + 90 }
})

/** The bow sits bottom-left, away from the text under the table and the buttons above. */
const BOW_ANGLE = 135

const BERRIES = [15, 48, 78, 168, 192, 238, 268, 300, 332].map((angle) => polar(angle, 104))

const BAUBLE_COLORS = ['#d6ae66', '#c8262e', '#c9ced6']
const BAUBLES = [0, 33, 62, 95, 180, 215, 252, 285, 318].map((angle, i) => ({
  ...polar(angle, 108),
  color: BAUBLE_COLORS[i % BAUBLE_COLORS.length],
}))

const LIGHTS = Array.from({ length: 22 }, (_, i) => polar((360 / 22) * i + 8, 101))

export default function Wreath() {
  const bow = polar(BOW_ANGLE, 114)

  return (
    <svg
      viewBox="-120 -120 240 240"
      className="pointer-events-none absolute -inset-[10%] z-1 overflow-visible"
      aria-hidden="true"
    >
      <circle r="104" fill="none" stroke="#0d311b" strokeWidth="14" />

      {NEEDLES.map((needle, i) => (
        <ellipse
          key={i}
          cx={needle.x}
          cy={needle.y}
          rx={needle.length}
          ry="1.7"
          fill={needle.color}
          transform={`rotate(${needle.tilt.toFixed(1)} ${needle.x.toFixed(2)} ${needle.y.toFixed(2)})`}
        />
      ))}

      {SNOW.map((flake, i) => (
        <ellipse
          key={i}
          cx={flake.x}
          cy={flake.y}
          rx={flake.rx}
          ry={flake.ry}
          fill="#f8fbff"
          opacity="0.92"
          transform={`rotate(${flake.tilt.toFixed(1)} ${flake.x.toFixed(2)} ${flake.y.toFixed(2)})`}
        />
      ))}

      {BERRIES.map(({ x, y }, i) => (
        <g key={i}>
          {[
            [0, -2.2],
            [-2.1, 1.4],
            [2.1, 1.4],
          ].map(([dx, dy]) => (
            <circle key={`${dx}${dy}`} cx={x + dx} cy={y + dy} r="2.3" fill="#c01c28" />
          ))}
          <circle cx={x - 0.6} cy={y - 2.9} r="0.7" fill="#ffd6d6" />
        </g>
      ))}

      {BAUBLES.map(({ x, y, color }, i) => (
        <g key={i}>
          <rect x={x - 1.4} y={y - 6.2} width="2.8" height="2" rx="0.5" fill="#b8913e" />
          <circle cx={x} cy={y} r="4.4" fill={color} />
          <circle cx={x - 1.4} cy={y - 1.4} r="1.2" fill="#fff" opacity="0.7" />
        </g>
      ))}

      {LIGHTS.map(({ x, y }, i) => (
        <g
          key={i}
          className="animate-twinkle motion-reduce:animate-none"
          style={{ animationDuration: '2.4s', animationDelay: `${-i * 0.22}s` }}
        >
          <circle cx={x} cy={y} r="4" fill="#ffe7a1" opacity="0.28" />
          <circle cx={x} cy={y} r="1.6" fill="#fff6d6" />
        </g>
      ))}

      <g transform={`translate(${bow.x.toFixed(2)} ${bow.y.toFixed(2)})`}>
        <path d="M-2 3-10 21l4-2 3 4 5-20z" fill="#a8161f" />
        <path d="M2 3 10 21l-4-2-3 4-5-20z" fill="#8f1219" />
        <path d="M0 0C-8-14-26-14-24-2c1 9 14 8 24 2z" fill="#c8262e" />
        <path d="M0 0C8-14 26-14 24-2C23 7 10 6 0 0z" fill="#b81f2a" />
        <path d="M-3-1c-5-6-14-8-16-4 4-1 10 1 16 4z" fill="#8f1219" />
        <path d="M3-1c5-6 14-8 16-4-4-1-10 1-16 4z" fill="#7a0f16" />
        <rect x="-4.5" y="-5" width="9" height="9" rx="3" fill="#d42f38" />
        <path d="M-17-7c3-3 8-4 12-2" fill="none" stroke="#e8505a" strokeWidth="1.4" strokeLinecap="round" />
      </g>
    </svg>
  )
}
