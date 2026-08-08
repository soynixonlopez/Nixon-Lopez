'use client'

import { Check } from 'lucide-react'
import {
  BUSINESS_TYPES,
  FEATURES,
  PROJECT_TYPES,
  TIMELINES,
  calculateQuote,
  toggleFeature,
  type ConfiguratorState,
  type EmailCount,
  type FeatureId,
  type ProjectTypeId,
} from '@/lib/admin-configurator-quote'

const EMAIL_OPTIONS: Array<{ value: EmailCount; label: string }> = [
  { value: 0, label: 'No' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 6, label: 'Más' },
]

type Props = {
  state: ConfiguratorState
  onChange: (next: ConfiguratorState) => void
}

export function AdminConfiguratorEditor({ state, onChange }: Props) {
  const quote = calculateQuote(state)

  function patch<K extends keyof ConfiguratorState>(key: K, value: ConfiguratorState[K]) {
    onChange({ ...state, [key]: value })
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-brand/15 bg-brand/[0.04] px-4 py-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total estimado</p>
          <p className="text-sm text-slate-700">{quote.projectLabel}</p>
        </div>
        <p className="text-2xl font-bold tabular-nums text-brand">
          ${quote.total}
          <span className="ml-1 text-sm font-semibold text-slate-500">USD</span>
        </p>
      </div>

      <section>
        <p className="mb-2 text-sm font-bold text-slate-900">Tipo de proyecto</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {PROJECT_TYPES.map((project) => {
            const active = state.projectType === project.id
            return (
              <button
                key={project.id}
                type="button"
                onClick={() => patch('projectType', project.id as ProjectTypeId)}
                className={`rounded-xl border px-3 py-3 text-left transition ${
                  active ? 'border-brand/35 bg-brand/[0.06] ring-1 ring-brand/20' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-900">{project.label}</span>
                  <span className="text-sm font-bold text-brand">
                    {'fromPrice' in project && project.fromPrice ? 'desde ' : ''}${project.basePrice}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <section>
        <p className="mb-2 text-sm font-bold text-slate-900">Funcionalidades</p>
        <div className="max-h-64 space-y-1.5 overflow-y-auto rounded-xl border border-slate-200 p-2">
          {FEATURES.map((feature) => {
            const active = state.features.includes(feature.id)
            return (
              <button
                key={feature.id}
                type="button"
                onClick={() => patch('features', toggleFeature(state.features, feature.id as FeatureId))}
                className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left ${
                  active ? 'bg-brand/[0.06]' : 'hover:bg-slate-50'
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                    active ? 'border-brand bg-brand text-white' : 'border-slate-300'
                  }`}
                >
                  {active ? <Check className="h-3 w-3" /> : null}
                </span>
                <span className="min-w-0 flex-1 text-sm font-medium text-slate-900">{feature.label}</span>
                <span className="text-sm font-semibold text-brand">
                  {feature.price === 0 ? '+$0' : `+$${feature.price}`}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-bold text-slate-900">¿Ya tiene dominio?</p>
          <div className="grid grid-cols-2 gap-2">
            {(['si', 'no'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => patch('hasDomain', option)}
                className={`rounded-xl border px-3 py-2.5 text-sm font-semibold ${
                  state.hasDomain === option ? 'border-brand/35 bg-brand/[0.06] text-brand' : 'border-slate-200'
                }`}
              >
                {option === 'si' ? 'Sí' : 'No · +$20'}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-bold text-slate-900">¿Ya tiene hosting?</p>
          <div className="grid grid-cols-2 gap-2">
            {(['si', 'no'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => patch('hasHosting', option)}
                className={`rounded-xl border px-3 py-2.5 text-sm font-semibold ${
                  state.hasHosting === option ? 'border-brand/35 bg-brand/[0.06] text-brand' : 'border-slate-200'
                }`}
              >
                {option === 'si' ? 'Sí' : 'No · +$60'}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section>
        <p className="mb-2 text-sm font-bold text-slate-900">Correos corporativos (+$15 c/u)</p>
        <div className="flex flex-wrap gap-1.5">
          {EMAIL_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => patch('emailCount', option.value)}
              className={`min-w-[2.75rem] rounded-full border px-3 py-2 text-sm font-semibold ${
                state.emailCount === option.value ? 'border-brand bg-brand text-white' : 'border-slate-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-bold text-slate-900">Rubro (opcional)</p>
          <div className="flex flex-wrap gap-1.5">
            {BUSINESS_TYPES.map((business) => (
              <button
                key={business.id}
                type="button"
                onClick={() => patch('business', business.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  state.business === business.id ? 'border-brand bg-brand text-white' : 'border-slate-200'
                }`}
              >
                {business.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-bold text-slate-900">Plazo (opcional)</p>
          <div className="space-y-1.5">
            {TIMELINES.map((timeline) => (
              <button
                key={timeline.id}
                type="button"
                onClick={() => patch('timeline', timeline.id)}
                className={`flex w-full rounded-xl border px-3 py-2 text-left text-sm font-semibold ${
                  state.timeline === timeline.id ? 'border-brand/35 bg-brand/[0.06] text-brand' : 'border-slate-200'
                }`}
              >
                {timeline.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Desglose</p>
        <ul className="mt-2 space-y-1">
          {quote.lines.map((line) => (
            <li key={line.id} className="flex justify-between gap-2 text-sm">
              <span className="text-slate-600">{line.label}</span>
              <span className="font-medium tabular-nums text-slate-900">${line.amount}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-slate-500">Entrega: {quote.delivery}</p>
      </div>
    </div>
  )
}
