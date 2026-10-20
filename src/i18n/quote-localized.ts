import type { Messages } from '@/i18n/messages'
import { publicBillableFeatures } from '@/lib/courtesy-addons'
import { appendWebExternalInfraLines } from '@/lib/service-catalog'
import {
  FEATURES,
  PROJECT_TYPES,
  calculateQuote,
  type BusinessId,
  type ConfiguratorState,
  type EmailCount,
  type FeatureId,
  type ProjectTypeId,
  type QuoteLine,
  type QuotePricingContext,
  type TimelineId,
} from '@/lib/quote-configurator'

export type LocalizedProjectType = {
  id: ProjectTypeId
  label: string
  description: string
  basePrice: number
  fromPrice: boolean
  delivery: string
  includes: readonly string[]
}

export type LocalizedFeature = {
  id: FeatureId
  label: string
  description: string
  price: number
}

export type LocalizedQuoteCatalog = {
  quote: Messages['quote']
  projectTypes: LocalizedProjectType[]
  features: LocalizedFeature[]
  businessTypes: Array<{ id: BusinessId; label: string }>
  timelines: Array<{ id: TimelineId; label: string; description: string }>
  emailOptions: Array<{ value: EmailCount; label: string }>
}

const EMAIL_COUNTS: EmailCount[] = [0, 1, 2, 3, 4, 5, 6]

export function buildLocalizedQuoteCatalog(quote: Messages['quote']): LocalizedQuoteCatalog {
  const projectTypes = quote.projectTypes.flatMap((msg) => {
    const base = PROJECT_TYPES.find((p) => p.id === msg.id)
    if (!base || ('adminOnly' in base && base.adminOnly) || ('legacy' in base && base.legacy)) return []
    return [
      {
        id: msg.id,
        label: msg.label,
        description: msg.description,
        basePrice: base.basePrice,
        fromPrice: 'fromPrice' in base && Boolean(base.fromPrice),
        delivery: msg.delivery,
        includes: msg.includes,
      },
    ]
  })

  const billableIds = new Set(publicBillableFeatures().map((item) => item.id))
  const features = quote.features
    .filter((msg) => billableIds.has(msg.id))
    .map((msg) => {
      const base = FEATURES.find((f) => f.id === msg.id)!
      return {
        id: msg.id as FeatureId,
        label: msg.label,
        description: msg.description,
        price: base.price,
      }
    })

  const businessTypes = quote.businessTypes.map((msg) => ({
    id: msg.id as BusinessId,
    label: msg.label,
  }))

  const timelines = quote.timelines.map((msg) => ({
    id: msg.id as TimelineId,
    label: msg.label,
    description: msg.description,
  }))

  const emailOptions = EMAIL_COUNTS.map((value, index) => ({
    value,
    label: quote.emailOptions[index] ?? String(value),
  }))

  return {
    quote,
    projectTypes,
    features,
    businessTypes,
    timelines,
    emailOptions,
  }
}

export function getLocalizedProjectType(catalog: LocalizedQuoteCatalog, id: ProjectTypeId | null) {
  if (!id) return null
  return catalog.projectTypes.find((item) => item.id === id) ?? null
}

export function getLocalizedFeature(catalog: LocalizedQuoteCatalog, id: FeatureId) {
  return catalog.features.find((item) => item.id === id) ?? null
}

export function getLocalizedBusinessLabel(catalog: LocalizedQuoteCatalog, id: BusinessId | null) {
  if (!id) return null
  return catalog.businessTypes.find((item) => item.id === id)?.label ?? null
}

export function getLocalizedTimelineLabel(catalog: LocalizedQuoteCatalog, id: TimelineId | null) {
  if (!id) return null
  return catalog.timelines.find((item) => item.id === id)?.label ?? null
}

function emailLineLabel(catalog: LocalizedQuoteCatalog, count: number): string {
  const { lines } = catalog.quote
  if (count >= 6) return lines.emailsSixPlus
  if (count === 1) return lines.oneEmail
  return lines.manyEmails.replace('{count}', String(count))
}

export function buildLocalizedQuoteLines(
  state: ConfiguratorState,
  catalog: LocalizedQuoteCatalog,
): QuoteLine[] {
  const lines: QuoteLine[] = []
  const project = getLocalizedProjectType(catalog, state.projectType)
  if (project) {
    lines.push({
      id: `project-${project.id}`,
      label: project.label,
      amount: project.basePrice,
    })
  }

  for (const featureId of state.features) {
    const feature = getLocalizedFeature(catalog, featureId)
    if (!feature || feature.price <= 0) continue
    lines.push({
      id: `feature-${feature.id}`,
      label: feature.label,
      amount: feature.price,
    })
  }

  appendWebExternalInfraLines(lines, {
    hasDomain: state.hasDomain,
    hasHosting: state.hasHosting,
    emailCount: state.emailCount,
  })
  for (const line of lines) {
    if (line.id === 'domain') line.label = catalog.quote.lines.domain
    if (line.id === 'hosting') line.label = catalog.quote.lines.hosting
    if (line.id === 'emails') line.label = emailLineLabel(catalog, Math.min(state.emailCount, 6))
  }

  return lines
}

export function calculateLocalizedQuote(
  state: ConfiguratorState,
  catalog: LocalizedQuoteCatalog,
  ctx?: QuotePricingContext,
) {
  const priced = calculateQuote(state, ctx)
  const project = getLocalizedProjectType(catalog, state.projectType)
  return {
    ...priced,
    delivery: priced.delivery || project?.delivery || catalog.quote.deliveryFallback,
    projectLabel: priced.projectLabel || project?.label || catalog.quote.projectFallback,
  }
}
