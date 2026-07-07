import { Link } from 'react-router-dom'
import { Home, AlertTriangle } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-surface-950 flex items-center justify-center px-4" aria-label="Page not found">
      <div className="text-center max-w-md">
        {/* 404 display */}
        <div className="relative mb-8 inline-block" aria-hidden="true">
          <div className="text-[120px] font-display font-bold leading-none bg-gradient-to-b from-primary-400 to-primary-600 bg-clip-text text-transparent select-none">
            404
          </div>
          <div className="absolute inset-0 blur-3xl bg-primary-500/20 rounded-full" />
        </div>

        <AlertTriangle size={40} className="text-primary-400 mx-auto mb-4" />
        <h1 className="text-2xl font-display font-bold text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-surface-400 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary">
            <Home size={16} />
            Go to Home
          </Link>
          <Link to="/ai-assistant" className="btn-secondary">
            Ask AI Assistant
          </Link>
        </div>

        {/* Decorative tricolor */}
        <div className="tricolor-bar w-32 mx-auto mt-12" aria-hidden="true" />
      </div>
    </main>
  )
}
