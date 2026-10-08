import type { CSSProperties } from 'react'

export type Burst = {
  /** Position of the burst centre, in % of the layer. */
  x: number
  y: number
  /** Seconds before the first burst; it then repeats every `cycle`. */
  delay: number
  color: string
}

type FireworksProps = {
  bursts: Burst[]
  /** Seconds between two bursts at the same spot. */
  cycle: number
  /** How far the sparks fly, in px. */
  radius: number
  sparks?: number
  className?: string
}

/** Fuochi d'artificio in CSS: ogni scintilla parte dal centro lungo il proprio angolo. */
export default function Fireworks({
  bursts,
  cycle,
  radius,
  sparks = 14,
  className = '',
}: FireworksProps) {
  return (
    <div className={`pointer-events-none absolute inset-0 motion-reduce:hidden ${className}`}>
      {bursts.map((burst, b) => (
        <span
          key={b}
          className="absolute"
          style={{ left: `${burst.x}%`, top: `${burst.y}%` }}
        >
          {Array.from({ length: sparks }, (_, i) => {
            const style = {
              backgroundColor: burst.color,
              boxShadow: `0 0 6px ${burst.color}`,
              animationDuration: `${cycle}s`,
              animationDelay: `${burst.delay}s`,
              '--a': `${(360 / sparks) * i}deg`,
              '--r': `${radius * (i % 2 === 0 ? 1 : 0.78)}px`,
            } as CSSProperties
            return (
              <span
                key={i}
                className="absolute -top-0.75 -left-0.75 size-1.5 animate-firework rounded-full"
                style={style}
              />
            )
          })}
        </span>
      ))}
    </div>
  )
}
