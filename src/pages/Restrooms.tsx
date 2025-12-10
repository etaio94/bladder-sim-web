import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { t } from '../i18n'
import { useAppStore } from '../state/store'
import type { LatLngExpression, Icon } from 'leaflet'

// Fix default marker icons for Leaflet in Vite (ensure only once)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

let iconsPatched = false
let defaultIcon: Icon | null = null
function patchIcons() {
  if (iconsPatched) return
  defaultIcon = new L.Icon({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })
  iconsPatched = true
}

const MOCK_RESTROOMS = {
  he: [
    {
      name: 'קניון מרכזי',
      distance: '350 מ׳',
      eta: '4 דק׳',
      open: 'פתוח',
      position: { lat: 32.0853, lng: 34.7818 },
    },
    {
      name: 'תחנת דלק',
      distance: '620 מ׳',
      eta: '8 דק׳',
      open: 'פתוח',
      position: { lat: 32.0865, lng: 34.7782 },
    },
    {
      name: 'ספרייה עירונית',
      distance: '1.1 ק״מ',
      eta: '14 דק׳',
      open: 'סגור',
      position: { lat: 32.0825, lng: 34.7845 },
    },
  ],
  en: [
    {
      name: 'Central Mall',
      distance: '350 m',
      eta: '4 min',
      open: 'Open',
      position: { lat: 32.0853, lng: 34.7818 },
    },
    {
      name: 'Gas Station',
      distance: '620 m',
      eta: '8 min',
      open: 'Open',
      position: { lat: 32.0865, lng: 34.7782 },
    },
    {
      name: 'City Library',
      distance: '1.1 km',
      eta: '14 min',
      open: 'Closed',
      position: { lat: 32.0825, lng: 34.7845 },
    },
  ],
}

export function Restrooms() {
  const { state, setSimulation } = useAppStore()
  const nav = useNavigate()
  const [ready, setReady] = useState(false)
  useEffect(() => {
    patchIcons()
    setReady(true)
  }, [])
  const list = state.locale === 'en' ? MOCK_RESTROOMS.en : MOCK_RESTROOMS.he
  const center: LatLngExpression = list[0].position
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {t(state.locale, 'restroomsTitle')}
          </h1>
          <p className="text-sm text-slate-600">
            {t(state.locale, 'restroomsSubtitle')}
          </p>
        </div>
        <button
          onClick={() => {
            if (state.simulation === 'wait-restroom') {
              setSimulation('to85')
            }
            nav('/')
          }}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 hover:bg-slate-50"
        >
          {t(state.locale, 'back')}
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-3 lg:p-4 shadow-sm space-y-4">
        <div className="h-80 w-full overflow-hidden rounded-xl ring-1 ring-slate-200 bg-slate-50">
          {ready ? (
            <MapContainer
              center={center}
              zoom={15}
              scrollWheelZoom={false}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {list.map((r) => (
                <Marker
                  key={r.name}
                  position={r.position as LatLngExpression}
                  icon={defaultIcon ?? undefined}
                >
                  <Popup>
                    <div className="space-y-1">
                      <div className="font-semibold">{r.name}</div>
                      <div className="text-sm">
                        {r.distance} · {r.eta} · {r.open}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              {t(state.locale, 'waiting')}
            </div>
          )}
        </div>
        <div className="space-y-2">
          {list.map((r) => (
            <div
              key={r.name}
              className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2"
            >
              <div>
                <div className="font-semibold text-slate-900">{r.name}</div>
                <div className="text-sm text-slate-600">
                  {r.distance} · {r.eta}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-emerald-700">{r.open}</span>
                <button className="text-sm text-blue-600 underline underline-offset-4">
                  {t(state.locale, 'navigate')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

