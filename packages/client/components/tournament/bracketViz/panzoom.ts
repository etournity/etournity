import { Vector2d } from 'konva/lib/types'
import Konva from 'konva'
import { RefObject } from 'react'

const scaleBy = 0.96
const minScale = 0.25
const maxScale = 3.0

interface ZoomStageProps {
  event: Konva.KonvaEventObject<WheelEvent>
  stageRef: RefObject<Konva.Stage>
}

export const zoomStage = ({ event, stageRef }: ZoomStageProps) => {
  event.evt.preventDefault()
  if (stageRef.current !== null) {
    const stage = stageRef.current
    const oldScale = stage?.scaleX()
    const pointerPos = stage?.getPointerPosition() ?? { x: 0, y: 0 }
    const mousePointTo = {
      x: (pointerPos?.x - stage?.x()) / oldScale,
      y: (pointerPos?.y - stage?.y()) / oldScale,
    }
    const newScale =
      event.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy

    const limitedScale =
      newScale > maxScale ? maxScale : newScale < minScale ? minScale : newScale

    stage?.scale({ x: limitedScale, y: limitedScale })
    const newPos = {
      x: pointerPos?.x - mousePointTo.x * limitedScale,
      y: pointerPos?.y - mousePointTo.y * limitedScale,
    }

    stage?.position(newPos)
  }
}

interface HandletouchProps {
  event: Konva.KonvaEventObject<TouchEvent>
  stageRef: RefObject<Konva.Stage>
  lastCenter: Vector2d | null
  lastDist: number | null
}

interface HandletouchReturn {
  center: Vector2d | null
  dist: number | null
}

export const handleTouch = ({
  event,
  stageRef,
  lastCenter,
  lastDist,
}: HandletouchProps): HandletouchReturn => {
  event.evt.preventDefault()
  const touch1 = event.evt.touches[0]
  const touch2 = event.evt.touches[1]
  const stage = stageRef.current

  if (stage !== null) {
    if (touch1 && touch2) {
      if (stage?.isDragging()) {
        stage?.stopDrag()
      }

      const p1 = {
        x: touch1.clientX,
        y: touch1.clientY,
      }
      const p2 = {
        x: touch2.clientX,
        y: touch2.clientY,
      }

      if (!lastCenter) return { center: getCenter(p1, p2), dist: lastDist }

      const newCenter = getCenter(p1, p2)

      const dist = getDistance(p1, p2)

      if (!lastDist) return { dist, center: lastCenter }

      const pointTo = {
        x: (newCenter.x - stage?.x()) / stage?.scaleX(),
        y: (newCenter.y - stage?.y()) / stage?.scaleX(),
      }

      const scale = stage?.scaleX() * (dist / lastDist)

      stage?.scale({ x: scale, y: scale })

      const dx = newCenter.x - lastCenter.x
      const dy = newCenter.y - lastCenter.y

      const newPos = {
        x: newCenter.x - pointTo.x * scale + dx,
        y: newCenter.y - pointTo.y * scale + dy,
      }

      stage?.position(newPos)

      return { center: newCenter, dist }
    }
  }

  return { center: lastCenter, dist: lastDist }
}

/* eslint-disable prefer-exponentiation-operator */
export const getDistance = (p1: Vector2d, p2: Vector2d) =>
  Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))

export const getCenter = (p1: Vector2d, p2: Vector2d) => ({
  x: (p1.x + p2.x) / 2,
  y: (p1.y + p2.y) / 2,
})

export const isTouchEnabled = () =>
  'ontouchstart' in window || navigator.maxTouchPoints > 0
