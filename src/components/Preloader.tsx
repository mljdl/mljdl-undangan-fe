import { useEffect, useState } from 'react';

export interface PreloaderProps {
  onDone?: () => void;
  durationMs?: number;
}

export const Preloader = ({ onDone, durationMs = 1400 }: PreloaderProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, durationMs);
    return () => window.clearTimeout(t);
  }, [durationMs, onDone]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-cream transition-opacity duration-700"
      aria-hidden="true"
    >
      <div className="text-center">
        <div className="font-arabic text-2xl md:text-3xl text-brown-deep mb-3">
          بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </div>
        <div className="font-display text-xs uppercase tracking-[0.3em] text-rose-dust">
          A Sacred Day &middot; 13 . 06 . 2026
        </div>
        <div className="mt-6 mx-auto h-px w-32 bg-gradient-to-r from-transparent via-gold to-transparent" />
      </div>
    </div>
  );
};
