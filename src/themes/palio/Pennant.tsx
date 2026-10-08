import { QUARTIERI } from '../pisa/quartieri'

/** Una bandierina del quartiere, in alto a destra del posto: ogni giocatore ha la sua squadra. */
export default function Pennant({ index }: { index: number }) {
  const { color } = QUARTIERI[index % QUARTIERI.length]
  return (
    <svg
      viewBox="0 0 22 26"
      className="pointer-events-none absolute -top-[26%] -right-[12%] z-1 w-[34%] drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]"
      aria-hidden="true"
    >
      <line x1="3" y1="2" x2="3" y2="25" stroke="#e9dcc0" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M4 3h16l-4.5 5 4.5 5H4z"
        fill={color}
        stroke="#fff"
        strokeOpacity="0.7"
        strokeWidth="0.8"
        className="origin-left animate-pennant-wave motion-reduce:animate-none [transform-box:fill-box]"
      />
    </svg>
  )
}
