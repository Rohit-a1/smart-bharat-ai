// ─────────────────────────────────────────────────────────────────────────────
// Gemini AI Service  –  Smart Bharat AI
// Real Google Gemini API integration with proper error handling.
// API key: https://aistudio.google.com/app/apikey
// ─────────────────────────────────────────────────────────────────────────────

const GEMINI_API_KEY   = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_MODEL     = import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash'
const BASE_URL         = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}`

// ── Error types ───────────────────────────────────────────────────────────────
export class GeminiError extends Error {
  constructor(message, code, status) {
    super(message)
    this.name  = 'GeminiError'
    this.code  = code   // 'NO_API_KEY' | 'QUOTA_EXCEEDED' | 'NETWORK' | 'API_ERROR' | 'BLOCKED'
    this.status = status
  }
}

// ── System prompt ─────────────────────────────────────────────────────────────
export const SYSTEM_PROMPT = `You are Smart Bharat AI (स्मार्ट भारत AI), a knowledgeable and empathetic assistant dedicated to helping Indian citizens navigate government services.

## Your Expertise:
- **Government Schemes**: PM-KISAN, Ayushman Bharat, PM Awas Yojana, Mudra Yojana, Ujjwala Yojana, Sukanya Samriddhi, and 1000+ central & state schemes
- **Document Requirements**: Aadhaar, PAN, income certificates, caste certificates, land records — exactly what each scheme needs
- **Eligibility Criteria**: Precise income limits, age restrictions, category requirements
- **Application Processes**: Step-by-step guidance for both online portals and offline CSC centers
- **Grievance Redressal**: How to file, track, and escalate complaints
- **Digital Services**: DigiLocker, Umang App, MyGov, CSC centers, e-Seva

## Language:
- Detect user's language preference from their message
- If they write in Hindi or Hinglish, respond naturally in Hindi/Hinglish
- If in English, respond in English
- Use simple, jargon-free language accessible to rural citizens

## Response Style:
- Be warm, patient, and encouraging — like a trusted friend helping with paperwork
- Use bullet points and numbered lists for clarity
- Include specific URLs, helpline numbers, and official portal links when relevant
- For schemes: always mention eligibility criteria, benefit amount, and how to apply
- For documents: list exactly what is needed with alternatives where possible
- End responses with a follow-up question or offer to help with the next step
- Keep responses concise but complete — aim for 150-300 words unless the topic requires more

## Important:
- Only provide accurate, up-to-date information about Indian government schemes
- If unsure, say so honestly and direct citizens to official sources
- Never ask for personal sensitive information like full Aadhaar numbers or bank details
- Always recommend verifying critical details at official government portals`

// ── Generation config ─────────────────────────────────────────────────────────
const GENERATION_CONFIG = {
  temperature:     0.7,
  topK:            40,
  topP:            0.95,
  maxOutputTokens: 1024,
}

const SAFETY_SETTINGS = [
  { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
]

// ── Build conversation contents for the API ───────────────────────────────────
// Injects the system prompt as the very first user/model turn (Gemini v1beta style)
function buildContents(history, userMessage) {
  const systemTurn = [
    { role: 'user',  parts: [{ text: SYSTEM_PROMPT }] },
    { role: 'model', parts: [{ text: 'Understood! I am Smart Bharat AI, ready to help Indian citizens with government services, schemes, and grievances. How can I assist you today? 🙏' }] },
  ]

  const conversationHistory = history
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role:  m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

  return [
    ...systemTurn,
    ...conversationHistory,
    { role: 'user', parts: [{ text: userMessage }] },
  ]
}

// ── Main API call ─────────────────────────────────────────────────────────────
/**
 * Send a message to Gemini and receive the full response text.
 *
 * @param {string} userMessage   - The current user's message
 * @param {Array}  history       - Prior messages [{role:'user'|'assistant', content:string}]
 * @param {AbortSignal} [signal] - Optional AbortController signal for cancellation
 * @returns {Promise<string>}    - The AI response text
 * @throws {GeminiError}
 */
export async function sendMessage(userMessage, history = [], signal) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'demo_gemini_key_replace_me') {
    throw new GeminiError(
      'Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env.local file.',
      'NO_API_KEY',
      null,
    )
  }

  const url      = `${BASE_URL}:generateContent?key=${GEMINI_API_KEY}`
  const contents = buildContents(history, userMessage)

  let response
  try {
    response = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      signal,
      body: JSON.stringify({ contents, generationConfig: GENERATION_CONFIG, safetySettings: SAFETY_SETTINGS }),
    })
  } catch (err) {
    if (err.name === 'AbortError') throw err   // re-throw cancellations
    throw new GeminiError(
      'Network error. Please check your internet connection and try again.',
      'NETWORK',
      null,
    )
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    const message   = errorBody?.error?.message || `HTTP ${response.status}`

    if (response.status === 429) {
      throw new GeminiError(
        'API quota exceeded. Please wait a moment and try again.',
        'QUOTA_EXCEEDED',
        429,
      )
    }
    if (response.status === 400) {
      throw new GeminiError(
        `Invalid request: ${message}`,
        'API_ERROR',
        400,
      )
    }
    if (response.status === 401 || response.status === 403) {
      throw new GeminiError(
        'Invalid API key. Please check your VITE_GEMINI_API_KEY value.',
        'INVALID_KEY',
        response.status,
      )
    }
    throw new GeminiError(`Gemini API error: ${message}`, 'API_ERROR', response.status)
  }

  const data      = await response.json()
  const candidate = data.candidates?.[0]

  // Safety block
  if (candidate?.finishReason === 'SAFETY') {
    throw new GeminiError(
      'The response was blocked by safety filters. Please rephrase your question.',
      'BLOCKED',
      null,
    )
  }

  const text = candidate?.content?.parts?.[0]?.text
  if (!text) {
    throw new GeminiError('Empty response received from AI. Please try again.', 'EMPTY_RESPONSE', null)
  }

  return text
}

// ── Streaming API call ────────────────────────────────────────────────────────
/**
 * Stream the Gemini response chunk-by-chunk.
 * Calls `onChunk(text)` incrementally, resolves with the full text.
 *
 * @param {string}   userMessage
 * @param {Array}    history
 * @param {Function} onChunk      - Called with each new text chunk
 * @param {AbortSignal} [signal]
 * @returns {Promise<string>}     - Full accumulated response
 */
export async function streamMessage(userMessage, history = [], onChunk, signal) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'demo_gemini_key_replace_me') {
    throw new GeminiError(
      'Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env.local file.',
      'NO_API_KEY',
      null,
    )
  }

  const url      = `${BASE_URL}:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`
  const contents = buildContents(history, userMessage)

  let response
  try {
    response = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      signal,
      body: JSON.stringify({ contents, generationConfig: GENERATION_CONFIG, safetySettings: SAFETY_SETTINGS }),
    })
  } catch (err) {
    if (err.name === 'AbortError') throw err
    throw new GeminiError('Network error. Please check your internet connection.', 'NETWORK', null)
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    const message   = errorBody?.error?.message || `HTTP ${response.status}`
    if (response.status === 429) throw new GeminiError('API quota exceeded. Please wait and try again.', 'QUOTA_EXCEEDED', 429)
    if (response.status === 401 || response.status === 403) throw new GeminiError('Invalid API key.', 'INVALID_KEY', response.status)
    throw new GeminiError(`Gemini API error: ${message}`, 'API_ERROR', response.status)
  }

  // Parse the SSE stream
  const reader  = response.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let   fullText = ''
  let   buffer   = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''   // keep incomplete line in buffer

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const raw = line.slice(6).trim()
      if (raw === '[DONE]') continue
      try {
        const json  = JSON.parse(raw)
        const chunk = json.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
        if (chunk) {
          fullText += chunk
          onChunk?.(chunk)
        }
      } catch {
        // malformed SSE chunk — skip
      }
    }
  }

  return fullText
}

// ── Utility: human-readable error messages ────────────────────────────────────
export function getErrorMessage(error) {
  if (error instanceof GeminiError) {
    switch (error.code) {
      case 'NO_API_KEY':
        return '⚙️ API key not configured. Add VITE_GEMINI_API_KEY to .env.local to enable AI responses.'
      case 'INVALID_KEY':
        return '🔑 Invalid API key. Please check your Gemini API key in .env.local.'
      case 'QUOTA_EXCEEDED':
        return '⏳ Rate limit reached. Please wait a moment before sending another message.'
      case 'NETWORK':
        return '📡 No internet connection. Please check your network and try again.'
      case 'BLOCKED':
        return '🛡️ Your message was blocked by safety filters. Please rephrase your question.'
      case 'EMPTY_RESPONSE':
        return '🤔 I didn\'t get a response. Please try again.'
      default:
        return `❌ Something went wrong: ${error.message}`
    }
  }
  if (error?.name === 'AbortError') return ''   // silent — user cancelled
  return '❌ An unexpected error occurred. Please try again.'
}

// ── Complaint Analysis ────────────────────────────────────────────────────────
/**
 * Use Gemini to analyze a complaint and return structured JSON with:
 *   - summary: concise 2-3 sentence professional summary
 *   - priority: 'High' | 'Medium' | 'Low'
 *   - priorityReason: one sentence justifying the priority
 *   - suggestedDepartment: best department to route to
 *   - keywords: array of 3-5 key tags
 *
 * Falls back to null on any error so the form can still submit.
 *
 * @param {{ title, description, category, location }} complaint
 * @returns {Promise<{summary, priority, priorityReason, suggestedDepartment, keywords}|null>}
 */
export async function analyzeComplaint({ title, description, category, location }) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'demo_gemini_key_replace_me') return null

  const prompt = `You are a government grievance analyst for India. Analyze the following citizen complaint and return a JSON object only (no markdown, no explanation).

Complaint Title: ${title}
Category: ${category}
Location: ${location || 'Not specified'}
Description: ${description}

Return this exact JSON structure:
{
  "summary": "Professional 2-3 sentence summary of the complaint for government records",
  "priority": "High|Medium|Low",
  "priorityReason": "One sentence explaining the priority level",
  "suggestedDepartment": "Most relevant government department name",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}

Priority rules:
- High: safety risk, no water/power for >24h, sewage overflow, road accident risk, medical emergency
- Medium: service degraded, delay >3 days, billing issue, staff misconduct
- Low: minor inconvenience, information request, general feedback

Respond with valid JSON only.`

  try {
    const url = `${BASE_URL}:generateContent?key=${GEMINI_API_KEY}`
    const response = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature:     0.2,   // low temperature for structured output
          maxOutputTokens: 512,
        },
      }),
    })

    if (!response.ok) return null

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) return null

    // Strip markdown code fences if present
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(cleaned)
  } catch (err) {
    console.warn('[GeminiService] Complaint analysis failed:', err.message)
    return null
  }
}
