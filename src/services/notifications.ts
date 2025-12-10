import type { Measurement } from '../types'

export async function ensurePermission(): Promise<NotificationPermission> {
  if (typeof Notification === 'undefined') return 'denied'
  if (Notification.permission === 'granted') return 'granted'
  if (Notification.permission === 'denied') return 'denied'
  return Notification.requestPermission()
}

export function pushNotification(title: string, body: string) {
  if (typeof Notification === 'undefined') return
  if (Notification.permission !== 'granted') return
  new Notification(title, { body })
}

export function evaluateAlerts(m: Measurement) {
  if (m.fullnessPercent >= 45)
    pushNotification('התראה: מלאות שלפוחית', `מלאות עברה ${m.fullnessPercent}%`)
  if (m.hematuriaLevel >= 2)
    pushNotification('התראה: דם בשתן', 'רמה חריגה (סימולציה)')
  if (m.leukocytesLevel >= 2)
    pushNotification('התראה: לויקוציטים', 'רמה חריגה (סימולציה)')
  if (m.temperatureC > 38 || m.leukocytesLevel >= 2)
    pushNotification('חשד לדלקת שתן', 'מומלץ להתייעץ במציאות')
}

