import { forwardRef } from 'react'
import { clsx } from 'clsx'

const Input = forwardRef(function Input({
  label,
  error,
  hint,
  id,
  type = 'text',
  className = '',
  prefix,
  suffix,
  required,
  ...props
}, ref) {
  const inputId = id || `input-${Math.random().toString(36).slice(2)}`

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && <span className="text-primary-400 ml-0.5" aria-label="required">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {prefix && (
          <div className="absolute left-3 text-surface-500 pointer-events-none" aria-hidden="true">
            {prefix}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={clsx(
            'form-input',
            prefix && 'pl-10',
            suffix && 'pr-10',
            error && 'border-red-500/70 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />

        {suffix && (
          <div className="absolute right-3 text-surface-500" aria-hidden="true">
            {suffix}
          </div>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="text-red-400 text-xs flex items-center gap-1" role="alert">
          {error}
        </p>
      )}

      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-surface-500 text-xs">
          {hint}
        </p>
      )}
    </div>
  )
})

export default Input
