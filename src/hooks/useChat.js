import { useState, useCallback, useRef } from 'react'
import { streamMessage, sendMessage, getErrorMessage, GeminiError } from '../services/gemini'

// ── Message shape ─────────────────────────────────────────────────────────────
// { id, role: 'user'|'assistant'|'error', content, timestamp, isStreaming? }

const WELCOME_MESSAGE = {
  id:        'welcome',
  role:      'assistant',
  content:   `Namaste! 🙏 I'm **Smart Bharat AI**, your personal guide to Indian government services.

I can help you with:
- 🏛️ **Government Schemes** — PM-KISAN, Ayushman Bharat, Mudra Loan & 1000+ more
- 📋 **Document Requirements** — exactly what you need for any application
- ✅ **Eligibility Check** — find out if you qualify
- 🗺️ **Application Process** — step-by-step guidance online & offline
- 🚨 **Grievance Filing** — how to complain and get resolution

आप **हिंदी या English** में पूछ सकते हैं। How can I help you today?`,
  timestamp: new Date(),
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useChat() {
  const [messages,    setMessages]    = useState([WELCOME_MESSAGE])
  const [isLoading,   setIsLoading]   = useState(false)
  const [error,       setError]       = useState(null)
  const [streamingId, setStreamingId] = useState(null)   // id of the message being streamed

  const abortRef = useRef(null)   // AbortController for in-flight requests

  // Build history for the API (all messages except welcome & error messages)
  const getApiHistory = useCallback((currentMessages) => {
    return currentMessages
      .filter((m) => m.id !== 'welcome' && m.role !== 'error')
      .map(({ role, content }) => ({ role, content }))
  }, [])

  // ── Send a message ──────────────────────────────────────────────────────────
  const sendUserMessage = useCallback(async (text) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    // Cancel any in-flight request
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setError(null)

    // 1. Append user message
    const userMsg = {
      id:        `user-${Date.now()}`,
      role:      'user',
      content:   trimmed,
      timestamp: new Date(),
    }
    const newMessages = (prev) => [...prev, userMsg]

    setMessages(newMessages)
    setIsLoading(true)

    // 2. Create assistant placeholder (for streaming)
    const assistantId = `ai-${Date.now() + 1}`
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: 'assistant', content: '', timestamp: new Date(), isStreaming: true },
    ])
    setStreamingId(assistantId)

    // Build history from state BEFORE appending the new user message
    // (we need the messages array captured at this moment)
    let historySnapshot = []
    setMessages((prev) => {
      // prev here is the state after user message was added but before AI placeholder
      historySnapshot = getApiHistory(prev.filter((m) => m.id !== assistantId))
      return prev
    })

    try {
      // 3. Stream response
      await streamMessage(
        trimmed,
        historySnapshot,
        (chunk) => {
          // Append each chunk to the streaming message
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: m.content + chunk }
                : m
            )
          )
        },
        controller.signal,
      )

      // 4. Mark streaming done
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, isStreaming: false } : m
        )
      )
    } catch (err) {
      if (err?.name === 'AbortError') {
        // Remove the empty placeholder if cancelled
        setMessages((prev) => prev.filter((m) => m.id !== assistantId))
      } else {
        const errMsg = getErrorMessage(err)
        // Replace placeholder with error message
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: errMsg, role: 'error', isStreaming: false }
              : m
          )
        )
        setError(err)
      }
    } finally {
      setIsLoading(false)
      setStreamingId(null)
    }
  }, [isLoading, getApiHistory])

  // ── Retry last failed message ───────────────────────────────────────────────
  const retryLast = useCallback(() => {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user')
    if (!lastUser) return
    // Remove any trailing error or empty AI message
    setMessages((prev) => {
      const idx = prev.findIndex((m) => m.id === lastUser.id)
      return prev.slice(0, idx + 1)
    })
    sendUserMessage(lastUser.content)
  }, [messages, sendUserMessage])

  // ── Stop streaming ──────────────────────────────────────────────────────────
  const stopStreaming = useCallback(() => {
    abortRef.current?.abort()
    setIsLoading(false)
    setStreamingId(null)
    // Mark the streaming message as done (keep what was received)
    setMessages((prev) =>
      prev.map((m) => m.isStreaming ? { ...m, isStreaming: false } : m)
    )
  }, [])

  // ── Clear conversation ──────────────────────────────────────────────────────
  const clearChat = useCallback(() => {
    abortRef.current?.abort()
    setMessages([WELCOME_MESSAGE])
    setIsLoading(false)
    setError(null)
    setStreamingId(null)
  }, [])

  // ── Copy message ────────────────────────────────────────────────────────────
  const copyMessage = useCallback(async (content) => {
    try {
      await navigator.clipboard.writeText(content)
      return true
    } catch {
      return false
    }
  }, [])

  return {
    messages,
    isLoading,
    error,
    streamingId,
    sendUserMessage,
    retryLast,
    stopStreaming,
    clearChat,
    copyMessage,
  }
}
