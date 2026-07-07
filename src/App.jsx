import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/navbar/Navbar'
import Footer from './components/footer/Footer'
import HomePage from './pages/HomePage'
import AIAssistantPage from './pages/AIAssistantPage'
import SchemesPage from './pages/SchemesPage'
import ReportComplaintPage from './pages/ReportComplaintPage'
import TrackComplaintPage from './pages/TrackComplaintPage'
import DashboardPage from './pages/DashboardPage'
import NotFoundPage from './pages/NotFoundPage'

// ── Scroll to top on route change ─────────────────────────────────────────────
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

// ── Page title manager ────────────────────────────────────────────────────────
function PageTitle() {
  const { pathname } = useLocation()
  useEffect(() => {
    const titles = {
      '/': 'Smart Bharat AI – Empowering Citizens',
      '/ai-assistant': 'AI Assistant – Smart Bharat AI',
      '/schemes': 'Government Schemes – Smart Bharat AI',
      '/report-complaint': 'Report Complaint – Smart Bharat AI',
      '/track-complaint': 'Track Complaint – Smart Bharat AI',
      '/dashboard': 'My Dashboard – Smart Bharat AI',
    }
    document.title = titles[pathname] || 'Smart Bharat AI'
  }, [pathname])
  return null
}

// ── Layout Wrapper ────────────────────────────────────────────────────────────
function AppLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] btn-primary text-sm px-4 py-2"
      >
        Skip to main content
      </a>
      <Navbar />
      <div id="main-content" className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <PageTitle />
        <AppLayout>
          <Routes>
            <Route path="/"                  element={<HomePage />} />
            <Route path="/ai-assistant"      element={<AIAssistantPage />} />
            <Route path="/schemes"           element={<SchemesPage />} />
            <Route path="/report-complaint"  element={<ReportComplaintPage />} />
            <Route path="/track-complaint"   element={<TrackComplaintPage />} />
            <Route path="/dashboard"         element={<DashboardPage />} />
            <Route path="*"                  element={<NotFoundPage />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </ThemeProvider>
  )
}
