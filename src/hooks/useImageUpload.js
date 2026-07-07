import { useState, useCallback } from 'react'

// Max file size: 5 MB
const MAX_SIZE_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES  = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']

/**
 * useImageUpload — manages file selection, validation, and preview URL.
 */
export function useImageUpload() {
  const [file,       setFile]       = useState(null)   // raw File object
  const [preview,    setPreview]    = useState(null)   // object URL for <img>
  const [error,      setError]      = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const processFile = useCallback((incoming) => {
    if (!incoming) return

    // Validate type
    if (!ALLOWED_TYPES.includes(incoming.type)) {
      setError('Only JPG, PNG, WebP, or HEIC images are allowed.')
      return
    }
    // Validate size
    if (incoming.size > MAX_SIZE_BYTES) {
      setError(`Image must be under 5 MB. Your file is ${(incoming.size / 1024 / 1024).toFixed(1)} MB.`)
      return
    }

    setError(null)
    setFile(incoming)

    // Revoke previous preview to avoid memory leaks
    if (preview) URL.revokeObjectURL(preview)
    setPreview(URL.createObjectURL(incoming))
  }, [preview])

  const handleFileChange = useCallback((e) => {
    processFile(e.target.files?.[0])
  }, [processFile])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    processFile(e.dataTransfer.files?.[0])
  }, [processFile])

  const handleDragOver  = useCallback((e) => { e.preventDefault(); setIsDragging(true)  }, [])
  const handleDragLeave = useCallback((e) => { e.preventDefault(); setIsDragging(false) }, [])

  const clearImage = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview)
    setFile(null)
    setPreview(null)
    setError(null)
  }, [preview])

  return {
    file,
    preview,
    error,
    isDragging,
    handleFileChange,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    clearImage,
  }
}
