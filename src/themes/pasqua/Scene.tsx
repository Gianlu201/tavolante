import { scatter } from '../../lib/scatter'
import Bunny from './Bunny'
import HatchingEgg from './HatchingEgg'

const FLOWER_COLORS = ['#ffd1e8', '#fff3a6', '#d9ccff', '#ffffff', '#bfe8ff']

/** A five-petal flower, centre at (x, y). */
function Flower({ x, y, size, color }: { x: number; y: number; size: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`}>
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse key={deg} cx="0" cy="-2.4" rx="1.6" ry="2.4" fill={color} transform={`rotate(${deg})`} />
      ))}
      <circle r="1.3" fill="#f5b82e" />
    </g>
  )
}

const FLOWERS = Array.from({ length: 26 }, (_, i) => {
  const x = scatter(i, 61) * 400
  return {
    x,
    // On the ridge of the front hill.
    y: 46 + 10 * Math.sin((x / 400) * Math.PI * 2.2 + 1) + scatter(i, 62) * 18,
    size: 0.9 + scatter(i, 63) * 0.9,
    color: FLOWER_COLORS[i % FLOWER_COLORS.length],
  }
})

const BUTTERFLIES = [
  { path: 'animate-butterfly-a', color: '#d9ccff', size: 26, duration: 19 },
  { path: 'animate-butterfly-b', color: '#fff3a6', size: 22, duration: 24 },
]

/**
 * Pasqua: sera di primavera, un prato fiorito in basso, farfalle, il coniglio che sbuca
 * a sinistra accanto al titolo e l'uovo che si schiude a destra.
 */
export default function EasterScene() {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#2a1a4f_0%,#4a2c6e_28%,#355a74_60%,#24493f_100%)]" />
      {Array.from({ length: 12 }, (_, i) => (
        // Soft pastel bokeh drifting in the evening air.
        <span
          key={i}
          className="absolute animate-twinkle rounded-full blur-[6px] motion-reduce:animate-none"
          style={{
            left: `${scatter(i, 64) * 92}%`,
            top: `${6 + scatter(i, 65) * 70}%`,
            width: 18 + scatter(i, 66) * 30,
            height: 18 + scatter(i, 66) * 30,
            backgroundColor: FLOWER_COLORS[i % FLOWER_COLORS.length],
            opacity: 0.18,
            animationDuration: `${3 + scatter(i, 67) * 3}s`,
            animationDelay: `${-scatter(i, 68) * 4}s`,
          }}
        />
      ))}

      <svg
        viewBox="0 0 400 90"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-[34vh] w-full"
      >
        <path d="M0 40C70 18 130 30 200 22s150-4 200 12V90H0Z" fill="#2c6a3e" />
        <path d="M0 52c60-12 120-2 190-8s150 4 210-4V90H0Z" fill="#3d8a4f" />
      </svg>
      <svg
        viewBox="0 0 400 90"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-x-0 bottom-0 h-[34vh] w-full"
      >
        {FLOWERS.map((flower, i) => (
          <Flower key={i} {...flower} />
        ))}
      </svg>

      {BUTTERFLIES.map(({ path, color, size, duration }) => (
        <span
          key={path}
          className={`absolute top-0 left-0 ${path} motion-reduce:hidden`}
          style={{ width: size, animationDuration: `${duration}s` }}
        >
          <svg viewBox="0 0 30 24" className="block w-full animate-butterfly-flap" aria-hidden="true">
            <ellipse cx="9" cy="8" rx="8" ry="7" fill={color} />
            <ellipse cx="21" cy="8" rx="8" ry="7" fill={color} />
            <ellipse cx="10" cy="17" rx="5.5" ry="5" fill={color} opacity="0.85" />
            <ellipse cx="20" cy="17" rx="5.5" ry="5" fill={color} opacity="0.85" />
            <rect x="14" y="4" width="2" height="16" rx="1" fill="#3b2a3a" />
          </svg>
        </span>
      ))}

      <div className="absolute top-[calc(env(safe-area-inset-top,0px)+24px)] left-0 w-19 animate-bunny-peek motion-reduce:translate-x-[-12%] motion-reduce:animate-none">
        <Bunny />
      </div>

      <div className="absolute top-[calc(env(safe-area-inset-top,0px)+56px)] right-[2%] w-13">
        <HatchingEgg />
      </div>
    </>
  )
}
