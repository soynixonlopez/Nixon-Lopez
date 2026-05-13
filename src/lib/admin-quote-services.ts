import {
  MAX_INCLUDED_PAGES,
  buildCatalogQuoteServiceSnapshot,
  buildManualQuoteServiceSnapshot,
  combineQuoteServiceSnapshots,
  computeAdminQuoteCatalogTotals,
  computeManualQuoteTotals,
  extractQuoteServiceSnapshots,
  getService,
  summarizeQuoteServiceLabels,
  type QuoteServiceSnapshot,
  type YesNo,
} from '@/lib/quote-pricing'

export const CATALOG_OTHER = 'other'

export type AdminQuoteServiceDraft = {
  key: string
  service_type: string
  service_label: string
  quantity_pages: string
  has_domain: YesNo
  has_professional_email: YesNo
  has_hosting: YesNo
  base_amount: string
}

export type AdminResolvedQuoteService = {
  draft: AdminQuoteServiceDraft
  snapshot: QuoteServiceSnapshot
  subtotal: number
  extrasTotal: number
  total: number
  mode: 'catalog' | 'manual'
}

export function parseYesNo(value: unknown): YesNo {
  return value === 'si' || value === 'no' ? value : ''
}

function createKey() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function createAdminQuoteDraft(serviceType: string): AdminQuoteServiceDraft {
  if (serviceType && serviceType !== CATALOG_OTHER) {
    const service = getService(serviceType)
    if (service) {
      return {
        key: createKey(),
        service_type: service.id,
        service_label: service.label,
        quantity_pages: service.needsPages ? String(MAX_INCLUDED_PAGES) : '',
        has_domain: '',
        has_professional_email: '',
        has_hosting: '',
        base_amount: String(service.price),
      }
    }
  }

  return {
    key: createKey(),
    service_type: CATALOG_OTHER,
    service_label: '',
    quantity_pages: '',
    has_domain: '',
    has_professional_email: '',
    has_hosting: '',
    base_amount: '',
  }
}

export function resolveAdminQuoteServiceDraft(draft: AdminQuoteServiceDraft): AdminResolvedQuoteService {
  const catalog =
    draft.service_type && draft.service_type !== CATALOG_OTHER ? getService(draft.service_type) : undefined
  const baseTrim = draft.base_amount.trim()
  const parsedBase = baseTrim === '' ? NaN : Number.parseFloat(baseTrim)

  if (catalog) {
    const pages = draft.quantity_pages === '' ? MAX_INCLUDED_PAGES : Number(draft.quantity_pages)
    const safePages = Number.isFinite(pages) ? Math.max(1, Math.min(50, pages)) : MAX_INCLUDED_PAGES
    const baseOverride = baseTrim !== '' && Number.isFinite(parsedBase) ? Math.max(0, parsedBase) : null
    const totals = computeAdminQuoteCatalogTotals({
      serviceId: draft.service_type,
      cantidadPaginas: safePages,
      tieneDominio: draft.has_domain,
      tieneCorreo: draft.has_professional_email,
      incluirPasarelaAddon: false,
      baseOverrideUsd: baseOverride,
    })

    const baseSnapshot = buildCatalogQuoteServiceSnapshot({
      serviceId: draft.service_type,
      cantidadPaginas: safePages,
      tieneDominio: draft.has_domain,
      tieneCorreo: draft.has_professional_email,
      incluirPasarelaAddon: false,
    })

    if (totals && baseSnapshot) {
      const lines =
        baseOverride != null && totals.lines.length > 0
          ? totals.lines
          : baseSnapshot.lines

      return {
        draft,
        snapshot: {
          ...baseSnapshot,
          label: draft.service_label.trim() || baseSnapshot.label,
          baseAmount:
            baseOverride != null ? baseOverride : Number.isFinite(baseSnapshot.baseAmount) ? baseSnapshot.baseAmount : 0,
          total: totals.total,
          quantityPages: catalog.needsPages ? safePages : null,
          hasDomain: draft.has_domain,
          hasProfessionalEmail: draft.has_professional_email,
          lines:
            draft.service_label.trim() && draft.service_label.trim() !== baseSnapshot.label
              ? lines.map((line, index) =>
                  index === 0 ? { ...line, label: draft.service_label.trim() } : line
                )
              : lines,
        },
        subtotal: totals.subtotal,
        extrasTotal: totals.extrasTotal,
        total: totals.total,
        mode: 'catalog',
      }
    }
  }

  const manualBase = Number.isFinite(parsedBase) ? Math.max(0, parsedBase) : 0
  const totals = computeManualQuoteTotals({
    baseAmount: manualBase,
    hasDomain: draft.has_domain,
    hasProfessionalEmail: draft.has_professional_email,
  })

  return {
    draft,
    snapshot: buildManualQuoteServiceSnapshot({
      label: draft.service_label,
      baseAmount: manualBase,
      hasDomain: draft.has_domain,
      hasProfessionalEmail: draft.has_professional_email,
      hasHosting: draft.has_hosting,
    }),
    subtotal: totals.subtotal,
    extrasTotal: totals.extrasTotal,
    total: totals.total,
    mode: 'manual',
  }
}

export function resolveAdminQuoteBundle(drafts: AdminQuoteServiceDraft[]) {
  const items = drafts.map(resolveAdminQuoteServiceDraft)
  const services = items.map((item) => item.snapshot)
  const combined = combineQuoteServiceSnapshots(services)
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
  const extrasTotal = items.reduce((sum, item) => sum + item.extrasTotal, 0)

  return {
    items,
    services,
    lines: combined.lines,
    total: combined.total,
    monthly: combined.monthly,
    mixedBilling: combined.mixedBilling,
    subtotal,
    extrasTotal,
    serviceLabelSummary: summarizeQuoteServiceLabels(services.map((service) => service.label)),
  }
}

export function buildAdminQuoteDraftsFromExisting(input: {
  service_id: string | null
  service_label: string | null
  quantity_pages: number | null
  total_amount: number | null
  raw_payload: unknown
}): AdminQuoteServiceDraft[] {
  const selectedServices = extractQuoteServiceSnapshots(input.raw_payload)
  if (selectedServices.length > 0) {
    return selectedServices.map((service) => ({
      key: createKey(),
      service_type: service.kind === 'manual' ? CATALOG_OTHER : service.serviceId,
      service_label: service.label,
      quantity_pages: service.quantityPages != null ? String(service.quantityPages) : '',
      has_domain: service.hasDomain,
      has_professional_email: service.hasProfessionalEmail,
      has_hosting: service.hasHosting,
      base_amount: String(service.baseAmount ?? service.lines[0]?.amount ?? service.total ?? 0),
    }))
  }

  const raw =
    input.raw_payload && typeof input.raw_payload === 'object' && !Array.isArray(input.raw_payload)
      ? (input.raw_payload as Record<string, unknown>)
      : {}

  const initialBase =
    typeof raw.base_amount === 'number' && Number.isFinite(raw.base_amount)
      ? raw.base_amount
      : input.total_amount != null
        ? Number(input.total_amount)
        : ''

  return [
    {
      key: createKey(),
      service_type: (typeof raw.service_type === 'string' ? raw.service_type : input.service_id) ?? '',
      service_label: input.service_label ?? '',
      quantity_pages: input.quantity_pages != null ? String(input.quantity_pages) : '',
      has_domain: parseYesNo(raw.has_domain),
      has_professional_email: parseYesNo(raw.has_professional_email),
      has_hosting: parseYesNo(raw.has_hosting),
      base_amount: initialBase === '' ? '' : String(initialBase),
    },
  ]
}
