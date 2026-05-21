import type { HTMLAttributes, ReactNode } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean
  hoverable?: boolean
}

export const Card = ({
  padded = true,
  hoverable = false,
  className = '',
  children,
  ...rest
}: CardProps) => (
  <div
    className={[
      'brutal-card',
      padded ? 'p-6' : '',
      hoverable
        ? 'transition-all duration-300 hover:-translate-y-1 hover:bg-white/70 hover:shadow-[0_18px_44px_rgba(42,38,34,0.16)]'
        : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...rest}
  >
    {children}
  </div>
)

export const CardHeader = ({
  title,
  subtitle,
  action,
}: {
  title: ReactNode
  subtitle?: ReactNode
  action?: ReactNode
}) => (
  <div className="flex items-start justify-between mb-4 gap-4">
    <div>
      <h3 className="font-display text-xl font-bold text-ink">{title}</h3>
      {subtitle && <p className="text-sm text-ink-soft mt-1">{subtitle}</p>}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
)
