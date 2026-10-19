import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'

/* Rende l'app installabile e utilizzabile offline. Con registerType 'autoUpdate'
   una nuova versione sostituisce il service worker e ricarica da sola: le
   impostazioni stanno in localStorage, quindi non si perde niente. */
registerSW({
  immediate: true,
  onRegisteredSW(_swUrl, registration) {
    if (!registration) return
    /* Il browser ricontrolla sw.js solo a un caricamento vero della pagina, ma
       una PWA installata sul telefono di solito viene ripresa dal background e
       resterebbe sulla versione vecchia anche per giorni: lo chiediamo noi al
       ritorno in primo piano, e ogni ora per chi la tiene aperta. */
    const checkForUpdate = () => {
      if (!registration.installing && navigator.onLine) {
        registration.update().catch(() => {})
      }
    }
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') checkForUpdate()
    })
    setInterval(checkForUpdate, 60 * 60 * 1000)
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
