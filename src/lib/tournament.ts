import { seatLabel, type PlayerProfile } from './settings'

/** Points for 1st, 2nd and 3rd place; everyone after them scores nothing. */
export const PODIUM_POINTS = [3, 2, 1] as const

export type TournamentHand = {
  at: number
  /** Player ids in finishing order, only the ones who score. */
  order: string[]
  /** Everyone seated when the hand was recorded: they played it, points or not. */
  seated: string[]
}

export type RosterEntry = {
  name: string
  avatarId: string | null
}

export type Tournament = {
  startedAt: number
  endedAt: number | null
  hands: TournamentHand[]
  /** Last known name and avatar of everyone who took part, even if they left the table. */
  roster: Record<string, RosterEntry>
}

export type Standing = RosterEntry & {
  id: string
  points: number
  /** How many times they finished 1st, 2nd and 3rd. */
  placings: number[]
  hands: number
  /** Dense rank: ties share it and the next one follows without gaps. */
  rank: number
}

/** Taps needed to close a hand: with 2-3 players the last scoring place is implied. */
export const finishersNeeded = (players: number) =>
  Math.min(PODIUM_POINTS.length, players - 1)

export const completeOrder = (tapped: string[], seated: string[]) => {
  const rest = seated.filter((id) => !tapped.includes(id))
  return rest.length === 1 && tapped.length < PODIUM_POINTS.length
    ? [...tapped, rest[0]]
    : tapped
}

export const rosterFrom = (profiles: PlayerProfile[]) =>
  Object.fromEntries(
    profiles.map((profile, index): [string, RosterEntry] => [
      profile.id,
      { name: seatLabel(profile, index), avatarId: profile.avatarId },
    ]),
  )

export const createTournament = (profiles: PlayerProfile[], now: number): Tournament => ({
  startedAt: now,
  endedAt: null,
  hands: [],
  roster: rosterFrom(profiles),
})

const compareStandings = (a: Standing, b: Standing) =>
  b.points - a.points ||
  b.placings[0] - a.placings[0] ||
  b.placings[1] - a.placings[1] ||
  b.placings[2] - a.placings[2]

/**
 * Ranking by points; ties are broken by more 1st places, then more 2nd and 3rd
 * places. Whoever is still level shares the rank. The players passed as seated are
 * listed with their current name even if they have not scored yet; leave them out
 * for a finished tournament, which keeps the names it was played with.
 */
export const standings = (
  tournament: Tournament,
  seatedProfiles: PlayerProfile[] = [],
): Standing[] => {
  const live = rosterFrom(seatedProfiles)
  const roster = { ...tournament.roster, ...live }
  const rows = new Map<string, Standing>()

  const row = (id: string) => {
    let entry = rows.get(id)
    if (!entry) {
      entry = {
        id,
        name: roster[id]?.name ?? 'Giocatore',
        avatarId: roster[id]?.avatarId ?? null,
        points: 0,
        placings: PODIUM_POINTS.map(() => 0),
        hands: 0,
        rank: 0,
      }
      rows.set(id, entry)
    }
    return entry
  }

  Object.keys(live).forEach(row)
  for (const hand of tournament.hands) {
    for (const id of hand.seated) row(id).hands += 1
    hand.order.forEach((id, place) => {
      const entry = row(id)
      entry.points += PODIUM_POINTS[place] ?? 0
      entry.placings[place] += 1
    })
  }

  const sorted = [...rows.values()].sort(
    (a, b) => compareStandings(a, b) || a.name.localeCompare(b.name, 'it'),
  )
  sorted.forEach((entry, index) => {
    const previous = sorted[index - 1]
    entry.rank = !previous
      ? 1
      : compareStandings(previous, entry) === 0
        ? previous.rank
        : previous.rank + 1
  })
  return sorted
}

/** The podium only hosts players who scored: three steps, ties side by side. */
export const podiumSteps = (rows: Standing[]) =>
  PODIUM_POINTS.map((_, step) =>
    rows.filter((row) => row.rank === step + 1 && row.points > 0),
  )

export const offPodium = (rows: Standing[]) => {
  const onPodium = new Set(podiumSteps(rows).flat().map((row) => row.id))
  return rows.filter((row) => !onPodium.has(row.id))
}

const STORAGE_KEY = 'tavolante:tournament:v1'

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string')

const parseHand = (value: unknown): TournamentHand | null => {
  if (typeof value !== 'object' || value === null) return null
  const hand = value as Partial<Record<keyof TournamentHand, unknown>>
  if (typeof hand.at !== 'number' || !isStringArray(hand.order) || !isStringArray(hand.seated))
    return null
  return {
    at: hand.at,
    order: hand.order.slice(0, PODIUM_POINTS.length),
    seated: hand.seated,
  }
}

const parseRoster = (value: unknown): Record<string, RosterEntry> => {
  if (typeof value !== 'object' || value === null) return {}
  const roster: Record<string, RosterEntry> = {}
  for (const [id, entry] of Object.entries(value)) {
    if (typeof entry !== 'object' || entry === null) continue
    const { name, avatarId } = entry as Partial<Record<keyof RosterEntry, unknown>>
    if (typeof name !== 'string') continue
    roster[id] = { name, avatarId: typeof avatarId === 'string' ? avatarId : null }
  }
  return roster
}

const parseTournament = (raw: string): Tournament | null => {
  const data: unknown = JSON.parse(raw)
  if (typeof data !== 'object' || data === null) return null
  const stored = data as Partial<Record<keyof Tournament, unknown>>
  if (typeof stored.startedAt !== 'number') return null
  return {
    startedAt: stored.startedAt,
    endedAt: typeof stored.endedAt === 'number' ? stored.endedAt : null,
    hands: Array.isArray(stored.hands)
      ? stored.hands.map(parseHand).filter((hand): hand is TournamentHand => hand !== null)
      : [],
    roster: parseRoster(stored.roster),
  }
}

export const loadTournament = (): Tournament | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? parseTournament(raw) : null
  } catch {
    return null
  }
}

export const saveTournament = (tournament: Tournament | null) => {
  try {
    if (tournament) localStorage.setItem(STORAGE_KEY, JSON.stringify(tournament))
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // storage unavailable (private mode, quota) — the tournament lives in memory only
  }
}
