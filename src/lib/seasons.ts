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
 * What the app shows: the calendar (`auto`), never a theme (`off`), one theme forced
 * whatever the date, or New Year's Eve a few seconds before midnight (`mezzanotte`).
 */
export type SeasonChoice = 'auto' | 'off' | 'mezzanotte' | Season

const isChoice = (value: string | null): value is SeasonChoice =>
  value === 'auto' || value === 'off' || value === 'mezzanotte' || isSeason(value)

/** The day each theme shows off best, greetings included, in the given year. */
const showcaseDay = (season: Season, year: number): Date => {
  const easter = easterSunday(year)
  const at = (date: Date, hour: number) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour)
  switch (season) {
    case 'capodanno':
      return new Date(year, 11, 31, 22)
    case 'pasqua':
      return at(easter, 18)
    case 'pesce':
      return new Date(year, 3, 1, 12)
    case 'carnevale':
      return at(addDays(easter, -47), 21)
    case 'luminara':
      return new Date(year, 5, 16, 21, 30)
    case 'palio':
      return new Date(year, 5, 17, 19)
    case 'agosto':
      return new Date(year, 7, 10, 22)
    case 'halloween':
      return new Date(year, 9, 31, 21)
    case 'natale':
      return new Date(year, 11, 25, 21)
  }
}

type Override = { season: Season | null; offset: number }

/**
 * A forced theme moves the app clock to its showcase day, so it looks exactly as it
 * will on the day. Only themes, greetings and the April fish read this clock: the
 * tournament keeps the real time.
 */
const overrideFor = (choice: SeasonChoice): Override | null => {
  if (choice === 'auto') return null
  if (choice === 'off') return { season: null, offset: 0 }
  const now = new Date()
  const target =
    choice === 'mezzanotte'
      ? new Date(now.getFullYear(), 11, 31, 23, 59, 48)
      : showcaseDay(choice, now.getFullYear())
  return { season: choice === 'mezzanotte' ? 'capodanno' : choice, offset: target.getTime() - now.getTime() }
}

const CHOICE_KEY = 'tavolante:tema:v1'

/**
 * `?tema=<scelta>` in the address wins for that visit only. Otherwise the choice made in
 * the secret theme panel, saved on this device until «Automatico» is chosen again.
 */
const readChoice = (): SeasonChoice => {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('tema')
    if (isChoice(fromUrl)) return fromUrl
    const saved = localStorage.getItem(CHOICE_KEY)
    if (isChoice(saved)) return saved
  } catch {
    // no URL or storage to read: follow the calendar
  }
  return 'auto'
}

let choice = readChoice()
let override = overrideFor(choice)
let version = 0
const listeners = new Set<() => void>()

/** For `useSyncExternalStore`: the theme choice can change while the app runs. */
export const subscribeSeason = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Bumped on every choice, even the same one again, so intros can replay. */
export const seasonVersion = () => version

export const currentChoice = () => choice

export const chooseSeason = (next: SeasonChoice) => {
  choice = next
  override = overrideFor(next)
  version += 1
  try {
    if (next === 'auto') localStorage.removeItem(CHOICE_KEY)
    else localStorage.setItem(CHOICE_KEY, next)
  } catch {
    // storage unavailable: the choice lasts until the app is closed
  }
  listeners.forEach((listener) => listener())
}

/** The app's clock: the real one, unless a forced theme moved it. */
export const clockNow = () => new Date(Date.now() + (override?.offset ?? 0))

export const seasonAt = (date: Date) => (override ? override.season : seasonOn(date))

/** The current or next occurrence of a theme's period, as seen from `date`. */
export const upcomingRange = (season: Season, date: Date): DayRange => {
  const entry = CALENDAR.find((item) => item.season === season)
  if (!entry) throw new Error(`Unknown season ${season}`)
  const year = date.getFullYear()
  const next = [year - 1, year, year + 1]
    .map((y) => entry.range(y))
    .find(([, last]) => addDays(last, 1) > date)
  return next ?? entry.range(year + 1)
}

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
