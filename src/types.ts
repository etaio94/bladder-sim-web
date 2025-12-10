export type Measurement = {
  timestamp: number
  bladderVolumeMl: number
  fullnessPercent: number
  flowRateMlSec: number
  temperatureC: number
  ph: number
  hematuriaLevel: number
  leukocytesLevel: number
  ovulationIndex: number
  ovulationPeakEta?: number | null
  flags?: string
}

export type AppSettings = {
  capacityMl: number
  simulateIntervalMs: number
  emptyStepMs: number
}

export type AlertsState = {
  shown75: boolean
  shown85: boolean
}

export type SimulationStage =
  | 'idle'
  | 'to75'
  | 'wait-restroom'
  | 'to85'
  | 'auto-empty'

export type AppState = {
  measurements: Measurement[]
  latest?: Measurement
  flags: string[]
  settings: AppSettings
  locale: 'he' | 'en'
  alerts: AlertsState
  simulation: SimulationStage
}

