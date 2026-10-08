import { QUARTIERI } from '../pisa/quartieri'
import Galley from './Galley'

const RADIUS = 103
const GALLEY_LENGTH = 31
const GALLEY_HEIGHT = (GALLEY_LENGTH * 34) / 124

/** Each boat laps at its own pace, so they keep overtaking each other. */
const CREWS = QUARTIERI.map((quartiere, i) => ({
  ...quartiere,
  lap: 40 + i * 2.6,
  start: -i * 10,
}))

/**
 * Attorno al tavolo l'Arno diventa un anello d'acqua e le quattro galee dei quartieri
 * ci vogano in tondo. Il viewBox è centrato sul tavolo e ne misura il raggio in 100 unità.
 */
export default function QuartieriRing() {
  return (
    <svg
      viewBox="-120 -120 240 240"
      className="pointer-events-none absolute -inset-[10%] z-1 overflow-visible"
      aria-hidden="true"
    >
      <circle r={RADIUS} fill="none" stroke="#173a5c" strokeWidth="13" />
      <circle r={RADIUS - 3} fill="none" stroke="#5fa8d8" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="6 9" />
      <circle r={RADIUS + 3} fill="none" stroke="#5fa8d8" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="4 11" />
      <circle r={RADIUS + 6.5} fill="none" stroke="#e8d3a0" strokeOpacity="0.5" strokeWidth="1" />
      <circle r={RADIUS - 6.5} fill="none" stroke="#e8d3a0" strokeOpacity="0.5" strokeWidth="1" />
      {QUARTIERI.map(({ name, color }, i) => {
        const angle = ((i * 90 - 45) * Math.PI) / 180
        return (
          <circle
            key={name}
            cx={RADIUS * Math.cos(angle)}
            cy={RADIUS * Math.sin(angle)}
            r="2.2"
            fill={color}
            stroke="#fff"
            strokeWidth="0.8"
          />
        )
      })}
      {CREWS.map((crew) => (
        <g
          key={crew.name}
          className="animate-regatta motion-reduce:animate-none"
          style={{
            transformOrigin: '0px 0px',
            animationDuration: `${crew.lap}s`,
            animationDelay: `${crew.start}s`,
          }}
        >
          <Galley
            color={crew.color}
            x={-GALLEY_LENGTH / 2}
            y={-RADIUS - GALLEY_HEIGHT / 2 - 1}
            width={GALLEY_LENGTH}
            height={GALLEY_HEIGHT}
          />
        </g>
      ))}
    </svg>
  )
}
