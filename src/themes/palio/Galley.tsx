import type { SVGProps } from 'react'

const ROWERS = Array.from({ length: 8 }, (_, i) => 30 + i * 9.4)

/**
 * Una galea del Palio vista di fianco, prua a destra: otto vogatori, timoniere a poppa,
 * montatore a prua e la bandiera del quartiere. I remi vogano tutti insieme.
 */
export default function Galley({
  color,
  ...frame
}: { color: string } & Pick<SVGProps<SVGSVGElement>, 'x' | 'y' | 'width' | 'height'>) {
  return (
    <svg viewBox="0 0 124 34" overflow="visible" {...frame}>
      {ROWERS.map((x) => (
        <line
          key={x}
          x1={x}
          y1="19"
          x2={x - 9}
          y2="31"
          stroke="#e9dcc0"
          strokeWidth="1.3"
          strokeLinecap="round"
          className="animate-row-stroke motion-reduce:animate-none"
          style={{ transformOrigin: `${x}px 19px` }}
        />
      ))}
      <path
        d="M6 13 12 22q4 3 14 3h72q10 0 16-7l4-7-6 3q-8 4-16 4H24q-10 0-18-3z"
        fill={color}
      />
      <path d="M12 17.5H104" stroke="#fff" strokeOpacity="0.75" strokeWidth="1" />
      {ROWERS.map((x) => (
        <g key={x} fill="#1d1420">
          <circle cx={x} cy="11.5" r="2" />
          <rect x={x - 1.6} y="13" width="3.2" height="5" rx="1.2" />
        </g>
      ))}
      <circle cx="14" cy="8" r="2" fill="#1d1420" />
      <rect x="12.4" y="9.6" width="3.2" height="6.5" rx="1.2" fill="#1d1420" />
      <circle cx="110" cy="6.5" r="1.9" fill="#1d1420" />
      <rect x="108.5" y="8" width="3" height="5.5" rx="1.2" fill="#1d1420" />
      <line x1="6" y1="13" x2="6" y2="0" stroke="#3a2a20" strokeWidth="1" />
      <path d="M6 0h11l-3 3.5 3 3.5H6z" fill={color} stroke="#fff" strokeOpacity="0.6" strokeWidth="0.6" />
    </svg>
  )
}
