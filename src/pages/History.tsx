import { Link } from 'react-router-dom'
import { useAppStore } from '../state/store'
import { formatDate, formatTime } from '../utils/format'
import { t } from '../i18n'

export function History() {
  const { state } = useAppStore()
  const list = [...state.measurements].reverse()
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {t(state.locale, 'historyTitle')}
          </h1>
          <p className="text-sm text-slate-600">
            {t(state.locale, 'historySubtitle')}
          </p>
        </div>
        <Link
          to="/"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 hover:bg-slate-50"
        >
          {t(state.locale, 'back')}
        </Link>
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-3 py-2">{t(state.locale, 'tableTime')}</th>
              <th className="px-3 py-2">{t(state.locale, 'tableVolume')}</th>
              <th className="px-3 py-2">{t(state.locale, 'tableFullness')}</th>
              <th className="px-3 py-2">{t(state.locale, 'tableTemp')}</th>
              <th className="px-3 py-2">{t(state.locale, 'tablePh')}</th>
              <th className="px-3 py-2">{t(state.locale, 'tableHem')}</th>
              <th className="px-3 py-2">{t(state.locale, 'tableLeu')}</th>
            </tr>
          </thead>
          <tbody>
            {list.map((m) => (
              <tr key={m.timestamp} className="border-t border-slate-100">
                <td className="px-3 py-2 text-slate-700">
                  {formatDate(m.timestamp)} {formatTime(m.timestamp)}
                </td>
                <td className="px-3 py-2">{m.bladderVolumeMl}</td>
                <td className="px-3 py-2">{m.fullnessPercent}%</td>
                <td className="px-3 py-2">{m.temperatureC.toFixed(1)}</td>
                <td className="px-3 py-2">{m.ph.toFixed(1)}</td>
                <td className="px-3 py-2">{m.hematuriaLevel}</td>
                <td className="px-3 py-2">{m.leukocytesLevel}</td>
              </tr>
            ))}
            {!list.length && (
              <tr>
                <td
                  colSpan={7}
                  className="px-3 py-6 text-center text-slate-500"
                >
                  {t(state.locale, 'noRows')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

