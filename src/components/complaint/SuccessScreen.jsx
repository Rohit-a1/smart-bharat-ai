// ─────────────────────────────────────────────────────────────────────────────
// SuccessScreen — shown after successful complaint submission
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CheckCircle2, Copy, Check, Share2, ClipboardList,
  Home, ArrowRight, Calendar, Bot,
} from 'lucide-react'
import { useState } from 'react'
import Badge from '../ui/Badge'

const PRIORITY_COLORS = {
  High:   { badge: 'destructive', text: '🔴 High — Escalated for urgent review' },
  Medium: { badge: 'warning',     text: '🟡 Medium — In queue for review'        },
  Low:    { badge: 'neutral',     text: '🟢 Low — Logged for processing'         },
}

export default function SuccessScreen({ complaintId, category, priority, onNewComplaint }) {
  const navigate   = useNavigate()
  const [copied, setCopied] = useState(false)
  const conf = PRIORITY_COLORS[priority] || PRIORITY_COLORS.Low

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(complaintId).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }, [complaintId])

  const handleShare = useCallback(async () => {
    const text = `I filed a complaint on Smart Bharat AI.\nComplaint ID: ${complaintId}\nTrack at: ${window.location.origin}/track-complaint?id=${complaintId}`
    if (navigator.share) {
      await navigator.share({ title: 'Smart Bharat Complaint', text }).catch(() => {})
    } else {
      await navigator.clipboard.writeText(text).catch(() => {})
      alert('Complaint details copied to clipboard!')
    }
  }, [complaintId])

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        {/* Success animation */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            {/* Outer ring */}
            <div
              className="w-28 h-28 rounded-full bg-accent-500/10 border-2 border-accent-500/30 flex items-center justify-center mx-auto animate-scale-in"
              aria-hidden="true"
            >
              {/* Inner ring */}
              <div className="w-20 h-20 rounded-full bg-accent-500/20 border-2 border-accent-500/50 flex items-center justify-center">
                <CheckCircle2 size={40} className="text-accent-400" />
              </div>
            </div>
            {/* Confetti-like sparkles */}
            {['top-0 right-4', 'top-4 left-0', 'bottom-2 right-0'].map((pos) => (
              <div
                key={pos}
                className={`absolute ${pos} w-3 h-3 rounded-full bg-primary-400/60 animate-bounce`}
                style={{ animationDelay: `${Math.random() * 500}ms` }}
                aria-hidden="true"
              />
            ))}
          </div>

          <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
            Complaint Filed! 🎉
          </h1>
          <p className="text-surface-400 text-sm max-w-sm mx-auto">
            Your complaint has been registered successfully and will be reviewed by the concerned department.
          </p>
        </div>

        {/* Complaint ID card */}
        <div className="glass-card p-6 mb-6 text-center border-accent-500/20 bg-accent-500/5">
          <p className="text-surface-500 text-xs uppercase tracking-wide mb-2">Your Complaint ID</p>
          <div className="flex items-center justify-center gap-3">
            <span
              className="font-mono text-2xl font-bold text-white tracking-widest"
              aria-label={`Complaint ID: ${complaintId}`}
            >
              {complaintId}
            </span>
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl bg-surface-800 hover:bg-surface-700 text-surface-400 hover:text-white transition-all"
              aria-label="Copy complaint ID"
            >
              {copied ? <Check size={16} className="text-accent-400" /> : <Copy size={16} />}
            </button>
          </div>
          <p className="text-surface-500 text-xs mt-2">
            Save this ID to track your complaint status
          </p>
        </div>

        {/* Status info */}
        <div className="glass-card p-4 mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-surface-400 text-sm">Status</span>
            <Badge variant="accent" dot>Filed & Registered</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-surface-400 text-sm">Priority</span>
            <Badge variant={conf.badge}>{conf.text}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-surface-400 text-sm">Expected Response</span>
            <span className="text-surface-200 text-sm font-medium">
              {priority === 'High' ? '24–48 hours' : priority === 'Medium' ? '3–5 days' : '7–14 days'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-surface-400 text-sm">Filed On</span>
            <span className="text-surface-200 text-sm flex items-center gap-1.5">
              <Calendar size={13} className="text-surface-500" />
              {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <Link
            to={`/track-complaint?id=${complaintId}`}
            className="btn-primary w-full justify-center"
          >
            <ClipboardList size={16} />
            Track Complaint Status
            <ArrowRight size={14} />
          </Link>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleShare}
              className="btn-secondary justify-center text-sm"
            >
              <Share2 size={14} />
              Share
            </button>
            <button
              onClick={onNewComplaint}
              className="btn-secondary justify-center text-sm"
            >
              <ClipboardList size={14} />
              New Complaint
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link to="/ai-assistant" className="btn-ghost justify-center text-sm">
              <Bot size={14} />
              Ask AI
            </Link>
            <Link to="/" className="btn-ghost justify-center text-sm">
              <Home size={14} />
              Home
            </Link>
          </div>
        </div>

        {/* Tricolor accent */}
        <div className="tricolor-bar w-32 mx-auto mt-8" aria-hidden="true" />
      </div>
    </div>
  )
}
