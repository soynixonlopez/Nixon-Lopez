'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calculator,
  Check,
  Code2,
  Download,
  Layout,
  Lock,
  MessageCircle,
  Store,
  WalletCards,
} from 'lucide-react'
import Image from 'next/image'
import { useEffect, useMemo, useState, useTransition } from 'react'
import { SectionLabel } from '@/components/marketing/SectionLabel'
import { SectionTitle } from '@/components/marketing/SectionTitle'
import { QuoteProgress } from '@/components/quote/configurator/QuoteProgress'
import { QuoteSummaryPanel } from '@/components/quote/configurator/QuoteSummaryPanel'
import { BRAND_ICON_TONES } from '@/lib/brand-icons'
import { buildWhatsAppUrl } from '@/lib/marketing'
import { INVOICE_BRANDING } from '@/lib/invoice-branding'
import { rateLimitFriendlyMessage } from '@/lib/utils'
import {
  BUSINESS_TYPES,
  calculateQuote,
  FEATURES,
  getProjectType,
  INITIAL_CONFIGURATOR_STATE,
  PROJECT_TYPES,
  TIMELINES,
  TOTAL_STEPS,
  type BusinessId,
  type ConfiguratorState,
  type EmailCount,
  type FeatureId,
  type ProjectTypeId,
  type TimelineId,
  mapLegacyServiceToFeatures,
  mapLegacyServiceToProject,
  splitFullName,
} from '@/lib/quote-configurator'

const PROJECT_ICONS = {
  landing: Layout,
  profesional: Building2,
  tienda: Store,
  sistema: Code2,
} as const

const EMAIL_OPTIONS: Array<{ value: EmailCount; label: string }> = [
  { value: 0, label: 'No' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 6, label: 'Más' },
]

const fieldClass =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-brand/40 focus:ring-2 focus:ring-brand/15'
const labelClass = 'mb-1.5 block text-sm font-medium text-slate-700'
const choiceOn = 'border-brand/30 bg-slate-50 ring-2 ring-brand/20'
const choiceOff = 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'

function canContinue(step: number, state: ConfiguratorState) {
  if (step === 1) return Boolean(state.projectType)
  if (step === 2) return Boolean(state.business)
  if (step === 3) return true
  if (step === 4) return state.hasDomain !== '' && state.hasHosting !== ''
  if (step === 5) return Boolean(state.timeline)
  if (step === 6) {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.correo.trim())
    return state.nombre.trim().length > 1 && emailOk && state.whatsapp.trim().length >= 7
  }
  return false
}

function buildWhatsAppMessage(state: ConfiguratorState) {
  const quote = calculateQuote(state)
  const lines = quote.lines.map((line) => `• ${line.label}: $${line.amount}`).join('\n')
  return (
    `Hola Nixon, generé una cotización en nixonlopez.com:\n\n` +
    `Proyecto: ${quote.projectLabel}\n` +
    `Negocio: ${state.business ?? '—'}\n` +
    `${lines}\n\n` +
    `Total estimado: $${quote.total} USD\n` +
    `Entrega: ${quote.delivery}\n` +
    `Nombre: ${state.nombre}\n` +
    `Empresa: ${state.empresa || '—'}\n` +
    `Correo: ${state.correo}\n` +
    `WhatsApp: ${state.whatsapp}`
  )
}

type Props = {
  initialServiceId?: string | null
}

export function QuoteConfigurator({ initialServiceId = null }: Props) {
  const preselected = Boolean(initialServiceId && mapLegacyServiceToProject(initialServiceId))
  const [step, setStep] = useState(1)
  const [state, setState] = useState<ConfiguratorState>(() => ({
    ...INITIAL_CONFIGURATOR_STATE,
    projectType: mapLegacyServiceToProject(initialServiceId),
    features: mapLegacyServiceToFeatures(initialServiceId),
  }))
  const [done, setDone] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [fromHome, setFromHome] = useState(preselected)
  const [pending, startTransition] = useTransition()
  const quote = useMemo(() => calculateQuote(state), [state])

  useEffect(() => {
    if (!initialServiceId) return
    const mapped = mapLegacyServiceToProject(initialServiceId)
    if (!mapped) return
    setFromHome(true)
    setState((current) => ({
      ...current,
      projectType: mapped,
      features: mapLegacyServiceToFeatures(initialServiceId),
    }))
    setStep(2)
  }, [initialServiceId])

  function update<K extends keyof ConfiguratorState>(key: K, value: ConfiguratorState[K]) {
    startTransition(() => {
      setState((current) => ({ ...current, [key]: value }))
    })
  }

  function toggleFeature(id: FeatureId) {
    startTransition(() => {
      setState((current) => {
        const exists = current.features.includes(id)
        return {
          ...current,
          features: exists ? current.features.filter((item) => item !== id) : [...current.features, id],
        }
      })
    })
  }

  function goNext() {
    if (!canContinue(step, state)) return
    setError('')
    setStep((current) => Math.min(TOTAL_STEPS, current + 1))
  }

  function goBack() {
    setError('')
    setStep((current) => Math.max(1, current - 1))
  }

  async function handleGenerate() {
    if (!canContinue(6, state) || !state.projectType) return
    setSending(true)
    setError('')
    const { nombre, apellido } = splitFullName(state.nombre)
    const hasPasarela = state.features.includes('pasarela')
    const comments = [
      state.empresa ? `Empresa: ${state.empresa}` : null,
      `WhatsApp: ${state.whatsapp}`,
      `Rubro: ${state.business ?? '—'}`,
      `Plazo: ${state.timeline ?? '—'}`,
      `Dominio propio: ${state.hasDomain === 'si' ? 'Sí' : 'No'}`,
      `Hosting propio: ${state.hasHosting === 'si' ? 'Sí' : 'No'}`,
      `Correos: ${state.emailCount >= 6 ? '6+' : state.emailCount}`,
      `Extras: ${state.features.join(', ') || '—'}`,
    ]
      .filter(Boolean)
      .join('\n')

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          apellido,
          correo: state.correo.trim(),
          tipoServicio: state.projectType,
          servicio: quote.projectLabel,
          total: `$${quote.total} USD`,
          totalNumeric: quote.total,
          monthly: false,
          comentarios: comments,
          incluyeDominioHostingCorreo:
            state.hasDomain === 'no' || state.hasHosting === 'no' || state.emailCount > 0
              ? 'Incluye ítems en presupuesto (dominio/hosting/correos según selección)'
              : 'Cliente ya cuenta con dominio/hosting',
          pasarelaPagos: hasPasarela ? 'Sí — Integración pasarela de pagos (+$100)' : 'No',
          breakdown: { lines: quote.lines.map((line) => ({ label: line.label, amount: line.amount })) },
          selected_services: [
            {
              serviceId: state.projectType,
              kind: 'manual',
              label: quote.projectLabel,
              baseAmount: getProjectType(state.projectType)?.basePrice ?? quote.total,
              total: quote.total,
              monthly: false,
              quantityPages: null,
              offerPoints: [
                ...quote.includedZeroPriceFeatures,
                ...quote.lines.filter((line) => !line.id.startsWith('project-')).map((line) => line.label),
              ].slice(0, 5),
              lines: quote.lines.map((line) => ({ label: line.label, amount: line.amount })),
              hasDomain: state.hasDomain === 'si' ? 'si' : state.hasDomain === 'no' ? 'no' : '',
              hasProfessionalEmail: state.emailCount > 0 ? 'no' : state.emailCount === 0 ? 'si' : '',
              hasHosting: state.hasHosting === 'si' ? 'si' : state.hasHosting === 'no' ? 'no' : '',
            },
          ],
        }),
      })

      if (response.ok) {
        setDone(true)
        return
      }
      if (response.status === 429) {
        setError(rateLimitFriendlyMessage(response.headers.get('Retry-After')))
        return
      }
      const data = (await response.json().catch(() => null)) as { error?: string } | null
      setError(data?.error || 'No se pudo generar la propuesta. Intenta de nuevo.')
    } catch {
      setError('No se pudo generar la propuesta. Intenta de nuevo.')
    } finally {
      setSending(false)
    }
  }

  function handleDownloadPdf() {
    const includes = [
      ...quote.includedZeroPriceFeatures,
      ...quote.lines.filter((line) => !line.id.startsWith('project-')).map((line) => line.label),
    ]
    const logoUrl = `${window.location.origin}/images/logoweb.png`
    const html = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"/><title>Cotización — ${quote.projectLabel}</title>
      <style>
        body{font-family:Segoe UI,system-ui,sans-serif;color:#0f172a;padding:40px;max-width:720px;margin:0 auto}
        h1{font-size:28px;margin:8px 0 0} .muted{color:#64748b;font-size:14px}
        .card{border:1px solid #e2e8f0;border-radius:16px;padding:24px;margin-top:24px}
        .row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9}
        .total{font-size:28px;font-weight:800;color:#1e3a5f;margin-top:16px}
        ul{padding-left:18px} li{margin:6px 0}
        img{height:48px;width:auto}
      </style></head><body>
      <img src="${logoUrl}" alt="Nixon Lopez" />
      <h1>Cotización estimada</h1>
      <p class="muted">${new Date().toLocaleDateString('es-PA')} · Cliente: ${state.nombre}${state.empresa ? ` · ${state.empresa}` : ''}</p>
      <p class="muted">${state.correo} · WhatsApp: ${state.whatsapp}</p>
      <div class="card">
        <p><strong>Tipo de proyecto:</strong> ${quote.projectLabel}</p>
        <p><strong>Tiempo estimado:</strong> ${quote.delivery}</p>
        <p style="margin-top:16px"><strong>Precio base y extras</strong></p>
        ${quote.lines.map((line) => `<div class="row"><span>${line.label}</span><strong>$${line.amount} USD</strong></div>`).join('')}
        <p class="total">Total: $${quote.total} USD</p>
        <p><strong>Servicios incluidos</strong></p>
        <ul>${includes.map((item) => `<li>${item}</li>`).join('') || '<li>Alcance base del proyecto</li>'}</ul>
        <p style="margin-top:20px"><strong>Forma de pago</strong></p>
        <p class="muted">50% para iniciar · 50% al finalizar</p>
        <p style="margin-top:16px"><strong>Contacto</strong></p>
        <p class="muted">${INVOICE_BRANDING.email || 'www.nixonlopez.com'} · www.nixonlopez.com</p>
      </div>
      <script>window.onload=()=>window.print()</script>
      </body></html>`
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(html)
    win.document.close()
  }

  if (done) {
    const includes = [
      ...quote.includedZeroPriceFeatures,
      ...quote.lines.filter((line) => !line.id.startsWith('project-')).map((line) => line.label),
    ]

    return (
      <main className="relative isolate overflow-hidden bg-white pt-24 pb-16 sm:pt-28">
        <div
          className="pointer-events-none absolute top-0 left-0 h-64 w-64 rounded-full bg-gradient-to-br from-blue-100/50 to-transparent blur-3xl"
          aria-hidden
        />
        <div className="relative z-10 mx-auto w-full max-w-xl px-5 sm:px-6">
          <div className="text-center">
            <SectionLabel>Propuesta lista</SectionLabel>
            <SectionTitle>
              Tu cotización <span className="text-brand">estimada</span>
            </SectionTitle>
            <p className="mt-3 text-slate-600">
              Gracias, {state.nombre.split(' ')[0]}. Resumen de lo configurado.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)] sm:rounded-3xl sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Proyecto</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{quote.projectLabel}</p>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {includes.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                  <Check className="h-4 w-4 shrink-0 text-brand" strokeWidth={2.5} />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Tiempo estimado
                </p>
                <p className="mt-1 font-semibold text-slate-900">{quote.delivery}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Inversión estimada
                </p>
                <p className="mt-1 text-3xl font-bold tabular-nums text-brand">${quote.total} USD</p>
              </div>
            </div>
            <p className="mt-5 text-center text-xs leading-relaxed text-slate-500">
              Este valor es una estimación basada en las opciones seleccionadas. La propuesta final
              puede variar ligeramente dependiendo de requerimientos adicionales.
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3.5 font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
            >
              <Download className="h-5 w-5" />
              Descargar PDF
            </button>
            <a
              href={buildWhatsAppUrl(buildWhatsAppMessage(state))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-3.5 font-semibold text-emerald-800 transition hover:bg-emerald-100"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </a>
          </div>
          <a
            href={`mailto:${INVOICE_BRANDING.email}?subject=${encodeURIComponent(`Propuesta formal — ${quote.projectLabel}`)}&body=${encodeURIComponent(buildWhatsAppMessage(state))}`}
            className="mt-3 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3.5 font-semibold text-white shadow-md transition hover:bg-brand-light"
          >
            Solicitar propuesta formal
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="relative isolate overflow-hidden bg-white pt-24 pb-28 sm:pt-28 lg:pb-20">
      <div
        className="pointer-events-none absolute top-0 left-0 h-64 w-64 rounded-full bg-gradient-to-br from-blue-100/50 to-transparent blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-gradient-to-tl from-purple-100/40 to-transparent blur-3xl"
        aria-hidden
      />

      <div className="container-padding relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-10 lg:items-stretch">
          {/* Izquierda — imagen con resumen flotante encima */}
          <div className="lg:sticky lg:top-28">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.08)] sm:rounded-3xl">
              <Image
                src="/images/cotizador.png"
                alt="Nixon Lopez — Descubre cuánto cuesta tu proyecto"
                width={1092}
                height={1440}
                priority
                unoptimized
                className="h-auto w-full object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 540px"
              />

              {/* Resumen vivo sobre la imagen (estilo mockup flotante) */}
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/35 via-transparent to-transparent lg:from-slate-900/25"
                aria-hidden
              />
              <div className="absolute bottom-3 left-3 right-3 z-10 flex justify-end sm:bottom-5 sm:left-auto sm:right-5 lg:bottom-6 lg:right-6">
                <div className="origin-bottom-right sm:rotate-1">
                  <QuoteSummaryPanel state={state} overlay />
                </div>
              </div>
            </div>
          </div>

          {/* Derecha — card blanca como homepage */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)] sm:rounded-3xl sm:p-6 lg:p-7">
            <div className="mb-6 flex items-start gap-3 border-b border-slate-100 pb-5">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${BRAND_ICON_TONES.blue.wrap}`}>
                <Calculator className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <p className="font-bold text-slate-900">Cotizador online</p>
                <p className="text-sm text-slate-500">Configura tu proyecto paso a paso</p>
              </div>
            </div>

            <QuoteProgress step={step} />

            {fromHome && state.projectType && step > 1 ? (
              <div className="mb-4 flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm">
                <p className="text-slate-600">
                  Proyecto:{' '}
                  <span className="font-semibold text-slate-900">{quote.projectLabel}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-brand hover:underline"
                >
                  Cambiar
                </button>
              </div>
            ) : null}

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                {step === 1 ? (
                  <div>
                    <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                        1
                      </span>
                      ¿Qué tipo de proyecto necesitas?
                    </p>
                    <div className="space-y-3">
                      {PROJECT_TYPES.map((project) => {
                        const Icon = PROJECT_ICONS[project.id]
                        const active = state.projectType === project.id
                        return (
                          <button
                            key={project.id}
                            type="button"
                            onClick={() => update('projectType', project.id as ProjectTypeId)}
                            className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3.5 text-left transition ${
                              active ? choiceOn : choiceOff
                            }`}
                          >
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${BRAND_ICON_TONES.blue.wrap}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-baseline justify-between gap-2">
                                <p className="font-semibold text-slate-900">{project.label}</p>
                                <p className="shrink-0 text-sm font-bold tabular-nums text-brand">
                                  ${project.basePrice}
                                  {'fromPrice' in project && project.fromPrice ? '+' : ''}
                                </p>
                              </div>
                              <p className="text-xs text-slate-500 sm:text-sm">{project.description}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ) : null}

                {step === 2 ? (
                  <div>
                    <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                        2
                      </span>
                      ¿A qué se dedica tu negocio?
                    </p>
                    <p className="mb-4 text-sm text-slate-500">No cambia el precio. Personaliza la propuesta.</p>
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2">
                      {BUSINESS_TYPES.map((business) => {
                        const active = state.business === business.id
                        return (
                          <button
                            key={business.id}
                            type="button"
                            onClick={() => update('business', business.id as BusinessId)}
                            className={`rounded-xl border px-3 py-3.5 text-sm font-semibold transition ${
                              active ? choiceOn : choiceOff
                            }`}
                          >
                            {business.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ) : null}

                {step === 3 ? (
                  <div>
                    <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                        3
                      </span>
                      ¿Qué funcionalidades necesitas?
                    </p>
                    <p className="mb-3 text-sm text-slate-500">
                      Incluye pasarela de pago (+$100). Desplázate para ver todas las opciones.
                    </p>
                    <div
                      className="quote-features-scroll rounded-xl border border-slate-200 bg-slate-50/50 p-2"
                      style={{ height: 252, maxHeight: 252, overflowY: 'scroll', overscrollBehavior: 'contain' }}
                    >
                      <div className="flex flex-col gap-2">
                        {FEATURES.map((feature) => {
                          const active = state.features.includes(feature.id)
                          return (
                            <button
                              key={feature.id}
                              type="button"
                              onClick={() => toggleFeature(feature.id as FeatureId)}
                              className={`flex w-full shrink-0 items-center gap-3 rounded-xl border bg-white px-3 py-2.5 text-left transition ${
                                active ? choiceOn : choiceOff
                              }`}
                            >
                              <span
                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                                  active ? 'border-brand bg-brand text-white' : 'border-slate-300 bg-white'
                                }`}
                              >
                                {active ? <Check className="h-3 w-3" strokeWidth={2.5} /> : null}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="flex items-center justify-between gap-2">
                                  <span className="text-sm font-semibold text-slate-900">{feature.label}</span>
                                  <span className="shrink-0 text-sm font-bold tabular-nums text-brand">
                                    {feature.price === 0 ? '+$0' : `+$${feature.price}`}
                                  </span>
                                </span>
                                <span className="block text-xs text-slate-500">{feature.description}</span>
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ) : null}

                {step === 4 ? (
                  <div className="space-y-6">
                    <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                        4
                      </span>
                      Servicios adicionales
                    </p>

                    <div>
                      <p className="mb-2 text-sm font-semibold text-slate-800">¿Ya tienes dominio?</p>
                      <div className="grid grid-cols-2 gap-2.5">
                        {(['si', 'no'] as const).map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => update('hasDomain', option)}
                            className={`rounded-xl border px-3 py-3.5 text-sm font-semibold transition ${
                              state.hasDomain === option ? choiceOn : choiceOff
                            }`}
                          >
                            {option === 'si' ? 'Sí' : 'No · +$20'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-sm font-semibold text-slate-800">¿Ya tienes hosting?</p>
                      <div className="grid grid-cols-2 gap-2.5">
                        {(['si', 'no'] as const).map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => update('hasHosting', option)}
                            className={`rounded-xl border px-3 py-3.5 text-sm font-semibold transition ${
                              state.hasHosting === option ? choiceOn : choiceOff
                            }`}
                          >
                            {option === 'si' ? 'Sí' : 'No · +$60'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">¿Necesitas correos corporativos?</p>
                      <p className="mt-0.5 text-xs text-slate-500">+$15 por correo</p>
                      <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-7">
                        {EMAIL_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => update('emailCount', option.value)}
                            className={`rounded-xl border px-2 py-3 text-sm font-semibold transition ${
                              state.emailCount === option.value ? choiceOn : choiceOff
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}

                {step === 5 ? (
                  <div>
                    <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                        5
                      </span>
                      ¿Cuándo necesitas el proyecto?
                    </p>
                    <p className="mb-4 text-sm text-slate-500">No modifica el precio.</p>
                    <div className="space-y-2.5">
                      {TIMELINES.map((timeline) => {
                        const active = state.timeline === timeline.id
                        return (
                          <button
                            key={timeline.id}
                            type="button"
                            onClick={() => update('timeline', timeline.id as TimelineId)}
                            className={`flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left transition ${
                              active ? choiceOn : choiceOff
                            }`}
                          >
                            <div>
                              <p className="font-semibold text-slate-900">{timeline.label}</p>
                              <p className="text-xs text-slate-500">{timeline.description}</p>
                            </div>
                            <span
                              className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                                active ? 'border-brand bg-brand text-white' : 'border-slate-300'
                              }`}
                            >
                              {active ? <Check className="h-3 w-3" /> : null}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ) : null}

                {step === 6 ? (
                  <div>
                    <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                        6
                      </span>
                      Tus datos
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className={labelClass}>Nombre</label>
                        <input
                          className={fieldClass}
                          value={state.nombre}
                          onChange={(e) => update('nombre', e.target.value)}
                          placeholder="Tu nombre completo"
                          autoComplete="name"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Empresa</label>
                        <input
                          className={fieldClass}
                          value={state.empresa}
                          onChange={(e) => update('empresa', e.target.value)}
                          placeholder="Opcional"
                          autoComplete="organization"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>WhatsApp</label>
                        <input
                          className={fieldClass}
                          value={state.whatsapp}
                          onChange={(e) => update('whatsapp', e.target.value)}
                          placeholder="+507 6000-0000"
                          autoComplete="tel"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelClass}>Correo</label>
                        <input
                          type="email"
                          className={fieldClass}
                          value={state.correo}
                          onChange={(e) => update('correo', e.target.value)}
                          placeholder="tu@correo.com"
                          autoComplete="email"
                        />
                      </div>
                    </div>
                    {error ? (
                      <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                        {error}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-brand"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Atrás
                </button>
              ) : (
                <span />
              )}

              {step < TOTAL_STEPS ? (
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canContinue(step, state) || pending}
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-md bg-brand px-6 py-3.5 text-base font-semibold text-white transition hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continuar
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!canContinue(6, state) || sending}
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-md bg-brand px-6 py-3.5 text-base font-semibold text-white transition hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <WalletCards className="h-4 w-4" />
                  {sending ? 'Generando…' : 'Generar propuesta'}
                </button>
              )}
            </div>

            <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
              <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden />
              Precio transparente · Sin compromiso · Menos de 2 minutos
            </p>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
        <div className="mx-auto max-w-6xl">
          <QuoteSummaryPanel state={state} compact />
        </div>
      </div>
    </main>
  )
}
