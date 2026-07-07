// ─────────────────────────────────────────────────────────────────────────────
// SuggestedPrompts — categorised quick-start prompt chips
// ─────────────────────────────────────────────────────────────────────────────

import { Wheat, Heart, Home, Briefcase, AlertCircle, BookOpen, Smartphone, User } from 'lucide-react'

const CATEGORIES = [
  {
    id: 'schemes',
    label: 'Schemes',
    icon: BookOpen,
    color: 'primary',
    prompts: [
      { text: 'PM-KISAN scheme ke liye eligibility kya hai?',   lang: 'hi' },
      { text: 'How to apply for Ayushman Bharat health card?',  lang: 'en' },
      { text: 'Mudra Yojana loan kaise milega?',                lang: 'hi' },
      { text: 'PM Awas Yojana urban scheme eligibility',         lang: 'en' },
    ],
  },
  {
    id: 'documents',
    label: 'Documents',
    icon: Briefcase,
    color: 'accent',
    prompts: [
      { text: 'Income certificate ke liye kya documents chahiye?', lang: 'hi' },
      { text: 'Documents needed for ration card application',       lang: 'en' },
      { text: 'Caste certificate kaise banwayein?',                lang: 'hi' },
      { text: 'DigiLocker mein documents kaise upload karein?',    lang: 'hi' },
    ],
  },
  {
    id: 'eligibility',
    label: 'Eligibility',
    icon: User,
    color: 'navy',
    prompts: [
      { text: 'Am I eligible for Ujjwala Yojana free LPG?',           lang: 'en' },
      { text: 'Sukanya Samriddhi Yojana ke liye kaun apply kar sakta hai?', lang: 'hi' },
      { text: 'Senior citizen schemes for people above 60 years',      lang: 'en' },
      { text: 'Disability pension scheme eligibility criteria',         lang: 'en' },
    ],
  },
  {
    id: 'grievance',
    label: 'Grievances',
    icon: AlertCircle,
    color: 'warning',
    prompts: [
      { text: 'How to file a complaint on CPGRAMS portal?',                 lang: 'en' },
      { text: 'Bijli department complaint kaise darj karein?',              lang: 'hi' },
      { text: 'Municipal corporation se road repair complaint karna hai',   lang: 'hi' },
      { text: 'How to escalate unresolved government complaint?',           lang: 'en' },
    ],
  },
  {
    id: 'digital',
    label: 'Digital India',
    icon: Smartphone,
    color: 'primary',
    prompts: [
      { text: 'UMANG app kaise use karein government services ke liye?', lang: 'hi' },
      { text: 'How to link Aadhaar with mobile number?',                  lang: 'en' },
      { text: 'DigiLocker account kaise banayein?',                       lang: 'hi' },
      { text: 'Common Service Centre (CSC) nearest location kaise dhundein?', lang: 'hi' },
    ],
  },
]

const COLOR_MAP = {
  primary: {
    tab:    'bg-primary-500/15 text-primary-300 border border-primary-500/30 hover:bg-primary-500/25',
    active: 'bg-primary-500/25 text-primary-200 border border-primary-500/50',
    chip:   'bg-primary-500/10 hover:bg-primary-500/20 text-primary-300 border border-primary-500/20 hover:border-primary-500/40',
    icon:   'text-primary-400',
  },
  accent: {
    tab:    'bg-accent-500/15 text-accent-300 border border-accent-500/30 hover:bg-accent-500/25',
    active: 'bg-accent-500/25 text-accent-200 border border-accent-500/50',
    chip:   'bg-accent-500/10 hover:bg-accent-500/20 text-accent-300 border border-accent-500/20 hover:border-accent-500/40',
    icon:   'text-accent-400',
  },
  navy: {
    tab:    'bg-blue-500/15 text-blue-300 border border-blue-500/30 hover:bg-blue-500/25',
    active: 'bg-blue-500/25 text-blue-200 border border-blue-500/50',
    chip:   'bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/20 hover:border-blue-500/40',
    icon:   'text-blue-400',
  },
  warning: {
    tab:    'bg-yellow-500/15 text-yellow-300 border border-yellow-500/30 hover:bg-yellow-500/25',
    active: 'bg-yellow-500/25 text-yellow-200 border border-yellow-500/50',
    chip:   'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 border border-yellow-500/20 hover:border-yellow-500/40',
    icon:   'text-yellow-400',
  },
}

import { useState } from 'react'

export default function SuggestedPrompts({ onSelect }) {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id)

  const category = CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0]
  const colors   = COLOR_MAP[category.color]

  return (
    <div className="px-4 pb-2 space-y-3 animate-slide-up">
      {/* Header */}
      <p className="text-xs text-surface-500 font-medium text-center">
        ✨ Try a question or type your own
      </p>

      {/* Category tabs */}
      <div
        className="flex gap-1.5 overflow-x-auto scrollbar-hidden pb-0.5"
        role="tablist"
        aria-label="Prompt categories"
      >
        {CATEGORIES.map(({ id, label, icon: Icon, color }) => {
          const c    = COLOR_MAP[color]
          const isAc = id === activeCategory
          return (
            <button
              key={id}
              role="tab"
              aria-selected={isAc}
              aria-controls={`prompts-${id}`}
              onClick={() => setActiveCategory(id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${isAc ? c.active : c.tab}`}
            >
              <Icon size={12} />
              {label}
            </button>
          )
        })}
      </div>

      {/* Prompt chips */}
      <div
        id={`prompts-${activeCategory}`}
        role="tabpanel"
        className="flex flex-wrap gap-2"
      >
        {category.prompts.map(({ text, lang }) => (
          <button
            key={text}
            onClick={() => onSelect(text)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 text-left ${colors.chip}`}
            lang={lang}
            aria-label={`Ask: ${text}`}
          >
            {lang === 'hi' && (
              <span className="text-[10px] opacity-60 shrink-0" aria-label="Hindi">अ</span>
            )}
            {text}
          </button>
        ))}
      </div>
    </div>
  )
}
