/**
 * Fuente única de planes, extras y reglas comerciales.
 * Los precios son USD. El desarrollo web es pago único (precio base por proyecto).
 * El marketing digital es mensual. Los gastos de terceros no son honorarios del proveedor.
 */

export type BillingKind = 'once' | 'monthly' | 'external'

export type WebPlanId =
  | 'landing'
  | 'profesional'
  | 'web-panel'
  | 'corporativo'
  | 'tienda'
  | 'reservas'

export type MarketingPlanId = 'mkt-presencia' | 'mkt-crecimiento' | 'mkt-integral'

export type SocialChannel = 'instagram' | 'facebook'

export type CatalogPlan = {
  id: WebPlanId | MarketingPlanId
  label: string
  description: string
  basePrice: number
  billing: 'once' | 'monthly'
  category: 'web' | 'marketing'
  recommended?: boolean
  pagesIncluded: number | null
  productsIncluded: number | null
  servicesIncluded: number | null
  postsPerMonth: number | null
  reelsPerMonth: number | null
  campaignsIncluded: number | null
  storiesIncluded: boolean
  storiesPerWeek?: number
  hasAdmin: boolean
  hasGateway: boolean
  includes: readonly string[]
  excludes: readonly string[]
}

export const PRICE_EXTRA_PAGE_USD = 25
export const PRICE_DOMAIN_USD = 20
export const PRICE_HOSTING_USD = 60
export const PRICE_EMAIL_USD = 15

/** Productos iniciales incluidos en la tienda. Se puede cambiar en la cotización. */
export const STORE_PRODUCTS_INCLUDED = 15
/** Servicios o actividades reservables incluidos en el plan base. */
export const BOOKING_SERVICES_INCLUDED = 8

const WEB_EXCLUDES = [
  'Hosting, dominio, correos y licencias de terceros, salvo que se listen como gasto externo.',
  'Comisiones de pasarelas de pago, suscripciones y cuentas de proveedores.',
  'Mantenimiento continuo, salvo contratación posterior.',
  'Revisiones ilimitadas o cambios fuera del alcance.',
  'Garantía de ventas, posiciones SEO o resultados comerciales.',
  'Contenido, fotografías o videos que el cliente no entregue.',
] as const

/** Obligación comercial estándar en todos los planes de redes. */
export const MARKETING_STORIES_PER_WEEK = 3
export const MARKETING_STORIES_MONTHLY_ESTIMATE = 12

export const MARKETING_STORIES_SCOPE_LINE =
  '3 historias por semana en Instagram y Facebook (aprox. 12 en un mes de cuatro semanas; la obligación es semanal). Historias diseñadas y publicadas con el material e información disponibles; no incluye grabaciones presenciales salvo acuerdo expreso.'

const MARKETING_EXCLUDES = [
  'Presupuesto publicitario pagado a Meta u otras plataformas.',
  'Producción presencial de fotografías o videos.',
  'Atención ilimitada de mensajes.',
  'Desarrollo de funcionalidades web nuevas.',
  'Ventas, clientes o resultados comerciales garantizados.',
] as const

export const WEB_PLANS: readonly CatalogPlan[] = [
  {
    id: 'landing',
    label: 'Landing Page',
    description: 'Una página de aterrizaje para presentar un producto, servicio o campaña.',
    basePrice: 99,
    billing: 'once',
    category: 'web',
    pagesIncluded: 1,
    productsIncluded: null,
    servicesIncluded: null,
    postsPerMonth: null,
    reelsPerMonth: null,
    campaignsIncluded: null,
    storiesIncluded: false,
    hasAdmin: false,
    hasGateway: false,
    includes: [
      'Una página de aterrizaje enfocada en un producto, servicio o campaña.',
      'Diseño adaptable a móviles, tabletas y computadoras.',
      'Sección principal, beneficios, información comercial y llamada a la acción.',
      'Integración de botones de WhatsApp o contacto.',
      'Configuración SEO técnica básica.',
      'Publicación y despliegue del sitio.',
    ],
    excludes: [...WEB_EXCLUDES, 'Panel de administración.', 'Tienda, carrito o reservas.'],
  },
  {
    id: 'profesional',
    label: 'Sitio Web de Servicios Profesionales',
    description: 'Sitio para profesionales independientes y pequeños negocios.',
    basePrice: 150,
    billing: 'once',
    category: 'web',
    pagesIncluded: 5,
    productsIncluded: null,
    servicesIncluded: null,
    postsPerMonth: null,
    reelsPerMonth: null,
    campaignsIncluded: null,
    storiesIncluded: false,
    hasAdmin: false,
    hasGateway: false,
    includes: [
      'Sitio para profesionales independientes y pequeños negocios.',
      'Hasta 5 páginas o secciones principales, según la estructura acordada.',
      'Presentación de servicios, información del negocio y contacto.',
      'Diseño responsive.',
      'Integración de WhatsApp y formularios de contacto.',
      'SEO técnico básico.',
      'Despliegue y publicación.',
    ],
    excludes: [...WEB_EXCLUDES, 'Panel de administración completo.', 'Pasarela de pago.', 'Tienda online.'],
  },
  {
    id: 'web-panel',
    label: 'Sitio Web con Panel de Administración',
    description: 'Sitio administrable. El panel cubre solo los contenidos o módulos definidos en la cotización.',
    basePrice: 199,
    billing: 'once',
    category: 'web',
    pagesIncluded: 5,
    productsIncluded: null,
    servicesIncluded: null,
    postsPerMonth: null,
    reelsPerMonth: null,
    campaignsIncluded: null,
    storiesIncluded: false,
    hasAdmin: true,
    hasGateway: false,
    includes: [
      'Sitio web administrable.',
      'Panel de administración con autenticación.',
      'Gestión de los contenidos principales definidos en el alcance.',
      'Crear, editar y eliminar los registros compatibles con el módulo contratado.',
      'Integración con base de datos cuando sea necesaria.',
      'Diseño responsive.',
      'Configuración SEO técnica básica.',
      'Despliegue y publicación.',
    ],
    excludes: [
      ...WEB_EXCLUDES,
      'CMS completo, roles avanzados o módulos no incluidos en el alcance.',
      'Pasarela de pago, salvo contratación adicional.',
    ],
  },
  {
    id: 'corporativo',
    label: 'Sitio Web Corporativo',
    description: 'Sitio para empresas. No incluye pasarela, carrito ni reservas, salvo que se agreguen como extra.',
    basePrice: 250,
    billing: 'once',
    category: 'web',
    pagesIncluded: 7,
    productsIncluded: null,
    servicesIncluded: null,
    postsPerMonth: null,
    reelsPerMonth: null,
    campaignsIncluded: null,
    storiesIncluded: false,
    hasAdmin: false,
    hasGateway: false,
    includes: [
      'Diseño profesional para empresas.',
      'Página de inicio corporativa.',
      'Secciones de empresa, servicios, proyectos o portafolio y contacto.',
      'Hasta 7 páginas o secciones principales, según la arquitectura acordada.',
      'Integración de WhatsApp y formularios comerciales.',
      'Diseño responsive.',
      'SEO técnico básico, metadatos y estructura semántica.',
      'Despliegue y publicación.',
    ],
    excludes: [
      ...WEB_EXCLUDES,
      'Pasarela de pago, carrito y reservas, salvo extra aceptado en la cotización.',
      'Catálogo y gestión de productos: eso corresponde a la tienda online.',
      'Panel de administración, salvo que se contrate como extra.',
    ],
  },
  {
    id: 'tienda',
    label: 'Tienda online',
    description: 'Catálogo, carrito, panel de productos y pedidos, y pasarela de pago sujeta a la cuenta del cliente.',
    basePrice: 299,
    billing: 'once',
    category: 'web',
    pagesIncluded: null,
    productsIncluded: STORE_PRODUCTS_INCLUDED,
    servicesIncluded: null,
    postsPerMonth: null,
    reelsPerMonth: null,
    campaignsIncluded: null,
    storiesIncluded: false,
    hasAdmin: true,
    hasGateway: true,
    includes: [
      'Catálogo de productos.',
      'Categorías y páginas de detalle de productos.',
      'Carrito de compras.',
      'Panel para gestionar productos, precios, categorías y pedidos.',
      `Carga inicial de hasta ${STORE_PRODUCTS_INCLUDED} productos. La cantidad se puede ajustar en la cotización.`,
      'Integración de una pasarela de pago compatible, sujeta a disponibilidad y aprobación de la cuenta del cliente.',
      'Flujo de compra y confirmación de pedidos.',
      'Diseño responsive.',
      'Configuración SEO básica.',
      'Despliegue y publicación.',
    ],
    excludes: [
      ...WEB_EXCLUDES,
      'Comisiones de la pasarela, suscripciones de terceros, alojamiento y servicios de pago, salvo acuerdo expreso.',
      'Productos por encima de la cantidad acordada en la cotización.',
    ],
  },
  {
    id: 'reservas',
    label: 'Sistema Web de Reservas con Pasarela de Pago',
    description: 'Reservas de servicios, citas o actividades, con panel y cobro online.',
    basePrice: 450,
    billing: 'once',
    category: 'web',
    pagesIncluded: null,
    productsIncluded: null,
    servicesIncluded: BOOKING_SERVICES_INCLUDED,
    postsPerMonth: null,
    reelsPerMonth: null,
    campaignsIncluded: null,
    storiesIncluded: false,
    hasAdmin: true,
    hasGateway: true,
    includes: [
      'Sitio profesional para reservas de servicios, citas o actividades.',
      'Catálogo de servicios o actividades reservables.',
      `Hasta ${BOOKING_SERVICES_INCLUDED} servicios o actividades en la carga inicial, salvo otra cantidad en la cotización.`,
      'Formulario y flujo de reserva.',
      'Selección de fechas y horarios según las reglas acordadas.',
      'Panel de administración para gestionar reservas.',
      'Integración de una pasarela de pago.',
      'Confirmación de reservas y estados de pago.',
      'Diseño responsive.',
      'SEO técnico básico.',
      'Despliegue y publicación.',
    ],
    excludes: [
      ...WEB_EXCLUDES,
      'Disponibilidad avanzada, calendarios complejos, notificaciones automáticas, roles, cancelaciones y reembolsos, salvo que consten en el alcance.',
      'Comisiones de la pasarela y costos de terceros.',
    ],
  },
]

export const MARKETING_PLANS: readonly CatalogPlan[] = [
  {
    id: 'mkt-presencia',
    label: 'Presencia Digital',
    description: 'Publicaciones mensuales, historias semanales, calendario e informe básico. Sin campañas de anuncios.',
    basePrice: 150,
    billing: 'monthly',
    category: 'marketing',
    pagesIncluded: null,
    productsIncluded: null,
    servicesIncluded: null,
    postsPerMonth: 8,
    reelsPerMonth: 0,
    campaignsIncluded: 0,
    storiesIncluded: true,
    storiesPerWeek: MARKETING_STORIES_PER_WEEK,
    hasAdmin: false,
    hasGateway: false,
    includes: [
      '8 publicaciones mensuales en el feed.',
      MARKETING_STORIES_SCOPE_LINE,
      'Diseños gráficos y textos publicitarios.',
      'Adaptación del contenido para Instagram y Facebook.',
      'Calendario y programación de publicaciones.',
      'Optimización básica de los perfiles comerciales.',
      'Informe mensual básico.',
      'No incluye gestión de campañas publicitarias.',
    ],
    excludes: [
      ...MARKETING_EXCLUDES,
      'Gestión de campañas publicitarias.',
      'Inversión en anuncios.',
    ],
  },
  {
    id: 'mkt-crecimiento',
    label: 'Publicidad y Crecimiento',
    description: 'Contenido mensual, historias semanales y hasta 2 campañas Meta Ads. La inversión en anuncios es aparte.',
    basePrice: 250,
    billing: 'monthly',
    category: 'marketing',
    recommended: true,
    pagesIncluded: null,
    productsIncluded: null,
    servicesIncluded: null,
    postsPerMonth: 12,
    reelsPerMonth: 0,
    campaignsIncluded: 2,
    storiesIncluded: true,
    storiesPerWeek: MARKETING_STORIES_PER_WEEK,
    hasAdmin: false,
    hasGateway: false,
    includes: [
      '12 publicaciones mensuales en el feed.',
      MARKETING_STORIES_SCOPE_LINE,
      'Diseños gráficos y textos comerciales.',
      'Adaptación para Instagram y Facebook.',
      'Programación de publicaciones.',
      'Configuración inicial de campañas publicitarias, incluida dentro de la contratación mensual.',
      'Gestión de hasta 2 campañas activas de Meta Ads.',
      'Segmentación, seguimiento y optimización.',
      'Configuración de Meta Pixel cuando corresponda y sea técnicamente viable.',
      'Informe mensual de resultados.',
    ],
    excludes: [...MARKETING_EXCLUDES],
  },
  {
    id: 'mkt-integral',
    label: 'Marketing Integral',
    description: 'Más contenido, historias semanales, reels y hasta 3 campañas activas.',
    basePrice: 400,
    billing: 'monthly',
    category: 'marketing',
    pagesIncluded: null,
    productsIncluded: null,
    servicesIncluded: null,
    postsPerMonth: 16,
    reelsPerMonth: 4,
    campaignsIncluded: 3,
    storiesIncluded: true,
    storiesPerWeek: MARKETING_STORIES_PER_WEEK,
    hasAdmin: false,
    hasGateway: false,
    includes: [
      '16 publicaciones mensuales en el feed.',
      MARKETING_STORIES_SCOPE_LINE,
      'Diseños gráficos y textos publicitarios.',
      'Adaptación para Instagram y Facebook.',
      'Programación de publicaciones.',
      'Hasta 4 reels editados mensuales, utilizando material proporcionado por el cliente.',
      'Gestión de hasta 3 campañas activas de Meta Ads.',
      'Pruebas de creatividades y audiencias.',
      'Seguimiento de conversiones.',
      'Informe mensual detallado.',
      'Reunión mensual de seguimiento.',
    ],
    excludes: [...MARKETING_EXCLUDES, 'Servicios externos de pago.'],
  },
]

export const CATALOG_PLANS: readonly CatalogPlan[] = [...WEB_PLANS, ...MARKETING_PLANS]

export function getCatalogPlan(id: string | null | undefined): CatalogPlan | null {
  if (!id) return null
  return CATALOG_PLANS.find((plan) => plan.id === id) ?? null
}

export function isWebPlanId(id: string | null | undefined): id is WebPlanId {
  return WEB_PLANS.some((plan) => plan.id === id)
}

export function isMarketingPlanId(id: string | null | undefined): id is MarketingPlanId {
  return MARKETING_PLANS.some((plan) => plan.id === id)
}

export type CommercialExtraLine = {
  id: string
  label: string
  amount: number
  billing: BillingKind
  payer: 'proveedor' | 'cliente' | 'tercero'
}

export type AdBudgetChoice = 'none' | 'accepted' | 'custom' | 'pending'

export type CommercialTotals = {
  lines: Array<{ id: string; label: string; amount: number; billing: BillingKind }>
  oneTime: number
  monthly: number
  external: number
  /** Honorarios iniciales: pago único + primer mes recurrente. Sin gastos externos. */
  initialFees: number
  /** Honorarios mensuales a partir del periodo siguiente. */
  nextMonthly: number
  approvedAdBudget: number
  pendingAdBudget: number
  recommendedAdBudget: number
  /** Honorarios iniciales más pauta ya aprobada. La pauta no es honorario. */
  projectedInitial: number
  projectedMonthly: number
  taxRate: number | null
  taxAmount: number
  storiesPending: boolean
}

export type CommercialInput = {
  webPlanId: string | null
  webPlanIds?: string[]
  marketingPlanId: string | null
  extraPages: number
  featureLines: Array<{ id: string; label: string; amount: number; includedInPlan?: boolean }>
  includeStories: boolean
  storiesPerMonth: number
  storiesUnitPrice: number
  adBudgetAccepted: boolean
  adBudgetChoice?: AdBudgetChoice
  recommendedAdBudgetUsd?: number
  adBudgetUsd: number
  adsSetupPrice: number
  hasDomain: 'si' | 'no' | ''
  hasHosting: 'si' | 'no' | ''
  emailCount: number
  taxRate: number | null
}

export function priceCommercial(input: CommercialInput): CommercialTotals {
  const lines: CommercialTotals['lines'] = []
  const webIds = (input.webPlanIds?.length ? input.webPlanIds : input.webPlanId ? [input.webPlanId] : []).filter(
    isWebPlanId,
  )
  const webs = webIds.map((id) => getCatalogPlan(id)).filter((plan): plan is CatalogPlan => Boolean(plan))
  const marketing = isMarketingPlanId(input.marketingPlanId) ? getCatalogPlan(input.marketingPlanId) : null

  for (const plan of webs) {
    lines.push({
      id: `project-${plan.id}`,
      label: plan.label,
      amount: plan.basePrice,
      billing: 'once',
    })
  }
  const pagePlan = webs.find((plan) => plan.pagesIncluded != null)
  const extra = Math.max(0, Math.floor(input.extraPages))
  if (pagePlan?.pagesIncluded != null && extra > 0) {
    lines.push({
      id: 'extra-pages',
      label: `Páginas adicionales (${extra} × $${PRICE_EXTRA_PAGE_USD})`,
      amount: extra * PRICE_EXTRA_PAGE_USD,
      billing: 'once',
    })
  }

  for (const feature of input.featureLines) {
    if (feature.includedInPlan || feature.amount <= 0) continue
    lines.push({
      id: `feature-${feature.id}`,
      label: feature.label,
      amount: feature.amount,
      billing: 'once',
    })
  }

  if (input.adsSetupPrice > 0) {
    lines.push({
      id: 'ads-setup',
      label: 'Configuración inicial de publicidad (pago único)',
      amount: input.adsSetupPrice,
      billing: 'once',
    })
  }

  if (marketing) {
    lines.push({
      id: `project-${marketing.id}`,
      label: `${marketing.label} (mensual)`,
      amount: marketing.basePrice,
      billing: 'monthly',
    })
  }

  const storiesPending = false

  if (webs.length > 0) {
    if (input.hasDomain === 'no') {
      lines.push({
        id: 'domain',
        label: 'Dominio (lo paga el cliente al registrador)',
        amount: PRICE_DOMAIN_USD,
        billing: 'external',
      })
    }
    if (input.hasHosting === 'no') {
      lines.push({
        id: 'hosting',
        label: 'Hosting (lo paga el cliente al proveedor)',
        amount: PRICE_HOSTING_USD,
        billing: 'external',
      })
    }
    if (input.emailCount > 0) {
      const count = Math.min(input.emailCount, 6)
      lines.push({
        id: 'emails',
        label: `Correos profesionales (${count}, costo de tercero)`,
        amount: count * PRICE_EMAIL_USD,
        billing: 'external',
      })
    }
    if (webs.some((plan) => plan.hasGateway)) {
      lines.push({
        id: 'gateway-fees',
        label: 'Comisiones de pasarela (las cobra el proveedor de pago, no están en los honorarios)',
        amount: 0,
        billing: 'external',
      })
    }
  }

  const recommendedAdBudget = Math.max(0, input.recommendedAdBudgetUsd ?? 150)
  const managesAds = (marketing?.campaignsIncluded ?? 0) > 0
  const choice: AdBudgetChoice = !managesAds
    ? 'none'
    : (input.adBudgetChoice ?? (input.adBudgetAccepted ? 'custom' : 'none'))
  let approvedAdBudget = 0
  let pendingAdBudget = 0
  if (managesAds && choice === 'accepted') {
    approvedAdBudget = recommendedAdBudget
  } else if (managesAds && choice === 'custom' && input.adBudgetUsd > 0) {
    approvedAdBudget = input.adBudgetUsd
  } else if (managesAds && choice === 'pending') {
    pendingAdBudget = recommendedAdBudget
  }
  if (approvedAdBudget > 0) {
    lines.push({
      id: 'ad-budget',
      label: 'Presupuesto publicitario aprobado (lo paga el cliente a Meta, no es honorario)',
      amount: approvedAdBudget,
      billing: 'external',
    })
  }

  const oneTime = sum(lines, 'once')
  const monthly = sum(lines, 'monthly')
  const external = sum(lines, 'external')
  const initialFees = oneTime + monthly
  const taxRate = input.taxRate != null && input.taxRate > 0 ? input.taxRate : null
  const taxAmount = taxRate != null ? Number(((initialFees * taxRate) / 100).toFixed(2)) : 0

  return {
    lines,
    oneTime,
    monthly,
    external,
    initialFees: Number((initialFees + taxAmount).toFixed(2)),
    nextMonthly: monthly,
    approvedAdBudget,
    pendingAdBudget,
    recommendedAdBudget: managesAds ? recommendedAdBudget : 0,
    projectedInitial: Number((initialFees + taxAmount + approvedAdBudget).toFixed(2)),
    projectedMonthly: Number((monthly + approvedAdBudget).toFixed(2)),
    taxRate,
    taxAmount,
    storiesPending,
  }
}

function sum(lines: CommercialTotals['lines'], billing: BillingKind) {
  return lines.filter((line) => line.billing === billing).reduce((total, line) => total + line.amount, 0)
}

export type CommercialSnapshot = {
  webPlanId: WebPlanId | null
  marketingPlanId: MarketingPlanId | null
  webLabel: string | null
  marketingLabel: string | null
  channels: SocialChannel[]
  postsPerMonth: number | null
  reelsPerMonth: number | null
  campaigns: number | null
  storiesIncluded: boolean
  storiesPerWeek?: number
  storiesPerMonth: number
  storiesUnitPrice: number
  pagesIncluded: number | null
  extraPages: number
  productsIncluded: number | null
  servicesIncluded: number | null
  adminModulesNote: string | null
  scopeNotes: string
  includes: string[]
  excludes: string[]
  webIncludes?: string[]
  marketingIncludes?: string[]
  totals: CommercialTotals
  revisionRounds: number | null
  startDate: string
  deliveryDate: string
  paymentMethod: string
  advanceNote: string
  balanceNote: string
  adBudgetUsd: number
  adBudgetAccepted: boolean
  adBudgetChoice?: AdBudgetChoice
  recommendedAdBudgetUsd?: number
  approvedAdBudgetUsd?: number
  webPlans?: Array<{ id: string; label: string; basePrice: number }>
  marketingStartDate?: string
  marketingFirstPayment?: string
  paymentSchedule: string
  termNote: string
  renewalNote: string
  terminationNote: string
}

export function emptyCommercialTerms() {
  return {
    revisionRounds: null as number | null,
    startDate: '',
    deliveryDate: '',
    paymentMethod: '',
    advanceNote: '',
    balanceNote: '',
    paymentSchedule: '',
    termNote: '',
    renewalNote: '',
    terminationNote: '',
  }
}
