// ─────────────────────────────────────────────────────────────────────────────
// Auth Service (Firebase Auth placeholder)
// Implements sign-in, sign-up, sign-out, and Google OAuth flows.
// ─────────────────────────────────────────────────────────────────────────────

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from './firebase'

const googleProvider = new GoogleAuthProvider()
googleProvider.addScope('profile')
googleProvider.addScope('email')

// Sign up with email & password
export const signUpWithEmail = async (email, password, displayName) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(userCredential.user, { displayName })
  return userCredential.user
}

// Sign in with email & password
export const signInWithEmail = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  return userCredential.user
}

// Sign in with Google OAuth
export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider)
  return result.user
}

// Sign out
export const signOutUser = async () => {
  await signOut(auth)
}

// Send password reset email
export const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email)
}

// Auth state listener
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback)
}
