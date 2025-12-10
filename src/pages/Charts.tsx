import { Link } from 'react-router-dom'
import { ChartsPanel } from '../components/ChartsPanel'
import { useAppStore } from '../state/store'
import { t } from '../i18n'

export function Charts() {
  const { state } = useAppStore()
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t(state.locale, 'chartsTitle')}</h1>
          <p className="text-sm text-slate-600">{t(state.locale, 'chartsSubtitle')}</p>
        </div>
        <Link
          to="/"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 hover:bg-slate-50"
        >
          {t(state.locale, 'back')}
        </Link>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <ChartsPanel data={state.measurements} locale={state.locale} />
      </div>
    </div>
  )
}

