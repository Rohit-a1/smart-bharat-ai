// ─────────────────────────────────────────────────────────────────────────────
// Gemini AI Service
// Placeholder for Google Gemini API integration.
// Get your API key from: https://makersuite.google.com/app/apikey
// ─────────────────────────────────────────────────────────────────────────────

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-pro'
const GEMINI_API_BASE = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}`

/**
 * Send a message to Gemini and get a response.
 * @param {string} prompt - The user's message
 * @param {Array} history - Conversation history [{role, parts}]
 * @returns {Promise<string>} - The AI response text
 */
export async function sendMessageToGemini(prompt, history = []) {
  if (!GEMINI_API_KEY) {
    // Return a placeholder response when API key is not configured
    return getMockResponse(prompt)
  }

  try {
    const contents = [
      ...history,
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ]

    const response = await fetch(`${GEMINI_API_BASE}:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.'
  } catch (error) {
    console.error('[GeminiService] Error:', error)
    throw error
  }
}

/**
 * System prompt for the Smart Bharat AI assistant context.
 */
export const SYSTEM_PROMPT = `You are Smart Bharat AI, an intelligent assistant helping Indian citizens 
navigate government services, schemes, and grievance redressal. 
You provide accurate, helpful, and empathetic responses in simple language.
You can communicate in both English and Hindi (Hinglish) based on user preference.
Always be respectful, patient, and guide citizens step-by-step.`

/**
 * Mock responses for development when API key is not set.
 * TODO: Remove in production.
 */
function getMockResponse(prompt) {
  const lowerPrompt = prompt.toLowerCase()

  if (lowerPrompt.includes('scheme') || lowerPrompt.includes('yojana')) {
    return `**Namaste! 🙏**\n\nI can help you find government schemes. Here are some popular schemes:\n\n• **PM-KISAN** – ₹6,000/year for farmers\n• **Ayushman Bharat** – Free healthcare up to ₹5 lakh\n• **PM Awas Yojana** – Affordable housing\n• **Mudra Yojana** – Business loans up to ₹10 lakh\n\nWhich scheme would you like to know more about?`
  }

  if (lowerPrompt.includes('complaint') || lowerPrompt.includes('grievance')) {
    return `**Filing a Complaint** 📋\n\nI can help you file a complaint. Here's how:\n\n1. Go to the **Complaint Reporting** section\n2. Select the department/ministry\n3. Describe your issue clearly\n4. Attach any documents\n5. Submit and get your complaint ID\n\nYou can track the status anytime using your complaint ID.`
  }

  return `**Namaste! I'm Smart Bharat AI** 🇮🇳\n\nI'm here to help you with:\n\n• 🏛️ Government schemes & benefits\n• 📋 Filing & tracking complaints\n• 📄 Document requirements\n• 🏥 Healthcare services\n• 🌾 Agriculture support\n\n*(Note: This is a demo response. Add your Gemini API key to enable real AI responses.)*\n\nHow can I assist you today?`
}
