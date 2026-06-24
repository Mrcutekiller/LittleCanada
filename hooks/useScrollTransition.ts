'use client'

import { useRef, useCallback, PointerEvent } from 'react'
import { MotionValue, useMotionValue, animate } from 'framer-motion'

const SWIPE_THRESHOLD = 300
const SNAP_THRESHOLD = 0.5

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function useScrollTransition() {
  const transitionProgress = useMotionValue(0)
  const isAnimating = useRef(false)
  const gestureState = useRef({
    mode: 'undecided' as 'undecided' | 'vertical' | 'tap',
    startX: 0,
    startY: 0,
    lastY: 0,
    tracking: false,
  })

  const snapTo = useCallback((target: 0 | 1) => {
    isAnimating.current = true
    animate(transitionProgress, target, {
      type: 'spring',
      stiffness: 200,
      damping: 28,
      mass: 0.8,
      onComplete: () => { isAnimating.current = false },
    })
  }, [transitionProgress])

  const handlePointerDown = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (isAnimating.current) return
    const s = gestureState.current
    s.mode = 'undecided'
    s.startX = e.clientX
    s.startY = e.clientY
    s.lastY = e.clientY
    s.tracking = true
    transitionProgress.stop()
  }, [transitionProgress])

  const handlePointerMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
    const s = gestureState.current
    if (!s.tracking || isAnimating.current) return

    const dx = e.clientX - s.startX
    const dy = s.startY - e.clientY

    if (s.mode === 'undecided') {
      const absDx = Math.abs(dx)
      const absDy = Math.abs(dy)
      if (absDx < 8 && absDy < 8) return
      if (absDy > absDx * 1.5 && absDy > 15) {
        s.mode = 'vertical'
      } else {
        // Horizontal or ambiguous — release, let framer-motion drag handle it
        s.tracking = false
        s.mode = 'undecided'
      }
      return
    }

    if (s.mode === 'vertical') {
      const deltaY = s.lastY - e.clientY
      s.lastY = e.clientY
      const current = transitionProgress.get()
      const delta = deltaY / SWIPE_THRESHOLD
      const next = clamp(current + delta, 0, 1)
      transitionProgress.set(next)
    }
  }, [transitionProgress])

  const handlePointerUp = useCallback((e: PointerEvent<HTMLDivElement>) => {
    const s = gestureState.current
    if (!s.tracking) return
    s.tracking = false

    if (isAnimating.current) return

    if (s.mode === 'vertical') {
      const current = transitionProgress.get()
      if (current > SNAP_THRESHOLD) {
        snapTo(1)
      } else {
        snapTo(0)
      }
    } else if (s.mode === 'undecided') {
      // Tap: toggle
      const current = transitionProgress.get()
      snapTo(current > 0.5 ? 0 : 1)
    }
    s.mode = 'undecided'
  }, [transitionProgress, snapTo])

  const toggle = useCallback(() => {
    if (isAnimating.current) return
    const current = transitionProgress.get()
    snapTo(current > 0.5 ? 0 : 1)
  }, [transitionProgress, snapTo])

  const goToHome = useCallback(() => {
    if (isAnimating.current) return
    snapTo(0)
  }, [snapTo])

  const goToDetail = useCallback(() => {
    if (isAnimating.current) return
    snapTo(1)
  }, [snapTo])

  return {
    transitionProgress,
    isAnimating: isAnimating.current,
    gestureState,
    snapTo,
    toggle,
    goToHome,
    goToDetail,
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
  }
}

export function interpolate(
  progress: number,
  inputRange: number[],
  outputRange: number[]
): number {
  if (progress <= inputRange[0]) return outputRange[0]
  if (progress >= inputRange[inputRange.length - 1]) return outputRange[outputRange.length - 1]

  for (let i = 0; i < inputRange.length - 1; i++) {
    if (progress >= inputRange[i] && progress <= inputRange[i + 1]) {
      const t = (progress - inputRange[i]) / (inputRange[i + 1] - inputRange[i])
      return outputRange[i] + t * (outputRange[i + 1] - outputRange[i])
    }
  }
  return outputRange[outputRange.length - 1]
}
