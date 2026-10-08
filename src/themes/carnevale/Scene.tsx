import Confetti from '../../components/Confetti'
import { scatter } from '../../lib/scatter'
import Burlamacco from './Burlamacco'

const COLORS = ['#ffd23f', '#2ec4c4', '#e3408f', '#9bd93c', '#ff8c2e', '#8a5cf5']

/** Streamers thrown from the bottom corners, curling up across the screen. */
const THROWS = [
  'M2 100C10 70 4 60 18 48s2-22 16-30',
  'M6 100C18 80 30 78 30 60s14-18 22-30',
  'M98 100C88 74 96 62 82 50s-2-22-16-32',
  'M94 100C80 82 70 76 72 58S58 40 50 28',
  'M0 92C16 86 22 70 38 70s18-14 30-20',
  'M100 90C86 86 78 72 62 72s-18-12-30-18',
]

const FLAGS = 18

/**
 * Carnevale di Viareggio: notte di festa con i fasci dei fari, bandierine, coriandoli che
 * non smettono di cadere, stelle filanti lanciate dagli angoli e Burlamacco che saluta.
 */
export default function CarnivalScene() {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#160a36_0%,#2e0d4d_35%,#4a1150_70%,#2a0a24_100%)]" />
      {[0, 1].map((side) => (
        // Searchlights sweeping the sky from the parade below.
        <div
          key={side}
          className={`absolute bottom-0 h-[120vh] w-[30vw] animate-searchlight bg-[linear-gradient(0deg,rgba(255,230,160,0.18),transparent_85%)] [clip-path:polygon(45%_100%,55%_100%,100%_0,0_0)] motion-reduce:animate-none ${
            side ? 'right-[8%] origin-bottom' : 'left-[8%] origin-bottom'
          }`}
          style={{ animationDelay: side ? '-3s' : '0s', animationDirection: side ? 'alternate-reverse' : 'alternate' }}
        />
      ))}

      <Confetti delay={0} count={34} loop className="absolute inset-0" />

      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full motion-reduce:hidden"
      >
        {THROWS.map((d, i) => (
          <path
            key={i}
            d={d}
            pathLength="100"
            fill="none"
            stroke={COLORS[i % COLORS.length]}
            strokeWidth="3"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            className="animate-streamer-throw"
            style={{ animationDelay: `${i * 1.4 + scatter(i, 77)}s` }}
          />
        ))}
      </svg>

      <div className="absolute inset-x-0 top-[env(safe-area-inset-top,0px)] flex justify-between px-1">
        {Array.from({ length: FLAGS }, (_, i) => (
          <span
            key={i}
            className="block h-4 w-3.5 origin-top animate-bauble-swing [clip-path:polygon(0_0,100%_0,50%_100%)] motion-reduce:animate-none"
            style={{
              backgroundColor: COLORS[i % COLORS.length],
              marginTop: `${4 * Math.sin((Math.PI * (i + 0.5)) / FLAGS)}px`,
              animationDuration: `${2.4 + scatter(i, 78)}s`,
              animationDelay: `${-scatter(i, 79) * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute top-[calc(env(safe-area-inset-top,0px)+14px)] right-0 w-22 animate-burlamacco-peek motion-reduce:translate-x-[16%] motion-reduce:animate-none">
        <Burlamacco />
      </div>
    </>
  )
}
