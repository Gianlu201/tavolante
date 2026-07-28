import { useState } from 'react'
import { useInstallPrompt } from '../hooks/useInstallPrompt'

const SITE_URL = 'https://www.gianlucadidiego.it'

const LINK_CLASS =
  'cursor-pointer border-none bg-transparent p-0 font-mono text-[10.5px] tracking-[0.04em] text-cream/55 underline decoration-gold/30 underline-offset-3 transition-colors duration-180 ease-out active:text-gold-light'

const SEPARATOR_CLASS = 'text-gold/30'

/**
 * Ultima riga della pagina: copyright, rimando al sito personale e — solo dove
 * l'app non è già installata — l'invito a installarla. L'invito sparisce da
 * solo quando la finestra è in standalone o quando Chromium non ha alcun
 * evento da rilanciare, cioè quando l'app risulta già sul dispositivo.
 */
export default function Footer() {
  const { state, install } = useInstallPrompt()
  const [hint, setHint] = useState(false)

  return (
    <footer className="relative flex shrink-0 flex-wrap items-center justify-center gap-x-2 gap-y-1 pt-0.5 font-mono text-[10.5px] tracking-[0.04em] text-cream/40">
      <span>© {new Date().getFullYear()} Gianluca Di Diego</span>

      <span aria-hidden="true" className={SEPARATOR_CLASS}>
        ·
      </span>

      <a
        className={LINK_CLASS}
        href={SITE_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        Scopri di più <span aria-hidden="true">↗</span>
      </a>

      {state !== 'hidden' && (
        <>
          <span aria-hidden="true" className={SEPARATOR_CLASS}>
            ·
          </span>
          <button
            type="button"
            className={LINK_CLASS}
            aria-expanded={state === 'ios' ? hint : undefined}
            onClick={() => (state === 'ios' ? setHint((open) => !open) : install())}
          >
            Installa app
          </button>
        </>
      )}

      {state === 'ios' && hint && (
        <p
          className="absolute bottom-full left-1/2 z-20 mb-2 w-62 -translate-x-1/2 rounded-2xl border border-gold/25 bg-drawer p-3 text-center font-sans text-[12.5px] leading-[1.45] tracking-normal text-cream/85 shadow-[0_10px_24px_rgba(0,0,0,0.45)]"
          role="status"
        >
          In Safari tocca <b className="text-gold-light">Condividi</b> nella
          barra in basso, poi{' '}
          <b className="text-gold-light">Aggiungi alla schermata Home</b>.
        </p>
      )}
    </footer>
  )
}
