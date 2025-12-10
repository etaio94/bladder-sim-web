import { Link } from 'react-router-dom'
import { ChartsPanel } from '../components/ChartsPanel'
import { StatsPanel } from '../components/StatsPanel'
import { useAppStore } from '../state/store'
import { t } from '../i18n'

export function Stats() {
  const { state } = useAppStore()
  const now = Date.now()
  const weekStart = now - 7 * 24 * 3600 * 1000
  const monthStart = now - 30 * 24 * 3600 * 1000
  const weekData = state.measurements.filter((m) => m.timestamp >= weekStart)
  const monthData = state.measurements.filter((m) => m.timestamp >= monthStart)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {t(state.locale, 'statsTitle')}
          </h1>
          <p className="text-sm text-slate-600">{t(state.locale, 'statsSubtitle')}</p>
        </div>
        <Link
          to="/"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 hover:bg-slate-50"
        >
          {t(state.locale, 'back')}
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <StatsPanel title={t(state.locale, 'statsWeekly')} data={weekData} locale={state.locale} />
        <StatsPanel title={t(state.locale, 'statsMonthly')} data={monthData} locale={state.locale} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-600 mb-3">{t(state.locale, 'quickCharts')}</p>
        <ChartsPanel data={state.measurements} compact locale={state.locale} />
      </div>
    </div>
  )
}

