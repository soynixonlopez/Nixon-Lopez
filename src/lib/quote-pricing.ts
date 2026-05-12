/** Catálogo y reglas de cotización pública (Nixon Lopez Services) + opciones del panel admin. */

export const MAX_INCLUDED_PAGES = 5
export const PRICE_EXTRA_PAGE_USD = 25
export const PRICE_DOMAIN_USD = 15
export const PRICE_EMAIL_USD = 10
export const PRICE_PASARELA_ADDON_USD = 200

/** Dominio + hosting 1.er año (presupuesto) para proyectos WordPress en la cotización pública */
export const PRICE_WORDPRESS_DOMAIN_USD = 20
export const PRICE_WORDPRESS_HOSTING_FIRST_YEAR_USD = 40

/** Alias para textos del flujo admin (mismos montos que cotización pública estándar) */
export const FEE_NO_DOMAIN_USD = PRICE_DOMAIN_USD
export const FEE_NO_PROFESSIONAL_EMAIL_USD = PRICE_EMAIL_USD

export type ServiceDef = {
  id: string
  label: string
  price: number
  /** Incluye sección de páginas (máx. 5 base, +$25 c/u) */
  needsPages: boolean
  /** Preguntar dominio y segundo rubro (correo profesional, o hosting 1.er año si es WordPress) */
  needsDomainEmail: boolean
  /** Si true: dominio $20 y hosting $40 (1.er año) en lugar de dominio $15 + correo $10 */
  wordpressDomainHosting?: boolean
  /** Precio mensual (ej. publicidad) */
  monthly?: boolean
}

export const QUOTE_SERVICES: ServiceDef[] = [
  {
    id: 'web-negocio',
    label: 'Sitio web de servicios profesionales',
    price: 85,
    needsPages: true,
    needsDomainEmail: true,
  },
  {
    id: 'rediseno-web',
    label: 'Rediseño web completo',
    price: 200,
    needsPages: true,
    needsDomainEmail: true,
  },
  {
    id: 'wordpress',
    label: 'Diseño web con WordPress — servicios profesionales',
    price: 200,
    needsPages: true,
    needsDomainEmail: true,
    wordpressDomainHosting: true,
  },
  {
    id: 'wordpress-tienda-20',
    label: 'Desarrollo web con WordPress — tienda (20 o más productos)',
    price: 300,
    needsPages: true,
    needsDomainEmail: true,
    wordpressDomainHosting: true,
  },
  {
    id: 'landing',
    label: 'Landing page',
    price: 150,
    needsPages: true,
    needsDomainEmail: true,
  },
  {
    id: 'blog',
    label: 'Blog de artículos',
    price: 150,
    needsPages: true,
    needsDomainEmail: true,
  },
  {
    id: 'marketplace-10',
    label: 'Marketplace — hasta 10 productos',
    price: 170,
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
    id: 'app-movil',
    label: 'App móvil sencilla',
    price: 500,
    needsPages: false,
    needsDomainEmail: false,
  },
  {
    id: 'app-movil-pasarela',
    label: 'App móvil con pasarela de pago',
    price: 700,
    needsPages: false,
    needsDomainEmail: false,
  },
  {
    id: 'app-movil-marketplace-pasarela',
    label: 'App móvil con marketplace y pasarela de pago',
    price: 1000,
    needsPages: false,
    needsDomainEmail: false,
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
    id: 'mantenimiento',
    label: 'Mantenimiento de sistemas ya creados',
    price: 50,
    needsPages: false,
    needsDomainEmail: false,
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

/** Montos si el cliente indica que no tiene dominio y no tiene el segundo rubro (correo o hosting 1.er año en WordPress). */
export function getQuoteAddonIfMissing(service: ServiceDef | undefined): {
  domainUsd: number
  secondUsd: number
  isWordPressHosting: boolean
} {
  if (service?.wordpressDomainHosting) {
    return {
      domainUsd: PRICE_WORDPRESS_DOMAIN_USD,
      secondUsd: PRICE_WORDPRESS_HOSTING_FIRST_YEAR_USD,
      isWordPressHosting: true,
    }
  }
  return {
    domainUsd: PRICE_DOMAIN_USD,
    secondUsd: PRICE_EMAIL_USD,
    isWordPressHosting: false,
  }
}

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
    const add = getQuoteAddonIfMissing(s)
    const domainLine = 'Dominio (incluido en presupuesto)'
    const secondLine = add.isWordPressHosting
      ? 'Hosting — 1.er año (incluido en presupuesto)'
      : 'Correo profesional (incluido en presupuesto)'

    if (input.tieneDominio === 'no') {
      lines.push({ label: domainLine, amount: add.domainUsd })
      total += add.domainUsd
    }
    if (input.tieneCorreo === 'no') {
      lines.push({ label: secondLine, amount: add.secondUsd })
      total += add.secondUsd
    }
  }

  const pasarelaStandalone = input.serviceId === 'pasarela'
  if (!pasarelaStandalone && s.needsPages && input.incluirPasarelaAddon) {
    lines.push({ label: 'Integración pasarela de pagos (add-on)', amount: PRICE_PASARELA_ADDON_USD })
    total += PRICE_PASARELA_ADDON_USD
  }

  return { lines, total }
}

/** Totales del panel admin alineados con la cotización pública (catálogo `QUOTE_SERVICES`). */
export function computeAdminQuoteCatalogTotals(input: {
  serviceId: string
  cantidadPaginas: number
  tieneDominio: YesNo
  tieneCorreo: YesNo
  incluirPasarelaAddon?: boolean
  /** Si se informa, sustituye solo el importe de la primera línea (servicio) del catálogo. */
  baseOverrideUsd?: number | null
}): { lines: QuoteLine[]; subtotal: number; extrasTotal: number; total: number } | null {
  const s = getService(input.serviceId)
  if (!s) return null
  const pages = s.needsPages
    ? Math.max(1, Math.min(50, input.cantidadPaginas || MAX_INCLUDED_PAGES))
    : MAX_INCLUDED_PAGES
  let { lines, total } = calculateQuoteLines({
    serviceId: input.serviceId,
    cantidadPaginas: pages,
    tieneDominio: input.tieneDominio,
    tieneCorreo: input.tieneCorreo,
    incluirPasarelaAddon: input.incluirPasarelaAddon ?? false,
  })
  if (
    input.baseOverrideUsd != null &&
    Number.isFinite(input.baseOverrideUsd) &&
    input.baseOverrideUsd >= 0 &&
    lines.length > 0
  ) {
    const oldBase = lines[0].amount
    const override = input.baseOverrideUsd
    lines = lines.map((l, i) => (i === 0 ? { ...l, amount: override } : l))
    total += override - oldBase
  }
  let extrasTotal = 0
  let subtotal = 0
  for (const line of lines) {
    const extra =
      line.label.startsWith('Dominio') ||
      line.label.startsWith('Correo') ||
      line.label.startsWith('Hosting')
    if (extra) extrasTotal += line.amount
    else subtotal += line.amount
  }
  return { lines, subtotal, extrasTotal, total }
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
  const cat = getService(value)
  if (cat) return cat.label
  const o = ADMIN_SERVICE_TYPE_OPTIONS.find((x) => x.value === value)
  return o?.label ?? value
}
