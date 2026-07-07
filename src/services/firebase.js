// ─────────────────────────────────────────────────────────────────────────────
// Firebase Configuration
// Replace placeholder values in .env.local with real Firebase project settings.
// Get these from: Firebase Console → Project Settings → Your Apps
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics, isSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase safely
let app = null
let auth = null
let db = null
let storage = null
let analytics = null

const IS_FIREBASE_CONFIGURED =
  !!firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'demo_key_replace_me' &&
  !firebaseConfig.apiKey.includes('replace')

if (IS_FIREBASE_CONFIGURED) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)
    analytics = isSupported().then((yes) => (yes ? getAnalytics(app) : null))
  } catch (err) {
    console.error('[Firebase] Safe initialization failed:', err.message)
  }
} else {
  console.warn('[Firebase] Running in sandbox/demo mode. Database and Storage services will fall back locally.')
}

export { app, auth, db, storage, analytics }
export default app
