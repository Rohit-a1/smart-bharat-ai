import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Search, ClipboardList, Clock, CheckCircle2, XCircle,
  AlertCircle, ChevronRight, MessageSquare, Phone,
  Calendar, User, Building2,
} from 'lucide-react'
import { PageHeader } from '../components/ui/PageSections'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

// ── Mock Complaint Data ───────────────────────────────────────────────────────

const MOCK_COMPLAINTS = {
  'SB12345678': {
    id: 'SB12345678',
    title: 'Water supply disruption for 5 days',
    department: 'Water Supply',
    type: 'Service not delivered',
    status: 'In Progress',
    priority: 'High',
    filed: '2024-01-10',
    lastUpdate: '2024-01-14',
    description: 'No water supply in Sector 12 for the past 5 days. Multiple complaints to helpline ignored.',
    location: 'Sector 12, Block C, New Delhi',
    timeline: [
      { date: '2024-01-10', action: 'Complaint Filed', actor: 'Citizen', status: 'done' },
      { date: '2024-01-11', action: 'Complaint Forwarded to Department', actor: 'System', status: 'done' },
      { date: '2024-01-12', action: 'Department Acknowledged', actor: 'Water Supply Dept.', status: 'done' },
      { date: '2024-01-14', action: 'Field Visit Scheduled', actor: 'JE Ramesh Singh', status: 'active' },
      { date: 'Pending', action: 'Resolution & Closure', actor: 'Department', status: 'pending' },
    ],
  },
  'SB87654321': {
    id: 'SB87654321',
    title: 'Street light not working for 2 weeks',
    department: 'Municipal Corporation',
    type: 'Service not delivered',
    status: 'Resolved',
    priority: 'Medium',
    filed: '2024-01-05',
    lastUpdate: '2024-01-12',
    description: 'Street light at Main Chowk not working. Safety concern at night.',
    location: 'Main Chowk, Sector 5, Gurugram',
    timeline: [
      { date: '2024-01-05', action: 'Complaint Filed', actor: 'Citizen', status: 'done' },
      { date: '2024-01-06', action: 'Forwarded to Electrical Wing', actor: 'System', status: 'done' },
      { date: '2024-01-08', action: 'Work Order Issued', actor: 'MC Gurugram', status: 'done' },
      { date: '2024-01-12', action: 'Street light repaired & Complaint Closed', actor: 'Electrical Wing', status: 'done' },
    ],
  },
}

const STATUS_CONFIG = {
  'Filed': { icon: Clock, color: 'neutral', badge: 'neutral' },
  'In Progress': { icon: AlertCircle, color: 'warning', badge: 'warning' },
  'Resolved': { icon: CheckCircle2, color: 'accent', badge: 'accent' },
  'Closed': { icon: CheckCircle2, color: 'accent', badge: 'accent' },
  'Rejected': { icon: XCircle, color: 'danger', badge: 'danger' },
}

function TimelineStep({ step, isLast }) {
  const statusColors = {
    done: 'bg-accent-500 border-accent-500',
    active: 'bg-primary-500 border-primary-500 animate-pulse',
    pending: 'bg-surface-700 border-surface-600',
  }

  return (
    <li className="relative flex gap-4">
      {/* Connector */}
      {!isLast && (
        <div
          className={`absolute left-3.5 top-8 bottom-0 w-px ${step.status === 'done' ? 'bg-accent-500/40' : 'bg-surface-700'}`}
          aria-hidden="true"
        />
      )}

      {/* Dot */}
      <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 ${statusColors[step.status]}`}>
        {step.status === 'done' && <CheckCircle2 size={12} className="text-white" />}
        {step.status === 'active' && <div className="w-2 h-2 rounded-full bg-white" />}
      </div>

      {/* Content */}
      <div className="flex-1 pb-6">
        <p className={`font-medium text-sm ${step.status === 'pending' ? 'text-surface-500' : 'text-white'}`}>
          {step.action}
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
          <span className="text-surface-500 text-xs flex items-center gap-1">
            <Calendar size={11} />
            {step.date}
          </span>
          <span className="text-surface-500 text-xs flex items-center gap-1">
            <User size={11} />
            {step.actor}
          </span>
        </div>
      </div>
    </li>
  )
}

export default function TrackComplaintPage() {
  const [searchParams] = useSearchParams()
  const [complaintId, setComplaintId] = useState(searchParams.get('id') || '')
  const [complaint, setComplaint] = useState(
    searchParams.get('id') ? MOCK_COMPLAINTS[searchParams.get('id')] : null
  )
  const [notFound, setNotFound] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    const found = MOCK_COMPLAINTS[complaintId.trim().toUpperCase()]
    if (found) {
      setComplaint(found)
      setNotFound(false)
    } else {
      setComplaint(null)
      setNotFound(true)
    }
  }

  const statusInfo = complaint ? STATUS_CONFIG[complaint.status] || STATUS_CONFIG['Filed'] : null

  return (
    <main className="min-h-screen bg-surface-950">
      <PageHeader
        title="Track Your Complaint"
        subtitle="Enter your complaint ID to check real-time status, updates, and resolution progress."
        breadcrumbs={[{ label: 'Track Complaint' }]}
        badge="Complaint Tracker"
        actions={
          <Link to="/report-complaint" className="btn-primary text-sm px-4 py-2">
            <AlertCircle size={14} />
            File New Complaint
          </Link>
        }
      />

      <div className="page-container py-10">
        {/* ── Search Bar ── */}
        <div className="max-w-2xl mx-auto mb-10">
          <form onSubmit={handleSearch} className="flex gap-3" aria-label="Search complaint by ID">
            <div className="flex-1">
              <Input
                id="complaint-id-search"
                type="text"
                placeholder="Enter Complaint ID (e.g. SB12345678)"
                value={complaintId}
                onChange={(e) => setComplaintId(e.target.value.toUpperCase())}
                prefix={<ClipboardList size={16} />}
                aria-label="Complaint ID"
              />
            </div>
            <Button type="submit" disabled={!complaintId.trim()}>
              <Search size={16} />
              Track
            </Button>
          </form>

          {/* Demo IDs */}
          <p className="text-surface-600 text-xs mt-3 text-center">
            Demo IDs:{' '}
            {Object.keys(MOCK_COMPLAINTS).map((id, i) => (
              <span key={id}>
                <button
                  type="button"
                  onClick={() => {
                    setComplaintId(id)
                    setComplaint(MOCK_COMPLAINTS[id])
                    setNotFound(false)
                  }}
                  className="text-primary-400 hover:underline"
                  aria-label={`Use demo ID ${id}`}
                >
                  {id}
                </button>
                {i < Object.keys(MOCK_COMPLAINTS).length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>
        </div>

        {/* ── Not Found ── */}
        {notFound && (
          <div className="max-w-2xl mx-auto glass-card p-12 text-center">
            <XCircle size={48} className="text-red-400 mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-white font-bold text-xl mb-2">Complaint Not Found</h3>
            <p className="text-surface-400 mb-6">
              No complaint found with ID <strong className="text-white">{complaintId}</strong>. Please check the ID and try again.
            </p>
            <Link to="/report-complaint" className="btn-primary">
              File a New Complaint
            </Link>
          </div>
        )}

        {/* ── Complaint Details ── */}
        {complaint && statusInfo && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Status Card */}
            <Card>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-surface-500 text-sm font-mono">{complaint.id}</span>
                    <Badge variant={statusInfo.badge} dot>
                      {complaint.status}
                    </Badge>
                    <Badge variant="warning">{complaint.priority} Priority</Badge>
                  </div>
                  <h2 className="text-xl font-display font-bold text-white">{complaint.title}</h2>
                </div>
              </div>

              {/* Info grid */}
              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Department', value: complaint.department, icon: Building2 },
                  { label: 'Filed On', value: complaint.filed, icon: Calendar },
                  { label: 'Last Update', value: complaint.lastUpdate, icon: Clock },
                  { label: 'Type', value: complaint.type, icon: AlertCircle },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="bg-surface-800/50 rounded-xl p-3">
                    <dt className="text-surface-500 text-xs flex items-center gap-1 mb-1">
                      <Icon size={11} />
                      {label}
                    </dt>
                    <dd className="text-white text-sm font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </Card>

            {/* Timeline */}
            <Card>
              <h3 className="font-display font-bold text-white text-lg mb-6">
                Complaint Timeline
              </h3>
              <ol className="space-y-0" aria-label="Complaint progress timeline">
                {complaint.timeline.map((step, i) => (
                  <TimelineStep
                    key={i}
                    step={step}
                    isLast={i === complaint.timeline.length - 1}
                  />
                ))}
              </ol>
            </Card>

            {/* Description */}
            <Card>
              <h3 className="font-semibold text-white mb-3">Complaint Description</h3>
              <p className="text-surface-300 text-sm leading-relaxed">{complaint.description}</p>
              {complaint.location && (
                <p className="text-surface-500 text-xs mt-3 flex items-center gap-1">
                  📍 {complaint.location}
                </p>
              )}
            </Card>

            {/* Actions */}
            <Card>
              <h3 className="font-semibold text-white mb-4">Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-surface-800 hover:bg-surface-700 text-surface-300 hover:text-white border border-surface-700 transition-all">
                  <MessageSquare size={15} />
                  Add Remark
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-surface-800 hover:bg-surface-700 text-surface-300 hover:text-white border border-surface-700 transition-all">
                  <Phone size={15} />
                  Call Helpline
                </button>
                <Link
                  to="/report-complaint"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-primary-500/15 hover:bg-primary-500/25 text-primary-300 border border-primary-500/30 transition-all"
                >
                  <AlertCircle size={15} />
                  File Related Complaint
                </Link>
              </div>
            </Card>
          </div>
        )}

        {/* ── Empty State (no search yet) ── */}
        {!complaint && !notFound && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <ClipboardList size={64} className="text-surface-700 mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-white font-bold text-xl mb-2">Enter Your Complaint ID</h3>
            <p className="text-surface-400 mb-6">
              Your complaint ID was provided when you filed the complaint. Check your SMS or email for the ID.
            </p>
            <Link to="/report-complaint" className="btn-primary">
              File a New Complaint
              <ChevronRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
