export function formatDate(ts?: number | null) {
  if (!ts) return '—'
  return new Intl.DateTimeFormat(undefined, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(ts))
}

export function formatTime(ts?: number | null) {
  if (!ts) return '—'
  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(ts))
}

export function formatNumber(n: number, digits = 1) {
  return Number(n.toFixed(digits)).toString()
}

