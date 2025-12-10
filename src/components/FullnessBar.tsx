type Props = {
  percent: number
  label: string
  onEdit?: (next: number) => void
}

export function FullnessBar({ percent, label, onEdit }: Props) {
  const pct = Math.min(Math.max(percent, 0), 100)
  const color =
    pct >= 80 ? 'bg-red-500' : pct >= 60 ? 'bg-amber-400' : 'bg-emerald-500'
  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
        <span>{label}</span>
        <button
          type="button"
          className="text-slate-900 font-semibold underline underline-offset-4"
          onClick={() => onEdit && onEdit(pct)}
        >
          {pct}%
        </button>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full ${color} transition-all duration-300`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

