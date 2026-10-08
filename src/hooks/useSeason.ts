import { useEffect, useState, useSyncExternalStore } from 'react'
import {
  clockNow,
  currentChoice,
  holidayGreeting,
  seasonAt,
  seasonVersion,
  subscribeSeason,
} from '../lib/seasons'

const DEFAULT_THEME_COLOR = '#092820'

/** The app clock, refreshed every `intervalMs` and at once when the theme choice changes. */
export function useNow(intervalMs: number) {
  const [now, setNow] = useState(clockNow)

  useEffect(() => {
    const refresh = () => setNow(clockNow())
    const timer = window.setInterval(refresh, intervalMs)
    const unsubscribe = subscribeSeason(refresh)
    return () => {
      window.clearInterval(timer)
      unsubscribe()
    }
  }, [intervalMs])

  return now
}

/**
 * The seasonal theme of today. It lives on <html data-season>, where index.css swaps
 * the colour tokens, and in the browser bar colour so the whole screen matches.
 */
export function useSeason() {
  const choice = useSyncExternalStore(subscribeSeason, currentChoice)
  const version = useSyncExternalStore(subscribeSeason, seasonVersion)
  const now = useNow(60_000)
  const season = seasonAt(now)

  useEffect(() => {
    const root = document.documentElement
    if (season) root.dataset.season = season
    else delete root.dataset.season

    // A theme that paints its own sky names it in --color-page; else the felt does.
    const style = getComputedStyle(root)
    const color =
      style.getPropertyValue('--color-page').trim() ||
      style.getPropertyValue('--color-felt-3').trim()
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', color || DEFAULT_THEME_COLOR)
  }, [season])

  return { season, greeting: holidayGreeting(now, season), choice, version }
}
