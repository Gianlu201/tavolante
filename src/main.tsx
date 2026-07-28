import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'

/* Rende l'app installabile e utilizzabile offline. Con registerType 'autoUpdate'
   una nuova versione sostituisce il service worker e ricarica da sola: le
   impostazioni stanno in localStorage, quindi non si perde niente. */
registerSW({ immediate: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
