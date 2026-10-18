import { adBudgetRecommendationCopy } from '@/lib/commercial-settings'
import { INVOICE_BRANDING } from '@/lib/invoice-branding'
import type { CommercialSnapshot } from '@/lib/service-catalog'
import type { ServiceContractRecord } from '@/lib/types/contract'

type IntroSegment = { kind: 'text' | 'key'; value: string }
type ClauseBlock = {
  title: string
  paragraphs?: string[]
  bullets?: string[]
  afterBullets?: string[]
}

const ROMAN = [
  'PRIMERA',
  'SEGUNDA',
  'TERCERA',
  'CUARTA',
  'QUINTA',
  'SEXTA',
  'SÉPTIMA',
  'OCTAVA',
  'NOVENA',
  'DÉCIMA',
  'DÉCIMA PRIMERA',
  'DÉCIMA SEGUNDA',
  'DÉCIMA TERCERA',
  'DÉCIMA CUARTA',
  'DÉCIMA QUINTA',
]

function titled(index: number, label: string) {
  return `${ROMAN[index] ?? `CLÁUSULA ${index + 1}`}: ${label}`
}

function money(amount: number) {
  return `USD $${amount.toFixed(2)}`
}

export function readCommercialSnapshot(terms: Record<string, unknown> | null): CommercialSnapshot | null {
  if (!terms || typeof terms.commercial !== 'object' || terms.commercial == null || Array.isArray(terms.commercial)) {
    return null
  }
  const value = terms.commercial as Partial<CommercialSnapshot>
  const hasWeb =
    Boolean(value.webPlanId) || (Array.isArray(value.webPlans) && value.webPlans.length > 0)
  if (!hasWeb && !value.marketingPlanId) return null
  if (!value.totals || typeof value.totals !== 'object') return null
  return value as CommercialSnapshot
}

function text(value: string | null | undefined) {
  return (value ?? '').trim()
}

export function commercialTermsReady(snapshot: CommercialSnapshot) {
  return Boolean(
    snapshot.revisionRounds != null &&
      snapshot.revisionRounds >= 0 &&
      text(snapshot.paymentMethod) &&
      text(snapshot.advanceNote) &&
      text(snapshot.balanceNote) &&
      text(snapshot.paymentSchedule) &&
      text(snapshot.startDate) &&
      text(snapshot.deliveryDate) &&
      text(snapshot.termNote) &&
      text(snapshot.renewalNote) &&
      text(snapshot.terminationNote) &&
      (!snapshot.marketingPlanId || (text(snapshot.marketingStartDate) && text(snapshot.marketingFirstPayment))),
  )
}

export function contractIsReadyToSign(contract: ServiceContractRecord) {
  const snapshot = readCommercialSnapshot(contract.terms_payload)
  if (!snapshot) return contract.status === 'signed'
  return commercialTermsReady(snapshot) && contract.status === 'signed'
}

export function buildCommercialContractClauses(
  contract: ServiceContractRecord,
  snapshot: CommercialSnapshot,
  introSegments: IntroSegment[],
) {
  const intro = introSegments.map((segment) => segment.value).join('')
  const blocks: ClauseBlock[] = []
  let index = 0
  const labels = [snapshot.webLabel, snapshot.marketingLabel].filter(Boolean).join(' y ')
  const totals = snapshot.totals
  const ready = commercialTermsReady(snapshot)

  blocks.push({
    title: titled(index++, 'IDENTIFICACIÓN'),
    paragraphs: [
      `Contrato ${contract.contract_number || 'sin número'}, emitido el ${new Date(contract.created_at).toLocaleDateString('es-PA')}.`,
      `Proveedor: ${INVOICE_BRANDING.businessName}, RUC ${INVOICE_BRANDING.ruc}, ${INVOICE_BRANDING.addressLine1}, ${INVOICE_BRANDING.addressLine2}, ${INVOICE_BRANDING.country}. Contacto: ${INVOICE_BRANDING.email}.`,
      `Cliente: ${contract.client_name}. Identificación: ${contract.client_tax_id?.trim() || 'pendiente de completar'}. Domicilio: ${contract.client_address?.trim() || 'pendiente de completar'}. Ciudad: ${contract.city?.trim() || 'pendiente'}. Correo: ${contract.client_email || 'pendiente'}.`,
    ],
  })

  blocks.push({
    title: titled(index++, 'OBJETO'),
    paragraphs: [
      `EL PRESTADOR prestará a EL CLIENTE únicamente los servicios aceptados en la cotización: ${labels}.`,
      snapshot.scopeNotes || 'El detalle operativo es el que consta en el alcance de este contrato.',
    ],
  })

  if (snapshot.webPlanId || (snapshot.webPlans?.length ?? 0) > 0) {
    const webNames = snapshot.webPlans?.length
      ? snapshot.webPlans.map((plan) => `${plan.label} (${money(plan.basePrice)}, pago único)`).join('; ')
      : snapshot.webLabel
    blocks.push({
      title: titled(index++, 'APARTADO A. DESARROLLO WEB'),
      paragraphs: [
        `Paquete: ${webNames}.`,
        'El precio del desarrollo web es un pago único. No se vuelve a cobrar en los meses posteriores, salvo un calendario distinto escrito en este contrato.',
        snapshot.startDate ? `Inicio del desarrollo: ${snapshot.startDate}.` : 'Inicio del desarrollo: pendiente de acordar.',
        snapshot.deliveryDate
          ? `Entrega estimada del desarrollo: ${snapshot.deliveryDate}.`
          : 'Entrega estimada del desarrollo: pendiente de acordar.',
      ],
      bullets: [
        ...(snapshot.webIncludes ?? (snapshot.marketingPlanId ? [] : snapshot.includes)),
        snapshot.pagesIncluded != null
          ? `Páginas o secciones incluidas: ${snapshot.pagesIncluded}${snapshot.extraPages > 0 ? ` más ${snapshot.extraPages} adicionales` : ''}.`
          : 'La estructura de páginas es la del plan contratado.',
        snapshot.productsIncluded != null ? `Productos de la carga inicial: ${snapshot.productsIncluded}.` : '',
        snapshot.servicesIncluded != null ? `Servicios reservables de la carga inicial: ${snapshot.servicesIncluded}.` : '',
        snapshot.adminModulesNote ?? '',
      ].filter(Boolean),
    })
    if ((snapshot.courtesyAddons?.length ?? 0) > 0) {
      blocks.push({
        title: titled(index++, 'FUNCIONALIDADES COMPLEMENTARIAS INCLUIDAS SIN COSTO ADICIONAL'),
        paragraphs: ['Forman parte del alcance del paquete web. No generan líneas de cobro individuales.'],
        bullets: snapshot.courtesyAddons!.map((item) =>
          item.description ? `${item.name}: ${item.description}` : item.name,
        ),
      })
    }
  }

  if (snapshot.marketingPlanId) {
    const recommended = snapshot.recommendedAdBudgetUsd ?? 0
    const approved = snapshot.approvedAdBudgetUsd ?? (snapshot.adBudgetAccepted ? snapshot.adBudgetUsd : 0)
    blocks.push({
      title: titled(index++, 'APARTADO B. MARKETING DIGITAL'),
      paragraphs: [
        `Plan: ${snapshot.marketingLabel}. Honorario mensual: ${money(snapshot.totals.monthly)}.`,
        'El honorario de gestión no incluye el presupuesto publicitario.',
        snapshot.marketingStartDate
          ? `Inicio del marketing: ${snapshot.marketingStartDate}. No tiene que coincidir con la entrega de la web.`
          : 'Inicio del marketing: pendiente de acordar. No tiene que coincidir con la entrega de la web.',
        snapshot.marketingFirstPayment
          ? `Primer pago mensual: ${snapshot.marketingFirstPayment}.`
          : 'Primer pago mensual: pendiente de acordar.',
        recommended > 0 ? adBudgetRecommendationCopy(recommended) : 'Este plan no incluye gestión de campañas publicitarias.',
        approved > 0
          ? `Presupuesto publicitario aprobado: ${money(approved)} al mes. Lo paga el cliente directamente a Meta desde su cuenta publicitaria, salvo que las partes escriban otro mecanismo.`
          : 'Presupuesto publicitario: pendiente de definición. No es un gasto autorizado y no se suma a los honorarios.',
      ],
      bullets: [
        `Plataformas: ${snapshot.channels.length ? snapshot.channels.join(', ') : 'por definir'}.`,
        `Publicaciones de feed al mes (total de los canales, no por cada red): ${snapshot.postsPerMonth ?? 'según plan'}.`,
        ...(snapshot.reelsPerMonth != null && snapshot.reelsPerMonth > 0
          ? [`Reels al mes: ${snapshot.reelsPerMonth}. Editados con material proporcionado por el cliente.`]
          : []),
        snapshot.storiesIncluded
          ? `Historias: ${snapshot.storiesPerWeek ?? 3} por semana incluidas (aprox. ${snapshot.storiesPerMonth || (snapshot.storiesPerWeek ?? 3) * 4} en cuatro semanas; obligación semanal). Diseñadas y publicadas con material del cliente; sin grabaciones presenciales salvo acuerdo expreso.`
          : 'Historias: no aplican a este servicio.',
        `Campañas activas incluidas: ${snapshot.campaigns ?? 0}. Ese límite no es un número ilimitado de anuncios ni de cambios.`,
        'El cliente entrega material, aprueba contenidos y facilita el acceso a las cuentas.',
      ],
    })
  }

  if (snapshot.webPlanId && snapshot.marketingPlanId) {
    blocks.push({
      title: titled(index++, 'SERVICIOS INDEPENDIENTES'),
      paragraphs: [
        'Terminar el desarrollo web no cancela el marketing. Cancelar el marketing no elimina los pagos pendientes del desarrollo. Cada servicio conserva sus fechas y sus obligaciones de pago.',
      ],
    })
  }

  blocks.push({
    title: titled(index++, 'EXCLUSIONES'),
    paragraphs: ['No forma parte de este contrato:'],
    bullets: snapshot.excludes,
  })

  const hasWeb = Boolean(snapshot.webPlanId || (snapshot.webPlans?.length ?? 0) > 0)
  const paymentBullets: string[] = []
  if (hasWeb) {
    paymentBullets.push(`Desarrollo web (pago único): ${money(totals.oneTime)}.`)
    if (totals.oneTime > 0) {
      const advance = Number((totals.oneTime / 2).toFixed(2))
      const balance = Number((totals.oneTime - advance).toFixed(2))
      paymentBullets.push(`Anticipo web (50%): ${money(advance)}. Saldo web (50%): ${money(balance)}.`)
    }
  }
  if (snapshot.marketingPlanId) {
    paymentBullets.push(`Honorarios mensuales de marketing: ${money(totals.monthly)}.`)
    if (snapshot.storiesIncluded) {
      paymentBullets.push(
        `Historias incluidas: ${snapshot.storiesPerWeek ?? 3} por semana (aprox. ${snapshot.storiesPerMonth || (snapshot.storiesPerWeek ?? 3) * 4} en cuatro semanas).`,
      )
    }
  }
  paymentBullets.push(
    `Gastos externos estimados (los paga el cliente al tercero, no son honorarios): ${money(totals.external)}.`,
  )
  const approvedAd = snapshot.approvedAdBudgetUsd ?? totals.approvedAdBudget ?? 0
  const choice = snapshot.adBudgetChoice
  if ((snapshot.campaigns ?? 0) > 0) {
    if (approvedAd > 0) {
      paymentBullets.push(
        `Presupuesto publicitario aprobado: ${money(approvedAd)} al mes. Lo paga el cliente a Meta; no es honorario del proveedor.`,
      )
    } else if (choice === 'pending' && (snapshot.recommendedAdBudgetUsd ?? 0) > 0) {
      paymentBullets.push(
        `Presupuesto publicitario recomendado: ${money(snapshot.recommendedAdBudgetUsd ?? 0)}. Pendiente de aprobación; no es gasto autorizado.`,
      )
    } else {
      paymentBullets.push('Presupuesto publicitario: no contratado o no definido en esta cotización.')
    }
  }
  paymentBullets.push(`Honorarios iniciales (sin pauta): ${money(totals.initialFees)}.`)
  if (approvedAd > 0) {
    paymentBullets.push(
      `Total inicial previsto con pauta aprobada: ${money(totals.projectedInitial ?? totals.initialFees)}.`,
    )
  }
  if (snapshot.marketingPlanId) {
    paymentBullets.push(`Honorarios mensuales siguientes: ${money(totals.nextMonthly)}.`)
    if (approvedAd > 0) {
      paymentBullets.push(
        `Mensual posterior con pauta aprobada: ${money(totals.projectedMonthly ?? totals.nextMonthly)}. El desarrollo web no se repite en ese mensual.`,
      )
    }
  }
  paymentBullets.push(
    totals.taxRate != null ? `Impuesto configurado: ${totals.taxRate}%.` : 'Impuestos: no configurados en esta cotización.',
  )
  if (ready) {
    paymentBullets.push(`Forma de pago: ${text(snapshot.paymentMethod)}.`)
    paymentBullets.push(`Anticipo: ${text(snapshot.advanceNote)}.`)
    paymentBullets.push(`Saldo: ${text(snapshot.balanceNote)}.`)
    paymentBullets.push(`Calendario de pagos: ${text(snapshot.paymentSchedule)}.`)
  } else {
    paymentBullets.push(
      'Faltan forma de pago, anticipo, saldo o calendario. Este borrador no fija porcentajes, vencimientos ni penalizaciones.',
    )
  }

  blocks.push({
    title: titled(index++, 'PRECIO Y PAGO'),
    paragraphs: ['Los montos son los de la cotización aceptada.'],
    bullets: paymentBullets,
  })

  blocks.push({
    title: titled(index++, 'PLAZOS'),
    paragraphs: [
      snapshot.startDate ? `Inicio: ${snapshot.startDate}.` : 'Fecha de inicio: pendiente de acordar.',
      snapshot.deliveryDate ? `Entrega estimada: ${snapshot.deliveryDate}.` : 'Fecha estimada de entrega: pendiente de acordar.',
      'Los plazos dependen de que el cliente entregue contenidos, credenciales y aprobaciones. Este contrato no inventa un calendario si las partes no lo escribieron.',
    ],
  })

  blocks.push({
    title: titled(index++, 'REVISIONES'),
    paragraphs: [
      snapshot.revisionRounds != null
        ? `Rondas de revisión incluidas: ${snapshot.revisionRounds}. Lo que exceda ese alcance se cotiza aparte.`
        : 'La cantidad de rondas de revisión no está definida. Debe acordarse antes de firmar. No se asumen revisiones ilimitadas.',
    ],
  })

  blocks.push({
    title: titled(index++, 'OBLIGACIONES'),
    bullets: [
      'El cliente entrega a tiempo materiales, accesos y aprobaciones de diseños y contenidos.',
      'El cliente garantiza que puede usar de forma legítima los textos, marcas e imágenes que entregue.',
      'El proveedor ejecuta solo el alcance aceptado y no promete ventas, posiciones ni una cantidad de clientes.',
      'Los cambios fuera del alcance requieren una cotización nueva.',
    ],
  })

  blocks.push({
    title: titled(index++, 'VIGENCIA, RENOVACIÓN Y TERMINACIÓN'),
    paragraphs: [
      text(snapshot.termNote) ? `Vigencia: ${text(snapshot.termNote)}.` : 'Vigencia: pendiente de acordar.',
      text(snapshot.renewalNote)
        ? `Renovación: ${text(snapshot.renewalNote)}.`
        : 'Renovación: pendiente de acordar. Este documento no establece una renovación automática.',
      text(snapshot.terminationNote)
        ? `Terminación: ${text(snapshot.terminationNote)}.`
        : 'Terminación: pendiente de acordar. Este documento no fija preaviso ni penalización.',
    ],
  })

  const annex = totals.lines.map((line) => {
    const kind = line.billing === 'monthly' ? 'honorario mensual' : line.billing === 'external' ? 'gasto externo' : 'pago único'
    return `${line.label}: ${money(line.amount)} (${kind})`
  })
  blocks.push({
    title: titled(index++, 'ANEXO: COTIZACIÓN ACEPTADA'),
    paragraphs: ['Estos importes quedan congelados con la cotización. No siguen los precios futuros del catálogo.'],
    bullets: annex.length ? annex : ['La cotización no tiene líneas guardadas.'],
  })

  blocks.push({
    title: titled(index++, 'ACEPTACIÓN Y FIRMAS'),
    paragraphs: [
      ready
        ? 'Las partes aceptan este alcance y los importes del anexo. La firma va al final del documento.'
        : 'BORRADOR. Faltan condiciones obligatorias. No está listo para firmar.',
    ],
  })

  if (!ready) {
    blocks.push({
      title: 'PENDIENTE ANTES DE CERRAR',
      paragraphs: [
        'Completa rondas de revisión, forma de pago, anticipo, saldo, calendario, fecha de inicio, plazo de entrega, vigencia, renovación y terminación antes de emitir la versión final.',
      ],
    })
  }

  if (contract.custom_notes?.trim()) {
    blocks.push({ title: 'OBSERVACIONES', paragraphs: [contract.custom_notes.trim()] })
  }

  return {
    intro,
    introSegments,
    serviceSubtitle: labels.toUpperCase(),
    blocks,
    primera: blocks[1]?.paragraphs?.[0] ?? '',
    segundaIncluye: snapshot.includes,
    segundaNoIncluye: snapshot.excludes,
    tercera: paymentBullets,
    cuarta: (snapshot.webIncludes ?? snapshot.includes).slice(0, 8),
    quinta: snapshot.deliveryDate || 'Plazo pendiente de acordar.',
  }
}
