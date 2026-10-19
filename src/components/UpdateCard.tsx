import { useEffect, useId, useRef, useState } from 'react'
import { avatarSrc } from '../lib/avatars'
import { APP_VERSION } from '../lib/updates'
import Confetti from './Confetti'

/** The fan of cards around the new release, left to right. */
const FAN = [
  { rank: 'A', suit: '♠', red: false, angle: -32, delay: 0.25 },
  { rank: 'K', suit: '♥', red: true, angle: -16, delay: 0.35 },
  { rank: 'Q', suit: '♦', red: true, angle: 16, delay: 0.45 },
  { rank: 'J', suit: '♣', red: false, angle: 32, delay: 0.55 },
]

/** Characters from the avatar grid around the cards; places are % of the square stage. */
const FRIENDS = [
  { id: '21-drago', place: 'top-[3%] left-[4%] size-[23%] -rotate-8', delay: 0.7 },
  { id: '16-pixel', place: 'top-[1%] right-[6%] size-[20%] rotate-6', delay: 0.85 },
  { id: '25-bu', place: 'top-[38%] left-[2%] size-[16%] rotate-6', delay: 1 },
  { id: '18-yeti', place: 'top-[34%] right-[2%] size-[17%] -rotate-6', delay: 1.15 },
]

const SPARKLES = [
  { place: 'top-[12%] left-[38%] text-[6cqw] text-gold-light', delay: 0 },
  { place: 'top-[24%] right-[30%] text-[4.5cqw] text-[#2ec4b6]', delay: 0.6 },
  { place: 'top-[4%] left-[56%] text-[4cqw] text-[#ffd23f]', delay: 1.2 },
  { place: 'top-[62%] left-[16%] text-[4.5cqw] text-[#a57cf2]', delay: 0.9 },
  { place: 'top-[60%] right-[15%] text-[5.5cqw] text-ember-soft', delay: 0.3 },
]

const CONFETTI_COLORS = ['#ffd23f', '#2ec4b6', '#a57cf2', '#e08363', '#ecd8a3', '#f4ecdd']

const CARD_FACE_CLASS =
  'relative size-full rounded-[12%] border border-cream-deep bg-[linear-gradient(160deg,#fffaf0,var(--color-cream)_55%,var(--color-cream-deep))] shadow-[0_8px_18px_rgba(0,0,0,0.45)]'

const CORNER_CLASS =
  'absolute flex flex-col items-center font-display text-[5.2cqw] leading-[0.95] font-bold'

const CENTER_CORNER_CLASS = 'absolute font-mono text-[3.8cqw] leading-none font-bold text-gold'

/** «2.1.0» → «2.1»: the number that earned the card. */
const releaseLabel = APP_VERSION.split('.').slice(0, 2).join('.')

type UpdateCardProps = {
  /** Wait this long before showing up: a theme intro owns the first seconds. */
  delayMs?: number
  onClose: () => void
}

/**
 * Il biglietto che annuncia una nuova versione: un ventaglio di carte con al centro
 * quella della release, qualche personaggio della griglia e i coriandoli. Si chiude
 * dal pulsante, toccando fuori o con Esc. Quando compare lo decide lib/updates.
 */
export default function UpdateCard({ delayMs = 0, onClose }: UpdateCardProps) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  // Intros do not play with «reduce motion», so there is nothing to wait for.
  const [shown, setShown] = useState(
    () => delayMs === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    if (shown) return
    const timer = window.setTimeout(() => setShown(true), delayMs)
    return () => window.clearTimeout(timer)
  }, [shown, delayMs])

  useEffect(() => {
    if (!shown) return
    // The card itself, not the button: no focus ring on the button on a phone.
    dialogRef.current?.focus({ preventScroll: true })
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [shown, onClose])

  if (!shown) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4 pt-[calc(20px+env(safe-area-inset-top,0px))] pb-[calc(20px+env(safe-area-inset-bottom,0px))]">
      <div
        className="absolute inset-0 animate-scrim-in bg-[rgba(4,16,12,0.65)] backdrop-blur-[3px] motion-reduce:animate-none"
        onClick={onClose}
      />

      <div
        ref={dialogRef}
        className="relative flex h-[min(86dvh,100%,740px)] w-full max-w-110 animate-update-in flex-col overflow-hidden rounded-[28px] border border-gold/35 bg-felt-3 bg-[radial-gradient(120%_55%_at_50%_0%,rgba(201,161,90,0.22),transparent_60%),radial-gradient(circle_at_50%_38%,var(--color-felt-1),var(--color-felt-3)_78%)] shadow-[0_24px_60px_rgba(0,0,0,0.55)] outline-none motion-reduce:animate-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        {/* Sized by its own box, so the stage inside can be the largest square that fits. */}
        <div
          className="relative flex min-h-0 flex-1 items-center justify-center pt-3 [container-type:size]"
          aria-hidden="true"
        >
          {/* Only over the drawing, fading out before the text. */}
          <Confetti
            delay={0.5}
            count={30}
            colors={CONFETTI_COLORS}
            className="absolute inset-0 [mask-image:linear-gradient(180deg,#000_65%,transparent)]"
          />

          <div className="@container relative size-[min(100cqw,100cqh)]">
            <div className="absolute top-[56%] left-1/2 size-[80%] -translate-1/2 rounded-full bg-[radial-gradient(circle,rgba(236,216,163,0.24),transparent_68%)]" />

            {FRIENDS.map((friend) => (
              <div key={friend.id} className={`absolute ${friend.place}`}>
                <div
                  className="size-full animate-place-pop motion-reduce:animate-none"
                  style={{ animationDelay: `${friend.delay}s`, animationFillMode: 'both' }}
                >
                  <img
                    src={avatarSrc(friend.id) ?? undefined}
                    alt=""
                    className="block size-full animate-float rounded-full border-[2.5px] border-gold-light object-cover shadow-[0_6px_14px_rgba(0,0,0,0.4)] motion-reduce:animate-none"
                    style={{ animationDelay: `${-friend.delay * 1.7}s` }}
                    draggable={false}
                  />
                </div>
              </div>
            ))}

            {SPARKLES.map((sparkle) => (
              <span
                key={sparkle.place}
                className={`absolute animate-twinkle leading-none motion-reduce:animate-none ${sparkle.place}`}
                style={{ animationDelay: `${sparkle.delay}s` }}
              >
                ✦
              </span>
            ))}

            <div className="absolute bottom-[10%] left-1/2 aspect-[5/7] w-[25%] -translate-x-1/2">
              {FAN.map((card) => (
                <div
                  key={card.rank}
                  className="absolute inset-0 origin-[50%_135%]"
                  style={{ rotate: `${card.angle}deg` }}
                >
                  <div
                    className={`${CARD_FACE_CLASS} animate-podium-drop motion-reduce:animate-none ${card.red ? 'text-ember' : 'text-ink'}`}
                    style={{ animationDelay: `${card.delay}s` }}
                  >
                    <span className={`${CORNER_CLASS} top-[6%] left-[9%]`}>
                      {card.rank}
                      <span className="text-[0.8em]">{card.suit}</span>
                    </span>
                    <span className="absolute inset-0 flex items-center justify-center text-[11cqw] leading-none">
                      {card.suit}
                    </span>
                  </div>
                </div>
              ))}

              {/* The release itself, on top of the fan and a little higher. */}
              <div className="absolute inset-0 -translate-y-[10%] scale-110">
                <div
                  className={`${CARD_FACE_CLASS} animate-place-pop border-2 border-gold shadow-[0_0_26px_rgba(236,216,163,0.45),0_10px_22px_rgba(0,0,0,0.5)] motion-reduce:animate-none`}
                  style={{ animationDelay: '0.75s', animationFillMode: 'both' }}
                >
                  <span className={`${CENTER_CORNER_CLASS} top-[7%] left-[9%]`}>
                    {releaseLabel}
                  </span>
                  <span className={`${CENTER_CORNER_CLASS} right-[9%] bottom-[7%] rotate-180`}>
                    {releaseLabel}
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(180deg,var(--color-gold-bright),#a87a32)] bg-clip-text text-[15cqw] leading-none text-transparent">
                    ★
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="relative flex shrink-0 animate-fade-up flex-col items-center gap-2 px-6 text-center motion-reduce:animate-none"
          style={{ animationDelay: '0.35s' }}
        >
          <p className="m-0 font-mono text-[11px] tracking-[0.16em] text-gold/85 uppercase">
            Nuova versione · {APP_VERSION}
          </p>
          <h2
            id={titleId}
            className="m-0 font-display text-[28px] leading-tight font-semibold text-balance text-cream"
          >
            Tavolante si è
            <br />
            <em className="font-medium text-gold-light italic">aggiornato</em>
          </h2>
          <p className="m-0 max-w-76 text-[14px] leading-normal text-balance text-cream/70">
            Abbiamo rimescolato il mazzo: in questa versione trovi qualche novità e qualche ritocco.
            Buone partite!
          </p>
        </div>

        <div
          className="relative shrink-0 animate-fade-up px-5 pt-5 pb-5 motion-reduce:animate-none"
          style={{ animationDelay: '0.5s' }}
        >
          <button
            type="button"
            className="w-full cursor-pointer rounded-[14px] bg-[linear-gradient(180deg,var(--color-gold-bright),var(--color-gold))] p-3.5 font-display text-[16px] font-bold text-ink shadow-[0_6px_14px_rgba(201,161,90,0.25)]"
            onClick={onClose}
          >
            Si gioca!
          </button>
        </div>
      </div>
    </div>
  )
}
