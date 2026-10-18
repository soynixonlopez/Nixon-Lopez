import { adBudgetRecommendationCopy } from '@/lib/commercial-settings'
import { CONTRACT_PAYMENT_BANK, CONTRACT_PAYMENT_YAPPY } from '@/lib/contract-payment'
import { parseConfiguratorFromPayload } from '@/lib/admin-configurator-quote'
import { getTimelineLabel } from '@/lib/quote-configurator'
import type { AdBudgetChoice, CommercialSnapshot } from '@/lib/service-catalog'
import { MARKETING_STORIES_PER_WEEK } from '@/lib/service-catalog'

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

const MUST_AGREE_BEFORE_SIGN = 'Debe acordarse antes de emitir el contrato definitivo.'

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
    return `Preferencia en cotización: ${getTimelineLabel(cfg.timeline)}. ${MUST_AGREE_BEFORE_SIGN}`
  }
  if (hasWeb) return MUST_AGREE_BEFORE_SIGN
  return 'No aplica entrega de proyecto web (solo servicio mensual).'
}

function resolveMarketingStart(commercial: CommercialSnapshot, hasMarketing: boolean, startDefault: string) {
  if (!hasMarketing) return ''
  if (commercial.marketingStartDate?.trim()) return commercial.marketingStartDate.trim()
  if (commercial.startDate?.trim()) return commercial.startDate.trim()
  return MUST_AGREE_BEFORE_SIGN
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
  return Boolean(parseCommercialFromQuotePayload(raw)?.marketingPlanId)
}

export function quotePayloadHasWeb(raw: unknown) {
  const commercial = parseCommercialFromQuotePayload(raw)
  if (!commercial) return false
  return Boolean(commercial.webPlanId || (commercial.webPlans?.length ?? 0) > 0)
}

export function deriveContractTermsFromQuote(raw: unknown): DerivedContractTerms | null {
  const commercial = parseCommercialFromQuotePayload(raw)
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
    derivedAdvance = MUST_AGREE_BEFORE_SIGN
    derivedBalance = MUST_AGREE_BEFORE_SIGN
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
      : `Sin líneas de pago en la cotización. ${MUST_AGREE_BEFORE_SIGN}`

  const derivedRounds = hasWeb ? '2' : hasMarketing ? '1' : '2'

  const derivedMktFirst =
    hasMarketing && monthly > 0
      ? `${fmtUsd(monthly)} (plan y extras mensuales aceptados en cotización; sin presupuesto publicitario).${
          approvedAd > 0 ? ` La pauta aprobada (${fmtUsd(approvedAd)}/mes) se paga aparte a Meta.` : ''
        }`
      : hasMarketing
        ? MUST_AGREE_BEFORE_SIGN
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
  if (hasWeb) {
    customNotes = customNotes ? `${customNotes}\n\n${WEB_REVISION_NOTE}` : WEB_REVISION_NOTE
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
