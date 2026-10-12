import { useState } from 'react'
import { BIRTHDAYS, birthdayIn } from '../lib/birthdays'
import {
  currentBirthdayDay,
  dayKey,
  parseDayKey,
  upcomingRange,
  type Season,
  type SeasonChoice,
} from '../lib/seasons'
import { THEME_OPTIONS, choiceLabel, themeName } from '../lib/themeOptions'
import BottomSheet from './BottomSheet'

const dayFormat = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short' })
const longDayFormat = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long' })

const LABEL_CLASS = 'font-mono text-[10px] tracking-[0.08em] text-gold/80 uppercase'
const HINT_CLASS = 'm-0 text-[12px] leading-normal text-cream/50'

const PRIMARY_BUTTON_CLASS =
  'w-full cursor-pointer rounded-[13px] bg-[linear-gradient(180deg,var(--color-gold-bright),var(--color-gold))] p-3.25 font-display text-[15.5px] font-bold text-ink disabled:cursor-default disabled:opacity-45'

/** «21 mar → 29 mar»: the next occurrence is always within a year, so no year needed. */
const periodLabel = (season: Season, today: Date) => {
  const next = upcomingRange(season, today)
  if (!next) return 'nessuna data'
  const [first, last] = next
  const same = first.getTime() === last.getTime()
  return `${dayFormat.format(first)}${same ? '' : ` → ${dayFormat.format(last)}`}`
}

/** Every birthday on the list at its next occurrence, soonest first. */
const upcomingBirthdays = (today: Date) => {
  const midnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return BIRTHDAYS.map((birthday) => {
    const thisYear = birthdayIn(birthday, today.getFullYear())
    const date = thisYear < midnight ? birthdayIn(birthday, today.getFullYear() + 1) : thisYear
    return { name: birthday.name, date, key: dayKey(date) }
  }).sort((a, b) => a.date.getTime() - b.date.getTime())
}

type ThemeLabDrawerProps = {
  choice: SeasonChoice
  /** The theme on screen right now, whatever chose it. */
  season: Season | null
  /** `birthdayDay` is the `YYYY-MM-DD` picked for a birthday, else null. */
  onChoose: (choice: SeasonChoice, birthdayDay: string | null) => void
  onClose: () => void
}

/**
 * Il laboratorio dei temi, nascosto: si apre toccando cinque volte di fila il nome nel
 * footer. Forza un tema qualsiasi (anche il classico, durante le feste) e la scelta resta
 * salvata su questo dispositivo finché non si torna ad «Automatico». Il compleanno chiede
 * prima il giorno da festeggiare (uno della lista o una data qualsiasi) e, come nel
 * calendario, si vede solo con il festeggiato di quel giorno seduto al tavolo.
 */
export default function ThemeLabDrawer({ choice, season, onChoose, onClose }: ThemeLabDrawerProps) {
  const today = new Date()
  const birthdays = upcomingBirthdays(today)
  const savedDay = choice === 'compleanno' ? currentBirthdayDay() : null
  const [picking, setPicking] = useState(false)
  const [day, setDay] = useState(() => savedDay ?? birthdays[0]?.key ?? dayKey(today))
  const picked = parseDayKey(day)

  return (
    <BottomSheet label="Laboratorio temi" title="Laboratorio temi" onClose={onClose}>
      <p className="-mt-2 m-0 font-mono text-[10.5px] tracking-[0.06em] text-cream/55">
        {choice === 'auto'
          ? `Automatico · oggi ${season ? themeName(season) : 'nessun tema'}`
          : `${choiceLabel(choice, savedDay)} · scelto qui`}
      </p>

      {picking ? (
        <>
          <button
            type="button"
            className="-mt-1 cursor-pointer self-start border-none bg-transparent p-0 text-[13px] font-semibold text-cream/70"
            onClick={() => setPicking(false)}
          >
            ← Tutti i temi
          </button>

          <label className="flex flex-col gap-1.75">
            <span className={LABEL_CLASS}>🎂 Giorno da festeggiare</span>
            <input
              type="date"
              className="rounded-xl border border-cream/20 bg-black/25 px-3.5 py-3 text-[16px] font-semibold text-cream [color-scheme:dark] focus:border-gold focus:outline-none"
              value={day}
              onChange={(event) => setDay(event.target.value)}
            />
          </label>

          {birthdays.length > 0 && (
            <div className="flex flex-col gap-1.75">
              <span className={LABEL_CLASS}>Compleanni in lista</span>
              <div className="flex flex-wrap gap-2">
                {birthdays.map((birthday) => {
                  // Same day of the year, whatever year the date field shows.
                  const active = day.slice(5) === birthday.key.slice(5)
                  return (
                    <button
                      key={`${birthday.name}-${birthday.key}`}
                      type="button"
                      className={`cursor-pointer rounded-full border px-3 py-1.5 text-[12.5px] font-semibold transition-[background-color,border-color] duration-150 ${
                        active
                          ? 'border-gold bg-gold/16 text-gold-light'
                          : 'border-cream/16 bg-black/18 text-cream/80 active:bg-cream/8'
                      }`}
                      aria-pressed={active}
                      onClick={() => setDay(birthday.key)}
                    >
                      {birthday.name} · {dayFormat.format(birthday.date)}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <p className={HINT_CLASS}>
            L'orologio dell'app va alla sera di quel giorno. La festa si vede solo con il
            festeggiato seduto al tavolo: finché non c'è resta la grafica classica, e durante
            la personalizzazione dei giocatori si ricontrolla al «Fatto».
          </p>

          <button
            type="button"
            className={PRIMARY_BUTTON_CLASS}
            disabled={!picked}
            onClick={() => onChoose('compleanno', day)}
          >
            {picked ? `Festeggia il ${longDayFormat.format(picked)}` : 'Scegli un giorno'}
          </button>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2">
            {THEME_OPTIONS.map((option) => {
              const active = option.choice === choice
              const savedDate = option.choice === 'compleanno' ? parseDayKey(savedDay) : null
              const detail =
                option.detail ??
                (savedDate
                  ? dayFormat.format(savedDate)
                  : option.choice !== 'auto' && option.choice !== 'off' && option.choice !== 'mezzanotte'
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
                  onClick={() =>
                    option.choice === 'compleanno' ? setPicking(true) : onChoose(option.choice, null)
                  }
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
        </>
      )}
    </BottomSheet>
  )
}
