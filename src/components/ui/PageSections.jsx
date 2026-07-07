import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight, Home } from 'lucide-react'

// ── Section Hero / Page Header ──────────────────────────────────────────────
export function PageHeader({
  title,
  subtitle,
  breadcrumbs = [],
  badge,
  actions,
  gradient = 'from-primary-500/20 to-accent-500/20',
}) {
  return (
    <section
      className="relative overflow-hidden bg-surface-950 pt-28 pb-16"
      aria-labelledby="page-header-title"
    >
      {/* Background gradient */}
      <div
        className={`gradient-orb w-[600px] h-[600px] bg-gradient-to-br ${gradient} -top-64 left-1/2 -translate-x-1/2`}
        aria-hidden="true"
      />

      <div className="relative page-container">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm text-surface-500 mb-6"
          >
            <Link to="/" className="flex items-center gap-1 hover:text-surface-300 transition-colors">
              <Home size={13} />
              Home
            </Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronRight size={13} />
                {crumb.path ? (
                  <Link to={crumb.path} className="hover:text-surface-300 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-surface-300">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* Badge */}
        {badge && (
          <div className="mb-4">
            <span className="badge-primary">
              {badge}
            </span>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h1
              id="page-header-title"
              className="section-title text-white mb-3"
            >
              {title}
            </h1>
            {subtitle && (
              <p className="section-subtitle">{subtitle}</p>
            )}
          </div>

          {actions && (
            <div className="flex items-center gap-3 shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ── Section Wrapper with optional title ─────────────────────────────────────
export function Section({
  id,
  title,
  subtitle,
  badge,
  children,
  className = '',
  center = false,
  cta,
}) {
  return (
    <section id={id} className={`py-20 ${className}`} aria-labelledby={id ? `${id}-title` : undefined}>
      <div className="page-container">
        {(title || subtitle) && (
          <div className={`mb-12 ${center ? 'text-center' : ''}`}>
            {badge && (
              <div className={`mb-4 ${center ? 'flex justify-center' : ''}`}>
                <span className="badge-primary">{badge}</span>
              </div>
            )}
            {title && (
              <h2
                id={id ? `${id}-title` : undefined}
                className="section-title text-white mb-4"
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={`section-subtitle ${center ? 'mx-auto' : ''}`}>
                {subtitle}
              </p>
            )}
          </div>
        )}

        {children}

        {cta && (
          <div className={`mt-10 ${center ? 'flex justify-center' : ''}`}>
            {cta}
          </div>
        )}
      </div>
    </section>
  )
}

// ── Stat card ────────────────────────────────────────────────────────────────
export function StatCard({ value, label, icon: Icon, color = 'primary' }) {
  const colorMap = {
    primary: 'text-primary-400 bg-primary-500/10',
    accent: 'text-accent-400 bg-accent-500/10',
    navy: 'text-blue-400 bg-blue-500/10',
    warning: 'text-yellow-400 bg-yellow-500/10',
  }

  return (
    <div className="glass-card p-6 text-center">
      {Icon && (
        <div className={`w-12 h-12 rounded-xl ${colorMap[color]} flex items-center justify-center mx-auto mb-3`}>
          <Icon size={24} className={colorMap[color].split(' ')[0]} />
        </div>
      )}
      <p className="text-3xl font-display font-bold text-white mb-1">{value}</p>
      <p className="text-surface-400 text-sm">{label}</p>
    </div>
  )
}

// ── Feature card ─────────────────────────────────────────────────────────────
export function FeatureCard({ title, description, icon: Icon, badge, href, color = 'primary' }) {
  const colorMap = {
    primary: { bg: 'bg-primary-500/10', icon: 'text-primary-400', border: 'hover:border-primary-500/30' },
    accent: { bg: 'bg-accent-500/10', icon: 'text-accent-400', border: 'hover:border-accent-500/30' },
    navy: { bg: 'bg-blue-500/10', icon: 'text-blue-400', border: 'hover:border-blue-500/30' },
  }
  const c = colorMap[color] || colorMap.primary

  const content = (
    <div className={`glass-card-hover p-6 h-full flex flex-col gap-4 ${c.border}`}>
      <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}>
        <Icon size={22} className={c.icon} />
      </div>
      <div className="flex-1">
        <div className="flex items-start gap-2 mb-2">
          <h3 className="font-display font-bold text-white">{title}</h3>
          {badge && <span className="badge-primary shrink-0">{badge}</span>}
        </div>
        <p className="text-surface-400 text-sm leading-relaxed">{description}</p>
      </div>
      {href && (
        <div className={`flex items-center gap-1 text-sm font-medium ${c.icon}`}>
          Learn more <ArrowRight size={14} />
        </div>
      )}
    </div>
  )

  if (href) {
    return <Link to={href} className="block h-full" aria-label={title}>{content}</Link>
  }

  return content
}
