/** Catálogo y reglas de cotización pública (NL Services) + opciones del panel admin. */

export const MAX_INCLUDED_PAGES = 5
export const PRICE_EXTRA_PAGE_USD = 25
export const PRICE_DOMAIN_USD = 15
export const PRICE_EMAIL_USD = 10
export const PRICE_PASARELA_ADDON_USD = 200

/** Alias para textos del flujo admin (mismos montos que cotización pública) */
export const FEE_NO_DOMAIN_USD = PRICE_DOMAIN_USD
export const FEE_NO_PROFESSIONAL_EMAIL_USD = PRICE_EMAIL_USD

export type ServiceDef = {
  id: string
  label: string
  price: number
  /** Incluye sección de páginas (máx. 5 base, +$25 c/u) */
  needsPages: boolean
  /** Preguntar dominio / correo si no los tiene */
  needsDomainEmail: boolean
  /** Precio mensual (ej. publicidad) */
  monthly?: boolean
}

export const QUOTE_SERVICES: ServiceDef[] = [
  {
    id: 'web-negocio',
    label: 'Desarrollo web — negocios de servicios',
    price: 80,
    needsPages: true,
    needsDomainEmail: true,
  },
  {
    id: 'app-movil',
    label: 'App móvil sencilla — negocios',
    price: 300,
    needsPages: false,
    needsDomainEmail: false,
  },
  {
    id: 'marketplace-10',
    label: 'Marketplace — hasta 10 productos o servicios',
    price: 150,
    needsPages: false,
    needsDomainEmail: true,
  },
  {
    id: 'marketplace-30',
    label: 'Marketplace — hasta 30 productos (máx.)',
    price: 300,
    needsPages: false,
    needsDomainEmail: true,
  },
  {
    id: 'landing',
    label: 'Landing page',
    price: 150,
    needsPages: true,
    needsDomainEmail: true,
  },
  {
    id: 'wordpress',
    label: 'Desarrollo con WordPress',
    price: 200,
    needsPages: true,
    needsDomainEmail: true,
  },
  {
    id: 'mantenimiento',
    label: 'Mantenimiento de sistemas ya creados',
    price: 50,
    needsPages: false,
    needsDomainEmail: false,
  },
  {
    id: 'blog',
    label: 'Blog de artículos',
    price: 150,
    needsPages: true,
    needsDomainEmail: true,
  },
  {
    id: 'pasarela',
    label: 'Integración de pasarela de pagos',
    price: 200,
    needsPages: false,
    needsDomainEmail: false,
  },
  {
    id: 'reservas',
    label: 'Sistema de reservas de clientes',
    price: 300,
    needsPages: false,
    needsDomainEmail: true,
  },
  {
    id: 'automatizacion-ia',
    label: 'Automatizaciones con IA (ventas por WhatsApp y redes)',
    price: 300,
    needsPages: false,
    needsDomainEmail: false,
  },
  {
    id: 'ads-meta-google',
    label: 'Campañas Meta Ads / Google Ads — 3 campañas de ventas',
    price: 70,
    needsPages: false,
    needsDomainEmail: false,
    monthly: true,
  },
]

export function getService(id: string): ServiceDef | undefined {
  return QUOTE_SERVICES.find((s) => s.id === id)
}

export type QuoteLine = { label: string; amount: number }

export function calculateQuoteLines(input: {
  serviceId: string
  cantidadPaginas: number
  tieneDominio: 'si' | 'no' | ''
  tieneCorreo: 'si' | 'no' | ''
  incluirPasarelaAddon: boolean
}): { lines: QuoteLine[]; total: number } {
  const s = getService(input.serviceId)
  if (!s) return { lines: [], total: 0 }

  const lines: QuoteLine[] = [{ label: s.label, amount: s.price }]
  let total = s.price

  if (s.needsPages && input.cantidadPaginas > MAX_INCLUDED_PAGES) {
    const extra = input.cantidadPaginas - MAX_INCLUDED_PAGES
    const amt = extra * PRICE_EXTRA_PAGE_USD
    lines.push({
      label: `Páginas adicionales (${extra} × $${PRICE_EXTRA_PAGE_USD})`,
      amount: amt,
    })
    total += amt
  }

  if (s.needsDomainEmail) {
    if (input.tieneDominio === 'no') {
      lines.push({ label: 'Dominio (incluido en presupuesto)', amount: PRICE_DOMAIN_USD })
      total += PRICE_DOMAIN_USD
    }
    if (input.tieneCorreo === 'no') {
      lines.push({ label: 'Correo profesional (incluido en presupuesto)', amount: PRICE_EMAIL_USD })
      total += PRICE_EMAIL_USD
    }
  }

  const pasarelaStandalone = input.serviceId === 'pasarela'
  if (!pasarelaStandalone && s.needsPages && input.incluirPasarelaAddon) {
    lines.push({ label: 'Integración pasarela de pagos (add-on)', amount: PRICE_PASARELA_ADDON_USD })
    total += PRICE_PASARELA_ADDON_USD
  }

  return { lines, total }
}

// --- Panel admin: tipos de servicio manuales (valores en service_id / raw_payload) ---

export const ADMIN_SERVICE_TYPE_OPTIONS = [
  { value: 'web', label: 'Desarrollo web para negocios' },
  { value: 'mobile', label: 'Apps móviles para negocios' },
  { value: 'automation', label: 'Automatizaciones con IA' },
  { value: 'meta_ads', label: 'Publicidad en Meta Ads' },
  { value: 'google_ads', label: 'Publicidad en Google Ads' },
  { value: 'saas', label: 'Sistemas SaaS' },
  { value: 'consultoria', label: 'Consultorías' },
  { value: 'other', label: 'Otro servicio' },
] as const

export type YesNo = 'si' | 'no' | ''

export function computeManualQuoteTotals(params: {
  baseAmount: number
  hasDomain: YesNo
  hasProfessionalEmail: YesNo
}): { lines: QuoteLine[]; subtotal: number; extrasTotal: number; total: number } {
  const lines: QuoteLine[] = []
  const base = Math.max(0, Number(params.baseAmount) || 0)
  if (base > 0) {
    lines.push({ label: 'Servicio / proyecto (precio base)', amount: base })
  }
  let extras = 0
  if (params.hasDomain === 'no') {
    lines.push({ label: 'Dominio (registro o gestión)', amount: FEE_NO_DOMAIN_USD })
    extras += FEE_NO_DOMAIN_USD
  }
  if (params.hasProfessionalEmail === 'no') {
    lines.push({
      label: 'Correo electrónico profesional (configuración)',
      amount: FEE_NO_PROFESSIONAL_EMAIL_USD,
    })
    extras += FEE_NO_PROFESSIONAL_EMAIL_USD
  }
  const total = base + extras
  return { lines, subtotal: base, extrasTotal: extras, total }
}

export function serviceTypeLabel(value: string | null | undefined): string {
  if (!value) return ''
  const o = ADMIN_SERVICE_TYPE_OPTIONS.find((x) => x.value === value)
  return o?.label ?? value
}
