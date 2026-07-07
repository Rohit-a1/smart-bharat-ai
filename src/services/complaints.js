// ─────────────────────────────────────────────────────────────────────────────
// Complaint Service  —  Firebase Firestore + Storage
// ─────────────────────────────────────────────────────────────────────────────

import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore'
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage'
import { db, storage } from './firebase'

// ── Collection name ───────────────────────────────────────────────────────────
const COMPLAINTS_COLLECTION = 'complaints'

// ── Generate unique complaint ID ──────────────────────────────────────────────
export function generateComplaintId() {
  const prefix    = 'SB'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random    = Math.random().toString(36).slice(2, 5).toUpperCase()
  return `${prefix}${timestamp}${random}`
}

// ── Upload image to Firebase Storage ─────────────────────────────────────────
/**
 * Upload a complaint image file and return its download URL.
 * Falls back gracefully when Firebase is not configured (returns null).
 *
 * @param {File}   file       - The image File object
 * @param {string} complaintId
 * @returns {Promise<string|null>} download URL or null
 */
export async function uploadComplaintImage(file, complaintId) {
  try {
    const ext      = file.name.split('.').pop()
    const path     = `complaints/${complaintId}/image.${ext}`
    const storageRef = ref(storage, path)
    const snapshot = await uploadBytes(storageRef, file, {
      contentType: file.type,
      customMetadata: { complaintId, uploadedAt: new Date().toISOString() },
    })
    return await getDownloadURL(snapshot.ref)
  } catch (err) {
    console.warn('[ComplaintService] Image upload skipped (Firebase not configured):', err.message)
    return null
  }
}

// ── Save complaint to Firestore ───────────────────────────────────────────────
/**
 * Save a new complaint document.
 * Falls back to local-only mode when Firebase is not configured.
 *
 * @param {Object} complaintData
 * @returns {Promise<{id: string, complaintId: string}>}
 */
export async function saveComplaint(complaintData) {
  const complaintId = complaintData.complaintId || generateComplaintId()
  const payload = {
    ...complaintData,
    complaintId,
    status:    'Filed',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    timeline: [
      {
        action: 'Complaint Filed',
        actor:  'Citizen',
        status: 'done',
        date:   new Date().toISOString(),
      },
    ],
  }

  try {
    const docRef = await addDoc(collection(db, COMPLAINTS_COLLECTION), payload)
    return { id: docRef.id, complaintId }
  } catch (err) {
    // Firebase not configured — return a local-only result
    console.warn('[ComplaintService] Firestore save skipped (Firebase not configured):', err.message)
    return { id: `local-${Date.now()}`, complaintId }
  }
}

// ── Get complaint by complaintId ──────────────────────────────────────────────
export async function getComplaintById(complaintId) {
  try {
    const q = query(
      collection(db, COMPLAINTS_COLLECTION),
      where('complaintId', '==', complaintId)
    )
    const snap = await getDocs(q)
    if (snap.empty) return null
    const docSnap = snap.docs[0]
    return { id: docSnap.id, ...docSnap.data() }
  } catch (err) {
    console.warn('[ComplaintService] Fetch failed:', err.message)
    return null
  }
}

// ── Priority scoring ──────────────────────────────────────────────────────────
/**
 * Detect complaint priority based on keywords and category.
 * Used as a fallback when AI priority detection is unavailable.
 *
 * @param {string} description
 * @param {string} category
 * @returns {'High'|'Medium'|'Low'}
 */
export function detectPriorityLocally(description, category) {
  const high = [
    'emergency', 'urgent', 'fire', 'flood', 'accident', 'electricity',
    'bijli nahi', 'paani nahi', 'road blocked', 'hospital', 'death',
    'danger', 'safety', 'sewage overflow', 'खतरा', 'आपातकाल',
  ]
  const medium = [
    'days', 'week', 'broken', 'damaged', 'not working', 'delay',
    'pending', 'बंद है', 'टूटा', 'खराब', 'garbage', 'pothole',
  ]

  const text = (description + ' ' + category).toLowerCase()
  if (high.some((kw) => text.includes(kw)))   return 'High'
  if (medium.some((kw) => text.includes(kw))) return 'Medium'
  return 'Low'
}
