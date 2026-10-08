import { useEffect, useState } from 'react'
import Confetti from '../../components/Confetti'

const INTRO_MS = 4800

const SHOTS = [
  { delay: 0.3, left: '22%', top: '26%', rotate: -12 },
  { delay: 1.0, left: '48%', top: '40%', rotate: 9 },
  { delay: 1.7, left: '18%', top: '58%', rotate: -5 },
]

/**
 * I tre colpi di cannone che a Viareggio aprono ogni corso mascherato: tre «BUM!» con un
 * lampo, poi una pioggia di coriandoli. Non intercetta i tocchi; con «riduci animazioni»
 * non c'è.
 */
export default function Cannons() {
  const [reducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [done, setDone] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setDone(true), INTRO_MS)
    return () => window.clearTimeout(timer)
  }, [])

  if (done || reducedMotion) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50" aria-hidden="true">
      {SHOTS.map((shot) => (
        <div key={shot.delay}>
          <div
            className="absolute inset-0 animate-cannon-flash bg-[radial-gradient(circle_at_50%_60%,rgba(255,244,214,0.32),rgba(255,244,214,0.04))]"
            style={{ animationDelay: `${shot.delay}s` }}
          />
          <span
            className="absolute animate-bum font-display text-[64px] leading-none font-bold text-[#ffd23f] [-webkit-text-stroke:3px_#c21a2e] [paint-order:stroke_fill] [text-shadow:0_4px_0_#7a0f1c]"
            style={{
              left: shot.left,
              top: shot.top,
              rotate: `${shot.rotate}deg`,
              animationDelay: `${shot.delay}s`,
            }}
          >
            BUM!
          </span>
        </div>
      ))}
      <div className="absolute inset-x-0 top-[44%] flex animate-carnival-caption flex-col items-center">
        <span className="font-display text-[30px] font-bold text-cream [text-shadow:0_2px_12px_rgba(0,0,0,0.6)]">
          Carnevale di Viareggio
        </span>
        <span className="font-mono text-[11px] tracking-[0.2em] text-gold-light uppercase">
          Si apre il corso mascherato
        </span>
      </div>
      <Confetti delay={1.9} count={70} />
    </div>
  )
}
