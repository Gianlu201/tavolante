import type { CSSProperties } from 'react'
import type { Season } from '../lib/seasons'
import Fireworks, { type Burst } from './Fireworks'

/** Deterministic scatter: no Math.random during render, the same scene every time. */
const scatter = (i: number, salt: number) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453
  return x - Math.floor(x)
}

/**
 * Decorazioni stagionali dietro a tutto il resto: stanno ai bordi e sopra lo sfondo,
 * mai sui posti, così il giocatore di partenza in oro resta la cosa più visibile.
 */
export default function SeasonLayer({ season }: { season: Season }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {season === 'halloween' && <Halloween />}
      {season === 'natale' && <Christmas />}
      {season === 'capodanno' && <NewYearsEve />}
    </div>
  )
}

const BATS = [
  { top: '9%', size: 44, duration: 24, delay: 1 },
  { top: '21%', size: 32, duration: 29, delay: 9 },
  { top: '14%', size: 38, duration: 34, delay: 18 },
]

function Halloween() {
  return (
    <>
      <div className="absolute inset-x-0 bottom-0 h-[45%] bg-[radial-gradient(70%_90%_at_50%_100%,rgba(226,116,42,0.2),transparent_70%)]" />

      <svg
        viewBox="0 0 120 120"
        className="absolute top-0 left-0 w-28 fill-none stroke-cream/25 stroke-[1.2]"
      >
        {[0, 18, 36, 54, 72, 90].map((angle) => (
          <line
            key={angle}
            x1="0"
            y1="0"
            x2={120 * Math.cos((angle * Math.PI) / 180)}
            y2={120 * Math.sin((angle * Math.PI) / 180)}
          />
        ))}
        {[28, 52, 78, 104].map((r) => (
          <path
            key={r}
            d={[0, 18, 36, 54, 72, 90]
              .map((angle, i) => {
                const rad = (angle * Math.PI) / 180
                const point = `${r * Math.cos(rad)} ${r * Math.sin(rad)}`
                return i === 0 ? `M${point}` : `Q${(r * 0.82 * Math.cos(rad - 0.157)).toFixed(1)} ${(r * 0.82 * Math.sin(rad - 0.157)).toFixed(1)} ${point}`
              })
              .join(' ')}
          />
        ))}
      </svg>

      {/* The thread starts above the screen, so it never detaches while bobbing. */}
      <div className="absolute -top-[10vh] right-[9%] flex animate-spider-bob flex-col items-center motion-reduce:animate-none">
        <span className="block h-[27vh] w-px bg-cream/30" />
        <svg viewBox="0 0 40 36" className="-mt-1 w-7 fill-[#120a16] stroke-[#120a16]">
          {[-1, 1].map((side) =>
            [6, 12, 18, 24].map((y, i) => (
              <path
                key={`${side}${y}`}
                d={`M20 ${16 + i * 1.5} Q${20 + side * 12} ${y - 2} ${20 + side * (16 + (i % 2) * 2)} ${y + 6}`}
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )),
          )}
          <ellipse cx="20" cy="20" rx="8" ry="9" />
          <circle cx="20" cy="9" r="5" />
          <circle cx="18" cy="8" r="1.2" fill="#e2742a" stroke="none" />
          <circle cx="22" cy="8" r="1.2" fill="#e2742a" stroke="none" />
        </svg>
      </div>

      {BATS.map((bat) => (
        <span
          key={bat.top}
          className="absolute left-0 animate-bat-fly motion-reduce:hidden"
          style={{
            top: bat.top,
            width: bat.size,
            animationDuration: `${bat.duration}s`,
            animationDelay: `${bat.delay}s`,
          }}
        >
          <svg viewBox="0 0 64 32" className="block w-full animate-bat-flap fill-[#120a16]">
            <path d="M32 9c-1.6-3-3.2-3.4-4.4-1C24 4 16 2 6 4c5 3 6 7 4 11 5-2 9 0 11 4 3-3 6-2 8 2l3 3 3-3c2-4 5-5 8-2 2-4 6-6 11-4-2-4-1-8 4-11-10-2-18 0-21.6 4-1.2-2.4-2.8-2-4.4 1z" />
          </svg>
        </span>
      ))}
    </>
  )
}

const BULB_COLORS = ['#e2453c', '#ecd8a3', '#3fae5f', '#4f8fe0']
const BULBS = 13
const WIRE_HEIGHT = 14
/** The wire hangs from four hooks: three shallow dips, above the header text. */
const wireY = (fraction: number) => 1.5 + 8 * Math.sin(Math.PI * ((fraction * 3) % 1))

function Christmas() {
  const wire = Array.from({ length: 61 }, (_, i) => {
    const fraction = i / 60
    return `${i === 0 ? 'M' : 'L'}${(fraction * 300).toFixed(1)} ${wireY(fraction).toFixed(1)}`
  }).join(' ')

  return (
    <>
      {/* Below the notch: in the installed app the page runs under the status bar. */}
      <div className="absolute inset-x-0 top-[env(safe-area-inset-top,0px)]">
        <svg
          viewBox={`0 0 300 ${WIRE_HEIGHT}`}
          preserveAspectRatio="none"
          className="absolute inset-x-0 top-0 h-3.5 w-full fill-none stroke-[#1d2a22]"
        >
          <path d={wire} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </svg>
        {Array.from({ length: BULBS }, (_, i) => {
          const fraction = (i + 0.5) / BULBS
          const color = BULB_COLORS[i % BULB_COLORS.length]
          return (
            <span
              key={i}
              className="absolute h-2.25 w-1.5 -translate-x-1/2 animate-twinkle rounded-full motion-reduce:animate-none"
              style={{
                left: `${fraction * 100}%`,
                top: `${wireY(fraction)}px`,
                backgroundColor: color,
                boxShadow: `0 0 7px 2px ${color}`,
                animationDuration: `${1.6 + scatter(i, 1) * 1.2}s`,
                animationDelay: `${-scatter(i, 2) * 2}s`,
              }}
            />
          )
        })}
      </div>

      {Array.from({ length: 34 }, (_, i) => {
        const size = 2.5 + scatter(i, 3) * 4.5
        const duration = 9 + scatter(i, 4) * 9
        const style = {
          left: `${scatter(i, 5) * 100}%`,
          width: size,
          height: size,
          opacity: 0.45 + scatter(i, 6) * 0.45,
          animationDuration: `${duration}s`,
          animationDelay: `${-scatter(i, 7) * duration}s`,
          '--drift': `${(scatter(i, 8) - 0.5) * 90}px`,
        } as CSSProperties
        return (
          <span
            key={i}
            className="absolute top-0 animate-snow-fall rounded-full bg-white motion-reduce:hidden"
            style={style}
          />
        )
      })}
    </>
  )
}

const SKY_BURSTS: Burst[] = [
  { x: 16, y: 13, delay: 0.6, color: '#ecd8a3' },
  { x: 82, y: 9, delay: 2.8, color: '#e08363' },
  { x: 58, y: 20, delay: 4.7, color: '#c9ced6' },
]

function NewYearsEve() {
  return (
    <>
      <div className="absolute inset-x-0 top-0 h-[50%] bg-[radial-gradient(80%_70%_at_50%_0%,rgba(214,174,102,0.16),transparent_70%)]" />
      {Array.from({ length: 16 }, (_, i) => (
        <span
          key={i}
          className="absolute animate-twinkle text-gold-light motion-reduce:animate-none"
          style={{
            // Stars stay at the edges, away from the table in the middle.
            left: `${i % 2 === 0 ? 1 + scatter(i, 1) * 9 : 90 + scatter(i, 1) * 8}%`,
            top: `${4 + scatter(i, 2) * 88}%`,
            fontSize: `${8 + scatter(i, 3) * 9}px`,
            animationDuration: `${1.8 + scatter(i, 4) * 2}s`,
            animationDelay: `${-scatter(i, 5) * 3}s`,
          }}
        >
          ✦
        </span>
      ))}
      <Fireworks bursts={SKY_BURSTS} cycle={6.5} radius={44} className="opacity-75" />
    </>
  )
}
