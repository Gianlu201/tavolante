import { useCallback, useEffect, useState } from 'react'
import { MIN_PLAYERS } from '../lib/dealing'
import {
  clearSettings,
  DEFAULT_SETTINGS,
  EMPTY_PROFILE,
  loadSettings,
  saveSettings,
  type PlayerProfile,
  type Settings,
} from '../lib/settings'

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(loadSettings)

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((current) => {
      const next = { ...current, ...patch }
      // Dropping a player clears their slot, so bringing the seat back gives a
      // blank placeholder instead of resurrecting the previous name or avatar.
      if (next.players < current.players) {
        next.profiles = next.profiles.slice(0, next.players)
      }
      if (next.winnerIndex > next.players - 1) next.winnerIndex = 0
      return next
    })
  }, [])

  const updateProfile = useCallback((index: number, patch: Partial<PlayerProfile>) => {
    setSettings((current) => {
      const profiles = [...current.profiles]
      while (profiles.length <= index) profiles.push(EMPTY_PROFILE)
      profiles[index] = { ...profiles[index], ...patch }
      return { ...current, profiles }
    })
  }, [])

  /** Moves a player to another seat, sliding everyone in between over by one. */
  const reorderPlayers = useCallback((from: number, to: number) => {
    setSettings((current) => {
      if (from === to) return current

      const profiles = Array.from(
        { length: current.players },
        (_, index) => current.profiles[index] ?? EMPTY_PROFILE,
      )
      const [moved] = profiles.splice(from, 1)
      profiles.splice(to, 0, moved)

      let winnerIndex = current.winnerIndex
      if (winnerIndex === from) winnerIndex = to
      else if (from < winnerIndex && winnerIndex <= to) winnerIndex -= 1
      else if (to <= winnerIndex && winnerIndex < from) winnerIndex += 1

      return { ...current, profiles, winnerIndex }
    })
  }, [])

  /**
   * Removes one seat: the players after it shift down a position, so their profiles
   * have to travel with them and the winner has to keep pointing at the same person.
   */
  const removePlayer = useCallback((index: number) => {
    setSettings((current) => {
      if (current.players <= MIN_PLAYERS) return current

      const profiles = [...current.profiles]
      if (index < profiles.length) profiles.splice(index, 1)

      let winnerIndex = current.winnerIndex
      if (winnerIndex === index) winnerIndex = 0
      else if (winnerIndex > index) winnerIndex -= 1

      return { ...current, players: current.players - 1, profiles, winnerIndex }
    })
  }, [])

  const reset = useCallback(() => {
    clearSettings()
    setSettings(DEFAULT_SETTINGS)
  }, [])

  return { settings, update, updateProfile, reorderPlayers, removePlayer, reset }
}
