// ─────────────────────────────────────────────────────────────────────────────
// AISummaryPanel — shows Gemini-generated complaint analysis
// ─────────────────────────────────────────────────────────────────────────────

import { Sparkles, Loader2, AlertTriangle, RefreshCw, Tag } from 'lucide-react'
import { clsx } from 'clsx'

const PRIORITY_CONFIG = {
  High:   { color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30',    dot: 'bg-red-400',    label: '🔴 High Priority'   },
  Medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', dot: 'bg-yellow-400', label: '🟡 Medium Priority' },
  Low:    { color: 'text-accent-400', bg: 'bg-accent-500/10', border: 'border-accent-500/30', dot: 'bg-accent-400', label: '🟢 Low Priority'    },
}

export default function AISummaryPanel({ analysis, loading, onRetry }) {
  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="glass-card p-5 border-primary-500/20 bg-primary-500/5" role="status" aria-live="polite">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Sparkles size={16} className="text-white animate-pulse" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">AI Analyzing Complaint…</p>
            <p className="text-surface-500 text-xs">Generating summary and detecting priority</p>
          </div>
        </div>
        {/* Skeleton lines */}
        <div className="space-y-2.5 animate-pulse">
          <div className="h-3 bg-surface-700 rounded-full w-full" />
          <div className="h-3 bg-surface-700 rounded-full w-5/6" />
          <div className="h-3 bg-surface-700 rounded-full w-4/6" />
          <div className="flex gap-2 mt-4">
            <div className="h-6 bg-surface-700 rounded-full w-20" />
            <div className="h-6 bg-surface-700 rounded-full w-24" />
            <div className="h-6 bg-surface-700 rounded-full w-16" />
          </div>
        </div>
      </div>
    )
  }

  // ── No analysis ──────────────────────────────────────────────────────────
  if (!analysis) return null

  const priorityConf = PRIORITY_CONFIG[analysis.priority] || PRIORITY_CONFIG.Low

  return (
    <div
      className={clsx(
        'glass-card p-5 border',
        'bg-gradient-to-br from-primary-500/5 to-accent-500/5',
        'border-primary-500/25'
      )}
      role="region"
      aria-label="AI complaint analysis"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0 shadow-glow-primary">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">AI Analysis Complete</p>
            <p className="text-surface-500 text-[11px]">Powered by Gemini AI</p>
          </div>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="p-1.5 rounded-lg text-surface-500 hover:text-primary-400 hover:bg-surface-800 transition-all"
            aria-label="Re-analyze complaint"
            title="Re-analyze"
          >
            <RefreshCw size={14} />
          </button>
        )}
      </div>

      {/* Priority badge */}
      <div className={clsx(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border mb-4',
        priorityConf.bg, priorityConf.border, priorityConf.color
      )}>
        <span className={clsx('w-2 h-2 rounded-full animate-pulse', priorityConf.dot)} aria-hidden="true" />
        {priorityConf.label}
        <span className="text-[10px] opacity-70">· {analysis.priorityReason}</span>
      </div>

      {/* Summary */}
      <div className="mb-4">
        <p className="text-surface-500 text-[11px] font-medium uppercase tracking-wide mb-1.5">
          AI Generated Summary
        </p>
        <p className="text-surface-200 text-sm leading-relaxed">
          {analysis.summary}
        </p>
      </div>

      {/* Department suggestion */}
      {analysis.suggestedDepartment && (
        <div className="mb-4 flex items-center gap-2 text-xs">
          <span className="text-surface-500">Suggested Route →</span>
          <span className="text-primary-300 font-medium bg-primary-500/10 border border-primary-500/25 px-2 py-0.5 rounded-lg">
            {analysis.suggestedDepartment}
          </span>
        </div>
      )}

      {/* Keywords */}
      {analysis.keywords?.length > 0 && (
        <div>
          <p className="text-surface-500 text-[11px] font-medium uppercase tracking-wide mb-1.5 flex items-center gap-1">
            <Tag size={10} />
            Keywords
          </p>
          <div className="flex flex-wrap gap-1.5">
            {analysis.keywords.map((kw) => (
              <span
                key={kw}
                className="px-2 py-0.5 rounded-full text-[11px] bg-surface-800 border border-surface-700 text-surface-400"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
