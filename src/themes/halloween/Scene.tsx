const BATS = [
  { top: '9%', size: 44, duration: 24, delay: 1 },
  { top: '21%', size: 32, duration: 29, delay: 9 },
  { top: '14%', size: 38, duration: 34, delay: 18 },
]

export default function HalloweenScene() {
  return (
    <>
      <div className="absolute inset-x-0 bottom-0 h-[45%] bg-[radial-gradient(70%_90%_at_50%_100%,rgba(226,116,42,0.2),transparent_70%)]" />

      <svg
        viewBox="0 0 120 120"
        className="absolute top-0 left-0 w-28 fill-none stroke-cream/25 stroke-[1.2]"
      >
        {[0, 18, 36, 54, 72, 90].map((angle) => (
          <line
            key={angle}
            x1="0"
            y1="0"
            x2={120 * Math.cos((angle * Math.PI) / 180)}
            y2={120 * Math.sin((angle * Math.PI) / 180)}
          />
        ))}
        {[28, 52, 78, 104].map((r) => (
          <path
            key={r}
            d={[0, 18, 36, 54, 72, 90]
              .map((angle, i) => {
                const rad = (angle * Math.PI) / 180
                const point = `${r * Math.cos(rad)} ${r * Math.sin(rad)}`
                return i === 0 ? `M${point}` : `Q${(r * 0.82 * Math.cos(rad - 0.157)).toFixed(1)} ${(r * 0.82 * Math.sin(rad - 0.157)).toFixed(1)} ${point}`
              })
              .join(' ')}
          />
        ))}
      </svg>

      {/* The thread starts above the screen, so it never detaches while bobbing. */}
      <div className="absolute -top-[10vh] right-[9%] flex animate-spider-bob flex-col items-center motion-reduce:animate-none">
        <span className="block h-[27vh] w-px bg-cream/30" />
        <svg viewBox="0 0 40 36" className="-mt-1 w-7 fill-[#120a16] stroke-[#120a16]">
          {[-1, 1].map((side) =>
            [6, 12, 18, 24].map((y, i) => (
              <path
                key={`${side}${y}`}
                d={`M20 ${16 + i * 1.5} Q${20 + side * 12} ${y - 2} ${20 + side * (16 + (i % 2) * 2)} ${y + 6}`}
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )),
          )}
          <ellipse cx="20" cy="20" rx="8" ry="9" />
          <circle cx="20" cy="9" r="5" />
          <circle cx="18" cy="8" r="1.2" fill="#e2742a" stroke="none" />
          <circle cx="22" cy="8" r="1.2" fill="#e2742a" stroke="none" />
        </svg>
      </div>

      {BATS.map((bat) => (
        <span
          key={bat.top}
          className="absolute left-0 animate-bat-fly motion-reduce:hidden"
          style={{
            top: bat.top,
            width: bat.size,
            animationDuration: `${bat.duration}s`,
            animationDelay: `${bat.delay}s`,
          }}
        >
          <svg viewBox="0 0 64 32" className="block w-full animate-bat-flap fill-[#120a16]">
            <path d="M32 9c-1.6-3-3.2-3.4-4.4-1C24 4 16 2 6 4c5 3 6 7 4 11 5-2 9 0 11 4 3-3 6-2 8 2l3 3 3-3c2-4 5-5 8-2 2-4 6-6 11-4-2-4-1-8 4-11-10-2-18 0-21.6 4-1.2-2.4-2.8-2-4.4 1z" />
          </svg>
        </span>
      ))}
    </>
  )
}
