import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'

type ToastTone = 'success' | 'error' | 'info' | 'warning'

interface ToastEntry {
  id: number
  tone: ToastTone
  message: string
}

interface ToastContextValue {
  notify: (tone: ToastTone, message: string) => void
  success: (msg: string) => void
  error: (msg: string) => void
  info: (msg: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be inside <ToastProvider>')
  return ctx
}

const TONE_STYLE: Record<ToastTone, string> = {
  success: 'bg-success text-cream',
  error: 'bg-error text-cream',
  info: 'bg-info text-cream',
  warning: 'bg-warning text-ink',
}

const TONE_ICON: Record<ToastTone, ReactNode> = {
  success: <CheckCircle2 size={18} />,
  error: <AlertCircle size={18} />,
  info: <Info size={18} />,
  warning: <AlertCircle size={18} />,
}

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastEntry[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const notify = useCallback(
    (tone: ToastTone, message: string) => {
      const id = Date.now() + Math.random()
      setToasts((prev) => [...prev, { id, tone, message }])
      window.setTimeout(() => dismiss(id), 3500)
    },
    [dismiss],
  )

  const value = useMemo<ToastContextValue>(
    () => ({
      notify,
      success: (msg) => notify('success', msg),
      error: (msg) => notify('error', msg),
      info: (msg) => notify('info', msg),
    }),
    [notify],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10001] flex flex-col items-center gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto animate-slide-up flex items-center gap-3 px-5 py-3 rounded-full border-2 border-ink shadow-brutal ${TONE_STYLE[t.tone]}`}
          >
            {TONE_ICON[t.tone]}
            <span className="text-sm font-medium">{t.message}</span>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="ml-2 opacity-70 hover:opacity-100"
              aria-label="Tutup"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
