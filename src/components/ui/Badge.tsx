import type { HTMLAttributes, ReactNode } from 'react'

type Tone =
  | 'default'
  | 'draft'
  | 'on_progress'
  | 'in_review'
  | 'final_draft'
  | 'published'
  | 'archived'
  | 'rejected'
  | 'success'
  | 'warning'
  | 'info'
  | 'error'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
  icon?: ReactNode
}

const TONE: Record<Tone, string> = {
  default: 'bg-cream-deep text-ink',
  draft: 'bg-cream-deep text-ink-soft',
  on_progress: 'bg-warning text-ink',
  in_review: 'bg-info text-cream',
  final_draft: 'bg-success/30 text-success',
  published: 'bg-success text-cream',
  archived: 'bg-cream-soft text-ink-soft',
  rejected: 'bg-error text-cream',
  success: 'bg-success text-cream',
  warning: 'bg-warning text-ink',
  info: 'bg-info text-cream',
  error: 'bg-error text-cream',
}

const LABEL: Partial<Record<Tone, string>> = {
  draft: 'Draft',
  on_progress: 'On Progress',
  in_review: 'In Review',
  final_draft: 'Final Draft',
  published: 'Published',
  archived: 'Archived',
  rejected: 'Rejected',
}

export const Badge = ({ tone = 'default', icon, children, className = '', ...rest }: BadgeProps) => (
  <span
    className={[
      'inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-ink text-xs font-bold uppercase tracking-widest',
      TONE[tone],
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...rest}
  >
    {icon && <span className="flex-shrink-0">{icon}</span>}
    {children ?? LABEL[tone] ?? tone}
  </span>
)
