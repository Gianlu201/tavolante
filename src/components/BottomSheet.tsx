import { useEffect, type ReactNode } from 'react'

type BottomSheetProps = {
  label: string
  title: ReactNode
  onClose: () => void
  children: ReactNode
}

/** Pannello dal basso condiviso: scrim, maniglia, titolo con chiusura, Esc per uscire. */
export default function BottomSheet({ label, title, onClose, children }: BottomSheetProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-20 flex flex-col justify-end">
      <div
        className="absolute inset-0 animate-scrim-in bg-[rgba(4,16,12,0.6)] backdrop-blur-[2px] motion-reduce:animate-none"
        onClick={onClose}
      />
      <div
        className="relative mx-auto flex max-h-[88dvh] w-full max-w-130 animate-drawer-in flex-col gap-3.5 overflow-y-auto rounded-t-[22px] border border-b-0 border-gold/28 bg-drawer px-4 pt-2 pb-[calc(16px+env(safe-area-inset-bottom,0px))] shadow-[0_-18px_40px_rgba(0,0,0,0.45)] motion-reduce:animate-none"
        role="dialog"
        aria-modal="true"
        aria-label={label}
      >
        <div className="mx-auto h-1 w-10 shrink-0 rounded-sm bg-cream/25" />

        <header className="flex items-center justify-between">
          <h2 className="m-0 font-display text-[20px] font-semibold text-cream">{title}</h2>
          <button
            type="button"
            className="size-9 cursor-pointer rounded-full border border-cream/18 bg-cream/6 text-[15px] text-cream"
            onClick={onClose}
            aria-label="Chiudi"
          >
            ✕
          </button>
        </header>

        {children}
      </div>
    </div>
  )
}
