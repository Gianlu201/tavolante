import { useId, type CSSProperties } from 'react'

type PartyHornProps = {
  /** Seconds before the paper tongue unrolls. */
  delay: number
  className?: string
  style?: CSSProperties
}

/** Trombetta da festa: il bocchino a righe e la lingua di carta che si srotola soffiando. */
export default function PartyHorn({ delay, className = '', style }: PartyHornProps) {
  // Two horns on the page: each needs its own pattern id, and one safe inside url(#…).
  const stripes = `horn-stripes-${useId().replace(/[^\w-]/g, '')}`

  return (
    <svg viewBox="0 0 200 60" className={className} style={style} aria-hidden="true">
      <defs>
        <pattern id={stripes} width="12" height="60" patternUnits="userSpaceOnUse">
          <rect width="12" height="60" fill="var(--color-ember)" />
          <rect width="5" height="60" fill="var(--color-cream)" />
        </pattern>
      </defs>
      <g
        className="origin-[46px_30px] animate-horn-blow motion-reduce:animate-none"
        style={{ animationDelay: `${delay}s` }}
      >
        <rect x="44" y="22" width="132" height="16" rx="8" fill={`url(#${stripes})`} />
        <circle cx="178" cy="30" r="10" fill="none" stroke="var(--color-ember)" strokeWidth="6" />
      </g>
      <polygon points="4,24 48,13 48,47 4,36" fill="var(--color-gold)" />
      <polygon points="18,20.5 26,18.5 26,41.5 18,39.5" fill="var(--color-ember-dark)" />
      <polygon points="34,16.5 40,15 40,45 34,43.5" fill="var(--color-ember-dark)" />
      <rect x="0" y="23" width="7" height="14" rx="2" fill="var(--color-cream)" />
    </svg>
  )
}
