import { useEffect, useState } from 'react'
import Confetti from '../../components/Confetti'
import PartyHorn from '../../components/PartyHorn'
import { celebrantsOn, joinNames } from '../../lib/birthdays'
import { clockNow } from '../../lib/seasons'
import type { PlayerProfile } from '../../lib/settings'
import { PARTY_COLORS } from './colors'

const INTRO_MS = 5600
/** When the candles go out, in seconds: 48% of the intro, as in the keyframes. */
const BLOW_AT = 2.7

const CANDLES = [
  { x: 56, color: '#2ec4b6' },
  { x: 80, color: '#ffd23f' },
  { x: 104, color: '#a57cf2' },
]

/**
 * L'introduzione del compleanno: arriva la torta con le candeline accese, si spengono
 * con uno sbuffo di fumo, suonano le trombette e compaiono gli auguri con il nome dei
 * festeggiati seduti al tavolo fra i coriandoli. Parte anche quando il festeggiato si
 * siede: a tavola vuota il tema non c'è, e arriva al «Fatto» della personalizzazione. Non intercetta i tocchi; con «riduci animazioni» non c'è.
 */
export default function BirthdayIntro({ profiles }: { profiles: PlayerProfile[] }) {
  const [reducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  // The names as written in the birthday list, whatever the case typed on the seat.
  const [names] = useState(() =>
    celebrantsOn(
      clockNow(),
      profiles.map((profile) => profile.name),
    ).map((birthday) => birthday.name),
  )
  const [done, setDone] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setDone(true), INTRO_MS)
    return () => window.clearTimeout(timer)
  }, [])

  if (done || reducedMotion) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50" aria-hidden="true">
      <div className="absolute inset-0 animate-party-veil bg-[radial-gradient(circle_at_50%_45%,rgba(29,15,61,0.55),rgba(29,15,61,0.9))]" />

      <div className="absolute inset-x-0 top-[24%] flex flex-col items-center gap-3">
        <svg viewBox="0 0 160 150" className="w-[min(52vw,220px)] animate-cake-in">
          <ellipse cx="80" cy="138" rx="74" ry="9" fill="#f4ecdd" opacity="0.9" />
          <rect x="18" y="86" width="124" height="50" rx="8" fill="#cf4f80" />
          <path d="M18 94c0-6 4-8 8-8h108c4 0 8 2 8 8v4c-6 0-6 10-12 10s-6-10-12-10-6 12-12 12-6-12-12-12-6 9-12 9-6-9-12-9-6 12-12 12-6-12-12-12-6 10-12 10-6-10-12-10z" fill="#fff6f9" />
          <rect x="36" y="52" width="88" height="38" rx="7" fill="#9c2c5c" />
          <path d="M36 59c0-5 3-7 7-7h74c4 0 7 2 7 7v3c-5 0-5 8-10 8s-5-8-10-8-5 9-10 9-5-9-10-9-5 7-10 7-5-7-10-7-5 9-10 9-5-9-10-9z" fill="#fff6f9" />
          {[28, 52, 76, 100, 124].map((x, i) => (
            <circle key={x} cx={x + 4} cy="122" r="3" fill={PARTY_COLORS[i % PARTY_COLORS.length]} />
          ))}
          {CANDLES.map((candle) => (
            <g key={candle.x}>
              <rect x={candle.x - 3} y="26" width="6" height="27" rx="1.5" fill={candle.color} />
              <path d={`M${candle.x - 3} 32l6 -4M${candle.x - 3} 40l6 -4M${candle.x - 3} 48l6 -4`} stroke="#fff" strokeOpacity="0.7" strokeWidth="1.6" />
              <line x1={candle.x} y1="26" x2={candle.x} y2="22" stroke="#3a2a20" strokeWidth="1.2" />
              <g className="animate-candle-out" style={{ transformOrigin: `${candle.x}px 22px` }}>
                <path
                  className="animate-flame"
                  style={{ transformOrigin: `${candle.x}px 22px` }}
                  d={`M${candle.x} 8c4 5 5 9 0 14-5-5-4-9 0-14z`}
                  fill="#ffd23f"
                />
                <path d={`M${candle.x} 14c2 3 2 5 0 8-2-3-2-5 0-8z`} fill="#ff9f43" />
              </g>
              <circle
                className="animate-smoke-puff"
                style={{ transformOrigin: `${candle.x}px 18px` }}
                cx={candle.x}
                cy="16"
                r="4"
                fill="#f4ecdd"
                opacity="0"
              />
            </g>
          ))}
        </svg>

        <div className="flex animate-wish-in flex-col items-center px-6 text-center">
          <span className="font-display text-[32px] leading-tight font-bold text-cream [text-shadow:0_2px_12px_rgba(0,0,0,0.6)]">
            Tanti auguri{names.length > 0 ? ',' : '!'}
          </span>
          {names.length > 0 && (
            <span className="font-display text-[28px] leading-tight font-semibold text-gold-light italic [text-shadow:0_2px_12px_rgba(0,0,0,0.6)]">
              {joinNames(names)}!
            </span>
          )}
        </div>
      </div>

      {/* Blown from the edges, towards the cake. */}
      <PartyHorn delay={BLOW_AT} className="absolute top-[15%] left-[-3%] w-[40%] max-w-48 rotate-[22deg]" />
      <PartyHorn
        delay={BLOW_AT + 0.08}
        className="absolute top-[15%] right-[-3%] w-[40%] max-w-48 -scale-x-100 rotate-[-22deg]"
      />

      <Confetti delay={BLOW_AT} count={70} colors={PARTY_COLORS} />
    </div>
  )
}
