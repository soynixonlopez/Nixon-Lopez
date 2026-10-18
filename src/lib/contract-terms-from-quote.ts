import { CONTRACT_PAYMENT_BANK, CONTRACT_PAYMENT_YAPPY } from '@/lib/contract-payment'
import type { CommercialSnapshot } from '@/lib/service-catalog'

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

function defaultPaymentMethod() {
  return `${CONTRACT_PAYMENT_BANK.title}: ${CONTRACT_PAYMENT_BANK.bankName}, ${CONTRACT_PAYMENT_BANK.accountType}, titular ${CONTRACT_PAYMENT_BANK.holder}, cuenta ${CONTRACT_PAYMENT_BANK.accountNumber}. ${CONTRACT_PAYMENT_YAPPY.title}: ${CONTRACT_PAYMENT_YAPPY.displayName}, tel. ${CONTRACT_PAYMENT_YAPPY.phone}.`
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
  const commercial = parseCommercialFromQuotePayload(raw)
  return Boolean(commercial?.marketingPlanId)
}

export function deriveContractTermsFromQuote(raw: unknown): DerivedContractTerms | null {
  const commercial = parseCommercialFromQuotePayload(raw)
  if (!commercial) return null

  const totals = commercial.totals
  const oneTime = totals.oneTime ?? 0
  const monthly = totals.monthly ?? 0
  const initialFees = totals.initialFees ?? oneTime + monthly
  const approvedAd = totals.approvedAdBudget ?? commercial.approvedAdBudgetUsd ?? 0
  const projectedMonthly = totals.projectedMonthly ?? monthly + approvedAd

  const hasWeb = Boolean(commercial.webPlanId || (commercial.webPlans?.length ?? 0) > 0)
  const hasMarketing = Boolean(commercial.marketingPlanId)
  const webLabel = commercial.webLabel?.trim() || 'desarrollo web'
  const mktLabel = commercial.marketingLabel?.trim() || 'marketing digital'

  const derivedRounds = hasWeb ? '2' : hasMarketing ? '1' : '2'

  const advanceParts: string[] = []
  if (oneTime > 0) advanceParts.push(`${fmtUsd(oneTime)} por ${webLabel}`)
  if (monthly > 0 && hasMarketing) {
    advanceParts.push(`${fmtUsd(monthly)} por el primer mes de honorarios de ${mktLabel}`)
  }
  const derivedAdvance =
    advanceParts.length > 0
      ? `Al inicio: ${advanceParts.join('; ')}. Honorarios al arranque (sin pauta): ${fmtUsd(initialFees)}.${
          approvedAd > 0 ? ` Pauta aprobada en cotización: ${fmtUsd(approvedAd)}/mes (no es honorario).` : ''
        }`
      : `Según cotización aceptada: honorarios iniciales ${fmtUsd(initialFees)}.`

  let derivedBalance = 'Sin saldo pendiente salvo acuerdo escrito entre las partes.'
  if (oneTime > 0) {
    derivedBalance = `${webLabel} (${fmtUsd(oneTime)}): sin saldo posterior si se cubre íntegro al inicio. Cualquier fraccionamiento distinto debe constar por escrito.`
  } else if (hasMarketing) {
    derivedBalance = 'No aplica saldo único; los honorarios de marketing son mensuales.'
  }

  const scheduleLines: string[] = []
  let step = 1
  if (oneTime > 0) {
    scheduleLines.push(`${step++}. ${webLabel} (pago único): ${fmtUsd(oneTime)} — al inicio del proyecto.`)
  }
  if (monthly > 0 && hasMarketing) {
    scheduleLines.push(
      `${step++}. Honorarios ${mktLabel}: ${fmtUsd(monthly)}/mes — primer cargo al inicio del servicio mensual.`,
    )
  }
  if (approvedAd > 0) {
    scheduleLines.push(
      `${step++}. Presupuesto publicitario aprobado: ${fmtUsd(approvedAd)}/mes — destinado a plataforma; no forma parte de honorarios.`,
    )
  }
  if (hasMarketing && approvedAd > 0 && projectedMonthly > monthly) {
    scheduleLines.push(
      `${step++}. Compromiso mensual estimado (honorarios + pauta aprobada): ${fmtUsd(projectedMonthly)}/mes mientras continúe el servicio.`,
    )
  }
  const derivedSchedule =
    scheduleLines.length > 0 ? scheduleLines.join('\n') : `Pagos según montos de la cotización: ${fmtUsd(initialFees)} al inicio.`

  const startDefault = new Date().toLocaleDateString('es-PA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const derivedDelivery = hasWeb
    ? 'Plazo según alcance contratado; cuenta desde el pago inicial y la entrega de materiales por el cliente.'
    : 'No aplica entrega de proyecto web (solo servicio mensual).'

  const derivedMktStart = hasMarketing
    ? 'Puede coincidir con la fecha de inicio general o iniciar en el mes que acuerden (independiente de la entrega web si aplica).'
    : ''

  const derivedMktFirst =
    hasMarketing && monthly > 0
      ? `${fmtUsd(monthly)} por honorarios${
          approvedAd > 0 ? `; pauta aprobada ${fmtUsd(approvedAd)}/mes por separado` : ''
        }.`
      : hasMarketing
        ? 'Según honorarios mensuales de la cotización.'
        : ''

  const derivedTerm =
    hasWeb && hasMarketing
      ? 'Desarrollo web: vigente hasta entrega y aceptación. Marketing: servicio mensual mientras esté activo.'
      : hasWeb
        ? 'Vigente hasta la entrega y aceptación del proyecto web.'
        : 'Vigencia mensual del servicio de marketing, renovable mes a mes.'

  const derivedRenewal = hasMarketing
    ? hasWeb
      ? 'Marketing: renovación mes a mes salvo terminación conforme a este contrato. Web: sin renovación automática.'
      : 'Renovación mes a mes salvo aviso de terminación conforme al contrato.'
    : 'No aplica renovación automática del desarrollo web.'

  const derivedTermination =
    hasWeb && hasMarketing
      ? 'Cada servicio (web y marketing) puede terminarse según lo pactado; terminar el marketing no libera obligaciones pendientes del desarrollo web.'
      : hasWeb
        ? 'Terminación por incumplimiento de pago o falta de materiales del cliente; demás condiciones en cláusulas generales.'
        : 'Terminación con aviso previo acordado; no hay reembolso del mes en curso salvo pacto expreso.'

  let customNotes = commercial.scopeNotes?.trim() ?? ''
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const comments = (raw as Record<string, unknown>).comments
    if (typeof comments === 'string' && comments.trim()) {
      customNotes = customNotes ? `${customNotes}\n\n${comments.trim()}` : comments.trim()
    }
  }

  return {
    revisionRounds: pickRounds(commercial.revisionRounds, derivedRounds),
    paymentMethod: pickText(commercial.paymentMethod, defaultPaymentMethod()),
    advanceNote: pickText(commercial.advanceNote, derivedAdvance),
    balanceNote: pickText(commercial.balanceNote, derivedBalance),
    paymentSchedule: pickText(commercial.paymentSchedule, derivedSchedule),
    startDate: pickText(commercial.startDate, startDefault),
    deliveryDate: pickText(commercial.deliveryDate, derivedDelivery),
    marketingStartDate: pickText(commercial.marketingStartDate, derivedMktStart),
    marketingFirstPayment: pickText(commercial.marketingFirstPayment, derivedMktFirst),
    termNote: pickText(commercial.termNote, derivedTerm),
    renewalNote: pickText(commercial.renewalNote, derivedRenewal),
    terminationNote: pickText(commercial.terminationNote, derivedTermination),
    customNotes,
  }
}
