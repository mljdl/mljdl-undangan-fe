import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface ToastProps {
  message: string;
  show: boolean;
  onHide: () => void;
  durationMs?: number;
}

export const Toast = ({ message, show, onHide, durationMs = 2200 }: ToastProps) => {
  const [mounted, setMounted] = useState(show);

  useEffect(() => {
    if (!show) return;
    setMounted(true);
    const t = window.setTimeout(() => {
      setMounted(false);
      onHide();
    }, durationMs);
    return () => window.clearTimeout(t);
  }, [show, durationMs, onHide]);

  if (!mounted) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-1/2 bottom-8 z-[9999] -translate-x-1/2 animate-slide-up flex items-center gap-2 rounded-full bg-brown-deep text-cream px-5 py-2.5 shadow-soft-lg"
    >
      <Check size={16} />
      <span className="text-sm">{message}</span>
    </div>
  );
};
