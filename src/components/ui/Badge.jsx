import { clsx } from 'clsx'

const BADGE_VARIANTS = {
  primary: 'badge-primary',
  accent: 'badge-accent',
  navy: 'badge-navy',
  warning: 'badge inline-flex bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
  danger: 'badge inline-flex bg-red-500/20 text-red-300 border border-red-500/30',
  success: 'badge-accent',
  neutral: 'badge inline-flex bg-surface-700/50 text-surface-300 border border-surface-600/30',
}

export default function Badge({ children, variant = 'primary', className = '', dot = false }) {
  return (
    <span
      className={clsx(
        BADGE_VARIANTS[variant] || 'badge-primary',
        className
      )}
      role="status"
    >
      {dot && (
        <span
          className={clsx(
            'w-1.5 h-1.5 rounded-full',
            variant === 'accent' || variant === 'success' ? 'bg-accent-400' :
            variant === 'danger' ? 'bg-red-400' :
            variant === 'warning' ? 'bg-yellow-400' :
            'bg-primary-400'
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}
