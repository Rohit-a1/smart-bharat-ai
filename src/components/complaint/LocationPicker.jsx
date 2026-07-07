// ─────────────────────────────────────────────────────────────────────────────
// LocationPicker — GPS geolocation with reverse-geocoded address display
// ─────────────────────────────────────────────────────────────────────────────

import { MapPin, Loader2, X, Navigation, AlertCircle, CheckCircle2 } from 'lucide-react'
import { clsx } from 'clsx'

export default function LocationPicker({
  location,
  loading,
  error,
  onGetLocation,
  onClear,
  manualAddress,
  onManualChange,
}) {
  return (
    <div className="space-y-3">
      {/* GPS button row */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onGetLocation}
          disabled={loading}
          className={clsx(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200',
            location
              ? 'bg-accent-500/10 border-accent-500/40 text-accent-300 hover:bg-accent-500/15'
              : 'bg-primary-500/10 border-primary-500/40 text-primary-300 hover:bg-primary-500/15',
            loading && 'opacity-70 cursor-not-allowed'
          )}
          aria-label="Get current GPS location"
          aria-busy={loading}
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : location ? (
            <CheckCircle2 size={16} className="text-accent-400" />
          ) : (
            <Navigation size={16} />
          )}
          {loading ? 'Locating…' : location ? 'Update Location' : 'Use GPS Location'}
        </button>

        {location && (
          <button
            type="button"
            onClick={onClear}
            className="p-2.5 rounded-xl border border-surface-700 text-surface-500 hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/10 transition-all"
            aria-label="Clear GPS location"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* GPS result */}
      {location && (
        <div className="flex items-start gap-3 p-3 bg-accent-500/8 border border-accent-500/30 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-accent-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <MapPin size={16} className="text-accent-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-accent-300 text-xs font-medium mb-0.5">Location Captured</p>
            <p className="text-surface-200 text-sm leading-snug line-clamp-2">
              {location.displayString}
            </p>
            <p className="text-surface-500 text-[11px] mt-1">
              {location.lat.toFixed(5)}, {location.lng.toFixed(5)} · ±{location.accuracy}m
            </p>
          </div>
        </div>
      )}

      {/* GPS error */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-500/8 border border-red-500/30 rounded-xl text-red-300 text-xs">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Manual address fallback */}
      <div className="relative">
        <label htmlFor="manual-address" className="form-label">
          {location ? 'Additional Address Details (optional)' : 'Or Enter Address Manually'}
        </label>
        <div className="relative">
          <MapPin size={15} className="absolute left-3 top-3.5 text-surface-500 pointer-events-none" aria-hidden="true" />
          <input
            id="manual-address"
            type="text"
            value={manualAddress}
            onChange={(e) => onManualChange(e.target.value)}
            placeholder="House No., Street, Area, City, State, Pincode…"
            className="form-input pl-9"
            aria-label="Manual address input"
          />
        </div>
        <p className="text-surface-600 text-[11px] mt-1">
          {location
            ? 'GPS location captured. Add specifics like flat/shop number if needed.'
            : 'Describe the exact location where the issue occurred.'}
        </p>
      </div>
    </div>
  )
}
