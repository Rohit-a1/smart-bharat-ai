/**
 * Utility helpers for Smart Bharat AI
 */

// ── Class name utility ────────────────────────────────────────────────────────
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

// ── Date formatting ───────────────────────────────────────────────────────────
export function formatDate(date, locale = 'en-IN') {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatRelativeTime(date) {
  const now = new Date()
  const diff = now - new Date(date)
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return formatDate(date)
}

// ── Complaint ID generator ────────────────────────────────────────────────────
export function generateComplaintId() {
  return `SB${Date.now().toString().slice(-8)}`
}

// ── Truncate text ─────────────────────────────────────────────────────────────
export function truncate(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

// ── Debounce ──────────────────────────────────────────────────────────────────
export function debounce(fn, delay) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// ── Copy to clipboard ─────────────────────────────────────────────────────────
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

// ── Validate Indian mobile number ─────────────────────────────────────────────
export function isValidIndianMobile(mobile) {
  return /^[6-9]\d{9}$/.test(mobile.replace(/\s+/g, ''))
}

// ── Validate Aadhaar number ───────────────────────────────────────────────────
export function isValidAadhaar(aadhaar) {
  return /^\d{12}$/.test(aadhaar.replace(/\s+/g, ''))
}

// ── Format currency (INR) ─────────────────────────────────────────────────────
export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount)
}
