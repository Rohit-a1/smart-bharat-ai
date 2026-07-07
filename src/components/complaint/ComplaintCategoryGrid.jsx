// ─────────────────────────────────────────────────────────────────────────────
// ComplaintCategoryGrid — icon grid for selecting complaint department/category
// ─────────────────────────────────────────────────────────────────────────────

import {
  Building2, Droplets, Zap, Phone, Trash2, Route,
  Shield, Stethoscope, GraduationCap, Wheat, TreePine,
  Train, Flame, AlertOctagon, MoreHorizontal,
} from 'lucide-react'
import { clsx } from 'clsx'

export const CATEGORIES = [
  { id: 'water',        label: 'Water Supply',          icon: Droplets,      color: '#3b82f6', desc: 'No water, contamination, leakage' },
  { id: 'electricity',  label: 'Electricity',           icon: Zap,           color: '#eab308', desc: 'Power cut, billing, meter issue' },
  { id: 'roads',        label: 'Roads & Transport',     icon: Route,         color: '#f97316', desc: 'Potholes, road damage, traffic' },
  { id: 'sanitation',   label: 'Sanitation & Waste',    icon: Trash2,        color: '#10b981', desc: 'Garbage, sewage, cleanliness' },
  { id: 'municipal',    label: 'Municipal Services',    icon: Building2,     color: '#8b5cf6', desc: 'Corporation, permits, public space' },
  { id: 'health',       label: 'Healthcare',            icon: Stethoscope,   color: '#ef4444', desc: 'Hospital, medicine, health center' },
  { id: 'police',       label: 'Police & Law',          icon: Shield,        color: '#06b6d4', desc: 'Crime, safety, misconduct' },
  { id: 'education',    label: 'Education',             icon: GraduationCap, color: '#a855f7', desc: 'School, teachers, scholarships' },
  { id: 'agriculture',  label: 'Agriculture',           icon: Wheat,         color: '#84cc16', desc: 'Crop, irrigation, subsidy' },
  { id: 'telecom',      label: 'Telecom / BSNL',        icon: Phone,         color: '#64748b', desc: 'Network, internet, phone' },
  { id: 'railway',      label: 'Railways',              icon: Train,         color: '#0ea5e9', desc: 'Trains, stations, ticketing' },
  { id: 'gas',          label: 'Gas & Fuel',            icon: Flame,         color: '#f59e0b', desc: 'LPG, CNG, refinery' },
  { id: 'environment',  label: 'Environment',           icon: TreePine,      color: '#22c55e', desc: 'Pollution, deforestation, waste' },
  { id: 'emergency',    label: 'Emergency',             icon: AlertOctagon,  color: '#dc2626', desc: 'Urgent safety or life threat' },
  { id: 'other',        label: 'Other',                 icon: MoreHorizontal,color: '#94a3b8', desc: 'Any other department' },
]

export default function ComplaintCategoryGrid({ selected, onSelect }) {
  return (
    <div
      className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5"
      role="radiogroup"
      aria-label="Select complaint category"
    >
      {CATEGORIES.map(({ id, label, icon: Icon, color, desc }) => {
        const isSelected = selected === id
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={`${label}: ${desc}`}
            onClick={() => onSelect(id)}
            className={clsx(
              'relative flex flex-col items-center gap-2 p-3 rounded-2xl border-2 text-center',
              'transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-surface-950',
              isSelected
                ? 'border-primary-500 bg-primary-500/10 scale-[1.03] shadow-glow-primary'
                : 'border-surface-700/60 bg-surface-800/40 hover:border-surface-500 hover:bg-surface-800/80 hover:scale-[1.02]'
            )}
          >
            {/* Selected checkmark */}
            {isSelected && (
              <span
                className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary-500 flex items-center justify-center"
                aria-hidden="true"
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1.5 4L3 5.5L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            )}

            {/* Icon */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
              style={{ backgroundColor: `${color}18`, border: `1px solid ${color}40` }}
            >
              <Icon size={20} style={{ color }} />
            </div>

            {/* Label */}
            <span
              className={clsx(
                'text-[11px] font-medium leading-tight',
                isSelected ? 'text-primary-300' : 'text-surface-300 group-hover:text-white'
              )}
            >
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// Helper: get category details by id
export function getCategoryById(id) {
  return CATEGORIES.find((c) => c.id === id)
}
