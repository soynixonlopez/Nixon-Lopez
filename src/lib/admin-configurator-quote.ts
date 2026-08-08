/** Puente admin ↔ configurador público de cotización. */

import {
  BUSINESS_TYPES,
  FEATURES,
  INITIAL_CONFIGURATOR_STATE,
  PROJECT_TYPES,
  TIMELINES,
  calculateQuote,
  type BusinessId,
  type ConfiguratorState,
  type EmailCount,
  type FeatureId,
  type ProjectTypeId,
  type TimelineId,
  type YesNo,
} from '@/lib/quote-configurator'
import { extractQuoteServiceSnapshots } from '@/lib/quote-pricing'

export {
  PROJECT_TYPES,
  FEATURES,
  BUSINESS_TYPES,
  TIMELINES,
  calculateQuote,
  type ConfiguratorState,
  type FeatureId,
  type ProjectTypeId,
  type EmailCount,
}

export function emptyConfiguratorState(): ConfiguratorState {
  return { ...INITIAL_CONFIGURATOR_STATE, features: ['whatsapp'] }
}

export function parsePriceOverride(raw: unknown): number | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const value = (raw as Record<string, unknown>).price_override
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number.parseFloat(value)
    if (Number.isFinite(n) && n >= 0) return n
  }
  return null
}

export function parseConfiguratorFromPayload(raw: unknown): ConfiguratorState | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const payload = raw as Record<string, unknown>
  const cfg = payload.configurator
  if (cfg && typeof cfg === 'object' && !Array.isArray(cfg)) {
    return normalizeConfiguratorState(cfg as Record<string, unknown>)
  }

  const snapshots = extractQuoteServiceSnapshots(payload)
  const first = snapshots[0]
  if (!first) return null

  const projectType = mapServiceIdToProjectType(first.serviceId)
  if (!projectType) return null

  const featureIds = FEATURES.map((f) => f.id).filter((id) =>
    first.lines.some((line) => line.label.toLowerCase().includes(FEATURES.find((f) => f.id === id)!.label.toLowerCase()))
  ) as FeatureId[]

  const hasDomain: YesNo = first.hasDomain === 'si' || first.hasDomain === 'no' ? first.hasDomain : ''
  const hasHosting: YesNo = first.hasHosting === 'si' || first.hasHosting === 'no' ? first.hasHosting : ''

  return {
    ...emptyConfiguratorState(),
    projectType,
    features: featureIds.length > 0 ? featureIds : (['whatsapp'] as FeatureId[]),
    hasDomain,
    hasHosting,
    emailCount: 0,
  }
}

function mapServiceIdToProjectType(serviceId: string): ProjectTypeId | null {
  if (serviceId === 'landing' || serviceId === 'profesional' || serviceId === 'tienda' || serviceId === 'sistema') {
    return serviceId
  }
  if (serviceId.includes('landing')) return 'landing'
  if (serviceId.includes('tienda') || serviceId.includes('ecommerce')) return 'tienda'
  if (serviceId.includes('sistema') || serviceId.includes('software')) return 'sistema'
  if (serviceId.includes('web') || serviceId.includes('wordpress')) return 'profesional'
  return null
}

function normalizeConfiguratorState(value: Record<string, unknown>): ConfiguratorState {
  const projectType =
    value.projectType === 'landing' ||
    value.projectType === 'profesional' ||
    value.projectType === 'tienda' ||
    value.projectType === 'sistema'
      ? value.projectType
      : null

  const business = BUSINESS_TYPES.some((b) => b.id === value.business)
    ? (value.business as BusinessId)
    : null

  const featureIds: FeatureId[] = Array.isArray(value.features)
    ? value.features.filter((id): id is FeatureId =>
        typeof id === 'string' && FEATURES.some((f) => f.id === id)
      )
    : []

  const hasDomain: YesNo = value.hasDomain === 'si' || value.hasDomain === 'no' ? value.hasDomain : ''
  const hasHosting: YesNo = value.hasHosting === 'si' || value.hasHosting === 'no' ? value.hasHosting : ''
  const emailRaw = Number(value.emailCount)
  const emailCount = ([0, 1, 2, 3, 4, 5, 6] as const).includes(emailRaw as EmailCount)
    ? (emailRaw as EmailCount)
    : 0
  const timeline = TIMELINES.some((t) => t.id === value.timeline) ? (value.timeline as TimelineId) : null

  return {
    projectType,
    business,
    features: featureIds.length > 0 ? featureIds : (['whatsapp'] as FeatureId[]),
    hasDomain,
    hasHosting,
    emailCount,
    timeline,
    nombre: typeof value.nombre === 'string' ? value.nombre : '',
    empresa: typeof value.empresa === 'string' ? value.empresa : '',
    correo: typeof value.correo === 'string' ? value.correo : '',
    whatsapp: typeof value.whatsapp === 'string' ? value.whatsapp : '',
  }
}

export function buildConfiguratorPayload(
  state: ConfiguratorState,
  options?: { priceOverride?: number | null; customDecision?: string | null }
) {
  const quote = calculateQuote(state)
  const project = PROJECT_TYPES.find((p) => p.id === state.projectType)
  const override =
    typeof options?.priceOverride === 'number' && Number.isFinite(options.priceOverride)
      ? options.priceOverride
      : null
  const total = override ?? quote.total
  const lines =
    override != null && override !== quote.total
      ? [
          ...quote.lines.map((line) => ({ label: line.label, amount: line.amount })),
          { label: 'Ajuste personalizado', amount: Number((override - quote.total).toFixed(2)) },
        ]
      : quote.lines.map((line) => ({ label: line.label, amount: line.amount }))

  return {
    configurator: state,
    price_override: override,
    custom_decision: options?.customDecision?.trim() || null,
    tipoServicio: state.projectType,
    servicio: quote.projectLabel,
    total: `$${total} USD`,
    totalNumeric: total,
    monthly: false,
    catalog: true,
    manual: true,
    pasarelaPagos: state.features.includes('pasarela')
      ? 'Sí — Integración pasarela de pagos (+$100)'
      : 'No',
    incluyeDominioHostingCorreo:
      state.hasDomain === 'no' || state.hasHosting === 'no' || state.emailCount > 0
        ? 'Incluye ítems en presupuesto (dominio/hosting/correos según selección)'
        : 'Cliente ya cuenta con dominio/hosting',
    breakdown: { lines },
    selected_services: [
      {
        serviceId: state.projectType ?? 'profesional',
        kind: 'manual',
        label: quote.projectLabel,
        baseAmount: project?.basePrice ?? quote.total,
        total,
        monthly: false,
        quantityPages: null,
        offerPoints: quote.lines
          .filter((line) => !line.id.startsWith('project-'))
          .map((line) => line.label)
          .slice(0, 8),
        lines,
        hasDomain: state.hasDomain,
        hasProfessionalEmail: state.emailCount > 0 ? 'no' : 'si',
        hasHosting: state.hasHosting,
      },
    ],
  }
}

export function configuratorTotals(
  state: ConfiguratorState,
  priceOverride?: number | null
) {
  const quote = calculateQuote(state)
  const override =
    typeof priceOverride === 'number' && Number.isFinite(priceOverride) ? priceOverride : null
  const total = override ?? quote.total
  const extras = quote.lines
    .filter((line) => !line.id.startsWith('project-'))
    .reduce((sum, line) => sum + line.amount, 0)
  const base = quote.lines.find((line) => line.id.startsWith('project-'))?.amount ?? 0
  return { quote, total, base, extras, override }
}

export function toggleFeature(features: FeatureId[], id: FeatureId): FeatureId[] {
  return features.includes(id) ? features.filter((item) => item !== id) : [...features, id]
}
