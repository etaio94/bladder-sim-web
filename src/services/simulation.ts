import type { Measurement } from '../types'

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max)
}

function drift(
  prev: number,
  step: number,
  min: number,
  max: number,
  noise: number = 0.5,
) {
  const delta = step + (Math.random() - 0.5) * noise
  return clamp(prev + delta, min, max)
}

function buildFlags(m: Measurement): string[] {
  const flags: string[] = []
  if (m.fullnessPercent >= 60) flags.push('מלאות גבוהה')
  if (m.hematuriaLevel >= 2) flags.push('דם בשתן (סימולציה)')
  if (m.leukocytesLevel >= 2) flags.push('לויקוציטים (סימולציה)')
  if (m.temperatureC > 38 || m.leukocytesLevel >= 2)
    flags.push('חשד לדלקת (סימולציה)')
  return flags
}

export function generateMeasurement(
  prev: Measurement | undefined,
  capacityMl: number,
): Measurement {
  if (!prev) {
    const volume = 360 + Math.random() * 120
    return {
      timestamp: Date.now(),
      bladderVolumeMl: Math.round(volume),
      fullnessPercent: Math.round((volume / capacityMl) * 100),
      flowRateMlSec: 0,
      temperatureC: 36.7 + Math.random() * 0.5,
      ph: 6 + Math.random(),
      hematuriaLevel: 0,
      leukocytesLevel: 0,
      ovulationIndex: Number((Math.random() * 0.5 + 0.5).toFixed(2)),
      ovulationPeakEta: Date.now() + 1000 * 60 * 60 * 24 * 3,
      flags: '',
    }
  }

  const fill = Math.random() * 16 // 0..16 ml per tick
  const leakBase = Math.random() * 8 // baseline leak 0..8
  const extraLeak =
    prev.fullnessPercent >= 80
      ? 8 + Math.random() * 8 // drain faster when very full
      : prev.fullnessPercent >= 60
        ? 4 + Math.random() * 6
        : 0
  const volume = clamp(
    prev.bladderVolumeMl + fill - (leakBase + extraLeak),
    80,
    capacityMl,
  )
  const fullnessPercent = Math.round((volume / capacityMl) * 100)
  const flowRateMlSec = drift(prev.flowRateMlSec, -0.5, 0, 6)
  const temperatureC = drift(prev.temperatureC, 0.05, 36.5, 38.6, 0.15)
  const ph = drift(prev.ph, 0.05, 5.5, 7.5, 0.2)
  const hematuriaLevel = clamp(
    Math.random() > 0.95 ? prev.hematuriaLevel + 1 : prev.hematuriaLevel - 1,
    0,
    3,
  )
  const leukocytesLevel = clamp(
    Math.random() > 0.9 ? prev.leukocytesLevel + 1 : prev.leukocytesLevel - 1,
    0,
    3,
  )
  const ovulationIndex = clamp(
    prev.ovulationIndex + (Math.random() - 0.5) * 0.05,
    0,
    1.2,
  )
  const ovulationPeakEta =
    prev.ovulationPeakEta || Date.now() + 1000 * 60 * 60 * 24 * 2

  const m: Measurement = {
    timestamp: Date.now(),
    bladderVolumeMl: Math.round(volume),
    fullnessPercent,
    flowRateMlSec: Number(flowRateMlSec.toFixed(1)),
    temperatureC: Number(temperatureC.toFixed(1)),
    ph: Number(ph.toFixed(1)),
    hematuriaLevel,
    leukocytesLevel,
    ovulationIndex: Number(ovulationIndex.toFixed(2)),
    ovulationPeakEta,
    flags: '',
  }

  const flags = buildFlags(m)
  m.flags = flags.join(',')
  return m
}

export function startSimulation(opts: {
  capacityMl: number
  intervalMs: number
  onEmit: (m: Measurement, flags: string[]) => void
  seed?: Measurement
}) {
  const { capacityMl, intervalMs, onEmit, seed } = opts
  let latest: Measurement | undefined = seed
  const tick = () => {
    latest = generateMeasurement(latest, capacityMl)
    const flags = buildFlags(latest)
    latest.flags = flags.join(',')
    onEmit(latest, flags)
  }
  tick()
  const id = setInterval(tick, intervalMs)
  return () => clearInterval(id)
}

export async function emptyBladderAnimated(opts: {
  latest: Measurement | undefined
  capacityMl: number
  stepMs: number
  onEmit: (m: Measurement, flags: string[]) => void
}) {
  const { latest, capacityMl, stepMs, onEmit } = opts
  if (!latest) return
  const minVol = Math.max(1, Math.round(capacityMl * 0.1))
  const maxVol = Math.max(minVol + 1, Math.round(capacityMl * 0.2))
  const targetVol = Math.min(maxVol, Math.max(minVol, Math.round(capacityMl * 0.15)))
  let vol = latest.bladderVolumeMl
  while (vol > targetVol) {
    vol = Math.floor(vol - Math.max(10, vol * 0.15))
    const m: Measurement = {
      ...latest,
      bladderVolumeMl: vol,
      fullnessPercent: Math.round((vol / capacityMl) * 100),
      flowRateMlSec: 0,
      timestamp: Date.now(),
    }
    const flags = buildFlags(m)
    m.flags = flags.join(',')
    onEmit(m, flags)
    await new Promise((res) => setTimeout(res, stepMs))
  }
}

export function measurementFromPercent(
  percent: number,
  capacityMl: number,
  prev?: Measurement,
): Measurement {
  const volume = Math.round((capacityMl * percent) / 100)
  const base: Measurement =
    prev ?? {
      timestamp: Date.now(),
      bladderVolumeMl: volume,
      fullnessPercent: percent,
      flowRateMlSec: 0,
      temperatureC: 36.8,
      ph: 6.2,
      hematuriaLevel: 0,
      leukocytesLevel: 0,
      ovulationIndex: 0.6,
      ovulationPeakEta: Date.now() + 1000 * 60 * 60 * 24 * 3,
      flags: '',
    }
  const m: Measurement = {
    ...base,
    timestamp: Date.now(),
    bladderVolumeMl: volume,
    fullnessPercent: percent,
  }
  const flags = buildFlags(m)
  m.flags = flags.join(',')
  return m
}

export async function animateToPercent(opts: {
  from: number
  to: number
  durationMs: number
  capacityMl: number
  prev?: Measurement
  onEmit: (m: Measurement, flags: string[]) => void
}) {
  const { from, to, durationMs, capacityMl, prev, onEmit } = opts
  const steps = Math.max(5, Math.floor(durationMs / 250))
  const delta = (to - from) / steps
  let current = from
  for (let i = 0; i < steps; i++) {
    current = current + delta
    const percent = Math.round(current)
    const m = measurementFromPercent(percent, capacityMl, prev)
    const flags = m.flags?.split(',').filter(Boolean) ?? []
    onEmit(m, flags)
    await new Promise((res) => setTimeout(res, durationMs / steps))
  }
}

