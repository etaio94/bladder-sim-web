import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BladderGraphic } from '../components/BladderGraphic'
import { FlagsChips } from '../components/FlagsChips'
import { FullnessBar } from '../components/FullnessBar'
import { Modal } from '../components/Modal'
import { SensorRow } from '../components/SensorRow'
import {
  animateToPercent,
  emptyBladderAnimated,
  measurementFromPercent,
} from '../services/simulation'
import { exportCsv, exportJson } from '../utils/exporters'
import { formatDate } from '../utils/format'
import { t } from '../i18n'
import { useAppStore } from '../state/store'

export function Dashboard() {
  const {
    state,
    addMeasurement,
    setFlags,
    resetAlerts,
    setAlerts,
    setSimulation,
    setLatest,
  } = useAppStore()
  const nav = useNavigate()
  const latest = state.latest
  const [show75, setShow75] = useState(false)
  const [show85, setShow85] = useState(false)
  const [lockOk, setLockOk] = useState(false)
  const to85Started = useRef(false)
  const flags = useMemo(
    () =>
      latest?.flags
        ? latest.flags.split(',').filter(Boolean)
        : state.flags ?? [],
    [latest, state.flags],
  )

  useEffect(() => {
    if (!latest) return
    if (latest.fullnessPercent < 50) {
      resetAlerts()
    }
    if (latest.fullnessPercent >= 85 && !state.alerts.shown85) {
      setAlerts({ shown85: true, shown75: true })
      setShow85(true)
      setTimeout(async () => {
        setShow85(false)
        await handleEmpty()
        setSimulation('idle')
      }, 10000)
    } else if (latest.fullnessPercent >= 75 && !state.alerts.shown75) {
      setAlerts({ shown75: true })
      setShow75(true)
    }
  }, [latest, state.alerts.shown75, state.alerts.shown85, resetAlerts, setAlerts, setSimulation])

  const handleEmpty = async () => {
    await emptyBladderAnimated({
      latest,
      capacityMl: state.settings.capacityMl,
      stepMs: state.settings.emptyStepMs,
      onEmit: (m, f) => {
        addMeasurement(m)
        setFlags(f)
      },
    })
    resetAlerts()
    setSimulation('idle')
  }

  const handleExportCsv = () => exportCsv(state.measurements)
  const handleExportJson = () => exportJson(state.measurements)

  const handleEditPercent = (current: number) => {
    const input = window.prompt(t(state.locale, 'editPrompt'), String(current))
    if (!input) return
    const next = Math.min(100, Math.max(0, Number(input)))
    const m = measurementFromPercent(next, state.settings.capacityMl, latest)
    setLatest(m)
    setFlags(m.flags?.split(',').filter(Boolean) ?? [])
  }

  const runSimulation = async () => {
    if (!latest) return
    setSimulation('to75')
    resetAlerts()
    setLockOk(true)
    const start = measurementFromPercent(60, state.settings.capacityMl, latest)
    setLatest(start)
    await animateToPercent({
      from: 60,
      to: 75,
      durationMs: 10000,
      capacityMl: state.settings.capacityMl,
      prev: latest,
      onEmit: (m, f) => {
        setLatest(m)
        setFlags(f)
      },
    })
    setSimulation('wait-restroom')
    setShow75(true)
  }

  const continueAfterRestroom = async () => {
    if (to85Started.current) return
    setSimulation('to85')
    to85Started.current = true
    await animateToPercent({
      from: 75,
      to: 85,
      durationMs: 7500,
      capacityMl: state.settings.capacityMl,
      prev: latest,
      onEmit: (m, f) => {
        setLatest(m)
        setFlags(f)
      },
    })
    setSimulation('auto-empty')
    setLockOk(false)
    setShow85(true)
    setAlerts({ shown85: true, shown75: true })
    setTimeout(async () => {
      setShow85(false)
      await handleEmpty()
      setSimulation('idle')
      to85Started.current = false
    }, 10000)
  }

  useEffect(() => {
    if (state.simulation === 'to85') {
      continueAfterRestroom()
    }
  }, [state.simulation])

  return (
    <div className="space-y-4">
      {latest ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 lg:p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div className="text-base font-semibold text-slate-900">
                {t(state.locale, 'dashboardTitle')}
              </div>
              <div className="text-xs text-slate-500 shrink-0">
                {latest
                  ? `${t(state.locale, 'updated')} ${formatDate(latest.timestamp)}`
                  : t(state.locale, 'waiting')}
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 px-3 py-2">
              <p className="text-sm text-slate-600 mb-1">{t(state.locale, 'quickView')}</p>
              <div className="text-lg font-bold text-slate-900">
                {latest.fullnessPercent}% {t(state.locale, 'fullness')}
              </div>
              <p className="text-xs text-slate-600">
                {t(state.locale, 'capacity')}: {latest.bladderVolumeMl} / {state.settings.capacityMl} מ״ל
              </p>
            </div>
            <FullnessBar
              percent={latest.fullnessPercent}
              label={t(state.locale, 'fullness')}
              onEdit={handleEditPercent}
            />
            <div className="flex gap-6">
              <BladderGraphic
                volumeMl={latest.bladderVolumeMl}
                capacityMl={state.settings.capacityMl}
              />
              <div className="flex-1 space-y-1">
                <SensorRow
                  label={t(state.locale, 'temperature')}
                  value={`${latest.temperatureC.toFixed(1)}${state.locale === 'en' ? ' °C' : ' °C'}`}
                />
                <SensorRow label={t(state.locale, 'ph')} value={latest.ph.toFixed(1)} />
                <SensorRow label={t(state.locale, 'hematuria')} value={`${latest.hematuriaLevel}`} />
                <SensorRow
                  label={t(state.locale, 'leukocytes')}
                  value={`${latest.leukocytesLevel}`}
                />
                <SensorRow
                  label={t(state.locale, 'flow')}
                  value={
                    state.locale === 'en'
                      ? `${latest.flowRateMlSec.toFixed(1)} ml/s`
                      : `${latest.flowRateMlSec.toFixed(1)} מ״ל/שנ׳`
                  }
                />
                <SensorRow
                  label={t(state.locale, 'ovIndex')}
                  value={`${latest.ovulationIndex.toFixed(2)}`}
                />
                <SensorRow
                  label={t(state.locale, 'ovEta')}
                  value={
                    latest.ovulationPeakEta
                      ? state.locale === 'en'
                        ? new Intl.DateTimeFormat('en-GB').format(new Date(latest.ovulationPeakEta))
                        : formatDate(latest.ovulationPeakEta)
                      : '—'
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
              <button
                onClick={handleEmpty}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-white shadow hover:bg-emerald-700"
              >
                {t(state.locale, 'empty')}
              </button>
              <button
                onClick={() => {
                  if (state.simulation === 'wait-restroom') continueAfterRestroom()
                  nav('/restrooms')
                }}
                className="rounded-lg border border-slate-300 px-4 py-2 text-slate-800 hover:bg-slate-50"
              >
                {t(state.locale, 'nearby')}
              </button>
              <button
                onClick={() => nav('/history')}
                className="rounded-lg border border-slate-300 px-4 py-2 text-slate-800 hover:bg-slate-50"
              >
                {t(state.locale, 'history')}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
              <button
                onClick={() => nav('/charts')}
                className="rounded-lg border border-slate-300 px-4 py-2 text-slate-800 hover:bg-slate-50"
              >
                {t(state.locale, 'charts')}
              </button>
              <button
                onClick={() => nav('/stats')}
                className="rounded-lg border border-slate-300 px-4 py-2 text-slate-800 hover:bg-slate-50"
              >
                {t(state.locale, 'stats')}
              </button>
              <button
                onClick={() => nav('/settings')}
                className="rounded-lg border border-slate-300 px-4 py-2 text-slate-800 hover:bg-slate-50"
              >
                {t(state.locale, 'settings')}
              </button>
              <button
                onClick={() => nav('/about')}
                className="rounded-lg border border-slate-300 px-4 py-2 text-slate-800 hover:bg-slate-50"
              >
                {t(state.locale, 'about')}
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleExportCsv}
                className="rounded-lg border border-slate-300 px-4 py-2 text-slate-800 hover:bg-slate-50"
              >
                {t(state.locale, 'exportCsv')}
              </button>
              <button
                onClick={handleExportJson}
                className="rounded-lg border border-slate-300 px-4 py-2 text-slate-800 hover:bg-slate-50"
              >
                {t(state.locale, 'exportJson')}
              </button>
            </div>

            <FlagsChips flags={flags} />
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          {t(state.locale, 'waiting')}
        </div>
      )}

      <button
        onClick={runSimulation}
        className="w-full rounded-lg bg-purple-600 px-4 py-3 text-white shadow hover:bg-purple-700"
      >
        {t(state.locale, 'startSimulation')}
      </button>

      {show75 && (
        <Modal
          title={t(state.locale, 'criticalTitle')}
          body={t(state.locale, 'criticalBody')}
          actions={
            <>
              <button
                className="rounded-lg bg-blue-600 px-3 py-2 text-white disabled:opacity-50"
                onClick={() => {
                  setShow75(false)
                  if (state.simulation === 'wait-restroom') {
                    setSimulation('to85')
                  }
                }}
                disabled={lockOk && state.simulation === 'wait-restroom'}
              >
                {t(state.locale, 'ok')}
              </button>
              <button
                className="rounded-lg border border-slate-300 px-3 py-2 text-slate-800"
                onClick={() => {
                  setShow75(false)
                  nav('/restrooms')
                }}
              >
                {t(state.locale, 'goBathrooms')}
              </button>
            </>
          }
        />
      )}

      {show85 && (
        <Modal
          title={t(state.locale, 'critical85Title')}
          body={t(state.locale, 'critical85Body')}
          actions={
            <>
              <button
                className="rounded-lg bg-blue-600 px-3 py-2 text-white"
                onClick={() => setShow85(false)}
              >
                {t(state.locale, 'ok')}
              </button>
            </>
          }
        />
      )}
    </div>
  )
}
