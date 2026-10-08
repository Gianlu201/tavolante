import Fireworks, { type Burst } from '../../components/Fireworks'
import { scatter } from '../../lib/scatter'
import Lungarno from '../pisa/Lungarno'

/** Fireworks close the night: a few bursts high above the roofs, now and then. */
const BURSTS: Burst[] = [
  { x: 9, y: 5, delay: 3, color: '#ffd98a' },
  { x: 91, y: 4, delay: 7.5, color: '#ffb347' },
]

/** Lungarni spenti, cielo nero, lampanini su palazzi, ponte e Spina, riflessi nell'Arno. */
export default function LuminaraScene() {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#02030a_0%,#060a18_10%,#0b1226_14%,#04070f_16%,#03050b_55%,#020308_100%)]" />
      {Array.from({ length: 18 }, (_, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${scatter(i, 21) * 100}%`,
            top: `${1 + scatter(i, 22) * 9}%`,
            width: 1 + scatter(i, 23),
            height: 1 + scatter(i, 23),
            opacity: 0.25 + scatter(i, 24) * 0.4,
          }}
        />
      ))}
      <Fireworks bursts={BURSTS} cycle={11} radius={30} sparks={14} className="opacity-85" />
      <Lungarno variant="luminara" />
      {Array.from({ length: 9 }, (_, i) => (
        // Glints of lamplight drifting on the water, beyond the mirrored skyline.
        <span
          key={i}
          className="absolute h-px animate-water-glint rounded-full bg-[linear-gradient(90deg,transparent,rgba(255,200,110,0.55),transparent)] motion-reduce:animate-none"
          style={{
            left: `${scatter(i, 31) * 80}%`,
            top: `${36 + scatter(i, 32) * 30}%`,
            width: `${10 + scatter(i, 33) * 18}%`,
            animationDuration: `${3 + scatter(i, 34) * 3}s`,
            animationDelay: `${-scatter(i, 35) * 4}s`,
          }}
        />
      ))}
    </>
  )
}
