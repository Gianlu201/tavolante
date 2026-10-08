import { scatter } from '../../lib/scatter'
import Lungarno from '../pisa/Lungarno'
import { QUARTIERI } from '../pisa/quartieri'

const FLAGS = 18

/**
 * Palio di San Ranieri (17 giugno): tramonto sull'Arno, Lungarni in controluce e le
 * bandierine dei quattro quartieri. Le galee in gara girano attorno al tavolo.
 */
export default function PalioScene() {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#1b1d48_0%,#6a3a6c_9%,#d9705c_15%,#f4b46a_18%,#e88a5c_19%,#7a3f63_30%,#2a2048_50%,#141433_100%)]" />
      <div className="absolute top-[11%] right-[14%] size-24 rounded-full bg-[radial-gradient(circle,#ffe2a0,#ffb35c_45%,transparent_70%)] opacity-80" />

      <Lungarno variant="palio" />

      {/* Bunting in the colours of the four quarters, hanging over the header. */}
      <div className="absolute inset-x-0 top-[env(safe-area-inset-top,0px)] flex justify-between px-1">
        {Array.from({ length: FLAGS }, (_, i) => (
          <span
            key={i}
            className="block h-4 w-3.5 origin-top animate-bauble-swing [clip-path:polygon(0_0,100%_0,50%_100%)] motion-reduce:animate-none"
            style={{
              backgroundColor: QUARTIERI[i % QUARTIERI.length].color,
              marginTop: `${4 * Math.sin((Math.PI * (i + 0.5)) / FLAGS)}px`,
              animationDuration: `${2.6 + scatter(i, 43)}s`,
              animationDelay: `${-scatter(i, 44) * 2}s`,
            }}
          />
        ))}
      </div>
    </>
  )
}
