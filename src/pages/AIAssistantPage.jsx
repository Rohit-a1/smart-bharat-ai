// ─────────────────────────────────────────────────────────────────────────────
// AIAssistantPage — ChatGPT-quality interface for Smart Bharat AI
// Wires together: useChat hook, ChatMessage, ChatInput, SuggestedPrompts,
//                 ChatSidebar, ChatHeader
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState, useCallback } from 'react'
import { Bot, ChevronLeft, ChevronRight, PanelLeftClose, PanelLeft } from 'lucide-react'
import { clsx } from 'clsx'

import { useChat }         from '../hooks/useChat'
import ChatMessage         from '../components/chat/ChatMessage'
import ChatInput           from '../components/chat/ChatInput'
import SuggestedPrompts    from '../components/chat/SuggestedPrompts'
import ChatSidebar         from '../components/chat/ChatSidebar'
import ChatHeader          from '../components/chat/ChatHeader'

// Is the API configured? (key exists and not the placeholder)
const API_KEY           = import.meta.env.VITE_GEMINI_API_KEY
const IS_API_CONFIGURED = !!API_KEY && API_KEY !== 'demo_gemini_key_replace_me'

// ── Empty state (before first user message) ───────────────────────────────────
function EmptyState({ onSelect }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-12 text-center">
      {/* Logo glow */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow-primary mx-auto animate-float">
          <Bot size={36} className="text-white" />
        </div>
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 blur-2xl" aria-hidden="true" />
      </div>

      <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
        Smart Bharat AI
      </h1>
      <p className="text-surface-400 max-w-sm text-sm leading-relaxed mb-8">
        Your AI guide to Indian government services, schemes, and grievances.{' '}
        <span className="text-primary-400 font-medium">Ask anything in English or हिंदी.</span>
      </p>

      {/* Suggested prompts in empty state */}
      <div className="w-full max-w-2xl">
        <SuggestedPrompts onSelect={onSelect} />
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AIAssistantPage() {
  const {
    messages,
    isLoading,
    streamingId,
    sendUserMessage,
    retryLast,
    stopStreaming,
    clearChat,
    copyMessage,
  } = useChat()

  const messagesEndRef  = useRef(null)
  const messagesAreaRef = useRef(null)
  const [sidebarOpen,  setSidebarOpen]  = useState(true)
  const [atBottom,     setAtBottom]     = useState(true)
  const [showPrompts,  setShowPrompts]  = useState(true)

  // Show prompts only when conversation only has the welcome message
  const hasUserMessages = messages.some((m) => m.role === 'user')
  useEffect(() => {
    setShowPrompts(!hasUserMessages)
  }, [hasUserMessages])

  // ── Auto-scroll ──────────────────────────────────────────────────────────
  const scrollToBottom = useCallback((behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' })
  }, [])

  useEffect(() => {
    if (atBottom) scrollToBottom()
  }, [messages, isLoading, atBottom, scrollToBottom])

  // Track if user scrolled away from bottom
  const handleScroll = useCallback(() => {
    const el = messagesAreaRef.current
    if (!el) return
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    setAtBottom(distFromBottom < 80)
  }, [])

  // ── Send ─────────────────────────────────────────────────────────────────
  const handleSend = useCallback((text) => {
    sendUserMessage(text)
    setAtBottom(true)
    setTimeout(() => scrollToBottom('smooth'), 100)
  }, [sendUserMessage, scrollToBottom])

  // ── New chat ─────────────────────────────────────────────────────────────
  const handleNewChat = useCallback(() => {
    clearChat()
    setAtBottom(true)
    setShowPrompts(true)
  }, [clearChat])

  // User message count (for header)
  const userMessageCount = messages.filter((m) => m.role === 'user').length

  return (
    <div
      className="flex h-screen bg-surface-950 overflow-hidden"
      style={{ paddingTop: '4rem' }} // account for fixed Navbar height
    >
      {/* ── Sidebar ── */}
      <div
        className={clsx(
          'shrink-0 transition-all duration-300 ease-in-out overflow-hidden',
          sidebarOpen ? 'w-72' : 'w-0',
          'hidden lg:block'
        )}
        aria-hidden={!sidebarOpen}
      >
        {sidebarOpen && (
          <div className="w-72 h-full p-4 border-r border-surface-800/60 overflow-y-auto scrollbar-hidden">
            <ChatSidebar
              onNewChat={handleNewChat}
              isApiConfigured={IS_API_CONFIGURED}
            />
          </div>
        )}
      </div>

      {/* ── Main chat panel ── */}
      <main
        className="flex-1 flex flex-col min-w-0 relative"
        aria-label="AI chat interface"
      >
        {/* Toggle sidebar button */}
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="hidden lg:flex absolute top-3 left-3 z-10 p-1.5 rounded-lg text-surface-500 hover:text-surface-300 hover:bg-surface-800 transition-all"
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
        </button>

        {/* Chat header */}
        <ChatHeader
          onNewChat={handleNewChat}
          messageCount={userMessageCount}
          isApiConfigured={IS_API_CONFIGURED}
        />

        {/* ── Messages area ── */}
        <div
          ref={messagesAreaRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto scrollbar-hidden"
          role="log"
          aria-label="Chat conversation"
          aria-live="polite"
          aria-relevant="additions"
        >
          {/* Empty state OR message list */}
          {!hasUserMessages ? (
            <EmptyState onSelect={handleSend} />
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 w-full">
              {/* Welcome message (always first) */}
              {messages.map((message, idx) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isLast={idx === messages.length - 1}
                  onRetry={retryLast}
                />
              ))}

              {/* Scroll anchor */}
              <div ref={messagesEndRef} className="h-1" />
            </div>
          )}
        </div>

        {/* Scroll-to-bottom button */}
        {!atBottom && (
          <button
            onClick={() => { setAtBottom(true); scrollToBottom() }}
            className="absolute bottom-32 right-6 p-2.5 rounded-full bg-primary-500 hover:bg-primary-600 text-white shadow-glow-primary transition-all animate-scale-in z-10"
            aria-label="Scroll to latest message"
          >
            <ChevronRight size={18} className="rotate-90" />
          </button>
        )}

        {/* ── Suggested prompts (after welcome, before first user msg) ── */}
        {showPrompts && hasUserMessages === false && (
          <div className="max-w-3xl mx-auto w-full">
            {/* Handled inside EmptyState — no duplicate needed */}
          </div>
        )}

        {/* ── Input section ── */}
        <div className="max-w-3xl mx-auto w-full">
          {/* Prompts shown just above input after first message */}
          {!showPrompts && !isLoading && messages.length < 4 && (
            <div className="px-4 pt-2">
              <SuggestedPrompts onSelect={handleSend} />
            </div>
          )}

          <ChatInput
            onSend={handleSend}
            onStop={stopStreaming}
            isLoading={isLoading}
            disabled={false}
          />
        </div>
      </main>

      {/* ── Mobile sidebar overlay ── */}
      <div className="lg:hidden">
        {/* Mobile: sidebar as bottom sheet or drawer could be added here */}
      </div>
    </div>
  )
}
