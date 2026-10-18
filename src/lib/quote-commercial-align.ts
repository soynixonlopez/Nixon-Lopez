import { parseConfiguratorFromPayload } from '@/lib/admin-configurator-quote'
import {
  mapLegacyServiceToMarketing,
  mapLegacyServiceToProject,
} from '@/lib/quote-configurator'
import { extractQuoteServiceSnapshots } from '@/lib/quote-pricing'
import type { BillingKind, CommercialSnapshot, CommercialTotals, MarketingPlanId, WebPlanId } from '@/lib/service-catalog'
import {
  getCatalogPlan,
  isMarketingPlanId,
  isWebPlanId,
  priceCommercial,
} from '@/lib/service-catalog'
import type { QuoteContractMeta } from '@/lib/contract-terms-from-quote'

function sumBilling(lines: CommercialTotals['lines'], billing: BillingKind) {
  return lines.filter((line) => line.billing === billing).reduce((sum, line) => sum + line.amount, 0)
}

function breakdownLinesFromRaw(raw: unknown): CommercialTotals['lines'] | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const payload = raw as Record<string, unknown>
  const breakdown = payload.breakdown
  if (!breakdown || typeof breakdown !== 'object' || Array.isArray(breakdown)) return null
  const rows = (breakdown as { lines?: unknown }).lines
  if (!Array.isArray(rows) || rows.length === 0) return null

  const services = extractQuoteServiceSnapshots(raw)
  const lines: CommercialTotals['lines'] = []
  for (const row of rows) {
    if (!row || typeof row !== 'object' || Array.isArray(row)) continue
    const label = typeof (row as { label?: unknown }).label === 'string' ? (row as { label: string }).label : ''
    const amount = Number((row as { amount?: unknown }).amount)
    if (!label || !Number.isFinite(amount)) continue
    const monthlyHint =
      services.some((service) => service.monthly && service.lines.some((line) => line.label === label)) ||
      /mensual|\/?mes/i.test(label)
    const externalHint = /dominio|hosting|correo|meta|pauta|pasarela|tercero|externo/i.test(label)
    const billing: BillingKind = monthlyHint ? 'monthly' : externalHint ? 'external' : 'once'
    lines.push({ id: `line-${lines.length}`, label, amount, billing })
  }
  return lines.length ? lines : null
}

function commercialLinesFromSnapshot(snapshot: CommercialSnapshot): CommercialTotals['lines'] {
  return snapshot.totals.lines?.length ? [...snapshot.totals.lines] : []
}

function resolveWebPlanId(raw: unknown, snapshot: CommercialSnapshot, meta?: QuoteContractMeta): WebPlanId | null {
  const cfg = parseConfiguratorFromPayload(raw)
  const fromCfgList = cfg?.webPlanIds?.find((id) => isWebPlanId(id))
  if (fromCfgList) return fromCfgList
  if (cfg?.projectType && isWebPlanId(cfg.projectType)) return cfg.projectType
  if (snapshot.webPlanId && isWebPlanId(snapshot.webPlanId)) return snapshot.webPlanId
  const fromWebPlans = snapshot.webPlans?.[0]?.id
  if (fromWebPlans && isWebPlanId(fromWebPlans)) return fromWebPlans
  const serviceId = meta?.serviceId ?? ''
  if (isWebPlanId(serviceId)) return serviceId
  const mapped = mapLegacyServiceToProject(serviceId)
  if (mapped && isWebPlanId(mapped)) return mapped
  if (serviceId.includes('panel')) return 'web-panel'
  return null
}

function resolveMarketingPlanId(raw: unknown, snapshot: CommercialSnapshot, meta?: QuoteContractMeta): MarketingPlanId | null {
  const cfg = parseConfiguratorFromPayload(raw)
  if (cfg?.marketingPlan && isMarketingPlanId(cfg.marketingPlan)) return cfg.marketingPlan
  if (cfg?.projectType && isMarketingPlanId(cfg.projectType)) return cfg.projectType
  if (snapshot.marketingPlanId && isMarketingPlanId(snapshot.marketingPlanId)) return snapshot.marketingPlanId
  const serviceId = meta?.serviceId ?? ''
  if (isMarketingPlanId(serviceId)) return serviceId
  const mapped = mapLegacyServiceToMarketing(serviceId)
  return mapped
}

function normalizeLineIds(lines: CommercialTotals['lines'], webId: WebPlanId | null, mktId: MarketingPlanId | null) {
  return lines.map((line, index) => {
    if (line.id.startsWith('project-') || line.id.startsWith('line-')) return line
    if (webId && line.billing === 'once' && index === 0) {
      return { ...line, id: `project-${webId}` }
    }
    if (mktId && line.billing === 'monthly' && !lines.some((l) => l.id === `project-${mktId}`)) {
      return { ...line, id: `project-${mktId}` }
    }
    return { ...line, id: line.id || `line-${index}` }
  })
}

function webLineAmount(lines: CommercialTotals['lines'], webId: WebPlanId | null) {
  if (!webId) return 0
  const byId = lines.find((line) => line.id === `project-${webId}` && line.billing === 'once')
  if (byId) return byId.amount
  const onceLines = lines.filter((line) => line.billing === 'once' && !line.id.startsWith('feature-'))
  if (onceLines.length === 1) return onceLines[0].amount
  return onceLines.reduce((sum, line) => sum + line.amount, 0)
}

/** Ajusta el snapshot comercial para que coincida con la cotización aceptada (breakdown / líneas guardadas). */
export function alignCommercialSnapshotToQuote(
  snapshot: CommercialSnapshot,
  raw: unknown,
  meta?: QuoteContractMeta,
): CommercialSnapshot {
  const webPlanId = resolveWebPlanId(raw, snapshot, meta)
  const marketingPlanId = resolveMarketingPlanId(raw, snapshot, meta)
  const breakdown = breakdownLinesFromRaw(raw)
  const storedLines = commercialLinesFromSnapshot(snapshot)
  let lines = breakdown?.length ? breakdown : storedLines

  const hasWeb = Boolean(webPlanId)
  const hasMarketing = Boolean(marketingPlanId)

  if (lines.length === 0 && meta?.totalAmount != null && meta.totalAmount > 0) {
    if (hasWeb && !hasMarketing) {
      lines = [
        {
          id: webPlanId ? `project-${webPlanId}` : 'project-web',
          label: meta.serviceLabel?.trim() || getCatalogPlan(webPlanId)?.label || 'Desarrollo web',
          amount: meta.totalAmount,
          billing: 'once',
        },
      ]
    } else if (hasMarketing && !hasWeb) {
      lines = [
        {
          id: marketingPlanId ? `project-${marketingPlanId}` : 'project-mkt',
          label: meta.serviceLabel?.trim() || getCatalogPlan(marketingPlanId)?.label || 'Marketing digital',
          amount: meta.totalAmount,
          billing: 'monthly',
        },
      ]
    }
  }

  lines = normalizeLineIds(lines, webPlanId, marketingPlanId)

  let oneTime = sumBilling(lines, 'once')
  let monthly = sumBilling(lines, 'monthly')
  let external = sumBilling(lines, 'external')

  const webOnceFromLines = hasWeb ? webLineAmount(lines, webPlanId) : 0
  if (hasWeb && webOnceFromLines > 0) {
    oneTime = webOnceFromLines + lines.filter((l) => l.billing === 'once' && l.id.startsWith('feature-')).reduce((s, l) => s + l.amount, 0)
    oneTime += lines.filter((l) => l.billing === 'once' && l.id === 'extra-pages').reduce((s, l) => s + l.amount, 0)
    oneTime += lines.filter((l) => l.billing === 'once' && l.id === 'ads-setup').reduce((s, l) => s + l.amount, 0)
  }

  if (hasMarketing && monthly === 0) {
    const mktLine = lines.find((line) => line.id === `project-${marketingPlanId}` && line.billing === 'monthly')
    if (mktLine) monthly = mktLine.amount
  }

  const catalogWeb = webPlanId ? getCatalogPlan(webPlanId) : null
  const catalogMkt = marketingPlanId ? getCatalogPlan(marketingPlanId) : null

  if (hasWeb && hasMarketing && meta?.totalAmount != null && meta.totalAmount > 0) {
    if (Math.abs(meta.totalAmount - monthly) < 0.01 && oneTime > 0) {
      // total_amount refleja solo el mensual; no tocar oneTime
    } else if (Math.abs(meta.totalAmount - oneTime) < 0.01 && monthly > 0) {
      // total_amount refleja solo la web
    } else if (oneTime === 0 && monthly === 0) {
      oneTime = catalogWeb?.basePrice ?? 0
      monthly = catalogMkt?.basePrice ?? 0
    }
  }

  const approvedAdBudget = snapshot.totals.approvedAdBudget ?? snapshot.approvedAdBudgetUsd ?? 0
  const pendingAdBudget = snapshot.totals.pendingAdBudget ?? 0
  const recommendedAdBudget = snapshot.totals.recommendedAdBudget ?? snapshot.recommendedAdBudgetUsd ?? 0
  const initialFees = Number((oneTime + monthly + (snapshot.totals.taxAmount ?? 0)).toFixed(2))
  const nextMonthly = monthly
  const projectedInitial = Number((initialFees + approvedAdBudget).toFixed(2))
  const projectedMonthly = Number((monthly + approvedAdBudget).toFixed(2))

  const webPlans = webPlanId
    ? [
        {
          id: webPlanId,
          label: catalogWeb?.label ?? snapshot.webLabel ?? webPlanId,
          basePrice: webOnceFromLines > 0 ? webOnceFromLines : catalogWeb?.basePrice ?? oneTime,
        },
      ]
    : snapshot.webPlans

  return {
    ...snapshot,
    webPlanId,
    marketingPlanId,
    webPlans,
    webLabel: webPlans?.map((p) => p.label).join(' + ') || snapshot.webLabel,
    marketingLabel: catalogMkt?.label ?? snapshot.marketingLabel,
    postsPerMonth: catalogMkt?.postsPerMonth ?? snapshot.postsPerMonth,
    reelsPerMonth: catalogMkt?.reelsPerMonth ?? snapshot.reelsPerMonth,
    campaigns: catalogMkt?.campaignsIncluded ?? snapshot.campaigns,
    storiesIncluded: hasMarketing ? true : snapshot.storiesIncluded,
    storiesPerWeek: hasMarketing ? snapshot.storiesPerWeek ?? 3 : snapshot.storiesPerWeek,
    totals: {
      ...snapshot.totals,
      lines,
      oneTime,
      monthly,
      external,
      initialFees,
      nextMonthly,
      approvedAdBudget,
      pendingAdBudget,
      recommendedAdBudget,
      projectedInitial,
      projectedMonthly,
    },
  }
}

/** Recalcula totales externos/pauta desde configurador cuando exista. */
export function refreshExternalTotalsFromConfigurator(snapshot: CommercialSnapshot, raw: unknown): CommercialSnapshot {
  const cfg = parseConfiguratorFromPayload(raw)
  if (!cfg) return snapshot
  try {
    const priced = priceCommercial({
      webPlanId: snapshot.webPlanId,
      webPlanIds: (
        snapshot.webPlans?.map((p) => p.id) ?? (snapshot.webPlanId ? [snapshot.webPlanId] : [])
      ).filter(isWebPlanId),
      marketingPlanId: snapshot.marketingPlanId,
      extraPages: cfg.extraPages ?? snapshot.extraPages ?? 0,
      featureLines: snapshot.totals.lines
        .filter((line) => line.id.startsWith('feature-'))
        .map((line) => ({
          id: line.id.replace(/^feature-/, ''),
          label: line.label,
          amount: line.amount,
        })),
      includeStories: false,
      storiesPerMonth: 0,
      storiesUnitPrice: 0,
      adBudgetAccepted: cfg.adBudgetChoice === 'accepted' || cfg.adBudgetChoice === 'custom',
      adBudgetChoice: cfg.adBudgetChoice,
      recommendedAdBudgetUsd: cfg.recommendedAdBudgetUsd,
      adBudgetUsd: cfg.adBudgetUsd,
      adsSetupPrice: cfg.adsSetupPrice ?? 0,
      hasDomain: cfg.hasDomain,
      hasHosting: cfg.hasHosting,
      emailCount: cfg.emailCount ?? 0,
      taxRate: snapshot.totals.taxRate,
    })
    const onceFromQuote = snapshot.totals.oneTime
    const monthlyFromQuote = snapshot.totals.monthly
    const externalLines = priced.lines.filter((line) => line.billing === 'external')
    const coreLines = snapshot.totals.lines.filter((line) => line.billing !== 'external')
    const lines = [...coreLines, ...externalLines]
    const external = sumBilling(lines, 'external')
    const initialFees = Number((onceFromQuote + monthlyFromQuote + (priced.taxAmount ?? 0)).toFixed(2))
    return {
      ...snapshot,
      totals: {
        ...snapshot.totals,
        lines,
        external,
        initialFees,
        approvedAdBudget: priced.approvedAdBudget,
        pendingAdBudget: priced.pendingAdBudget,
        recommendedAdBudget: priced.recommendedAdBudget,
        projectedInitial: Number((initialFees + priced.approvedAdBudget).toFixed(2)),
        projectedMonthly: Number((monthlyFromQuote + priced.approvedAdBudget).toFixed(2)),
        taxAmount: priced.taxAmount,
      },
      approvedAdBudgetUsd: priced.approvedAdBudget,
      adBudgetChoice: cfg.adBudgetChoice,
      recommendedAdBudgetUsd: priced.recommendedAdBudget,
    }
  } catch {
    return snapshot
  }
}
