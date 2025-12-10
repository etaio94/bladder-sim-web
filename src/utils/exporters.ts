import type { Measurement } from '../types'

function triggerDownload(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function formatCsvValue(v: unknown) {
  if (v === null || v === undefined) return ''
  const s = String(v)
  if (s.includes(',') || s.includes('"')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

export function exportCsv(measurements: Measurement[]) {
  const headers = [
    'timestamp',
    'bladderVolumeMl',
    'fullnessPercent',
    'flowRateMlSec',
    'temperatureC',
    'ph',
    'hematuriaLevel',
    'leukocytesLevel',
    'ovulationIndex',
    'ovulationPeakEta',
    'flags',
  ]
  const rows = measurements.map((m) =>
    [
      m.timestamp,
      m.bladderVolumeMl,
      m.fullnessPercent,
      m.flowRateMlSec.toFixed(1),
      m.temperatureC.toFixed(1),
      m.ph.toFixed(1),
      m.hematuriaLevel,
      m.leukocytesLevel,
      m.ovulationIndex.toFixed(2),
      m.ovulationPeakEta ?? '',
      m.flags ?? '',
    ]
      .map(formatCsvValue)
      .join(','),
  )
  triggerDownload(
    'bladder_history.csv',
    [headers.join(','), ...rows].join('\n'),
    'text/csv',
  )
}

export function exportJson(measurements: Measurement[]) {
  triggerDownload(
    'bladder_history.json',
    JSON.stringify(measurements, null, 2),
    'application/json',
  )
}

