import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Bot, Send, Mic, Paperclip, RotateCcw, Copy,
  ThumbsUp, ThumbsDown, Sparkles, Info, ChevronDown,
} from 'lucide-react'
import { PageHeader } from '../components/ui/PageSections'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

const SUGGESTED_PROMPTS = [
  { text: 'PM-KISAN scheme ke liye eligibility kya hai?', tag: 'Agriculture' },
  { text: 'How to apply for Ayushman Bharat health card?', tag: 'Healthcare' },
  { text: 'Mudra loan ke liye documents kya chahiye?', tag: 'Business' },
  { text: 'I want to file a complaint against municipal corporation', tag: 'Grievance' },
  { text: 'PM Awas Yojana mein kaise register karein?', tag: 'Housing' },
  { text: 'What is DigiLocker and how to use it?', tag: 'Digital' },
]

const INITIAL_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content: `**Namaste! I'm Smart Bharat AI 🙏🇮🇳**

I'm your personal guide to all Indian government services. I can help you with:

• 🏛️ **Government Schemes** – Find schemes you're eligible for
• 📋 **Complaint Filing** – Guide you through the grievance process  
• 📄 **Documents** – Tell you what's required for any service
• 🏥 **Healthcare** – Ayushman Bharat, CGHS, and more
• 🌾 **Agriculture** – PM-KISAN, Kisan Credit Card, and more

You can ask me in **English or Hindi (Hinglish)**. How can I help you today?`,
  timestamp: new Date(),
}

function MessageBubble({ message, onCopy, onLike, onDislike }) {
  const isUser = message.role === 'user'

  // Simple markdown-like formatting
  const formatContent = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/•/g, '<span class="text-primary-400">•</span>')
      .replace(/\n/g, '<br />')
  }

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-slide-up`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0 mt-1">
          <Bot size={16} className="text-white" />
        </div>
      )}

      <div className={`max-w-[80%] md:max-w-[70%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div
          className={
            isUser
              ? 'bg-primary-500/20 border border-primary-500/30 rounded-2xl rounded-tr-sm px-4 py-3'
              : 'bg-surface-800/60 border border-surface-700 rounded-2xl rounded-tl-sm px-4 py-3'
          }
        >
          <div
            className="text-sm text-surface-100 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
          />
        </div>

        {/* Actions (AI messages only) */}
        {!isUser && (
          <div className="flex items-center gap-2 px-1">
            <button
              onClick={() => onCopy(message.content)}
              className="p-1 text-surface-600 hover:text-surface-300 transition-colors"
              aria-label="Copy message"
            >
              <Copy size={12} />
            </button>
            <button
              onClick={() => onLike(message.id)}
              className="p-1 text-surface-600 hover:text-accent-400 transition-colors"
              aria-label="Helpful"
            >
              <ThumbsUp size={12} />
            </button>
            <button
              onClick={() => onDislike(message.id)}
              className="p-1 text-surface-600 hover:text-red-400 transition-colors"
              aria-label="Not helpful"
            >
              <ThumbsDown size={12} />
            </button>
            <span className="text-surface-600 text-xs">
              {message.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-primary-500/20 border border-primary-500/30 flex items-center justify-center shrink-0 mt-1">
          <span className="text-primary-400 text-xs font-bold">U</span>
        </div>
      )}
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start animate-fade-in" role="status" aria-label="AI is typing">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0">
        <Bot size={16} className="text-white" />
      </div>
      <div className="bg-surface-800/60 border border-surface-700 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"
            style={{ animationDelay: `${delay}ms` }}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  )
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showPrompts, setShowPrompts] = useState(true)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSendMessage = async (text = inputValue) => {
    if (!text.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)
    setShowPrompts(false)

    // Simulate AI response (replace with real Gemini API call)
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Thank you for your question!\n\n**[AI Response Placeholder]**\n\nThis is where the Gemini AI response will appear. Configure your \`VITE_GEMINI_API_KEY\` in the \`.env.local\` file to enable real AI responses.\n\nYour question was: *"${text}"*`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
  }

  const handleReset = () => {
    setMessages([INITIAL_MESSAGE])
    setShowPrompts(true)
    inputRef.current?.focus()
  }

  return (
    <main className="min-h-screen bg-surface-950 flex flex-col">
      <PageHeader
        title="AI Assistant"
        subtitle="Get instant answers about government services, schemes, and grievances — in English or Hindi."
        breadcrumbs={[{ label: 'AI Assistant' }]}
        badge="Powered by Gemini AI"
        actions={
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            aria-label="Start new conversation"
          >
            <RotateCcw size={14} />
            New Chat
          </Button>
        }
      />

      <div className="page-container flex-1 py-8 flex flex-col lg:flex-row gap-6">
        {/* ── Sidebar ── */}
        <aside className="lg:w-64 shrink-0 space-y-4" aria-label="AI assistant information">
          <div className="glass-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-primary-400" />
              <h2 className="font-semibold text-white text-sm">AI Capabilities</h2>
            </div>
            <ul className="space-y-2 text-xs text-surface-400" role="list">
              {[
                'Scheme Eligibility Check',
                'Document Requirements',
                'Application Guidance',
                'Complaint Assistance',
                'Multi-language Support',
                'Real-time Information',
              ].map((cap) => (
                <li key={cap} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-400" aria-hidden="true" />
                  {cap}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-start gap-2">
              <Info size={14} className="text-primary-400 mt-0.5 shrink-0" />
              <p className="text-xs text-surface-400 leading-relaxed">
                Smart Bharat AI provides information only. For official matters, always
                consult the relevant government department.
              </p>
            </div>
          </div>
        </aside>

        {/* ── Chat Area ── */}
        <div className="flex-1 flex flex-col glass-card overflow-hidden" style={{ minHeight: '60vh' }}>
          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-6 space-y-6"
            role="log"
            aria-label="Conversation history"
            aria-live="polite"
            style={{ maxHeight: 'calc(100vh - 340px)' }}
          >
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onCopy={handleCopy}
                onLike={(id) => console.log('Liked:', id)}
                onDislike={(id) => console.log('Disliked:', id)}
              />
            ))}

            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          {showPrompts && (
            <div className="px-6 pb-2">
              <p className="text-xs text-surface-500 mb-2 font-medium">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_PROMPTS.map(({ text, tag }) => (
                  <button
                    key={text}
                    onClick={() => handleSendMessage(text)}
                    className="text-xs px-3 py-1.5 rounded-full bg-surface-800 hover:bg-primary-500/20 text-surface-300 hover:text-primary-300 border border-surface-700 hover:border-primary-500/40 transition-all duration-200"
                    aria-label={`Suggested: ${text}`}
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-surface-800">
            <form
              className="flex gap-3 items-end"
              onSubmit={(e) => { e.preventDefault(); handleSendMessage() }}
              aria-label="Message input form"
            >
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about any government service or scheme..."
                  rows={1}
                  className="form-input resize-none pr-10 min-h-[44px]"
                  style={{ maxHeight: '120px' }}
                  aria-label="Message input"
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  className="p-2.5 rounded-xl text-surface-500 hover:text-surface-300 hover:bg-surface-800 transition-all"
                  aria-label="Attach file"
                >
                  <Paperclip size={18} />
                </button>
                <button
                  type="button"
                  className="p-2.5 rounded-xl text-surface-500 hover:text-surface-300 hover:bg-surface-800 transition-all"
                  aria-label="Voice input"
                >
                  <Mic size={18} />
                </button>
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="p-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
            <p className="text-xs text-surface-600 mt-2 text-center">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
