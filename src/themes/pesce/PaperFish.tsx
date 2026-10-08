import { useState, type MouseEvent } from 'react'

/** Fish already pulled off today, so a re-render or a reorder does not stick them back. */
const pulledOff = new Set<string>()

/** A paper fish cut out of coloured paper, head to the right. */
export function FishShape({ color, stripes = '#fff' }: { color: string; stripes?: string }) {
  return (
    <>
      <path d="M16 15C24 3 44 2 56 15 44 28 24 27 16 15z" fill={color} stroke="#fff" strokeWidth="1.4" />
      <path d="M17 15 4 5l3 10-3 10z" fill={color} stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M30 7c3 5 3 11 0 16M38 6c3 6 3 12 0 18" fill="none" stroke={stripes} strokeOpacity="0.7" strokeWidth="1.6" />
      <path d="M17 15h37" stroke="#000" strokeOpacity="0.12" strokeDasharray="2 2" />
      <circle cx="48" cy="12.5" r="2.4" fill="#fff" />
      <circle cx="48.6" cy="12.5" r="1.2" fill="#1a1020" />
    </>
  )
}

/**
 * Il pesce d'aprile attaccato alla «schiena» di un giocatore, con il nastro adesivo.
 * Toccandolo si stacca e cade ondeggiando; il tocco non seleziona il vincitore.
 */
export default function PaperFish({ id }: { id: string }) {
  const [state, setState] = useState<'stuck' | 'falling' | 'gone'>(() =>
    pulledOff.has(id) ? 'gone' : 'stuck',
  )

  if (state === 'gone') return null

  const pullOff = (event: MouseEvent) => {
    // The fish lives inside the seat button: keep the tap from choosing the winner.
    event.stopPropagation()
    event.preventDefault()
    if (state !== 'stuck') return
    pulledOff.add(id)
    setState('falling')
  }

  return (
    <span
      className="pointer-events-auto absolute -top-[30%] -right-[34%] z-1 w-[74%] cursor-pointer"
      onClick={pullOff}
      onPointerDown={(event) => event.stopPropagation()}
      onAnimationEnd={(event) => {
        // The joke bubble outlasts the fall: once it is gone, so is the fish.
        if (event.animationName === 'fish-joke') setState('gone')
      }}
      aria-hidden="true"
    >
      {state === 'falling' && (
        <span className="pointer-events-none absolute -top-[70%] left-1/2 animate-fish-joke rounded-xl bg-cream px-2 py-1 font-display text-[12px] font-bold whitespace-nowrap text-ink shadow-[0_4px_10px_rgba(0,0,0,0.35)]">
          Pesce d'aprile! 🐟
        </span>
      )}
      <svg
        viewBox="0 0 60 30"
        className={`block w-full overflow-visible drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)] ${
          state === 'falling'
            ? 'animate-fish-fall'
            : 'rotate-[-18deg] animate-fish-dangle motion-reduce:animate-none'
        }`}
      >
        <FishShape color="#ff8c42" />
        <rect x="27" y="-2" width="12" height="7" rx="1" fill="#f3ead2" opacity="0.85" transform="rotate(-8 33 1)" />
      </svg>
    </span>
  )
}
