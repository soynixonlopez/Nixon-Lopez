import { isCourtesyAddonId } from '@/lib/courtesy-addons'
import {
  buildWebInstallmentEconomicRows,
  resolveWebInstallmentPlan,
} from '@/lib/contract-web-installments'
import {
  PRICE_DOMAIN_RENEWAL_ANNUAL_USD,
  PRICE_EMAIL_RENEWAL_ANNUAL_USD,
  PRICE_HOSTING_RENEWAL_ANNUAL_USD,
  PRICE_INFRA_FIRST_YEAR_BUNDLE_USD,
  collapseExternalInfraLinesForContract,
  externalInfraPaymentCondition,
  type CommercialSnapshot,
} from '@/lib/service-catalog'

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

function externalFrequency(line: { id: string }) {
  if (line.id === 'infra-year1' || line.id === 'domain-email-year1') return '1.er año (paquete)'
  if (line.id === 'domain' || line.id === 'hosting' || line.id === 'emails') return 'Referencia anual'
  return 'Según consumo'
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
  const webLabel =
    snapshot.webLabel?.trim() ||
    snapshot.webPlans?.map((p) => p.label).join(' + ') ||
    'Desarrollo web acordado'

  for (const line of collapseExternalInfraLinesForContract(totals.lines)) {
    if (line.billing === 'once') continue
    if (!isBillableContractLine(line.id, line.label)) continue
    if (line.amount <= 0 && line.billing !== 'external') continue
    const displayAmount = line.id === 'infra-year1' ? PRICE_INFRA_FIRST_YEAR_BUNDLE_USD : line.amount
    rows.push({
      service: line.label,
      billingType: billingLabel(line.billing),
      price: money(displayAmount),
      frequency: line.billing === 'monthly' ? 'Mensual' : line.billing === 'external' ? externalFrequency(line) : 'Según consumo',
      paymentCondition:
        line.billing === 'external' ? externalInfraPaymentCondition(line.id) : 'Vencimiento mensual acordado',
      dueDate: line.billing === 'monthly' ? snapshot.marketingFirstPayment?.trim() || 'Primer mes acordado' : 'Ver calendario',
    })
  }

  if (hasWeb && totals.oneTime > 0) {
    const plan = resolveWebInstallmentPlan(snapshot)
    const totalBilling =
      plan === 'single'
        ? 'Pago único (honorarios web)'
        : plan === 'three-thirds'
          ? 'Honorarios web (3 cuotas)'
          : 'Honorarios web (2 cuotas 50/50)'

    rows.push({
      service: webLabel,
      billingType: totalBilling,
      price: money(totals.oneTime),
      frequency: plan === 'single' ? 'Una vez' : `${plan === 'three-thirds' ? '3' : '2'} pagos`,
      paymentCondition: 'Total de honorarios del desarrollo web aceptado en cotización',
      dueDate: 'Ver calendario de pagos del contrato',
    })

    for (const inst of buildWebInstallmentEconomicRows(totals.oneTime, plan, {
      start: snapshot.startDate,
      delivery: snapshot.deliveryDate,
    })) {
      rows.push({
        service: inst.service,
        billingType: plan === 'single' ? 'Pago único' : 'Cuota de honorarios',
        price: money(inst.amount),
        frequency: 'Una vez',
        paymentCondition: inst.paymentCondition,
        dueDate: inst.dueDate,
      })
    }
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
  const plan = resolveWebInstallmentPlan(snapshot)

  if (totals.oneTime > 0) {
    if (plan === 'three-thirds') {
      lines.push(`Total desarrollo web (honorarios, pagadero en 3 cuotas): ${money(totals.oneTime)}.`)
    } else if (plan === 'single') {
      lines.push(`Total desarrollo web (pago único de honorarios): ${money(totals.oneTime)}.`)
    } else {
      lines.push(`Total desarrollo web (honorarios, pagadero en 2 cuotas 50/50): ${money(totals.oneTime)}.`)
    }
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
  lines.push(
    `Infraestructura (dominio, correo y hosting): 1.er año ${money(PRICE_INFRA_FIRST_YEAR_BUNDLE_USD)} al proveedor. Desde el 2.º año: dominio ${money(
      PRICE_DOMAIN_RENEWAL_ANNUAL_USD,
    )}/año, correo ${money(PRICE_EMAIL_RENEWAL_ANNUAL_USD)}/año, hosting ${money(PRICE_HOSTING_RENEWAL_ANNUAL_USD)}/año (referencias, por separado).`,
  )
  lines.push(
    'Los módulos y agregados incluidos en el alcance (blog, formularios, pasarela, etc.) forman parte del desarrollo web y no se facturan como líneas económicas aparte.',
  )
  lines.push('Los agregados de cortesía no aparecen como líneas económicas independientes.')

  return lines
}
