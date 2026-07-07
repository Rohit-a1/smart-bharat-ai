/**
 * Application constants for Smart Bharat AI
 */

// ── App Info ──────────────────────────────────────────────────────────────────
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Smart Bharat AI'
export const APP_URL = import.meta.env.VITE_APP_URL || 'https://smart-bharat-ai.vercel.app'
export const APP_ENV = import.meta.env.VITE_APP_ENV || 'development'

// ── Routes ────────────────────────────────────────────────────────────────────
export const ROUTES = {
  HOME: '/',
  AI_ASSISTANT: '/ai-assistant',
  SCHEMES: '/schemes',
  REPORT_COMPLAINT: '/report-complaint',
  TRACK_COMPLAINT: '/track-complaint',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  REGISTER: '/register',
}

// ── Complaint Status ──────────────────────────────────────────────────────────
export const COMPLAINT_STATUS = {
  FILED: 'Filed',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
  REJECTED: 'Rejected',
}

// ── Priority ──────────────────────────────────────────────────────────────────
export const PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
}

// ── Scheme Categories ─────────────────────────────────────────────────────────
export const SCHEME_CATEGORIES = [
  'Agriculture',
  'Healthcare',
  'Housing',
  'Education',
  'Business',
  'Water & Sanitation',
  'Women & Child',
  'Senior Citizens',
  'Disability',
  'Rural Development',
]

// ── Supported Languages ───────────────────────────────────────────────────────
export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ' },
]

// ── Pagination ────────────────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 12
