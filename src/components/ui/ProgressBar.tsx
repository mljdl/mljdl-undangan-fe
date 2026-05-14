import { Check } from 'lucide-react'

export interface ProgressBarProps {
  /** Step yang sedang aktif (1..4). */
  current: number
  /** Total step (default 4). */
  total?: number
  /** Label per step. Kalau tidak di-pass, pakai default wedding flow. */
  labels?: string[]
}

const DEFAULT_LABELS = ['Pilih Template', 'On Progress', 'Review', 'Done']

export const ProgressBar = ({ current, total = 4, labels }: ProgressBarProps) => {
  const stepLabels = labels ?? DEFAULT_LABELS
  const steps = Array.from({ length: total }, (_, i) => i + 1)

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2">
        {steps.map((step, idx) => {
          const isDone = step < current
          const isCurrent = step === current
          const isUpcoming = step > current
          return (
            <div key={step} className="flex-1 flex items-center gap-2">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={[
                    'w-10 h-10 rounded-full border-2 border-ink flex items-center justify-center font-bold text-sm shadow-brutal-sm transition-all',
                    isDone ? 'bg-success text-cream' : '',
                    isCurrent ? 'bg-accent text-cream animate-pulse' : '',
                    isUpcoming ? 'bg-cream-soft text-ink-soft' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {isDone ? <Check size={16} strokeWidth={3} /> : step}
                </div>
                <span
                  className={[
                    'text-[10px] md:text-xs font-bold uppercase tracking-widest text-center',
                    isCurrent ? 'text-accent-deep' : isDone ? 'text-success' : 'text-ink-soft/70',
                  ].join(' ')}
                >
                  {stepLabels[idx]}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={[
                    'flex-1 h-0.5 border-t-2 mb-6',
                    isDone ? 'border-success' : 'border-dashed border-cream-deep',
                  ].join(' ')}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
