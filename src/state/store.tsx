import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react'
import type {
  AppSettings,
  AppState,
  Measurement,
  SimulationStage,
} from '../types'

type Action =
  | { type: 'add-measurement'; payload: Measurement }
  | { type: 'set-flags'; payload: string[] }
  | { type: 'update-settings'; payload: Partial<AppSettings> }
  | { type: 'set-locale'; payload: 'he' | 'en' }
  | { type: 'reset-alerts' }
  | { type: 'set-alerts'; payload: { shown75?: boolean; shown85?: boolean } }
  | { type: 'set-simulation'; payload: SimulationStage }
  | { type: 'set-latest'; payload: Measurement }

type Store = {
  state: AppState
  addMeasurement: (m: Measurement) => void
  setFlags: (flags: string[]) => void
  updateSettings: (patch: Partial<AppSettings>) => void
  setLocale: (locale: 'he' | 'en') => void
  resetAlerts: () => void
  setAlerts: (patch: { shown75?: boolean; shown85?: boolean }) => void
  setSimulation: (stage: SimulationStage) => void
  setLatest: (m: Measurement) => void
}

const MAX_HISTORY = 500

const initialState: AppState = {
  measurements: [],
  latest: undefined,
  flags: [],
  locale: 'he',
  alerts: { shown75: false, shown85: false },
  simulation: 'idle',
  settings: {
    capacityMl: 600,
    simulateIntervalMs: 2500,
    emptyStepMs: 120,
  },
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'add-measurement': {
      const measurements = [...state.measurements, action.payload].slice(
        -MAX_HISTORY,
      )
      return {
        ...state,
        measurements,
        latest: action.payload,
      }
    }
    case 'set-flags':
      return { ...state, flags: action.payload }
    case 'update-settings':
      return { ...state, settings: { ...state.settings, ...action.payload } }
    case 'set-locale':
      return { ...state, locale: action.payload }
    case 'reset-alerts':
      return { ...state, alerts: { shown75: false, shown85: false } }
    case 'set-alerts':
      return {
        ...state,
        alerts: { ...state.alerts, ...action.payload },
      }
    case 'set-simulation':
      return { ...state, simulation: action.payload }
    case 'set-latest': {
      const measurements = [...state.measurements, action.payload].slice(
        -MAX_HISTORY,
      )
      return { ...state, latest: action.payload, measurements }
    }
    default:
      return state
  }
}

const AppContext = createContext<Store | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const addMeasurement = useCallback(
    (m: Measurement) => dispatch({ type: 'add-measurement', payload: m }),
    [],
  )
  const setFlags = useCallback(
    (flags: string[]) => dispatch({ type: 'set-flags', payload: flags }),
    [],
  )
  const updateSettings = useCallback(
    (patch: Partial<AppSettings>) =>
      dispatch({ type: 'update-settings', payload: patch }),
    [],
  )
  const setLocale = useCallback(
    (locale: 'he' | 'en') => dispatch({ type: 'set-locale', payload: locale }),
    [],
  )
  const resetAlerts = useCallback(
    () => dispatch({ type: 'reset-alerts' }),
    [],
  )
  const setAlerts = useCallback(
    (patch: { shown75?: boolean; shown85?: boolean }) =>
      dispatch({ type: 'set-alerts', payload: patch }),
    [],
  )
  const setSimulation = useCallback(
    (stage: SimulationStage) =>
      dispatch({ type: 'set-simulation', payload: stage }),
    [],
  )
  const setLatest = useCallback(
    (m: Measurement) => dispatch({ type: 'set-latest', payload: m }),
    [],
  )

  const value = useMemo(
    () => ({
      state,
      addMeasurement,
      setFlags,
      updateSettings,
      setLocale,
      resetAlerts,
      setAlerts,
      setSimulation,
      setLatest,
    }),
    [
      state,
      addMeasurement,
      setFlags,
      updateSettings,
      setLocale,
      resetAlerts,
      setAlerts,
      setSimulation,
      setLatest,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppStore() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppStore must be used within AppProvider')
  return ctx
}

