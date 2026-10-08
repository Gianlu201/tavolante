import { useEffect, useState } from 'react'
import { clockNow, holidayGreeting, seasonAt } from '../lib/seasons'

const DEFAULT_THEME_COLOR = '#092820'

/** The app clock, refreshed every `intervalMs`. */
export function useNow(intervalMs: number) {
  const [now, setNow] = useState(clockNow)

  useEffect(() => {
    const timer = window.setInterval(() => setNow(clockNow()), intervalMs)
    return () => window.clearInterval(timer)
  }, [intervalMs])

  return now
}

/**
 * The seasonal theme of today. It lives on <html data-season>, where index.css swaps
 * the colour tokens, and in the browser bar colour so the whole screen matches.
 */
export function useSeason() {
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

  return { season, greeting: holidayGreeting(now, season) }
}
