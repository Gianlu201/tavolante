import { birthdayIn, birthdaysOf, celebrantsOn, joinNames } from './birthdays'

/**
 * Il calendario dei temi stagionali. Ogni tema dichiara i giorni che copre in un dato
 * anno: un periodo fisso, uno a cavallo di Capodanno, uno che si sposta con la Pasqua
 * o i singoli giorni dei compleanni sono tutti la stessa cosa, una funzione
 * anno → elenco di [primo giorno, ultimo giorno].
 */

export const SEASONS = [
  'compleanno',
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
  /**
   * The days covered by the occurrences that start in `year`. `guests` are the names at
   * the table, for the themes that depend on who is playing; omitted, everyone counts.
   */
  periods: (year: number, guests?: string[]) => DayRange[]
  /** Header text on the days that deserve it, instead of «Tavolante · Murlan». */
  greeting?: (date: Date, guests?: string[]) => string | null
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
  (year: number): DayRange[] => {
    const wraps = toMonth * 100 + toDay < fromMonth * 100 + fromDay
    return [[day(year, fromMonth, fromDay), day(wraps ? year + 1 : year, toMonth, toDay)]]
  }

/** Days counted from Easter Sunday: -7 is Palm Sunday, +1 is Easter Monday. */
const fromEaster =
  (fromOffset: number, toOffset: number) =>
  (year: number): DayRange[] => {
    const easter = easterSunday(year)
    return [[addDays(easter, fromOffset), addDays(easter, toOffset)]]
  }

const onDays = (text: string, ...days: ((date: Date) => boolean)[]) => (date: Date) =>
  days.some((matches) => matches(date)) ? text : null

const isEaster = (offset: number) => (date: Date) =>
  sameDay(date, addDays(easterSunday(date.getFullYear()), offset))

const isDay = (month: number, date: number) => (when: Date) =>
  when.getMonth() === month - 1 && when.getDate() === date

/**
 * In order of priority: when two periods overlap the first one wins. A birthday of
 * someone at the table beats every feast; Capodanno sits inside Natale; Easter Sunday
 * can fall on April 1st (it does in 2029).
 */
const CALENDAR: SeasonDefinition[] = [
  {
    season: 'compleanno',
    periods: (year, guests) =>
      birthdaysOf(guests).map((birthday): DayRange => {
        const date = birthdayIn(birthday, year)
        return [date, date]
      }),
    greeting: (date, guests) => {
      const names = celebrantsOn(date, guests).map((birthday) => birthday.name)
      return names.length > 0 ? `Buon compleanno ${joinNames(names)} 🎂` : null
    },
  },
  { season: 'capodanno', periods: fixed([12, 31], [1, 1]) },
  {
    season: 'pasqua',
    periods: fromEaster(-7, 1),
    greeting: onDays('Buona Pasqua · Murlan 🐣', isEaster(0), isEaster(1)),
  },
  { season: 'pesce', periods: fixed([4, 1], [4, 1]) },
  {
    // From the Saturday of the third weekend of parades to Martedì grasso.
    season: 'carnevale',
    periods: fromEaster(-64, -47),
    greeting: onDays('A Carnevale ogni scherzo vale 🎭', isEaster(-52), isEaster(-47)),
  },
  {
    season: 'luminara',
    periods: fixed([6, 16], [6, 16]),
    greeting: () => 'Luminara di San Ranieri ✨',
  },
  {
    season: 'palio',
    periods: fixed([6, 17], [6, 17]),
    greeting: () => 'Palio di San Ranieri 🚣',
  },
  {
    season: 'agosto',
    periods: fixed([8, 9], [8, 16]),
    greeting: (date) =>
      isDay(8, 10)(date)
        ? 'Notte di San Lorenzo ✨'
        : isDay(8, 15)(date)
          ? 'Buon Ferragosto · Murlan ☀️'
          : null,
  },
  { season: 'halloween', periods: fixed([10, 24], [11, 2]) },
  {
    season: 'natale',
    periods: fixed([12, 8], [1, 6]),
    greeting: onDays('Buon Natale · Murlan 🎄', isDay(12, 24), isDay(12, 25), isDay(12, 26)),
  },
]

const covers = ([first, last]: DayRange, date: Date) =>
  date >= first && date < addDays(last, 1)

/**
 * The theme of `date` for the names at the table (everyone when omitted). A period that
 * wraps over the new year started the year before: check both.
 */
export const seasonOn = (date: Date, guests?: string[]): Season | null =>
  CALENDAR.find(({ periods }) =>
    [...periods(date.getFullYear(), guests), ...periods(date.getFullYear() - 1, guests)].some(
      (range) => covers(range, date),
    ),
  )?.season ?? null

/**
 * The current or next occurrence of a theme's period, as seen from `date`; null for a
 * theme with no days at all (an empty birthday list).
 */
export const upcomingRange = (season: Season, date: Date): DayRange | null => {
  const entry = CALENDAR.find((item) => item.season === season)
  if (!entry) throw new Error(`Unknown season ${season}`)
  const year = date.getFullYear()
  return (
    [year - 1, year, year + 1]
      .flatMap((y) => entry.periods(y))
      .sort(([a], [b]) => a.getTime() - b.getTime())
      .find(([, last]) => addDays(last, 1) > date) ?? null
  )
}

const isSeason = (value: string | null): value is Season =>
  (SEASONS as readonly string[]).includes(value ?? '')

/**
 * What the app shows: the calendar (`auto`), never a theme (`off`), one theme forced
 * whatever the date, or New Year's Eve a few seconds before midnight (`mezzanotte`).
 */
export type SeasonChoice = 'auto' | 'off' | 'mezzanotte' | Season

const isChoice = (value: string | null): value is SeasonChoice =>
  value === 'auto' || value === 'off' || value === 'mezzanotte' || isSeason(value)

/** The day each theme shows off best, greetings included, as seen from `now`. */
const showcaseDay = (season: Season, now: Date): Date => {
  const year = now.getFullYear()
  const easter = easterSunday(year)
  const at = (date: Date, hour: number) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour)
  switch (season) {
    case 'compleanno': {
      // The next birthday on the list, or today when the list is empty.
      const [first] = upcomingRange('compleanno', now) ?? [now]
      return at(first, 20)
    }
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

/** A `YYYY-MM-DD` key back to its local date, or null when it is not a real day. */
export const parseDayKey = (key: string | null) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key ?? '')
  if (!match) return null
  const [year, month, date] = match.slice(1).map(Number)
  const parsed = day(year, month, date)
  return parsed.getMonth() === month - 1 && parsed.getDate() === date ? parsed : null
}

/**
 * A forced theme moves the app clock to its showcase day, so it looks exactly as it
 * will on the day; a forced birthday goes to the evening of `birthdayDay` when one was
 * picked. Only themes, greetings and the April fish read this clock: the tournament
 * keeps the real time.
 */
const overrideFor = (choice: SeasonChoice, birthdayDay: string | null): Override | null => {
  if (choice === 'auto') return null
  if (choice === 'off') return { season: null, offset: 0 }
  const now = new Date()
  const picked = choice === 'compleanno' ? parseDayKey(birthdayDay) : null
  const target =
    choice === 'mezzanotte'
      ? new Date(now.getFullYear(), 11, 31, 23, 59, 48)
      : picked
        ? new Date(picked.getFullYear(), picked.getMonth(), picked.getDate(), 20)
        : showcaseDay(choice, now)
  return { season: choice === 'mezzanotte' ? 'capodanno' : choice, offset: target.getTime() - now.getTime() }
}

const CHOICE_KEY = 'tavolante:tema:v1'
const BIRTHDAY_DAY_KEY = 'tavolante:tema:giorno:v1'

type StoredChoice = { choice: SeasonChoice; birthdayDay: string | null }

/**
 * `?tema=<scelta>` in the address wins for that visit only. Otherwise the choice made in
 * the secret theme panel, with the day picked for a birthday, saved on this device
 * until «Automatico» is chosen again.
 */
const readChoice = (): StoredChoice => {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('tema')
    if (isChoice(fromUrl)) return { choice: fromUrl, birthdayDay: null }
    const saved = localStorage.getItem(CHOICE_KEY)
    if (isChoice(saved)) {
      const birthdayDay = saved === 'compleanno' ? localStorage.getItem(BIRTHDAY_DAY_KEY) : null
      return { choice: saved, birthdayDay }
    }
  } catch {
    // no URL or storage to read: follow the calendar
  }
  return { choice: 'auto', birthdayDay: null }
}

let { choice, birthdayDay } = readChoice()
let override = overrideFor(choice, birthdayDay)
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

/** The day picked for a forced birthday (`YYYY-MM-DD`), or null for the next one. */
export const currentBirthdayDay = () => birthdayDay

export const chooseSeason = (next: SeasonChoice, day: string | null = null) => {
  choice = next
  birthdayDay = next === 'compleanno' ? day : null
  override = overrideFor(next, birthdayDay)
  version += 1
  try {
    if (next === 'auto') localStorage.removeItem(CHOICE_KEY)
    else localStorage.setItem(CHOICE_KEY, next)
    if (birthdayDay) localStorage.setItem(BIRTHDAY_DAY_KEY, birthdayDay)
    else localStorage.removeItem(BIRTHDAY_DAY_KEY)
  } catch {
    // storage unavailable: the choice lasts until the app is closed
  }
  listeners.forEach((listener) => listener())
}

/** The app's clock: the real one, unless a forced theme moved it. */
export const clockNow = () => new Date(Date.now() + (override?.offset ?? 0))

/** A forced theme shows whoever is seated; the calendar follows the names at the table. */
export const seasonAt = (date: Date, guests: string[]) =>
  override ? override.season : seasonOn(date, guests)

/** Wishes shown in the header on the days of the feast itself. */
export const holidayGreeting = (date: Date, season: Season | null, guests: string[]) =>
  CALENDAR.find((entry) => entry.season === season)?.greeting?.(date, guests) ?? null

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
