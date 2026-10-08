/**
 * Un uovo decorato nel nido che ogni tanto trema, si crepa e lascia uscire un pulcino;
 * dopo un po' il pulcino rientra e il guscio si richiude. Tutte le parti condividono lo
 * stesso ciclo, sfasato solo nei keyframe.
 */
export default function HatchingEgg() {
  return (
    <svg viewBox="0 0 64 84" className="block w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id="egg-paint" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#cbe9ff" />
          <stop offset="1" stopColor="#9cc9f2" />
        </linearGradient>
        <clipPath id="egg-bottom">
          <rect x="0" y="46" width="64" height="40" />
        </clipPath>
        <clipPath id="egg-top">
          <rect x="0" y="0" width="64" height="47" />
        </clipPath>
      </defs>

      <g className="origin-[32px_70px] animate-egg-wobble motion-reduce:animate-none">
        {/* The chick waits inside, between the two halves of the shell. */}
        <g className="animate-chick-rise motion-reduce:animate-none">
          <circle cx="32" cy="46" r="13" fill="#ffd84a" />
          <path d="M30 33c1-4 4-4 4-1 1-3 4-2 3 1" fill="none" stroke="#f5b82e" strokeWidth="1.6" strokeLinecap="round" />
          <g className="origin-[32px_44px] animate-blink motion-reduce:animate-none">
            <circle cx="27" cy="44" r="2" fill="#2b1d24" />
            <circle cx="37" cy="44" r="2" fill="#2b1d24" />
          </g>
          <path d="M29 48h6l-3 4z" fill="#f28a1e" />
          <ellipse cx="23" cy="49" rx="2.6" ry="1.6" fill="#ffad8a" opacity="0.7" />
          <ellipse cx="41" cy="49" rx="2.6" ry="1.6" fill="#ffad8a" opacity="0.7" />
        </g>

        <g clipPath="url(#egg-bottom)">
          <ellipse cx="32" cy="48" rx="21" ry="27" fill="url(#egg-paint)" />
          <path d="M11 58l5-5 5 5 5-5 6 5 5-5 5 5 5-5 5 5" fill="none" stroke="#f08cb2" strokeWidth="2.4" />
          {[18, 27, 37, 46].map((x) => (
            <circle key={x} cx={x} cy="66" r="1.6" fill="#ffd84a" />
          ))}
        </g>
        <path d="M11 47l5 3 4-4 5 4 4-4 5 4 4-4 5 4 4-4 5 3" fill="none" stroke="#7aa8d4" strokeWidth="1" className="animate-egg-crack motion-reduce:hidden" />

        <g className="origin-[44px_40px] animate-egg-cap motion-reduce:animate-none">
          <g clipPath="url(#egg-top)">
            <ellipse cx="32" cy="48" rx="21" ry="27" fill="url(#egg-paint)" />
            <path d="M13 36h38" stroke="#f08cb2" strokeWidth="2.4" />
            <path d="M15 31h34" stroke="#ffd84a" strokeWidth="1.6" strokeDasharray="3 3" />
          </g>
        </g>
      </g>

      {/* The nest. */}
      <path d="M6 70c8 10 44 10 52 0" fill="none" stroke="#9b6a3a" strokeWidth="5" strokeLinecap="round" />
      <path d="M8 72c10 6 38 6 48 0M5 68c12 8 42 8 54 0" fill="none" stroke="#c99a5e" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}
