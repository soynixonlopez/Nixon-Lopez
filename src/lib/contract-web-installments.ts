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
