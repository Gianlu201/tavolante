import { useEffect, useRef, useState } from 'react'
import {
  podiumFileName,
  podiumText,
  renderPodiumImage,
  shareImage,
} from '../lib/podiumImage'
import { loadSoundOn, playFanfare, saveSoundOn, unlockAudio } from '../lib/sound'
import { offPodium, podiumSteps, standings, type Tournament } from '../lib/tournament'
import Confetti from './Confetti'
import PartyHorn from './PartyHorn'
import PlayerAvatar from './PlayerAvatar'

/** Columns left to right: 2nd, 1st, 3rd. */
const STEP_COLUMNS = [1, 0, 2]

/** Seconds at which each step rises: bronze first, gold last, for the suspense. */
const STEP_REVEAL = [1.9, 1.1, 0.3]
const DROP_AFTER = 0.45
const FANFARE_DELAY = STEP_REVEAL[0] + DROP_AFTER + 0.1
const BASE_ROW_DELAY = FANFARE_DELAY + 0.6
const ACTIONS_DELAY = BASE_ROW_DELAY + 0.3

const STEP_CLASS = [
  'h-[42%] bg-[linear-gradient(180deg,#f3e3b5,var(--color-gold))]',
  'h-[31%] bg-[linear-gradient(180deg,#eef0f3,#a9b0ba)]',
  'h-[23%] bg-[linear-gradient(180deg,#efb98f,#b8693a)]',
]
const RING_CLASS = ['border-gold', 'border-silver', 'border-bronze']

const dateFormat = new Intl.DateTimeFormat('it-IT', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

type PodiumProps = {
  tournament: Tournament
  onClose: () => void
}

export default function Podium({ tournament, onClose }: PodiumProps) {
  const rows = standings(tournament)
  const steps = podiumSteps(rows)
  const others = offPodium(rows)
  const [soundOn, setSoundOn] = useState(loadSoundOn)
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const stopSoundRef = useRef<() => void>(() => {})

  // The tap that opened the podium already unlocked the audio context.
  useEffect(() => {
    if (!loadSoundOn()) return
    const stop = playFanfare(FANFARE_DELAY)
    stopSoundRef.current = stop
    return stop
  }, [])

  // Ready before the tap: iOS refuses to share once a tap has waited on slow work.
  useEffect(() => {
    let cancelled = false
    renderPodiumImage(tournament, standings(tournament))
      .then((blob) => {
        if (!cancelled)
          setFile(new File([blob], podiumFileName(tournament), { type: 'image/png' }))
      })
      .catch(() => {
        if (!cancelled) setMessage("Non sono riuscito a creare l'immagine del podio.")
      })
    return () => {
      cancelled = true
    }
  }, [tournament])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const toggleSound = () => {
    const next = !soundOn
    setSoundOn(next)
    saveSoundOn(next)
    if (next) {
      unlockAudio()
      stopSoundRef.current = playFanfare(0)
    } else {
      stopSoundRef.current()
    }
  }

  const share = async () => {
    if (!file) return
    const result = await shareImage(file)
    setMessage(result === 'downloaded' ? 'Immagine salvata nei download.' : null)
  }

  const hands = tournament.hands.length

  return (
    <div
      className="fixed inset-0 z-40 flex animate-scrim-in flex-col overflow-x-hidden overflow-y-auto bg-felt-3 bg-[radial-gradient(120%_70%_at_50%_0%,rgba(201,161,90,0.2),transparent_60%),radial-gradient(circle_at_50%_45%,var(--color-felt-1),var(--color-felt-3)_75%)] px-4 pt-[calc(18px+env(safe-area-inset-top,0px))] pb-[calc(16px+env(safe-area-inset-bottom,0px))] motion-reduce:animate-none"
      role="dialog"
      aria-modal="true"
      aria-label="Podio del torneo"
    >
      <div className="mx-auto flex w-full max-w-130 flex-1 flex-col gap-4">
        <header className="relative shrink-0 text-center">
          <p className="mb-1 font-mono text-[11px] tracking-[0.16em] text-gold/85 uppercase">
            Torneo di Murlan · {dateFormat.format(tournament.endedAt ?? tournament.startedAt)}
          </p>
          <h2 className="m-0 font-display text-[32px] leading-tight font-semibold text-cream">
            Il <em className="font-medium text-gold-light italic">podio</em>
          </h2>
          <p className="m-0 mt-0.5 text-[12.5px] text-cream/55">
            {hands === 1 ? '1 mano giocata' : `${hands} mani giocate`}
          </p>
          <PartyHorn
            delay={FANFARE_DELAY}
            className="absolute top-6 left-[-2%] w-[29%] -scale-x-100 rotate-[-14deg]"
          />
          <PartyHorn
            delay={FANFARE_DELAY + 0.08}
            className="absolute top-6 right-[-2%] w-[29%] rotate-[-14deg]"
          />
        </header>

        <div className="flex h-[min(48dvh,360px)] shrink-0 items-end justify-center gap-1.5">
          {STEP_COLUMNS.map((step) => {
            const players = steps[step]
            const dropDelay = `${STEP_REVEAL[step] + DROP_AFTER}s`
            return (
              <div key={step} className="flex h-full w-[31%] flex-col items-center justify-end">
                <div
                  className="flex w-full animate-podium-drop flex-col items-center gap-1 pb-2 motion-reduce:animate-none"
                  style={{ animationDelay: dropDelay }}
                >
                  {players.length > 0 ? (
                    <>
                      <div className="flex flex-wrap justify-center gap-1.5">
                        {players.map((player) => (
                          <div
                            key={player.id}
                            className="flex max-w-full min-w-0 flex-col items-center gap-0.5"
                          >
                            <PlayerAvatar
                              name={player.name}
                              avatarId={player.avatarId}
                              className={`border-[3px] ${RING_CLASS[step]} ${
                                players.length > 1
                                  ? 'size-12 text-[12px]'
                                  : step === 0
                                    ? 'size-20 text-[18px] shadow-[0_0_24px_rgba(201,161,90,0.55)]'
                                    : 'size-16 text-[15px]'
                              }`}
                            />
                            <span
                              className={`max-w-full truncate font-semibold text-cream ${
                                players.length > 1 ? 'text-[11px]' : 'text-[13.5px]'
                              }`}
                            >
                              {player.name}
                            </span>
                          </div>
                        ))}
                      </div>
                      <span className="font-mono text-[13px] font-bold text-gold-light">
                        {players[0].points} pt
                      </span>
                    </>
                  ) : (
                    <span className="pb-1 text-[13px] text-cream/30">—</span>
                  )}
                </div>
                <div
                  className={`relative w-full origin-bottom animate-podium-rise rounded-t-[14px] shadow-[inset_0_2px_0_rgba(255,255,255,0.55),0_12px_26px_rgba(0,0,0,0.4)] motion-reduce:animate-none ${STEP_CLASS[step]}`}
                  style={{ animationDelay: `${STEP_REVEAL[step]}s` }}
                >
                  <span className="absolute inset-x-0 top-1.5 text-center font-display text-[40px] leading-none font-bold text-ink/55">
                    {step + 1}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {others.length > 0 && (
          <section
            className="flex shrink-0 animate-fade-up flex-col items-center gap-2 motion-reduce:animate-none"
            style={{ animationDelay: `${BASE_ROW_DELAY}s` }}
          >
            <span className="font-mono text-[10px] tracking-[0.12em] text-gold/75 uppercase">
              Alla base del podio
            </span>
            <ul className="m-0 flex list-none flex-wrap justify-center gap-x-3 gap-y-2 p-0">
              {others.map((row) => (
                <li key={row.id} className="flex w-16 flex-col items-center gap-0.5">
                  <PlayerAvatar
                    name={row.name}
                    avatarId={row.avatarId}
                    className="size-11 border-[1.5px] border-cream/25 text-[12px]"
                  />
                  <span className="max-w-full truncate text-[11.5px] font-semibold text-cream/85">
                    {row.name}
                  </span>
                  <span className="font-mono text-[10.5px] text-gold-light/80">
                    {row.points} pt
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div
          className="mt-auto flex shrink-0 animate-fade-up flex-col gap-2 pt-1 motion-reduce:animate-none"
          style={{ animationDelay: `${ACTIONS_DELAY}s` }}
        >
          <button
            type="button"
            className="w-full cursor-pointer rounded-[14px] bg-[linear-gradient(180deg,var(--color-gold-bright),var(--color-gold))] p-3.5 font-display text-[16px] font-bold text-ink shadow-[0_6px_14px_rgba(201,161,90,0.25)] disabled:cursor-default disabled:opacity-55"
            disabled={!file}
            onClick={share}
          >
            {file ? 'Condividi l’immagine del podio' : 'Preparo l’immagine…'}
          </button>
          <div className="flex gap-2">
            <a
              className="flex flex-1 items-center justify-center gap-1.5 rounded-[13px] border border-[#25d366]/45 bg-[#25d366]/10 px-3 py-3 text-[13px] font-semibold whitespace-nowrap text-[#8ee6ad] no-underline active:bg-[#25d366]/20"
              href={`https://wa.me/?text=${encodeURIComponent(podiumText(tournament, rows))}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-4 shrink-0 fill-none stroke-current stroke-2 [stroke-linejoin:round]"
                aria-hidden="true"
              >
                <path d="M4 20l1.4-4.2A8 8 0 1 1 8.6 19z" />
              </svg>
              Classifica su WhatsApp
            </a>
            <button
              type="button"
              className="flex size-11.5 shrink-0 cursor-pointer items-center justify-center rounded-[13px] border border-cream/20 bg-cream/6 text-[16px]"
              aria-pressed={soundOn}
              aria-label={soundOn ? 'Disattiva il suono' : 'Attiva il suono'}
              onClick={toggleSound}
            >
              {soundOn ? '🔊' : '🔇'}
            </button>
          </div>
          <button
            type="button"
            className="cursor-pointer self-center rounded-xl border-none bg-transparent px-4 py-2 text-[13px] font-semibold text-cream/65 underline decoration-gold/30 underline-offset-3"
            onClick={onClose}
          >
            Chiudi il podio
          </button>
          {message && (
            <p className="m-0 text-center text-[12px] text-cream/60" role="status">
              {message}
            </p>
          )}
        </div>
      </div>

      <Confetti delay={FANFARE_DELAY} />
    </div>
  )
}
