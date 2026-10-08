/**
 * Attorno al tavolo una biancheria tonda: un filo di legno bianco con i lampanini sopra.
 * Il viewBox è centrato sul tavolo e ne misura il raggio in 100 unità.
 */
const LAMPS = Array.from({ length: 64 }, (_, i) => {
  const angle = (i / 64) * Math.PI * 2
  return { x: 104 * Math.cos(angle), y: 104 * Math.sin(angle) }
})

export default function LuminiRing() {
  return (
    <svg
      viewBox="-120 -120 240 240"
      className="pointer-events-none absolute -inset-[10%] z-1 overflow-visible"
      aria-hidden="true"
    >
      <circle r="104" fill="none" stroke="#f4efe2" strokeOpacity="0.55" strokeWidth="1.8" />
      <circle r="108" fill="none" stroke="#ffb347" strokeOpacity="0.12" strokeWidth="9" />
      {[0, 1].map((group) => (
        <g
          key={group}
          className="animate-lumini-flicker [filter:drop-shadow(0_0_2px_#ffb347)] motion-reduce:animate-none"
          style={{ animationDuration: group ? '2.1s' : '2.9s' }}
        >
          {LAMPS.filter((_, i) => i % 2 === group).map(({ x, y }, i) => (
            <circle key={i} cx={x} cy={y} r="1.9" fill="#ffd98a" />
          ))}
        </g>
      ))}
    </svg>
  )
}
