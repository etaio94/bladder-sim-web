import { useEffect } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { History } from './pages/History'
import { Charts } from './pages/Charts'
import { Stats } from './pages/Stats'
import { Settings } from './pages/Settings'
import { About } from './pages/About'
import { Restrooms } from './pages/Restrooms'
import { measurementFromPercent } from './services/simulation'
import { useAppStore } from './state/store'
import { t } from './i18n'
import './App.css'

function App() {
  const { state, setLatest, setLocale } = useAppStore()

  useEffect(() => {
    if (!state.latest) {
      const base = measurementFromPercent(60, state.settings.capacityMl)
      setLatest(base)
    }
  }, [state.latest, state.settings.capacityMl, setLatest])

  return (
    <div className="min-h-screen px-4 py-6 lg:px-8">
      <header className="mb-6 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold text-slate-900">
          TIKI100 - Demo App
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <nav className="flex flex-wrap gap-3">
            <Link
              className="text-slate-700 hover:text-slate-900"
              to="/history"
            >
              {t(state.locale, 'history')}
            </Link>
            <Link className="text-slate-700 hover:text-slate-900" to="/charts">
              {t(state.locale, 'charts')}
            </Link>
            <Link className="text-slate-700 hover:text-slate-900" to="/stats">
              {t(state.locale, 'stats')}
            </Link>
            <Link
              className="text-slate-700 hover:text-slate-900"
              to="/settings"
            >
              {t(state.locale, 'settings')}
            </Link>
            <Link className="text-slate-700 hover:text-slate-900" to="/about">
              {t(state.locale, 'about')}
            </Link>
            <Link
              className="text-slate-700 hover:text-slate-900"
              to="/restrooms"
            >
              {t(state.locale, 'nearby')}
            </Link>
          </nav>
          <button
            onClick={() => setLocale(state.locale === 'he' ? 'en' : 'he')}
            className="rounded-lg border border-slate-300 px-3 py-1 text-slate-800 hover:bg-slate-50"
          >
            {t(state.locale, 'langToggle')}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/charts" element={<Charts />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
          <Route path="/restrooms" element={<Restrooms />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
