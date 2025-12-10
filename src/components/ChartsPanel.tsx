import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent'
import type { Measurement } from '../types'
import { formatTime } from '../utils/format'
import { t } from '../i18n'

type Props = {
  data: Measurement[]
  compact?: boolean
  locale?: 'he' | 'en'
}

const colors = {
  volume: '#2563eb',
  fullness: '#10b981',
  temp: '#ef4444',
  leu: '#a855f7',
  hem: '#06b6d4',
}

export function ChartsPanel({ data, compact = false, locale = 'he' }: Props) {
  if (!data.length)
    return <p className="text-sm text-slate-500">{t(locale, 'noData')}</p>
  const heightMain = compact ? 200 : 280
  const heightSecondary = compact ? 180 : 240

  return (
    <div className="space-y-6">
      <div className="w-full" style={{ height: heightMain }}>
        <ResponsiveContainer width="100%" height={heightMain}>
          <LineChart data={data} margin={{ left: -10, right: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(ts) => formatTime(Number(ts))}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(ts) => formatTime(Number(ts))}
              formatter={(v: ValueType, name: NameType) => [
                String(v),
                name as string,
              ]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="bladderVolumeMl"
              name={t(locale, 'legendVolume')}
              stroke={colors.volume}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="fullnessPercent"
              name={t(locale, 'legendFullness')}
              stroke={colors.fullness}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="temperatureC"
              name={t(locale, 'legendTemp')}
              stroke={colors.temp}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full" style={{ height: heightSecondary }}>
        <ResponsiveContainer width="100%" height={heightSecondary}>
          <LineChart data={data} margin={{ left: -10, right: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(ts) => formatTime(Number(ts))}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(ts) => formatTime(Number(ts))}
              formatter={(v: ValueType, name: NameType) => [
                String(v),
                name as string,
              ]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="leukocytesLevel"
              name={t(locale, 'legendLeu')}
              stroke={colors.leu}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="hematuriaLevel"
              name={t(locale, 'legendHem')}
              stroke={colors.hem}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

