import { useCallback, useRef } from 'react'
import type { MouseEvent } from 'react'

/**
 * 3D Tilt hook — ngasih perspective + rotateX/Y berdasarkan posisi kursor.
 *
 * Penggunaan:
 *   const { ref, onMouseMove, onMouseLeave } = useTilt({ maxAngle: 6 })
 *   <div ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} />
 *
 * Untuk magical feel: tambahkan transition CSS class "tilt-card" yang punya
 * `transform-style: preserve-3d` dan `will-change: transform`.
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>(opts?: {
  /** Maximum rotation angle in degrees (default 6). */
  maxAngle?: number
  /** Scale on hover (default 1.02). */
  scale?: number
}) {
  const ref = useRef<T | null>(null)
  const maxAngle = opts?.maxAngle ?? 6
  const scale = opts?.scale ?? 1.02

  const onMouseMove = useCallback(
    (e: MouseEvent<T>) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width // 0..1
      const y = (e.clientY - rect.top) / rect.height // 0..1
      const rotateY = (x - 0.5) * 2 * maxAngle // -max..+max
      const rotateX = (0.5 - y) * 2 * maxAngle // -max..+max
      el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`
      el.style.setProperty('--tilt-x', `${(x * 100).toFixed(0)}%`)
      el.style.setProperty('--tilt-y', `${(y * 100).toFixed(0)}%`)
    },
    [maxAngle, scale],
  )

  const onMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)'
  }, [])

  return { ref, onMouseMove, onMouseLeave }
}
