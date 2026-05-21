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
  primary: 'bg-accent/90 text-cream hover:bg-accent border-accent/30',
  secondary: 'bg-white/55 text-ink hover:bg-white/75',
  ghost: 'bg-transparent text-ink hover:bg-white/45 border-transparent shadow-none hover:shadow-none backdrop-blur-none',
  danger: 'bg-error/90 text-cream hover:bg-error border-error/30',
  success: 'bg-success/90 text-cream hover:bg-success border-success/30',
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
