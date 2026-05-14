import { useEffect, useMemo } from 'react'

interface Props {
  /** Jumlah petal di desktop. Mobile auto setengahnya. */
  count?: number
  /** Disable kalau user prefers reduced motion (auto handled by CSS juga). */
  disabled?: boolean
}

/**
 * Petal rain — daun/bunga jatuh dari atas, looping infinite.
 *
 * Ported from legacy HTML. Setiap petal punya size, posisi, durasi, dan delay
 * random supaya feel-nya alive, bukan procedural-mechanical.
 *
 * Performance: petals di-render sekali waktu mount, ga ada re-render. CSS
 * animation handle semua frame-frame jatuhnya.
 */
export const PetalRain = ({ count = 18, disabled = false }: Props) => {
  // Stable petals: useMemo supaya ga regenerate tiap render
  const petals = useMemo(() => {
    const isMobile =
      typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches
    const actualCount = isMobile ? Math.floor(count * 0.55) : count

    return Array.from({ length: actualCount }, (_, i) => {
      const size = 6 + Math.random() * 12 // 6–18px
      const left = Math.random() * 100 // 0–100vw
      const duration = 10 + Math.random() * 16 // 10–26s
      const delay = -Math.random() * 16 // -16 to 0s (so some start mid-fall)
      const opacity = 0.25 + Math.random() * 0.35 // 0.25–0.6
      return {
        id: i,
        style: {
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}vw`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          opacity,
        },
      }
    })
  }, [count])

  useEffect(() => {
    // No-op effect — petals are static after mount.
  }, [])

  if (disabled) return null

  return (
    <div className="petal-rain" aria-hidden="true">
      {petals.map((p) => (
        <div key={p.id} className="petal" style={p.style} />
      ))}
    </div>
  )
}
