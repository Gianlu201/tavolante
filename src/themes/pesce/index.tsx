import { clockNow, dayKey } from '../../lib/seasons'
import type { PlayerProfile } from '../../lib/settings'
import type { ThemeModule } from '../types'
import AprilFoolsKicker from './Kicker'
import PaperFish from './PaperFish'
import AprilFoolsScene from './Scene'

const hash = (text: string) => {
  let value = 2166136261
  for (let i = 0; i < text.length; i++) value = Math.imul(value ^ text.charCodeAt(i), 16777619)
  return value >>> 0
}

/** The victim of the day: the same person all day long, wherever they sit. */
const victimOf = (profiles: PlayerProfile[]) => {
  const today = dayKey(clockNow())
  return profiles.reduce<{ id: string; score: number } | null>((best, profile) => {
    const score = hash(`${today}:${profile.id}`)
    return !best || score < best.score ? { id: profile.id, score } : best
  }, null)?.id
}

/**
 * Pesce d'aprile (1° aprile): il tavolo fa una capriola, la scritta in alto sbaglia gioco
 * e si corregge, e un pesce di carta è attaccato alla schiena di un giocatore.
 */
const pesce: ThemeModule = {
  Scene: AprilFoolsScene,
  Kicker: AprilFoolsKicker,
  tableClassName: 'animate-table-flip motion-reduce:animate-none',
  seatAccessory: ({ profile, profiles }) =>
    profile.id === victimOf(profiles) ? (
      <PaperFish id={`${dayKey(clockNow())}:${profile.id}`} />
    ) : null,
}

export default pesce
