import type { CSSProperties } from 'react'
import { scatter } from '../lib/scatter'

const COLORS = ['#c9a15a', '#ecd8a3', '#f4ecdd', '#e08363', '#c9ced6', '#d6ae66']

type ConfettiProps = {
  /** Seconds before the first pieces start falling. */
  delay: number
  count?: number
}

/** Pioggia di coriandoli in CSS puro: con «riduci animazioni» non compare affatto. */
export default function Confetti({ delay, count = 46 }: ConfettiProps) {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden motion-reduce:hidden"
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, i) => {
        const round = i % 5 === 0
        const size = 6 + scatter(i, 1) * 6
        const style = {
          left: `${scatter(i, 2) * 100}%`,
          width: `${size}px`,
          height: `${round ? size : size * 1.7}px`,
          backgroundColor: COLORS[i % COLORS.length],
          animationDuration: `${2.6 + scatter(i, 3) * 2}s`,
          animationDelay: `${delay + scatter(i, 4) * 0.9}s`,
          '--drift': `${(scatter(i, 5) - 0.5) * 160}px`,
          '--spin': `${(scatter(i, 6) > 0.5 ? 1 : -1) * (360 + scatter(i, 7) * 540)}deg`,
        } as CSSProperties
        return (
          <span
            key={i}
            className={`absolute top-0 animate-confetti-fall ${round ? 'rounded-full' : 'rounded-[2px]'}`}
            style={style}
          />
        )
      })}
    </div>
  )
}
