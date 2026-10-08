import { upcomingRange, type Season, type SeasonChoice } from '../lib/seasons'
import { THEME_OPTIONS, themeName } from '../lib/themeOptions'
import BottomSheet from './BottomSheet'

const dayFormat = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short' })

/** «21 mar → 29 mar»: the next occurrence is always within a year, so no year needed. */
const periodLabel = (season: Season, today: Date) => {
  const [first, last] = upcomingRange(season, today)
  const same = first.getTime() === last.getTime()
  return `${dayFormat.format(first)}${same ? '' : ` → ${dayFormat.format(last)}`}`
}

type ThemeLabDrawerProps = {
  choice: SeasonChoice
  /** The theme on screen right now, whatever chose it. */
  season: Season | null
  onChoose: (choice: SeasonChoice) => void
  onClose: () => void
}

/**
 * Il laboratorio dei temi, nascosto: si apre toccando cinque volte di fila il nome nel
 * footer. Forza un tema qualsiasi (anche il classico, durante le feste) e la scelta resta
 * salvata su questo dispositivo finché non si torna ad «Automatico».
 */
export default function ThemeLabDrawer({ choice, season, onChoose, onClose }: ThemeLabDrawerProps) {
  const today = new Date()

  return (
    <BottomSheet label="Laboratorio temi" title="Laboratorio temi" onClose={onClose}>
      <p className="-mt-2 m-0 font-mono text-[10.5px] tracking-[0.06em] text-cream/55">
        {choice === 'auto'
          ? `Automatico · oggi ${season ? themeName(season) : 'nessun tema'}`
          : `${themeName(choice)} · scelto qui`}
      </p>

      <div className="grid grid-cols-2 gap-2">
        {THEME_OPTIONS.map((option) => {
          const active = option.choice === choice
          const detail =
            option.detail ??
            (option.choice !== 'auto' && option.choice !== 'off' && option.choice !== 'mezzanotte'
              ? periodLabel(option.choice, today)
              : '')
          return (
            <button
              key={option.choice}
              type="button"
              className={`flex cursor-pointer items-center gap-2.5 rounded-[14px] border px-3 py-2.5 text-left transition-[background-color,border-color] duration-150 ${
                active ? 'border-gold bg-gold/16' : 'border-cream/14 bg-black/18 active:bg-cream/8'
              }`}
              aria-pressed={active}
              onClick={() => onChoose(option.choice)}
            >
              <span className="text-[22px] leading-none" aria-hidden="true">
                {option.emoji}
              </span>
              <span className="flex min-w-0 flex-col">
                <span
                  className={`truncate text-[13.5px] font-semibold ${active ? 'text-gold-light' : 'text-cream'}`}
                >
                  {option.name}
                </span>
                <span className="truncate text-[11px] text-cream/50">{detail}</span>
              </span>
            </button>
          )
        })}
      </div>

      <p className="m-0 text-[12px] leading-normal text-cream/50">
        Un tema scelto qui resta salvato su questo dispositivo, anche dopo la chiusura
        dell'app, finché non torni su <b className="text-cream/80">Automatico</b>. Toccare
        di nuovo lo stesso tema fa ripartire la sua introduzione.
      </p>
    </BottomSheet>
  )
}
