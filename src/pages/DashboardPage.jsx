import { Link } from 'react-router-dom'
import {
  LayoutDashboard, Bot, FileText, AlertCircle, ClipboardList,
  CheckCircle2, Clock, TrendingUp, Bell, ChevronRight,
  IndianRupee, Users, Shield, Award, ArrowUpRight,
  Plus, Activity,
} from 'lucide-react'
import { Section, StatCard } from '../components/ui/PageSections'
import Card, { CardHeader, CardTitle } from '../components/ui/Card'
import Badge from '../components/ui/Badge'

// ── Mock Dashboard Data ───────────────────────────────────────────────────────

const USER_STATS = [
  { value: '3', label: 'Active Complaints', icon: AlertCircle, color: 'warning' },
  { value: '2', label: 'Schemes Applied', icon: FileText, color: 'accent' },
  { value: '₹12,000', label: 'Benefits Received', icon: IndianRupee, color: 'primary' },
  { value: '5', label: 'AI Conversations', icon: Bot, color: 'navy' },
]

const RECENT_COMPLAINTS = [
  {
    id: 'SB12345678',
    title: 'Water supply disruption',
    dept: 'Water Supply',
    status: 'In Progress',
    date: 'Jan 14, 2024',
    badge: 'warning',
  },
  {
    id: 'SB87654321',
    title: 'Street light not working',
    dept: 'Municipal Corp.',
    status: 'Resolved',
    date: 'Jan 12, 2024',
    badge: 'accent',
  },
  {
    id: 'SB11223344',
    title: 'Garbage not collected',
    dept: 'Sanitation',
    status: 'Filed',
    date: 'Jan 10, 2024',
    badge: 'neutral',
  },
]

const APPLIED_SCHEMES = [
  {
    name: 'PM-KISAN',
    status: 'Active',
    nextInstalment: 'Feb 2024',
    amount: '₹2,000',
    badge: 'accent',
  },
  {
    name: 'Ayushman Bharat',
    status: 'Card Generated',
    nextInstalment: 'Ongoing',
    amount: '₹5L Cover',
    badge: 'primary',
  },
]

const NOTIFICATIONS = [
  { id: 1, text: 'Your complaint SB12345678 has been assigned to JE Ramesh Singh.', time: '2 hours ago', type: 'complaint', unread: true },
  { id: 2, text: 'PM-KISAN instalment of ₹2,000 has been credited to your account.', time: '1 day ago', type: 'scheme', unread: true },
  { id: 3, text: 'Complaint SB87654321 has been resolved. Please provide feedback.', time: '2 days ago', type: 'resolved', unread: false },
]

const QUICK_ACTIONS = [
  { label: 'Ask AI', icon: Bot, href: '/ai-assistant', color: 'primary' },
  { label: 'Find Scheme', icon: FileText, href: '/schemes', color: 'accent' },
  { label: 'Report Issue', icon: AlertCircle, href: '/report-complaint', color: 'warning' },
  { label: 'Track Status', icon: ClipboardList, href: '/track-complaint', color: 'navy' },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-surface-950">
      {/* ── Dashboard Header ── */}
      <section className="relative overflow-hidden bg-hero-gradient pt-28 pb-12" aria-label="Dashboard header">
        <div className="gradient-orb w-96 h-96 bg-primary-500 -top-32 right-0 opacity-10" aria-hidden="true" />
        <div className="page-container relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Badge variant="accent" dot className="mb-3">Citizen Dashboard</Badge>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-1">
                Namaste, <span className="text-primary-400">Citizen!</span> 🙏
              </h1>
              <p className="text-surface-400">
                Here's a summary of your activity and services.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 text-surface-400 hover:text-white hover:bg-white/10 transition-all"
                aria-label="View notifications"
              >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-500" aria-label="2 unread notifications" />
              </button>
              <Link to="/report-complaint" className="btn-primary text-sm">
                <Plus size={16} />
                File Complaint
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8" role="navigation" aria-label="Quick actions">
            {QUICK_ACTIONS.map(({ label, icon: Icon, href, color }) => {
              const colorMap = {
                primary: 'text-primary-400 bg-primary-500/15 border-primary-500/30 hover:bg-primary-500/25 hover:border-primary-500/50',
                accent: 'text-accent-400 bg-accent-500/15 border-accent-500/30 hover:bg-accent-500/25 hover:border-accent-500/50',
                warning: 'text-yellow-400 bg-yellow-500/15 border-yellow-500/30 hover:bg-yellow-500/25 hover:border-yellow-500/50',
                navy: 'text-blue-400 bg-blue-500/15 border-blue-500/30 hover:bg-blue-500/25 hover:border-blue-500/50',
              }
              return (
                <Link
                  key={label}
                  to={href}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-medium text-sm transition-all duration-200 ${colorMap[color]}`}
                  aria-label={label}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <div className="page-container py-10 space-y-8">
        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {USER_STATS.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Recent Complaints ── */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Complaints</CardTitle>
                  <Link
                    to="/track-complaint"
                    className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1 transition-colors"
                    aria-label="View all complaints"
                  >
                    View all <ArrowUpRight size={14} />
                  </Link>
                </div>
              </CardHeader>
              <ul className="space-y-3" role="list" aria-label="Recent complaints list">
                {RECENT_COMPLAINTS.map((complaint) => (
                  <li key={complaint.id}>
                    <Link
                      to={`/track-complaint?id=${complaint.id}`}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-800/50 transition-all group"
                      aria-label={`View complaint: ${complaint.title}`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-surface-800 flex items-center justify-center shrink-0">
                        <AlertCircle size={18} className="text-surface-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate group-hover:text-primary-300 transition-colors">
                          {complaint.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-surface-500 text-xs">{complaint.dept}</span>
                          <span className="text-surface-700 text-xs">•</span>
                          <span className="text-surface-600 text-xs">{complaint.date}</span>
                        </div>
                      </div>
                      <Badge variant={complaint.badge}>{complaint.status}</Badge>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                to="/report-complaint"
                className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-dashed border-surface-700 text-surface-500 hover:text-white hover:border-surface-600 text-sm transition-all"
                aria-label="File a new complaint"
              >
                <Plus size={16} />
                File New Complaint
              </Link>
            </Card>
          </div>

          {/* ── Notifications ── */}
          <div>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Notifications</CardTitle>
                  <span className="badge-primary">
                    {NOTIFICATIONS.filter((n) => n.unread).length} New
                  </span>
                </div>
              </CardHeader>
              <ul className="space-y-3" role="list" aria-label="Notifications">
                {NOTIFICATIONS.map((notif) => (
                  <li
                    key={notif.id}
                    className={`p-3 rounded-xl text-sm transition-all ${
                      notif.unread ? 'bg-primary-500/10 border border-primary-500/20' : 'hover:bg-surface-800/50'
                    }`}
                  >
                    <p className="text-surface-200 leading-relaxed">{notif.text}</p>
                    <p className="text-surface-600 text-xs mt-1.5 flex items-center gap-1">
                      <Clock size={11} />
                      {notif.time}
                    </p>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>

        {/* ── Applied Schemes ── */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>My Schemes</CardTitle>
              <Link
                to="/schemes"
                className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1 transition-colors"
                aria-label="Explore more schemes"
              >
                Explore More <ArrowUpRight size={14} />
              </Link>
            </div>
          </CardHeader>

          {APPLIED_SCHEMES.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {APPLIED_SCHEMES.map((scheme) => (
                <div
                  key={scheme.name}
                  className="flex items-center gap-4 p-4 bg-surface-800/50 rounded-xl border border-surface-700"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center shrink-0">
                    <FileText size={20} className="text-primary-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm">{scheme.name}</p>
                    <Badge variant={scheme.badge} dot className="mt-1 text-xs">
                      {scheme.status}
                    </Badge>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-accent-400 font-bold text-sm">{scheme.amount}</p>
                    <p className="text-surface-600 text-xs mt-0.5">{scheme.nextInstalment}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText size={40} className="text-surface-700 mx-auto mb-3" aria-hidden="true" />
              <p className="text-surface-400 mb-4">No schemes applied yet.</p>
              <Link to="/schemes" className="btn-primary text-sm px-4 py-2">
                Browse Schemes
              </Link>
            </div>
          )}
        </Card>

        {/* ── Activity Chart Placeholder ── */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity size={20} className="text-primary-400" />
              <CardTitle>Activity Overview</CardTitle>
            </div>
          </CardHeader>
          <div
            className="h-40 flex items-end justify-around gap-2 px-4"
            aria-label="Activity chart - coming soon"
            role="img"
          >
            {[40, 65, 30, 80, 55, 90, 45, 70, 35, 85, 60, 75].map((height, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-lg bg-gradient-to-t from-primary-500/40 to-primary-500/10 hover:from-primary-500/70 hover:to-primary-500/20 transition-all cursor-pointer"
                style={{ height: `${height}%` }}
                aria-hidden="true"
              />
            ))}
          </div>
          <p className="text-center text-surface-600 text-xs mt-3">
            Monthly activity — detailed analytics coming soon
          </p>
        </Card>
      </div>
    </main>
  )
}
