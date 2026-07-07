import { clsx } from 'clsx'

export default function Card({
  children,
  className = '',
  hover = false,
  padding = 'p-6',
  as: Tag = 'div',
  ...props
}) {
  return (
    <Tag
      className={clsx(
        hover ? 'glass-card-hover' : 'glass-card',
        padding,
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={clsx('mb-4', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={clsx('text-xl font-display font-bold text-white', className)}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={clsx('text-surface-400 text-sm mt-1', className)}>
      {children}
    </p>
  )
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={clsx('mt-6 pt-4 border-t border-surface-800/40', className)}>
      {children}
    </div>
  )
}
