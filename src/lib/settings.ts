import {
  clamp,
  MAX_CARDS,
  MAX_PLAYERS,
  MIN_CARDS,
  MIN_PLAYERS,
  type DeckPreset,
  type Direction,
} from './dealing'

export type PlayerProfile = {
  /** Identità stabile: segue la persona quando i posti si spostano (serve ai punti del torneo). */
  id: string
  name: string
  avatarId: string | null
}

export type Settings = {
  players: number
  deckPreset: DeckPreset
  customCards: number
  direction: Direction
  winnerIndex: number
  /** Indexed by seat position, always exactly `players` long. */
  profiles: PlayerProfile[]
}

export const MAX_NAME_LENGTH = 14

/** randomUUID esiste solo in contesto sicuro: da un IP in HTTP serve il ripiego. */
export const createPlayerId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`

export const emptyProfile = (): PlayerProfile => ({
  id: createPlayerId(),
  name: '',
  avatarId: null,
})

/** Trims or pads the profiles to one per seat; a returning seat comes back blank. */
export const fitProfiles = (profiles: PlayerProfile[], players: number) =>
  Array.from({ length: players }, (_, index) => profiles[index] ?? emptyProfile())

const DEFAULT_PLAYERS = 4

export const createDefaultSettings = (): Settings => ({
  players: DEFAULT_PLAYERS,
  deckPreset: 54,
  customCards: 54,
  direction: 'ccw',
  winnerIndex: 0,
  profiles: fitProfiles([], DEFAULT_PLAYERS),
})

const SEAT_LABEL_PREFIX = 'Giocatore '

/** Display name: the typed name, or the seat number when the seat has none. */
export const seatLabel = (profile: PlayerProfile | undefined, index: number) =>
  profile?.name.trim() || `${SEAT_LABEL_PREFIX}${index + 1}`

/** What a round badge shows for a label: initials, or the bare number of an unnamed seat. */
export const labelInitials = (label: string) => {
  const seat = label.startsWith(SEAT_LABEL_PREFIX) && /^\d+$/.test(label.slice(SEAT_LABEL_PREFIX.length))
  return seat ? label.slice(SEAT_LABEL_PREFIX.length) : profileInitials(label)
}

/** Initials shown on the seat when the player has a name but no avatar. */
export const profileInitials = (name: string) => name.trim().slice(0, 3).toUpperCase()

const STORAGE_KEY = 'tavolante:settings:v1'

const isDeckPreset = (value: unknown): value is DeckPreset =>
  value === 54 || value === 106 || value === 'custom'

/** Profiles saved before ids existed (or with duplicated ids) get a fresh one. */
const parseProfiles = (value: unknown): PlayerProfile[] => {
  if (!Array.isArray(value)) return []
  const seen = new Set<string>()
  return value.map((entry): PlayerProfile => {
    if (typeof entry !== 'object' || entry === null) return emptyProfile()
    const profile = entry as Partial<Record<keyof PlayerProfile, unknown>>
    const id =
      typeof profile.id === 'string' && profile.id !== '' && !seen.has(profile.id)
        ? profile.id
        : createPlayerId()
    seen.add(id)
    return {
      id,
      name:
        typeof profile.name === 'string' ? profile.name.slice(0, MAX_NAME_LENGTH) : '',
      avatarId: typeof profile.avatarId === 'string' ? profile.avatarId : null,
    }
  })
}

const parseSettings = (raw: string): Settings => {
  const data: unknown = JSON.parse(raw)
  const defaults = createDefaultSettings()
  if (typeof data !== 'object' || data === null) return defaults

  const stored = data as Partial<Record<keyof Settings, unknown>>
  const players =
    typeof stored.players === 'number'
      ? clamp(Math.round(stored.players), MIN_PLAYERS, MAX_PLAYERS)
      : defaults.players

  return {
    players,
    deckPreset: isDeckPreset(stored.deckPreset)
      ? stored.deckPreset
      : defaults.deckPreset,
    customCards:
      typeof stored.customCards === 'number'
        ? clamp(Math.round(stored.customCards), MIN_CARDS, MAX_CARDS)
        : defaults.customCards,
    direction: stored.direction === 'cw' ? 'cw' : 'ccw',
    winnerIndex:
      typeof stored.winnerIndex === 'number'
        ? clamp(Math.round(stored.winnerIndex), 0, players - 1)
        : defaults.winnerIndex,
    profiles: fitProfiles(parseProfiles(stored.profiles), players),
  }
}

export const loadSettings = (): Settings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? parseSettings(raw) : createDefaultSettings()
  } catch {
    return createDefaultSettings()
  }
}

export const saveSettings = (settings: Settings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // storage unavailable (private mode, quota) — settings stay in memory only
  }
}

export const clearSettings = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // nothing to clean up if storage is unavailable
  }
}
