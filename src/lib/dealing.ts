export type Direction = 'cw' | 'ccw'

export type DeckPreset = 54 | 106 | 'custom'

export const MIN_PLAYERS = 2
export const MAX_PLAYERS = 12
export const MIN_CARDS = 1
export const MAX_CARDS = 999

export const directionStep = (direction: Direction) => (direction === 'cw' ? 1 : -1)

export const directionLabel = (direction: Direction) =>
  direction === 'cw' ? 'orario' : 'antiorario'

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

export const resolveDeckSize = (preset: DeckPreset, customCards: number) =>
  preset === 'custom' ? clamp(customCards, MIN_CARDS, MAX_CARDS) : preset

/**
 * Card k (1-based) lands on seat (start + (k-1) * step) mod players, so forcing
 * the last card onto the winner gives start = winner - (cards - 1) * step.
 */
export const computeStartSeat = (
  players: number,
  cards: number,
  winnerIndex: number,
  direction: Direction,
) => {
  const step = directionStep(direction)
  const raw = winnerIndex - (cards - 1) * step
  return ((raw % players) + players) % players
}
