'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calculator,
  CalendarDays,
  Check,
  Download,
  Layout,
  Lock,
  Megaphone,
  MessageCircle,
  Sparkles,
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
import { useMessages } from '@/i18n/LocaleProvider'
import {
  buildLocalizedQuoteCatalog,
  calculateLocalizedQuote,
  getLocalizedBusinessLabel,
} from '@/i18n/quote-localized'
import { buildWhatsAppUrl } from '@/lib/marketing'
import { INVOICE_BRANDING } from '@/lib/invoice-branding'
import { rateLimitFriendlyMessage } from '@/lib/utils'
import {
  buildCommercialSnapshot,
  INITIAL_CONFIGURATOR_STATE,
  TOTAL_STEPS,
  planAlreadyIncludes,
  type BusinessId,
  type ConfiguratorState,
  type EmailCount,
  type FeatureId,
  type TimelineId,
  mapLegacyServiceToFeatures,
  mapLegacyServiceToMarketing,
  mapLegacyServiceToProject,
  splitFullName,
} from '@/lib/quote-configurator'
import type { CommercialOfferSettings } from '@/lib/commercial-settings'
import { adBudgetRecommendationCopy, DEFAULT_COMMERCIAL_OFFER } from '@/lib/commercial-settings'
import {
  MARKETING_PLANS,
  WEB_PLANS,
  getCatalogPlan,
  isWebPlanId,
  type MarketingPlanId,
} from '@/lib/service-catalog'

const PROJECT_ICONS: Record<string, typeof Layout> = {
  landing: Layout,
  profesional: Building2,
  'web-panel': WalletCards,
  corporativo: Building2,
  tienda: Store,
  reservas: CalendarDays,
  'mkt-presencia': MessageCircle,
  'mkt-crecimiento': Megaphone,
  'mkt-integral': Sparkles,
}

const fieldClass =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-brand/40 focus:ring-2 focus:ring-brand/15'
const labelClass = 'mb-1.5 block text-sm font-medium text-slate-700'
const choiceOn = 'border-brand/30 bg-slate-50 ring-2 ring-brand/20'
const choiceOff = 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'

function selectedWebIds(state: ConfiguratorState) {
  if (state.webPlanIds.length > 0) return state.webPlanIds
  return isWebPlanId(state.projectType) ? [state.projectType] : []
}

function hasWebSelection(state: ConfiguratorState) {
  return selectedWebIds(state).length > 0
}

function canContinue(step: number, state: ConfiguratorState) {
  if (step === 1) return Boolean(hasWebSelection(state) || state.marketingPlan)
  if (step === 2) return Boolean(state.business)
  if (step === 3) return !state.includeStories || (state.storiesPerMonth > 0 && state.storiesUnitPrice > 0)
  if (step === 4) {
    if (!hasWebSelection(state)) return true
    return state.hasDomain !== '' && state.hasHosting !== ''
  }
  if (step === 5) return Boolean(state.timeline)
  if (step === 6) {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.correo.trim())
    return state.nombre.trim().length > 1 && emailOk && state.whatsapp.trim().length >= 7
  }
  return false
}

function buildWhatsAppMessage(
  state: ConfiguratorState,
  catalog: ReturnType<typeof buildLocalizedQuoteCatalog>,
) {
  const q = catalog.quote
  const quote = calculateLocalizedQuote(state, catalog)
    const lines = quote.lines.map((line) => `• ${line.label}: $${line.amount}`).join('\n')
  const business = getLocalizedBusinessLabel(catalog, state.business) ?? '—'
  return (
    `${q.whatsappQuoteIntro}\n\n` +
    `${q.whatsappQuoteProject}: ${quote.projectLabel}\n` +
    `${q.whatsappQuoteBusiness}: ${business}\n` +
    `${lines}\n\n` +
    `Pago único: $${quote.oneTime} USD\n` +
    `Mensual (honorarios): $${quote.monthlyAmount} USD\n` +
    `Gastos externos estimados: $${quote.external} USD\n` +
    `${q.whatsappQuoteTotal}: $${quote.initialTotal} USD (honorarios iniciales)\n` +
    `${q.whatsappQuoteDelivery}: ${quote.delivery}\n` +
    `${q.whatsappQuoteName}: ${state.nombre}\n` +
    `${q.whatsappQuoteCompany}: ${state.empresa || '—'}\n` +
    `${q.whatsappQuoteEmail}: ${state.correo}\n` +
    `${q.whatsappQuoteWhatsapp}: ${state.whatsapp}`
  )
}

type Props = {
  initialServiceId?: string | null
  offer?: CommercialOfferSettings
}

export function QuoteConfigurator({ initialServiceId = null, offer = DEFAULT_COMMERCIAL_OFFER }: Props) {
  const messages = useMessages()
  const q = messages.quote
  const catalog = useMemo(() => buildLocalizedQuoteCatalog(q), [q])
  const preselected = Boolean(initialServiceId && (mapLegacyServiceToProject(initialServiceId) || mapLegacyServiceToMarketing(initialServiceId)))
  const [step, setStep] = useState(1)
  const [state, setState] = useState<ConfiguratorState>(() => {
    const mapped = mapLegacyServiceToProject(initialServiceId)
    const marketing = mapLegacyServiceToMarketing(initialServiceId)
    return {
      ...INITIAL_CONFIGURATOR_STATE,
      projectType: mapped && isWebPlanId(mapped) ? mapped : null,
      webPlanIds: mapped && isWebPlanId(mapped) ? [mapped] : [],
      recommendedAdBudgetUsd: offer.recommendedAdBudgetUsd,
      marketingPlan: marketing,
      features: mapLegacyServiceToFeatures(initialServiceId),
      productCount: mapped && isWebPlanId(mapped) ? getCatalogPlan(mapped)?.productsIncluded ?? null : null,
      serviceCount: mapped && isWebPlanId(mapped) ? getCatalogPlan(mapped)?.servicesIncluded ?? null : null,
    }
  })
  const [done, setDone] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [fromHome, setFromHome] = useState(preselected)
  const [pending, startTransition] = useTransition()
  const quote = useMemo(() => calculateLocalizedQuote(state, catalog), [state, catalog])

  useEffect(() => {
    if (!initialServiceId) return
    const mapped = mapLegacyServiceToProject(initialServiceId)
    const marketing = mapLegacyServiceToMarketing(initialServiceId)
    if (!mapped && !marketing) return
    setFromHome(true)
    setState((current) => ({
      ...current,
      projectType: mapped && isWebPlanId(mapped) ? mapped : current.projectType,
      webPlanIds: mapped && isWebPlanId(mapped) ? [mapped] : current.webPlanIds,
      recommendedAdBudgetUsd: offer.recommendedAdBudgetUsd,
      marketingPlan: marketing ?? current.marketingPlan,
      features: mapLegacyServiceToFeatures(initialServiceId),
      productCount: mapped && isWebPlanId(mapped) ? getCatalogPlan(mapped)?.productsIncluded ?? null : current.productCount,
      serviceCount: mapped && isWebPlanId(mapped) ? getCatalogPlan(mapped)?.servicesIncluded ?? null : current.serviceCount,
    }))
    setStep(2)
  }, [initialServiceId, offer.recommendedAdBudgetUsd])

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
    if (!canContinue(6, state) || (!hasWebSelection(state) && !state.marketingPlan)) return
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
      state.scopeNotes.trim() ? `Alcance: ${state.scopeNotes.trim()}` : null,
      state.marketingPlan ? `Canales: ${state.channels.join(', ')}` : null,
      state.includeStories ? `Historias: ${state.storiesPerMonth}/mes a $${state.storiesUnitPrice}` : 'Historias: no contratadas',
      state.adBudgetChoice === 'accepted'
        ? `Pauta aprobada (cliente a Meta): $${offer.recommendedAdBudgetUsd}/mes`
        : state.adBudgetChoice === 'custom'
          ? `Pauta aprobada (cliente a Meta): $${state.adBudgetUsd}/mes`
          : state.adBudgetChoice === 'pending'
            ? `Pauta recomendada $${offer.recommendedAdBudgetUsd}/mes, pendiente de aprobación`
            : 'Pauta: no aplica',
    ]
      .filter(Boolean)
      .join('\n')

    const commercial = buildCommercialSnapshot(state)
    const webs = selectedWebIds(state).map((id) => getCatalogPlan(id)).filter((plan) => Boolean(plan))
    const web = webs[0] ?? null
    const marketing = state.marketingPlan ? getCatalogPlan(state.marketingPlan) : null
    const selectedServices = [...webs, marketing].filter(Boolean).map((plan) => ({
      serviceId: plan!.id,
      kind: 'catalog' as const,
      label: plan!.label,
      baseAmount: plan!.basePrice,
      total: plan!.basePrice,
      monthly: plan!.billing === 'monthly',
      quantityPages: plan!.pagesIncluded,
      offerPoints: plan!.includes.slice(0, 5),
      lines: quote.lines
        .filter((line) => line.id === `project-${plan!.id}` || (plan!.billing === 'once' && line.billing === 'once' && line.id !== `project-${marketing?.id}`))
        .map((line) => ({ label: line.label, amount: line.amount })),
      hasDomain: state.hasDomain,
      hasProfessionalEmail: state.emailCount > 0 ? 'no' : 'si',
      hasHosting: state.hasHosting,
    }))

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          apellido,
          correo: state.correo.trim(),
          empresa: state.empresa.trim() || undefined,
          whatsapp: state.whatsapp.trim() || undefined,
          tipoServicio: state.marketingPlan && !web ? state.marketingPlan : state.projectType,
          servicio: quote.projectLabel,
          total: `$${quote.initialTotal} USD`,
          totalNumeric: quote.initialTotal,
          monthly: quote.monthly,
          comentarios: comments,
          configurator: state,
          commercial,
          incluyeDominioHostingCorreo:
            state.hasDomain === 'no' || state.hasHosting === 'no' || state.emailCount > 0
              ? 'Gastos externos estimados, no forman parte de los honorarios'
              : 'Cliente ya cuenta con dominio/hosting',
          pasarelaPagos: web?.hasGateway || hasPasarela
            ? 'Sí — pasarela sujeta a la cuenta del cliente. Comisiones no incluidas.'
            : 'No',
          breakdown: { lines: quote.lines.map((line) => ({ label: line.label, amount: line.amount, billing: line.billing })) },
          selected_services: selectedServices,
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
      setError(data?.error || q.errorGeneric)
    } catch {
      setError(q.errorGeneric)
    } finally {
      setSending(false)
    }
  }

  function handleDownloadPdf() {
    const includes = [
      ...quote.includedZeroPriceFeatures,
      ...quote.lines.filter((line) => !line.id.startsWith('project-')).map((line) => line.label),
    ]
    const logoUrl = `${window.location.origin}/images/logooficial.png`
    const clientLabel = [state.nombre.trim(), state.empresa.trim()].filter(Boolean).join(' — ')
    const html = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"/><title>Cotizacion ${clientLabel || quote.projectLabel}</title>
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
        <p class="total">Honorarios iniciales: $${quote.initialTotal} USD</p>
        <p>Pago único: $${quote.oneTime} · Mensual: $${quote.monthlyAmount} · Gastos externos: $${quote.external}</p>
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
            <SectionLabel>{q.doneSectionLabel}</SectionLabel>
            <SectionTitle>
              {q.doneTitleBefore} <span className="text-brand">{q.doneTitleAccent}</span>
            </SectionTitle>
            <p className="mt-3 text-slate-600">
              {q.doneThanks.replace('{name}', state.nombre.split(' ')[0] ?? state.nombre)}
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)] sm:rounded-3xl sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{q.doneProjectLabel}</p>
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
                  {q.doneDeliveryLabel}
                </p>
                <p className="mt-1 font-semibold text-slate-900">{quote.delivery}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {q.doneInvestmentLabel}
                </p>
                <p className="mt-1 text-3xl font-bold tabular-nums text-brand">${quote.initialTotal} USD</p>
                <p className="mt-1 text-xs text-slate-500">Único ${quote.oneTime} · Mensual ${quote.monthlyAmount} · Externos ${quote.external}</p>
              </div>
            </div>
            <p className="mt-5 text-center text-xs leading-relaxed text-slate-500">{q.doneDisclaimer}</p>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3.5 font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
            >
              <Download className="h-5 w-5" />
              {q.downloadPdf}
            </button>
            <a
              href={buildWhatsAppUrl(buildWhatsAppMessage(state, catalog))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-3.5 font-semibold text-emerald-800 transition hover:bg-emerald-100"
            >
              <MessageCircle className="h-5 w-5" />
              {messages.common.whatsapp}
            </a>
          </div>
          <a
            href={`mailto:${INVOICE_BRANDING.email}?subject=${encodeURIComponent(`${q.formalProposalSubject} — ${quote.projectLabel}`)}&body=${encodeURIComponent(buildWhatsAppMessage(state, catalog))}`}
            className="mt-3 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3.5 font-semibold text-white shadow-md transition hover:bg-brand-light"
          >
            {q.requestFormalProposal}
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
        <div className="grid items-start gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-8">
          {/* Formulario primero en móvil; imagen completa debajo */}
          <div className="relative order-2 overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-[0_12px_40px_rgba(15,23,42,0.08)] sm:rounded-3xl lg:order-1 lg:h-full lg:min-h-0">
            <div className="relative aspect-[4/3] w-full lg:absolute lg:inset-0 lg:aspect-auto">
              <Image
                src="/images/cotizador.webp"
                alt={q.pageImageAlt}
                fill
                priority
                unoptimized
                className="object-cover object-center lg:object-[center_18%]"
                sizes="(max-width: 1024px) 100vw, 540px"
              />
            </div>

            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"
              aria-hidden
            />
            <div className="absolute bottom-3 left-3 right-3 z-10 flex justify-end sm:bottom-5 sm:left-auto sm:right-5 lg:bottom-6 lg:right-6">
              <div className="origin-bottom-right sm:rotate-1">
                <QuoteSummaryPanel state={state} overlay />
              </div>
            </div>
          </div>

          <div className="order-1 flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)] sm:rounded-3xl sm:p-6 lg:order-2 lg:p-7">
            <div className="mb-6 flex items-start gap-3 border-b border-slate-100 pb-5">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${BRAND_ICON_TONES.blue.wrap}`}>
                <Calculator className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <p className="font-bold text-slate-900">{q.configuratorTitle}</p>
                <p className="text-sm text-slate-500">{q.configuratorSubtitle}</p>
              </div>
            </div>

            <QuoteProgress step={step} />

            {fromHome && state.projectType && step > 1 ? (
              <div className="mb-4 flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm">
                <p className="text-slate-600">
                  {q.projectSelected}{' '}
                  <span className="font-semibold text-slate-900">{quote.projectLabel}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-brand hover:underline"
                >
                  {q.changeProject}
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
                  <div className="space-y-6">
                    <div>
                      <p className="mb-1 flex items-center gap-2 text-sm font-bold text-slate-900">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                          1
                        </span>
                        Desarrollo web
                      </p>
                      <p className="mb-3 text-xs text-slate-500">
                        Precio base por proyecto, en USD. Puedes elegir uno o varios. Lo adicional se cotiza aparte.
                      </p>
                      <div className="max-h-[22rem] space-y-2 overflow-y-auto pr-1">
                        {WEB_PLANS.map((project) => {
                          const planId = project.id
                          if (!isWebPlanId(planId)) return null
                          const Icon = PROJECT_ICONS[planId] ?? Layout
                          const active = selectedWebIds(state).includes(planId)
                          return (
                            <button
                              key={planId}
                              type="button"
                              onClick={() =>
                                setState((current) => {
                                  const currentIds = selectedWebIds(current)
                                  const nextIds = currentIds.includes(planId)
                                    ? currentIds.filter((id) => id !== planId)
                                    : [...currentIds, planId]
                                  const primary = nextIds[0] ?? null
                                  const primaryPlan = primary ? getCatalogPlan(primary) : null
                                  return {
                                    ...current,
                                    webPlanIds: nextIds,
                                    projectType: primary,
                                    productCount: nextIds.includes('tienda')
                                      ? getCatalogPlan('tienda')?.productsIncluded ?? null
                                      : primaryPlan?.productsIncluded ?? null,
                                    serviceCount: nextIds.includes('reservas')
                                      ? getCatalogPlan('reservas')?.servicesIncluded ?? null
                                      : primaryPlan?.servicesIncluded ?? null,
                                  }
                                })
                              }
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
                                  <p className="shrink-0 text-sm font-bold tabular-nums text-brand">${project.basePrice}</p>
                                </div>
                                <p className="text-xs text-slate-500 sm:text-sm">{project.description}</p>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <p className="mb-1 text-sm font-bold text-slate-900">Marketing digital</p>
                      <p className="mb-3 text-xs text-slate-500">
                        Planes mensuales. La inversión en anuncios no se suma a los honorarios.
                      </p>
                      <div className="space-y-2">
                        {MARKETING_PLANS.map((project) => {
                          const Icon = PROJECT_ICONS[project.id] ?? MessageCircle
                          const active = state.marketingPlan === project.id
                          return (
                            <button
                              key={project.id}
                              type="button"
                              onClick={() =>
                                setState((current) => {
                                  const next = active ? null : (project.id as MarketingPlanId)
                                  const campaigns = next ? getCatalogPlan(next)?.campaignsIncluded ?? 0 : 0
                                  return {
                                    ...current,
                                    marketingPlan: next,
                                    adBudgetChoice: campaigns > 0 ? (current.adBudgetChoice === 'none' ? 'pending' : current.adBudgetChoice) : 'none',
                                    adBudgetAccepted: campaigns > 0 && (current.adBudgetChoice === 'accepted' || current.adBudgetChoice === 'custom'),
                                  }
                                })
                              }
                              className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3.5 text-left transition ${
                                active ? 'border-amber-400 bg-amber-50 ring-2 ring-amber-200' : choiceOff
                              }`}
                            >
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-baseline justify-between gap-2">
                                  <p className="font-semibold text-slate-900">
                                    {project.label}
                                    {project.recommended ? (
                                      <span className="ml-2 rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                                        Recomendado
                                      </span>
                                    ) : null}
                                  </p>
                                  <p className="shrink-0 text-sm font-bold tabular-nums text-amber-800">${project.basePrice}/mes</p>
                                </div>
                                <p className="text-xs text-slate-500 sm:text-sm">{project.description}</p>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ) : null}

                {step === 2 ? (
                  <div>
                    <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                        2
                      </span>
                      {q.step2Question}
                    </p>
                    <p className="mb-4 text-sm text-slate-500">{q.step2Hint}</p>
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2">
                      {catalog.businessTypes.map((business) => {
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
                      {q.step3Question}
                    </p>
                    <p className="mb-3 text-sm text-slate-500">{q.step3Hint}</p>
                    <div
                      className="quote-features-scroll rounded-xl border border-slate-200 bg-slate-50/50 p-2"
                      style={{ height: 252, maxHeight: 252, overflowY: 'scroll', overscrollBehavior: 'contain' }}
                    >
                      <div className="flex flex-col gap-2">
                        {catalog.features.map((feature) => {
                          const active = state.features.includes(feature.id)
                          const included = planAlreadyIncludes(
                            isWebPlanId(state.projectType) ? state.projectType : null,
                            feature.id as FeatureId,
                          )
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
                                    {included || feature.price === 0 ? 'Incluido' : `+$${feature.price}`}
                                  </span>
                                </span>
                                <span className="block text-xs text-slate-500">{feature.description}</span>
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    {isWebPlanId(state.projectType) && getCatalogPlan(state.projectType)?.pagesIncluded ? (
                      <label className="mt-4 block">
                        <span className={labelClass}>Páginas adicionales (${25} c/u)</span>
                        <input
                          type="number"
                          min={0}
                          value={state.extraPages}
                          onChange={(event) => update('extraPages', Math.max(0, Number(event.target.value) || 0))}
                          className={fieldClass}
                        />
                      </label>
                    ) : null}
                    {state.projectType === 'tienda' ? (
                      <label className="mt-4 block">
                        <span className={labelClass}>Productos incluidos en la carga inicial</span>
                        <input
                          type="number"
                          min={1}
                          value={state.productCount ?? ''}
                          onChange={(event) => update('productCount', Math.max(1, Number(event.target.value) || 1))}
                          className={fieldClass}
                        />
                      </label>
                    ) : null}
                    {state.marketingPlan ? (
                      <div className="mt-4 space-y-3 rounded-xl border border-amber-200 bg-amber-50/60 p-3">
                        <p className="text-sm font-semibold text-slate-800">Canales y personalización</p>
                        <div className="flex gap-2">
                          {(['instagram', 'facebook'] as const).map((channel) => {
                            const active = state.channels.includes(channel)
                            return (
                              <button
                                key={channel}
                                type="button"
                                onClick={() =>
                                  setState((current) => ({
                                    ...current,
                                    channels: active
                                      ? current.channels.filter((item) => item !== channel)
                                      : [...current.channels, channel],
                                  }))
                                }
                                className={`rounded-lg border px-3 py-2 text-sm font-semibold capitalize ${active ? choiceOn : choiceOff}`}
                              >
                                {channel}
                              </button>
                            )
                          })}
                        </div>
                        {offer.storiesPriceUsd == null || offer.storiesQuantity == null ? (
                          <p className="rounded-lg bg-white px-3 py-2 text-sm text-amber-900">
                            Las historias no están incluidas. El administrador debe definir precio y cantidad en Comercial antes de añadir este extra.
                          </p>
                        ) : (
                          <label className="flex items-start gap-2 text-sm text-slate-700">
                            <input
                              type="checkbox"
                              className="mt-1"
                              checked={state.includeStories}
                              onChange={(event) =>
                                setState((current) => ({
                                  ...current,
                                  includeStories: event.target.checked,
                                  storiesPerMonth: event.target.checked ? offer.storiesQuantity ?? 0 : 0,
                                  storiesUnitPrice: event.target.checked ? offer.storiesPriceUsd ?? 0 : 0,
                                }))
                              }
                            />
                            <span>
                              Añadir historias: {offer.storiesQuantity}/mes en {offer.storiesPlatform}, ${offer.storiesPriceUsd} al mes.
                              {' '}
                              {offer.storiesContentType}.
                              {offer.storiesIncludesDesign ? ' Incluye diseño.' : ''}
                              {offer.storiesIncludesCopy ? ' Incluye texto.' : ''}
                              {offer.storiesIncludesScheduling ? ' Incluye programación.' : ''}
                            </span>
                          </label>
                        )}
                        {(getCatalogPlan(state.marketingPlan)?.campaignsIncluded ?? 0) > 0 ? (
                          <div className="space-y-2 rounded-lg bg-white p-3">
                            <p className="text-sm font-semibold text-slate-800">Presupuesto publicitario mensual recomendado</p>
                            <p className="text-xs leading-relaxed text-slate-600">{adBudgetRecommendationCopy(offer.recommendedAdBudgetUsd)}</p>
                            <p className="text-xs text-slate-500">El cliente paga este importe a Meta. No forma parte de los honorarios.</p>
                            {([
                              ['pending', 'Dejarlo pendiente de aprobación'],
                              ['accepted', `Aprobar $${offer.recommendedAdBudgetUsd}/mes`],
                              ['custom', 'Indicar otro importe'],
                            ] as const).map(([choice, label]) => (
                              <label key={choice} className="flex items-center gap-2 text-sm text-slate-700">
                                <input
                                  type="radio"
                                  name="ad-budget"
                                  checked={state.adBudgetChoice === choice}
                                  onChange={() =>
                                    setState((current) => ({
                                      ...current,
                                      adBudgetChoice: choice,
                                      adBudgetAccepted: choice === 'accepted' || choice === 'custom',
                                      adBudgetUsd: choice === 'accepted' ? offer.recommendedAdBudgetUsd : current.adBudgetUsd,
                                    }))
                                  }
                                />
                                {label}
                              </label>
                            ))}
                            {state.adBudgetChoice === 'custom' ? (
                              <input
                                type="number"
                                min={1}
                                placeholder="Otro importe mensual USD"
                                value={state.adBudgetUsd || ''}
                                onChange={(event) => update('adBudgetUsd', Math.max(0, Number(event.target.value) || 0))}
                                className={fieldClass}
                              />
                            ) : null}
                            {state.adBudgetChoice === 'pending' ? (
                              <p className="text-xs font-medium text-amber-800">Pendiente. No se suma como gasto autorizado.</p>
                            ) : null}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500">Este plan no incluye gestión de campañas, así que no se propone inversión publicitaria.</p>
                        )}
                      </div>
                    ) : null}
                    <label className="mt-4 block">
                      <span className={labelClass}>Necesidades particulares</span>
                      <textarea
                        value={state.scopeNotes}
                        onChange={(event) => update('scopeNotes', event.target.value)}
                        className={fieldClass}
                        rows={3}
                        placeholder="Páginas, módulos, integraciones o materiales que quieras dejar por escrito."
                      />
                    </label>
                  </div>
                ) : null}

                {step === 4 ? (
                  <div className="space-y-6">
                    <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                        4
                      </span>
                      {q.step4Title}
                    </p>

                    <div>
                      <p className="mb-2 text-sm font-semibold text-slate-800">{q.hasDomainQuestion}</p>
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
                            {option === 'si' ? q.yes : q.noDomainExtra}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-sm font-semibold text-slate-800">{q.hasHostingQuestion}</p>
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
                            {option === 'si' ? q.yes : q.noHostingExtra}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">{q.emailsQuestion}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{q.emailsHint}</p>
                      <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-7">
                        {catalog.emailOptions.map((option) => (
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
                      {q.step5Question}
                    </p>
                    <p className="mb-4 text-sm text-slate-500">{q.step5Hint}</p>
                    <div className="space-y-2.5">
                      {catalog.timelines.map((timeline) => {
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
                      {q.step6Title}
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className={labelClass}>{q.labelName}</label>
                        <input
                          className={fieldClass}
                          value={state.nombre}
                          onChange={(e) => update('nombre', e.target.value)}
                          placeholder={q.placeholderName}
                          autoComplete="name"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>{q.labelCompany}</label>
                        <input
                          className={fieldClass}
                          value={state.empresa}
                          onChange={(e) => update('empresa', e.target.value)}
                          placeholder={q.placeholderCompany}
                          autoComplete="organization"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>{q.labelWhatsapp}</label>
                        <input
                          className={fieldClass}
                          value={state.whatsapp}
                          onChange={(e) => update('whatsapp', e.target.value)}
                          placeholder={q.placeholderWhatsapp}
                          autoComplete="tel"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelClass}>{q.labelEmail}</label>
                        <input
                          type="email"
                          className={fieldClass}
                          value={state.correo}
                          onChange={(e) => update('correo', e.target.value)}
                          placeholder={q.placeholderEmail}
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

            <div className="mt-6 border-t border-slate-100 pt-5">
              <div className="flex items-center justify-between gap-3">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={goBack}
                    className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-brand"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {q.back}
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
                    {q.continue}
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
                    {sending ? q.generating : q.generateProposal}
                  </button>
                )}
              </div>
              <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
                <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {q.footerNote}
              </p>
            </div>
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
