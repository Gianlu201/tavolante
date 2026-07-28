import { easterEggAvatar, isEasterEggAvatar } from './avatars'
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
  name: string
  avatarId: string | null
}

export type Settings = {
  players: number
  deckPreset: DeckPreset
  customCards: number
  direction: Direction
  winnerIndex: number
  /** Indexed by seat position; missing entries fall back to the seat number. */
  profiles: PlayerProfile[]
}

export const MAX_NAME_LENGTH = 14

export const EMPTY_PROFILE: PlayerProfile = { name: '', avatarId: null }

export const DEFAULT_SETTINGS: Settings = {
  players: 4,
  deckPreset: 54,
  customCards: 54,
  direction: 'ccw',
  winnerIndex: 0,
  profiles: [],
}

/** Initials shown on the seat when the player has a name but no avatar. */
export const profileInitials = (name: string) => name.trim().slice(0, 3).toUpperCase()

/**
 * Naming a player after one of the easter egg characters hands them that portrait;
 * renaming them away from it takes it back. Picking an avatar from the grid afterwards
 * overrides it, since that patch carries an explicit avatarId.
 */
export const applyEasterEgg = (
  current: PlayerProfile,
  patch: Partial<PlayerProfile>,
): Partial<PlayerProfile> => {
  if (patch.name === undefined || patch.avatarId !== undefined) return patch

  const egg = easterEggAvatar(patch.name)
  if (egg) return { ...patch, avatarId: egg }
  if (isEasterEggAvatar(current.avatarId)) return { ...patch, avatarId: null }
  return patch
}

const STORAGE_KEY = 'tavolante:settings:v1'

const isDeckPreset = (value: unknown): value is DeckPreset =>
  value === 54 || value === 106 || value === 'custom'

const parseProfiles = (value: unknown): PlayerProfile[] => {
  if (!Array.isArray(value)) return []
  return value.map((entry): PlayerProfile => {
    if (typeof entry !== 'object' || entry === null) return EMPTY_PROFILE
    const profile = entry as Partial<Record<keyof PlayerProfile, unknown>>
    return {
      name:
        typeof profile.name === 'string' ? profile.name.slice(0, MAX_NAME_LENGTH) : '',
      avatarId: typeof profile.avatarId === 'string' ? profile.avatarId : null,
    }
  })
}

const parseSettings = (raw: string): Settings => {
  const data: unknown = JSON.parse(raw)
  if (typeof data !== 'object' || data === null) return DEFAULT_SETTINGS

  const stored = data as Partial<Record<keyof Settings, unknown>>
  const players =
    typeof stored.players === 'number'
      ? clamp(Math.round(stored.players), MIN_PLAYERS, MAX_PLAYERS)
      : DEFAULT_SETTINGS.players

  return {
    players,
    deckPreset: isDeckPreset(stored.deckPreset)
      ? stored.deckPreset
      : DEFAULT_SETTINGS.deckPreset,
    customCards:
      typeof stored.customCards === 'number'
        ? clamp(Math.round(stored.customCards), MIN_CARDS, MAX_CARDS)
        : DEFAULT_SETTINGS.customCards,
    direction: stored.direction === 'cw' ? 'cw' : 'ccw',
    winnerIndex:
      typeof stored.winnerIndex === 'number'
        ? clamp(Math.round(stored.winnerIndex), 0, players - 1)
        : DEFAULT_SETTINGS.winnerIndex,
    profiles: parseProfiles(stored.profiles),
  }
}

export const loadSettings = (): Settings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? parseSettings(raw) : DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
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
