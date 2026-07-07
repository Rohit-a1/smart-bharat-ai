import { Link } from 'react-router-dom'
import {
  Bot, FileText, AlertCircle, ClipboardList, LayoutDashboard,
  Github, Twitter, Linkedin, ExternalLink, Mail,
  MapPin, Shield, Heart,
} from 'lucide-react'

const FOOTER_LINKS = {
  'Services': [
    { label: 'AI Assistant', path: '/ai-assistant', icon: Bot },
    { label: 'Government Schemes', path: '/schemes', icon: FileText },
    { label: 'File Complaint', path: '/report-complaint', icon: AlertCircle },
    { label: 'Track Complaint', path: '/track-complaint', icon: ClipboardList },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ],
  'Quick Links': [
    { label: 'About Smart Bharat', path: '/about', external: false },
    { label: 'How It Works', path: '/how-it-works', external: false },
    { label: 'Privacy Policy', path: '/privacy', external: false },
    { label: 'Terms of Service', path: '/terms', external: false },
    { label: 'Contact Us', path: '/contact', external: false },
  ],
  'Government Portals': [
    { label: 'MyGov.in', path: 'https://mygov.in', external: true },
    { label: 'CPGRAMS', path: 'https://pgportal.gov.in', external: true },
    { label: 'DigiLocker', path: 'https://digilocker.gov.in', external: true },
    { label: 'PM India', path: 'https://pmindia.gov.in', external: true },
  ],
}

const SOCIAL_LINKS = [
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter/X' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-surface-950 border-t border-white/10 overflow-hidden" role="contentinfo">
      {/* Background decoration */}
      <div className="gradient-orb w-96 h-96 bg-primary-500 -top-48 -left-48" aria-hidden="true" />
      <div className="gradient-orb w-64 h-64 bg-accent-500 -bottom-32 right-0" aria-hidden="true" />

      <div className="relative page-container pt-16 pb-8">
        {/* ── Top Section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mb-12">

          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-3 group" aria-label="Smart Bharat AI Home">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-glow-primary">
                <span className="text-white font-display font-bold">SB</span>
              </div>
              <div>
                <p className="font-display font-bold text-xl text-white">
                  Smart<span className="text-primary-400"> Bharat</span>
                </p>
                <p className="text-xs text-accent-400 tracking-wider uppercase font-medium">AI Powered</p>
              </div>
            </Link>

            <p className="text-surface-400 text-sm leading-relaxed max-w-xs">
              Empowering every Indian citizen with AI-powered access to government services, 
              schemes, and grievance redressal — in their language, at their fingertips.
            </p>

            {/* Tricolor bar */}
            <div className="tricolor-bar w-24" aria-hidden="true" />

            {/* Contact info */}
            <div className="space-y-2">
              <a href="mailto:support@smartbharat.ai" className="flex items-center gap-2 text-surface-400 hover:text-primary-400 text-sm transition-colors">
                <Mail size={14} />
                support@smartbharat.ai
              </a>
              <div className="flex items-center gap-2 text-surface-400 text-sm">
                <MapPin size={14} />
                New Delhi, India 🇮🇳
              </div>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3 pt-2">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-primary-500/20 flex items-center justify-center text-surface-400 hover:text-primary-400 border border-white/10 hover:border-primary-500/40 transition-all duration-200"
                  aria-label={label}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-white font-semibold text-sm tracking-wide uppercase">
                {category}
              </h3>
              <ul className="space-y-2.5" role="list">
                {links.map(({ label, path, external, icon: Icon }) => (
                  <li key={label}>
                    {external ? (
                      <a
                        href={path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-surface-400 hover:text-primary-400 text-sm transition-colors duration-200 group"
                        aria-label={`${label} (opens in new tab)`}
                      >
                        {label}
                        <ExternalLink size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      <Link
                        to={path}
                        className="flex items-center gap-1.5 text-surface-400 hover:text-primary-400 text-sm transition-colors duration-200"
                      >
                        {Icon && <Icon size={13} className="text-surface-500" />}
                        {label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Newsletter / CTA ── */}
        <div className="glass-card p-6 mb-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-1">
              <h4 className="font-display font-semibold text-white mb-1">
                Stay Updated with Government Schemes 📬
              </h4>
              <p className="text-surface-400 text-sm">
                Get notified about new schemes, services, and platform updates.
              </p>
            </div>
            <form
              className="flex w-full md:w-auto gap-2"
              onSubmit={(e) => e.preventDefault()}
              aria-label="Newsletter subscription"
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="form-input flex-1 md:w-56 text-sm py-2.5"
                aria-label="Email address for newsletter"
              />
              <button type="submit" className="btn-primary text-sm px-4 py-2.5 whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="section-divider pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-surface-500 text-xs">
            © {currentYear} Smart Bharat AI. Made with{' '}
            <Heart size={11} className="inline text-red-400" aria-label="love" />{' '}
            for Digital India 🇮🇳
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-surface-500 text-xs">
              <Shield size={12} className="text-accent-500" />
              Secure & Government Compliant
            </div>
            <Link to="/privacy" className="text-surface-500 hover:text-surface-300 text-xs transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-surface-500 hover:text-surface-300 text-xs transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
