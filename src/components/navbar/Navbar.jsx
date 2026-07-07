import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  Menu, X, Home, Bot, FileText, AlertCircle,
  ClipboardList, LayoutDashboard, Moon, Sun, Bell,
  LogIn,
} from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { clsx } from 'clsx'

const NAV_ITEMS = [
  { label: 'Home',       path: '/',                 icon: Home },
  { label: 'AI Assistant', path: '/ai-assistant',   icon: Bot },
  { label: 'Schemes',    path: '/schemes',           icon: FileText },
  { label: 'Report',     path: '/report-complaint',  icon: AlertCircle },
  { label: 'Track',      path: '/track-complaint',   icon: ClipboardList },
  { label: 'Dashboard',  path: '/dashboard',         icon: LayoutDashboard },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { pathname } = useLocation()

  // Track scroll for navbar backdrop
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-surface-950/80 backdrop-blur-xl border-b border-white/10 shadow-lg'
          : 'bg-transparent'
      )}
      role="banner"
    >
      {/* Tricolor accent bar at the very top */}
      <div className="tricolor-bar w-full" aria-hidden="true" />

      <nav
        className="page-container flex items-center justify-between h-16"
        aria-label="Main navigation"
      >
        {/* ── Logo ── */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group"
          aria-label="Smart Bharat AI - Home"
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-glow-primary">
              <span className="text-white font-display font-bold text-sm">SB</span>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent-400 border-2 border-surface-950 animate-pulse" />
          </div>
          <div className="leading-none">
            <span className="font-display font-bold text-lg text-white group-hover:text-primary-300 transition-colors">
              Smart<span className="text-primary-400"> Bharat</span>
            </span>
            <span className="block text-[10px] text-accent-400 font-medium tracking-wider uppercase">
              AI Powered
            </span>
          </div>
        </Link>

        {/* ── Desktop Nav Links ── */}
        <ul className="hidden lg:flex items-center gap-1" role="list">
          {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                end={path === '/'}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary-500/15 text-primary-400'
                      : 'text-surface-300 hover:text-white hover:bg-white/5'
                  )
                }
              >
                <Icon size={14} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* ── Desktop Right Actions ── */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-surface-400 hover:text-white hover:bg-white/5 transition-all duration-200"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notification Bell */}
          <button
            className="relative p-2 rounded-lg text-surface-400 hover:text-white hover:bg-white/5 transition-all duration-200"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary-500" aria-hidden="true" />
          </button>

          {/* Auth Button */}
          <Link
            to="/login"
            className="btn-primary text-sm px-4 py-2"
            aria-label="Sign in to Smart Bharat AI"
          >
            <LogIn size={16} />
            Sign In
          </Link>
        </div>

        {/* ── Mobile Hamburger ── */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-lg text-surface-300 hover:text-white hover:bg-white/10 transition-all duration-200"
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* ── Mobile Menu ── */}
      <div
        id="mobile-menu"
        className={clsx(
          'lg:hidden overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        )}
        aria-hidden={!isOpen}
      >
        <div className="bg-surface-950/95 backdrop-blur-xl border-b border-white/10 px-4 pb-4 pt-2">
          <ul className="space-y-1" role="list">
            {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  end={path === '/'}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                        : 'text-surface-300 hover:text-white hover:bg-white/5'
                    )
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <Icon size={18} />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Mobile Auth */}
          <div className="mt-4 pt-4 border-t border-surface-800 flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm text-surface-300 hover:text-white bg-white/5 hover:bg-white/10 transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
            <Link
              to="/login"
              className="btn-primary text-sm px-4 py-2.5 flex-1 justify-center"
              onClick={() => setIsOpen(false)}
            >
              <LogIn size={16} />
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
