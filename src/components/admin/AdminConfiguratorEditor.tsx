'use client'

import { Check } from 'lucide-react'
import {
  ADMIN_PROJECT_TYPES,
  BUSINESS_TYPES,
  FEATURES,
  TIMELINES,
  calculateQuote,
  isSocialMediaProjectType,
  toggleFeature,
  type ConfiguratorState,
  type EmailCount,
  type FeatureId,
  type ProjectTypeId,
} from '@/lib/admin-configurator-quote'
import {
  SOCIAL_MEDIA_ADDITIONAL_SERVICES,
  SOCIAL_MEDIA_GENERAL_INCLUDES,
} from '@/lib/quote-configurator'

const EMAIL_OPTIONS: Array<{ value: EmailCount; label: string }> = [
  { value: 0, label: 'No' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 6, label: 'Más' },
]

const WEB_TYPES = ADMIN_PROJECT_TYPES.filter((p) => p.category === 'web')
const REDES_TYPES = ADMIN_PROJECT_TYPES.filter((p) => p.category === 'redes')

type Props = {
  state: ConfiguratorState
  onChange: (next: ConfiguratorState) => void
}

export function AdminConfiguratorEditor({ state, onChange }: Props) {
  const quote = calculateQuote(state)
  const selectedProject = ADMIN_PROJECT_TYPES.find((p) => p.id === state.projectType) ?? null
  const isRedes = isSocialMediaProjectType(state.projectType)

  function patch<K extends keyof ConfiguratorState>(key: K, value: ConfiguratorState[K]) {
    onChange({ ...state, [key]: value })
  }

  function selectProject(id: ProjectTypeId) {
    if (isSocialMediaProjectType(id)) {
      onChange({
        ...state,
        projectType: id,
        features: [],
        // Marcamos si/no para no bloquear validaciones legacy de web
        hasDomain: 'si',
        hasHosting: 'si',
        emailCount: 0,
      })
      return
    }
    onChange({
      ...state,
      projectType: id,
      features: state.features.length > 0 ? state.features : (['whatsapp'] as FeatureId[]),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-brand/15 bg-brand/[0.04] px-4 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Total estimado
          </p>
          <p className="text-sm text-slate-700">{quote.projectLabel}</p>
        </div>
        <p className="text-2xl font-bold tabular-nums text-brand">
          ${quote.total}
          <span className="ml-1 text-sm font-semibold text-slate-500">
            USD{quote.monthly ? ' / mes' : ''}
          </span>
        </p>
      </div>

      <section>
        <p className="mb-2 text-sm font-bold text-slate-900">Desarrollo web</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {WEB_TYPES.map((project) => {
            const active = state.projectType === project.id
            return (
              <button
                key={project.id}
                type="button"
                onClick={() => selectProject(project.id as ProjectTypeId)}
                className={`rounded-xl border px-3 py-3 text-left transition ${
                  active
                    ? 'border-brand/35 bg-brand/[0.06] ring-1 ring-brand/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-900">{project.label}</span>
                  <span className="shrink-0 text-sm font-bold text-brand">
                    {'fromPrice' in project && project.fromPrice ? 'desde ' : ''}${project.basePrice}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{project.description}</p>
              </button>
            )
          })}
        </div>
      </section>

      <section>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <p className="text-sm font-bold text-slate-900">Manejo de redes sociales</p>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">
            Solo admin
          </span>
        </div>
        <p className="mb-3 text-xs text-slate-500">
          Servicio personalizado para clientes seleccionados. No aparece en el cotizador público.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {REDES_TYPES.map((project) => {
            const active = state.projectType === project.id
            return (
              <button
                key={project.id}
                type="button"
                onClick={() => selectProject(project.id as ProjectTypeId)}
                className={`rounded-xl border px-3 py-3 text-left transition ${
                  active
                    ? 'border-brand/35 bg-brand/[0.06] ring-1 ring-brand/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex flex-wrap items-center gap-1.5">
                  {'badge' in project && project.badge ? (
                    <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      {project.badge}
                    </span>
                  ) : null}
                </div>
                <div className="mt-1.5 flex items-baseline justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-900">{project.label}</span>
                  <span className="shrink-0 text-sm font-bold text-brand">${project.basePrice}/mes</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{project.description}</p>
              </button>
            )
          })}
        </div>

        {selectedProject && isRedes ? (
          <div className="mt-3 space-y-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                Qué incluye · {selectedProject.label}
              </p>
              {'target' in selectedProject && selectedProject.target ? (
                <p className="mt-1 text-sm font-medium text-slate-700">{selectedProject.target}</p>
              ) : null}
              <p className="mt-1 text-sm text-slate-600">{selectedProject.description}</p>
              <ul className="mt-3 space-y-1.5">
                {selectedProject.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={2.5} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-slate-500">
                Entrega / arranque del mes: {selectedProject.delivery}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Incluido en todos los planes
              </p>
              <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                {SOCIAL_MEDIA_GENERAL_INCLUDES.map((item) => (
                  <li key={item} className="text-xs text-slate-600">
                    · {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                No incluidos (adicionales)
              </p>
              <ul className="mt-2 space-y-1">
                {SOCIAL_MEDIA_ADDITIONAL_SERVICES.map((item) => (
                  <li key={item} className="text-xs text-amber-900/80">
                    · {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        {selectedProject && !isRedes ? (
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">
              Qué incluye · {selectedProject.label}
            </p>
            <p className="mt-1 text-sm text-slate-600">{selectedProject.description}</p>
            <ul className="mt-3 space-y-1.5">
              {selectedProject.includes.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={2.5} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      {!isRedes ? (
        <>
          <section>
            <p className="mb-2 text-sm font-bold text-slate-900">Funcionalidades</p>
            <div className="max-h-64 space-y-1.5 overflow-y-auto rounded-xl border border-slate-200 p-2">
              {FEATURES.map((feature) => {
                const active = state.features.includes(feature.id)
                return (
                  <button
                    key={feature.id}
                    type="button"
                    onClick={() =>
                      patch('features', toggleFeature(state.features, feature.id as FeatureId))
                    }
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
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-slate-900">{feature.label}</span>
                      <span className="block text-xs text-slate-500">{feature.description}</span>
                    </span>
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
                      state.hasDomain === option
                        ? 'border-brand/35 bg-brand/[0.06] text-brand'
                        : 'border-slate-200'
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
                      state.hasHosting === option
                        ? 'border-brand/35 bg-brand/[0.06] text-brand'
                        : 'border-slate-200'
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
                    state.emailCount === option.value
                      ? 'border-brand bg-brand text-white'
                      : 'border-slate-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </section>
        </>
      ) : null}

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
                  state.business === business.id
                    ? 'border-brand bg-brand text-white'
                    : 'border-slate-200'
                }`}
              >
                {business.label}
              </button>
            ))}
          </div>
        </div>
        {!isRedes ? (
          <div>
            <p className="mb-2 text-sm font-bold text-slate-900">Plazo (opcional)</p>
            <div className="space-y-1.5">
              {TIMELINES.map((timeline) => (
                <button
                  key={timeline.id}
                  type="button"
                  onClick={() => patch('timeline', timeline.id)}
                  className={`flex w-full rounded-xl border px-3 py-2 text-left text-sm font-semibold ${
                    state.timeline === timeline.id
                      ? 'border-brand/35 bg-brand/[0.06] text-brand'
                      : 'border-slate-200'
                  }`}
                >
                  {timeline.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}
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
        <p className="mt-2 text-xs text-slate-500">
          {isRedes ? 'Arranque / entrega:' : 'Entrega:'} {quote.delivery}
          {quote.monthly ? ' · Facturación mensual' : ''}
        </p>
      </div>
    </div>
  )
}
