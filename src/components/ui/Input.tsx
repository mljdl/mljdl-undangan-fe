import { forwardRef } from 'react'
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, className = '', id, ...rest }, ref) => {
    const inputId = id ?? rest.name ?? undefined
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="brutal-label">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            'brutal-input',
            error ? 'border-error focus:ring-error' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        />
        {error && <p className="mt-1 text-xs text-error font-medium">{error}</p>}
        {!error && hint && <p className="mt-1 text-xs text-ink-soft/70">{hint}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, className = '', id, ...rest }, ref) => {
    const inputId = id ?? rest.name ?? undefined
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="brutal-label">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={4}
          className={[
            'brutal-input resize-y min-h-[96px]',
            error ? 'border-error focus:ring-error' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        />
        {error && <p className="mt-1 text-xs text-error font-medium">{error}</p>}
        {!error && hint && <p className="mt-1 text-xs text-ink-soft/70">{hint}</p>}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'
