import type { CSSProperties } from 'react'
import { scatter } from '../lib/scatter'
import type { Season } from '../lib/seasons'
import Fireworks, { type Burst } from './Fireworks'

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

const BULB_COLORS = ['#ff4a4a', '#ffd76a', '#4fd27a', '#5aa2ff', '#ff7ad9']
const BULBS = 15
const WIRE_HEIGHT = 14
/** The wire hangs from four hooks: three shallow dips, above the header text. */
const wireY = (fraction: number) => 1.5 + 8 * Math.sin(Math.PI * ((fraction * 3) % 1))

const HANGING_BAUBLES = [
  { left: '1.5%', string: '6vh', size: 21, glass: '#d6ae66', shine: '#fff1c4', delay: -1.6 },
  { left: '8.5%', string: '14vh', size: 27, glass: '#d42f38', shine: '#ff8a8a', delay: 0 },
]

const SNOWFLAKES = ['❄', '❅', '❆']

function Christmas() {
  const wire = Array.from({ length: 61 }, (_, i) => {
    const fraction = i / 60
    return `${i === 0 ? 'M' : 'L'}${(fraction * 300).toFixed(1)} ${wireY(fraction).toFixed(1)}`
  }).join(' ')

  return (
    <>
      {/* Winter night sky, warming up towards the red table and the panels. */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#0b1430_0%,#13204a_34%,#24173e_68%,#2c0910_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_42%_at_50%_42%,rgba(255,196,120,0.16),transparent_70%)]" />

      {Array.from({ length: 26 }, (_, i) => (
        <span
          key={i}
          className={`absolute rounded-full bg-white ${i % 3 === 0 ? 'animate-twinkle motion-reduce:animate-none' : ''}`}
          style={{
            left: `${scatter(i, 11) * 100}%`,
            top: `${2 + scatter(i, 12) * 40}%`,
            width: 1 + scatter(i, 13) * 1.8,
            height: 1 + scatter(i, 13) * 1.8,
            opacity: 0.35 + scatter(i, 14) * 0.5,
            animationDuration: `${2 + scatter(i, 15) * 2}s`,
            animationDelay: `${-scatter(i, 16) * 3}s`,
          }}
        />
      ))}

      {/* Full moon top right, the stage for Santa's sleigh. */}
      <div className="absolute top-[calc(env(safe-area-inset-top,0px)+20px)] right-[6%] size-16 rounded-full bg-[radial-gradient(circle_at_38%_35%,#fffdf0,#f4ead0_55%,#dcd0a8)] shadow-[0_0_36px_10px_rgba(255,244,214,0.22),0_0_90px_34px_rgba(255,244,214,0.09)]">
        <span className="absolute top-[22%] left-[52%] size-[18%] rounded-full bg-[#cfc296]/45" />
        <span className="absolute top-[52%] left-[26%] size-[24%] rounded-full bg-[#cfc296]/40" />
        <span className="absolute top-[62%] left-[62%] size-[12%] rounded-full bg-[#cfc296]/45" />
      </div>

      <div className="absolute inset-x-0 top-[env(safe-area-inset-top,0px)]">
        <span
          className="absolute top-0 left-0 w-32 animate-sleigh-fly motion-reduce:hidden"
          style={{ animationDelay: '2.5s' }}
        >
          <Sleigh />
          {Array.from({ length: 7 }, (_, i) => (
            <span
              key={i}
              className="absolute animate-twinkle rounded-full bg-[#fff1c4] shadow-[0_0_6px_#ffd76a]"
              style={{
                left: `${96 + i * 7}%`,
                top: `${62 + i * 3 + (i % 2) * 6}%`,
                width: 3.5 - i * 0.35,
                height: 3.5 - i * 0.35,
                opacity: 1 - i * 0.12,
                animationDuration: '0.9s',
                animationDelay: `${-i * 0.2}s`,
              }}
            />
          ))}
        </span>
      </div>

      {HANGING_BAUBLES.map((bauble) => (
        <div
          key={bauble.left}
          className="absolute top-[env(safe-area-inset-top,0px)] flex origin-top animate-bauble-swing flex-col items-center motion-reduce:animate-none"
          style={{ left: bauble.left, animationDelay: `${bauble.delay}s` }}
        >
          <span className="block w-px bg-[#d6ae66]/60" style={{ height: bauble.string }} />
          <span className="-mb-px block h-1.5 w-2 rounded-t-[2px] bg-[linear-gradient(90deg,#8c6a2c,#e2c27a,#8c6a2c)]" />
          <span
            className="block rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.45)]"
            style={{
              width: bauble.size,
              height: bauble.size,
              background: `radial-gradient(circle at 34% 30%, ${bauble.shine}, ${bauble.glass} 45%, color-mix(in srgb, ${bauble.glass} 55%, black))`,
            }}
          />
        </div>
      ))}

      {/* Below the notch: in the installed app the page runs under the status bar. */}
      <div className="absolute inset-x-0 top-[env(safe-area-inset-top,0px)]">
        <svg
          viewBox={`0 0 300 ${WIRE_HEIGHT}`}
          preserveAspectRatio="none"
          className="absolute inset-x-0 top-0 h-3.5 w-full fill-none stroke-[#0f1a12]"
        >
          <path d={wire} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
        </svg>
        {Array.from({ length: BULBS }, (_, i) => {
          const fraction = (i + 0.5) / BULBS
          const color = BULB_COLORS[i % BULB_COLORS.length]
          return (
            <span
              key={i}
              className="absolute flex -translate-x-1/2 flex-col items-center"
              style={{
                left: `${fraction * 100}%`,
                top: `${wireY(fraction) - 1}px`,
                rotate: `${i % 2 === 0 ? -14 : 12}deg`,
              }}
            >
              <span className="block h-1 w-1.5 rounded-[1px] bg-[#26352a]" />
              <span
                // A wave runs along the string: each bulb dims a beat after the last.
                className="block h-3.25 w-2.25 animate-twinkle rounded-[45%_45%_50%_50%/35%_35%_65%_65%] motion-reduce:animate-none"
                style={{
                  backgroundColor: color,
                  boxShadow: `0 0 8px 2px ${color}, inset -1px -2px 2px rgba(0,0,0,0.25)`,
                  animationDuration: '2.2s',
                  animationDelay: `${-i * 0.18}s`,
                }}
              />
            </span>
          )
        })}
      </div>

      {Array.from({ length: 42 }, (_, i) => {
        const glyph = i % 3 === 0
        const size = glyph ? 10 + scatter(i, 3) * 8 : 2.5 + scatter(i, 3) * 4
        const duration = (glyph ? 11 : 9) + scatter(i, 4) * 9
        const fall = {
          left: `${scatter(i, 5) * 100}%`,
          animationDuration: `${duration}s`,
          animationDelay: `${-scatter(i, 7) * duration}s`,
          '--drift': `${(scatter(i, 8) - 0.5) * 70}px`,
        } as CSSProperties
        const sway = {
          animationDuration: `${2.8 + scatter(i, 9) * 2.4}s`,
          animationDelay: `${-scatter(i, 10) * 3}s`,
          '--sway': `${8 + scatter(i, 6) * 14}px`,
        } as CSSProperties
        return (
          <span key={i} className="absolute top-0 animate-snow-fall motion-reduce:hidden" style={fall}>
            {glyph ? (
              <span
                className="block animate-snow-sway leading-none text-white [text-shadow:0_0_6px_rgba(255,255,255,0.7)]"
                style={{ ...sway, fontSize: size, opacity: 0.75 + scatter(i, 2) * 0.25 }}
              >
                {SNOWFLAKES[i % SNOWFLAKES.length]}
              </span>
            ) : (
              <span
                className="block animate-snow-sway rounded-full bg-white"
                style={{ ...sway, width: size, height: size, opacity: 0.45 + scatter(i, 2) * 0.45 }}
              />
            )}
          </span>
        )
      })}
    </>
  )
}

/** Babbo Natale sulla slitta con due renne al galoppo; la prima ha il naso rosso. */
function Sleigh() {
  const reindeer = (ox: number) => (
    <g key={ox}>
      <ellipse cx={ox + 24} cy={34} rx={13} ry={5.6} />
      <path d={`M${ox + 13} 31 L${ox + 7} 22 L${ox + 11} 20.5 L${ox + 17.5} 30 Z`} />
      <ellipse cx={ox + 6} cy={21} rx={4.8} ry={2.9} transform={`rotate(-14 ${ox + 6} 21)`} />
      <g fill="none" strokeWidth="1.6" strokeLinecap="round">
        <path
          d={`M${ox + 8} 19 L${ox + 6} 10.5 M${ox + 6.8} 14 L${ox + 2.5} 11.5 M${ox + 10.5} 19 L${ox + 13} 10.5 M${ox + 11.8} 14 L${ox + 16} 12`}
        />
        <path
          strokeWidth="2.3"
          d={`M${ox + 14} 37 L${ox + 7} 41 L${ox + 4} 45.5 M${ox + 17} 38.5 L${ox + 12} 44.5 M${ox + 32} 37 L${ox + 40} 40.5 L${ox + 45} 39.5 M${ox + 34} 35.5 L${ox + 43} 35`}
        />
      </g>
    </g>
  )

  return (
    <svg
      viewBox="0 0 200 60"
      // Dark against the moon, outlined in gold against the sky.
      className="block w-full fill-[#0d1531] stroke-[#0d1531] [filter:drop-shadow(0_0_1.2px_#f3dfa2)_drop-shadow(0_0_1.2px_#f3dfa2)_drop-shadow(0_0_7px_rgba(243,223,162,0.55))]"
      aria-hidden="true"
    >
      {reindeer(2)}
      {reindeer(50)}
      <circle cx="1.4" cy="21.8" r="2" fill="#ff3b3b" stroke="none" className="drop-shadow-[0_0_4px_#ff3b3b]" />
      <path
        d="M27 32 Q45 25 63 31 M75 32 Q101 21 127 33"
        fill="none"
        strokeWidth="1"
      />
      <path
        d="M112 46 Q112 53 120 53 L188 53 Q196 53 197 47 M128 47 L128 53 M176 47 L176 53"
        fill="none"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path d="M122 47 L119 34 Q118 29 124 30 L150 34 L172 30 Q186 27 190 36 L188 47 Z" stroke="none" />
      <path d="M139 33 Q133 19 146 15 Q157 18 152 33 Z" stroke="none" />
      <circle cx="169" cy="24" r="8" stroke="none" />
      <circle cx="164" cy="14" r="4.6" stroke="none" />
      <path d="M160 12 L169 11 Q166 3 158 2 Z" stroke="none" />
      <circle cx="157.5" cy="2.5" r="2" stroke="none" />
      <path d="M163 25 L146 29" fill="none" strokeWidth="2" strokeLinecap="round" />
    </svg>
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
