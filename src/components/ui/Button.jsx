import { clsx } from 'clsx'
import { Loader2 } from 'lucide-react'

const VARIANTS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  accent: 'btn-accent',
  ghost: 'inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-surface-300 hover:text-white hover:bg-white/5 transition-all duration-200',
  danger: 'inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 transition-all duration-200',
}

const SIZES = {
  sm: 'text-sm px-4 py-2',
  md: 'px-6 py-3',
  lg: 'text-lg px-8 py-4',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full justify-center',
        (disabled || loading) && 'opacity-60 cursor-not-allowed pointer-events-none',
        className
      )}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
}
