import type { ComponentType } from 'react'

/**
 * Il fondale del tema stagionale, dietro a tutto il resto: le decorazioni stanno ai
 * bordi e sopra lo sfondo, così il giocatore di partenza in oro resta la cosa più
 * visibile.
 */
export default function SeasonLayer({ Scene }: { Scene: ComponentType }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <Scene />
    </div>
  )
}
