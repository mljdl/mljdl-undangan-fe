import { useMemo } from 'react'

interface Props {
  /** Jumlah sparkle (default 8). */
  count?: number
  /** Color tone (default gold). */
  color?: string
}

/**
 * Floating sparkles (✦) — taburan kecil yang twinkle, scoped ke parent element.
 * Parent harus `position: relative` supaya sparkles kena absolute-position.
 */
export const Sparkles = ({ count = 8, color = '#b8915a' }: Props) => {
  const sparkles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const size = 6 + Math.random() * 10 // 6–16px
      const top = Math.random() * 100
      const left = Math.random() * 100
      const duration = 2 + Math.random() * 3 // 2–5s
      const delay = Math.random() * 4
      return {
        id: i,
        style: {
          top: `${top}%`,
          left: `${left}%`,
          fontSize: `${size}px`,
          animation: `sparkleTwinkle ${duration}s ease-in-out ${delay}s infinite`,
          color,
        },
      }
    })
  }, [count, color])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {sparkles.map((s) => (
        <span key={s.id} className="absolute select-none" style={s.style}>
          ✦
        </span>
      ))}
    </div>
  )
}
