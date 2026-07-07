// ─────────────────────────────────────────────────────────────────────────────
// SchemesPage — Browse & AI Government Schemes Finder
// Wires together: Custom Search/Filters, Category tabs, and
//                 Gemini AI Scheme Recommendation Wizard.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, Filter, ChevronRight, Users, IndianRupee,
  Heart, Home, Briefcase, GraduationCap, Wheat, Droplets,
  CheckCircle2, ExternalLink, SlidersHorizontal, Sparkles,
  BookOpen, Landmark, FileText, ArrowRight, RefreshCw, AlertCircle,
  HelpCircle, Check, Info, ShieldCheck, MapPin, Activity, User, HelpCircle as HelpIcon,
} from 'lucide-react'
import { PageHeader, Section } from '../components/ui/PageSections'
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

// Services
import { recommendSchemes } from '../services/gemini'

// ── Dropdown Data ────────────────────────────────────────────────────────────

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir',
]

const OCCUPATIONS = [
  'Farmer / Agricultural Worker',
  'Student / Scholar',
  'Self-Employed / Business Owner',
  'Unemployed / Job Seeker',
  'Daily Wage Worker / Laborer',
  'Salaried Employee (Private)',
  'Government Employee',
  'Housewife / Homemaker',
  'Retired / Pensioner',
]

const SOCIAL_CATEGORIES = ['General', 'EWS', 'OBC', 'SC', 'ST']

const CATEGORIES = [
  { id: 'all', label: 'All Schemes', icon: CheckCircle2 },
  { id: 'agriculture', label: 'Agriculture', icon: Wheat },
  { id: 'health', label: 'Healthcare', icon: Heart },
  { id: 'housing', label: 'Housing', icon: Home },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'business', label: 'Business', icon: Briefcase },
  { id: 'water', label: 'Water & Sanitation', icon: Droplets },
]

const SCHEMES = [
  {
    id: 1,
    name: 'PM-KISAN Samman Nidhi',
    category: 'agriculture',
    ministry: 'Ministry of Agriculture',
    benefit: '₹6,000/year',
    beneficiaries: '12 Crore+',
    description: 'Direct income support of ₹6,000 per year to eligible farmer families in three equal instalments.',
    eligibility: ['Small & marginal farmers', 'Land holding ≤ 2 hectares', 'Valid Aadhaar'],
    badge: 'Active',
    featured: true,
    link: 'https://pmkisan.gov.in',
  },
  {
    id: 2,
    name: 'Ayushman Bharat PM-JAY',
    category: 'health',
    ministry: 'Ministry of Health',
    benefit: '₹5 Lakh/year',
    beneficiaries: '50 Crore+',
    description: 'World\'s largest health insurance scheme providing ₹5 lakh cover per family per year for secondary and tertiary care.',
    eligibility: ['Bottom 40% economically', 'SECC 2011 database', 'No income limit'],
    badge: 'Featured',
    featured: true,
    link: 'https://pmjay.gov.in',
  },
  {
    id: 3,
    name: 'PM Awas Yojana (Urban)',
    category: 'housing',
    ministry: 'Ministry of Housing',
    benefit: 'Up to ₹2.67 Lakh subsidy',
    beneficiaries: '1.12 Crore',
    description: 'Housing for All initiative providing affordable homes to EWS/LIG/MIG households in urban areas.',
    eligibility: ['EWS/LIG/MIG income', 'No pucca house', 'First-time buyer'],
    badge: 'Active',
    featured: false,
    link: 'https://pmaymis.gov.in',
  },
  {
    id: 4,
    name: 'PM Mudra Yojana',
    category: 'business',
    ministry: 'Ministry of Finance',
    benefit: 'Loan up to ₹10 Lakh',
    beneficiaries: '40 Crore+',
    description: 'Micro-finance loans for non-corporate, non-farm small/micro enterprises without collateral.',
    eligibility: ['Indian citizen', 'Non-farm business', 'Age 18-65 years'],
    badge: 'Popular',
    featured: true,
    link: 'https://mudra.org.in',
  },
  {
    id: 5,
    name: 'National Scholarship Portal',
    category: 'education',
    ministry: 'Ministry of Education',
    benefit: 'Various amounts',
    beneficiaries: '5 Crore+',
    description: 'One-stop platform for students to avail scholarships from central and state government sources.',
    eligibility: ['Students at all levels', 'Merit/means based', 'Indian citizen'],
    badge: 'Active',
    featured: false,
    link: 'https://scholarships.gov.in',
  },
  {
    id: 6,
    name: 'Jal Jeevan Mission',
    category: 'water',
    ministry: 'Ministry of Jal Shakti',
    benefit: 'Free tap water connection',
    beneficiaries: '19 Crore households',
    description: 'Providing functional household tap connection (FHTC) to every rural household by 2024.',
    eligibility: ['Rural households', 'No existing tap connection', 'All income groups'],
    badge: 'Active',
    featured: false,
    link: 'https://jaljeevanmission.gov.in',
  },
]

// ── Traditional Scheme Card ─────────────────────────────────────────────────
function SchemeCard({ scheme }) {
  return (
    <Card className="h-full flex flex-col hover:border-primary-500/40 transition-all hover:shadow-glow-primary">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <span className="text-surface-500 text-xs font-semibold uppercase tracking-wider">
            {scheme.ministry}
          </span>
          <Badge variant={scheme.featured ? 'accent' : 'primary'}>
            {scheme.badge}
          </Badge>
        </div>
        <CardTitle className="text-lg font-bold text-white mt-1 group-hover:text-primary-300">
          {scheme.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-surface-400 text-sm leading-relaxed mb-4">
          {scheme.description}
        </p>

        {/* Benefits row */}
        <div className="flex items-center gap-4 bg-surface-900/50 border border-surface-800 rounded-xl p-3 mb-4">
          <div className="flex items-center gap-1.5 text-accent-400">
            <IndianRupee size={15} />
            <div>
              <p className="text-[10px] text-surface-500 uppercase font-semibold">Benefit</p>
              <p className="text-xs font-bold text-accent-300">{scheme.benefit}</p>
            </div>
          </div>
          <div className="w-[1px] h-8 bg-surface-800" />
          <div className="flex items-center gap-1.5 text-primary-400">
            <Users size={15} />
            <div>
              <p className="text-[10px] text-surface-500 uppercase font-semibold">Target</p>
              <p className="text-xs font-bold text-primary-300">{scheme.beneficiaries}</p>
            </div>
          </div>
        </div>

        {/* Eligibility bullets */}
        <div>
          <p className="text-xs font-semibold text-surface-300 mb-2">Eligibility:</p>
          <ul className="space-y-1 text-xs text-surface-400">
            {scheme.eligibility.map((rule) => (
              <li key={rule} className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-accent-400" />
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <a
          href={scheme.link}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary w-full justify-center text-xs"
        >
          Official Portal
          <ExternalLink size={12} />
        </a>
      </CardFooter>
    </Card>
  )
}

// ── Smart AI Recommended Scheme Card ─────────────────────────────────────────
function AIRecommendedCard({ scheme }) {
  const [expanded, setExpanded] = useState(false)
  const isHighMatch = scheme.matchScore >= 90

  return (
    <Card className="relative overflow-hidden border-primary-500/20 bg-gradient-to-br from-surface-900/40 to-surface-800/10 hover:border-primary-500/40 transition-all hover:shadow-glow-primary">
      {/* Decorative gradient corner */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary-500/10 to-transparent pointer-events-none" />

      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          {/* Match Score Badge */}
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
            isHighMatch
              ? 'bg-accent-500/10 border-accent-500/30 text-accent-300'
              : 'bg-primary-500/10 border-primary-500/30 text-primary-300'
          }`}>
            <Sparkles size={12} />
            {scheme.matchScore}% Match
          </div>

          <Badge variant="neutral" className="capitalize">
            {scheme.category || 'General'}
          </Badge>
        </div>

        <CardTitle className="text-xl font-bold text-white mt-3 group-hover:text-primary-300">
          {scheme.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-surface-300 text-sm leading-relaxed">
          {scheme.description}
        </p>

        {/* Benefits Panel */}
        <div className="p-3 rounded-xl bg-accent-500/5 border border-accent-500/20">
          <p className="text-[10px] text-accent-400 font-semibold uppercase tracking-wider mb-0.5">Estimated Benefits</p>
          <p className="text-sm font-bold text-white flex items-center gap-1">
            <IndianRupee size={14} className="text-accent-400 shrink-0" />
            {scheme.benefits}
          </p>
        </div>

        {/* Key Eligibility Rules */}
        <div>
          <p className="text-xs font-bold text-surface-200 mb-2 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-primary-400" />
            Eligibility
          </p>
          <ul className="space-y-1.5 text-xs text-surface-400">
            {scheme.eligibility?.map((rule) => (
              <li key={rule} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-400 shrink-0 mt-1.5" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Accordion area: Documents & Process */}
        {expanded ? (
          <div className="space-y-4 pt-3 border-t border-surface-800 animate-slide-up">
            {/* Required Documents */}
            <div>
              <p className="text-xs font-bold text-surface-200 mb-2 flex items-center gap-1.5">
                <FileText size={14} className="text-primary-400" />
                Required Documents
              </p>
              <div className="flex flex-wrap gap-1.5">
                {scheme.documents?.map((doc) => (
                  <span
                    key={doc}
                    className="px-2.5 py-1 bg-surface-800 border border-surface-700/60 rounded-xl text-xs text-surface-300"
                  >
                    {doc}
                  </span>
                ))}
              </div>
            </div>

            {/* Application Steps */}
            <div>
              <p className="text-xs font-bold text-surface-200 mb-2 flex items-center gap-1.5">
                <Landmark size={14} className="text-primary-400" />
                Application Process
              </p>
              <ol className="space-y-2">
                {scheme.process?.map((step, idx) => (
                  <li key={idx} className="flex gap-2.5 text-xs leading-relaxed text-surface-400">
                    <span className="w-5 h-5 rounded-lg bg-surface-800 border border-surface-700 text-surface-300 font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Official application link */}
            {scheme.link && (
              <div className="pt-2">
                <a
                  href={scheme.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full justify-center text-xs gap-1.5"
                >
                  Apply Online (Official Portal)
                  <ExternalLink size={12} />
                </a>
              </div>
            )}
          </div>
        ) : null}
      </CardContent>


      <CardFooter className="pt-2 border-t border-surface-800/40">
        <button
          onClick={() => setExpanded(!expanded)}
          className="btn-secondary w-full justify-center text-xs gap-1.5"
          aria-expanded={expanded}
        >
          {expanded ? 'Show Less' : 'View Application Process & Docs'}
          <ChevronRight size={12} className={`transition-transform duration-200 ${expanded ? '-rotate-90' : 'rotate-90'}`} />
        </button>
      </CardFooter>
    </Card>
  )
}

// ── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function SchemesPage() {
  const [activeTab, setActiveTab] = useState('browse') // 'browse' | 'recommend'

  // Browse States
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  // Recommendation Form States
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [state, setState] = useState('')
  const [occupation, setOccupation] = useState('')
  const [income, setIncome] = useState('')
  const [category, setCategory] = useState('')

  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState(null)
  const [recSearch, setRecSearch] = useState('')
  const [error, setError] = useState('')

  // ── Handle AI Recommendation ───────────────────────────────────────────────
  const handleRecommend = async (e) => {
    e.preventDefault()
    if (!age || !gender || !state || !occupation || !income || !category) {
      setError('Please fill in all demographic details to generate recommendations.')
      return
    }

    setLoading(true)
    setError('')
    setRecommendations(null)
    setRecSearch('')

    try {
      const schemes = await recommendSchemes({
        age,
        gender,
        state,
        occupation,
        income,
        category,
      })
      if (schemes && schemes.length > 0) {
        setRecommendations(schemes)
      } else {
        setError('No tailored schemes found. Try widening your criteria.')
      }
    } catch (err) {
      setError('Could not fetch recommendations. Please try again.')
    } finally {
      setLoading(false)
    }
  };

  const handleResetForm = () => {
    setAge('')
    setGender('')
    setState('')
    setOccupation('')
    setIncome('')
    setCategory('')
    setRecommendations(null)
    setRecSearch('')
    setError('')
  }

  // ── Browse Filtering ────────────────────────────────────────────────────────
  const filteredSchemes = SCHEMES.filter((scheme) => {
    const matchesCategory = activeCategory === 'all' || scheme.category === activeCategory
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      scheme.name.toLowerCase().includes(query) ||
      scheme.description.toLowerCase().includes(query) ||
      scheme.benefit.toLowerCase().includes(query)

    return matchesCategory && matchesSearch
  })

  return (
    <main className="min-h-screen bg-surface-950 pt-20">
      <PageHeader
        title="Government Schemes"
        subtitle="Discover welfare schemes from both central and state governments. Search manually or find them using AI."
        breadcrumbs={[{ label: 'Schemes' }]}
        badge="Welfare Programs"
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'browse'
                  ? 'bg-primary-500 text-white shadow-glow-primary'
                  : 'bg-surface-800 text-surface-400 hover:text-white'
              }`}
            >
              Browse List
            </button>
            <button
              onClick={() => setActiveTab('recommend')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'recommend'
                  ? 'bg-accent-500 text-white shadow-glow-accent'
                  : 'bg-surface-800 text-surface-400 hover:text-white'
              }`}
            >
              <Sparkles size={14} />
              AI Finder
            </button>
          </div>
        }
      />

      <div className="page-container py-10">
        {/* ── BROWSE SCHEMES TAB ───────────────────────────────────────────────── */}
        {activeTab === 'browse' && (
          <div className="space-y-8 animate-fade-in">
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  id="scheme-search"
                  type="search"
                  placeholder="Search schemes by name, benefit, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  prefix={<Search size={16} />}
                  aria-label="Search government schemes"
                />
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                aria-expanded={showFilters}
                aria-label="Toggle filters"
              >
                <SlidersHorizontal size={16} />
                Filters
              </Button>
            </div>

            {/* Category Tabs */}
            <div
              className="flex flex-wrap gap-2 pb-4 border-b border-surface-800"
              role="tablist"
              aria-label="Scheme categories"
            >
              {CATEGORIES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  role="tab"
                  aria-selected={activeCategory === id}
                  onClick={() => setActiveCategory(id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeCategory === id
                      ? 'bg-primary-500/20 text-primary-300 border border-primary-500/40'
                      : 'bg-surface-800/50 text-surface-400 hover:text-white border border-surface-700 hover:border-surface-600'
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>

            {/* Results Grid */}
            {filteredSchemes.length === 0 ? (
              <div className="glass-card p-16 text-center">
                <Search size={48} className="text-surface-600 mx-auto mb-4" aria-hidden="true" />
                <h3 className="text-white font-bold text-xl mb-2">No schemes found</h3>
                <p className="text-surface-400 mb-6">
                  Try adjusting your search criteria, or let our AI find schemes matching your profile.
                </p>
                <button
                  onClick={() => setActiveTab('recommend')}
                  className="btn-primary"
                >
                  <Sparkles size={15} />
                  Try AI Scheme Finder
                </button>
              </div>
            ) : (
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                role="list"
                aria-label="Government schemes list"
              >
                {filteredSchemes.map((scheme) => (
                  <div key={scheme.id} role="listitem">
                    <SchemeCard scheme={scheme} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── AI RECOMMENDATION FINDER TAB ────────────────────────────────────── */}
        {activeTab === 'recommend' && (
          <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
            {/* Recommendation Form */}
            {!recommendations && (
              <Card>
                <div className="p-3 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow-primary shrink-0">
                      <Sparkles className="text-white animate-pulse" size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">AI Scheme Matcher</h2>
                      <p className="text-surface-400 text-xs">
                        Enter your demographic criteria to find government benefits you qualify for.
                      </p>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl text-xs">
                      <AlertCircle size={15} className="shrink-0" />
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleRecommend} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Age */}
                    <div>
                      <label htmlFor="user-age" className="form-label">Age (in years)</label>
                      <input
                        id="user-age"
                        type="number"
                        min="1"
                        max="120"
                        placeholder="e.g. 34"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="form-input"
                        required
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label htmlFor="user-gender" className="form-label">Gender</label>
                      <select
                        id="user-gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="form-input"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Transgender">Other / Transgender</option>
                      </select>
                    </div>

                    {/* State */}
                    <div>
                      <label htmlFor="user-state" className="form-label">State of Residence</label>
                      <select
                        id="user-state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="form-input"
                        required
                      >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    {/* Occupation */}
                    <div>
                      <label htmlFor="user-occupation" className="form-label">Occupation</label>
                      <select
                        id="user-occupation"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        className="form-input"
                        required
                      >
                        <option value="">Select Occupation</option>
                        {OCCUPATIONS.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>

                    {/* Income */}
                    <div>
                      <label htmlFor="user-income" className="form-label">Annual Family Income (₹)</label>
                      <input
                        id="user-income"
                        type="number"
                        min="0"
                        placeholder="e.g. 150000"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        className="form-input"
                        required
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label htmlFor="user-category" className="form-label">Social Category</label>
                      <select
                        id="user-category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="form-input"
                        required
                      >
                        <option value="">Select Category</option>
                        {SOCIAL_CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    {/* Actions */}
                    <div className="md:col-span-2 pt-4 flex gap-3">
                      <Button
                        type="submit"
                        variant="accent"
                        disabled={loading}
                        className="flex-1 justify-center"
                      >
                        {loading ? 'Analyzing Profile...' : 'Find Eligible Schemes'}
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleResetForm}
                        disabled={loading}
                      >
                        Reset
                      </Button>
                    </div>
                  </form>
                </div>
              </Card>
            )}

            {/* Recommendations Loading State */}
            {loading && (
              <div className="glass-card p-12 text-center space-y-4" role="status" aria-busy="true">
                <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 items-center justify-center shadow-glow-primary animate-spin">
                  <Sparkles className="text-white" size={24} />
                </div>
                <h3 className="text-white font-bold text-lg">Matching with Schemes...</h3>
                <p className="text-surface-400 max-w-sm mx-auto text-xs leading-relaxed">
                  Gemini AI is parsing national databases and checking your state's social welfare regulations.
                </p>
              </div>
            )}

            {/* Recommendations Results List */}
            {recommendations && (() => {
              const query = recSearch.toLowerCase()
              const filteredRecs = recommendations.filter((r) =>
                r.name.toLowerCase().includes(query) ||
                r.description.toLowerCase().includes(query) ||
                r.benefits.toLowerCase().includes(query)
              )

              return (
                <div className="space-y-6">
                  {/* Results Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-900/50 border border-surface-800 px-5 py-3 rounded-2xl">
                    <div>
                      <h3 className="text-white font-bold text-base flex items-center gap-1.5">
                        <Sparkles size={16} className="text-accent-400" />
                        We Found {recommendations.length} Scheme Matches
                      </h3>
                      <p className="text-surface-500 text-xs">
                        Filtered specifically for state: <span className="text-accent-400 font-semibold">{state}</span>
                      </p>
                    </div>
                    <button
                      onClick={handleResetForm}
                      className="btn-secondary text-xs"
                    >
                      <RefreshCw size={12} />
                      New Finder Search
                    </button>
                  </div>

                  {/* Recommendation list search bar */}
                  <div className="flex-1">
                    <Input
                      id="rec-scheme-search"
                      type="search"
                      placeholder="Search within AI recommendations..."
                      value={recSearch}
                      onChange={(e) => setRecSearch(e.target.value)}
                      prefix={<Search size={16} />}
                      aria-label="Search within AI recommended schemes"
                    />
                  </div>

                  {/* Scheme Cards Grid */}
                  {filteredRecs.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                      <Search size={36} className="text-surface-600 mx-auto mb-3" aria-hidden="true" />
                      <p className="text-surface-400 text-sm">
                        No matches within recommendations for "{recSearch}".
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredRecs.map((recScheme) => (
                        <AIRecommendedCard key={recScheme.name} scheme={recScheme} />
                      ))}
                    </div>
                  )}

                  {/* Accuracy Disclaimer */}
                  <div className="flex gap-2.5 p-4 bg-primary-500/5 border border-primary-500/25 rounded-2xl text-xs text-surface-400 leading-relaxed">
                    <Info size={16} className="text-primary-400 shrink-0 mt-0.5" />
                    <span>
                      Note: Schemes are recommended using Generative AI models according to official central & state eligibility criteria.
                      Always consult the official welfare portal of <strong>{state}</strong> or visit your local CSC center to submit your actual application.
                    </span>
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </div>
    </main>
  )
}

