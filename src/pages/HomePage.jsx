import { Link } from 'react-router-dom'
import {
  Bot, FileText, AlertCircle, ClipboardList, LayoutDashboard,
  ArrowRight, Shield, Users, CheckCircle2, Star, ChevronRight,
  Zap, Globe, Award, TrendingUp, IndianRupee, Heart,
} from 'lucide-react'
import { Section, StatCard, FeatureCard } from '../components/ui/PageSections'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

// ── Data ──────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Bot,
    title: 'AI Assistant',
    description: 'Get instant answers about government services, schemes, and procedures in English or Hindi.',
    badge: 'AI Powered',
    href: '/ai-assistant',
    color: 'primary',
  },
  {
    icon: FileText,
    title: 'Government Schemes',
    description: 'Discover all central and state government welfare schemes you are eligible for.',
    badge: 'New',
    href: '/schemes',
    color: 'accent',
  },
  {
    icon: AlertCircle,
    title: 'Report Complaint',
    description: 'File grievances against any government department with evidence and get resolution.',
    href: '/report-complaint',
    color: 'navy',
  },
  {
    icon: ClipboardList,
    title: 'Track Complaint',
    description: 'Real-time tracking of your submitted complaints with status updates and history.',
    href: '/track-complaint',
    color: 'primary',
  },
  {
    icon: LayoutDashboard,
    title: 'Citizen Dashboard',
    description: 'Personalized hub for all your applications, complaints, and scheme enrollments.',
    href: '/dashboard',
    color: 'accent',
  },
  {
    icon: Globe,
    title: 'Multi-Language',
    description: 'Available in 22 Indian languages including Hindi, Tamil, Telugu, Bengali, and more.',
    badge: 'Coming Soon',
    color: 'navy',
  },
]

const STATS = [
  { value: '10L+', label: 'Citizens Helped', icon: Users, color: 'primary' },
  { value: '₹500Cr+', label: 'Benefits Availed', icon: IndianRupee, color: 'accent' },
  { value: '95%', label: 'Resolution Rate', icon: CheckCircle2, color: 'navy' },
  { value: '50K+', label: 'Complaints Resolved', icon: Shield, color: 'warning' },
]

const POPULAR_SCHEMES = [
  { name: 'PM-KISAN', category: 'Agriculture', benefit: '₹6,000/year', color: 'accent' },
  { name: 'Ayushman Bharat', category: 'Healthcare', benefit: '₹5 Lakh Cover', color: 'primary' },
  { name: 'PM Awas Yojana', category: 'Housing', benefit: 'Affordable Home', color: 'navy' },
  { name: 'Mudra Yojana', category: 'Business', benefit: 'Up to ₹10 Lakh', color: 'warning' },
]

const TESTIMONIALS = [
  {
    name: 'Ramesh Kumar',
    location: 'Varanasi, UP',
    text: 'Smart Bharat AI helped me find the PM-KISAN scheme and I received ₹6,000 I didn\'t know I was eligible for!',
    rating: 5,
    avatar: 'RK',
  },
  {
    name: 'Priya Devi',
    location: 'Chennai, TN',
    text: 'Filed a water supply complaint and got resolution within 3 days. Amazing platform!',
    rating: 5,
    avatar: 'PD',
  },
  {
    name: 'Mohammed Salim',
    location: 'Hyderabad, TS',
    text: 'The AI assistant explained the business loan process in simple language. Very helpful!',
    rating: 5,
    avatar: 'MS',
  },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main>
      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        aria-label="Hero section"
      >
        {/* Hero background */}
        <div className="absolute inset-0 bg-hero-gradient" aria-hidden="true" />
        <div className="gradient-orb w-[600px] h-[600px] bg-primary-500 -top-64 right-0 opacity-10" aria-hidden="true" />
        <div className="gradient-orb w-[400px] h-[400px] bg-accent-500 bottom-0 left-0 opacity-10" aria-hidden="true" />

        {/* Animated grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(249,115,22,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
          aria-hidden="true"
        />

        <div className="relative page-container text-center py-32 pt-40">
          {/* Badge */}
          <div className="flex justify-center mb-6 animate-fade-in">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/15 border border-primary-500/30 text-primary-300 text-sm font-medium">
              <Zap size={14} className="text-primary-400" />
              AI-Powered Citizen Services
              <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
            </span>
          </div>

          {/* Heading */}
          <h1 className="section-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-6 animate-slide-up">
            Empowering{' '}
            <span className="gradient-text">Every Citizen</span>
            <br />
            of{' '}
            <span className="text-primary-400">Digital India 🇮🇳</span>
          </h1>

          {/* Subtitle */}
          <p className="text-surface-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Navigate government services, discover welfare schemes, file grievances,
            and get AI-powered assistance — all in one platform, in your language.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link
              to="/ai-assistant"
              className="btn-primary text-base px-8 py-4 group"
              aria-label="Try AI Assistant"
            >
              <Bot size={20} />
              Try AI Assistant
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/schemes"
              className="btn-secondary text-base px-8 py-4"
              aria-label="Explore Government Schemes"
            >
              <FileText size={20} />
              Explore Schemes
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-surface-400 text-sm animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-1.5">
              <Shield size={14} className="text-accent-400" />
              Government Compliant
            </div>
            <div className="w-px h-4 bg-surface-700" aria-hidden="true" />
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-accent-400" />
              Free for Citizens
            </div>
            <div className="w-px h-4 bg-surface-700" aria-hidden="true" />
            <div className="flex items-center gap-1.5">
              <Globe size={14} className="text-accent-400" />
              22 Indian Languages
            </div>
            <div className="w-px h-4 bg-surface-700" aria-hidden="true" />
            <div className="flex items-center gap-1.5">
              <Award size={14} className="text-accent-400" />
              Award Winning
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <Section className="bg-surface-950">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {STATS.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </Section>

      {/* ── Features ───────────────────────────────────────────────────────── */}
      <Section
        id="features"
        title="Everything You Need to Access"
        subtitle="One unified platform to navigate all government services without confusion, paperwork, or delays."
        badge="Our Services"
        className="bg-surface-900/50"
        center
        cta={
          <Link to="/dashboard" className="btn-primary">
            <LayoutDashboard size={18} />
            View My Dashboard
            <ArrowRight size={16} />
          </Link>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </Section>

      {/* ── AI Showcase ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-surface-950 overflow-hidden" aria-label="AI Assistant showcase">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div className="order-2 lg:order-1">
              <span className="badge-primary mb-4 inline-flex">AI Powered</span>
              <h2 className="section-title text-white mb-4">
                Your Personal{' '}
                <span className="gradient-text">Government Guide</span>
              </h2>
              <p className="section-subtitle mb-8">
                Ask anything about government schemes, document requirements, application
                processes, or file a complaint — get instant, accurate answers in plain
                language.
              </p>
              <ul className="space-y-3 mb-8" role="list">
                {[
                  'Available in English & Hindi (Hinglish)',
                  'Guides you through complex application processes',
                  'Checks your scheme eligibility instantly',
                  'Available 24/7, no waiting in queues',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-surface-300">
                    <CheckCircle2 size={18} className="text-accent-400 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/ai-assistant" className="btn-primary">
                <Bot size={18} />
                Chat with AI
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Mock Chat UI */}
            <div className="order-1 lg:order-2 relative">
              <div className="gradient-orb w-80 h-80 bg-primary-500 top-0 right-0 opacity-20" aria-hidden="true" />
              <div className="glass-card p-6 relative" role="img" aria-label="AI chat interface preview">
                {/* Chat header */}
                <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    <Bot size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">Smart Bharat AI</p>
                    <p className="text-xs text-accent-400 flex items-center gap-1">
                      <span className="status-dot-green" aria-label="Online" />
                      Online
                    </p>
                  </div>
                </div>

                {/* Mock messages */}
                <div className="space-y-3" aria-label="Sample conversation">
                  <div className="flex justify-end">
                    <div className="bg-primary-500/20 border border-primary-500/30 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%]">
                      <p className="text-sm text-surface-100">PM-KISAN scheme ke liye kaise apply karein?</p>
                    </div>
                  </div>
                  <div className="flex justify-start gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0 mt-1">
                      <Bot size={14} className="text-white" />
                    </div>
                    <div className="bg-surface-800/60 border border-surface-700 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[80%]">
                      <p className="text-sm text-surface-200">
                        <strong className="text-white">Namaste! 🙏</strong> PM-KISAN के लिए आप नजदीकी CSC
                        center जाएं या <span className="text-primary-400">pmkisan.gov.in</span> पर ऑनलाइन apply करें।
                        आपको चाहिए: Aadhaar, Bank Account, Land Records।
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-primary-500/20 border border-primary-500/30 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%]">
                      <p className="text-sm text-surface-100">Documents kya chahiye?</p>
                    </div>
                  </div>
                  {/* Typing indicator */}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0">
                      <Bot size={14} className="text-white" />
                    </div>
                    <div className="bg-surface-800/60 border border-surface-700 rounded-2xl px-4 py-3 flex items-center gap-1">
                      {[0, 150, 300].map((delay) => (
                        <span
                          key={delay}
                          className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${delay}ms` }}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Input bar */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                  <div className="flex-1 bg-surface-800/60 border border-surface-700 rounded-xl px-4 py-2.5 text-sm text-surface-500">
                    Ask about any government service...
                  </div>
                  <button className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center text-white shrink-0" aria-label="Send message">
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Popular Schemes ─────────────────────────────────────────────────── */}
      <Section
        id="schemes"
        title="Popular Government Schemes"
        subtitle="Explore the most accessed welfare schemes and check your eligibility instantly."
        badge="Welfare Schemes"
        className="bg-surface-900/50"
        center
        cta={
          <Link to="/schemes" className="btn-secondary">
            View All Schemes
            <ArrowRight size={16} />
          </Link>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {POPULAR_SCHEMES.map(({ name, category, benefit, color }) => (
            <Link
              key={name}
              to="/schemes"
              className="glass-card-hover p-5 flex flex-col gap-3 group"
              aria-label={`${name} - ${category}`}
            >
              <Badge variant={color === 'warning' ? 'warning' : color === 'navy' ? 'navy' : color}>
                {category}
              </Badge>
              <h3 className="font-display font-bold text-white group-hover:text-primary-300 transition-colors">
                {name}
              </h3>
              <p className="text-accent-400 font-semibold text-sm">{benefit}</p>
              <div className="flex items-center gap-1 text-primary-400 text-xs mt-auto">
                Check Eligibility <ChevronRight size={12} />
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* ── How It Works ───────────────────────────────────────────────────── */}
      <Section
        id="how-it-works"
        title="Simple as 1, 2, 3"
        subtitle="Getting government services has never been this easy."
        badge="How It Works"
        center
        className="bg-surface-950"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
          {[
            {
              step: '01',
              title: 'Create Account',
              desc: 'Sign up free with your Aadhaar or email. Verify your identity in under 2 minutes.',
              icon: Users,
            },
            {
              step: '02',
              title: 'Find Your Services',
              desc: 'Use AI chat, browse schemes, or directly report/track complaints from your dashboard.',
              icon: Bot,
            },
            {
              step: '03',
              title: 'Get Results',
              desc: 'Receive scheme benefits, complaint resolutions, and service updates — all tracked in one place.',
              icon: TrendingUp,
            },
          ].map(({ step, title, desc, icon: Icon }) => (
            <div key={step} className="relative text-center group">
              {/* Connector line */}
              <div className="hidden md:block absolute top-10 left-[calc(50%+40px)] right-0 h-px bg-gradient-to-r from-primary-500/50 to-transparent last:hidden" aria-hidden="true" />

              <div className="relative inline-flex mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-primary-500/30 flex items-center justify-center group-hover:border-primary-500/60 transition-colors">
                  <Icon size={32} className="text-primary-400" />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary-500 text-white text-xs font-bold flex items-center justify-center">
                  {step}
                </span>
              </div>
              <h3 className="font-display font-bold text-white text-xl mb-2">{title}</h3>
              <p className="text-surface-400 text-sm max-w-xs mx-auto">{desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Testimonials ───────────────────────────────────────────────────── */}
      <Section
        id="testimonials"
        title="Stories from Citizens"
        subtitle="Real experiences from real people across India."
        badge="Testimonials"
        className="bg-surface-900/50"
        center
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ name, location, text, rating, avatar }) => (
            <Card key={name} hover className="flex flex-col gap-4">
              {/* Stars */}
              <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
                {Array.from({ length: rating }).map((_, i) => (
                  <Star key={i} size={14} className="text-primary-400 fill-primary-400" aria-hidden="true" />
                ))}
              </div>
              <p className="text-surface-300 text-sm leading-relaxed flex-1">&quot;{text}&quot;</p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {avatar}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{name}</p>
                  <p className="text-surface-500 text-xs">{location}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* ── CTA Banner ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-surface-950 overflow-hidden" aria-label="Call to action">
        <div className="page-container">
          <div className="relative glass-card p-10 md:p-16 text-center overflow-hidden">
            <div className="gradient-orb w-96 h-96 bg-primary-500 -top-32 -right-32 opacity-20" aria-hidden="true" />
            <div className="gradient-orb w-64 h-64 bg-accent-500 -bottom-32 -left-32 opacity-20" aria-hidden="true" />
            <div className="relative">
              <span className="badge-accent mb-4 inline-flex">
                <Heart size={12} className="fill-accent-400" />
                Free for Every Citizen
              </span>
              <h2 className="section-title text-white mb-4">
                Start Your Journey to{' '}
                <span className="gradient-text">Better Services</span>
              </h2>
              <p className="section-subtitle mx-auto mb-8">
                Join 10 lakh+ citizens already using Smart Bharat AI to access government
                services with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/dashboard" className="btn-primary text-base px-8 py-4">
                  <LayoutDashboard size={20} />
                  Get Started Free
                  <ArrowRight size={16} />
                </Link>
                <Link to="/ai-assistant" className="btn-secondary text-base px-8 py-4">
                  <Bot size={20} />
                  Try AI Assistant
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
