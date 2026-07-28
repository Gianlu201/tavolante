export const SEAT_RADIUS_PCT = 38
export const REST_RADIUS_PCT = 27
export const REST_SCALE = 0.62

export const seatAngleDeg = (index: number, players: number) =>
  -90 + (360 / players) * index

export const polarToPercent = (angleDeg: number, radiusPct: number) => {
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: 50 + radiusPct * Math.cos(rad),
    y: 50 + radiusPct * Math.sin(rad),
  }
}

export const seatPosition = (index: number, players: number) =>
  polarToPercent(seatAngleDeg(index, players), SEAT_RADIUS_PCT)
