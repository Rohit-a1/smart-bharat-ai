import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, Filter, ChevronRight, Users, IndianRupee,
  Heart, Home, Briefcase, GraduationCap, Wheat, Droplets,
  CheckCircle2, ExternalLink, SlidersHorizontal,
} from 'lucide-react'
import { PageHeader, Section } from '../components/ui/PageSections'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

// ── Data ──────────────────────────────────────────────────────────────────────

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
    badge: 'Mission Mode',
    featured: false,
    link: 'https://jaljeevanmission.gov.in',
  },
]

// ── Component ─────────────────────────────────────────────────────────────────

function SchemeCard({ scheme }) {
  const badgeVariantMap = {
    'Featured': 'primary',
    'Active': 'accent',
    'Popular': 'navy',
    'Mission Mode': 'warning',
  }

  return (
    <article className="glass-card-hover p-6 flex flex-col gap-4 h-full" aria-label={scheme.name}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <Badge variant={badgeVariantMap[scheme.badge] || 'neutral'} dot className="mb-2">
            {scheme.badge}
          </Badge>
          <h3 className="font-display font-bold text-white text-lg leading-snug">
            {scheme.name}
          </h3>
          <p className="text-surface-500 text-xs mt-1">{scheme.ministry}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-3">
          <p className="text-primary-400 font-bold text-lg">{scheme.benefit}</p>
          <p className="text-surface-500 text-xs">Benefit</p>
        </div>
        <div className="bg-accent-500/10 border border-accent-500/20 rounded-xl p-3">
          <p className="text-accent-400 font-bold text-lg">{scheme.beneficiaries}</p>
          <p className="text-surface-500 text-xs">Beneficiaries</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-surface-400 text-sm leading-relaxed line-clamp-2">
        {scheme.description}
      </p>

      {/* Eligibility */}
      <div>
        <p className="text-white text-xs font-semibold mb-2 uppercase tracking-wide">Key Eligibility</p>
        <ul className="space-y-1" role="list">
          {scheme.eligibility.map((item) => (
            <li key={item} className="flex items-start gap-2 text-surface-400 text-xs">
              <CheckCircle2 size={12} className="text-accent-400 mt-0.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-2">
        <Link
          to="/ai-assistant"
          className="flex-1 text-center py-2 rounded-xl text-sm font-medium bg-primary-500/15 hover:bg-primary-500/25 text-primary-300 border border-primary-500/30 transition-all duration-200"
          aria-label={`Check eligibility for ${scheme.name} via AI`}
        >
          Check Eligibility
        </Link>
        <a
          href={scheme.link}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl text-surface-500 hover:text-white bg-surface-800 hover:bg-surface-700 border border-surface-700 transition-all"
          aria-label={`Official ${scheme.name} website (opens in new tab)`}
        >
          <ExternalLink size={16} />
        </a>
      </div>
    </article>
  )
}

export default function SchemesPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const filteredSchemes = SCHEMES.filter((scheme) => {
    const matchesCategory = activeCategory === 'all' || scheme.category === activeCategory
    const matchesSearch =
      !searchQuery ||
      scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <main className="min-h-screen bg-surface-950">
      <PageHeader
        title="Government Schemes"
        subtitle="Discover central and state government welfare schemes you may be eligible for. Over 1,000+ schemes available."
        breadcrumbs={[{ label: 'Schemes' }]}
        badge="Welfare Programs"
        actions={
          <Link to="/ai-assistant" className="btn-accent text-sm px-4 py-2">
            Check My Eligibility
            <ChevronRight size={14} />
          </Link>
        }
      />

      <div className="page-container py-10">
        {/* ── Search & Filter Bar ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
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

        {/* ── Category Tabs ── */}
        <div
          className="flex flex-wrap gap-2 mb-8 pb-4 border-b border-surface-800"
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

        {/* ── Results Count ── */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-surface-400 text-sm">
            Showing{' '}
            <span className="text-white font-semibold">{filteredSchemes.length}</span>{' '}
            schemes
            {activeCategory !== 'all' && (
              <> in <span className="text-primary-400">{CATEGORIES.find((c) => c.id === activeCategory)?.label}</span></>
            )}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-surface-500 hover:text-surface-300 transition-colors"
              aria-label="Clear search"
            >
              Clear search
            </button>
          )}
        </div>

        {/* ── Scheme Grid ── */}
        {filteredSchemes.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <Search size={48} className="text-surface-600 mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-white font-bold text-xl mb-2">No schemes found</h3>
            <p className="text-surface-400 mb-6">
              Try adjusting your search or category filter, or ask our AI assistant.
            </p>
            <Link to="/ai-assistant" className="btn-primary">
              Ask AI Assistant
            </Link>
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

        {/* ── Load More / CTA ── */}
        <div className="mt-12 text-center">
          <p className="text-surface-500 text-sm mb-4">
            Showing {filteredSchemes.length} of 1,000+ schemes. Can't find what you need?
          </p>
          <Link to="/ai-assistant" className="btn-primary">
            Ask AI to Find Your Scheme
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  )
}
