import { memo } from 'react'

type Props = {
  volumeMl: number
  capacityMl: number
}

function BladderGraphicBase({ volumeMl, capacityMl }: Props) {
  const fillRatio = Math.min(Math.max(volumeMl / capacityMl, 0), 1)
  const pct = Math.round(fillRatio * 100)
  const color =
    pct >= 80 ? '#ef4444' : pct >= 60 ? '#f59e0b' : '#10b981'
  return (
    <div className="relative h-40 w-28 rounded-[48px] bg-slate-300 shadow-inner">
      <div
        className="absolute inset-x-1 bottom-1 rounded-[44px] bg-blue-500 transition-all duration-300"
        style={{ height: `${fillRatio * 100}%`, backgroundColor: color }}
      />
      <div className="absolute inset-0 flex items-center justify-center text-white font-semibold drop-shadow">
        {volumeMl} מ״ל
      </div>
    </div>
  )
}

export const BladderGraphic = memo(BladderGraphicBase)

