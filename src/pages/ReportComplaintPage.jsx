// ─────────────────────────────────────────────────────────────────────────────
// ReportComplaintPage — 4-step wizard form for filing complaints
// Wires together: Firestore saving, Image upload, GPS geolocation,
//                 AI analysis (Gemini), and Success Screen.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react'
import {
  AlertCircle, ChevronRight, ChevronLeft, Eye,
} from 'lucide-react'
import { PageHeader } from '../components/ui/PageSections'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

// Custom Hooks
import { useImageUpload } from '../hooks/useImageUpload'
import { useGeolocation } from '../hooks/useGeolocation'

// Components
import ComplaintCategoryGrid, { getCategoryById } from '../components/complaint/ComplaintCategoryGrid'
import ImageUploader from '../components/complaint/ImageUploader'
import LocationPicker from '../components/complaint/LocationPicker'
import AISummaryPanel from '../components/complaint/AISummaryPanel'
import SuccessScreen from '../components/complaint/SuccessScreen'

// Services
import { saveComplaint, uploadComplaintImage, detectPriorityLocally } from '../services/complaints'
import { analyzeComplaint } from '../services/gemini'

const STEPS = [
  { num: 1, label: 'Department' },
  { num: 2, label: 'Details' },
  { num: 3, label: 'Evidence' },
  { num: 4, label: 'Review' },
]

export default function ReportComplaintPage() {
  // ── Form States ────────────────────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState(1)
  const [category, setCategory] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [manualAddress, setManualAddress] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  // ── Success State ──────────────────────────────────────────────────────────
  const [successData, setSuccessData] = useState(null)

  // ── Hooks ──────────────────────────────────────────────────────────────────
  const {
    file,
    preview,
    error: imageError,
    isDragging,
    handleFileChange,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    clearImage,
  } = useImageUpload()

  const {
    location,
    loading: locationLoading,
    error: locationError,
    getLocation,
    clearLocation,
  } = useGeolocation()

  // ── AI Analysis State ──────────────────────────────────────────────────────
  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)

  // Trigger Gemini analysis when moving to Step 4 (Review)
  const triggerAIAnalysis = useCallback(async () => {
    setAiLoading(true)
    setAiAnalysis(null)
    try {
      const result = await analyzeComplaint({
        title,
        description,
        category: getCategoryById(category)?.label || category,
        location: location?.displayString || manualAddress,
      })
      if (result) {
        setAiAnalysis(result)
      } else {
        // Fallback locally if Gemini analysis returns null or fails
        const fallbackPriority = detectPriorityLocally(description, category)
        setAiAnalysis({
          summary: description,
          priority: fallbackPriority,
          priorityReason: 'Detected locally based on keywords.',
          suggestedDepartment: getCategoryById(category)?.label || 'General',
          keywords: [category, 'grievance'],
        })
      }
    } catch (err) {
      console.error('AI Analysis failed:', err)
    } finally {
      setAiLoading(false)
    }
  }, [title, description, category, location, manualAddress])

  useEffect(() => {
    if (currentStep === 4) {
      triggerAIAnalysis()
    }
  }, [currentStep, triggerAIAnalysis])

  // ── Step Navigation ────────────────────────────────────────────────────────
  const validateStep = () => {
    setFormError('')
    if (currentStep === 1 && !category) {
      setFormError('Please select a department/category to proceed.')
      return false
    }
    if (currentStep === 2) {
      if (!title.trim()) {
        setFormError('Please enter a complaint title.')
        return false
      }
      if (!description.trim()) {
        setFormError('Please describe the issue in detail.')
        return false
      }
      if (!location && !manualAddress.trim()) {
        setFormError('Please provide a location using GPS or manual entry.')
        return false
      }
    }
    return true
  }

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length))
    }
  }

  const handleBack = () => {
    setFormError('')
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  // ── Reset Form ─────────────────────────────────────────────────────────────
  const handleReset = () => {
    setCurrentStep(1)
    setCategory('')
    setTitle('')
    setDescription('')
    setManualAddress('')
    clearImage()
    clearLocation()
    setAiAnalysis(null)
    setSuccessData(null)
    setFormError('')
  }

  // ── Submit Complaint ───────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    setFormError('')

    try {
      const generatedId = `SB${Date.now().toString().slice(-8)}`
      let imageUrl = null

      // 1. Upload evidence image if present
      if (file) {
        imageUrl = await uploadComplaintImage(file, generatedId)
      }

      // 2. Prepare payload
      const priority = aiAnalysis?.priority || detectPriorityLocally(description, category)
      const complaintPayload = {
        complaintId: generatedId,
        title,
        description,
        category: getCategoryById(category)?.label || category,
        location: location
          ? {
              lat: location.lat,
              lng: location.lng,
              address: location.displayString,
            }
          : {
              address: manualAddress,
            },
        imageUrl,
        priority,
        aiSummary: aiAnalysis?.summary || description.slice(0, 100) + '...',
        timeline: [
          {
            action: 'Complaint Filed',
            actor: 'Citizen',
            status: 'done',
            date: new Date().toISOString(),
          },
        ],
      }

      // 3. Save to database/backend
      await saveComplaint(complaintPayload)

      // 4. Render success view
      setSuccessData({
        complaintId: generatedId,
        category: getCategoryById(category)?.label || category,
        priority,
      })
    } catch (err) {
      console.error('Submission failed:', err)
      setFormError('Failed to file complaint. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render success screen if successfully submitted
  if (successData) {
    return (
      <SuccessScreen
        complaintId={successData.complaintId}
        priority={successData.priority}
        onNewComplaint={handleReset}
      />
    )
  }

  return (
    <main className="min-h-screen bg-surface-950 pt-20">
      <PageHeader
        title="Report a Complaint"
        subtitle="Submit a community issue directly to the concerned authority. Keep track of resolving steps in real-time."
        breadcrumbs={[{ label: 'Report Complaint' }]}
        badge="Direct Citizen Portal 🇮🇳"
      />

      <div className="page-container py-10">
        <div className="max-w-3xl mx-auto">
          {/* Step Indicator Bar */}
          <div className="mb-8 flex justify-between items-center bg-surface-900/60 border border-surface-800/80 px-6 py-4 rounded-2xl backdrop-blur-sm">
            {STEPS.map((step) => {
              const isCompleted = step.num < currentStep
              const isActive = step.num === currentStep
              return (
                <div key={step.num} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                      isCompleted
                        ? 'bg-accent-500 text-white'
                        : isActive
                        ? 'bg-primary-500 text-white shadow-glow-primary'
                        : 'bg-surface-800 text-surface-400'
                    }`}
                  >
                    {isCompleted ? '✓' : step.num}
                  </div>
                  <span
                    className={`text-xs font-semibold hidden md:inline ${
                      isActive ? 'text-white' : 'text-surface-400'
                    }`}
                  >
                    {step.label}
                  </span>
                  {step.num < STEPS.length && (
                    <div className="w-8 h-[2px] bg-surface-800 hidden md:block mx-1" />
                  )}
                </div>
              )
            })}
          </div>

          {/* Form Error Banner */}
          {formError && (
            <div className="mb-6 flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl text-sm">
              <AlertCircle size={16} className="shrink-0" />
              {formError}
            </div>
          )}

          {/* Step Contents */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* STEP 1: Department/Category */}
            {currentStep === 1 && (
              <Card>
                <div className="p-2 space-y-4">
                  <div>
                    <h2 className="text-lg font-bold text-white mb-1">Select Department</h2>
                    <p className="text-surface-400 text-xs">
                      Choose the category most relevant to your grievance.
                    </p>
                  </div>
                  <ComplaintCategoryGrid selected={category} onSelect={setCategory} />
                </div>
              </Card>
            )}

            {/* STEP 2: Issue Details & Location */}
            {currentStep === 2 && (
              <Card>
                <div className="p-2 space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-white mb-1">Complaint Details</h2>
                    <p className="text-surface-400 text-xs">
                      Describe the issue clearly. Provide details to help the officer understand.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Input
                      label="Complaint Title"
                      id="complaint-title"
                      placeholder="e.g. Water logging in main street / Street light not functioning"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />

                    <div className="relative">
                      <label htmlFor="complaint-desc" className="form-label">
                        Description / Detailed Grievance
                      </label>
                      <textarea
                        id="complaint-desc"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Provide detailed information including how long the issue has persisted..."
                        className="form-input min-h-[120px] resize-y"
                        required
                      />
                    </div>

                    <LocationPicker
                      location={location}
                      loading={locationLoading}
                      error={locationError}
                      onGetLocation={getLocation}
                      onClear={clearLocation}
                      manualAddress={manualAddress}
                      onManualChange={setManualAddress}
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* STEP 3: Evidence Upload */}
            {currentStep === 3 && (
              <Card>
                <div className="p-2 space-y-4">
                  <div>
                    <h2 className="text-lg font-bold text-white mb-1">Upload Evidence (Optional)</h2>
                    <p className="text-surface-400 text-xs mb-3">
                      Adding a clear photo helps verify and prioritize the complaint quickly.
                    </p>
                  </div>

                  <ImageUploader
                    file={file}
                    preview={preview}
                    error={imageError}
                    isDragging={isDragging}
                    onChange={handleFileChange}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClear={clearImage}
                  />
                </div>
              </Card>
            )}

            {/* STEP 4: Review and AI Summary */}
            {currentStep === 4 && (
              <div className="space-y-6">
                {/* AI Summary and Auto-Priority Panel */}
                <AISummaryPanel
                  analysis={aiAnalysis}
                  loading={aiLoading}
                  onRetry={triggerAIAnalysis}
                />

                {/* Manual Review Details Card */}
                <Card>
                  <div className="p-2 space-y-4">
                    <div>
                      <h2 className="text-lg font-bold text-white mb-1">Final Review</h2>
                      <p className="text-surface-400 text-xs">
                        Review the details before submitting to the department.
                      </p>
                    </div>

                    <div className="divide-y divide-surface-800 space-y-4 text-sm">
                      <div className="flex justify-between pt-2">
                        <span className="text-surface-500">Selected Department</span>
                        <span className="text-white font-medium">
                          {getCategoryById(category)?.label}
                        </span>
                      </div>

                      <div className="flex justify-between pt-4">
                        <span className="text-surface-500">Complaint Title</span>
                        <span className="text-white font-medium text-right max-w-md truncate">
                          {title}
                        </span>
                      </div>

                      <div className="flex flex-col pt-4">
                        <span className="text-surface-500 mb-1">Detailed Description</span>
                        <p className="text-surface-200 bg-surface-800/40 border border-surface-700/50 p-3 rounded-xl whitespace-pre-wrap">
                          {description}
                        </p>
                      </div>

                      <div className="flex justify-between pt-4">
                        <span className="text-surface-500">Location</span>
                        <span className="text-white font-medium text-right max-w-sm">
                          {location ? location.displayString : manualAddress}
                        </span>
                      </div>

                      {preview && (
                        <div className="pt-4 flex items-center justify-between">
                          <span className="text-surface-500">Evidence Image</span>
                          <img
                            src={preview}
                            alt="Evidence thumbnail"
                            className="w-16 h-16 rounded-xl object-cover border border-surface-700"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Disclaimer banner */}
                <div className="flex gap-3 p-4 bg-primary-500/5 border border-primary-500/25 rounded-2xl text-xs text-surface-400 leading-relaxed">
                  <Eye size={16} className="text-primary-400 shrink-0 mt-0.5" />
                  <span>
                    By submitting this complaint, you verify that the information is true and accurate.
                    Smart Bharat will log your IP address and share the information with respective officers.
                  </span>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between items-center gap-4">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  <ChevronLeft size={16} />
                  Back
                </Button>
              ) : (
                <div />
              )}

              {currentStep < STEPS.length ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleNext}
                >
                  Next
                  <ChevronRight size={16} />
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="accent"
                  disabled={isSubmitting || aiLoading}
                >
                  {isSubmitting ? 'Filing Complaint...' : 'Submit Complaint'}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
