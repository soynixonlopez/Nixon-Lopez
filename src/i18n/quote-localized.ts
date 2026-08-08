import type { Messages } from '@/i18n/messages'
import {
  FEATURES,
  PRICE_DOMAIN_USD,
  PRICE_EMAIL_USD,
  PRICE_HOSTING_USD,
  PROJECT_TYPES,
  type BusinessId,
  type ConfiguratorState,
  type EmailCount,
  type FeatureId,
  type ProjectTypeId,
  type QuoteLine,
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
  const projectTypes = quote.projectTypes.map((msg) => {
    const base = PROJECT_TYPES.find((p) => p.id === msg.id)!
    return {
      id: msg.id,
      label: msg.label,
      description: msg.description,
      basePrice: base.basePrice,
      fromPrice: 'fromPrice' in base && Boolean(base.fromPrice),
      delivery: msg.delivery,
      includes: msg.includes,
    }
  })

  const features = quote.features.map((msg) => {
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

  if (state.hasDomain === 'no') {
    lines.push({ id: 'domain', label: catalog.quote.lines.domain, amount: PRICE_DOMAIN_USD })
  }
  if (state.hasHosting === 'no') {
    lines.push({ id: 'hosting', label: catalog.quote.lines.hosting, amount: PRICE_HOSTING_USD })
  }
  if (state.emailCount > 0) {
    const count = Math.min(state.emailCount, 6)
    lines.push({
      id: 'emails',
      label: emailLineLabel(catalog, count),
      amount: count * PRICE_EMAIL_USD,
    })
  }

  return lines
}

export function calculateLocalizedQuote(state: ConfiguratorState, catalog: LocalizedQuoteCatalog) {
  const lines = buildLocalizedQuoteLines(state, catalog)
  const total = lines.reduce((sum, line) => sum + line.amount, 0)
  const project = getLocalizedProjectType(catalog, state.projectType)
  return {
    lines,
    total,
    delivery: project?.delivery ?? catalog.quote.deliveryFallback,
    projectLabel: project?.label ?? catalog.quote.projectFallback,
    includedZeroPriceFeatures: state.features
      .map((id) => getLocalizedFeature(catalog, id))
      .filter((item): item is LocalizedFeature => Boolean(item))
      .filter((item) => item.price === 0)
      .map((item) => item.label),
  }
}
