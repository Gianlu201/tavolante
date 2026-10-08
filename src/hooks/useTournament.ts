import { useCallback, useEffect, useState } from 'react'
import type { PlayerProfile } from '../lib/settings'
import {
  createTournament,
  loadTournament,
  rosterFrom,
  saveTournament,
  type Tournament,
} from '../lib/tournament'

export function useTournament() {
  const [tournament, setTournament] = useState<Tournament | null>(loadTournament)

  useEffect(() => {
    saveTournament(tournament)
  }, [tournament])

  /** Starting a new one replaces the last finished tournament too. */
  const start = useCallback((profiles: PlayerProfile[]) => {
    setTournament(createTournament(profiles, Date.now()))
  }, [])

  const recordHand = useCallback((order: string[], profiles: PlayerProfile[]) => {
    setTournament((current) =>
      current && current.endedAt === null
        ? {
            ...current,
            hands: [
              ...current.hands,
              { at: Date.now(), order, seated: profiles.map((profile) => profile.id) },
            ],
            roster: { ...current.roster, ...rosterFrom(profiles) },
          }
        : current,
    )
  }, [])

  const undoLastHand = useCallback(() => {
    setTournament((current) =>
      current && current.endedAt === null
        ? { ...current, hands: current.hands.slice(0, -1) }
        : current,
    )
  }, [])

  /** Freezes the names the podium will show: later renames do not touch it. */
  const end = useCallback((profiles: PlayerProfile[]) => {
    setTournament((current) =>
      current && current.endedAt === null
        ? {
            ...current,
            endedAt: Date.now(),
            roster: { ...current.roster, ...rosterFrom(profiles) },
          }
        : current,
    )
  }, [])

  const discard = useCallback(() => setTournament(null), [])

  return { tournament, start, recordHand, undoLastHand, end, discard }
}
