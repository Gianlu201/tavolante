import Fireworks, { type Burst } from '../../components/Fireworks'
import { scatter } from '../../lib/scatter'

const SKY_BURSTS: Burst[] = [
  { x: 16, y: 13, delay: 0.6, color: '#ecd8a3' },
  { x: 82, y: 9, delay: 2.8, color: '#e08363' },
  { x: 58, y: 20, delay: 4.7, color: '#c9ced6' },
]

export default function NewYearsEveScene() {
  return (
    <>
      <div className="absolute inset-x-0 top-0 h-[50%] bg-[radial-gradient(80%_70%_at_50%_0%,rgba(214,174,102,0.16),transparent_70%)]" />
      {Array.from({ length: 16 }, (_, i) => (
        <span
          key={i}
          className="absolute animate-twinkle text-gold-light motion-reduce:animate-none"
          style={{
            // Stars stay at the edges, away from the table in the middle.
            left: `${i % 2 === 0 ? 1 + scatter(i, 1) * 9 : 90 + scatter(i, 1) * 8}%`,
            top: `${4 + scatter(i, 2) * 88}%`,
            fontSize: `${8 + scatter(i, 3) * 9}px`,
            animationDuration: `${1.8 + scatter(i, 4) * 2}s`,
            animationDelay: `${-scatter(i, 5) * 3}s`,
          }}
        >
          ✦
        </span>
      ))}
      <Fireworks bursts={SKY_BURSTS} cycle={6.5} radius={44} className="opacity-75" />
    </>
  )
}
