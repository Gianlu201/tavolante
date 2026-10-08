const MASK_COLORS = ['#f2c230', '#e3408f', '#2ec4c4', '#9bd93c', '#ff8c2e', '#8a5cf5']

/** Una mascherina sul bastoncino in alto a destra del posto, di un colore diverso per ognuno. */
export default function Mask({ index }: { index: number }) {
  const color = MASK_COLORS[index % MASK_COLORS.length]
  return (
    <svg
      viewBox="0 0 48 32"
      className="pointer-events-none absolute -top-[28%] -right-[24%] z-1 w-[64%] rotate-[16deg] drop-shadow-[0_2px_2px_rgba(0,0,0,0.45)]"
      aria-hidden="true"
    >
      <path d="M44 6c-4 2-6 6-5 10 5-2 8-6 9-12-1 1-2 1-4 2z" fill="#fff" opacity="0.9" />
      <line x1="40" y1="14" x2="46" y2="31" stroke="#c9a15a" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M4 10c6-6 14-6 20-1 6-5 14-5 20 1-1 8-6 13-12 13-4 0-6-3-8-3s-4 3-8 3C10 23 5 18 4 10z"
        fill={color}
        stroke="#fff"
        strokeOpacity="0.8"
        strokeWidth="1"
      />
      <ellipse cx="14" cy="13" rx="4.6" ry="3" fill="#1a1020" />
      <ellipse cx="34" cy="13" rx="4.6" ry="3" fill="#1a1020" />
      {[8, 12, 18, 30, 36, 40].map((x) => (
        <circle key={x} cx={x} cy="19" r="0.9" fill="#fff" opacity="0.85" />
      ))}
    </svg>
  )
}
