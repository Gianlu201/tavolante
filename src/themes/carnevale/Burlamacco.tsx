/**
 * Burlamacco, la maschera del Carnevale di Viareggio disegnata da Uberto Bonetti: tuta a
 * scacchi bianchi e rossi, pon-pon bianco, gorgiera, berretto rosso e mantello nero. Si
 * affaccia dal bordo destro e saluta con la mano.
 */
export default function Burlamacco() {
  return (
    <svg viewBox="0 0 100 132" className="block w-full overflow-visible" aria-hidden="true">
      <defs>
        <pattern id="burlamacco-checks" width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="12" height="12" fill="#fbf7f2" />
          <rect width="6" height="6" fill="#d22a35" />
          <rect x="6" y="6" width="6" height="6" fill="#d22a35" />
        </pattern>
        <radialGradient id="burlamacco-skin" cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#ffe6d2" />
          <stop offset="1" stopColor="#efbf9c" />
        </radialGradient>
      </defs>

      {/* Black cape, with a glimpse of its red lining. */}
      <path d="M30 70Q16 100 10 132h90q-4-32-16-62z" fill="#15101c" />
      <path d="M33 74q-12 26-15 58h6q3-30 13-56z" fill="#b3122b" />

      <path d="M36 74q21-6 42 0l4 58H32z" fill="url(#burlamacco-checks)" stroke="#b8202b" strokeWidth="0.8" />
      <circle cx="57" cy="98" r="7" fill="#fff" stroke="#d8d2cc" />
      <circle cx="55" cy="96" r="2.4" fill="#f1ede8" />

      {/* The waving arm swings from the shoulder. */}
      <g className="origin-[38px_80px] animate-wave motion-reduce:animate-none">
        <path d="M40 80 20 52l8-5 18 28z" fill="url(#burlamacco-checks)" stroke="#b8202b" strokeWidth="0.8" />
        <circle cx="22" cy="46" r="7" fill="#fff" stroke="#d8d2cc" />
        <path d="M16 42v-7M20 40v-9M24 40v-8M28 42v-6" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" />
        <path d="M16 42v-7M20 40v-9M24 40v-8M28 42v-6" stroke="#d8d2cc" strokeWidth="0.6" strokeLinecap="round" opacity="0.6" />
      </g>

      {/* The wide white ruff. */}
      <ellipse cx="57" cy="71" rx="25" ry="8.5" fill="#fff" stroke="#d8d2cc" />
      {Array.from({ length: 14 }, (_, i) => {
        const angle = (i / 14) * Math.PI * 2
        return (
          <circle
            key={i}
            cx={57 + 25 * Math.cos(angle)}
            cy={71 + 8.5 * Math.sin(angle)}
            r="4.4"
            fill="#fff"
            stroke="#d8d2cc"
            strokeWidth="0.7"
          />
        )
      })}

      <circle cx="57" cy="46" r="20" fill="url(#burlamacco-skin)" />
      <circle cx="45" cy="52" r="4.6" fill="#f59a9a" opacity="0.65" />
      <circle cx="69" cy="52" r="4.6" fill="#f59a9a" opacity="0.65" />
      <g className="origin-[57px_42px] animate-blink motion-reduce:animate-none">
        <ellipse cx="50" cy="42" rx="2.8" ry="3.8" fill="#1c1418" />
        <ellipse cx="64" cy="42" rx="2.8" ry="3.8" fill="#1c1418" />
        <circle cx="51" cy="40.6" r="1" fill="#fff" />
        <circle cx="65" cy="40.6" r="1" fill="#fff" />
      </g>
      <path d="M46 35q4-3 8 0M60 35q4-3 8 0" fill="none" stroke="#5b3a2a" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="57" cy="48.5" r="3.4" fill="#f08a6a" />
      <path d="M45 54q12 13 24 0z" fill="#6e1622" />
      <path d="M47 54.6h20l-1 2.4H48z" fill="#fff" />
      <path d="M52 61q5 3 10 0" fill="none" stroke="#e8606a" strokeWidth="2.4" strokeLinecap="round" />

      {/* The red cap, slouched to one side. */}
      <path d="M35 36q2-20 24-22 22-1 27 18-9-6-22-5-17 2-29 9z" fill="#d22a35" />
      <path d="M35 36q12-7 29-9 13-1 22 5" fill="none" stroke="#8f1219" strokeWidth="2.2" />
      <circle cx="84" cy="18" r="4.6" fill="#fff" stroke="#d8d2cc" />
    </svg>
  )
}
