import { isCourtesyAddonId } from '@/lib/courtesy-addons'
import type { CommercialSnapshot } from '@/lib/service-catalog'

export type EconomicSummaryRow = {
  service: string
  billingType: string
  price: string
  frequency: string
  paymentCondition: string
  dueDate: string
}

function money(amount: number) {
  return `USD $${amount.toFixed(2)}`
}

function billingLabel(kind: 'once' | 'monthly' | 'external') {
  if (kind === 'monthly') return 'Honorario mensual'
  if (kind === 'external') return 'Gasto externo (tercero)'
  return 'Pago único'
}

function isBillableContractLine(id: string, label: string) {
  if (id.startsWith('feature-')) {
    const featureId = id.slice('feature-'.length)
    if (isCourtesyAddonId(featureId)) return false
  }
  if (/whatsapp|formulario de contacto|cortes[ií]a/i.test(label) && !/extra|adicional/i.test(label)) {
    return false
  }
  return true
}

export function buildEconomicSummaryRows(snapshot: CommercialSnapshot): EconomicSummaryRow[] {
  const rows: EconomicSummaryRow[] = []
  const totals = snapshot.totals
  const hasWeb = Boolean(snapshot.webPlanId || (snapshot.webPlans?.length ?? 0) > 0)

  for (const line of totals.lines) {
    if (!isBillableContractLine(line.id, line.label)) continue
    if (line.amount <= 0 && line.billing !== 'external') continue
    rows.push({
      service: line.label,
      billingType: billingLabel(line.billing),
      price: money(line.amount),
      frequency: line.billing === 'monthly' ? 'Mensual' : line.billing === 'once' ? 'Una vez' : 'Según consumo',
      paymentCondition:
        line.billing === 'external'
          ? 'Lo paga el cliente al proveedor; no es honorario del prestador'
          : line.billing === 'monthly'
            ? 'Vencimiento mensual acordado'
            : 'Según calendario del contrato (anticipo / saldo)',
      dueDate: line.billing === 'monthly' ? snapshot.marketingFirstPayment?.trim() || 'Primer mes acordado' : 'Ver calendario',
    })
  }

  if (hasWeb && totals.oneTime > 0) {
    const advance = Number((totals.oneTime / 2).toFixed(2))
    const balance = Number((totals.oneTime - advance).toFixed(2))
    rows.push({
      service: 'Anticipo desarrollo web (50%)',
      billingType: 'Pago único',
      price: money(advance),
      frequency: 'Una vez',
      paymentCondition: 'Antes de iniciar el desarrollo',
      dueDate: snapshot.startDate?.trim() || 'Al firmar y antes del inicio',
    })
    rows.push({
      service: 'Saldo desarrollo web (50%)',
      billingType: 'Pago único',
      price: money(balance),
      frequency: 'Una vez',
      paymentCondition: 'Al finalizar y antes de la entrega definitiva',
      dueDate: 'Al completar el desarrollo',
    })
  }

  const managesAds = (snapshot.campaigns ?? 0) > 0
  const approvedAd = snapshot.approvedAdBudgetUsd ?? totals.approvedAdBudget ?? 0
  const recommended = snapshot.recommendedAdBudgetUsd ?? totals.recommendedAdBudget ?? 0
  const choice = snapshot.adBudgetChoice

  if (managesAds && approvedAd > 0) {
    rows.push({
      service: 'Presupuesto publicitario aprobado (Meta Ads)',
      billingType: 'Gasto externo (tercero)',
      price: money(approvedAd),
      frequency: 'Mensual',
      paymentCondition: 'Pago del cliente a Meta; no honorario del prestador',
      dueDate: 'Según activación de campañas',
    })
  } else if (managesAds && choice === 'pending' && recommended > 0) {
    rows.push({
      service: 'Presupuesto publicitario recomendado',
      billingType: 'Orientativo',
      price: money(recommended),
      frequency: 'Mensual (si se aprueba)',
      paymentCondition: 'Pendiente de aprobación; no constituye gasto autorizado',
      dueDate: '—',
    })
  }

  return rows
}

export function buildEconomicTotalsFootnotes(snapshot: CommercialSnapshot) {
  const totals = snapshot.totals
  const approvedAd = snapshot.approvedAdBudgetUsd ?? totals.approvedAdBudget ?? 0
  const lines: string[] = []

  if (totals.oneTime > 0) {
    lines.push(`Total desarrollo web (pago único): ${money(totals.oneTime)}.`)
  }
  if (totals.monthly > 0) {
    lines.push(`Honorarios mensuales de marketing (y extras recurrentes en cotización): ${money(totals.monthly)}/mes.`)
  }
  lines.push(`Honorarios iniciales exigibles (web + primer mes, sin pauta): ${money(totals.initialFees)}.`)
  if (approvedAd > 0) {
    lines.push(
      `Importe inicial estimado con pauta aprobada: ${money(totals.projectedInitial ?? totals.initialFees + approvedAd)} (incluye pauta pagada a Meta, no al prestador).`,
    )
    lines.push(`Importe mensual recurrente con pauta: ${money(totals.projectedMonthly ?? totals.monthly + approvedAd)}/mes.`)
  } else if (totals.monthly > 0) {
    lines.push(`Importe mensual recurrente (honorarios): ${money(totals.nextMonthly)}/mes.`)
  }
  lines.push('Los agregados de cortesía no aparecen como líneas económicas independientes.')

  return lines
}
