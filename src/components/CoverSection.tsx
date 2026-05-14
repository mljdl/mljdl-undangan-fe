import { ArrowRight } from 'lucide-react'
import { useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { useGuestParam } from '../hooks/useGuestParam'
import { Sparkles } from './Sparkles'

export interface CoverSectionProps {
  onOpen: () => void
}

export const CoverSection = ({ onOpen }: CoverSectionProps) => {
  const guestName = useGuestParam()
  const [closing, setClosing] = useState(false)
  const sectionRef = useRef<HTMLElement | null>(null)
  const btnRef = useRef<HTMLButtonElement | null>(null)

  /** Click handler: slide-up exit dulu, baru trigger onOpen 1.4s kemudian. */
  const handleOpen = () => {
    if (closing) return
    setClosing(true)
    // Match CSS transition duration di .cover-sliding-up (1.4s)
    setTimeout(() => onOpen(), 1300)
  }

  /** Magnetic button: tombol "tarik" sedikit ke arah kursor. */
  const handleBtnMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = Math.max(Math.min(e.clientX - cx, 12), -12)
    const dy = Math.max(Math.min(e.clientY - cy, 12), -12)
    btn.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    btn.style.setProperty('--my', `${e.clientY - rect.top}px`)
    btn.style.transform = `translate(${dx * 0.4}px, ${dy * 0.4}px)`
  }
  const handleBtnMouseLeave = () => {
    const btn = btnRef.current
    if (!btn) return
    btn.style.transform = 'translate(0, 0)'
  }

  return (
    <section
      ref={sectionRef}
      id="cover"
      className={[
        'relative min-h-screen w-full overflow-hidden flex items-center justify-center px-6 py-20 bg-cream-warm',
        closing ? 'cover-sliding-up' : '',
      ].join(' ')}
    >
      {/* Background gradient + vignette */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cream-warm via-cream to-peach-soft/40" />
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(107,58,44,0.12) 100%)',
        }}
      />

      {/* Sparkles throughout the cover area */}
      <Sparkles count={14} color="#b8915a" />

      {/* Floral ornaments — 4 corners, each with own float animation */}
      <img
        src="/assets/floral-1.svg"
        alt=""
        aria-hidden="true"
        className="absolute top-0 left-0 w-32 md:w-56 lg:w-72 opacity-85 pointer-events-none select-none -translate-x-6 -translate-y-6 float-a"
      />
      <img
        src="/assets/floral-2.svg"
        alt=""
        aria-hidden="true"
        className="absolute top-0 right-0 w-32 md:w-56 lg:w-72 opacity-85 pointer-events-none select-none translate-x-6 -translate-y-6 scale-x-[-1] float-b"
      />
      <img
        src="/assets/floral-3.svg"
        alt=""
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-32 md:w-56 lg:w-72 opacity-85 pointer-events-none select-none -translate-x-6 translate-y-6 scale-y-[-1] float-c"
      />
      <img
        src="/assets/floral-4.svg"
        alt=""
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-32 md:w-56 lg:w-72 opacity-85 pointer-events-none select-none translate-x-6 translate-y-6 scale-[-1] float-d"
      />

      {/* Center content (cover-fade-in entry animation) */}
      <div className="relative z-10 text-center max-w-xl mx-auto cover-fade-in">
        <div className="flex items-center justify-center gap-3 mb-6 text-rose-dust">
          <span className="h-px w-10 bg-rose-dust/60" />
          <span className="font-display tracking-[0.32em] text-xs uppercase">
            The Wedding of
          </span>
          <span className="h-px w-10 bg-rose-dust/60" />
        </div>

        <h1
          className="font-display text-6xl md:text-8xl text-brown-deep leading-none"
          style={{ textShadow: '0 2px 8px rgba(107,58,44,0.18)' }}
        >
          Rizki
          <span className="font-script text-rose-dust mx-2 text-5xl md:text-7xl">
            &amp;
          </span>
          Fadia
        </h1>

        <div className="my-6 mx-auto h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent flex items-center justify-center relative">
          <span className="absolute left-1/2 -translate-x-1/2 text-gold text-xs">✦</span>
        </div>

        <div className="font-display text-lg md:text-xl text-terracotta tracking-[0.25em]">
          13 &middot; 06 &middot; 2026
        </div>

        <p className="mt-10 text-sm text-brown-ink/70">Kepada Yth. Bapak/Ibu/Saudara/i</p>
        <div className="font-display text-2xl md:text-3xl text-brown-deep mt-1">
          {guestName}
        </div>

        <button
          ref={btnRef}
          type="button"
          onClick={handleOpen}
          onMouseMove={handleBtnMouseMove}
          onMouseLeave={handleBtnMouseLeave}
          className="btn-gold magnetic-btn mt-8 group overflow-hidden"
          disabled={closing}
        >
          <span className="relative z-10 flex items-center gap-2">
            Buka Undangan
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </span>
        </button>

        <p className="mt-3 text-xs text-brown-ink/55 italic">
          Tekan tombol untuk membuka
        </p>
      </div>

      {/* Scroll indicator (subtle bounce) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-rose-dust/40 animate-float-slow pointer-events-none">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 5v14m0 0l-6-6m6 6l6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  )
}
