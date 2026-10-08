import { scatter } from '../../lib/scatter'

const SHOOTING_STARS = [
  { top: '3%', left: '72%', duration: 6.5, delay: 1.2, length: 130 },
  { top: '9%', left: '94%', duration: 9, delay: 3.8, length: 110 },
  { top: '1%', left: '46%', duration: 11, delay: 7, length: 150 },
  { top: '16%', left: '99%', duration: 13.5, delay: 9.5, length: 90 },
]

/**
 * Notti d'agosto, fra San Lorenzo e Ferragosto: cielo d'estate con la Via Lattea e le
 * stelle cadenti, lucciole ai lati e il mare che si muove piano in fondo.
 */
export default function AugustScene() {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#030820_0%,#0a1840_38%,#123a5c_66%,#0b3045_80%,#061c2b_100%)]" />
      {/* The Milky Way: a soft diagonal band, dense with tiny stars. */}
      <div className="absolute top-[-10%] left-[-20%] h-[38%] w-[140%] rotate-[-24deg] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(200,210,255,0.16),transparent_70%)] blur-[6px]" />
      {Array.from({ length: 90 }, (_, i) => {
        const inBand = i < 45
        const x = scatter(i, 91) * 100
        const y = inBand ? 4 + x * 0.42 * -1 + 38 + (scatter(i, 92) - 0.5) * 14 : scatter(i, 92) * 55
        return (
          <span
            key={i}
            className={`absolute rounded-full bg-white ${i % 5 === 0 ? 'animate-twinkle motion-reduce:animate-none' : ''}`}
            style={{
              left: `${x}%`,
              top: `${Math.max(0, y)}%`,
              width: 0.8 + scatter(i, 93) * (inBand ? 1.2 : 1.8),
              height: 0.8 + scatter(i, 93) * (inBand ? 1.2 : 1.8),
              opacity: 0.3 + scatter(i, 94) * 0.6,
              animationDuration: `${2 + scatter(i, 95) * 3}s`,
              animationDelay: `${-scatter(i, 96) * 3}s`,
            }}
          />
        )
      })}

      {SHOOTING_STARS.map((star) => (
        <span
          key={star.left}
          // A bright head trailing a fading tail.
          className="absolute h-[2.5px] origin-left animate-shooting-star rounded-full bg-[linear-gradient(270deg,transparent,rgba(255,255,255,0.95))] after:absolute after:top-1/2 after:left-0 after:size-1.5 after:-translate-y-1/2 after:rounded-full after:bg-white after:shadow-[0_0_8px_3px_rgba(220,235,255,0.85)] after:content-[''] motion-reduce:hidden"
          style={{
            top: star.top,
            left: star.left,
            width: star.length,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      {Array.from({ length: 12 }, (_, i) => (
        <span
          key={i}
          className="absolute size-1.5 animate-firefly rounded-full bg-[#d8ff6a] shadow-[0_0_8px_3px_rgba(216,255,106,0.55)] motion-reduce:animate-none"
          style={{
            left: `${i % 2 ? 2 + scatter(i, 97) * 10 : 88 + scatter(i, 97) * 10}%`,
            top: `${30 + scatter(i, 98) * 45}%`,
            animationDuration: `${3 + scatter(i, 99) * 3}s`,
            animationDelay: `${-scatter(i, 100) * 5}s`,
          }}
        />
      ))}

      {[0, 1].map((layer) => (
        <svg
          key={layer}
          viewBox="0 0 800 40"
          preserveAspectRatio="none"
          className={`absolute bottom-0 left-0 h-[9vh] w-[200%] animate-sea-drift motion-reduce:animate-none ${
            layer ? 'bottom-[-2vh] opacity-60' : 'opacity-40'
          }`}
          style={{ animationDuration: layer ? '14s' : '22s' }}
        >
          <path
            d="M0 20q25-10 50 0t50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0V40H0Z"
            fill={layer ? '#0f4a63' : '#1a6a86'}
          />
        </svg>
      ))}
    </>
  )
}
