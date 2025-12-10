type Props = {
  flags: string[]
}

export function FlagsChips({ flags }: Props) {
  if (!flags.length) return null
  return (
    <div>
      <p className="text-sm text-slate-600 mb-2">התראות פעילות:</p>
      <div className="flex flex-wrap gap-2">
        {flags.map((f) => (
          <span
            key={f}
            className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200"
          >
            {f}
          </span>
        ))}
      </div>
    </div>
  )
}

