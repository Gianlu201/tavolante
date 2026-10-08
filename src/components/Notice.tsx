import { useEffect } from 'react'

export type NoticeData = {
  text: string
  /** Shown as an «Annulla» button next to the text. */
  onUndo?: () => void
}

const NOTICE_DURATION_MS = 4500

type NoticeProps = NoticeData & { onDismiss: () => void }

/** Avviso breve in alto che sparisce da solo: conferma un'azione senza fermare il gioco. */
export default function Notice({ text, onUndo, onDismiss }: NoticeProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, NOTICE_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [text, onDismiss])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-[calc(10px+env(safe-area-inset-top,0px))] z-30 flex justify-center px-4">
      <div
        className="pointer-events-auto flex max-w-110 animate-notice-in items-center gap-3 rounded-2xl border border-gold/30 bg-drawer/95 py-2 pr-2 pl-4 text-[13px] leading-snug text-cream/90 shadow-[0_10px_24px_rgba(0,0,0,0.45)] backdrop-blur-[6px] motion-reduce:animate-none"
        role="status"
      >
        <span className="py-1">{text}</span>
        {onUndo && (
          <button
            type="button"
            className="shrink-0 cursor-pointer rounded-xl border border-gold/40 bg-gold/12 px-3 py-1.5 text-[12.5px] font-semibold text-gold-light active:bg-gold/22"
            onClick={() => {
              onUndo()
              onDismiss()
            }}
          >
            Annulla
          </button>
        )}
      </div>
    </div>
  )
}
