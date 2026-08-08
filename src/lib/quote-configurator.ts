/** Configurador de cotización — precios y reglas del wizard premium. */

export type ProjectTypeId = 'landing' | 'profesional' | 'tienda' | 'sistema'
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

export const PROJECT_TYPES = [
  {
    id: 'landing' as const,
    label: 'Landing Page',
    description: 'Una página para convertir visitas.',
    basePrice: 90,
    priceLabel: 'Precio base',
    delivery: '3 a 5 días hábiles',
  },
  {
    id: 'profesional' as const,
    label: 'Web Profesional',
    description: 'Sitio completo para tu negocio.',
    basePrice: 150,
    priceLabel: 'Precio base',
    delivery: '5 a 7 días hábiles',
  },
  {
    id: 'tienda' as const,
    label: 'Tienda Online',
    description: 'Catálogo, carrito y checkout.',
    basePrice: 300,
    priceLabel: 'Precio base',
    delivery: '10 a 14 días hábiles',
  },
  {
    id: 'sistema' as const,
    label: 'Sistema a medida',
    description: 'Software según tus procesos.',
    basePrice: 500,
    priceLabel: 'Desde',
    delivery: '15 a 30 días hábiles',
    fromPrice: true,
  },
] as const

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
      label: project.label,
      amount: project.basePrice,
    })
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
  return {
    lines,
    total,
    delivery: project?.delivery ?? 'Por definir',
    projectLabel: project?.label ?? 'Tu proyecto',
    includedZeroPriceFeatures: state.features
      .map((id) => getFeature(id))
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .filter((item) => item.price === 0)
      .map((item) => item.label),
  }
}

export function mapLegacyServiceToProject(serviceId: string | null): ProjectTypeId | null {
  if (!serviceId) return null
  const id = serviceId.toLowerCase()
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
