import { useCallback, useEffect, useRef, useState } from 'react'
import { directionStep, type Direction } from '../lib/dealing'
import {
  polarToPercent,
  REST_RADIUS_PCT,
  REST_SCALE,
  SEAT_RADIUS_PCT,
  seatAngleDeg,
} from '../lib/table'

const LOOPS = 3
const MIN_DELAY = 28
const MAX_DELAY = 460
const DELAY_POWER = 3.2
const TWEEN_RATIO = 0.82
const MIN_TWEEN = 60
const LIFT_DURATION = 280
const LAND_DURATION = 420

type Frame = {
  angle: number
  radius: number
  spin: number
  scale: number
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

const easeOutBack = (t: number) => {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const paint = (el: HTMLElement, frame: Frame) => {
  const { x, y } = polarToPercent(frame.angle, frame.radius)
  el.style.left = `${x}%`
  el.style.top = `${y}%`
  el.style.transform = `translate(-50%, -50%) rotate(${frame.spin}deg) scale(${frame.scale})`
}

const lerpFrame = (from: Frame, to: Frame, e: number): Frame => ({
  angle: from.angle + (to.angle - from.angle) * e,
  radius: from.radius + (to.radius - from.radius) * e,
  spin: from.spin + (to.spin - from.spin) * e,
  scale: from.scale + (to.scale - from.scale) * e,
})

const tween = (
  el: HTMLElement,
  from: Frame,
  to: Frame,
  duration: number,
  easing: (t: number) => number,
  cancelled: () => boolean,
) =>
  new Promise<boolean>((resolve) => {
    const start = performance.now()
    const step = (now: number) => {
      if (cancelled()) {
        resolve(false)
        return
      }
      const t = Math.min(1, (now - start) / duration)
      paint(el, lerpFrame(from, to, easing(t)))
      if (t < 1) requestAnimationFrame(step)
      else resolve(true)
    }
    requestAnimationFrame(step)
  })

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

/**
 * The card is painted every frame from polar coordinates (angle + radius) so its
 * path stays a true arc of the seat circle instead of a chord between two seats.
 */
export function useDealAnimation(cardRef: React.RefObject<HTMLElement | null>) {
  const [spinning, setSpinning] = useState(false)
  const runIdRef = useRef(0)

  useEffect(() => () => void (runIdRef.current += 1), [])

  const hideCard = useCallback(() => {
    runIdRef.current += 1
    setSpinning(false)
    const el = cardRef.current
    if (el) el.style.opacity = '0'
  }, [cardRef])

  const deal = useCallback(
    async (startIndex: number, players: number, direction: Direction) => {
      const el = cardRef.current
      if (!el) return false

      const runId = ++runIdRef.current
      const cancelled = () => runIdRef.current !== runId
      setSpinning(true)

      const step = directionStep(direction)
      const anglePerTick = (360 / players) * step
      const ticks =
        LOOPS * players + ((((startIndex * step) % players) + players) % players)
      const originAngle = seatAngleDeg(0, players)

      if (prefersReducedMotion()) {
        paint(el, {
          angle: seatAngleDeg(startIndex, players),
          radius: REST_RADIUS_PCT,
          spin: 0,
          scale: REST_SCALE,
        })
        el.style.opacity = '1'
        setSpinning(false)
        return true
      }

      paint(el, { angle: originAngle, radius: 0, spin: 0, scale: 0.4 })
      el.style.opacity = '1'

      let current: Frame = { angle: originAngle, radius: 0, spin: 0, scale: 0.4 }
      const lifted: Frame = { ...current, radius: SEAT_RADIUS_PCT, scale: 1 }
      if (!(await tween(el, current, lifted, LIFT_DURATION, easeOutCubic, cancelled)))
        return false
      current = lifted

      for (let tick = 1; tick <= ticks; tick++) {
        const progress = tick / ticks
        const delay = MIN_DELAY + (MAX_DELAY - MIN_DELAY) * Math.pow(progress, DELAY_POWER)
        const duration = Math.max(delay * TWEEN_RATIO, MIN_TWEEN)
        const next: Frame = {
          ...current,
          angle: current.angle + anglePerTick,
          spin: current.spin + anglePerTick,
        }
        if (!(await tween(el, current, next, duration, easeOutCubic, cancelled))) return false
        current = next
        await wait(delay - duration)
        if (cancelled()) return false
      }

      // Keep the angle as-is: it already sits on the target seat plus whole turns,
      // and re-targeting it would unwind those turns backwards.
      const landed: Frame = { ...current, radius: REST_RADIUS_PCT, scale: REST_SCALE }
      if (!(await tween(el, current, landed, LAND_DURATION, easeOutBack, cancelled)))
        return false

      setSpinning(false)
      return true
    },
    [cardRef],
  )

  return { spinning, deal, hideCard }
}
