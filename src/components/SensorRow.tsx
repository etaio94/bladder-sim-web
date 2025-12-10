type Props = {
  label: string
  value: string
}

export function SensorRow({ label, value }: Props) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 py-1 text-sm">
      <span className="text-slate-600">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  )
}

