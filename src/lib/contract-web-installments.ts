export type WebInstallmentPlanId = 'single' | 'half-half' | 'three-thirds'

export const WEB_INSTALLMENT_PLANS: ReadonlyArray<{
  id: WebInstallmentPlanId
  label: string
  description: string
}> = [
  { id: 'single', label: 'Pago único', description: '100% antes o al entregar, según calendario acordado.' },
  { id: 'half-half', label: '2 cuotas (50% / 50%)', description: '50% para iniciar y 50% al finalizar, antes de la entrega.' },
  {
    id: 'three-thirds',
    label: '3 cuotas (~33,33% c/u)',
    description: 'Tres pagos iguales; el último ajusta centavos por redondeo.',
  },
]

function fmtUsd(amount: number) {
  return `USD $${amount.toFixed(2)}`
}

function splitAmount(total: number, parts: number) {
  const base = Number((total / parts).toFixed(2))
  const installments: number[] = []
  let allocated = 0
  for (let i = 0; i < parts - 1; i++) {
    installments.push(base)
    allocated += base
  }
  installments.push(Number((total - allocated).toFixed(2)))
  return installments
}

export function buildWebInstallmentTerms(
  total: number,
  plan: WebInstallmentPlanId,
  webLabel: string,
): { advanceNote: string; balanceNote: string; paymentSchedule: string } {
  const label = webLabel.trim() || 'desarrollo web'
  if (total <= 0) {
    return {
      advanceNote: '',
      balanceNote: '',
      paymentSchedule: '',
    }
  }

  if (plan === 'single') {
    const line = `${label} (pago único): ${fmtUsd(total)} — pagadero según calendario acordado antes de la entrega definitiva.`
    return {
      advanceNote: `Pago único del desarrollo web: ${fmtUsd(total)}.`,
      balanceNote: 'No aplica saldo fraccionado (pago único acordado).',
      paymentSchedule: line,
    }
  }

  if (plan === 'half-half') {
    const [first, second] = splitAmount(total, 2)
    return {
      advanceNote: `Anticipo del desarrollo web: ${fmtUsd(first)} (50% de ${fmtUsd(total)}), pagadero antes de iniciar el proyecto.`,
      balanceNote: `Saldo del desarrollo web: ${fmtUsd(second)} (50% restante), pagadero al finalizar el desarrollo y antes de la entrega definitiva.`,
      paymentSchedule: [
        `${label} (pago único total): ${fmtUsd(total)}`,
        `Cuota 1 (50%): ${fmtUsd(first)} — al inicio, antes de comenzar el desarrollo`,
        `Cuota 2 (50%): ${fmtUsd(second)} — al finalizar, antes de la entrega definitiva`,
      ].join('\n'),
    }
  }

  const [c1, c2, c3] = splitAmount(total, 3)
  const pct = ((c1 / total) * 100).toFixed(2)
  return {
    advanceNote: `Primera cuota del desarrollo web: ${fmtUsd(c1)} (${pct}% de ${fmtUsd(total)}), pagadero antes de iniciar el proyecto.`,
    balanceNote: `Segunda y tercera cuota: ${fmtUsd(c2)} y ${fmtUsd(c3)} respectivamente, según el calendario acordado y antes de la entrega definitiva.`,
    paymentSchedule: [
      `${label} (pago único total): ${fmtUsd(total)}`,
      `Cuota 1 (~33,33%): ${fmtUsd(c1)} — al inicio`,
      `Cuota 2 (~33,33%): ${fmtUsd(c2)} — hito intermedio acordado`,
      `Cuota 3 (saldo): ${fmtUsd(c3)} — al finalizar, antes de la entrega definitiva`,
    ].join('\n'),
  }
}

export type WebInstallmentEconomicRow = {
  service: string
  paymentCondition: string
  dueDate: string
  amount: number
}

export function resolveWebInstallmentPlan(snapshot: {
  webInstallmentPlan?: WebInstallmentPlanId | null
  paymentSchedule?: string | null
  advanceNote?: string | null
  balanceNote?: string | null
}): WebInstallmentPlanId {
  const explicit = snapshot.webInstallmentPlan
  if (explicit === 'single' || explicit === 'half-half' || explicit === 'three-thirds') return explicit
  const sched = (snapshot.paymentSchedule ?? '').toLowerCase()
  if (/cuota 3|tercera cuota/.test(sched)) return 'three-thirds'
  const advance = (snapshot.advanceNote ?? '').toLowerCase()
  const balance = (snapshot.balanceNote ?? '').toLowerCase()
  if (/pago único del desarrollo/.test(advance) && /no aplica saldo fraccionado/.test(balance)) return 'single'
  return 'half-half'
}

export function buildWebInstallmentEconomicRows(
  total: number,
  plan: WebInstallmentPlanId,
  due: { start?: string | null; delivery?: string | null },
): WebInstallmentEconomicRow[] {
  const startDue = due.start?.trim() || 'Al firmar y antes del inicio'
  const finalDue = due.delivery?.trim() || 'Al completar el desarrollo'

  if (plan === 'single') {
    return [
      {
        service: 'Pago único del desarrollo web',
        amount: total,
        paymentCondition: 'Según calendario de pagos del contrato',
        dueDate: finalDue,
      },
    ]
  }

  if (plan === 'half-half') {
    const [first, second] = splitAmount(total, 2)
    return [
      {
        service: 'Cuota 1 — desarrollo web (50%)',
        amount: first,
        paymentCondition: 'Antes de iniciar el desarrollo',
        dueDate: startDue,
      },
      {
        service: 'Cuota 2 — desarrollo web (50%)',
        amount: second,
        paymentCondition: 'Al finalizar y antes de la entrega definitiva',
        dueDate: finalDue,
      },
    ]
  }

  const [c1, c2, c3] = splitAmount(total, 3)
  return [
    {
      service: 'Cuota 1 — desarrollo web (~33,33%)',
      amount: c1,
      paymentCondition: 'Antes de iniciar el desarrollo',
      dueDate: startDue,
    },
    {
      service: 'Cuota 2 — desarrollo web (~33,33%)',
      amount: c2,
      paymentCondition: 'Hito intermedio acordado entre las partes',
      dueDate: 'Según calendario de pagos',
    },
    {
      service: 'Cuota 3 — desarrollo web (saldo)',
      amount: c3,
      paymentCondition: 'Al finalizar y antes de la entrega definitiva',
      dueDate: finalDue,
    },
  ]
}
