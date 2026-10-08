import { scatter } from '../../lib/scatter'
import { FishShape } from './PaperFish'

const SCHOOL = [
  { color: '#ff8c42', top: '16%', size: 46, duration: 26, delay: -4, toRight: true },
  { color: '#4fc3f7', top: '58%', size: 38, duration: 31, delay: -18, toRight: false },
  { color: '#f48fb1', top: '34%', size: 30, duration: 23, delay: -11, toRight: false },
  { color: '#ffd54f', top: '76%', size: 42, duration: 28, delay: -2, toRight: true },
  { color: '#aed581', top: '8%', size: 26, duration: 35, delay: -25, toRight: false },
]

/** Pesci di carta che nuotano piano dietro la pagina e bollicine che salgono. */
export default function AprilFoolsScene() {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(40,140,170,0.18)_100%)]" />
      {SCHOOL.map((fish) => (
        <span
          key={fish.color}
          className={`absolute left-0 ${fish.toRight ? 'animate-swim-right' : 'animate-swim-left'} motion-reduce:hidden`}
          style={{
            top: fish.top,
            width: fish.size,
            animationDuration: `${fish.duration}s`,
            animationDelay: `${fish.delay}s`,
          }}
        >
          <svg
            viewBox="0 0 60 30"
            className={`block w-full animate-fish-bob opacity-80 ${fish.toRight ? '' : '-scale-x-100'}`}
          >
            <FishShape color={fish.color} />
          </svg>
        </span>
      ))}
      {Array.from({ length: 14 }, (_, i) => {
        const size = 4 + scatter(i, 81) * 8
        const duration = 7 + scatter(i, 82) * 7
        return (
          <span
            key={i}
            className="absolute bottom-0 animate-bubble-rise rounded-full border border-white/45 bg-white/10 motion-reduce:hidden"
            style={{
              left: `${scatter(i, 83) * 100}%`,
              width: size,
              height: size,
              animationDuration: `${duration}s`,
              animationDelay: `${-scatter(i, 84) * duration}s`,
            }}
          />
        )
      })}
    </>
  )
}
