/** Configurador de cotización — precios y reglas del wizard premium. */

import {
  BILLABLE_FEATURE_CATALOG,
  getBillableFeatureDef,
  isBillableFeatureId,
  isCourtesyAddonId,
  mergeCourtesyCatalog,
  resolveCourtesyAddonsForWebPlans,
  type CourtesyAddonDefinition,
} from '@/lib/courtesy-addons'
import {
  MARKETING_PLANS,
  MARKETING_STORIES_PER_WEEK,
  WEB_PLANS,
  getCatalogPlan,
  isMarketingPlanId,
  isWebPlanId,
  appendWebExternalInfraLines,
  priceCommercial,
  type AdBudgetChoice,
  type CommercialSnapshot,
  type MarketingPlanId,
  type SocialChannel,
  type WebPlanId,
} from '@/lib/service-catalog'

export type { MarketingPlanId, SocialChannel, WebPlanId }

export type WebProjectTypeId = WebPlanId | 'sistema'
export type SocialMediaPlanId =
  | MarketingPlanId
  | 'redes-emprendedor'
  | 'redes-profesional'
  | 'redes-corporativo'
  | 'redes-premium'
/** Servicios admin (no cotizador público). */
export type AdminOnlyProjectTypeId = 'rediseno-web'
export type ProjectTypeId = WebProjectTypeId | SocialMediaPlanId | AdminOnlyProjectTypeId
export type BusinessId =
  | 'turismo'
  | 'restaurante'
  | 'abogado'
  | 'educacion'
  | 'clinica'
  | 'belleza'
  | 'inmobiliaria'
  | 'otro'
export type FeatureId =
  | 'whatsapp'
  | 'formulario'
  | 'cta'
  | 'social-links'
  | 'email-link'
  | 'mapa'
  | 'galeria'
  | 'blog'
  | 'seo'
  | 'reservas'
  | 'animaciones'
  | 'multiidioma'
  | 'pasarela'
  | 'catalogo'
  | 'chat-ia'
  | 'panel'

export type QuotePricingContext = {
  courtesyCatalog?: CourtesyAddonDefinition[]
}
export type TimelineId = 'urgente' | 'este-mes' | 'sin-prisa'
export type YesNo = 'si' | 'no' | ''
export type EmailCount = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type QuoteLine = {
  id: string
  label: string
  amount: number
  billing?: 'once' | 'monthly' | 'external'
}

export type ConfiguratorState = {
  projectType: ProjectTypeId | null
  /** Plan mensual. Puede combinarse con un plan web en `projectType`. */
  marketingPlan: MarketingPlanId | null
  business: BusinessId | null
  features: FeatureId[]
  hasDomain: YesNo
  hasHosting: YesNo
  emailCount: EmailCount
  timeline: TimelineId | null
  nombre: string
  empresa: string
  correo: string
  whatsapp: string
  extraPages: number
  webPlanIds: WebPlanId[]
  /** Frecuencia semanal de historias (planes de marketing). Predeterminado 3. */
  storiesPerWeek: number
  includeStories: boolean
  storiesPerMonth: number
  storiesUnitPrice: number
  adBudgetChoice: AdBudgetChoice
  adBudgetAccepted: boolean
  recommendedAdBudgetUsd: number
  adBudgetUsd: number
  adsSetupPrice: number
  channels: SocialChannel[]
  scopeNotes: string
  productCount: number | null
  serviceCount: number | null
  revisionRounds: number | null
  customizeVolume: boolean
  customPosts: number | null
  customReels: number | null
  customCampaigns: number | null
  /** Porcentaje de impuesto solo si se configuró. Null = no aplicar. */
  taxRate: number | null
  paymentMethod: string
  advanceNote: string
  balanceNote: string
  paymentSchedule: string
  termNote: string
  renewalNote: string
  terminationNote: string
  startDate: string
  deliveryDate: string
  marketingStartDate: string
  marketingFirstPayment: string
}

export const INITIAL_CONFIGURATOR_STATE: ConfiguratorState = {
  projectType: null,
  marketingPlan: null,
  business: null,
  features: [],
  hasDomain: '',
  hasHosting: '',
  emailCount: 0,
  timeline: null,
  nombre: '',
  empresa: '',
  correo: '',
  whatsapp: '',
  extraPages: 0,
  webPlanIds: [],
  storiesPerWeek: 3,
  includeStories: false,
  storiesPerMonth: 0,
  storiesUnitPrice: 0,
  adBudgetChoice: 'none',
  adBudgetAccepted: false,
  recommendedAdBudgetUsd: 150,
  adBudgetUsd: 0,
  adsSetupPrice: 0,
  channels: ['instagram', 'facebook'],
  scopeNotes: '',
  productCount: null,
  serviceCount: null,
  revisionRounds: null,
  customizeVolume: false,
  customPosts: null,
  customReels: null,
  customCampaigns: null,
  taxRate: null,
  paymentMethod: '',
  advanceNote: '',
  balanceNote: '',
  paymentSchedule: '',
  termNote: '',
  renewalNote: '',
  terminationNote: '',
  startDate: '',
  deliveryDate: '',
  marketingStartDate: '',
  marketingFirstPayment: '',
}

/** Incluidos en todos los planes de redes (admin). */
export const SOCIAL_MEDIA_GENERAL_INCLUDES = [
  'Investigación de marca y audiencia',
  'Planificación mensual de contenido',
  'Diseño de piezas gráficas',
  'Copywriting profesional',
  'Programación de publicaciones',
  'Soporte y comunicación constante',
] as const

/** Servicios que no forman parte de los planes base de marketing. */
export const SOCIAL_MEDIA_ADDITIONAL_SERVICES = [
  'Presupuesto publicitario pagado a la plataforma (no es honorario)',
  'Producción presencial de fotografías o videos',
  'Atención ilimitada de mensajes',
  'Desarrollo de funcionalidades web',
  'Configuración inicial de publicidad cuando no hay gestión mensual: se cotiza aparte',
] as const

const WEB_PROJECT_TYPES = WEB_PLANS.map((plan) => ({
  id: plan.id,
  label: plan.label,
  description: plan.description,
  basePrice: plan.basePrice,
  priceLabel: 'Precio base por proyecto',
  delivery: 'Por acordar en la cotización',
  category: 'web' as const,
  adminOnly: false as const,
  monthly: false as const,
  includes: plan.includes,
  excludes: plan.excludes,
}))

/** Conservado solo para cotizaciones y contratos anteriores. */
const LEGACY_WEB_TYPES = [
  {
    id: 'sistema' as const,
    label: 'Sistema a medida',
    description: 'Plan anterior. Las propuestas nuevas usan los planes del catálogo vigente.',
    basePrice: 500,
    priceLabel: 'Desde',
    delivery: 'Por acordar',
    fromPrice: true as const,
    category: 'web' as const,
    adminOnly: true as const,
    legacy: true as const,
    monthly: false as const,
    includes: [
      'Análisis de procesos y alcance funcional',
      'Desarrollo a medida según los flujos acordados',
      'Interfaz adaptada a la operación',
    ],
  },
] as const

/** Planes de marketing digital (mensuales). */
const SOCIAL_MEDIA_PLANS = MARKETING_PLANS.map((plan) => ({
  id: plan.id,
  label: plan.label,
  description: plan.description,
  basePrice: plan.basePrice,
  priceLabel: 'Mensual',
  delivery: 'Por acordar en la cotización',
  category: 'redes' as const,
  adminOnly: false as const,
  monthly: true as const,
  badge: plan.recommended ? 'Recomendado' : undefined,
  target: plan.recommended ? 'Plan recomendado' : 'Marketing digital mensual',
  includes: plan.includes,
  excludes: plan.excludes,
}))

/** Planes de redes anteriores. No se ofrecen en propuestas nuevas. */
const LEGACY_SOCIAL_PLANS = [
  {
    id: 'redes-emprendedor' as const,
    label: 'Plan Emprendedor — Manejo de redes',
    description: 'Para negocios que necesitan empezar a tener presencia profesional.',
    basePrice: 100,
    priceLabel: 'Mensual',
    delivery: '2 a 3 días',
    category: 'redes' as const,
    adminOnly: true as const,
    monthly: true as const,
    badge: 'Para quienes inician',
    target: 'Emprendedores y negocios que empiezan',
    includes: [
      '6 posts al mes',
      'Diseño gráfico de las publicaciones',
      'Copywriting (textos)',
      'Publicación en Instagram y Facebook',
      'Programación de contenido',
      'Calendario de contenido básico',
      'Adaptación a la identidad de la marca',
      '1 reporte mensual básico',
    ],
  },
  {
    id: 'redes-profesional' as const,
    label: 'Plan Profesional — Manejo de redes',
    description: 'Para negocios que quieren mantener presencia activa y seguir creciendo.',
    basePrice: 180,
    priceLabel: 'Mensual',
    delivery: '3 a 5 días',
    category: 'redes' as const,
    adminOnly: true as const,
    monthly: true as const,
    badge: 'Más vendido',
    target: 'Para negocios en crecimiento',
    includes: [
      '10 posts al mes',
      'Hasta 4 stories al mes',
      '2 reels básicos al mes',
      'Diseño de contenido personalizado',
      'Estrategia mensual de contenido',
      'Optimización de bio / perfil',
      'Programación de contenido',
      'Reporte mensual de resultados',
      '1 reunión online al mes',
    ],
  },
  {
    id: 'redes-corporativo' as const,
    label: 'Plan Corporativo — Manejo de redes',
    description: 'Para empresas que buscan un manejo más completo y estratégico.',
    basePrice: 280,
    priceLabel: 'Mensual',
    delivery: '5 a 7 días',
    category: 'redes' as const,
    adminOnly: true as const,
    monthly: true as const,
    badge: 'Para empresas',
    target: 'Para empresas que quieren destacar',
    includes: [
      '14 posts al mes',
      'Hasta 8 stories al mes',
      'Hasta 4 reels al mes',
      'Calendario de contenido estratégico',
      'Gestión básica de comentarios y mensajes',
      'Estrategia de crecimiento',
      'Diseño gráfico avanzado',
      'Reporte mensual con métricas',
      '1 reunión online al mes',
    ],
  },
  {
    id: 'redes-premium' as const,
    label: 'Plan Premium — Manejo de redes',
    description: 'Manejo completo para marcas que quieren delegar su presencia en redes.',
    basePrice: 400,
    priceLabel: 'Mensual',
    delivery: '7 a 10 días',
    category: 'redes' as const,
    adminOnly: true as const,
    monthly: true as const,
    badge: 'Resultados reales',
    target: 'Para marcas que quieren resultados reales',
    includes: [
      '18 posts al mes',
      'Stories ilimitadas (sujeto a volumen razonable acordado)',
      'Hasta 8 reels al mes',
      'Gestión de comentarios y mensajes',
      'Estrategia de contenido y crecimiento',
      'Contenido promocional',
      'Diseño personalizado premium',
      'Reporte detallado de resultados',
      'Reunión quincenal',
      'Optimización continua del perfil',
      'Asesoría estratégica',
    ],
  },
] as const

/** Rediseño de sitio existente — solo admin. */
const ADMIN_WEB_SERVICES = [
  {
    id: 'rediseno-web' as const,
    label: 'Rediseño web',
    description:
      'Mejora visual y de contenido del sitio actual (páginas existentes). Ideal para WordPress u otra web ya publicada.',
    basePrice: 150,
    priceLabel: 'Precio fijo',
    delivery: '5 a 10 días hábiles',
    category: 'rediseno' as const,
    adminOnly: true as const,
    monthly: false as const,
    badge: 'Sitio existente',
    target: 'WordPress u otra web ya publicada — sin nuevas páginas ni funciones',
    includes: [
      'Rediseño visual general de las páginas ya existentes',
      'Ajustes de contenido orientados a SEO (títulos, textos, estructura)',
      'Mejora de hooks / mensajes de apertura',
      'Optimización de llamadas a la acción (CTAs)',
      'Ajuste e integración de imágenes en el diseño actual',
      'Mejora de jerarquía visual y legibilidad',
      'Adaptación responsive del diseño rediseñado',
      'Sin agregar nuevas funcionalidades',
      'Sin crear páginas nuevas (solo páginas disponibles)',
    ],
  },
] as const

export const REDESIGN_EXCLUDES = [
  'Nuevas páginas o secciones no existentes en el sitio actual',
  'Nuevas funcionalidades, plugins, módulos o integraciones',
  'Desarrollo de tienda, reservas, pasarela u otros sistemas',
  'Campañas publicitarias o presupuesto de anuncios',
  'Diseño de logotipo o identidad visual completa (salvo acuerdo expreso)',
  'Redacción de todo el contenido desde cero si EL CLIENTE no suministra textos',
  'Dominio, hosting o correos (se trabaja sobre el sitio y accesos existentes)',
] as const

export const PROJECT_TYPES = [
  ...WEB_PROJECT_TYPES,
  ...LEGACY_WEB_TYPES,
  ...ADMIN_WEB_SERVICES,
  ...SOCIAL_MEDIA_PLANS,
  ...LEGACY_SOCIAL_PLANS,
]

/** Tipos visibles en cotizador público. */
export const PUBLIC_PROJECT_TYPES = WEB_PROJECT_TYPES

/** Tipos disponibles en propuestas nuevas (sin planes heredados). */
export const ADMIN_PROJECT_TYPES = [...WEB_PROJECT_TYPES, ...ADMIN_WEB_SERVICES, ...SOCIAL_MEDIA_PLANS]

export function isSocialMediaProjectType(
  id: ProjectTypeId | string | null | undefined
): id is SocialMediaPlanId {
  return typeof id === 'string' && (id.startsWith('redes-') || id.startsWith('mkt-'))
}

export function isRedesignProjectType(
  id: ProjectTypeId | string | null | undefined
): id is AdminOnlyProjectTypeId {
  return id === 'rediseno-web'
}

/** Alcance fijo (sin extras de dominio/features): redes o rediseño. */
export function isFixedScopeAdminProject(
  id: ProjectTypeId | string | null | undefined
): boolean {
  return isSocialMediaProjectType(id) || isRedesignProjectType(id)
}

export function isWebProjectType(id: ProjectTypeId | string | null | undefined): id is WebProjectTypeId {
  return isWebPlanId(id) || id === 'sistema'
}

export const BUSINESS_TYPES = [
  { id: 'turismo' as const, label: 'Turismo' },
  { id: 'restaurante' as const, label: 'Restaurante' },
  { id: 'abogado' as const, label: 'Abogado' },
  { id: 'educacion' as const, label: 'Educación' },
  { id: 'clinica' as const, label: 'Clínica' },
  { id: 'belleza' as const, label: 'Belleza' },
  { id: 'inmobiliaria' as const, label: 'Inmobiliaria' },
  { id: 'otro' as const, label: 'Otro' },
] as const

/** Compatibilidad con contratos antiguos y admin. Preferir catálogos de cortesía / facturables. */
export const FEATURES = [
  ...mergeCourtesyCatalog([]).map((item) => ({
    id: item.id as FeatureId,
    label: item.name,
    price: 0,
    description: item.description,
  })),
  ...BILLABLE_FEATURE_CATALOG.map((item) => ({
    id: item.id as FeatureId,
    label: item.label,
    price: item.publicPrice ?? 0,
    description: item.description,
  })),
] as const

export const TIMELINES = [
  { id: 'urgente' as const, label: 'Lo antes posible', description: 'Prioridad alta' },
  { id: 'este-mes' as const, label: 'Este mes', description: 'Dentro del mes' },
  { id: 'sin-prisa' as const, label: 'Sin prisa', description: 'Flexible' },
] as const

export const TOTAL_STEPS = 6

export const STEP_LABELS = [
  'Proyecto',
  'Negocio',
  'Funciones',
  'Extras',
  'Plazo',
  'Datos',
] as const

export const BENEFITS = [
  'Precio transparente',
  'Sin compromiso',
  'Atención directa',
  'Propuesta personalizada',
] as const

export function getProjectType(id: ProjectTypeId | null) {
  return PROJECT_TYPES.find((item) => item.id === id) ?? null
}

export function getFeature(id: FeatureId) {
  return FEATURES.find((item) => item.id === id) ?? null
}

export function getBusinessLabel(id: BusinessId | null) {
  return BUSINESS_TYPES.find((item) => item.id === id)?.label ?? null
}

export function getTimelineLabel(id: TimelineId | null) {
  return TIMELINES.find((item) => item.id === id)?.label ?? null
}

function activeMarketingId(state: ConfiguratorState): MarketingPlanId | null {
  if (state.marketingPlan && isMarketingPlanId(state.marketingPlan)) return state.marketingPlan
  if (isMarketingPlanId(state.projectType)) return state.projectType
  return null
}

export function activeWebIds(state: ConfiguratorState): WebPlanId[] {
  const fromList = state.webPlanIds.filter(isWebPlanId)
  if (fromList.length > 0) return fromList
  return isWebPlanId(state.projectType) ? [state.projectType] : []
}

function activeWebId(state: ConfiguratorState): WebPlanId | null {
  return activeWebIds(state)[0] ?? null
}

export function planAlreadyIncludes(planId: string | null, featureId: FeatureId) {
  const plan = getCatalogPlan(planId)
  if (!plan) return false
  if (isCourtesyAddonId(featureId)) return plan.category === 'web'
  if (featureId === 'seo') return plan.category === 'web'
  if (featureId === 'panel') return plan.hasAdmin
  if (featureId === 'pasarela') return plan.hasGateway
  if (featureId === 'reservas') return plan.id === 'reservas'
  if (featureId === 'catalogo') return plan.id === 'tienda'
  return false
}

function pricingCourtesyCatalog(ctx?: QuotePricingContext) {
  return ctx?.courtesyCatalog ?? mergeCourtesyCatalog([])
}

function buildBillableFeatureLines(state: ConfiguratorState, webIds: WebPlanId[]) {
  return state.features
    .filter((id): id is FeatureId => isBillableFeatureId(id))
    .map((id) => {
      const def = getBillableFeatureDef(id)!
      const included = webIds.some((planId) => planAlreadyIncludes(planId, id))
      const amount =
        included || def.publicPrice == null || def.publicPrice <= 0 ? 0 : def.publicPrice
      return {
        id,
        label: def.label,
        amount,
        includedInPlan: included || amount === 0,
      }
    })
}

export function buildQuoteLines(state: ConfiguratorState, ctx?: QuotePricingContext): QuoteLine[] {
  const webId = activeWebId(state)
  const marketingId = activeMarketingId(state)
  if (webId || marketingId) {
    const webIds = activeWebIds(state)
    const totals = priceCommercial({
      webPlanId: webIds[0] ?? null,
      webPlanIds: webIds,
      marketingPlanId: marketingId,
      extraPages: state.extraPages,
      featureLines: buildBillableFeatureLines(state, webIds),
      includeStories: false,
      storiesPerMonth: 0,
      storiesUnitPrice: 0,
      adBudgetAccepted: state.adBudgetChoice === 'accepted' || state.adBudgetChoice === 'custom',
      adBudgetChoice: state.adBudgetChoice,
      recommendedAdBudgetUsd: state.recommendedAdBudgetUsd,
      adBudgetUsd: state.adBudgetUsd,
      adsSetupPrice: state.adsSetupPrice,
      hasDomain: state.hasDomain,
      hasHosting: state.hasHosting,
      emailCount: state.emailCount,
      taxRate: state.taxRate,
    })
    return totals.lines
  }

  const lines: QuoteLine[] = []
  const project = getProjectType(state.projectType)
  if (project) {
    lines.push({
      id: `project-${project.id}`,
      label: project.monthly ? `${project.label} (mensual)` : project.label,
      amount: project.basePrice,
      billing: project.monthly ? 'monthly' : 'once',
    })
  }

  // Planes heredados de redes / rediseño: precio fijo del servicio, sin extras de web
  if (isFixedScopeAdminProject(state.projectType)) {
    return lines
  }

  for (const featureId of state.features) {
    if (!isBillableFeatureId(featureId)) continue
    const def = getBillableFeatureDef(featureId)
    if (!def || def.publicPrice == null || def.publicPrice <= 0) continue
    if (webId && planAlreadyIncludes(webId, featureId)) continue
    lines.push({
      id: `feature-${def.id}`,
      label: def.label,
      amount: def.publicPrice,
    })
  }

  appendWebExternalInfraLines(lines, {
    hasDomain: state.hasDomain,
    hasHosting: state.hasHosting,
    emailCount: state.emailCount,
  })

  return lines
}

export function calculateQuote(state: ConfiguratorState, ctx?: QuotePricingContext) {
  const lines = buildQuoteLines(state, ctx)
  const oneTime = lines.filter((line) => line.billing !== 'monthly' && line.billing !== 'external').reduce((sum, line) => sum + line.amount, 0)
  const monthlyAmount = lines.filter((line) => line.billing === 'monthly').reduce((sum, line) => sum + line.amount, 0)
  const external = lines.filter((line) => line.billing === 'external').reduce((sum, line) => sum + line.amount, 0)
  const hasCatalog = Boolean(activeWebId(state) || activeMarketingId(state))
  const total = hasCatalog ? oneTime + monthlyAmount : lines.reduce((sum, line) => sum + line.amount, 0)
  const webs = activeWebIds(state).map((id) => getCatalogPlan(id)).filter((plan): plan is NonNullable<typeof plan> => Boolean(plan))
  const marketing = getCatalogPlan(activeMarketingId(state))
  const project = getProjectType(state.projectType)
  const projectLabel = [...webs.map((plan) => plan.label), marketing?.label].filter(Boolean).join(' + ') || project?.label || 'Tu proyecto'
  const isMonthly = monthlyAmount > 0 && oneTime === 0
  const managesAds = (marketing?.campaignsIncluded ?? 0) > 0
  const recommendedAdBudget = managesAds ? state.recommendedAdBudgetUsd || 150 : 0
  const approvedAdBudget = !managesAds
    ? 0
    : state.adBudgetChoice === 'accepted'
      ? recommendedAdBudget
      : state.adBudgetChoice === 'custom'
        ? state.adBudgetUsd
        : 0
  const pendingAdBudget = managesAds && state.adBudgetChoice === 'pending' ? recommendedAdBudget : 0
  const initialTotal = hasCatalog ? oneTime + monthlyAmount : total
  return {
    lines,
    total,
    oneTime: hasCatalog ? oneTime : isMonthly ? 0 : total,
    monthlyAmount,
    external: hasCatalog ? external : 0,
    initialTotal,
    approvedAdBudget,
    pendingAdBudget,
    recommendedAdBudget,
    projectedInitial: initialTotal + approvedAdBudget,
    projectedMonthly: monthlyAmount + approvedAdBudget,
    nextMonthly: monthlyAmount,
    delivery: project?.delivery ?? 'Por acordar en la cotización',
    projectLabel,
    monthly: isMonthly,
    mixed: oneTime > 0 && monthlyAmount > 0,
    storiesPending: false,
    includedZeroPriceFeatures: isFixedScopeAdminProject(state.projectType) && !activeWebId(state)
      ? []
      : resolveCourtesyAddonsForWebPlans(activeWebIds(state), pricingCourtesyCatalog(ctx)).map((item) => item.name),
  }
}

export function mapLegacyServiceToProject(serviceId: string | null): ProjectTypeId | null {
  if (!serviceId) return null
  const id = serviceId.toLowerCase()
  if (isMarketingPlanId(id)) return id
  if (id.startsWith('redes-')) return id as ProjectTypeId
  if (isRedesignProjectType(id)) return id
  if (id === 'landing') return 'landing'
  if (id.includes('reserva')) return 'reservas'
  if (id.includes('panel')) return 'web-panel'
  if (id.includes('corporativ')) return 'corporativo'
  if (id.includes('tienda') || id.includes('productos') || id.includes('ecommerce') || id === 'tienda') {
    return 'tienda'
  }
  if (id.includes('sistema') || id.includes('software') || id === 'custom') return 'reservas'
  if (id.includes('web') || id.includes('wordpress') || id.includes('rediseno') || id === 'profesional' || id === 'web-negocio') {
    return 'profesional'
  }
  if (id === 'pasarela' || id.includes('pasarela')) return 'profesional'
  if (id.includes('presencia') || id.includes('marketing') || id.includes('publicidad')) return 'mkt-crecimiento'
  return 'profesional'
}

export function mapLegacyServiceToMarketing(serviceId: string | null): MarketingPlanId | null {
  if (!serviceId) return null
  const id = serviceId.toLowerCase()
  if (isMarketingPlanId(id)) return id
  if (id.includes('presencia')) return 'mkt-presencia'
  if (id.includes('integral')) return 'mkt-integral'
  if (id.includes('publicidad') || id.includes('crecimiento') || id.includes('redes')) return 'mkt-crecimiento'
  return null
}

/** Extras sugeridos al llegar desde el home con ?service= */
export function mapLegacyServiceToFeatures(_serviceId: string | null): FeatureId[] {
  return []
}

export function buildCommercialSnapshot(
  state: ConfiguratorState,
  ctx?: QuotePricingContext,
): CommercialSnapshot | null {
  const webIds = activeWebIds(state)
  const webId = webIds[0] ?? null
  const marketingId = activeMarketingId(state)
  const webs = webIds.map((id) => getCatalogPlan(id)).filter((plan): plan is NonNullable<typeof plan> => Boolean(plan))
  const web = webs[0] ?? null
  const marketing = getCatalogPlan(marketingId)
  if (!web && !marketing) return null
  const quote = calculateQuote(state, ctx)
  const courtesyCatalog = pricingCourtesyCatalog(ctx)
  const courtesyAddons = resolveCourtesyAddonsForWebPlans(webIds, courtesyCatalog).map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
  }))
  const posts = state.customizeVolume && state.customPosts != null ? state.customPosts : marketing?.postsPerMonth ?? null
  const reels = state.customizeVolume && state.customReels != null ? state.customReels : marketing?.reelsPerMonth ?? null
  const campaigns =
    state.customizeVolume && state.customCampaigns != null ? state.customCampaigns : marketing?.campaignsIncluded ?? null
  const includes = [...webs.flatMap((plan) => [...plan.includes]), ...(marketing?.includes ?? [])]
  const excludes = [...webs.flatMap((plan) => [...plan.excludes]), ...(marketing?.excludes ?? [])]
  const storiesPerWeek = marketing
    ? Math.max(1, state.storiesPerWeek > 0 ? state.storiesPerWeek : marketing.storiesPerWeek ?? MARKETING_STORIES_PER_WEEK)
    : 0
  return {
    webPlanId: webId,
    marketingPlanId: marketingId,
    webPlans: webs.map((plan) => ({ id: plan.id, label: plan.label, basePrice: plan.basePrice })),
    webLabel: webs.map((plan) => plan.label).join(' + ') || null,
    marketingLabel: marketing?.label ?? null,
    channels: marketing ? state.channels : [],
    postsPerMonth: posts,
    reelsPerMonth: reels,
    campaigns,
    storiesIncluded: Boolean(marketing),
    storiesPerWeek: marketing ? storiesPerWeek : undefined,
    storiesPerMonth: marketing ? storiesPerWeek * 4 : 0,
    storiesUnitPrice: 0,
    pagesIncluded: web?.pagesIncluded ?? null,
    extraPages: state.extraPages,
    productsIncluded: state.productCount ?? web?.productsIncluded ?? null,
    servicesIncluded: state.serviceCount ?? web?.servicesIncluded ?? null,
    adminModulesNote: web?.hasAdmin
      ? 'El cliente administra solo los contenidos o módulos descritos en el alcance. No incluye un CMS completo ni roles avanzados.'
      : null,
    scopeNotes: state.scopeNotes.trim(),
    includes,
    excludes,
    webIncludes: webs.flatMap((plan) => [...plan.includes]),
    marketingIncludes: [...(marketing?.includes ?? [])],
    totals: {
      lines: quote.lines.map((line) => ({
        id: line.id,
        label: line.label,
        amount: line.amount,
        billing: line.billing ?? 'once',
      })),
      oneTime: quote.oneTime,
      monthly: quote.monthlyAmount,
      external: quote.external,
      initialFees: quote.initialTotal,
      nextMonthly: quote.nextMonthly,
      approvedAdBudget: quote.approvedAdBudget,
      pendingAdBudget: quote.pendingAdBudget,
      recommendedAdBudget: quote.recommendedAdBudget,
      projectedInitial: quote.projectedInitial,
      projectedMonthly: quote.projectedMonthly,
      taxRate: state.taxRate,
      taxAmount: 0,
      storiesPending: quote.storiesPending,
    },
    revisionRounds: state.revisionRounds,
    startDate: state.startDate,
    deliveryDate:
      state.deliveryDate.trim() ||
      (web && state.timeline
        ? `Preferencia en cotización: ${getTimelineLabel(state.timeline)}. Acordar plazo exacto antes del contrato definitivo.`
        : ''),
    paymentMethod: state.paymentMethod,
    advanceNote: state.advanceNote,
    balanceNote: state.balanceNote,
    adBudgetUsd: quote.approvedAdBudget,
    adBudgetAccepted: quote.approvedAdBudget > 0,
    adBudgetChoice: state.adBudgetChoice,
    recommendedAdBudgetUsd: quote.recommendedAdBudget,
    approvedAdBudgetUsd: quote.approvedAdBudget,
    marketingStartDate: state.marketingStartDate,
    marketingFirstPayment: state.marketingFirstPayment,
    paymentSchedule: state.paymentSchedule.trim(),
    termNote: state.termNote.trim(),
    renewalNote: state.renewalNote.trim(),
    terminationNote: state.terminationNote.trim(),
    courtesyAddons,
  }
}

export function splitFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return { nombre: '', apellido: '' }
  if (parts.length === 1) return { nombre: parts[0], apellido: '-' }
  return { nombre: parts[0], apellido: parts.slice(1).join(' ') }
}
