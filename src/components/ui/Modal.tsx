import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: ReactNode
  description?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const SIZE = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
  full: 'max-w-[95vw] h-[90vh]',
}

export const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}: ModalProps) => {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${SIZE[size]} bg-cream border-2 border-ink rounded-2xl shadow-brutal-lg animate-scale-in flex flex-col max-h-[90vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || description) && (
          <div className="flex items-start justify-between gap-4 px-6 py-4 border-b-2 border-ink">
            <div className="flex-1 min-w-0">
              {title && <h3 className="font-display text-xl font-bold text-ink truncate">{title}</h3>}
              {description && <p className="text-sm text-ink-soft mt-1">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup"
              className="flex-shrink-0 w-9 h-9 rounded-lg border-2 border-ink bg-cream-soft hover:bg-cream-deep flex items-center justify-center transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-auto px-6 py-5">{children}</div>

        {footer && (
          <div className="px-6 py-4 border-t-2 border-ink bg-cream-soft rounded-b-2xl flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
