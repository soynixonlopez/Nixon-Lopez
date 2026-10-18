import type { WebPlanId } from '@/lib/service-catalog'
import { WEB_PLANS } from '@/lib/service-catalog'

export type CourtesyAddonCategory = 'contacto' | 'navegacion' | 'contenido' | 'otro'

export type CourtesyAddonDefinition = {
  id: string
  name: string
  description: string
  category: CourtesyAddonCategory
  enabled: boolean
  webPlanIds: WebPlanId[]
}

export const ALL_WEB_PLAN_IDS = WEB_PLANS.map((plan) => plan.id) as WebPlanId[]

export const DEFAULT_COURTESY_CATALOG: CourtesyAddonDefinition[] = [
  {
    id: 'whatsapp',
    name: 'Botón de WhatsApp',
    description: 'Enlace o botón de contacto directo por WhatsApp.',
    category: 'contacto',
    enabled: true,
    webPlanIds: [...ALL_WEB_PLAN_IDS],
  },
  {
    id: 'formulario',
    name: 'Formulario de contacto',
    description: 'Formulario para consultas y captación de leads básica.',
    category: 'contacto',
    enabled: true,
    webPlanIds: [...ALL_WEB_PLAN_IDS],
  },
  {
    id: 'cta',
    name: 'Botones de llamada a la acción',
    description: 'Botones destacados hacia acciones comerciales acordadas.',
    category: 'navegacion',
    enabled: true,
    webPlanIds: [...ALL_WEB_PLAN_IDS],
  },
  {
    id: 'social-links',
    name: 'Enlaces a redes sociales',
    description: 'Enlaces a perfiles comerciales en redes sociales.',
    category: 'navegacion',
    enabled: true,
    webPlanIds: [...ALL_WEB_PLAN_IDS],
  },
  {
    id: 'email-link',
    name: 'Enlaces de correo electrónico',
    description: 'Enlaces mailto o contacto por correo visible en el sitio.',
    category: 'contacto',
    enabled: true,
    webPlanIds: [...ALL_WEB_PLAN_IDS],
  },
  {
    id: 'mapa',
    name: 'Mapa / ubicación básica',
    description: 'Integración básica de mapa cuando corresponda al diseño.',
    category: 'contenido',
    enabled: true,
    webPlanIds: ['profesional', 'web-panel', 'corporativo', 'tienda', 'reservas'],
  },
]

const COURTESY_IDS = new Set(DEFAULT_COURTESY_CATALOG.map((item) => item.id))

export function isCourtesyAddonId(id: string) {
  return COURTESY_IDS.has(id)
}

export function mergeCourtesyCatalog(overrides: unknown): CourtesyAddonDefinition[] {
  if (!Array.isArray(overrides) || overrides.length === 0) {
    return DEFAULT_COURTESY_CATALOG.map((item) => ({ ...item, webPlanIds: [...item.webPlanIds] }))
  }
  const byId = new Map(DEFAULT_COURTESY_CATALOG.map((item) => [item.id, { ...item, webPlanIds: [...item.webPlanIds] }]))
  for (const row of overrides) {
    if (!row || typeof row !== 'object') continue
    const value = row as Partial<CourtesyAddonDefinition>
    if (typeof value.id !== 'string' || !value.id.trim()) continue
    const base = byId.get(value.id) ?? {
      id: value.id,
      name: value.name?.trim() || value.id,
      description: value.description?.trim() || '',
      category: (value.category as CourtesyAddonCategory) || 'otro',
      enabled: true,
      webPlanIds: [...ALL_WEB_PLAN_IDS],
    }
    byId.set(value.id, {
      ...base,
      name: typeof value.name === 'string' && value.name.trim() ? value.name.trim() : base.name,
      description:
        typeof value.description === 'string' && value.description.trim()
          ? value.description.trim()
          : base.description,
      category:
        value.category === 'contacto' ||
        value.category === 'navegacion' ||
        value.category === 'contenido' ||
        value.category === 'otro'
          ? value.category
          : base.category,
      enabled: value.enabled !== false,
      webPlanIds: Array.isArray(value.webPlanIds)
        ? value.webPlanIds.filter((id): id is WebPlanId => typeof id === 'string' && ALL_WEB_PLAN_IDS.includes(id as WebPlanId))
        : base.webPlanIds,
    })
  }
  return Array.from(byId.values())
}

export function resolveCourtesyAddonsForWebPlans(
  webPlanIds: WebPlanId[],
  catalog: CourtesyAddonDefinition[],
) {
  if (webPlanIds.length === 0) return []
  return catalog.filter(
    (item) => item.enabled && item.webPlanIds.some((planId) => webPlanIds.includes(planId)),
  )
}

export type BillableFeatureDefinition = {
  id: string
  label: string
  description: string
  /** Precio público en cotizador. Null = solo cotización personalizada (admin). */
  publicPrice: number | null
  kind: 'billable' | 'module'
}

/** Extras con tarifa pública configurada. Los módulos complejos no tienen precio público. */
export const BILLABLE_FEATURE_CATALOG: readonly BillableFeatureDefinition[] = [
  { id: 'galeria', label: 'Galería', description: 'Fotos o portafolio', publicPrice: 20, kind: 'billable' },
  { id: 'animaciones', label: 'Animaciones Premium', description: 'Movimiento elegante', publicPrice: 30, kind: 'billable' },
  { id: 'blog', label: 'Blog', description: 'Contenido para SEO', publicPrice: 40, kind: 'billable' },
  { id: 'seo', label: 'SEO Avanzado', description: 'Optimización avanzada', publicPrice: 50, kind: 'billable' },
  { id: 'multiidioma', label: 'Multi idioma', description: 'Español + otro idioma', publicPrice: 60, kind: 'billable' },
  { id: 'chat-ia', label: 'Chat IA', description: 'Asistente automático', publicPrice: 150, kind: 'billable' },
  { id: 'catalogo', label: 'Catálogo de productos', description: 'Sin carrito (requiere paquete adecuado)', publicPrice: null, kind: 'module' },
  { id: 'reservas', label: 'Reservas / citas', description: 'Sistema de reservas', publicPrice: null, kind: 'module' },
  { id: 'pasarela', label: 'Pasarela de pago', description: 'Cobros online', publicPrice: null, kind: 'module' },
  { id: 'panel', label: 'Panel administrativo', description: 'Gestión de contenidos', publicPrice: null, kind: 'module' },
] as const

export type BillableFeatureId = (typeof BILLABLE_FEATURE_CATALOG)[number]['id']

export function getBillableFeatureDef(id: string) {
  return BILLABLE_FEATURE_CATALOG.find((item) => item.id === id) ?? null
}

export function isBillableFeatureId(id: string): id is BillableFeatureId {
  return BILLABLE_FEATURE_CATALOG.some((item) => item.id === id)
}

export function publicBillableFeatures() {
  return BILLABLE_FEATURE_CATALOG.filter((item) => item.publicPrice != null && item.publicPrice > 0)
}
