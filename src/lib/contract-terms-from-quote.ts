import { adBudgetRecommendationCopy } from '@/lib/commercial-settings'
import { CONTRACT_PAYMENT_BANK, CONTRACT_PAYMENT_YAPPY } from '@/lib/contract-payment'
import { parseConfiguratorFromPayload } from '@/lib/admin-configurator-quote'
import { mergeCourtesyCatalog } from '@/lib/courtesy-addons'
import { extractQuoteServiceSnapshots } from '@/lib/quote-pricing'
import {
  buildCommercialSnapshot,
  getTimelineLabel,
  mapLegacyServiceToMarketing,
  mapLegacyServiceToProject,
} from '@/lib/quote-configurator'
import type { AdBudgetChoice, BillingKind, CommercialSnapshot, CommercialTotals, MarketingPlanId, WebPlanId } from '@/lib/service-catalog'
import {
  MARKETING_STORIES_PER_WEEK,
  getCatalogPlan,
  isMarketingPlanId,
  isWebPlanId,
} from '@/lib/service-catalog'

export type DerivedContractTerms = {
  revisionRounds: string
  paymentMethod: string
  advanceNote: string
  balanceNote: string
  paymentSchedule: string
  startDate: string
  deliveryDate: string
  marketingStartDate: string
  marketingFirstPayment: string
  termNote: string
  renewalNote: string
  terminationNote: string
  customNotes: string
}

const DEFAULT_WEB_DELIVERY =
  'Plazo según la cotización aceptada; el conteo inicia con el anticipo acordado y la entrega de materiales por el cliente.'

const STANDARD_WORK_CLARIFICATION = `Forma de trabajo Nixon López Services: alcance y precios congelados según la cotización aceptada; pagos en las fechas pactadas; revisiones dentro del límite contratado; cambios fuera de alcance se cotizan por separado; el cliente aprueba diseños/contenidos y entrega materiales y accesos a tiempo.`

const WEB_REVISION_NOTE =
  'Cada ronda de revisión del desarrollo web corresponde a un conjunto consolidado de observaciones sobre el trabajo entregado. Los cambios que amplíen el alcance, agreguen funcionalidades o incorporen nuevas páginas se cotizan por separado.'

function fmtUsd(amount: number) {
  return `USD $${amount.toFixed(2)}`
}

function pickText(existing: string | null | undefined, derived: string) {
  const value = (existing ?? '').trim()
  return value || derived
}

function pickRounds(existing: number | null | undefined, derived: string) {
  if (existing != null && Number.isFinite(existing) && existing >= 0) return String(existing)
  return derived
}

function splitWeb50(total: number) {
  const advance = Number((total / 2).toFixed(2))
  const balance = Number((total - advance).toFixed(2))
  return { advance, balance }
}

function defaultPaymentMethod() {
  return `Transferencia bancaria: ${CONTRACT_PAYMENT_BANK.bankName}, ${CONTRACT_PAYMENT_BANK.accountType}, titular ${CONTRACT_PAYMENT_BANK.holder}, cuenta ${CONTRACT_PAYMENT_BANK.accountNumber}. También ${CONTRACT_PAYMENT_YAPPY.title} (${CONTRACT_PAYMENT_YAPPY.displayName}, tel. ${CONTRACT_PAYMENT_YAPPY.phone}).`
}

function resolveDelivery(raw: unknown, commercial: CommercialSnapshot, hasWeb: boolean) {
  if (commercial.deliveryDate?.trim()) return commercial.deliveryDate.trim()
  const cfg = parseConfiguratorFromPayload(raw)
  if (cfg?.deliveryDate?.trim()) return cfg.deliveryDate.trim()
  if (hasWeb && cfg?.timeline) {
    return `Preferencia en cotización: ${getTimelineLabel(cfg.timeline)}. ${DEFAULT_WEB_DELIVERY}`
  }
  if (hasWeb) return DEFAULT_WEB_DELIVERY
  return 'No aplica entrega de proyecto web (solo servicio mensual).'
}

function resolveMarketingStart(commercial: CommercialSnapshot, hasMarketing: boolean, startDefault: string) {
  if (!hasMarketing) return ''
  if (commercial.marketingStartDate?.trim()) return commercial.marketingStartDate.trim()
  if (commercial.startDate?.trim()) return commercial.startDate.trim()
  return startDefault
}

function adBudgetScheduleLine(commercial: CommercialSnapshot) {
  const recommended = commercial.recommendedAdBudgetUsd ?? commercial.totals.recommendedAdBudget ?? 150
  const approved = commercial.approvedAdBudgetUsd ?? commercial.totals.approvedAdBudget ?? 0
  const choice: AdBudgetChoice =
    commercial.adBudgetChoice ??
    (approved > 0 ? (commercial.adBudgetUsd === recommended ? 'accepted' : 'custom') : 'none')
  const managesAds = (commercial.campaigns ?? 0) > 0
  if (!managesAds) return 'Presupuesto publicitario: no aplica (plan sin gestión de campañas).'
  if (choice === 'accepted' && approved > 0) {
    return `Presupuesto publicitario aprobado: ${fmtUsd(approved)}/mes — pago del cliente a Meta (no honorario).`
  }
  if (choice === 'custom' && approved > 0) {
    return `Presupuesto publicitario personalizado aprobado: ${fmtUsd(approved)}/mes — pago del cliente a Meta (no honorario).`
  }
  if (choice === 'pending') {
    return `Presupuesto publicitario recomendado: ${fmtUsd(recommended)}/mes — pendiente de aprobación; no constituye gasto autorizado.`
  }
  return 'Presupuesto publicitario: no contratado o no definido en esta cotización.'
}

function monthlyExtrasLines(commercial: CommercialSnapshot) {
  const basePlan = commercial.totals.lines.find((line) => line.id.startsWith('project-mkt-'))
  const baseAmount = basePlan?.amount ?? 0
  return commercial.totals.lines.filter(
    (line) => line.billing === 'monthly' && line.amount > 0 && line.id !== basePlan?.id,
  )
}

function synthesizeCommercialFromLegacyPayload(raw: unknown): CommercialSnapshot | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const payload = raw as Record<string, unknown>
  const services = extractQuoteServiceSnapshots(raw)

  let webPlanId: WebPlanId | null = null
  let marketingPlanId: MarketingPlanId | null = null
  for (const service of services) {
    if (isWebPlanId(service.serviceId)) webPlanId = webPlanId ?? service.serviceId
    if (isMarketingPlanId(service.serviceId)) marketingPlanId = service.serviceId
  }

  const tipoRaw = payload.tipoServicio ?? payload.service_id ?? payload.serviceId
  const tipo = typeof tipoRaw === 'string' ? tipoRaw : ''
  if (!webPlanId) {
    if (isWebPlanId(tipo)) webPlanId = tipo
    else {
      const mapped = mapLegacyServiceToProject(tipo)
      if (mapped && isWebPlanId(mapped)) webPlanId = mapped
    }
  }
  if (!marketingPlanId) {
    if (isMarketingPlanId(tipo)) marketingPlanId = tipo
    else {
      const mappedMkt = mapLegacyServiceToMarketing(tipo)
      if (mappedMkt) marketingPlanId = mappedMkt
    }
  }

  if (!webPlanId && !marketingPlanId) return null

  const lines: CommercialTotals['lines'] = []
  const breakdown = payload.breakdown
  if (breakdown && typeof breakdown === 'object' && !Array.isArray(breakdown)) {
    const breakdownLines = (breakdown as { lines?: unknown }).lines
    if (Array.isArray(breakdownLines)) {
      for (const row of breakdownLines) {
        if (!row || typeof row !== 'object' || Array.isArray(row)) continue
        const label = typeof (row as { label?: unknown }).label === 'string' ? (row as { label: string }).label : ''
        const amount = Number((row as { amount?: unknown }).amount)
        if (!label || !Number.isFinite(amount)) continue
        const monthlyHint =
          services.some((service) => service.monthly && service.lines.some((line) => line.label === label)) ||
          /mensual/i.test(label)
        const billing: BillingKind = monthlyHint ? 'monthly' : 'once'
        lines.push({ id: `line-${lines.length}`, label, amount, billing })
      }
    }
  }

  if (lines.length === 0) {
    for (const service of services) {
      const billing: BillingKind = service.monthly ? 'monthly' : 'once'
      lines.push({
        id: `project-${service.serviceId}`,
        label: service.label,
        amount: service.baseAmount > 0 ? service.baseAmount : service.total,
        billing,
      })
    }
  }

  if (lines.length === 0) {
    const totalNumeric = Number(payload.totalNumeric ?? payload.total_amount)
    if (Number.isFinite(totalNumeric) && totalNumeric > 0) {
      const monthly = services[0]?.monthly ?? payload.monthly === true
      lines.push({
        id: webPlanId ? `project-${webPlanId}` : `project-${marketingPlanId}`,
        label: typeof payload.servicio === 'string' ? payload.servicio : 'Servicio contratado',
        amount: totalNumeric,
        billing: monthly ? 'monthly' : 'once',
      })
    }
  }

  if (lines.length === 0) return null

  const oneTime = lines.filter((line) => line.billing === 'once').reduce((sum, line) => sum + line.amount, 0)
  const monthly = lines.filter((line) => line.billing === 'monthly').reduce((sum, line) => sum + line.amount, 0)
  const initialFees = oneTime + monthly
  const webs = webPlanId ? [getCatalogPlan(webPlanId)].filter(Boolean) : []
  const marketing = marketingPlanId ? getCatalogPlan(marketingPlanId) : null
  const cfg = parseConfiguratorFromPayload(raw)

  return {
    webPlanId,
    marketingPlanId,
    webPlans: webPlanId
      ? [{ id: webPlanId, label: getCatalogPlan(webPlanId)?.label ?? webPlanId, basePrice: getCatalogPlan(webPlanId)?.basePrice ?? oneTime }]
      : undefined,
    webLabel: webs.map((plan) => plan!.label).join(' + ') || null,
    marketingLabel: marketing?.label ?? null,
    channels: cfg?.channels ?? ['instagram', 'facebook'],
    postsPerMonth: marketing?.postsPerMonth ?? null,
    reelsPerMonth: marketing?.reelsPerMonth ?? null,
    campaigns: marketing?.campaignsIncluded ?? null,
    storiesIncluded: Boolean(marketing),
    storiesPerWeek: marketing ? MARKETING_STORIES_PER_WEEK : undefined,
    storiesPerMonth: marketing ? MARKETING_STORIES_PER_WEEK * 4 : 0,
    storiesUnitPrice: 0,
    pagesIncluded: webPlanId ? getCatalogPlan(webPlanId)?.pagesIncluded ?? null : null,
    extraPages: cfg?.extraPages ?? 0,
    productsIncluded: cfg?.productCount ?? getCatalogPlan(webPlanId)?.productsIncluded ?? null,
    servicesIncluded: cfg?.serviceCount ?? getCatalogPlan(webPlanId)?.servicesIncluded ?? null,
    adminModulesNote: webPlanId && getCatalogPlan(webPlanId)?.hasAdmin
      ? 'El cliente administra solo los contenidos o módulos descritos en el alcance.'
      : null,
    scopeNotes: cfg?.scopeNotes?.trim() ?? '',
    includes: [...webs.flatMap((plan) => [...plan!.includes]), ...(marketing?.includes ?? [])],
    excludes: [...webs.flatMap((plan) => [...plan!.excludes]), ...(marketing?.excludes ?? [])],
    totals: {
      lines,
      oneTime,
      monthly,
      external: 0,
      initialFees,
      nextMonthly: monthly,
      approvedAdBudget: 0,
      pendingAdBudget: 0,
      recommendedAdBudget: marketing?.campaignsIncluded ? 150 : 0,
      projectedInitial: initialFees,
      projectedMonthly: monthly,
      taxRate: null,
      taxAmount: 0,
      storiesPending: false,
    },
    revisionRounds: null,
    startDate: '',
    deliveryDate: '',
    paymentMethod: '',
    advanceNote: '',
    balanceNote: '',
    adBudgetUsd: 0,
    adBudgetAccepted: false,
    paymentSchedule: '',
    termNote: '',
    renewalNote: '',
    terminationNote: '',
  }
}

export function resolveCommercialSnapshotForContract(raw: unknown): CommercialSnapshot | null {
  const existing = parseCommercialFromQuotePayload(raw)
  if (existing) return existing

  const cfg = parseConfiguratorFromPayload(raw)
  if (cfg) {
    const built = buildCommercialSnapshot(cfg, { courtesyCatalog: mergeCourtesyCatalog([]) })
    if (built) return built
  }

  return synthesizeCommercialFromLegacyPayload(raw)
}

export function enrichQuotePayloadForContract(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const base = { ...(raw as Record<string, unknown>) }
  const commercial = resolveCommercialSnapshotForContract(raw)
  if (commercial) {
    base.commercial = {
      ...(typeof base.commercial === 'object' && base.commercial != null && !Array.isArray(base.commercial)
        ? (base.commercial as Record<string, unknown>)
        : {}),
      ...commercial,
    }
  }
  return base
}

export function parseCommercialFromQuotePayload(raw: unknown): CommercialSnapshot | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const commercial = (raw as Record<string, unknown>).commercial
  if (!commercial || typeof commercial !== 'object' || Array.isArray(commercial)) return null
  const value = commercial as Partial<CommercialSnapshot>
  const hasWeb = Boolean(value.webPlanId || (Array.isArray(value.webPlans) && value.webPlans.length > 0))
  const hasMarketing = Boolean(value.marketingPlanId)
  if (!hasWeb && !hasMarketing) return null
  if (!value.totals || typeof value.totals !== 'object') return null
  return value as CommercialSnapshot
}

export function quotePayloadHasMarketing(raw: unknown) {
  return Boolean(resolveCommercialSnapshotForContract(raw)?.marketingPlanId)
}

export function quotePayloadHasWeb(raw: unknown) {
  const commercial = resolveCommercialSnapshotForContract(raw)
  if (!commercial) return false
  return Boolean(commercial.webPlanId || (commercial.webPlans?.length ?? 0) > 0)
}

export type QuoteContractMeta = {
  totalAmount?: number | null
  serviceId?: string | null
  serviceLabel?: string | null
}

export function deriveContractTermsFromQuote(
  raw: unknown,
  meta?: QuoteContractMeta,
): DerivedContractTerms | null {
  let commercial = resolveCommercialSnapshotForContract(raw)
  if (!commercial && meta?.totalAmount != null && meta.totalAmount > 0) {
    const syntheticRaw = {
      ...(raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {}),
      totalNumeric: meta.totalAmount,
      servicio: meta.serviceLabel ?? 'Servicio contratado',
      tipoServicio: meta.serviceId ?? undefined,
      monthly: isMarketingPlanId(meta.serviceId ?? ''),
    }
    commercial = synthesizeCommercialFromLegacyPayload(syntheticRaw)
  }
  if (!commercial) return null

  const totals = commercial.totals
  const oneTime = totals.oneTime ?? 0
  const monthly = totals.monthly ?? 0
  const approvedAd = totals.approvedAdBudget ?? commercial.approvedAdBudgetUsd ?? 0
  const hasWeb = quotePayloadHasWeb(raw)
  const hasMarketing = Boolean(commercial.marketingPlanId)
  const webLabel = commercial.webLabel?.trim() || 'desarrollo web'
  const mktLabel = commercial.marketingLabel?.trim() || 'marketing digital'
  const storiesPerWeek = commercial.storiesPerWeek ?? MARKETING_STORIES_PER_WEEK

  const startDefault = new Date().toLocaleDateString('es-PA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  let derivedAdvance = ''
  let derivedBalance = ''
  const scheduleLines: string[] = []

  if (hasWeb && oneTime > 0) {
    const { advance, balance } = splitWeb50(oneTime)
    derivedAdvance = `Anticipo del desarrollo web: ${fmtUsd(advance)} (50% de ${fmtUsd(oneTime)}), pagadero antes de iniciar el proyecto.`
    derivedBalance = `Saldo del desarrollo web: ${fmtUsd(balance)} (50% restante), pagadero al finalizar el desarrollo y antes de la entrega definitiva.`
    scheduleLines.push(`${webLabel} (pago único): ${fmtUsd(oneTime)}`)
    scheduleLines.push(`Anticipo web (50%): ${fmtUsd(advance)} — al inicio`)
    scheduleLines.push(`Saldo web (50%): ${fmtUsd(balance)} — al finalizar, antes de la entrega definitiva`)
  } else if (hasWeb) {
    derivedAdvance = 'Anticipo del desarrollo web: 50% del total acordado en cotización, antes de iniciar.'
    derivedBalance = 'Saldo del desarrollo web: 50% restante, al finalizar y antes de la entrega definitiva.'
  }

  if (hasMarketing) {
    const extras = monthlyExtrasLines(commercial)
    const extrasTotal = extras.reduce((sum, line) => sum + line.amount, 0)
    const firstMonthFees = monthly
    if (!hasWeb) {
      derivedAdvance = `Primer pago mensual de honorarios: ${fmtUsd(firstMonthFees)}.`
      derivedBalance = 'No aplica saldo de desarrollo web.'
    }
    scheduleLines.push(`${mktLabel} (honorarios): ${fmtUsd(firstMonthFees)}/mes`)
    for (const extra of extras) {
      scheduleLines.push(`Extra mensual (${extra.label}): ${fmtUsd(extra.amount)}/mes`)
    }
    scheduleLines.push(
      `Historias: incluidas — ${storiesPerWeek} por semana (aprox. ${storiesPerWeek * 4} en cuatro semanas; obligación semanal).`,
    )
  }

  scheduleLines.push(adBudgetScheduleLine(commercial))

  const derivedSchedule =
    scheduleLines.length > 0
      ? scheduleLines.join('\n')
      : 'Calendario según montos de la cotización aceptada (ver anexo económico).'

  const derivedRounds = hasWeb ? '2' : hasMarketing ? '1' : '2'

  const derivedMktFirst =
    hasMarketing && monthly > 0
      ? `${fmtUsd(monthly)} (plan y extras mensuales aceptados en cotización; sin presupuesto publicitario).${
          approvedAd > 0 ? ` La pauta aprobada (${fmtUsd(approvedAd)}/mes) se paga aparte a Meta.` : ''
        }`
      : hasMarketing
        ? 'Honorarios mensuales según plan contratado en cotización.'
        : ''

  const derivedTerm =
    hasWeb && hasMarketing
      ? `Desarrollo web: desde la fecha de inicio acordada hasta la entrega del proyecto y el cumplimiento de las condiciones de entrega. Marketing: servicio mensual con la duración inicial y condiciones acordadas.`
      : hasWeb
        ? 'Desde la fecha de inicio acordada hasta la entrega del proyecto y el cumplimiento de las condiciones de entrega establecidas.'
        : 'Servicio mensual de marketing con la duración inicial y las condiciones acordadas entre las partes.'

  const derivedRenewal = hasMarketing
    ? 'Renovación mensual según las condiciones de renovación aceptadas por las partes.'
    : 'No aplica renovación automática del desarrollo web.'

  const derivedTermination = hasMarketing
    ? 'Terminación según el mecanismo de cancelación y el preaviso acordados expresamente entre las partes.'
    : 'Terminación conforme a incumplimiento de pago, falta de materiales del cliente o cláusulas generales del contrato.'

  let customNotes = commercial.scopeNotes?.trim() ?? ''
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const comments = (raw as Record<string, unknown>).comments
    if (typeof comments === 'string' && comments.trim()) {
      customNotes = customNotes ? `${customNotes}\n\n${comments.trim()}` : comments.trim()
    }
  }
  customNotes = customNotes
    ? `${customNotes}\n\n${STANDARD_WORK_CLARIFICATION}`
    : STANDARD_WORK_CLARIFICATION
  if (hasWeb) {
    customNotes = `${customNotes}\n\n${WEB_REVISION_NOTE}`
  }
  const managesAds = (commercial.campaigns ?? 0) > 0
  const recommended = commercial.recommendedAdBudgetUsd ?? totals.recommendedAdBudget ?? 150
  if (managesAds && recommended > 0) {
    customNotes = customNotes
      ? `${customNotes}\n\n${adBudgetRecommendationCopy(recommended)}`
      : adBudgetRecommendationCopy(recommended)
  }

  return {
    revisionRounds: pickRounds(commercial.revisionRounds, derivedRounds),
    paymentMethod: pickText(commercial.paymentMethod, defaultPaymentMethod()),
    advanceNote: pickText(commercial.advanceNote, derivedAdvance),
    balanceNote: pickText(commercial.balanceNote, derivedBalance),
    paymentSchedule: pickText(commercial.paymentSchedule, derivedSchedule),
    startDate: pickText(commercial.startDate, startDefault),
    deliveryDate: pickText(commercial.deliveryDate, resolveDelivery(raw, commercial, hasWeb)),
    marketingStartDate: pickText(commercial.marketingStartDate, resolveMarketingStart(commercial, hasMarketing, startDefault)),
    marketingFirstPayment: pickText(commercial.marketingFirstPayment, derivedMktFirst),
    termNote: pickText(commercial.termNote, derivedTerm),
    renewalNote: pickText(commercial.renewalNote, derivedRenewal),
    terminationNote: pickText(commercial.terminationNote, derivedTermination),
    customNotes,
  }
}
