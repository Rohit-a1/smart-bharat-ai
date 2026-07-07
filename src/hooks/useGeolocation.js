import { useState, useCallback } from 'react'

/**
 * useGeolocation — request GPS coordinates from the browser.
 * Returns: { location, loading, error, getLocation, clearLocation }
 *
 * location shape: { lat, lng, accuracy, address, displayString }
 */
export function useGeolocation() {
  const [location, setLocation] = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)

  const getLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // 1. Get coordinates
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout:            10000,
          maximumAge:         60000,
        })
      })

      const { latitude: lat, longitude: lng, accuracy } = position.coords

      // 2. Reverse geocode via OpenStreetMap Nominatim (free, no API key)
      let address = null
      let displayString = `${lat.toFixed(5)}, ${lng.toFixed(5)}`

      try {
        const res  = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
          { headers: { 'Accept-Language': 'en' } }
        )
        const data = await res.json()
        if (data.display_name) {
          address       = data.display_name
          // Build a shorter, readable address
          const a       = data.address || {}
          const parts   = [
            a.road || a.neighbourhood || a.suburb,
            a.city || a.town || a.village || a.county,
            a.state,
            a.postcode,
          ].filter(Boolean)
          displayString = parts.join(', ') || data.display_name
        }
      } catch {
        // Nominatim failed — use coordinates only
      }

      setLocation({ lat, lng, accuracy: Math.round(accuracy), address, displayString })
    } catch (err) {
      const messages = {
        1: 'Location permission denied. Please allow location access and try again.',
        2: 'Location unavailable. Please try again or enter the address manually.',
        3: 'Location request timed out. Please try again.',
      }
      setError(messages[err.code] || 'Failed to get your location. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  const clearLocation = useCallback(() => {
    setLocation(null)
    setError(null)
  }, [])

  return { location, loading, error, getLocation, clearLocation }
}
