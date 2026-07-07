# 🇮🇳 Smart Bharat AI

> AI-Powered Citizen Services for Digital India

[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=white)](https://reactjs.org)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Firebase](https://img.shields.io/badge/Firebase-10.x-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)

---

## ✨ Features

| Feature | Status |
|---|---|
| 🏠 Responsive Landing Page | ✅ Complete |
| 🤖 AI Assistant (Gemini) | ✅ UI Ready |
| 📋 Government Schemes Explorer | ✅ Complete |
| 🚨 Complaint Reporting (4-step) | ✅ Complete |
| 📊 Complaint Tracking + Timeline | ✅ Complete |
| 🗂️ Citizen Dashboard | ✅ Complete |
| 🌙 Dark/Light Theme Toggle | ✅ Complete |
| 📱 Fully Responsive (Mobile First) | ✅ Complete |
| ♿ Accessibility (ARIA, skip links) | ✅ Complete |
| 🔥 Firebase Auth/Firestore Placeholders | ✅ Ready |
| 🤖 Gemini AI API Placeholders | ✅ Ready |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your:
- **Firebase** project credentials (from Firebase Console → Project Settings)
- **Gemini API Key** (from [Google AI Studio](https://makersuite.google.com/app/apikey))

### 3. Start Development Server

```bash
npm run dev
```

Opens at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
npm run preview  # preview production build locally
```

---

## 📁 Project Structure

```
smart-bharat-ai/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/icons/          # SVG icons, images
│   ├── components/
│   │   ├── navbar/
│   │   │   └── Navbar.jsx     # Sticky responsive navigation
│   │   ├── footer/
│   │   │   └── Footer.jsx     # Multi-column footer
│   │   └── ui/
│   │       ├── Button.jsx     # Polymorphic button
│   │       ├── Card.jsx       # Glass card + sub-components
│   │       ├── Badge.jsx      # Status badges
│   │       ├── Input.jsx      # Accessible form input
│   │       ├── LoadingSpinner.jsx
│   │       └── PageSections.jsx  # PageHeader, Section, StatCard, FeatureCard
│   ├── context/
│   │   ├── AuthContext.jsx    # Firebase auth state
│   │   └── ThemeContext.jsx   # Dark/light theme
│   ├── hooks/
│   │   └── useUtils.js        # Custom hooks
│   ├── pages/
│   │   ├── HomePage.jsx       # Landing + hero
│   │   ├── AIAssistantPage.jsx # Chat interface
│   │   ├── SchemesPage.jsx    # Searchable schemes
│   │   ├── ReportComplaintPage.jsx  # 4-step form
│   │   ├── TrackComplaintPage.jsx   # Timeline tracker
│   │   ├── DashboardPage.jsx  # Citizen dashboard
│   │   └── NotFoundPage.jsx   # 404
│   ├── services/
│   │   ├── firebase.js        # Firebase init
│   │   ├── auth.js            # Auth service
│   │   └── gemini.js          # Gemini AI service
│   ├── utils/
│   │   ├── constants.js       # App-wide constants
│   │   └── helpers.js         # Utility functions
│   ├── App.jsx                # Router + layout
│   ├── main.jsx               # React DOM root
│   └── index.css              # Global styles + Tailwind
├── .env.example               # Environment template
├── .eslintrc.cjs              # ESLint config
├── .gitignore
├── index.html                 # HTML entry + SEO meta
├── package.json
├── postcss.config.js
├── tailwind.config.js         # Custom design system
├── vite.config.js             # Vite + path aliases
└── vercel.json                # SPA routing for Vercel
```

---

## 🔧 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 + Custom CSS |
| Routing | React Router DOM v6 |
| Icons | Lucide React |
| Backend | Firebase (Auth + Firestore + Storage) |
| AI | Google Gemini API |
| Deployment | Vercel |

---

## 🌐 Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import repo in [Vercel Dashboard](https://vercel.com/new)
3. Add environment variables from `.env.example`
4. Deploy!

The `vercel.json` handles SPA routing automatically.

---

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_GEMINI_API_KEY` | Google Gemini API key |
| `VITE_APP_NAME` | App display name |

See `.env.example` for all variables.

---

## 📞 Support

For queries, open an issue or contact the development team.

---

*Built with ❤️ for Digital India 🇮🇳*
