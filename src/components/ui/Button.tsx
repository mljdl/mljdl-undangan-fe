import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
type Size = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
  loading?: boolean
}

const VARIANT: Record<Variant, string> = {
  primary: 'bg-accent text-cream hover:bg-accent-deep',
  secondary: 'bg-cream-soft text-ink hover:bg-cream-deep',
  ghost: 'bg-transparent text-ink hover:bg-cream-soft border-transparent hover:border-ink shadow-none hover:shadow-brutal-sm',
  danger: 'bg-error text-cream hover:bg-error/90',
  success: 'bg-success text-cream hover:bg-success/90',
}

const SIZE: Record<Size, string> = {
  sm: 'px-4 py-1.5 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  fullWidth = false,
  loading = false,
  disabled,
  className = '',
  children,
  type = 'button',
  ...rest
}: ButtonProps) => {
  const isDisabled = disabled || loading
  return (
    <button
      type={type}
      disabled={isDisabled}
      className={[
        'brutal-button',
        VARIANT[variant],
        SIZE[size],
        fullWidth ? 'w-full' : '',
        'font-semibold tracking-wide',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      <span>{loading ? 'Memuat...' : children}</span>
      {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  )
}
