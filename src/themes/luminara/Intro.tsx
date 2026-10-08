import { useEffect, useState } from 'react'
import Lungarno from '../pisa/Lungarno'

const INTRO_MS = 6800

/**
 * Lo spegnimento: all'apertura i Lungarni (e l'app) si spengono, poi i lampanini si
 * accendono da sinistra a destra. Alla fine il velo si dissolve sulla scena già accesa,
 * disegnata identica sotto. Non intercetta i tocchi e con «riduci animazioni» non c'è.
 */
export default function LuminaraIntro() {
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
    <div
      className="pointer-events-none fixed inset-0 z-50 animate-luminara-veil bg-[#020308]"
      aria-hidden="true"
    >
      <div className="absolute inset-0 animate-[fade-up_0.6s_ease-out_1.2s_both]">
        <Lungarno variant="luminara" reveal />
      </div>
      <p className="absolute inset-x-0 top-[56%] m-0 animate-caption-early text-center font-mono text-[12px] tracking-[0.2em] text-cream/75 uppercase">
        Si spengono i Lungarni…
      </p>
      <div className="absolute inset-x-0 top-[54%] flex animate-caption-late flex-col items-center gap-1">
        <span className="font-display text-[28px] font-semibold text-gold-light [text-shadow:0_0_18px_rgba(255,180,70,0.6)]">
          Luminara di San Ranieri
        </span>
        <span className="font-mono text-[11px] tracking-[0.2em] text-gold/80 uppercase">
          Pisa · 16 giugno
        </span>
      </div>
    </div>
  )
}
