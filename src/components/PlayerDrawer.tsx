import { useEffect, useState } from 'react'
import { AVATARS, avatarSrc } from '../lib/avatars'
import { MIN_PLAYERS } from '../lib/dealing'
import {
  MAX_NAME_LENGTH,
  profileInitials,
  type PlayerProfile,
} from '../lib/settings'

const LABEL_CLASS = 'font-mono text-[10px] tracking-[0.08em] text-gold/80 uppercase'
const HINT_CLASS = 'text-[12px] text-cream/50'
const FIELD_CLASS = 'flex flex-col gap-1.75'

const AVATAR_OPTION_CLASS =
  'aspect-square cursor-pointer overflow-hidden rounded-full border-2 bg-cream/6 p-0 font-mono text-[15px] font-bold text-cream/75 transition-[border-color,scale] duration-150 ease-out active:scale-94'

type PlayerDrawerProps = {
  index: number
  profile: PlayerProfile
  canRemove: boolean
  onChange: (patch: Partial<PlayerProfile>) => void
  onRemove: () => void
  onClose: () => void
}

export default function PlayerDrawer({
  index,
  profile,
  canRemove,
  onChange,
  onRemove,
  onClose,
}: PlayerDrawerProps) {
  const [confirmingRemoval, setConfirmingRemoval] = useState(false)
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const initials = profileInitials(profile.name)
  const preview = avatarSrc(profile.avatarId)
  const isCustomised = profile.name !== '' || profile.avatarId !== null

  const avatarOptionClass = (active: boolean) =>
    `${AVATAR_OPTION_CLASS} ${
      active
        ? 'border-gold shadow-[0_0_0_3px_rgba(201,161,90,0.25)]'
        : 'border-cream/18'
    }`

  return (
    <div className="fixed inset-0 z-20 flex flex-col justify-end">
      <div
        className="absolute inset-0 animate-scrim-in bg-[rgba(4,16,12,0.6)] backdrop-blur-[2px] motion-reduce:animate-none"
        onClick={onClose}
      />
      <div
        className="relative mx-auto flex max-h-[88dvh] w-full max-w-130 animate-drawer-in flex-col gap-3.5 overflow-y-auto rounded-t-[22px] border border-b-0 border-gold/28 bg-drawer px-4 pt-2 pb-[calc(16px+env(safe-area-inset-bottom,0px))] shadow-[0_-18px_40px_rgba(0,0,0,0.45)] motion-reduce:animate-none"
        role="dialog"
        aria-modal="true"
        aria-label={`Personalizza il giocatore ${index + 1}`}
      >
        <div className="mx-auto h-1 w-10 rounded-sm bg-cream/25" />

        <header className="flex items-center justify-between">
          <h2 className="m-0 font-display text-[20px] font-semibold text-cream">
            Giocatore {index + 1}
          </h2>
          <button
            type="button"
            className="size-9 cursor-pointer rounded-full border border-cream/18 bg-cream/6 text-[15px] text-cream"
            onClick={onClose}
            aria-label="Chiudi"
          >
            ✕
          </button>
        </header>

        <div className="flex items-start gap-3">
          <span
            className={`mt-4.25 flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-[1.5px] font-mono text-[15px] font-semibold text-cream ${
              preview ? 'border-gold bg-black/25' : 'border-cream/22 bg-cream/10'
            }`}
            aria-hidden="true"
          >
            {preview ? (
              <img src={preview} alt="" className="block size-full object-cover" />
            ) : (
              initials || index + 1
            )}
          </span>
          <label className={`${FIELD_CLASS} min-w-0 flex-1`}>
            <span className={LABEL_CLASS}>Nome</span>
            <input
              type="text"
              className="rounded-xl border border-cream/20 bg-black/25 px-3.5 py-3 text-[16px] font-semibold text-cream focus:border-gold focus:outline-none"
              value={profile.name}
              maxLength={MAX_NAME_LENGTH}
              placeholder={`Giocatore ${index + 1}`}
              autoComplete="off"
              onChange={(event) => onChange({ name: event.target.value })}
            />
            <span className={HINT_CLASS}>
              {initials
                ? `Sul tavolo comparirà «${initials}»`
                : 'Sul tavolo compaiono le prime 3 lettere'}
            </span>
          </label>
        </div>

        <div className={FIELD_CLASS}>
          <span className={LABEL_CLASS}>Personaggio</span>
          {AVATARS.length === 0 ? (
            <p className="m-0 rounded-xl border border-dashed border-cream/22 p-3 text-[12.5px] leading-normal text-cream/60">
              Nessun personaggio disponibile: aggiungi le immagini in{' '}
              <code className="font-mono text-[11.5px] text-gold-light">
                src/assets/avatars/
              </code>{' '}
              (istruzioni in{' '}
              <code className="font-mono text-[11.5px] text-gold-light">
                docs/avatar-prompts.md
              </code>
              ).
            </p>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-2">
              <button
                type="button"
                className={avatarOptionClass(profile.avatarId === null)}
                aria-pressed={profile.avatarId === null}
                onClick={() => onChange({ avatarId: null })}
              >
                {initials || index + 1}
              </button>
              {AVATARS.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  className={avatarOptionClass(profile.avatarId === avatar.id)}
                  aria-pressed={profile.avatarId === avatar.id}
                  aria-label={`Personaggio ${avatar.id}`}
                  onClick={() => onChange({ avatarId: avatar.id })}
                >
                  <img
                    src={avatar.src}
                    alt=""
                    loading="lazy"
                    className="block size-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
          <span className={HINT_CLASS}>
            Se scegli un personaggio, il tavolo mostra l'immagine al posto del nome.
          </span>
        </div>

        <div className="flex gap-2 pt-0.5">
          <button
            type="button"
            className="cursor-pointer rounded-[13px] border border-cream/20 bg-cream/6 px-4.5 py-3.25 text-[13.5px] font-semibold text-cream/85 disabled:cursor-default disabled:opacity-40"
            disabled={!isCustomised}
            onClick={() => onChange({ name: '', avatarId: null })}
          >
            Azzera
          </button>
          <button
            type="button"
            className="flex-1 cursor-pointer rounded-[13px] bg-[linear-gradient(180deg,var(--color-gold-bright),var(--color-gold))] p-3.25 font-display text-[15.5px] font-bold text-ink"
            onClick={onClose}
          >
            Fatto
          </button>
        </div>

        <div className="-mt-1 flex flex-col items-center gap-1.5 border-t border-cream/10 pt-1">
          <button
            type="button"
            className={`w-full cursor-pointer rounded-[13px] border p-3 text-[13.5px] font-semibold transition-[background-color,border-color,color] duration-160 ease-out disabled:cursor-default disabled:opacity-40 ${
              confirmingRemoval
                ? 'border-ember bg-ember text-cream'
                : 'border-ember/45 bg-transparent text-ember-soft'
            }`}
            disabled={!canRemove}
            onClick={() => (confirmingRemoval ? onRemove() : setConfirmingRemoval(true))}
          >
            {confirmingRemoval
              ? 'Tocca di nuovo per confermare'
              : 'Rimuovi questo giocatore dal tavolo'}
          </button>
          {!canRemove && (
            <span className={HINT_CLASS}>Servono almeno {MIN_PLAYERS} giocatori.</span>
          )}
        </div>
      </div>
    </div>
  )
}
