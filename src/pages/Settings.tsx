import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ensurePermission } from '../services/notifications'
import { useAppStore } from '../state/store'
import { t } from '../i18n'

export function Settings() {
  const { state, updateSettings } = useAppStore()
  const [capacity, setCapacity] = useState(state.settings.capacityMl)
  const [intervalMs, setIntervalMs] = useState(state.settings.simulateIntervalMs)

  const save = () => {
    updateSettings({ capacityMl: capacity, simulateIntervalMs: intervalMs })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {t(state.locale, 'settingsTitle')}
          </h1>
          <p className="text-sm text-slate-600">
            {t(state.locale, 'settingsSubtitle')}
          </p>
        </div>
        <Link
          to="/"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 hover:bg-slate-50"
        >
          {t(state.locale, 'back')}
        </Link>
      </div>

      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="space-y-1">
          <label className="text-sm text-slate-700">
            {t(state.locale, 'capacityLabel')}
          </label>
          <input
            type="number"
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            min={200}
            max={1200}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-slate-700">
            {t(state.locale, 'intervalLabel')}
          </label>
          <input
            type="number"
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={intervalMs}
            onChange={(e) => setIntervalMs(Number(e.target.value))}
            min={500}
            max={10000}
            step={100}
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={save}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
          >
            {t(state.locale, 'save')}
          </button>
          <button
            onClick={() => ensurePermission()}
            className="rounded-lg border border-slate-300 px-4 py-2 text-slate-800 hover:bg-slate-50"
          >
            {t(state.locale, 'requestNotifs')}
          </button>
        </div>
      </div>
    </div>
  )
}

