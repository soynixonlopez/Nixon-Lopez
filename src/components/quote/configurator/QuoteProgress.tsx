'use client'

import { STEP_LABELS, TOTAL_STEPS } from '@/lib/quote-configurator'

type Props = {
  step: number
}

export function QuoteProgress({ step }: Props) {
  const pct = Math.min(100, Math.max(0, (step / TOTAL_STEPS) * 100))

  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-900">
          Paso {step} de {TOTAL_STEPS}
          <span className="ml-1.5 font-normal text-slate-500">· {STEP_LABELS[step - 1]}</span>
        </span>
        <span className="tabular-nums text-slate-500">{Math.round(pct)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-brand transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
