export type Season = 'halloween' | 'natale' | 'capodanno'

/** Month and day, inclusive at both ends; a range may wrap over the new year. */
type SeasonRange = { season: Season; from: [number, number]; to: [number, number] }

/**
 * Periodi abbastanza ampi da coprire la festa e le serate intorno, non così lunghi
 * da stancare. L'ordine conta: Capodanno sta dentro il periodo di Natale e vince.
 */
const SEASON_RANGES: SeasonRange[] = [
  { season: 'halloween', from: [10, 24], to: [11, 2] },
  { season: 'capodanno', from: [12, 31], to: [1, 1] },
  { season: 'natale', from: [12, 8], to: [1, 6] },
]

const monthDay = ([month, day]: [number, number]) => month * 100 + day

const inRange = (value: number, from: number, to: number) =>
  from <= to ? value >= from && value <= to : value >= from || value <= to

export const seasonOn = (date: Date): Season | null => {
  const today = monthDay([date.getMonth() + 1, date.getDate()])
  return (
    SEASON_RANGES.find(({ from, to }) => inRange(today, monthDay(from), monthDay(to)))
      ?.season ?? null
  )
}

/**
 * `?tema=halloween|natale|capodanno|off` forces a theme, to try one out or show it
 * off out of season. `?tema=mezzanotte` is New Year's Eve with the clock set a few
 * seconds before midnight, to watch the countdown.
 */
const readOverride = (): { season: Season | null | undefined; offset: number } => {
  try {
    const value = new URLSearchParams(window.location.search).get('tema')
    if (value === 'off') return { season: null, offset: 0 }
    if (value === 'halloween' || value === 'natale' || value === 'capodanno')
      return { season: value, offset: 0 }
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

/** Milliseconds until the next local midnight. */
export const msToMidnight = (date: Date) => {
  const midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
  return midnight.getTime() - date.getTime()
}

/** Milliseconds elapsed since the last local midnight. */
export const msSinceMidnight = (date: Date) =>
  date.getTime() - new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
