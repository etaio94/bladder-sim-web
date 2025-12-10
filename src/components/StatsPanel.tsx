import type { Measurement } from '../types'
import { SensorRow } from './SensorRow'
import { t } from '../i18n'

type Props = {
  title: string
  data: Measurement[]
  locale: 'he' | 'en'
}

export function StatsPanel({ title, data, locale }: Props) {
  const avg = (selector: (m: Measurement) => number, digits = 1) => {
    if (!data.length) return '—'
    const v =
      data.map(selector).reduce((sum, curr) => sum + curr, 0) / data.length
    return v.toFixed(digits)
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <div className="mt-3 space-y-1">
        <SensorRow
          label={t(locale, 'avgVolume')}
          value={`${avg((m) => m.bladderVolumeMl, 0)} מ״ל`}
        />
        <SensorRow
          label={t(locale, 'avgFullness')}
          value={`${avg((m) => m.fullnessPercent, 0)}%`}
        />
        <SensorRow
          label={t(locale, 'avgTemp')}
          value={`${avg((m) => m.temperatureC)} °C`}
        />
        <SensorRow label={t(locale, 'avgPh')} value={`${avg((m) => m.ph)}`} />
        <SensorRow
          label={t(locale, 'avgLeu')}
          value={avg((m) => m.leukocytesLevel, 1)}
        />
        <SensorRow
          label={t(locale, 'avgHem')}
          value={avg((m) => m.hematuriaLevel, 1)}
        />
      </div>
    </div>
  )
}

