import { useEffect, useState } from 'react'
import { clockNow, seasonAt } from '../lib/seasons'

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
  const season = seasonAt(useNow(60_000))

  useEffect(() => {
    const root = document.documentElement
    if (season) root.dataset.season = season
    else delete root.dataset.season

    const felt = getComputedStyle(root).getPropertyValue('--color-felt-3').trim()
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', felt || DEFAULT_THEME_COLOR)
  }, [season])

  return season
}
