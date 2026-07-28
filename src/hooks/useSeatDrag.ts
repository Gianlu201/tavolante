import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

/** Pointer travel before a press turns into a drag instead of a tap. */
const DRAG_THRESHOLD_PX = 8
/** Near the middle of the table the angle flips wildly, so hold the last slot. */
const CENTER_DEAD_ZONE_PCT = 12
const DROP_DURATION_MS = 340

export type SeatDragState = {
  sourceIndex: number
  targetSlot: number
  /** Pointer position as a percentage of the table box. */
  x: number
  y: number
  /** True while the seat flies from the finger to its final slot. */
  dropping: boolean
}

export const arrayMove = <T,>(items: T[], from: number, to: number) => {
  const next = [...items]
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved)
  return next
}

type UseSeatDragOptions = {
  tableRef: React.RefObject<HTMLDivElement | null>
  players: number
  enabled: boolean
  onReorder: (from: number, to: number) => void
}

export function useSeatDrag({
  tableRef,
  players,
  enabled,
  onReorder,
}: UseSeatDragOptions) {
  const [drag, setDrag] = useState<SeatDragState | null>(null)
  const originRef = useRef({ x: 0, y: 0 })
  const sourceRef = useRef(0)
  const slotRef = useRef(0)
  const activeRef = useRef(false)
  const suppressClickRef = useRef(false)
  const dropTimerRef = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(dropTimerRef.current), [])

  const toTablePercent = useCallback(
    (clientX: number, clientY: number) => {
      const rect = tableRef.current?.getBoundingClientRect()
      if (!rect) return null
      return {
        x: ((clientX - rect.left) / rect.width) * 100,
        y: ((clientY - rect.top) / rect.height) * 100,
      }
    },
    [tableRef],
  )

  /** Seat slots sit on a circle, so the angle under the pointer names the target. */
  const slotFromPoint = useCallback(
    (x: number, y: number) => {
      const dx = x - 50
      const dy = y - 50
      if (Math.hypot(dx, dy) < CENTER_DEAD_ZONE_PCT) return slotRef.current
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI
      const raw = (angle + 90) / (360 / players)
      return ((Math.round(raw) % players) + players) % players
    },
    [players],
  )

  const onPointerDown = useCallback(
    (index: number) => (event: React.PointerEvent<HTMLElement>) => {
      if (!enabled || event.button !== 0 || dropTimerRef.current !== undefined) return
      originRef.current = { x: event.clientX, y: event.clientY }
      sourceRef.current = index
      slotRef.current = index
      activeRef.current = false
      event.currentTarget.setPointerCapture(event.pointerId)
    },
    [enabled],
  )

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!enabled || !event.currentTarget.hasPointerCapture(event.pointerId)) return

      const travelled = Math.hypot(
        event.clientX - originRef.current.x,
        event.clientY - originRef.current.y,
      )
      if (!activeRef.current && travelled < DRAG_THRESHOLD_PX) return

      const point = toTablePercent(event.clientX, event.clientY)
      if (!point) return

      activeRef.current = true
      const targetSlot = slotFromPoint(point.x, point.y)
      if (targetSlot !== slotRef.current) {
        slotRef.current = targetSlot
        navigator.vibrate?.(8)
      }
      setDrag({ sourceIndex: sourceRef.current, targetSlot, ...point, dropping: false })
    },
    [enabled, slotFromPoint, toTablePercent],
  )

  const onPointerUp = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
      if (!activeRef.current) return

      activeRef.current = false
      // The click event fires right after this one: keep it from opening the drawer.
      suppressClickRef.current = true

      const from = sourceRef.current
      const to = slotRef.current
      onReorder(from, to)

      // Data is reordered already; the ghost keeps flying to the slot on its own.
      setDrag({ sourceIndex: from, targetSlot: to, x: 0, y: 0, dropping: true })
      dropTimerRef.current = window.setTimeout(() => {
        dropTimerRef.current = undefined
        setDrag(null)
      }, DROP_DURATION_MS)
    },
    [onReorder],
  )

  const onPointerCancel = useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    activeRef.current = false
    setDrag(null)
  }, [])

  const consumeClickSuppression = useCallback(() => {
    if (!suppressClickRef.current) return false
    suppressClickRef.current = false
    return true
  }, [])

  return {
    drag,
    consumeClickSuppression,
    seatHandlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel },
  }
}
