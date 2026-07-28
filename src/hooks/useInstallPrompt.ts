import { useEffect, useState } from 'react'

/**
 * Stato del pulsante "Installa app":
 * - 'hidden'  → già installata, oppure browser che non installa nulla
 * - 'prompt'  → Chrome/Edge/Samsung: c'è un evento da rilanciare al tap
 * - 'ios'     → Safari non espone alcun evento, si spiega il menu Condividi
 */
export type InstallState = 'hidden' | 'prompt' | 'ios'

/** Non standard: esiste solo sui browser Chromium. */
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  // iOS non implementa display-mode, ha una sua proprietà su navigator.
  (navigator as { standalone?: boolean }).standalone === true

/** iPadOS si dichiara "Macintosh", lo si riconosce dal touch. */
const isIos = () =>
  /iphone|ipod|ipad/i.test(navigator.userAgent) ||
  (/macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1)

export function useInstallPrompt() {
  const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(isStandalone)

  useEffect(() => {
    const capture = (nativeEvent: Event) => {
      // Senza preventDefault Chrome mostrerebbe la sua barra di installazione.
      nativeEvent.preventDefault()
      setEvent(nativeEvent as BeforeInstallPromptEvent)
    }
    const done = () => {
      setEvent(null)
      setInstalled(true)
    }

    // Se la pagina passa alla finestra standalone il pulsante sparisce da solo.
    const media = window.matchMedia('(display-mode: standalone)')
    const syncDisplayMode = () => setInstalled(isStandalone())

    window.addEventListener('beforeinstallprompt', capture)
    window.addEventListener('appinstalled', done)
    media.addEventListener('change', syncDisplayMode)
    return () => {
      window.removeEventListener('beforeinstallprompt', capture)
      window.removeEventListener('appinstalled', done)
      media.removeEventListener('change', syncDisplayMode)
    }
  }, [])

  const state: InstallState = installed
    ? 'hidden'
    : event
      ? 'prompt'
      : isIos()
        ? 'ios'
        : 'hidden'

  /** L'evento è usa e getta: dopo il prompt va buttato in ogni caso. */
  const install = async () => {
    if (!event) return
    setEvent(null)
    await event.prompt()
    const { outcome } = await event.userChoice
    if (outcome === 'accepted') setInstalled(true)
  }

  return { state, install }
}
