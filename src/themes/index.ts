import { useEffect, useState } from 'react'
import type { Season } from '../lib/seasons'
import type { ThemeModule } from './types'

/**
 * Each theme is its own chunk, downloaded only in its period. The service worker
 * precaches them all anyway, so a theme that starts while offline still shows up.
 */
const LOADERS: Record<Season, () => Promise<{ default: ThemeModule }>> = {
  capodanno: () => import('./capodanno'),
  pasqua: () => import('./pasqua'),
  pesce: () => import('./pesce'),
  carnevale: () => import('./carnevale'),
  luminara: () => import('./luminara'),
  palio: () => import('./palio'),
  agosto: () => import('./agosto'),
  halloween: () => import('./halloween'),
  natale: () => import('./natale'),
}

/** The module of the active theme, or null while none is active or it is loading. */
export function useThemeModule(season: Season | null) {
  const [loaded, setLoaded] = useState<{ season: Season; theme: ThemeModule } | null>(null)

  useEffect(() => {
    if (!season) return
    let cancelled = false
    LOADERS[season]()
      .then(({ default: theme }) => {
        if (!cancelled) setLoaded({ season, theme })
      })
      .catch(() => {
        // the chunk could not be fetched: the page keeps the theme colours only
      })
    return () => {
      cancelled = true
    }
  }, [season])

  return loaded?.season === season ? loaded.theme : null
}
