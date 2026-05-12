import { ArrowRight } from 'lucide-react';
import { useGuestParam } from '../hooks/useGuestParam';

export interface CoverSectionProps {
  onOpen: () => void;
}

export const CoverSection = ({ onOpen }: CoverSectionProps) => {
  const guestName = useGuestParam();

  return (
    <section
      id="cover"
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center px-6 py-20 bg-cream-warm"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cream-warm via-cream to-peach-soft/40" />

      <div className="relative z-10 text-center max-w-xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-6 text-rose-dust">
          <span className="h-px w-10 bg-rose-dust/60" />
          <span className="font-display tracking-[0.32em] text-xs uppercase">The Wedding of</span>
          <span className="h-px w-10 bg-rose-dust/60" />
        </div>

        <h1 className="font-display text-6xl md:text-8xl text-brown-deep leading-none">
          Rizki<span className="font-script text-rose-dust mx-2 text-5xl md:text-7xl">&amp;</span>Fadia
        </h1>

        <div className="my-6 mx-auto h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />

        <div className="font-display text-lg md:text-xl text-terracotta tracking-[0.25em]">
          13 &middot; 06 &middot; 2026
        </div>

        <p className="mt-10 text-sm text-brown-ink/70">Kepada Yth. Bapak/Ibu/Saudara/i</p>
        <div className="font-display text-2xl md:text-3xl text-brown-deep mt-1">{guestName}</div>

        <button
          type="button"
          onClick={onOpen}
          className="btn-gold mt-8 group"
        >
          Buka Undangan
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </button>

        <p className="mt-3 text-xs text-brown-ink/55 italic">Tekan tombol untuk membuka</p>
      </div>
    </section>
  );
};
