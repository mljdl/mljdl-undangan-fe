/**
 * Reusable floral decoration overlay untuk section wedding template.
 *
 * Usage:
 *   <section className="relative">
 *     <FloralDecor variant="corners" />
 *     ... section content
 *   </section>
 *
 * Variant:
 *   - "corners"  → 4 floral di tiap pojok (untuk hero/featured sections)
 *   - "diagonal" → 2 floral diagonal (top-left + bottom-right), lebih subtle
 *   - "top"      → 2 floral atas saja (left + right corner)
 *   - "bottom"   → 2 floral bawah saja
 *   - "frame"    → pakai frame-*.svg di samping kiri-kanan center
 *
 * Floral SVG variants: floral-1, floral-2, floral-3, floral-4
 * Frame variants: frame-1, frame-2, frame-3
 */

type Variant = 'corners' | 'diagonal' | 'top' | 'bottom' | 'frame'

interface Props {
  variant?: Variant
  /** Opacity 0..1 (default 0.55). Lower untuk subtle, higher untuk dominant. */
  opacity?: number
  /** Asset key (which floral set to use). */
  floralSet?: '1234' | '1313' | '2424'
}

const FLORAL_SETS: Record<string, [string, string, string, string]> = {
  '1234': ['floral-1', 'floral-2', 'floral-3', 'floral-4'],
  '1313': ['floral-1', 'floral-3', 'floral-1', 'floral-3'],
  '2424': ['floral-2', 'floral-4', 'floral-2', 'floral-4'],
}

export const FloralDecor = ({
  variant = 'corners',
  opacity = 0.55,
  floralSet = '1234',
}: Props) => {
  const set = FLORAL_SETS[floralSet]
  const baseImg = 'absolute w-24 sm:w-32 md:w-44 lg:w-56 pointer-events-none select-none'

  if (variant === 'corners') {
    return (
      <>
        <img
          src={`/assets/${set[0]}.svg`}
          alt=""
          aria-hidden="true"
          className={`${baseImg} top-0 left-0 -translate-x-4 -translate-y-4 float-a`}
          style={{ opacity, filter: 'sepia(0.18) saturate(0.92)' }}
        />
        <img
          src={`/assets/${set[1]}.svg`}
          alt=""
          aria-hidden="true"
          className={`${baseImg} top-0 right-0 translate-x-4 -translate-y-4 scale-x-[-1] float-b`}
          style={{ opacity, filter: 'sepia(0.18) saturate(0.92)' }}
        />
        <img
          src={`/assets/${set[2]}.svg`}
          alt=""
          aria-hidden="true"
          className={`${baseImg} bottom-0 left-0 -translate-x-4 translate-y-4 scale-y-[-1] float-c`}
          style={{ opacity, filter: 'sepia(0.18) saturate(0.92)' }}
        />
        <img
          src={`/assets/${set[3]}.svg`}
          alt=""
          aria-hidden="true"
          className={`${baseImg} bottom-0 right-0 translate-x-4 translate-y-4 scale-[-1] float-d`}
          style={{ opacity, filter: 'sepia(0.18) saturate(0.92)' }}
        />
      </>
    )
  }

  if (variant === 'diagonal') {
    return (
      <>
        <img
          src={`/assets/${set[0]}.svg`}
          alt=""
          aria-hidden="true"
          className={`${baseImg} top-0 left-0 -translate-x-6 -translate-y-6 bloom-drift-a`}
          style={{ opacity, filter: 'sepia(0.2) saturate(0.9)' }}
        />
        <img
          src={`/assets/${set[3]}.svg`}
          alt=""
          aria-hidden="true"
          className={`${baseImg} bottom-0 right-0 translate-x-6 translate-y-6 scale-[-1] bloom-drift-b`}
          style={{ opacity, filter: 'sepia(0.2) saturate(0.9)' }}
        />
      </>
    )
  }

  if (variant === 'top') {
    return (
      <>
        <img
          src={`/assets/${set[0]}.svg`}
          alt=""
          aria-hidden="true"
          className={`${baseImg} top-0 left-0 -translate-x-4 -translate-y-2 float-a`}
          style={{ opacity, filter: 'sepia(0.18) saturate(0.92)' }}
        />
        <img
          src={`/assets/${set[1]}.svg`}
          alt=""
          aria-hidden="true"
          className={`${baseImg} top-0 right-0 translate-x-4 -translate-y-2 scale-x-[-1] float-b`}
          style={{ opacity, filter: 'sepia(0.18) saturate(0.92)' }}
        />
      </>
    )
  }

  if (variant === 'bottom') {
    return (
      <>
        <img
          src={`/assets/${set[2]}.svg`}
          alt=""
          aria-hidden="true"
          className={`${baseImg} bottom-0 left-0 -translate-x-4 translate-y-2 scale-y-[-1] float-c`}
          style={{ opacity, filter: 'sepia(0.18) saturate(0.92)' }}
        />
        <img
          src={`/assets/${set[3]}.svg`}
          alt=""
          aria-hidden="true"
          className={`${baseImg} bottom-0 right-0 translate-x-4 translate-y-2 scale-[-1] float-d`}
          style={{ opacity, filter: 'sepia(0.18) saturate(0.92)' }}
        />
      </>
    )
  }

  // variant === 'frame': decorative side frames
  return (
    <>
      <img
        src="/assets/frame-1.svg"
        alt=""
        aria-hidden="true"
        className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-2 w-16 sm:w-20 md:w-28 pointer-events-none select-none float-a"
        style={{ opacity, filter: 'sepia(0.2) saturate(0.9)' }}
      />
      <img
        src="/assets/frame-2.svg"
        alt=""
        aria-hidden="true"
        className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-2 w-16 sm:w-20 md:w-28 pointer-events-none select-none scale-x-[-1] float-b"
        style={{ opacity, filter: 'sepia(0.2) saturate(0.9)' }}
      />
    </>
  )
}
