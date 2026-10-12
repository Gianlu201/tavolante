import { useId } from 'react'

/** Palloncino lucido con il nodo e il filo che ondeggia. */
export default function Balloon({ color, className = '' }: { color: string; className?: string }) {
  const shine = `balloon-shine-${useId().replace(/[^\w-]/g, '')}`

  return (
    <svg viewBox="0 0 40 90" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={shine} cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.25" />
        </radialGradient>
      </defs>
      <path d="M20 47c-4 6 4 10 0 16s4 10 0 16" fill="none" stroke="#f4ecdd" strokeOpacity="0.55" strokeWidth="1" />
      <path d="M17 45h6l-3 4z" fill={color} />
      <ellipse cx="20" cy="23" rx="17" ry="21.5" fill={color} />
      <ellipse cx="20" cy="23" rx="17" ry="21.5" fill={`url(#${shine})`} />
    </svg>
  )
}
