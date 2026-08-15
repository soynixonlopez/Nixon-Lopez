import { INVOICE_BRANDING } from '@/lib/invoice-branding'
import {
  FEATURES,
  PROJECT_TYPES,
  SOCIAL_MEDIA_ADDITIONAL_SERVICES,
  SOCIAL_MEDIA_GENERAL_INCLUDES,
  getBusinessLabel,
  getFeature,
  getProjectType,
  isSocialMediaProjectType,
  isWebProjectType,
  type BusinessId,
  type ConfiguratorState,
  type FeatureId,
  type ProjectTypeId,
} from '@/lib/quote-configurator'
import { extractQuoteServiceSnapshots, getServiceOfferPoints, summarizeQuoteServiceLabels } from '@/lib/quote-pricing'
import type { ServiceContractRecord } from '@/lib/types/contract'

export type ContractTemplate = {
  objectText: string
  includes: string[]
  excludes: string[]
  timeline: string
}

export type ContractIntroSegment =
  | { kind: 'text'; value: string }
  | { kind: 'key'; value: string }

export type ContractClauseBlock = {
  title: string
  paragraphs?: string[]
  bullets?: string[]
  afterBullets?: string[]
  subsections?: Array<{
    heading: string
    paragraphs?: string[]
    bullets?: string[]
  }>
}

export type BuiltContractClauses = {
  intro: string
  introSegments: ContractIntroSegment[]
  serviceSubtitle: string
  blocks: ContractClauseBlock[]
  /** Compatibilidad con vistas antiguas */
  primera: string
  segundaIncluye: string[]
  segundaNoIncluye: string[]
  tercera: string[]
  cuarta: string[]
  quinta: string
}

const REP_LEGAL_NAME = INVOICE_BRANDING.signatoryLegalName

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
  'DÉCIMA SEXTA',
  'DÉCIMA SÉPTIMA',
  'DÉCIMA OCTAVA',
  'DÉCIMA NOVENA',
  'VIGÉSIMA',
  'VIGÉSIMA PRIMERA',
  'VIGÉSIMA SEGUNDA',
  'VIGÉSIMA TERCERA',
  'VIGÉSIMA CUARTA',
  'VIGÉSIMA QUINTA',
]

function titled(index: number, label: string) {
  const roman = ROMAN[index] ?? `CLÁUSULA ${index + 1}`
  return `${roman}: ${label}`
}

export function inferServiceType(serviceLabel: string) {
  const s = serviceLabel.toLowerCase()
  if (s.includes('redes') || s.includes('social')) return 'redes'
  if (s.includes('app')) return 'app'
  if (s.includes('ia') || s.includes('automat')) return 'automation'
  if (s.includes('ads') || s.includes('publicidad')) return 'ads'
  if (s.includes('seo') || s.includes('posicionamiento')) return 'seo'
  if (s.includes('tienda') || s.includes('ecommerce')) return 'tienda'
  if (s.includes('landing')) return 'landing'
  if (s.includes('sistema') || s.includes('plataforma')) return 'sistema'
  return 'web'
}

export function getContractTemplate(serviceLabel: string): ContractTemplate {
  const type = inferServiceType(serviceLabel)
  if (type === 'redes') {
    return {
      objectText:
        'EL PRESTADOR se compromete a prestar el servicio de manejo profesional de redes sociales (Instagram y Facebook), incluyendo estrategia, diseño, copywriting y programación de contenido, de acuerdo con el plan contratado.',
      includes: [...SOCIAL_MEDIA_GENERAL_INCLUDES],
      excludes: [...SOCIAL_MEDIA_ADDITIONAL_SERVICES],
      timeline: 'Según el plan contratado (arranque entre 2 y 10 días)',
    }
  }
  if (type === 'landing') {
    return {
      objectText:
        'EL PRESTADOR se compromete a desarrollar una Landing Page profesional, moderna y responsive, orientada a convertir visitas en contactos o ventas.',
      includes: [...(getProjectType('landing')?.includes ?? [])],
      excludes: [
        'Campañas publicitarias',
        'Diseño de logotipo',
        'Redacción de contenido no suministrado por EL CLIENTE',
        'Dominio, hosting o correos salvo contratación adicional',
      ],
      timeline: getProjectType('landing')?.delivery ?? '3 a 5 días hábiles',
    }
  }
  if (type === 'tienda') {
    return {
      objectText:
        'EL PRESTADOR se compromete a desarrollar una Tienda Online profesional con catálogo, carrito y flujo de checkout, de acuerdo con el alcance contratado.',
      includes: [...(getProjectType('tienda')?.includes ?? [])],
      excludes: [
        'Presupuesto publicitario',
        'Inventario físico o logística',
        'Comisiones de pasarelas de pago',
        'Nuevas funcionalidades fuera del alcance inicial',
      ],
      timeline: getProjectType('tienda')?.delivery ?? '10 a 14 días hábiles',
    }
  }
  if (type === 'sistema') {
    return {
      objectText:
        'EL PRESTADOR se compromete a desarrollar un sistema o plataforma a medida según los procesos y alcance acordados con EL CLIENTE.',
      includes: [...(getProjectType('sistema')?.includes ?? [])],
      excludes: [
        'Aplicaciones móviles nativas no contratadas',
        'Integraciones externas no contempladas',
        'Soporte ilimitado fuera del periodo pactado',
      ],
      timeline: getProjectType('sistema')?.delivery ?? '15 a 30 días hábiles',
    }
  }
  if (type === 'app') {
    return {
      objectText:
        'EL PRESTADOR se compromete a desarrollar una aplicación móvil funcional para el negocio del CLIENTE, con arquitectura, interfaz y despliegue acordados.',
      includes: [
        'Diseño y desarrollo de interfaces principales',
        'Configuración de entorno y build de publicación',
        'Integraciones técnicas necesarias del proyecto',
        'Pruebas funcionales y entrega operativa',
      ],
      excludes: [
        'Campañas de publicidad',
        'Servicios de terceros no contratados',
        'Nuevas funcionalidades fuera del alcance inicial',
      ],
      timeline: '15 a 30 días hábiles',
    }
  }
  return {
    objectText:
      'EL PRESTADOR se compromete a desarrollar un sitio web profesional para presencia digital comercial del CLIENTE, con estructura clara y experiencia optimizada.',
    includes: [...(getProjectType('profesional')?.includes ?? [])],
    excludes: [
      'Campañas publicitarias',
      'Diseño de logotipo',
      'Redacción de contenido no suministrado por EL CLIENTE',
      'Dominio, hosting o correos salvo contratación adicional',
    ],
    timeline: getProjectType('profesional')?.delivery ?? '5 a 7 días hábiles',
  }
}

function parseConfiguratorFromTerms(terms: Record<string, unknown> | null): Partial<ConfiguratorState> | null {
  if (!terms) return null
  const cfg = terms.configurator
  if (cfg && typeof cfg === 'object' && !Array.isArray(cfg)) {
    return cfg as Partial<ConfiguratorState>
  }
  const nested =
    terms.selected_services &&
    Array.isArray(terms.selected_services) &&
    terms.selected_services[0] &&
    typeof terms.selected_services[0] === 'object'
      ? (terms.selected_services[0] as Record<string, unknown>)
      : null
  if (!nested) return null
  const serviceId = typeof nested.serviceId === 'string' ? nested.serviceId : null
  const projectType =
    serviceId && (isWebProjectType(serviceId) || isSocialMediaProjectType(serviceId))
      ? (serviceId as ProjectTypeId)
      : null
  return {
    projectType,
    hasDomain:
      nested.hasDomain === 'si' || nested.hasDomain === 'no' ? nested.hasDomain : undefined,
    hasHosting:
      nested.hasHosting === 'si' || nested.hasHosting === 'no' ? nested.hasHosting : undefined,
    features: Array.isArray(nested.features)
      ? (nested.features.filter((id): id is FeatureId =>
          typeof id === 'string' && FEATURES.some((f) => f.id === id)
        ) as FeatureId[])
      : undefined,
  }
}

function money(amount: number) {
  return `USD $${amount.toFixed(2)}`
}

function half(amount: number) {
  return money(Number((amount / 2).toFixed(2)))
}

function projectObjectNarrative(
  projectType: ProjectTypeId | null,
  businessLabel: string | null,
  serviceLabel: string
) {
  const business = businessLabel ? ` orientada al sector ${businessLabel}` : ''
  if (isSocialMediaProjectType(projectType)) {
    return `EL PRESTADOR se compromete a prestar a EL CLIENTE el servicio de manejo profesional de redes sociales${business}, correspondiente al plan “${serviceLabel}”, incluyendo estrategia, diseño, copywriting y programación de contenido en las plataformas acordadas, de conformidad con el alcance del presente contrato.`
  }
  if (projectType === 'landing') {
    return `EL PRESTADOR se compromete a desarrollar para EL CLIENTE una Landing Page profesional, moderna, responsive y optimizada${business}, destinada a comunicar la oferta y convertir visitas en contactos o ventas, de acuerdo con el alcance establecido en el presente contrato.`
  }
  if (projectType === 'tienda') {
    return `EL PRESTADOR se compromete a desarrollar para EL CLIENTE una Tienda Online profesional, moderna, responsive y optimizada${business}, destinada a la presentación y comercialización de productos o servicios, de acuerdo con el alcance establecido en el presente contrato.`
  }
  if (projectType === 'sistema') {
    return `EL PRESTADOR se compromete a desarrollar para EL CLIENTE un sistema o plataforma web a medida${business}, mediante código personalizado y tecnologías web modernas, de acuerdo con las necesidades y alcance establecidos en el presente contrato.`
  }
  if (projectType === 'profesional') {
    return `EL PRESTADOR se compromete a desarrollar para EL CLIENTE un sitio web profesional, moderno, responsive y optimizado${business}, destinado a la promoción, presentación y captación de clientes, de acuerdo con el alcance establecido en el presente contrato.`
  }
  return `EL PRESTADOR se compromete a desarrollar para EL CLIENTE el servicio denominado “${serviceLabel}”, de forma profesional y de acuerdo con el alcance establecido en el presente contrato.`
}

/** Fragmentos para negrita + subrayado en datos sensibles (HTML/PDF). */
export function buildContractIntroSegments(contract: ServiceContractRecord): ContractIntroSegment[] {
  const clientTax = contract.client_tax_id?.trim() || ''
  const clientEmail = contract.client_email?.trim() || '____________________'
  const clientAddr = contract.client_address?.trim()
  const clientCity = contract.city?.trim()

  const segs: ContractIntroSegment[] = [
    {
      kind: 'text',
      value:
        'Entre Nixon Lopez Services, empresa dedicada al desarrollo de sistemas, sitios web y aplicaciones para empresas en la República de Panamá, con RUC No. ',
    },
    { kind: 'key', value: INVOICE_BRANDING.ruc },
    { kind: 'text', value: ', representada por ' },
    { kind: 'key', value: REP_LEGAL_NAME },
    {
      kind: 'text',
      value: ', en adelante denominada “EL PRESTADOR”; y ',
    },
    { kind: 'key', value: contract.client_name },
  ]

  if (clientTax) {
    segs.push({ kind: 'text', value: ', con cédula/RUC No. ' })
    segs.push({ kind: 'key', value: clientTax })
  }

  segs.push({ kind: 'text', value: ', con correo electrónico ' })
  segs.push({ kind: 'key', value: clientEmail })

  if (clientAddr) {
    segs.push({ kind: 'text', value: ', con domicilio en ' })
    segs.push({ kind: 'key', value: clientAddr })
  }

  if (clientCity) {
    segs.push({ kind: 'text', value: ', en la ciudad de ' })
    segs.push({ kind: 'key', value: clientCity })
  }

  segs.push({
    kind: 'text',
    value:
      '; en adelante denominada “EL CLIENTE”; acuerdan celebrar el presente Contrato de Prestación de Servicios Tecnológicos, el cual se regirá por las siguientes cláusulas:',
  })

  return segs
}

function buildSocialMediaContractClauses(
  contract: ServiceContractRecord,
  projectType: ProjectTypeId | null
): BuiltContractClauses {
  const project = getProjectType(projectType) ?? getProjectType(
    isSocialMediaProjectType(contract.service_type) ? contract.service_type : null
  )
  const terms = contract.terms_payload
  const configurator = parseConfiguratorFromTerms(terms)
  const businessId = (configurator?.business as BusinessId | null | undefined) ?? null
  const businessLabel = getBusinessLabel(businessId)
  const amount = Number(contract.total_amount || 0)
  const amountTxt = money(amount)
  const planLabel = project?.label || contract.service_label || 'Plan de manejo de redes'
  const delivery = project?.delivery ?? 'Según plan contratado'
  const includes = project?.includes?.length
    ? [...project.includes]
    : [...SOCIAL_MEDIA_GENERAL_INCLUDES]
  const excludes = [
    ...SOCIAL_MEDIA_ADDITIONAL_SERVICES,
    'Presupuesto publicitario (inversión en anuncios)',
    'Garantía de cantidad de seguidores, ventas, leads o resultados comerciales específicos',
    'Sesiones de producción audiovisual no contratadas expresamente',
    'Community management 24/7 salvo contratación adicional',
  ]

  const introSegments = buildContractIntroSegments(contract)
  const intro = introSegments.map((s) => s.value).join('')
  const serviceSubtitle = planLabel.toUpperCase()
  const blocks: ContractClauseBlock[] = []
  let i = 0

  blocks.push({
    title: titled(i++, 'OBJETO DEL CONTRATO'),
    paragraphs: [
      projectObjectNarrative(projectType ?? project?.id ?? null, businessLabel, planLabel),
      'El servicio consiste en el manejo profesional de redes sociales (principalmente Instagram y Facebook), con enfoque en presencia de marca, contenido y comunicación constante con EL CLIENTE.',
    ],
  })

  blocks.push({
    title: titled(i++, 'PLAN CONTRATADO Y ALCANCE'),
    paragraphs: [
      `El plan contratado corresponde a: ${planLabel}.`,
      project?.description ||
        'Manejo mensual de redes sociales según el volumen y entregables del plan.',
      'El alcance del plan incluye:',
    ],
    bullets: includes,
  })

  blocks.push({
    title: titled(i++, 'SERVICIOS BASE INCLUIDOS'),
    paragraphs: [
      'Independientemente del plan, el servicio contempla como base operativa:',
    ],
    bullets: [...SOCIAL_MEDIA_GENERAL_INCLUDES],
  })

  blocks.push({
    title: titled(i++, 'PLATAFORMAS Y ENTREGABLES'),
    paragraphs: [
      'Salvo pacto distinto, las plataformas principales serán Instagram y Facebook.',
      `El tiempo estimado de arranque / primera entrega del mes es de ${delivery}, contado a partir del pago del periodo y de la recepción de accesos, identidad visual e información necesaria.`,
      'EL CLIENTE deberá facilitar accesos de administrador a las cuentas, guías de marca, referencias y materiales requeridos para producir el contenido.',
    ],
  })

  blocks.push({
    title: titled(i++, 'OBLIGACIONES DEL CLIENTE'),
    paragraphs: [
      'EL CLIENTE será responsable de la veracidad, legalidad y autorización de uso de logotipos, fotografías, videos y textos que suministre.',
      'Los retrasos en entregas de información, aprobaciones o accesos podrán afectar el calendario de publicaciones del mes correspondiente.',
      'EL CLIENTE deberá revisar y aprobar el calendario o piezas cuando se solicite, en plazos razonables.',
    ],
  })

  blocks.push({
    title: titled(i++, 'COSTO MENSUAL Y FORMA DE PAGO'),
    paragraphs: [
      `El valor del servicio es de ${amountTxt} mensuales.`,
      'El pago corresponde a un periodo mensual anticipado. El servicio del mes no se inicia o continúa sin el pago correspondiente, salvo acuerdo escrito distinto.',
    ],
    subsections: [
      {
        heading: 'Forma de pago',
        bullets: [
          `Pago mensual anticipado: ${amountTxt}`,
          'Renovación mes a mes mientras no se notifique la cancelación',
          'El primer mes inicia al confirmar el pago y los accesos necesarios',
        ],
      },
      {
        heading: 'Métodos de pago',
        bullets: ['Transferencia bancaria / ACH', 'Yappy', 'Otro método previamente acordado'],
      },
    ],
  })

  blocks.push({
    title: titled(i++, 'DURACIÓN Y CANCELACIÓN'),
    paragraphs: [
      'El contrato se renueva de forma mensual de manera automática mientras EL CLIENTE continúe pagando el servicio.',
      'Cualquiera de las partes podrá dar por terminado el servicio con aviso escrito con al menos 7 días de anticipación al cierre del periodo mensual en curso.',
      'Los pagos ya realizados por periodos iniciados no son reembolsables, salvo pacto distinto.',
    ],
  })

  blocks.push({
    title: titled(i++, 'SERVICIOS NO INCLUIDOS'),
    paragraphs: [
      'Quedan fuera del alcance del plan, salvo contratación expresa adicional:',
    ],
    bullets: excludes,
  })

  blocks.push({
    title: titled(i++, 'RESULTADOS Y LIMITACIONES'),
    paragraphs: [
      'EL PRESTADOR se compromete a ejecutar el alcance contratado con diligencia profesional.',
      'EL PRESTADOR no garantiza métricas específicas de crecimiento, ventas, leads ni posiciones, ya que dependen de factores externos (mercado, presupuesto publicitario, producto, competencia, etc.).',
    ],
  })

  blocks.push({
    title: titled(i++, 'PROPIEDAD DEL CONTENIDO'),
    paragraphs: [
      'El contenido gráfico y copy creado específicamente para EL CLIENTE bajo este contrato podrá ser usado por EL CLIENTE en sus redes.',
      'EL PRESTADOR podrá incluir el trabajo en su portafolio profesional, salvo acuerdo de confidencialidad distinto.',
    ],
  })

  blocks.push({
    title: titled(i++, 'LEGISLACIÓN APLICABLE'),
    paragraphs: [
      'El presente contrato se rige por las leyes de la República de Panamá. Cualquier disputa será resuelta ante los tribunales competentes de Panamá.',
    ],
  })

  blocks.push({
    title: titled(i++, 'ACEPTACIÓN DEL CONTRATO'),
    paragraphs: [
      'Ambas partes manifiestan haber leído, comprendido y aceptado los términos establecidos en el presente contrato.',
      'Cualquier modificación de plan, volumen o servicios adicionales deberá acordarse por escrito antes de ejecutarse.',
    ],
  })

  if (contract.custom_notes?.trim()) {
    blocks.push({
      title: 'OBSERVACIONES ADICIONALES',
      paragraphs: [contract.custom_notes.trim()],
    })
  }

  return {
    intro,
    introSegments,
    serviceSubtitle,
    blocks,
    primera: blocks[0]?.paragraphs?.[0] ?? '',
    segundaIncluye: includes,
    segundaNoIncluye: excludes,
    tercera: [
      `El valor mensual del servicio será de ${amountTxt}.`,
      'Forma de pago: pago mensual anticipado.',
      'Renovación mes a mes mientras no se notifique la cancelación.',
      'Métodos de pago: Transferencia/ACH, Yappy u otro método previamente acordado.',
    ],
    cuarta: [
      'Plataformas principales: Instagram y Facebook.',
      'EL CLIENTE suministra accesos e identidad de marca.',
      'Servicios adicionales (ads, sesiones, reels) cotizan aparte.',
    ],
    quinta: `El arranque estimado es de ${delivery}, contado a partir del pago del periodo y de la entrega de accesos/materiales por EL CLIENTE.`,
  }
}

export function buildContractClauses(contract: ServiceContractRecord): BuiltContractClauses {
  const terms = contract.terms_payload
  const selectedServices = extractQuoteServiceSnapshots(terms)
  const configurator = parseConfiguratorFromTerms(terms)
  const projectType =
    (configurator?.projectType as ProjectTypeId | null | undefined) ??
    (isWebProjectType(contract.service_type) || isSocialMediaProjectType(contract.service_type)
      ? (contract.service_type as ProjectTypeId)
      : null)

  if (isSocialMediaProjectType(projectType) || inferServiceType(contract.service_label) === 'redes') {
    return buildSocialMediaContractClauses(contract, projectType)
  }

  const project = getProjectType(projectType)
  const businessId = (configurator?.business as BusinessId | null | undefined) ?? null
  const businessLabel = getBusinessLabel(businessId)
  const featureIds: FeatureId[] = Array.isArray(configurator?.features)
    ? configurator!.features!
    : []
  const featureLabels = featureIds
    .map((id) => getFeature(id))
    .filter((f): f is NonNullable<typeof f> => Boolean(f))

  const contractServices =
    selectedServices.length > 0
      ? selectedServices
      : [
          {
            serviceId: contract.service_type ?? '',
            label: contract.service_label,
            offerPoints: getServiceOfferPoints(contract.service_type, contract.service_label),
            monthly: false,
          },
        ]

  const isMultiService = contractServices.length > 1
  const labelSummary = summarizeQuoteServiceLabels(contractServices.map((s) => s.label))
  const template = getContractTemplate(contract.service_label || project?.label || 'Servicio web')
  const amount = Number(contract.total_amount || 0)
  const amountTxt = money(amount)
  const delivery = project?.delivery ?? template.timeline
  const serviceSubtitle = (
    project?.label ||
    contract.service_label ||
    'SERVICIO TECNOLÓGICO'
  ).toUpperCase()

  const includesFromProject = project?.includes?.length
    ? [...project.includes]
    : contractServices[0]?.offerPoints?.length
      ? contractServices[0].offerPoints
      : template.includes

  const includesFromFeatures = featureLabels.map(
    (f) => `${f.label}${f.price > 0 ? ` (+$${f.price})` : ''}: ${f.description}`
  )

  const hasDomainNo = configurator?.hasDomain === 'no'
  const hasHostingNo = configurator?.hasHosting === 'no'
  const emailCount = typeof configurator?.emailCount === 'number' ? configurator.emailCount : 0
  const hasPanel = featureIds.includes('panel')
  const hasPasarela = featureIds.includes('pasarela')
  const hasMapa = featureIds.includes('mapa')
  const hasReservas = featureIds.includes('reservas')
  const hasSeo = featureIds.includes('seo')
  const hasChatIa = featureIds.includes('chat-ia')
  const hasCatalogo = featureIds.includes('catalogo')
  const hasGaleria = featureIds.includes('galeria')
  const hasFormulario = featureIds.includes('formulario')
  const hasWhatsapp = featureIds.includes('whatsapp') || featureIds.length === 0

  const excludes = [
    'Campañas publicitarias y presupuesto de anuncios, salvo contratación adicional expresa',
    'Diseño de logotipo o identidad visual completa, salvo que se indique en observaciones',
    'Redacción de contenido, fotografías o videos no suministrados por EL CLIENTE',
    'Costos de dominio, hosting, correos, Vercel, Supabase, APIs o servicios externos no incluidos en el valor del desarrollo',
    'Nuevas funcionalidades, módulos o rediseños no contemplados en este contrato',
    'Garantía de posiciones en buscadores, cantidad de ventas, leads o resultados comerciales',
  ]

  const introSegments = buildContractIntroSegments(contract)
  const intro = introSegments.map((s) => s.value).join('')

  const blocks: ContractClauseBlock[] = []
  let i = 0

  blocks.push({
    title: titled(i++, 'OBJETO DEL CONTRATO'),
    paragraphs: [
      isMultiService
        ? `EL PRESTADOR se compromete a ejecutar el paquete de servicios tecnológicos contratado por EL CLIENTE, compuesto por: ${labelSummary}.`
        : projectObjectNarrative(projectType, businessLabel, contract.service_label),
      projectType === 'sistema' || hasPanel
        ? 'La solución podrá contemplar una interfaz pública para visitantes y, cuando corresponda al alcance, un panel administrativo privado mediante el cual EL CLIENTE podrá administrar contenido o información de forma independiente.'
        : 'La solución será desarrollada con una interfaz pública clara, profesional y orientada a los objetivos comerciales del proyecto.',
      'El desarrollo se realizará mediante código personalizado y tecnologías web modernas, de acuerdo con las necesidades y alcance establecidos en el presente contrato.',
    ],
  })

  blocks.push({
    title: titled(i++, 'ALCANCE BASE DEL SERVICIO'),
    paragraphs: [
      `El servicio contratado corresponde a: ${project?.label || contract.service_label}.`,
      project?.description || template.objectText,
      'El alcance base incluye:',
    ],
    bullets: includesFromProject,
  })

  if (includesFromFeatures.length > 0) {
    blocks.push({
      title: titled(i++, 'FUNCIONALIDADES CONTRATADAS'),
      paragraphs: [
        'Además del alcance base, el proyecto incluye las siguientes funcionalidades seleccionadas en la cotización aprobada:',
      ],
      bullets: includesFromFeatures,
      afterBullets: [
        'Cualquier funcionalidad no listada en esta cláusula podrá considerarse un servicio adicional y requerirá cotización y aprobación previa.',
      ],
    })
  }

  blocks.push({
    title: titled(i++, 'TECNOLOGÍA Y DESARROLLO PERSONALIZADO'),
    paragraphs: [
      'La solución será desarrollada mediante código personalizado, pudiendo EL PRESTADOR seleccionar la arquitectura y herramientas tecnológicas adecuadas para el correcto funcionamiento, rendimiento y escalabilidad del proyecto.',
      'La solución podrá utilizar tecnologías y servicios especializados para frontend, backend, base de datos, almacenamiento, despliegue, seguridad, APIs, analítica y servicios externos según el alcance.',
      'EL PRESTADOR podrá utilizar servicios como Vercel, Supabase u otros equivalentes cuando sea técnicamente conveniente, sin que ello implique que dichos costos de infraestructura estén incluidos en el valor del desarrollo, salvo pacto expreso en contrario.',
    ],
  })

  if (hasPanel) {
    blocks.push({
      title: titled(i++, 'PANEL ADMINISTRATIVO'),
      paragraphs: [
        'Cuando el alcance incluya panel administrativo, EL CLIENTE podrá gestionar contenido o información clave del proyecto desde un entorno privado.',
      ],
      bullets: [
        'Acceso privado con credenciales',
        'Creación, edición y eliminación de contenido según el módulo contratado',
        'Publicación y despublicación de elementos administrables',
        'Actualización de textos, imágenes u otros datos contemplados en el alcance',
      ],
      afterBullets: [
        'EL CLIENTE será responsable del uso correcto del panel y de la veracidad de la información que publique.',
      ],
    })
  }

  if (hasPasarela) {
    blocks.push({
      title: titled(i++, 'PASARELA DE PAGOS'),
      paragraphs: [
        'El proyecto contempla la integración de una pasarela o método de cobro online según lo acordado en la cotización.',
        'Los costos, comisiones, cuentas mercantes y aprobaciones de los proveedores de pago son responsabilidad de EL CLIENTE.',
        'EL PRESTADOR no garantiza la aprobación de cuentas mercantes ni tiempos de habilitación de terceros.',
      ],
    })
  }

  if (hasReservas) {
    blocks.push({
      title: titled(i++, 'RESERVAS / CITAS'),
      paragraphs: [
        'El sistema incluirá un módulo de reservas o citas según el alcance contratado, permitiendo a los usuarios solicitar o agendar según la configuración definida.',
      ],
    })
  }

  if (hasMapa) {
    blocks.push({
      title: titled(i++, 'MAPA Y UBICACIÓN'),
      paragraphs: [
        'El proyecto podrá mostrar ubicación mediante un servicio de mapas (por ejemplo Google Maps, Mapbox u equivalente).',
        'Los costos derivados de dichos servicios externos no están incluidos en el valor del desarrollo y serán responsabilidad de EL CLIENTE.',
      ],
    })
  }

  if (hasCatalogo || projectType === 'tienda') {
    blocks.push({
      title: titled(i++, 'CATÁLOGO / PRODUCTOS'),
      paragraphs: [
        projectType === 'tienda'
          ? 'La tienda permitirá presentar productos, navegar el catálogo y completar el flujo de compra según el alcance contratado.'
          : 'El catálogo permitirá presentar productos o ítems de forma ordenada, sin necesariamente incluir carrito de compra, salvo que se haya contratado expresamente.',
        'EL CLIENTE deberá suministrar la información, precios e imágenes necesarias para la carga inicial acordada.',
      ],
    })
  }

  if (hasGaleria) {
    blocks.push({
      title: titled(i++, 'GALERÍA DE MEDIOS'),
      paragraphs: [
        'El proyecto incluirá una galería o sección de medios para mostrar fotografías o portafolio, según el diseño y alcance definidos.',
        'EL CLIENTE deberá entregar imágenes optimizadas y autorizadas para su publicación.',
      ],
    })
  }

  if (hasFormulario || hasWhatsapp) {
    blocks.push({
      title: titled(i++, 'CONTACTO Y CAPTURA DE CLIENTES'),
      paragraphs: ['El proyecto facilitará el contacto con potenciales clientes mediante:'],
      bullets: [
        ...(hasWhatsapp ? ['Botón o enlace de WhatsApp'] : []),
        ...(hasFormulario ? ['Formulario de contacto con validación básica'] : []),
        'Llamados a la acción visibles en puntos clave',
      ],
    })
  }

  if (hasSeo) {
    blocks.push({
      title: titled(i++, 'IMPLEMENTACIÓN SEO EN LA WEB'),
      paragraphs: [
        'EL PRESTADOR realizará una implementación SEO orientada a proporcionar una estructura adecuada para motores de búsqueda.',
      ],
      bullets: [
        'URLs amigables',
        'Títulos y meta descripciones',
        'Estructura semántica básica',
        'Open Graph / vista previa al compartir',
        'Configuración básica de indexación',
      ],
      afterBullets: [
        'Esta implementación corresponde a una configuración inicial y no constituye un servicio permanente de posicionamiento. EL PRESTADOR no garantiza posiciones específicas ni resultados comerciales.',
      ],
    })
  }

  if (hasChatIa) {
    blocks.push({
      title: titled(i++, 'CHAT CON INTELIGENCIA ARTIFICIAL'),
      paragraphs: [
        'El proyecto incluirá un asistente o chat con IA según el alcance contratado.',
        'El rendimiento del asistente dependerá de la información suministrada por EL CLIENTE y de los servicios de terceros utilizados. Los costos de uso de APIs de IA, si aplican, serán responsabilidad de EL CLIENTE salvo pacto distinto.',
      ],
    })
  }

  blocks.push({
    title: titled(i++, 'DISEÑO RESPONSIVE'),
    paragraphs: [
      'La solución será desarrollada para adaptarse a computadoras, laptops, tablets y teléfonos móviles.',
      'EL PRESTADOR realizará las adaptaciones necesarias para una experiencia de navegación adecuada en los dispositivos contemplados durante el desarrollo.',
    ],
  })

  blocks.push({
    title: titled(i++, 'DISEÑO Y PROPUESTA VISUAL'),
    paragraphs: [
      'EL PRESTADOR podrá presentar una propuesta visual, prototipo o representación de interfaz con carácter referencial y conceptual.',
      'Una vez contratado el proyecto, la interfaz será personalizada y desarrollada en código según las necesidades del alcance.',
      'Los cambios sustanciales o nuevas funcionalidades solicitadas posteriormente podrán generar costos adicionales.',
    ],
  })

  blocks.push({
    title: titled(i++, 'CONTENIDO Y RESPONSABILIDAD DEL CLIENTE'),
    paragraphs: [
      'EL CLIENTE deberá entregar oportunamente textos, imágenes, logotipos, datos de contacto e información necesaria para completar el proyecto.',
      'EL CLIENTE será responsable de la veracidad, legalidad y autorización de uso de todo el contenido proporcionado.',
      'EL PRESTADOR no estará obligado a investigar, inventar o completar información faltante, ni a obtener fotografías por cuenta propia.',
    ],
  })

  blocks.push({
    title: titled(i++, 'DOMINIO, HOSTING, CORREOS E INFRAESTRUCTURA'),
    paragraphs: [
      `El valor del desarrollo (${amountTxt}) corresponde al trabajo de diseño y desarrollo acordado.`,
      'Los costos de infraestructura y servicios externos son independientes, salvo que en la cotización se hayan incluido ítems específicos.',
    ],
    bullets: [
      hasDomainNo
        ? 'Dominio: incluido en la cotización o a gestionar según lo acordado (+ costo si aplica).'
        : 'Dominio: EL CLIENTE declara contar con dominio, o lo gestionará por su cuenta.',
      hasHostingNo
        ? 'Hosting / despliegue: contemplado según la cotización; costos recurrentes de proveedores externos pueden aplicar.'
        : 'Hosting / despliegue: EL CLIENTE asume o ya cuenta con la infraestructura necesaria.',
      emailCount > 0
        ? `Correos corporativos: ${emailCount >= 6 ? '6 o más' : emailCount} contemplado(s) en la cotización.`
        : 'Correos corporativos: no incluidos, salvo acuerdo posterior.',
      'Servicios como Vercel, Supabase, mapas, APIs o analítica pueden generar costos mensuales a cargo de EL CLIENTE.',
    ],
    afterBullets: [
      'EL PRESTADOR no será responsable por cambios de precios, límites, políticas o caídas de proveedores externos.',
    ],
  })

  blocks.push({
    title: titled(i++, 'PLAZO DE ENTREGA'),
    paragraphs: [
      `El tiempo estimado de desarrollo será de ${delivery}.`,
      'El plazo comenzará a contar a partir de la recepción del pago inicial, de la información necesaria, del contenido y de la confirmación de los requerimientos establecidos.',
      'Los retrasos ocasionados por falta de información, materiales, aprobaciones o accesos por parte de EL CLIENTE podrán extender el plazo de entrega.',
    ],
  })

  blocks.push({
    title: titled(i++, 'COSTO DEL PROYECTO Y FORMA DE PAGO'),
    paragraphs: [
      `El valor total acordado para el desarrollo será de ${amountTxt}.`,
      'El valor incluye el alcance y las funcionalidades descritas en las cláusulas anteriores, de conformidad con la cotización aprobada.',
    ],
    subsections: [
      {
        heading: 'Forma de pago',
        bullets: [
          `50% para iniciar el proyecto: ${half(amount)}`,
          `50% contra entrega y aprobación final: ${half(amount)}`,
          'El proyecto no iniciará hasta recibir el pago inicial.',
        ],
      },
      {
        heading: 'Métodos de pago',
        bullets: [
          'Transferencia bancaria / ACH',
          'Yappy',
          'Otro método previamente acordado',
        ],
      },
    ],
  })

  blocks.push({
    title: titled(i++, 'CAPACITACIÓN'),
    paragraphs: [
      'Una vez finalizado el desarrollo, EL PRESTADOR realizará una capacitación inicial para explicar el funcionamiento de la solución entregada.',
      'La capacitación tendrá una duración de hasta 60 minutos, salvo acuerdo diferente entre las partes, y podrá realizarse de forma remota.',
    ],
  })

  blocks.push({
    title: titled(i++, 'GARANTÍA TÉCNICA'),
    paragraphs: [
      'EL PRESTADOR otorgará una garantía técnica de 7 días calendario posteriores a la entrega final.',
    ],
    bullets: [
      'Errores de programación',
      'Fallos funcionales del alcance contratado',
      'Problemas de visualización derivados del desarrollo',
      'Ajustes menores derivados del desarrollo original',
    ],
    afterBullets: [
      'La garantía no incluye nuevas funcionalidades, rediseños, cambios de terceros, problemas de infraestructura o proveedores externos, ni modificaciones realizadas directamente por EL CLIENTE.',
    ],
  })

  blocks.push({
    title: titled(i++, 'ACOMPAÑAMIENTO INICIAL'),
    paragraphs: [
      'EL PRESTADOR brindará un período de acompañamiento de 30 días calendario posteriores a la entrega, para resolución de dudas puntuales, orientación sobre el uso de la solución y corrección de errores relacionados con el desarrollo.',
      'El tiempo estimado de respuesta será de 24 a 48 horas hábiles.',
      'Este acompañamiento no incluye capacitaciones ilimitadas, reuniones recurrentes, nuevas funcionalidades ni administración diaria del contenido.',
    ],
  })

  blocks.push({
    title: titled(i++, 'MANTENIMIENTO Y SOPORTE OPCIONAL'),
    paragraphs: [
      'Una vez finalizado el período de acompañamiento inicial, EL CLIENTE podrá contratar voluntariamente un plan de mantenimiento y soporte.',
      'Como referencia, el mantenimiento básico tendrá un costo desde USD $20 mensuales e incluye actualizaciones técnicas menores, supervisión básica y soporte preventivo, según el plan acordado.',
      'Los planes no incluyen nuevas funcionalidades, rediseños completos, costos de infraestructura ni presupuesto publicitario.',
    ],
  })

  blocks.push({
    title: titled(i++, 'SERVICIOS ADICIONALES'),
    paragraphs: [
      'Cualquier funcionalidad no contemplada expresamente en este contrato podrá considerarse un servicio adicional y será cotizada previamente.',
    ],
    bullets: excludes,
  })

  blocks.push({
    title: titled(i++, 'PROPIEDAD DIGITAL Y ACCESOS'),
    paragraphs: [
      'Una vez cancelado el 100% del proyecto, EL CLIENTE tendrá derecho sobre los activos específicos desarrollados para su proyecto (sitio o sistema, contenido propio y accesos administrativos correspondientes).',
      'EL PRESTADOR conservará la propiedad intelectual sobre herramientas propias, metodologías, componentes genéricos, librerías y estructuras técnicas reutilizables.',
      'EL PRESTADOR podrá mostrar el proyecto en su portafolio profesional, salvo pacto de confidencialidad distinto.',
    ],
  })

  blocks.push({
    title: titled(i++, 'CANCELACIÓN DEL PROYECTO'),
    paragraphs: [
      'Si EL CLIENTE cancela el proyecto después de iniciado el desarrollo, el anticipo recibido no será reembolsable debido al tiempo, trabajo y recursos destinados.',
      'Si EL PRESTADOR cancela el proyecto sin causa justificada, deberá devolver el monto correspondiente al trabajo no ejecutado.',
    ],
  })

  blocks.push({
    title: titled(i++, 'APROBACIÓN Y ENTREGA'),
    paragraphs: [
      'Una vez finalizado el desarrollo, EL PRESTADOR presentará la solución a EL CLIENTE para su revisión.',
      'EL CLIENTE podrá reportar errores correspondientes al alcance originalmente contratado. Las nuevas funcionalidades o modificaciones sustanciales podrán cotizarse por separado.',
      'La aprobación podrá realizarse mediante WhatsApp, correo electrónico, firma u otro medio que deje constancia de la aceptación.',
    ],
  })

  blocks.push({
    title: titled(i++, 'LEGISLACIÓN APLICABLE'),
    paragraphs: [
      'El presente contrato se rige por las leyes de la República de Panamá. Cualquier disputa será resuelta ante los tribunales competentes de Panamá.',
    ],
  })

  blocks.push({
    title: titled(i++, 'ACEPTACIÓN DEL CONTRATO'),
    paragraphs: [
      'Ambas partes manifiestan haber leído, comprendido y aceptado los términos establecidos en el presente contrato.',
      'Cualquier modificación, ampliación o nueva funcionalidad deberá ser acordada entre ambas partes antes de su desarrollo.',
    ],
  })

  if (contract.custom_notes?.trim()) {
    blocks.push({
      title: 'OBSERVACIONES ADICIONALES',
      paragraphs: [contract.custom_notes.trim()],
    })
  }

  const segundaIncluye = [
    ...includesFromProject,
    ...featureLabels.map((f) => f.label),
  ]

  return {
    intro,
    introSegments,
    serviceSubtitle,
    blocks,
    primera: blocks[0]?.paragraphs?.[0] ?? template.objectText,
    segundaIncluye,
    segundaNoIncluye: excludes,
    tercera: [
      `El valor total del proyecto será de ${amountTxt}.`,
      `Forma de pago: 50% anticipo (${half(amount)}) y 50% contra entrega (${half(amount)}).`,
      'El proyecto no iniciará hasta recibir el pago inicial.',
      'Métodos de pago: Transferencia/ACH, Yappy u otro método previamente acordado.',
    ],
    cuarta: [
      hasDomainNo
        ? 'Dominio contemplado según cotización / a gestionar con costo adicional si aplica.'
        : 'Dominio a cargo de EL CLIENTE o ya existente.',
      hasHostingNo
        ? 'Hosting/despliegue contemplado según cotización; costos recurrentes de terceros pueden aplicar.'
        : 'Hosting/despliegue a cargo de EL CLIENTE o ya existente.',
      emailCount > 0
        ? `Correos corporativos: ${emailCount} contemplado(s) en cotización.`
        : 'Correos corporativos no incluidos salvo acuerdo posterior.',
    ],
    quinta: `El tiempo estimado de desarrollo será de ${delivery}, contados a partir de la recepción del pago inicial y de la entrega completa del contenido por parte de EL CLIENTE.`,
  }
}

/** Reexport útil para UI */
export { PROJECT_TYPES }
