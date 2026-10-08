/**
 * I Lungarni di Pisa in un viewBox 400×124, largo quanto lo schermo e alto fino al bordo
 * del tavolo. Al centro il Ponte di Mezzo: il suo arco illuminato incornicia titolo e
 * pulsanti, e attraverso il ponte si vede la sponda opposta, più piccola e lontana. Ai
 * lati i palazzi della sponda vicina, la Torre a sinistra e Santa Maria della Spina a
 * destra. Per la Luminara i lampanini seguono le linee dell'architettura come fanno le
 * biancherie: spigoli, cornicioni, contorni delle finestre, l'arco e la spalletta.
 * Tutto è calcolato una volta al caricamento e non cambia mai.
 */

export type Point = { x: number; y: number }

export const VIEW_WIDTH = 400
export const VIEW_HEIGHT = 124
/** Top of the river wall: the near buildings stand on it. */
export const STREET_Y = 116
/** Street level on the far bank, seen through the bridge. */
const FAR_STREET_Y = 76

type Building = {
  x: number
  width: number
  height: number
  floors: number
  windows: number
}

export const NEAR_BUILDINGS: Building[] = [
  { x: 0, width: 30, height: 78, floors: 4, windows: 2 },
  { x: 30, width: 34, height: 94, floors: 5, windows: 3 },
  { x: 64, width: 30, height: 40, floors: 2, windows: 3 },
  { x: 336, width: 34, height: 84, floors: 4, windows: 3 },
  { x: 370, width: 30, height: 70, floors: 4, windows: 2 },
]

export const FAR_BUILDINGS: Building[] = [
  { x: 96, width: 34, height: 38, floors: 3, windows: 3 },
  { x: 130, width: 30, height: 46, floors: 3, windows: 2 },
  { x: 160, width: 40, height: 34, floors: 2, windows: 4 },
  { x: 200, width: 32, height: 42, floors: 3, windows: 3 },
  { x: 232, width: 38, height: 36, floors: 3, windows: 3 },
  { x: 270, width: 36, height: 44, floors: 3, windows: 2 },
]

export const BRIDGE = { from: 96, to: 306, parapetY: 74, deckY: 80, crownY: 88 }

export const SPINA = { x: 306, width: 30, base: 24 }

export const TOWER = { x: 70, width: 17, top: 3, lean: 4 }

const line = (from: Point, to: Point, spacing: number): Point[] => {
  const length = Math.hypot(to.x - from.x, to.y - from.y)
  const steps = Math.max(1, Math.round(length / spacing))
  return Array.from({ length: steps + 1 }, (_, i) => ({
    x: from.x + ((to.x - from.x) * i) / steps,
    y: from.y + ((to.y - from.y) * i) / steps,
  }))
}

/** Points on a quadratic arc from `from` to `to`, its control point at `controlY`. */
const arc = (from: Point, to: Point, controlY: number, count: number): Point[] =>
  Array.from({ length: count + 1 }, (_, i) => {
    const t = i / count
    return {
      x: from.x + (to.x - from.x) * t,
      y: (1 - t) * (1 - t) * from.y + 2 * (1 - t) * t * controlY + t * t * to.y,
    }
  })

/** An arched window: the two sides and a three-lamp arch, as the biancherie draw them. */
const windowFrame = (x: number, y: number, size: number): Point[] => [
  { x, y: y + 7 * size },
  { x, y: y + 3.6 * size },
  { x: x + 0.7 * size, y: y + size },
  { x: x + 2 * size, y },
  { x: x + 3.3 * size, y: y + size },
  { x: x + 4 * size, y: y + 3.6 * size },
  { x: x + 4 * size, y: y + 7 * size },
]

const buildingLamps = (
  { x, width, height, floors, windows }: Building,
  street: number,
  size: number,
): Point[] => {
  const top = street - height
  const right = x + width
  const floorHeight = height / floors
  const spacing = 5 * size
  const points = [
    ...line({ x: x + 1, y: street }, { x: x + 1, y: top }, spacing),
    ...line({ x: x + 1, y: top }, { x: right - 1, y: top }, spacing * 0.9),
    ...line({ x: right - 1, y: top }, { x: right - 1, y: street }, spacing),
  ]
  for (let floor = 1; floor < floors; floor++) {
    const y = top + floor * floorHeight
    points.push(...line({ x: x + 3, y }, { x: right - 3, y }, spacing))
  }
  const gap = width / windows
  for (let floor = 0; floor < floors; floor++) {
    for (let w = 0; w < windows; w++) {
      points.push(
        ...windowFrame(
          x + gap * w + gap / 2 - 2 * size,
          top + floor * floorHeight + floorHeight / 2 - 3.5 * size,
          size,
        ),
      )
    }
  }
  return points
}

const bridgeLamps = (): Point[] => {
  const { from, to, parapetY, crownY } = BRIDGE
  return [
    ...line({ x: from, y: parapetY }, { x: to, y: parapetY }, 4),
    ...line({ x: from + 4, y: parapetY + 6 }, { x: to - 4, y: parapetY + 6 }, 8),
    ...arc({ x: from + 10, y: VIEW_HEIGHT }, { x: to - 10, y: VIEW_HEIGHT }, 2 * crownY - VIEW_HEIGHT, 46),
  ]
}

const spinaLamps = (): Point[] => {
  const { x, width, base } = SPINA
  const top = STREET_Y - base
  const mid = x + width / 2
  return [
    ...line({ x, y: STREET_Y }, { x, y: top }, 4.5),
    ...line({ x: x + width, y: top }, { x: x + width, y: STREET_Y }, 4.5),
    // The three gables and the pinnacles that make it recognisable.
    ...line({ x, y: top }, { x: x + width / 4, y: top - 11 }, 3),
    ...line({ x: x + width / 4, y: top - 11 }, { x: mid - 3, y: top }, 3),
    ...line({ x: mid - 3, y: top }, { x: mid, y: top - 17 }, 3),
    ...line({ x: mid, y: top - 17 }, { x: mid + 3, y: top }, 3),
    ...line({ x: mid + 3, y: top }, { x: x + (3 * width) / 4, y: top - 11 }, 3),
    ...line({ x: x + (3 * width) / 4, y: top - 11 }, { x: x + width, y: top }, 3),
    ...line({ x: x - 1, y: top }, { x: x - 1, y: top - 19 }, 3),
    ...line({ x: x + width + 1, y: top }, { x: x + width + 1, y: top - 19 }, 3),
    ...line({ x: mid, y: top - 17 }, { x: mid, y: top - 26 }, 3),
    ...Array.from({ length: 8 }, (_, i) => ({
      x: mid + 3 * Math.cos((i / 8) * Math.PI * 2),
      y: top + 9 + 3 * Math.sin((i / 8) * Math.PI * 2),
    })),
  ]
}

const wallLamps = (): Point[] => [
  ...line({ x: 0, y: STREET_Y }, { x: BRIDGE.from, y: STREET_Y }, 4),
  ...line({ x: BRIDGE.to, y: STREET_Y }, { x: VIEW_WIDTH, y: STREET_Y }, 4),
]

const round = (point: Point): Point => ({
  x: Math.round(point.x * 10) / 10,
  y: Math.round(point.y * 10) / 10,
})

const leftToRight = (points: Point[]) => points.map(round).sort((a, b) => a.x - b.x)

/** The near bank, the bridge and the Spina: bright, left to right so they light up in order. */
export const LAMPS: Point[] = leftToRight([
  ...NEAR_BUILDINGS.flatMap((building) => buildingLamps(building, STREET_Y, 1)),
  ...bridgeLamps(),
  ...spinaLamps(),
  ...wallLamps(),
])

/** The far bank seen through the bridge: smaller and dimmer, behind the title. */
export const FAR_LAMPS: Point[] = leftToRight([
  ...FAR_BUILDINGS.flatMap((building) => buildingLamps(building, FAR_STREET_Y, 0.7)),
  ...line({ x: BRIDGE.from, y: FAR_STREET_Y }, { x: BRIDGE.to, y: FAR_STREET_Y }, 3.5),
])

/** Lamps dealt into a few layers that flicker out of step with each other. */
export const LAMP_LAYERS = 4
export const lampLayer = (layer: number) => LAMPS.filter((_, i) => i % LAMP_LAYERS === layer)

const box = ({ x, width, height }: Building, street: number) =>
  `M${x} ${street}V${street - height}H${x + width}V${street}Z`

/** The near bank as one dark mass the lamps sit on. */
export const NEAR_PATH = [
  ...NEAR_BUILDINGS.map((building) => box(building, STREET_Y)),
  (() => {
    const { x, width, base } = SPINA
    const top = STREET_Y - base
    const mid = x + width / 2
    return `M${x} ${STREET_Y}V${top}L${x + width / 4} ${top - 11}L${mid - 3} ${top}L${mid} ${top - 17}L${mid + 3} ${top}L${x + (3 * width) / 4} ${top - 11}L${x + width} ${top}V${STREET_Y}Z`
  })(),
].join('')

export const FAR_PATH = FAR_BUILDINGS.map((building) => box(building, FAR_STREET_Y)).join('')

/** The bridge: deck and parapet, with the arch cut out of it. */
export const BRIDGE_PATH = (() => {
  const { from, to, parapetY, crownY } = BRIDGE
  const controlY = 2 * crownY - VIEW_HEIGHT
  return `M${from} ${VIEW_HEIGHT}V${parapetY}H${to}V${VIEW_HEIGHT}H${to - 10}Q200 ${controlY} ${from + 10} ${VIEW_HEIGHT}Z`
})()

/** Lit windows for the Palio at sunset, when the lamps are still off. */
export const SUNSET_WINDOWS: Point[] = NEAR_BUILDINGS.flatMap(
  ({ x, width, height, floors, windows }, b) => {
    const top = STREET_Y - height
    const floorHeight = height / floors
    const gap = width / windows
    const lit: Point[] = []
    for (let floor = 0; floor < floors; floor++) {
      for (let w = 0; w < windows; w++) {
        if ((b * 7 + floor * 3 + w * 5) % 3 === 0) {
          lit.push({ x: x + gap * w + gap / 2 - 2, y: top + floor * floorHeight + floorHeight / 2 - 3.5 })
        }
      }
    }
    return lit
  },
)
