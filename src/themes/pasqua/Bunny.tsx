/**
 * Il coniglio pasquale che sbuca dal bordo sinistro: si affaccia inclinato, sbatte gli
 * occhi, arriccia il naso, piega un orecchio e poi se ne va. Ogni parte ha la sua
 * animazione sullo stesso ciclo dell'affaccio.
 */
export default function Bunny() {
  return (
    <svg viewBox="0 0 84 112" className="block w-full overflow-visible" aria-hidden="true">
      <defs>
        <radialGradient id="bunny-fur" cx="0.42" cy="0.38" r="0.7">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.7" stopColor="#efe9e2" />
          <stop offset="1" stopColor="#d6cbbf" />
        </radialGradient>
      </defs>

      <g transform="rotate(-10 30 58)">
        <ellipse cx="30" cy="30" rx="9" ry="27" fill="url(#bunny-fur)" stroke="#cfc3b6" />
        <ellipse cx="30" cy="33" rx="4.4" ry="20" fill="#f6b3c8" />
      </g>
      <g className="origin-[54px_58px] animate-ear-flop motion-reduce:animate-none">
        <g transform="rotate(12 54 58)">
          <ellipse cx="54" cy="30" rx="9" ry="27" fill="url(#bunny-fur)" stroke="#cfc3b6" />
          <ellipse cx="54" cy="33" rx="4.4" ry="20" fill="#f6b3c8" />
        </g>
      </g>

      <ellipse cx="42" cy="78" rx="30" ry="27" fill="url(#bunny-fur)" stroke="#cfc3b6" />
      <ellipse cx="25" cy="88" rx="7" ry="4.5" fill="#f9b8c9" opacity="0.7" />
      <ellipse cx="59" cy="88" rx="7" ry="4.5" fill="#f9b8c9" opacity="0.7" />

      <g className="origin-[42px_74px] animate-blink motion-reduce:animate-none">
        <ellipse cx="31" cy="74" rx="5.4" ry="7" fill="#2b1d24" />
        <ellipse cx="53" cy="74" rx="5.4" ry="7" fill="#2b1d24" />
        <circle cx="32.8" cy="71" r="2" fill="#fff" />
        <circle cx="54.8" cy="71" r="2" fill="#fff" />
      </g>

      <g className="origin-[42px_86px] animate-nose-twitch motion-reduce:animate-none">
        <path d="M38 84h8l-4 4z" fill="#f07ca0" />
      </g>
      <path d="M42 88v4M42 92c-2 3-5 3-7 1M42 92c2 3 5 3 7 1" fill="none" stroke="#8c6f73" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="39.3" y="93" width="5.4" height="5" rx="1" fill="#fff" stroke="#d9cfc4" strokeWidth="0.6" />
      <g stroke="#b9a99c" strokeWidth="0.8" strokeLinecap="round">
        <path d="M28 88 12 85M28 91 12 93M56 88l16-3M56 91l16 2" />
      </g>

      {/* Front paws gripping the edge of the screen. */}
      <ellipse cx="70" cy="100" rx="8" ry="6" fill="url(#bunny-fur)" stroke="#cfc3b6" />
      <ellipse cx="62" cy="106" rx="7.5" ry="5.5" fill="url(#bunny-fur)" stroke="#cfc3b6" />
    </svg>
  )
}
