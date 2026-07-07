// ─────────────────────────────────────────────────────────────────────────────
// ChatInput — the message composition bar
// Features: auto-grow textarea, Enter to send, Shift+Enter for newline,
//           character count hint, disabled state while AI is streaming,
//           stop-streaming button, voice input UI (placeholder)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect, useCallback } from 'react'
import { Square, Mic, Paperclip, ArrowUp } from 'lucide-react'
import { clsx } from 'clsx'

const MAX_CHARS = 2000

export default function ChatInput({ onSend, onStop, isLoading, disabled }) {
  const [value,    setValue]    = useState('')
  const textareaRef             = useRef(null)
  const canSend                 = value.trim().length > 0 && !isLoading && !disabled
  const charCount               = value.length

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [value])

  // Focus on mount
  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  const handleSubmit = useCallback(() => {
    if (!canSend) return
    onSend(value)
    setValue('')
    // Reset height
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }, [canSend, onSend, value])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }, [handleSubmit])

  return (
    <div className="relative">
      {/* Gradient fade above the input */}
      <div
        className="absolute -top-8 left-0 right-0 h-8 bg-gradient-to-t from-surface-950 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <div className="bg-surface-950 pt-2 pb-4 px-4">
        <div
          className={clsx(
            'relative flex items-end gap-2 rounded-2xl border transition-all duration-200',
            'bg-surface-800/60 backdrop-blur-sm',
            disabled
              ? 'border-surface-700/50 opacity-60'
              : 'border-surface-600 focus-within:border-primary-500/60 focus-within:shadow-glow-primary'
          )}
        >
          {/* Attachment button (placeholder) */}
          <button
            type="button"
            disabled={disabled || isLoading}
            className="shrink-0 self-end mb-2.5 ml-3 p-1.5 rounded-lg text-surface-500 hover:text-surface-300 hover:bg-surface-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Attach file (coming soon)"
            title="Attach file"
          >
            <Paperclip size={18} />
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) setValue(e.target.value)
            }}
            onKeyDown={handleKeyDown}
            placeholder={isLoading ? 'AI is responding...' : 'Ask about any government scheme or service...'}
            disabled={disabled}
            rows={1}
            className={clsx(
              'flex-1 resize-none bg-transparent py-3 text-sm text-surface-100',
              'placeholder-surface-500 outline-none min-h-[46px] leading-relaxed',
              'scrollbar-hidden'
            )}
            style={{ maxHeight: '160px' }}
            aria-label="Message input"
            aria-multiline="true"
            maxLength={MAX_CHARS}
          />

          {/* Right side buttons */}
          <div className="flex items-end gap-1 mb-2.5 mr-2 shrink-0">
            {/* Char count (only shown near limit) */}
            {charCount > MAX_CHARS * 0.8 && (
              <span
                className={clsx(
                  'text-[10px] self-center mr-1',
                  charCount >= MAX_CHARS ? 'text-red-400' : 'text-surface-500'
                )}
                aria-live="polite"
              >
                {charCount}/{MAX_CHARS}
              </span>
            )}

            {/* Mic (placeholder) */}
            <button
              type="button"
              disabled={disabled || isLoading}
              className="p-1.5 rounded-lg text-surface-500 hover:text-surface-300 hover:bg-surface-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Voice input (coming soon)"
              title="Voice input"
            >
              <Mic size={18} />
            </button>

            {/* Send / Stop button */}
            {isLoading ? (
              <button
                type="button"
                onClick={onStop}
                className="p-2 rounded-xl bg-surface-700 hover:bg-surface-600 text-surface-300 hover:text-white transition-all"
                aria-label="Stop AI response"
                title="Stop generating"
              >
                <Square size={16} className="fill-current" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSend}
                className={clsx(
                  'p-2 rounded-xl transition-all duration-200',
                  canSend
                    ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-glow-primary hover:scale-105 active:scale-95'
                    : 'bg-surface-700 text-surface-500 cursor-not-allowed'
                )}
                aria-label="Send message"
                title="Send (Enter)"
              >
                <ArrowUp size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Helper text */}
        <p className="text-center text-[11px] text-surface-600 mt-2 select-none">
          {isLoading
            ? 'AI is generating a response…'
            : 'Enter ↵ to send  •  Shift+Enter for new line  •  Ask in English or हिंदी'}
        </p>
      </div>
    </div>
  )
}
