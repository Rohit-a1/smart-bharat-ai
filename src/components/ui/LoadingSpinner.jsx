import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ message = 'Loading...', fullScreen = false }) {
  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 bg-surface-950 flex flex-col items-center justify-center z-50 gap-4"
        role="status"
        aria-live="polite"
      >
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-glow-primary animate-pulse">
            <span className="text-white font-display font-bold text-lg">SB</span>
          </div>
          <Loader2 className="absolute -inset-2 w-20 h-20 text-primary-500/30 animate-spin" />
        </div>
        <p className="text-surface-400 text-sm animate-pulse">{message}</p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-12" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        <p className="text-surface-400 text-sm">{message}</p>
      </div>
    </div>
  )
}
