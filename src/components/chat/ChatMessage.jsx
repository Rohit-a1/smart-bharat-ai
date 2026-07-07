// ─────────────────────────────────────────────────────────────────────────────
// ChatMessage — renders a single user or AI message bubble with:
//   • Full markdown rendering (bold, italic, lists, code, links, blockquotes)
//   • Streaming cursor animation
//   • Copy, like, dislike actions on AI messages
//   • Error state styling
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from 'react'
import { Bot, Copy, Check, ThumbsUp, ThumbsDown, RotateCcw, AlertTriangle } from 'lucide-react'
import { clsx } from 'clsx'

// ── Minimal markdown renderer ─────────────────────────────────────────────────
// Converts Gemini's markdown output to safe HTML without a heavy library.
function renderMarkdown(text) {
  if (!text) return ''
  let html = text

  // Escape raw HTML (safety)
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  // Code blocks (``` ... ```)
  html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) =>
    `<pre class="code-block" data-lang="${lang}"><code>${code.trim()}</code></pre>`
  )

  // Inline code (`...`)
  html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')

  // Bold (**text** or __text__)
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>')

  // Italic (*text* or _text_)
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>')

  // Headers (### ## #)
  html = html.replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>')
  html = html.replace(/^## (.+)$/gm,  '<h2 class="md-h2">$1</h2>')
  html = html.replace(/^# (.+)$/gm,   '<h1 class="md-h1">$1</h1>')

  // Ordered lists
  html = html.replace(/^(\d+)\. (.+)$/gm, '<li class="md-li-ordered"><span class="md-li-num">$1.</span> $2</li>')
  html = html.replace(/(<li class="md-li-ordered">[\s\S]+?<\/li>)+/g, '<ol class="md-ol">$&</ol>')

  // Unordered lists (- or * or •)
  html = html.replace(/^[-*•] (.+)$/gm, '<li class="md-li">$1</li>')
  html = html.replace(/(<li class="md-li">[\s\S]+?<\/li>)+/g, '<ul class="md-ul">$&</ul>')

  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote class="md-blockquote">$1</blockquote>')

  // Horizontal rules
  html = html.replace(/^---+$/gm, '<hr class="md-hr"/>')

  // Markdown links: [text](url) - securely restricted to http/https
  html = html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s<>"]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="md-link">$1</a>'
  )

  // URLs → links (bare URLs in text)
  html = html.replace(
    /(?<![">])(https?:\/\/[^\s<>"]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="md-link">$1</a>'
  )

  // Line breaks (double newline → paragraph break; single → <br>)
  html = html.replace(/\n\n/g, '</p><p class="md-p">')
  html = html.replace(/\n/g, '<br/>')
  html = `<p class="md-p">${html}</p>`

  // Clean up empty <p>
  html = html.replace(/<p class="md-p"><\/p>/g, '')
  html = html.replace(/<p class="md-p">(<(?:ul|ol|pre|h[123]|blockquote|hr))/g, '$1')
  html = html.replace(/(<\/(?:ul|ol|pre|h[123]|blockquote|hr)>)<\/p>/g, '$1')

  return html
}

// ── Streaming cursor ──────────────────────────────────────────────────────────
function StreamingCursor() {
  return (
    <span
      className="inline-block w-0.5 h-4 bg-primary-400 ml-0.5 align-middle animate-pulse"
      aria-hidden="true"
    />
  )
}

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ role }) {
  if (role === 'user') {
    return (
      <div
        className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500/30 to-primary-600/30 border border-primary-500/40 flex items-center justify-center shrink-0 mt-1 text-primary-300 font-bold text-xs"
        aria-hidden="true"
      >
        You
      </div>
    )
  }
  return (
    <div
      className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0 mt-1 shadow-glow-primary"
      aria-hidden="true"
    >
      <Bot size={16} className="text-white" />
    </div>
  )
}

// ── Action bar (AI messages only) ─────────────────────────────────────────────
function MessageActions({ content, onRetry }) {
  const [copied,   setCopied]   = useState(false)
  const [liked,    setLiked]    = useState(false)
  const [disliked, setDisliked] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }, [content])

  const handleLike = () => { setLiked((v) => !v); setDisliked(false) }
  const handleDislike = () => { setDisliked((v) => !v); setLiked(false) }

  return (
    <div className="flex items-center gap-1 mt-1.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <button
        onClick={handleCopy}
        className="p-1.5 rounded-lg text-surface-600 hover:text-surface-300 hover:bg-surface-800 transition-all"
        title="Copy"
        aria-label="Copy message"
      >
        {copied ? <Check size={13} className="text-accent-400" /> : <Copy size={13} />}
      </button>
      <button
        onClick={handleLike}
        className={clsx(
          'p-1.5 rounded-lg transition-all',
          liked
            ? 'text-accent-400 bg-accent-500/10'
            : 'text-surface-600 hover:text-accent-400 hover:bg-surface-800'
        )}
        title="Helpful"
        aria-label="Mark as helpful"
        aria-pressed={liked}
      >
        <ThumbsUp size={13} />
      </button>
      <button
        onClick={handleDislike}
        className={clsx(
          'p-1.5 rounded-lg transition-all',
          disliked
            ? 'text-red-400 bg-red-500/10'
            : 'text-surface-600 hover:text-red-400 hover:bg-surface-800'
        )}
        title="Not helpful"
        aria-label="Mark as not helpful"
        aria-pressed={disliked}
      >
        <ThumbsDown size={13} />
      </button>
      {onRetry && (
        <button
          onClick={onRetry}
          className="p-1.5 rounded-lg text-surface-600 hover:text-primary-400 hover:bg-surface-800 transition-all"
          title="Retry"
          aria-label="Retry this response"
        >
          <RotateCcw size={13} />
        </button>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ChatMessage({ message, onRetry, isLast }) {
  const { role, content, isStreaming, timestamp } = message
  const isUser  = role === 'user'
  const isError = role === 'error'
  const isEmpty = !content && isStreaming

  const timeLabel = timestamp
    ? timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : ''

  return (
    <div
      className={clsx(
        'flex gap-3 w-full group',
        isUser ? 'justify-end' : 'justify-start',
      )}
      role="listitem"
    >
      {/* Avatar — left side for AI */}
      {!isUser && <Avatar role="assistant" />}

      <div
        className={clsx(
          'flex flex-col',
          isUser ? 'items-end max-w-[78%]' : 'items-start max-w-[82%]',
          'md:max-w-[70%]'
        )}
      >
        {/* Bubble */}
        <div
          className={clsx(
            'rounded-2xl px-4 py-3 text-sm leading-relaxed',
            isUser && 'bg-gradient-to-br from-primary-500/25 to-primary-600/15 border border-primary-500/30 rounded-tr-sm text-surface-100',
            !isUser && !isError && 'bg-surface-800/50 border border-surface-700/60 rounded-tl-sm text-surface-100 backdrop-blur-sm',
            isError && 'bg-red-500/10 border border-red-500/30 rounded-tl-sm text-red-300',
          )}
        >
          {/* Error icon */}
          {isError && (
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={14} className="text-red-400 shrink-0" />
              <span className="text-red-400 text-xs font-medium">Error</span>
            </div>
          )}

          {/* Content */}
          {isUser ? (
            <p className="whitespace-pre-wrap break-words">{content}</p>
          ) : isEmpty ? (
            // Still connecting — show bouncing dots
            <div className="flex items-center gap-1.5 py-1" aria-label="AI is thinking">
              {[0, 150, 300].map((d) => (
                <span
                  key={d}
                  className="w-2 h-2 rounded-full bg-primary-400 animate-bounce"
                  style={{ animationDelay: `${d}ms` }}
                  aria-hidden="true"
                />
              ))}
            </div>
          ) : (
            // Markdown rendered AI response
            <div className="chat-markdown">
              <div
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
              />
              {isStreaming && <StreamingCursor />}
            </div>
          )}
        </div>

        {/* Timestamp + Actions */}
        <div className="flex items-center gap-1">
          {/* Action bar for AI messages */}
          {!isUser && !isError && !isStreaming && content && (
            <MessageActions
              content={content}
              onRetry={isLast ? onRetry : undefined}
            />
          )}
          <span className="text-surface-600 text-[11px] px-1 mt-1">{timeLabel}</span>
        </div>
      </div>

      {/* Avatar — right side for user */}
      {isUser && <Avatar role="user" />}
    </div>
  )
}
