import { getBillableFeatureDef } from '@/lib/courtesy-addons'
import { parseConfiguratorFromPayload } from '@/lib/admin-configurator-quote'
import type { WebPlanId } from '@/lib/service-catalog'
import { getCatalogPlan } from '@/lib/service-catalog'
import type { CommercialSnapshot } from '@/lib/service-catalog'

type ClauseBlock = {
  title: string
  paragraphs?: string[]
  bullets?: string[]
  afterBullets?: string[]
  subsections?: Array<{ heading: string; paragraphs?: string[]; bullets?: string[] }>
}

export function billableFeatureLinesFromSnapshot(snapshot: CommercialSnapshot) {
  return snapshot.totals.lines.filter(
    (line) =>
      line.id.startsWith('feature-') &&
      line.amount > 0 &&
      line.billing === 'once',
  )
}

function webPlanIds(snapshot: CommercialSnapshot): WebPlanId[] {
  if (snapshot.webPlans?.length) {
    return snapshot.webPlans.map((p) => p.id).filter(Boolean) as WebPlanId[]
  }
  return snapshot.webPlanId ? [snapshot.webPlanId] : []
}

export function appendStandardWebSections(
  blocks: ClauseBlock[],
  indexRef: { value: number },
  titled: (i: number, label: string) => string,
  snapshot: CommercialSnapshot,
  terms: Record<string, unknown> | null,
  money: (n: number) => string,
) {
  const ids = webPlanIds(snapshot)
  if (ids.length === 0) return

  const plans = ids.map((id) => getCatalogPlan(id)).filter(Boolean)
  const hasAdmin = plans.some((p) => p!.hasAdmin)
  const hasGateway = plans.some((p) => p!.hasGateway)
  const isStore = ids.includes('tienda')
  const isBooking = ids.includes('reservas')
  const cfg = parseConfiguratorFromPayload(terms ?? undefined)
  const hasDomainNo = cfg?.hasDomain === 'no'
  const hasHostingNo = cfg?.hasHosting === 'no'
  const emailCount = typeof cfg?.emailCount === 'number' ? cfg.emailCount : 0
  const oneTime = snapshot.totals.oneTime

  let index = indexRef.value

  const billable = billableFeatureLinesFromSnapshot(snapshot)
  if (billable.length > 0) {
    blocks.push({
      title: titled(index++, 'FUNCIONALIDADES CONTRATADAS (FACTURABLES)'),
      paragraphs: [
        'Además del alcance base, la cotización aceptada incluye las siguientes funcionalidades con precio acordado:',
      ],
      bullets: billable.map((line) => {
        const id = line.id.replace(/^feature-/, '')
        const def = getBillableFeatureDef(id)
        return def ? `${def.label}: ${money(line.amount)} — ${def.description}` : `${line.label}: ${money(line.amount)}`
      }),
      afterBullets: [
        'Funcionalidades no listadas aquí requieren cotización y aprobación previa. Los agregados de cortesía no se facturan por separado.',
      ],
    })
  }

  blocks.push({
    title: titled(index++, 'TECNOLOGÍA Y DESARROLLO PERSONALIZADO'),
    paragraphs: [
      'La solución se desarrollará mediante código personalizado y tecnologías web modernas, con arquitectura adecuada al alcance contratado.',
      'Pueden utilizarse servicios de terceros (hosting, base de datos, despliegue, mapas, APIs). Sus costos no están incluidos en los honorarios salvo pacto expreso en la cotización.',
    ],
  })

  if (hasAdmin) {
    blocks.push({
      title: titled(index++, 'PANEL ADMINISTRATIVO'),
      paragraphs: [
        snapshot.adminModulesNote ||
          'El panel permite administrar los contenidos o módulos descritos en el alcance, con acceso privado mediante credenciales.',
      ],
      bullets: [
        'Creación, edición y eliminación de registros según el módulo contratado',
        'Publicación de contenidos administrables',
        'No incluye CMS completo, roles avanzados ni módulos no cotizados',
      ],
    })
  }

  if (hasGateway) {
    blocks.push({
      title: titled(index++, 'PASARELA DE PAGOS'),
      paragraphs: [
        'Integración de pasarela o cobro online según alcance. Comisiones, cuentas mercantes y aprobaciones son responsabilidad del cliente.',
        'El prestador no garantiza tiempos de habilitación de proveedores de pago.',
      ],
    })
  }

  if (isBooking) {
    blocks.push({
      title: titled(index++, 'RESERVAS / CITAS'),
      paragraphs: [
        'Módulo de reservas o citas según alcance, con flujo y panel acordados en la cotización.',
      ],
    })
  }

  if (isStore) {
    blocks.push({
      title: titled(index++, 'CATÁLOGO Y PRODUCTOS'),
      paragraphs: [
        'Catálogo, carrito y flujo de compra según el plan de tienda online contratado.',
        'El cliente suministra información, precios e imágenes de la carga inicial acordada.',
      ],
    })
  }

  blocks.push({
    title: titled(index++, 'DISEÑO RESPONSIVE Y PROPUESTA VISUAL'),
    paragraphs: [
      'Diseño adaptable a computadoras, tabletas y móviles.',
      'Propuestas visuales o prototipos son referenciales; la aprobación de diseño no equivale a la aceptación final del desarrollo.',
      'Cambios sustanciales fuera del alcance se cotizan por separado.',
    ],
  })

  blocks.push({
    title: titled(index++, 'CONTENIDO Y RESPONSABILIDADES DEL CLIENTE'),
    paragraphs: [
      'El cliente entrega oportunamente textos, imágenes, logotipos, precios, credenciales y materiales necesarios.',
      'El cliente garantiza autorización para usar el material proporcionado.',
      'El prestador no investiga ni inventa contenido faltante.',
    ],
  })

  blocks.push({
    title: titled(index++, 'DOMINIO, HOSTING, CORREOS E INFRAESTRUCTURA'),
    paragraphs: [
      oneTime > 0
        ? `El valor del desarrollo (${money(oneTime)}) corresponde al trabajo de diseño y desarrollo acordado, no a infraestructura recurrente.`
        : 'Los costos de infraestructura son independientes de los honorarios, salvo ítems expresos en la cotización.',
    ],
    bullets: [
      hasDomainNo
        ? 'Dominio: contemplado como gasto externo en la cotización, si aplica.'
        : 'Dominio: el cliente declara contar con dominio o lo gestionará por su cuenta.',
      hasHostingNo
        ? 'Hosting / despliegue: contemplado como gasto externo en la cotización, si aplica.'
        : 'Hosting / despliegue: a cargo del cliente salvo acuerdo distinto.',
      emailCount > 0
        ? `Correos corporativos: ${emailCount} contemplado(s) como gasto de tercero en cotización.`
        : 'Correos corporativos: no incluidos salvo acuerdo expreso.',
      'Servicios como hosting, mapas, APIs o analítica pueden generar costos mensuales a cargo del cliente.',
    ],
  })

  blocks.push({
    title: titled(index++, 'CAPACITACIÓN'),
    paragraphs: [
      'Tras la entrega, capacitación inicial de hasta 60 minutos en modalidad remota, salvo otro acuerdo escrito.',
      'Alcance: uso de la solución entregada dentro del contrato.',
    ],
  })

  blocks.push({
    title: titled(index++, 'GARANTÍA TÉCNICA'),
    paragraphs: ['Cubre errores del alcance desarrollado dentro del plazo acordado en la política comercial aplicable.'],
    bullets: [
      'Errores de programación del alcance contratado',
      'Fallos funcionales derivados del desarrollo',
      'Ajustes menores vinculados al trabajo original',
    ],
    afterBullets: [
      'No cubre nuevas funcionalidades, cambios de terceros, infraestructura externa ni modificaciones hechas por el cliente.',
    ],
  })

  blocks.push({
    title: titled(index++, 'ACOMPAÑAMIENTO INICIAL'),
    paragraphs: [
      'Orientación posterior a la entrega solo si consta en la cotización. No sustituye mantenimiento, soporte ilimitado ni administración diaria.',
    ],
  })

  blocks.push({
    title: titled(index++, 'MANTENIMIENTO Y SOPORTE'),
    paragraphs: [
      'El mantenimiento no se contrata automáticamente con el desarrollo web. Si se contrata después, se cotiza por separado.',
    ],
  })

  blocks.push({
    title: titled(index++, 'PROPIEDAD DIGITAL Y ACCESOS'),
    paragraphs: [
      'Con el pago total del proyecto, el cliente recibe derechos sobre los activos desarrollados y accesos acordados.',
      'El prestador conserva metodologías, componentes reutilizables y herramientas propias.',
      'La entrega definitiva queda condicionada al cumplimiento de pagos, incluido el saldo final.',
    ],
  })

  blocks.push({
    title: titled(index++, 'CANCELACIÓN DEL DESARROLLO WEB'),
    paragraphs: [
      'Cancelación: se aplican las condiciones configuradas y acordadas respecto a trabajo ejecutado y pagos pendientes.',
      'No se asume automáticamente que el anticipo es no reembolsable en toda circunstancia sin cláusula expresa revisada.',
    ],
  })

  blocks.push({
    title: titled(index++, 'APROBACIÓN Y ENTREGA'),
    paragraphs: [
      'Revisión del proyecto dentro del alcance y de las rondas incluidas. Entrega definitiva tras saldo y condiciones de pago.',
      'Observaciones fuera de alcance o nuevas funcionalidades se cotizan aparte.',
      'La aceptación puede documentarse por medios que dejen constancia (correo, mensaje o firma).',
    ],
  })

  blocks.push({
    title: titled(index++, 'CONFIDENCIALIDAD'),
    paragraphs: [
      'Las partes tratarán con diligencia credenciales, información comercial y datos del cliente necesarios para el servicio.',
    ],
  })

  indexRef.value = index
}

export function appendMarketingTerminationSection(
  blocks: ClauseBlock[],
  indexRef: { value: number },
  titled: (i: number, label: string) => string,
  snapshot: CommercialSnapshot,
  text: (v: string | null | undefined) => string,
) {
  if (!snapshot.marketingPlanId) return
  let index = indexRef.value
  blocks.push({
    title: titled(index++, 'VIGENCIA Y TERMINACIÓN DEL MARKETING'),
    paragraphs: [
      text(snapshot.termNote) ? `Vigencia: ${text(snapshot.termNote)}.` : 'Vigencia: según acuerdo entre las partes.',
      text(snapshot.renewalNote)
        ? `Renovación: ${text(snapshot.renewalNote)}.`
        : 'Renovación: no se establece renovación automática salvo acuerdo escrito.',
      text(snapshot.terminationNote)
        ? `Terminación: ${text(snapshot.terminationNote)}.`
        : 'Terminación: mecanismo y preaviso acordados expresamente.',
      'La finalización del marketing no elimina obligaciones de pago pendientes del desarrollo web, si existiera.',
    ],
  })

  const managesAds = (snapshot.campaigns ?? 0) > 0
  if (managesAds) {
    blocks.push({
      title: titled(index++, 'GASTOS Y PRESUPUESTO PUBLICITARIO'),
      paragraphs: [
        'Los honorarios mensuales de gestión son independientes del dinero invertido en anuncios en Meta u otras plataformas.',
      ],
      bullets: [
        snapshot.approvedAdBudgetUsd && snapshot.approvedAdBudgetUsd > 0
          ? `Presupuesto aprobado: USD $${snapshot.approvedAdBudgetUsd.toFixed(2)}/mes — pago del cliente a Meta.`
          : snapshot.adBudgetChoice === 'pending'
            ? `Presupuesto recomendado pendiente de aprobación (orientativo).`
            : 'Presupuesto publicitario no contratado o no definido.',
      ],
    })
  }

  indexRef.value = index
}
