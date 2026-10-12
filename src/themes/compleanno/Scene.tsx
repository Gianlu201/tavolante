import Confetti from '../../components/Confetti'
import { scatter } from '../../lib/scatter'
import Balloon from './Balloon'
import { PARTY_COLORS } from './colors'

const BANNER = 'TANTI AUGURI'

/**
 * Balloons rising along the edges, already mid-flight on the first frame: the middle
 * stays clear for the title and the text under the table.
 */
const BALLOONS = [
  { left: '1%', size: 46, duration: 21, delay: -2 },
  { left: '8%', size: 34, duration: 26, delay: -15 },
  { left: '84%', size: 40, duration: 23, delay: -9 },
  { left: '91%', size: 48, duration: 19, delay: -13 },
]

/** Party lights blurred in the background, like a room with the lights down. */
const LIGHTS = Array.from({ length: 14 }, (_, i) => ({
  left: `${scatter(i, 31) * 100}%`,
  top: `${8 + scatter(i, 32) * 80}%`,
  size: 30 + scatter(i, 33) * 70,
  color: PARTY_COLORS[i % PARTY_COLORS.length],
}))

/**
 * Compleanno: festa a luci basse con le lucine sfocate, la ghirlanda «TANTI AUGURI»
 * appesa in alto, palloncini che salgono ai lati e coriandoli colorati.
 */
export default function BirthdayScene() {
  const letters = [...BANNER]

  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#1d0f3d_0%,#3a1458_45%,#5a1a5e_75%,#3f0f2e_100%)]" />

      {LIGHTS.map((light, i) => (
        <span
          key={i}
          className="absolute -translate-1/2 animate-twinkle rounded-full opacity-25 blur-xl motion-reduce:animate-none"
          style={{
            left: light.left,
            top: light.top,
            width: light.size,
            height: light.size,
            backgroundColor: light.color,
            animationDuration: `${3 + scatter(i, 34) * 3}s`,
            animationDelay: `${-scatter(i, 35) * 4}s`,
          }}
        />
      ))}

      {BALLOONS.map((balloon, i) => (
        <div
          key={balloon.left}
          className="absolute top-full animate-balloon-rise motion-reduce:hidden"
          style={{
            left: balloon.left,
            width: balloon.size,
            animationDuration: `${balloon.duration}s`,
            animationDelay: `${balloon.delay}s`,
          }}
        >
          <Balloon
            color={PARTY_COLORS[i % PARTY_COLORS.length]}
            className="block w-full origin-top animate-bauble-swing"
          />
        </div>
      ))}

      <Confetti delay={0} count={26} loop colors={PARTY_COLORS} className="absolute inset-0" />

      {/* The garland sags in the middle: each flag hangs from the string at its height. */}
      <div className="absolute inset-x-0 top-[env(safe-area-inset-top,0px)] mx-auto h-8 max-w-130 px-2">
        <svg viewBox="0 0 100 16" preserveAspectRatio="none" className="absolute inset-x-2 top-0 h-4 w-[calc(100%-16px)]">
          <path d="M0 2Q50 14 100 2" fill="none" stroke="#f4ecdd" strokeOpacity="0.45" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="relative flex justify-between">
          {letters.map((letter, i) => {
            const t = (i + 0.5) / letters.length
            return (
              <span
                key={i}
                className={`flex h-5.5 w-[6.5%] max-w-6 origin-top animate-bauble-swing justify-center pt-0.5 font-display text-[10px] leading-none font-bold text-white [clip-path:polygon(0_0,100%_0,50%_100%)] motion-reduce:animate-none ${
                  letter === ' ' ? 'invisible' : ''
                }`}
                style={{
                  marginTop: `${1 + 24 * t * (1 - t)}px`,
                  backgroundColor: PARTY_COLORS[i % PARTY_COLORS.length],
                  animationDuration: `${2.4 + scatter(i, 36)}s`,
                  animationDelay: `${-scatter(i, 37) * 2}s`,
                }}
              >
                {letter}
              </span>
            )
          })}
        </div>
      </div>
    </>
  )
}
