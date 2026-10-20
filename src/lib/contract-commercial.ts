import { adBudgetRecommendationCopy } from '@/lib/commercial-settings'
import {
  appendMarketingTerminationSection,
  appendStandardWebSections,
} from '@/lib/contract-commercial-sections'
import { buildEconomicSummaryRows, buildEconomicTotalsFootnotes } from '@/lib/contract-economic-summary'
import { INVOICE_BRANDING } from '@/lib/invoice-branding'
import { resolveWebInstallmentPlan } from '@/lib/contract-web-installments'
import {
  PRICE_INFRA_FIRST_YEAR_BUNDLE_USD,
  collapseExternalInfraLinesForContract,
  isExternalInfraLine,
  normalizeCommercialSnapshotForContractDisplay,
  type CommercialSnapshot,
} from '@/lib/service-catalog'
import { parseConfiguratorFromPayload } from '@/lib/admin-configurator-quote'
import type { ServiceContractRecord } from '@/lib/types/contract'
import type { ContractClauseBlock } from '@/lib/contracts'

type IntroSegment = { kind: 'text' | 'key'; value: string }
type ClauseBlock = ContractClauseBlock

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
  const hasWeb = Boolean(snapshot.webPlanId || (snapshot.webPlans?.length ?? 0) > 0)
  const hasMarketing = Boolean(snapshot.marketingPlanId)
  const shared =
    text(snapshot.paymentMethod) &&
    text(snapshot.paymentSchedule) &&
    text(snapshot.termNote) &&
    text(snapshot.renewalNote) &&
    text(snapshot.terminationNote)

  if (!shared) return false
  if (hasWeb) {
    if (
      snapshot.revisionRounds == null ||
      snapshot.revisionRounds < 0 ||
      !text(snapshot.advanceNote) ||
      !text(snapshot.balanceNote) ||
      !text(snapshot.startDate) ||
      !text(snapshot.deliveryDate)
    ) {
      return false
    }
  }
  if (hasMarketing) {
    if (!text(snapshot.marketingStartDate) || !text(snapshot.marketingFirstPayment)) return false
    if (!hasWeb && !text(snapshot.advanceNote)) return false
  }
  return true
}

function annexLines(snapshot: CommercialSnapshot, moneyFn: (n: number) => string) {
  const rows: string[] = []
  const totals = snapshot.totals
  if (totals.oneTime > 0) {
    rows.push(
      `${snapshot.webLabel?.trim() || 'Desarrollo web'}: ${moneyFn(totals.oneTime)} (honorarios del proyecto web, total acordado).`,
    )
  }
  if (totals.monthly > 0) {
    rows.push(
      `${snapshot.marketingLabel?.trim() || 'Marketing digital'}: ${moneyFn(totals.monthly)}/mes (honorarios recurrentes).`,
    )
  }
  for (const line of collapseExternalInfraLinesForContract(totals.lines)) {
    if (line.billing === 'once' || line.billing === 'monthly') continue
    if (line.id.startsWith('feature-')) continue
    if (line.amount <= 0 && line.id !== 'gateway-fees') continue
    const amount = line.id === 'infra-year1' ? PRICE_INFRA_FIRST_YEAR_BUNDLE_USD : line.amount
    rows.push(`${line.label}: ${moneyFn(amount)} (gasto externo — lo paga el cliente al tercero).`)
  }
  return rows
}

function webInstallmentSummaryLabel(snapshot: CommercialSnapshot) {
  const plan = resolveWebInstallmentPlan(snapshot)
  if (plan === 'single') return 'según calendario acordado (pago único de honorarios web)'
  if (plan === 'three-thirds') return 'en 3 cuotas según el calendario de este contrato'
  return 'en 2 cuotas (50% / 50%) según el calendario de este contrato'
}

function buildPaymentClauseBullets(snapshot: CommercialSnapshot, ready: boolean) {
  const totals = snapshot.totals
  const hasWeb = Boolean(snapshot.webPlanId || (snapshot.webPlans?.length ?? 0) > 0)
  const hasMarketing = Boolean(snapshot.marketingPlanId)
  const bullets: string[] = []

  if (hasWeb && totals.oneTime > 0) {
    bullets.push(
      `Honorarios de desarrollo web (total de la cotización aceptada): ${money(totals.oneTime)}, pagadero ${webInstallmentSummaryLabel(snapshot)}.`,
    )
  }
  if (hasMarketing && totals.monthly > 0) {
    bullets.push(`Honorarios mensuales de marketing: ${money(totals.monthly)}/mes.`)
  }

  const infra = totals.lines.find((line) => line.id === 'infra-year1')
  if (infra) {
    bullets.push(
      `Dominio, correo y hosting (1.er año): ${money(PRICE_INFRA_FIRST_YEAR_BUNDLE_USD)} — lo paga el cliente al proveedor; no forma parte de los honorarios del prestador.`,
    )
  } else if (totals.external > 0) {
    const externalLines = collapseExternalInfraLinesForContract(totals.lines).filter(
      (line) => line.billing === 'external' || isExternalInfraLine(line),
    )
    if (externalLines.length === 1) {
      bullets.push(
        `${externalLines[0].label}: ${money(externalLines[0].amount)} — gasto externo a cargo del cliente.`,
      )
    } else if (externalLines.length > 1) {
      bullets.push(
        `Gastos externos de la cotización (terceros): ${money(totals.external)} en total — no son honorarios del prestador.`,
      )
    }
  }

  const approvedAd = snapshot.approvedAdBudgetUsd ?? totals.approvedAdBudget ?? 0
  const choice = snapshot.adBudgetChoice
  if ((snapshot.campaigns ?? 0) > 0) {
    if (approvedAd > 0) {
      bullets.push(
        `Presupuesto publicitario aprobado: ${money(approvedAd)}/mes — lo paga el cliente a Meta; no es honorario del prestador.`,
      )
    } else if (choice === 'pending' && (snapshot.recommendedAdBudgetUsd ?? 0) > 0) {
      bullets.push(
        `Presupuesto publicitario recomendado: ${money(snapshot.recommendedAdBudgetUsd ?? 0)}/mes — pendiente de aprobación; no es gasto autorizado.`,
      )
    } else {
      bullets.push('Presupuesto publicitario: no contratado en esta cotización (plan sin gestión de campañas).')
    }
  }

  if (hasWeb && hasMarketing) {
    bullets.push(`Honorarios iniciales exigibles (web + primer mes de marketing, sin pauta): ${money(totals.initialFees)}.`)
  } else if (hasMarketing && !hasWeb) {
    bullets.push(`Primer ciclo de honorarios mensuales: ${money(totals.monthly)}.`)
  }

  if (approvedAd > 0 && totals.projectedInitial != null) {
    bullets.push(`Total inicial estimado incluyendo pauta aprobada: ${money(totals.projectedInitial)}.`)
  }
  if (hasMarketing && approvedAd > 0 && totals.projectedMonthly != null) {
    bullets.push(`Mensual estimado con pauta: ${money(totals.projectedMonthly)}/mes.`)
  }

  bullets.push(
    totals.taxRate != null ? `Impuesto configurado en cotización: ${totals.taxRate}%.` : 'Impuestos: no aplican en esta cotización.',
  )

  if (ready) {
    bullets.push(`Forma de pago: ${text(snapshot.paymentMethod)}`)
    if (text(snapshot.advanceNote)) bullets.push(text(snapshot.advanceNote))
    if (text(snapshot.balanceNote)) bullets.push(text(snapshot.balanceNote))
    const schedule = text(snapshot.paymentSchedule)
    if (schedule) {
      for (const row of schedule.split('\n').map((line) => line.trim()).filter(Boolean)) {
        bullets.push(row)
      }
    }
  } else {
    bullets.push(
      'Faltan forma de pago, anticipo, saldo o calendario. Este borrador no fija vencimientos ni penalizaciones.',
    )
  }

  return bullets
}

const WEB_REVISION_DEFAULT = 2

export function contractIsReadyToSign(contract: ServiceContractRecord) {
  const snapshot = readCommercialSnapshot(contract.terms_payload)
  if (!snapshot) return contract.status === 'signed'
  return commercialTermsReady(snapshot) && contract.status === 'signed'
}

function snapshotForContractClauses(
  contract: ServiceContractRecord,
  snapshot: CommercialSnapshot,
): CommercialSnapshot {
  const terms = contract.terms_payload
  const cfg = terms ? parseConfiguratorFromPayload(terms) : null
  const hasWeb = Boolean(snapshot.webPlanId || (snapshot.webPlans?.length ?? 0) > 0)
  const forceInfraBundle = Boolean(hasWeb && cfg?.hasDomain === 'no' && cfg?.hasHosting === 'no')
  return normalizeCommercialSnapshotForContractDisplay(snapshot, { forceInfraBundle })
}

export function buildCommercialContractClauses(
  contract: ServiceContractRecord,
  snapshot: CommercialSnapshot,
  introSegments: IntroSegment[],
) {
  snapshot = snapshotForContractClauses(contract, snapshot)
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
    const webTitle = snapshot.webLabel?.trim() || snapshot.webPlans?.map((plan) => plan.label).join(' + ') || 'Desarrollo web'
    const webPrice =
      totals.oneTime > 0
        ? `${money(totals.oneTime)} (total acordado en cotización)`
        : snapshot.webPlans?.map((plan) => money(plan.basePrice)).join(' + ') || 'según cotización'
    blocks.push({
      title: titled(index++, 'APARTADO A. DESARROLLO WEB'),
      paragraphs: [
        `Proyecto contratado: ${webTitle}. Honorarios de desarrollo web: ${webPrice}.`,
        'Los honorarios del desarrollo web no se repiten mensualmente; el calendario de cobro es el indicado en la cláusula de precio y forma de pago.',
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
    const sectionIndex = { value: index }
    appendStandardWebSections(
      blocks,
      sectionIndex,
      titled,
      snapshot,
      contract.terms_payload,
      money,
    )
    index = sectionIndex.value
  }

  if (snapshot.marketingPlanId) {
    const managesAds = (snapshot.campaigns ?? 0) > 0
    const recommended = managesAds ? snapshot.recommendedAdBudgetUsd ?? 150 : 0
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
        managesAds && recommended > 0
          ? adBudgetRecommendationCopy(recommended)
          : 'Este plan no incluye gestión de campañas publicitarias.',
        approved > 0
          ? `Presupuesto publicitario aprobado: ${money(approved)} al mes. Lo paga el cliente directamente a Meta desde su cuenta publicitaria, salvo que las partes escriban otro mecanismo.`
          : managesAds
            ? 'Presupuesto publicitario: pendiente de definición o no aprobado. No es un gasto autorizado y no se suma a los honorarios.'
            : '',
      ].filter(Boolean),
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
  const paymentBullets = buildPaymentClauseBullets(snapshot, ready)

  if (hasWeb) {
    blocks.push({
      title: titled(index++, 'PLAZO DE ENTREGA'),
      paragraphs: [
        snapshot.deliveryDate
          ? `Plazo acordado: ${snapshot.deliveryDate}.`
          : 'Plazo: debe acordarse antes del contrato definitivo; no se inventa una cantidad de días.',
        snapshot.startDate ? `Inicio del cómputo: ${snapshot.startDate}.` : 'Inicio: pendiente de acordar.',
        'El plazo depende del anticipo, materiales del cliente y aprobaciones oportunas.',
        'La entrega definitiva queda condicionada al saldo final y demás condiciones de pago.',
      ],
    })

    const rounds = snapshot.revisionRounds ?? WEB_REVISION_DEFAULT
    blocks.push({
      title: titled(index++, 'RONDAS DE REVISIÓN'),
      paragraphs: [
        `El desarrollo web incluye ${rounds} rondas de revisión.`,
        'Cada ronda permite un conjunto consolidado de observaciones sobre el trabajo entregado, dentro del alcance contratado.',
        'Las revisiones no equivalen a rediseños completos ni a proyectos nuevos.',
        'Nuevas páginas, módulos, integraciones o funcionalidades fuera del alcance se cotizan por separado.',
        'El cliente presentará comentarios dentro del procedimiento y plazos acordados.',
      ],
    })
  }

  blocks.push({
    title: titled(index++, 'PRECIO Y FORMA DE PAGO'),
    paragraphs: [
      hasWeb
        ? `Los importes de esta cláusula corresponden a la cotización aceptada para ${snapshot.webLabel?.trim() || 'el desarrollo web'}${
            snapshot.marketingPlanId ? ` y ${snapshot.marketingLabel?.trim() || 'marketing'}` : ''
          }. El desarrollo web no inicia hasta el primer pago acordado y la entrega de materiales.`
        : 'Los importes corresponden a la cotización aceptada. El servicio no inicia hasta el pago y materiales acordados.',
    ],
    bullets: paymentBullets,
  })

  const economicRows = buildEconomicSummaryRows(snapshot)
  blocks.push({
    title: titled(index++, 'RESUMEN ECONÓMICO'),
    paragraphs: ['Desglose de servicios, tipo de facturación y condiciones. Los gastos externos no son honorarios del prestador.'],
    table: {
      headers: ['Servicio', 'Tipo', 'Precio', 'Frecuencia', 'Condición de pago', 'Vencimiento'],
      rows: economicRows.map((row) => [
        row.service,
        row.billingType,
        row.price,
        row.frequency,
        row.paymentCondition,
        row.dueDate,
      ]),
    },
    bullets: buildEconomicTotalsFootnotes(snapshot),
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
    title: titled(index++, 'SERVICIOS ADICIONALES'),
    paragraphs: [
      'Funcionalidades fuera del alcance requieren cotización y aprobación previa. Los agregados de cortesía no son extras facturables.',
    ],
  })

  if (snapshot.marketingPlanId) {
    const termIndex = { value: index }
    appendMarketingTerminationSection(blocks, termIndex, titled, snapshot, text)
    index = termIndex.value
  } else {
    blocks.push({
      title: titled(index++, 'VIGENCIA'),
      paragraphs: [
        text(snapshot.termNote) ? `Vigencia: ${text(snapshot.termNote)}.` : 'Vigencia: según cotización aceptada.',
        text(snapshot.renewalNote)
          ? `Renovación: ${text(snapshot.renewalNote)}.`
          : 'Renovación: no aplica renovación automática del desarrollo web.',
        text(snapshot.terminationNote)
          ? `Terminación: ${text(snapshot.terminationNote)}.`
          : 'Terminación: conforme a incumplimientos y cláusulas generales.',
      ],
    })
  }

  const annex = annexLines(snapshot, money)
  blocks.push({
    title: titled(index++, 'ANEXO: COTIZACIÓN ACEPTADA'),
    paragraphs: ['Estos importes quedan congelados con la cotización. No siguen los precios futuros del catálogo.'],
    bullets: annex.length ? annex : ['La cotización no tiene líneas guardadas.'],
  })

  blocks.push({
    title: titled(index++, 'LEGISLACIÓN APLICABLE'),
    paragraphs: [
      'El presente contrato se rige por las leyes de la República de Panamá. Cualquier disputa será resuelta ante los tribunales competentes de Panamá, sujeto a revisión legal.',
    ],
  })

  blocks.push({
    title: titled(index++, 'ACEPTACIÓN Y FIRMAS'),
    paragraphs: [
      ready
        ? 'Las partes aceptan este alcance y los importes del anexo. Generar o descargar el PDF no equivale a firmar.'
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
