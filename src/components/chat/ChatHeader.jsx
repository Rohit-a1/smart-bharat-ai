// ─────────────────────────────────────────────────────────────────────────────
// ChatHeader — top bar of the chat window with model info and actions
// ─────────────────────────────────────────────────────────────────────────────

import { Bot, RotateCcw, Download } from 'lucide-react'

export default function ChatHeader({ onNewChat, messageCount, isApiConfigured }) {
  const handleExport = () => {
    // TODO: implement conversation export
    alert('Export feature coming soon!')
  }

  return (
    <header
      className="flex items-center justify-between px-5 py-3.5 border-b border-surface-800/60 bg-surface-900/40 backdrop-blur-sm shrink-0"
      aria-label="Chat header"
    >
      {/* Left: model identity */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow-primary">
            <Bot size={18} className="text-white" />
          </div>
          {/* Online indicator */}
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-surface-900 ${
              isApiConfigured ? 'bg-accent-400' : 'bg-yellow-400'
            }`}
            aria-label={isApiConfigured ? 'AI online' : 'API key missing'}
          />
        </div>

        <div>
          <p className="text-white font-semibold text-sm leading-none">Smart Bharat AI</p>
          <p className="text-surface-500 text-[11px] mt-0.5">
            {isApiConfigured
              ? `Gemini · ${messageCount} message${messageCount !== 1 ? 's' : ''}`
              : 'Configure API key to enable AI'}
          </p>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={onNewChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800 text-xs font-medium transition-all"
          aria-label="Start new conversation"
          title="New Chat"
        >
          <RotateCcw size={13} />
          <span className="hidden sm:inline">New Chat</span>
        </button>

        <button
          onClick={handleExport}
          className="p-2 rounded-lg text-surface-500 hover:text-surface-300 hover:bg-surface-800 transition-all"
          aria-label="Export conversation"
          title="Export chat"
        >
          <Download size={15} />
        </button>
      </div>
    </header>
  )
}
