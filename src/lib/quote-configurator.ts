/** Configurador de cotización — precios y reglas del wizard premium. */

export type WebProjectTypeId = 'landing' | 'profesional' | 'tienda' | 'sistema'
export type SocialMediaPlanId =
  | 'redes-emprendedor'
  | 'redes-profesional'
  | 'redes-corporativo'
  | 'redes-premium'
export type ProjectTypeId = WebProjectTypeId | SocialMediaPlanId
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
  | 'galeria'
  | 'blog'
  | 'seo'
  | 'reservas'
  | 'animaciones'
  | 'multiidioma'
  | 'pasarela'
  | 'catalogo'
  | 'mapa'
  | 'chat-ia'
  | 'panel'
export type TimelineId = 'urgente' | 'este-mes' | 'sin-prisa'
export type YesNo = 'si' | 'no' | ''
export type EmailCount = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type QuoteLine = {
  id: string
  label: string
  amount: number
}

export type ConfiguratorState = {
  projectType: ProjectTypeId | null
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
}

export const INITIAL_CONFIGURATOR_STATE: ConfiguratorState = {
  projectType: null,
  business: null,
  features: ['whatsapp'],
  hasDomain: '',
  hasHosting: '',
  emailCount: 0,
  timeline: null,
  nombre: '',
  empresa: '',
  correo: '',
  whatsapp: '',
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

/** Servicios adicionales (no incluidos en los planes de redes). */
export const SOCIAL_MEDIA_ADDITIONAL_SERVICES = [
  'Gestión de anuncios (Meta Ads): desde $150 USD / mes + inversión publicitaria',
  'Sesión de fotos / video: cotización aparte',
  'Grabación de reels: cotización aparte',
  'Community management intensivo 24/7: costo adicional según volumen',
] as const

const WEB_PROJECT_TYPES = [
  {
    id: 'landing' as const,
    label: 'Landing Page',
    description: 'Una página para convertir visitas en contactos o ventas.',
    basePrice: 90,
    priceLabel: 'Precio base',
    delivery: '3 a 5 días hábiles',
    category: 'web' as const,
    adminOnly: false as const,
    monthly: false as const,
    includes: [
      'Una sola página enfocada en conversión',
      'Mensaje comercial claro (beneficios + llamada a la acción)',
      'Diseño responsive (móvil, tablet y escritorio)',
      'Botón de WhatsApp o contacto visible',
      'Estructura lista para campañas o promociones',
    ],
  },
  {
    id: 'profesional' as const,
    label: 'Web Profesional',
    description: 'Sitio completo para presentar tu negocio y captar clientes.',
    basePrice: 150,
    priceLabel: 'Precio base',
    delivery: '5 a 7 días hábiles',
    category: 'web' as const,
    adminOnly: false as const,
    monthly: false as const,
    includes: [
      'Varias secciones (inicio, servicios, nosotros, contacto)',
      'Diseño profesional adaptable a todos los dispositivos',
      'Formulario o contacto por WhatsApp',
      'Navegación clara y llamada a la acción',
      'Base lista para publicar y crecer tu presencia online',
    ],
  },
  {
    id: 'tienda' as const,
    label: 'Tienda Online',
    description: 'Catálogo, carrito y checkout para vender en línea.',
    basePrice: 300,
    priceLabel: 'Precio base',
    delivery: '10 a 14 días hábiles',
    category: 'web' as const,
    adminOnly: false as const,
    monthly: false as const,
    includes: [
      'Catálogo de productos con fichas',
      'Carrito de compras y flujo de checkout',
      'Diseño responsive orientado a ventas',
      'Estructura para gestionar productos',
      'Base lista para integrar pagos (según extras elegidos)',
    ],
  },
  {
    id: 'sistema' as const,
    label: 'Sistema a medida',
    description: 'Software o plataforma según tus procesos internos.',
    basePrice: 500,
    priceLabel: 'Desde',
    delivery: '15 a 30 días hábiles',
    fromPrice: true as const,
    category: 'web' as const,
    adminOnly: false as const,
    monthly: false as const,
    includes: [
      'Análisis de procesos y alcance funcional',
      'Desarrollo a medida según tus flujos',
      'Accesos y roles según necesidad',
      'Interfaz adaptada a tu operación',
      'Entrega por fases con pruebas y ajustes',
    ],
  },
] as const

/** Planes de manejo de redes — solo admin / clientes seleccionados. */
const SOCIAL_MEDIA_PLANS = [
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

export const PROJECT_TYPES = [...WEB_PROJECT_TYPES, ...SOCIAL_MEDIA_PLANS] as const

/** Tipos visibles en cotizador público (sin planes de redes). */
export const PUBLIC_PROJECT_TYPES = WEB_PROJECT_TYPES

/** Tipos disponibles en admin (web + redes). */
export const ADMIN_PROJECT_TYPES = PROJECT_TYPES

export function isSocialMediaProjectType(
  id: ProjectTypeId | string | null | undefined
): id is SocialMediaPlanId {
  return typeof id === 'string' && id.startsWith('redes-')
}

export function isWebProjectType(id: ProjectTypeId | string | null | undefined): id is WebProjectTypeId {
  return id === 'landing' || id === 'profesional' || id === 'tienda' || id === 'sistema'
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

export const FEATURES = [
  { id: 'whatsapp' as const, label: 'WhatsApp', price: 0, description: 'Botón de contacto directo' },
  { id: 'formulario' as const, label: 'Formulario avanzado', price: 20, description: 'Captura leads con validación' },
  { id: 'galeria' as const, label: 'Galería', price: 20, description: 'Fotos o portafolio' },
  { id: 'mapa' as const, label: 'Mapa / ubicación', price: 25, description: 'Google Maps en tu web' },
  { id: 'animaciones' as const, label: 'Animaciones Premium', price: 30, description: 'Movimiento elegante' },
  { id: 'blog' as const, label: 'Blog', price: 40, description: 'Contenido para SEO' },
  { id: 'catalogo' as const, label: 'Catálogo de productos', price: 40, description: 'Sin carrito de compra' },
  { id: 'seo' as const, label: 'SEO Avanzado', price: 50, description: 'Mejor presencia en Google' },
  { id: 'multiidioma' as const, label: 'Multi idioma', price: 60, description: 'Español + otro idioma' },
  { id: 'reservas' as const, label: 'Reservas / citas', price: 80, description: 'Agenda online' },
  { id: 'pasarela' as const, label: 'Pasarela de pago', price: 100, description: 'Cobros online (Yappy, tarjeta…)' },
  { id: 'panel' as const, label: 'Panel administrativo', price: 100, description: 'Gestiona contenido tú mismo' },
  { id: 'chat-ia' as const, label: 'Chat IA', price: 150, description: 'Asistente automático' },
] as const

export const TIMELINES = [
  { id: 'urgente' as const, label: 'Lo antes posible', description: 'Prioridad alta' },
  { id: 'este-mes' as const, label: 'Este mes', description: 'Dentro del mes' },
  { id: 'sin-prisa' as const, label: 'Sin prisa', description: 'Flexible' },
] as const

export const PRICE_DOMAIN_USD = 20
export const PRICE_HOSTING_USD = 60
export const PRICE_EMAIL_USD = 15
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

export function buildQuoteLines(state: ConfiguratorState): QuoteLine[] {
  const lines: QuoteLine[] = []
  const project = getProjectType(state.projectType)
  if (project) {
    lines.push({
      id: `project-${project.id}`,
      label: project.monthly ? `${project.label} (mensual)` : project.label,
      amount: project.basePrice,
    })
  }

  // Planes de redes: precio fijo mensual, sin extras de web
  if (isSocialMediaProjectType(state.projectType)) {
    return lines
  }

  for (const featureId of state.features) {
    const feature = getFeature(featureId)
    if (!feature || feature.price <= 0) continue
    lines.push({
      id: `feature-${feature.id}`,
      label: feature.label,
      amount: feature.price,
    })
  }

  if (state.hasDomain === 'no') {
    lines.push({ id: 'domain', label: 'Dominio', amount: PRICE_DOMAIN_USD })
  }
  if (state.hasHosting === 'no') {
    lines.push({ id: 'hosting', label: 'Hosting Premium', amount: PRICE_HOSTING_USD })
  }
  if (state.emailCount > 0) {
    const count = Math.min(state.emailCount, 6)
    const label =
      count >= 6 ? 'Correos (6+)' : count === 1 ? '1 Correo' : `${count} Correos`
    lines.push({
      id: 'emails',
      label,
      amount: count * PRICE_EMAIL_USD,
    })
  }

  return lines
}

export function calculateQuote(state: ConfiguratorState) {
  const lines = buildQuoteLines(state)
  const total = lines.reduce((sum, line) => sum + line.amount, 0)
  const project = getProjectType(state.projectType)
  const isMonthly = Boolean(project && 'monthly' in project && project.monthly)
  return {
    lines,
    total,
    delivery: project?.delivery ?? 'Por definir',
    projectLabel: project?.label ?? 'Tu proyecto',
    monthly: isMonthly,
    includedZeroPriceFeatures: isSocialMediaProjectType(state.projectType)
      ? []
      : state.features
          .map((id) => getFeature(id))
          .filter((item): item is NonNullable<typeof item> => Boolean(item))
          .filter((item) => item.price === 0)
          .map((item) => item.label),
  }
}

export function mapLegacyServiceToProject(serviceId: string | null): ProjectTypeId | null {
  if (!serviceId) return null
  const id = serviceId.toLowerCase()
  if (isSocialMediaProjectType(id)) return id
  if (id === 'landing') return 'landing'
  if (id.includes('tienda') || id.includes('productos') || id.includes('ecommerce') || id === 'tienda') {
    return 'tienda'
  }
  if (
    id.includes('sistema') ||
    id.includes('software') ||
    id === 'custom' ||
    id === 'reservas'
  ) {
    return 'sistema'
  }
  if (id.includes('web') || id.includes('wordpress') || id.includes('rediseno') || id === 'profesional') {
    return 'profesional'
  }
  if (id === 'pasarela' || id.includes('pasarela')) return 'tienda'
  return 'profesional'
}

/** Extras sugeridos al llegar desde el home con ?service= */
export function mapLegacyServiceToFeatures(serviceId: string | null): FeatureId[] {
  const base: FeatureId[] = ['whatsapp']
  if (!serviceId) return base
  const id = serviceId.toLowerCase()
  if (id === 'pasarela' || id.includes('pasarela')) {
    if (!base.includes('pasarela')) base.push('pasarela')
  }
  if (id === 'reservas' || id.includes('reserva')) {
    if (!base.includes('reservas')) base.push('reservas')
  }
  if (id.includes('seo')) {
    if (!base.includes('seo')) base.push('seo')
  }
  return base
}

export function splitFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return { nombre: '', apellido: '' }
  if (parts.length === 1) return { nombre: parts[0], apellido: '-' }
  return { nombre: parts[0], apellido: parts.slice(1).join(' ') }
}
