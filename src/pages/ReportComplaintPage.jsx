import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle, Upload, Send, ChevronRight, Info,
  CheckCircle2, Building2, Droplets, Zap, Phone,
  Trash2, Route, Shield, MoreHorizontal,
} from 'lucide-react'
import { PageHeader } from '../components/ui/PageSections'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Badge from '../components/ui/Badge'

// ── Department Data ──────────────────────────────────────────────────────────

const DEPARTMENTS = [
  { id: 'municipal', label: 'Municipal Corporation', icon: Building2 },
  { id: 'water', label: 'Water Supply', icon: Droplets },
  { id: 'electricity', label: 'Electricity Board', icon: Zap },
  { id: 'telecom', label: 'Telecom / BSNL', icon: Phone },
  { id: 'sanitation', label: 'Sanitation & Waste', icon: Trash2 },
  { id: 'roads', label: 'Roads & Transport', icon: Route },
  { id: 'police', label: 'Police / Law & Order', icon: Shield },
  { id: 'other', label: 'Other Department', icon: MoreHorizontal },
]

const COMPLAINT_TYPES = [
  'Service not delivered',
  'Incorrect charge / billing',
  'Corruption / bribery demand',
  'Staff misconduct',
  'Delay in processing',
  'Technical issue with portal',
  'Wrong information provided',
  'Other',
]

const STEPS = [
  { num: 1, label: 'Department' },
  { num: 2, label: 'Details' },
  { num: 3, label: 'Evidence' },
  { num: 4, label: 'Review' },
]

// ── Sub-components ────────────────────────────────────────────────────────────

function StepIndicator({ currentStep }) {
  return (
    <nav aria-label="Complaint filing progress" className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hidden">
      {STEPS.map(({ num, label }, index) => (
        <div key={num} className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                currentStep > num
                  ? 'bg-accent-500 text-white'
                  : currentStep === num
                  ? 'bg-primary-500 text-white'
                  : 'bg-surface-800 text-surface-500 border border-surface-700'
              }`}
              aria-current={currentStep === num ? 'step' : undefined}
            >
              {currentStep > num ? <CheckCircle2 size={14} /> : num}
            </div>
            <span
              className={`text-sm font-medium ${
                currentStep >= num ? 'text-white' : 'text-surface-500'
              }`}
            >
              {label}
            </span>
          </div>
          {index < STEPS.length - 1 && (
            <div
              className={`h-px w-8 md:w-16 ${
                currentStep > num ? 'bg-accent-500' : 'bg-surface-700'
              }`}
              aria-hidden="true"
            />
          )}
        </div>
      ))}
    </nav>
  )
}

// ── Page Component ────────────────────────────────────────────────────────────

export default function ReportComplaintPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    department: '',
    complaintType: '',
    title: '',
    description: '',
    location: '',
    files: [],
    name: '',
    phone: '',
    email: '',
    anonymous: false,
  })
  const [submitted, setSubmitted] = useState(false)
  const [complaintId] = useState(`SB${Date.now().toString().slice(-8)}`)

  const updateForm = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Submit to Firestore
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-surface-950">
        <PageHeader
          title="Complaint Filed!"
          subtitle="Your grievance has been registered successfully."
          breadcrumbs={[{ label: 'Report Complaint' }]}
        />
        <div className="page-container py-16 max-w-2xl">
          <div className="glass-card p-10 text-center">
            <div className="w-20 h-20 rounded-2xl bg-accent-500/20 border border-accent-500/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-accent-400" />
            </div>
            <Badge variant="accent" dot className="mb-4">Complaint Registered</Badge>
            <h2 className="text-2xl font-display font-bold text-white mb-2">
              Complaint ID: <span className="text-primary-400">{complaintId}</span>
            </h2>
            <p className="text-surface-400 mb-8">
              Save this ID to track your complaint status. You will receive SMS/email updates as your complaint progresses.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link to={`/track-complaint?id=${complaintId}`} className="btn-primary justify-center">
                Track Complaint
                <ChevronRight size={16} />
              </Link>
              <Link to="/dashboard" className="btn-secondary justify-center">
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-surface-950">
      <PageHeader
        title="Report a Complaint"
        subtitle="File a grievance against any government department. We ensure every complaint reaches the right authority."
        breadcrumbs={[{ label: 'Report Complaint' }]}
        badge="Grievance Portal"
      />

      <div className="page-container py-10">
        <div className="max-w-3xl mx-auto">
          <StepIndicator currentStep={step} />

          <form onSubmit={handleSubmit} noValidate>

            {/* ── Step 1: Department ── */}
            {step === 1 && (
              <Card>
                <h2 className="text-xl font-display font-bold text-white mb-2">
                  Select Department
                </h2>
                <p className="text-surface-400 text-sm mb-6">
                  Choose the government department your complaint is about.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6" role="group" aria-label="Select department">
                  {DEPARTMENTS.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => updateForm('department', id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all duration-200 ${
                        formData.department === id
                          ? 'bg-primary-500/20 border-primary-500/50 text-primary-300'
                          : 'bg-surface-800/50 border-surface-700 text-surface-400 hover:text-white hover:border-surface-600'
                      }`}
                      aria-pressed={formData.department === id}
                      aria-label={label}
                    >
                      <Icon size={22} />
                      <span className="text-xs font-medium leading-tight">{label}</span>
                    </button>
                  ))}
                </div>
                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!formData.department}
                  fullWidth
                >
                  Continue
                  <ChevronRight size={16} />
                </Button>
              </Card>
            )}

            {/* ── Step 2: Complaint Details ── */}
            {step === 2 && (
              <Card>
                <h2 className="text-xl font-display font-bold text-white mb-2">
                  Complaint Details
                </h2>
                <p className="text-surface-400 text-sm mb-6">
                  Describe your complaint clearly. More details help faster resolution.
                </p>

                <div className="space-y-5">
                  {/* Complaint Type */}
                  <div>
                    <label className="form-label" htmlFor="complaint-type">
                      Complaint Type <span className="text-primary-400">*</span>
                    </label>
                    <select
                      id="complaint-type"
                      value={formData.complaintType}
                      onChange={(e) => updateForm('complaintType', e.target.value)}
                      className="form-input"
                      required
                      aria-required="true"
                    >
                      <option value="">Select complaint type...</option>
                      {COMPLAINT_TYPES.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <Input
                    id="complaint-title"
                    label="Complaint Title"
                    placeholder="Brief title for your complaint"
                    value={formData.title}
                    onChange={(e) => updateForm('title', e.target.value)}
                    required
                  />

                  <div>
                    <label className="form-label" htmlFor="complaint-description">
                      Detailed Description <span className="text-primary-400">*</span>
                    </label>
                    <textarea
                      id="complaint-description"
                      value={formData.description}
                      onChange={(e) => updateForm('description', e.target.value)}
                      placeholder="Describe your issue in detail. Include dates, names, and specific incidents..."
                      rows={5}
                      className="form-input resize-none"
                      required
                      aria-required="true"
                    />
                    <p className="text-surface-600 text-xs mt-1">
                      Minimum 50 characters. Currently: {formData.description.length}
                    </p>
                  </div>

                  <Input
                    id="complaint-location"
                    label="Location / Address"
                    placeholder="Where did this issue occur?"
                    value={formData.location}
                    onChange={(e) => updateForm('location', e.target.value)}
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!formData.complaintType || !formData.title || formData.description.length < 10}
                    fullWidth
                  >
                    Continue
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </Card>
            )}

            {/* ── Step 3: Evidence ── */}
            {step === 3 && (
              <Card>
                <h2 className="text-xl font-display font-bold text-white mb-2">
                  Add Evidence
                </h2>
                <p className="text-surface-400 text-sm mb-6">
                  Upload photos, documents, or screenshots to support your complaint (optional but recommended).
                </p>

                {/* Upload zone */}
                <div
                  className="border-2 border-dashed border-surface-700 hover:border-primary-500/50 rounded-2xl p-10 text-center cursor-pointer transition-colors mb-6"
                  role="button"
                  tabIndex={0}
                  aria-label="Upload files"
                >
                  <Upload size={40} className="text-surface-600 mx-auto mb-3" aria-hidden="true" />
                  <p className="text-surface-300 font-medium mb-1">Drop files here or click to upload</p>
                  <p className="text-surface-500 text-sm">JPG, PNG, PDF up to 10MB each • Max 5 files</p>
                </div>

                <div className="glass-card p-4 flex items-start gap-3 mb-6">
                  <Info size={16} className="text-primary-400 mt-0.5 shrink-0" aria-hidden="true" />
                  <p className="text-surface-400 text-xs leading-relaxed">
                    All evidence is encrypted and stored securely. Only the concerned department
                    authority and relevant officials will have access to your files.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="ghost" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button type="button" onClick={() => setStep(4)} fullWidth>
                    Continue
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </Card>
            )}

            {/* ── Step 4: Review & Submit ── */}
            {step === 4 && (
              <div className="space-y-4">
                <Card>
                  <h2 className="text-xl font-display font-bold text-white mb-6">
                    Your Contact Information
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <input
                        type="checkbox"
                        id="anonymous"
                        checked={formData.anonymous}
                        onChange={(e) => updateForm('anonymous', e.target.checked)}
                        className="w-4 h-4 rounded text-primary-500"
                      />
                      <label htmlFor="anonymous" className="text-surface-300 text-sm">
                        Submit anonymously (identity will not be shared with department)
                      </label>
                    </div>

                    {!formData.anonymous && (
                      <>
                        <Input id="complainant-name" label="Full Name" value={formData.name} onChange={(e) => updateForm('name', e.target.value)} placeholder="As per Aadhaar" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input id="complainant-phone" label="Mobile Number" type="tel" value={formData.phone} onChange={(e) => updateForm('phone', e.target.value)} placeholder="10-digit mobile number" />
                          <Input id="complainant-email" label="Email Address" type="email" value={formData.email} onChange={(e) => updateForm('email', e.target.value)} placeholder="For status updates" />
                        </div>
                      </>
                    )}
                  </div>
                </Card>

                {/* Summary */}
                <Card>
                  <h3 className="font-semibold text-white mb-4">Complaint Summary</h3>
                  <dl className="space-y-3 text-sm">
                    {[
                      { label: 'Department', value: DEPARTMENTS.find((d) => d.id === formData.department)?.label },
                      { label: 'Type', value: formData.complaintType },
                      { label: 'Title', value: formData.title },
                      { label: 'Location', value: formData.location || 'Not specified' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between gap-4">
                        <dt className="text-surface-500">{label}</dt>
                        <dd className="text-surface-200 text-right">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </Card>

                <div className="flex gap-3">
                  <Button type="button" variant="ghost" onClick={() => setStep(3)}>
                    Back
                  </Button>
                  <Button type="submit" variant="accent" fullWidth>
                    <Send size={16} />
                    Submit Complaint
                  </Button>
                </div>

                <p className="text-surface-600 text-xs text-center">
                  By submitting, you agree that the information provided is accurate.
                  False complaints are subject to legal action.
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  )
}
