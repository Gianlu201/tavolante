import { version } from '../../package.json'
import { hasSavedSettings } from './settings'

export const APP_VERSION = version

/** The last version whose update card was closed on this device. */
const SEEN_KEY = 'tavolante:versione-vista:v1'

/** «2.1.3» → [2, 1]: a patch release only fixes things, so it is never announced. */
const featureRelease = (value: string) => value.split('.').slice(0, 2).map(Number)

const isNewer = ([major, minor]: number[], [seenMajor, seenMinor]: number[]) =>
  major > seenMajor || (major === seenMajor && minor > seenMinor)

/**
 * Whether to greet this device with the update card: only on a new minor or major
 * version, and only for someone who already used an older one. With no version on
 * record, saved settings mean the app was opened before the card existed; a first
 * visit instead records the current version and shows nothing. It must run before
 * the first render, while a first visit has not saved its settings yet.
 */
export const shouldAnnounceUpdate = () => {
  try {
    const seen = localStorage.getItem(SEEN_KEY)
    if (seen !== null) return isNewer(featureRelease(version), featureRelease(seen))
    if (hasSavedSettings()) return true
    localStorage.setItem(SEEN_KEY, version)
    return false
  } catch {
    return false
  }
}

export const markUpdateSeen = () => {
  try {
    localStorage.setItem(SEEN_KEY, version)
  } catch {
    // storage unavailable: the card comes back next time, nothing worse
  }
}
