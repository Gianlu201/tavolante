import { useNow } from '../../hooks/useSeason'
import { msSinceMidnight, msToMidnight } from '../../lib/seasons'
import Confetti from '../../components/Confetti'
import Fireworks, { type Burst } from '../../components/Fireworks'

const COUNTDOWN_FROM_MS = 10_000
const CELEBRATION_MS = 25_000

const MIDNIGHT_BURSTS: Burst[] = [
  { x: 18, y: 18, delay: 0, color: '#ecd8a3' },
  { x: 80, y: 14, delay: 0.5, color: '#e08363' },
  { x: 50, y: 30, delay: 0.9, color: '#f4ecdd' },
  { x: 25, y: 62, delay: 1.3, color: '#c9ced6' },
  { x: 76, y: 58, delay: 1.7, color: '#d6ae66' },
  { x: 52, y: 80, delay: 2.1, color: '#e2453c' },
]

/**
 * Gli ultimi dieci secondi del 31 dicembre scorrono a tutto schermo, poi allo scoccare
 * della mezzanotte partono fuochi d'artificio e coriandoli. Non intercetta mai i tocchi.
 */
export default function NewYearCountdown() {
  const now = useNow(250)
  const toMidnight = msToMidnight(now)
  const eve = now.getMonth() === 11 && now.getDate() === 31
  const newYearsDay = now.getMonth() === 0 && now.getDate() === 1

  if (eve && toMidnight <= COUNTDOWN_FROM_MS) {
    const seconds = Math.ceil(toMidnight / 1000)
    return (
      <div
        className="pointer-events-none fixed inset-0 z-50 flex flex-col items-center justify-center bg-[radial-gradient(circle,rgba(11,18,41,0.75),rgba(11,18,41,0.35)_70%)]"
        role="timer"
        aria-live="polite"
      >
        <span className="font-mono text-[12px] tracking-[0.2em] text-gold/90 uppercase">
          Mezzanotte tra
        </span>
        <span
          key={seconds}
          className="animate-countdown-pop font-display text-[132px] leading-none font-bold text-gold-light [text-shadow:0_0_40px_rgba(214,174,102,0.6)] motion-reduce:animate-none"
        >
          {seconds}
        </span>
      </div>
    )
  }

  if (newYearsDay && msSinceMidnight(now) < CELEBRATION_MS) {
    return (
      <div
        className="pointer-events-none fixed inset-0 z-50 flex animate-scrim-in flex-col items-center justify-center bg-[radial-gradient(circle,rgba(11,18,41,0.8),rgba(11,18,41,0.4)_70%)] motion-reduce:animate-none"
        role="status"
      >
        <Fireworks bursts={MIDNIGHT_BURSTS} cycle={2.6} radius={86} sparks={18} />
        <span className="animate-countdown-pop font-display text-[34px] font-semibold text-cream motion-reduce:animate-none">
          Buon
        </span>
        <span className="animate-countdown-pop bg-[linear-gradient(180deg,#f7e7bb,var(--color-gold))] bg-clip-text font-display text-[96px] leading-none font-bold text-transparent [filter:drop-shadow(0_0_24px_rgba(214,174,102,0.55))] motion-reduce:animate-none">
          {now.getFullYear()}!
        </span>
        <Confetti delay={0} count={60} />
      </div>
    )
  }

  return null
}
