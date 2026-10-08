/**
 * Il calendario dei temi stagionali. Ogni tema dichiara i giorni che copre in un dato
 * anno: un periodo fisso, uno a cavallo di Capodanno o uno che si sposta con la
 * Pasqua sono tutti la stessa cosa, una funzione anno → [primo giorno, ultimo giorno].
 */

export const SEASONS = [
  'capodanno',
  'pasqua',
  'pesce',
  'carnevale',
  'luminara',
  'palio',
  'agosto',
  'halloween',
  'natale',
] as const

export type Season = (typeof SEASONS)[number]

/** First and last day, both included, as local dates at midnight. */
type DayRange = readonly [Date, Date]

type SeasonDefinition = {
  season: Season
  /** The days covered by the occurrence that starts in `year`. */
  range: (year: number) => DayRange
  /** Header text on the days that deserve it, instead of «Tavolante · Murlan». */
  greeting?: (date: Date) => string | null
}

const day = (year: number, month: number, date: number) => new Date(year, month - 1, date)

const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

/**
 * Easter Sunday in the Gregorian calendar (anonymous algorithm, as given by Meeus):
 * pure integer arithmetic, so no table to update and no network needed.
 */
export const easterSunday = (year: number) => {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const date = ((h + l - 7 * m + 114) % 31) + 1
  return day(year, month, date)
}

/** Same days every year; when `to` comes before `from` the period ends the next year. */
const fixed =
  ([fromMonth, fromDay]: [number, number], [toMonth, toDay]: [number, number]) =>
  (year: number): DayRange => {
    const wraps = toMonth * 100 + toDay < fromMonth * 100 + fromDay
    return [day(year, fromMonth, fromDay), day(wraps ? year + 1 : year, toMonth, toDay)]
  }

/** Days counted from Easter Sunday: -7 is Palm Sunday, +1 is Easter Monday. */
const fromEaster =
  (fromOffset: number, toOffset: number) =>
  (year: number): DayRange => {
    const easter = easterSunday(year)
    return [addDays(easter, fromOffset), addDays(easter, toOffset)]
  }

const onDays = (text: string, ...days: ((date: Date) => boolean)[]) => (date: Date) =>
  days.some((matches) => matches(date)) ? text : null

const isEaster = (offset: number) => (date: Date) =>
  sameDay(date, addDays(easterSunday(date.getFullYear()), offset))

const isDay = (month: number, date: number) => (when: Date) =>
  when.getMonth() === month - 1 && when.getDate() === date

/**
 * In order of priority: when two periods overlap the first one wins. Capodanno sits
 * inside Natale; Easter Sunday can fall on April 1st (it does in 2029).
 */
const CALENDAR: SeasonDefinition[] = [
  { season: 'capodanno', range: fixed([12, 31], [1, 1]) },
  {
    season: 'pasqua',
    range: fromEaster(-7, 1),
    greeting: onDays('Buona Pasqua · Murlan 🐣', isEaster(0), isEaster(1)),
  },
  { season: 'pesce', range: fixed([4, 1], [4, 1]) },
  {
    // From the Saturday of the third weekend of parades to Martedì grasso.
    season: 'carnevale',
    range: fromEaster(-64, -47),
    greeting: onDays('A Carnevale ogni scherzo vale 🎭', isEaster(-52), isEaster(-47)),
  },
  {
    season: 'luminara',
    range: fixed([6, 16], [6, 16]),
    greeting: () => 'Luminara di San Ranieri ✨',
  },
  {
    season: 'palio',
    range: fixed([6, 17], [6, 17]),
    greeting: () => 'Palio di San Ranieri 🚣',
  },
  {
    season: 'agosto',
    range: fixed([8, 9], [8, 16]),
    greeting: (date) =>
      isDay(8, 10)(date)
        ? 'Notte di San Lorenzo ✨'
        : isDay(8, 15)(date)
          ? 'Buon Ferragosto · Murlan ☀️'
          : null,
  },
  { season: 'halloween', range: fixed([10, 24], [11, 2]) },
  {
    season: 'natale',
    range: fixed([12, 8], [1, 6]),
    greeting: onDays('Buon Natale · Murlan 🎄', isDay(12, 24), isDay(12, 25), isDay(12, 26)),
  },
]

const covers = ([first, last]: DayRange, date: Date) =>
  date >= first && date < addDays(last, 1)

/** A period that wraps over the new year started the year before: check both. */
export const seasonOn = (date: Date): Season | null =>
  CALENDAR.find(
    ({ range }) =>
      covers(range(date.getFullYear()), date) || covers(range(date.getFullYear() - 1), date),
  )?.season ?? null

const isSeason = (value: string | null): value is Season =>
  (SEASONS as readonly string[]).includes(value ?? '')

/**
 * `?tema=<nome>` forces a theme, to try one out or show it off out of season, and
 * `?tema=off` turns them off. `?tema=mezzanotte` is New Year's Eve with the clock set
 * a few seconds before midnight, to watch the countdown.
 */
const readOverride = (): { season: Season | null | undefined; offset: number } => {
  try {
    const value = new URLSearchParams(window.location.search).get('tema')
    if (value === 'off') return { season: null, offset: 0 }
    if (isSeason(value)) return { season: value, offset: 0 }
    if (value === 'mezzanotte') {
      const now = new Date()
      const eve = new Date(now.getFullYear(), 11, 31, 23, 59, 48)
      return { season: 'capodanno', offset: eve.getTime() - now.getTime() }
    }
  } catch {
    // no URL to read: no override
  }
  return { season: undefined, offset: 0 }
}

const override = readOverride()

/** The app's clock: the real one, unless `?tema=mezzanotte` moved it. */
export const clockNow = () => new Date(Date.now() + override.offset)

export const seasonAt = (date: Date) =>
  override.season === undefined ? seasonOn(date) : override.season

/** Wishes shown in the header on the days of the feast itself. */
export const holidayGreeting = (date: Date, season: Season | null) =>
  CALENDAR.find((entry) => entry.season === season)?.greeting?.(date) ?? null

/** Milliseconds until the next local midnight. */
export const msToMidnight = (date: Date) => {
  const midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
  return midnight.getTime() - date.getTime()
}

/** Milliseconds elapsed since the last local midnight. */
export const msSinceMidnight = (date: Date) =>
  date.getTime() - new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()

/** `YYYY-MM-DD` of the local date: a stable key for things that change once a day. */
export const dayKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
