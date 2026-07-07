// ─────────────────────────────────────────────────────────────────────────────
// ChatSidebar — left panel with chat history, capabilities, and settings
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { setCustomGeminiApiKey } from '../../services/gemini'
import {
  Plus, Sparkles, Info, CheckCircle2,
  ChevronRight, Globe, BookOpen, AlertCircle, User,
  Smartphone, Key, ExternalLink,
} from 'lucide-react'

const CAPABILITIES = [
  { icon: BookOpen,      label: 'Government Schemes',    desc: 'Find schemes you qualify for' },
  { icon: CheckCircle2,  label: 'Eligibility Check',     desc: 'Instant eligibility verification' },
  { icon: User,          label: 'Document Guidance',     desc: 'Know exactly what to bring' },
  { icon: AlertCircle,   label: 'Grievance Help',        desc: 'File & track complaints' },
  { icon: Globe,         label: 'Bilingual Support',     desc: 'English & हिंदी' },
  { icon: Smartphone,    label: 'Digital Services',      desc: 'DigiLocker, UMANG, CSC' },
]

export default function ChatSidebar({ onNewChat, isApiConfigured, onKeyConfigured }) {
  const [showTips, setShowTips] = useState(false)
  const [customKey, setCustomKey] = useState('')
  const [showKeyInput, setShowKeyInput] = useState(false)

  const handleSaveKey = (e) => {
    e.preventDefault()
    if (customKey.trim()) {
      setCustomGeminiApiKey(customKey.trim())
      setCustomKey('')
      setShowKeyInput(false)
      if (onKeyConfigured) onKeyConfigured()
    }
  }

  const handleClearKey = () => {
    setCustomGeminiApiKey(null)
    if (onKeyConfigured) onKeyConfigured()
  }

  return (
    <aside
      className="flex flex-col gap-4 h-full"
      aria-label="AI assistant panel"
    >
      {/* New Chat button */}
      <button
        onClick={onNewChat}
        className="btn-primary w-full justify-center text-sm py-2.5"
        aria-label="Start new conversation"
      >
        <Plus size={16} />
        New Chat
      </button>

      {/* API Status */}
      <div
        className={`glass-card p-3 flex flex-col gap-2 ${
          isApiConfigured
            ? 'border-accent-500/30 bg-accent-500/5'
            : 'border-yellow-500/30 bg-yellow-500/5'
        }`}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-2.5">
          <div
            className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
              isApiConfigured ? 'bg-accent-400 animate-pulse' : 'bg-yellow-400'
            }`}
            aria-hidden="true"
          />
          <div className="flex-1">
            <p className={`text-xs font-medium ${isApiConfigured ? 'text-accent-300' : 'text-yellow-300'}`}>
              {isApiConfigured ? 'Gemini AI Connected' : 'API Key Required'}
            </p>
            <p className="text-surface-500 text-[11px] mt-0.5 leading-snug">
              {isApiConfigured
                ? (sessionStorage.getItem('sb_custom_gemini_key') ? 'Using custom browser API key' : 'Real-time AI responses active')
                : 'Add VITE_GEMINI_API_KEY to .env.local or enter one below.'}
            </p>
          </div>
        </div>

        {isApiConfigured ? (
          sessionStorage.getItem('sb_custom_gemini_key') && (
            <button
              onClick={handleClearKey}
              className="text-[10px] text-red-400 hover:text-red-300 underline self-start font-medium"
              aria-label="Remove custom API key"
            >
              Remove Custom Key
            </button>
          )
        ) : (
          <div className="mt-1">
            {!showKeyInput ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowKeyInput(true)}
                  className="inline-flex items-center gap-1 text-primary-400 hover:text-primary-300 text-xs font-medium"
                >
                  <Key size={11} />
                  Enter Key
                </button>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-yellow-400 text-[11px] hover:underline"
                  aria-label="Get Gemini API key (opens in new tab)"
                >
                  Get API Key
                  <ExternalLink size={9} />
                </a>
              </div>
            ) : (
              <form onSubmit={handleSaveKey} className="flex gap-1.5 mt-1.5 w-full">
                <input
                  type="password"
                  placeholder="Paste AIzaSy..."
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  className="form-input text-[11px] py-1 px-2 flex-1 bg-surface-900 border-surface-700 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                  required
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-accent-500 hover:bg-accent-600 text-white rounded-lg text-[11px] font-semibold transition-colors"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowKeyInput(false)}
                  className="px-2 py-1 bg-surface-800 hover:bg-surface-700 text-surface-400 rounded-lg text-[11px] transition-colors"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Capabilities list */}
      <div className="glass-card p-4 flex-1 overflow-y-auto scrollbar-hidden">
        <div className="flex items-center gap-1.5 mb-3">
          <Sparkles size={14} className="text-primary-400" />
          <h2 className="text-white text-xs font-semibold uppercase tracking-wider">
            I Can Help With
          </h2>
        </div>
        <ul className="space-y-2.5" role="list">
          {CAPABILITIES.map(({ icon: Icon, label, desc }) => (
            <li key={label} className="flex items-start gap-2.5 group">
              <div className="w-7 h-7 rounded-lg bg-primary-500/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary-500/20 transition-colors">
                <Icon size={14} className="text-primary-400" />
              </div>
              <div>
                <p className="text-surface-200 text-xs font-medium">{label}</p>
                <p className="text-surface-500 text-[11px]">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Tips toggle */}
      <div className="glass-card p-3">
        <button
          onClick={() => setShowTips((v) => !v)}
          className="flex items-center justify-between w-full text-left"
          aria-expanded={showTips}
          aria-controls="chat-tips"
        >
          <div className="flex items-center gap-1.5">
            <Info size={13} className="text-primary-400" />
            <span className="text-white text-xs font-medium">Tips for Better Answers</span>
          </div>
          <ChevronRight
            size={13}
            className={`text-surface-500 transition-transform ${showTips ? 'rotate-90' : ''}`}
            aria-hidden="true"
          />
        </button>

        {showTips && (
          <ul
            id="chat-tips"
            className="mt-3 space-y-1.5 text-[11px] text-surface-400"
            role="list"
          >
            {[
              'Mention your state for local schemes',
              'Include income / category (SC/ST/OBC) for accurate eligibility',
              'Ask follow-up questions for detailed steps',
              'Type in Hindi for Hindi responses',
              'Mention your age and family size for pension/housing schemes',
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-1.5">
                <span className="text-primary-500 mt-0.5" aria-hidden="true">•</span>
                {tip}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Disclaimer */}
      <p className="text-surface-600 text-[11px] text-center leading-relaxed px-1">
        Smart Bharat AI provides general guidance only. Always verify critical details at official government portals.
      </p>
    </aside>
  )
}
