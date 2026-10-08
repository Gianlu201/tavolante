import {
  BRIDGE_PATH,
  FAR_LAMPS,
  FAR_PATH,
  LAMP_LAYERS,
  lampLayer,
  NEAR_PATH,
  STREET_Y,
  SUNSET_WINDOWS,
  TOWER,
  VIEW_HEIGHT,
  VIEW_WIDTH,
} from './skyline'

export type LungarnoVariant = 'luminara' | 'palio'

const PALETTE = {
  luminara: { mass: '#0b0d16', far: '#0d1120', wall: '#0e1119', tower: '#d8cfb8', towerOpacity: 0.3 },
  palio: { mass: '#2a1830', far: '#4a2a4a', wall: '#24142a', tower: '#3c2340', towerOpacity: 1 },
}

const VIEW_BOX = `0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`

/** Each layer flickers on its own clock, so the lamps never pulse all together. */
const FLICKER = ['1.7s', '2.3s', '2.9s', '3.5s']

const LAYERS = Array.from({ length: LAMP_LAYERS }, (_, layer) => lampLayer(layer))

function Architecture({ variant }: { variant: LungarnoVariant }) {
  const colors = PALETTE[variant]
  const towerTiers = Array.from({ length: 7 }, (_, i) => TOWER.top + 14 + i * 14)

  return (
    <svg
      viewBox={VIEW_BOX}
      preserveAspectRatio="xMidYMax meet"
      className="absolute inset-0 size-full"
    >
      <g
        transform={`rotate(${TOWER.lean} ${TOWER.x + TOWER.width / 2} ${STREET_Y})`}
        opacity={colors.towerOpacity}
      >
        <rect
          x={TOWER.x}
          y={TOWER.top + 8}
          width={TOWER.width}
          height={STREET_Y - TOWER.top - 8}
          fill={colors.tower}
        />
        <rect
          x={TOWER.x + 2.5}
          y={TOWER.top}
          width={TOWER.width - 5}
          height={9}
          fill={colors.tower}
        />
        {towerTiers.map((y) => (
          <g key={y}>
            <line
              x1={TOWER.x}
              x2={TOWER.x + TOWER.width}
              y1={y}
              y2={y}
              stroke="#0a0d17"
              strokeOpacity="0.45"
              strokeWidth="0.9"
            />
            {[3, 7, 11, 15].map((dx) => (
              <line
                key={dx}
                x1={TOWER.x + dx - 0.6}
                x2={TOWER.x + dx - 0.6}
                y1={y + 3}
                y2={y + 12}
                stroke="#0a0d17"
                strokeOpacity="0.3"
                strokeWidth="1"
              />
            ))}
          </g>
        ))}
      </g>

      <path d={FAR_PATH} fill={colors.far} />
      <path d={NEAR_PATH} fill={colors.mass} />
      <path d={BRIDGE_PATH} fill={colors.mass} />
      <rect x="0" y={STREET_Y} width={VIEW_WIDTH} height={VIEW_HEIGHT - STREET_Y} fill={colors.wall} />

      {variant === 'palio' &&
        SUNSET_WINDOWS.map(({ x, y }, i) => (
          <rect key={i} x={x} y={y} width="4" height="7" rx="1.6" fill="#ffc56b" opacity="0.75" />
        ))}
    </svg>
  )
}

/**
 * The lamps, in layers that each get their own composited box: only their opacity
 * animates, so even a few hundred points flicker without repainting.
 */
function Lamps({ reveal }: { reveal: boolean }) {
  return (
    <div
      className={`absolute inset-0 ${reveal ? 'animate-lumini-reveal motion-reduce:animate-none' : ''}`}
    >
      <svg
        viewBox={VIEW_BOX}
        preserveAspectRatio="xMidYMax meet"
        className="absolute inset-0 size-full animate-lumini-flicker opacity-60 [filter:drop-shadow(0_0_1px_#ffb347)] will-change-[opacity] motion-reduce:animate-none"
        style={{ animationDuration: '4.1s' }}
      >
        {FAR_LAMPS.map(({ x, y }, i) => (
          <circle key={i} cx={x} cy={y} r="0.6" fill="#ffd98a" />
        ))}
      </svg>
      {LAYERS.map((points, layer) => (
        <svg
          key={layer}
          viewBox={VIEW_BOX}
          preserveAspectRatio="xMidYMax meet"
          className="absolute inset-0 size-full animate-lumini-flicker [filter:drop-shadow(0_0_1.4px_#ffb347)_drop-shadow(0_0_3px_rgba(255,170,60,0.55))] will-change-[opacity] motion-reduce:animate-none"
          style={{ animationDuration: FLICKER[layer], animationDelay: `${-layer * 0.4}s` }}
        >
          {points.map(({ x, y }, i) => (
            <circle key={i} cx={x} cy={y} r="0.85" fill="#ffd98a" />
          ))}
        </svg>
      ))}
    </div>
  )
}

type LungarnoProps = {
  variant: LungarnoVariant
  /** Lamps light up left to right instead of being on from the start. */
  reveal?: boolean
}

/** I Lungarni in cima allo schermo, con il loro riflesso nell'Arno subito sotto. */
export default function Lungarno({ variant, reveal = false }: LungarnoProps) {
  return (
    <div className="absolute top-[env(safe-area-inset-top,0px)] left-1/2 w-full max-w-140 -translate-x-1/2">
      <div className="relative aspect-[400/124]">
        <Architecture variant={variant} />
        {variant === 'luminara' && <Lamps reveal={reveal} />}
      </div>
      {/* Mirrored in place: the waterline stays where the two copies meet. */}
      <div className="relative aspect-[400/124] -scale-y-100 animate-arno-shimmer opacity-45 blur-[1.3px] motion-reduce:animate-none">
        <Architecture variant={variant} />
        {variant === 'luminara' && <Lamps reveal={reveal} />}
      </div>
    </div>
  )
}
