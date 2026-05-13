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
  /** Qué recibe el cliente en la propuesta/PDF. Máximo 5 puntos. */
  offerPoints: string[]
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
    id: 'web-negocio-panel',
    label: 'Desarrollo web para negocios de servicios profesionales con panel administrativo',
    price: 150,
    offerPoints: [
      'Sitio web profesional para negocios de servicios.',
      'Panel administrativo para gestionar contenido o información clave.',
      'Secciones comerciales para mostrar servicios y captar clientes.',
      'Diseño adaptable a celular, tablet y computadora.',
      'Acceso básico para administración interna del sitio.',
    ],
    needsPages: true,
    needsDomainEmail: true,
  },
  {
    id: 'web-negocio',
    label: 'Sitio web de servicios profesionales',
    price: 85,
    offerPoints: [
      'Diseño web profesional orientado a captar clientes para tu negocio.',
      'Secciones clave como inicio, servicios, contacto y llamada a la acción.',
      'Diseño adaptable a celular, tablet y computadora.',
      'Formulario o botón directo de contacto por WhatsApp.',
      'Gestión básica del contenido del sitio según la plataforma elegida.',
    ],
    needsPages: true,
    needsDomainEmail: true,
  },
  {
    id: 'landing',
    label: 'Landing page',
    price: 150,
    offerPoints: [
      'Página enfocada en convertir visitas en contactos o ventas.',
      'Mensaje comercial claro con secciones de beneficio y confianza.',
      'Botones de contacto o WhatsApp visibles.',
      'Diseño optimizado para móviles.',
      'Estructura pensada para campañas o promociones puntuales.',
    ],
    needsPages: true,
    needsDomainEmail: true,
  },
  {
    id: 'wordpress',
    label: 'Diseño web con WordPress — servicios profesionales',
    price: 200,
    offerPoints: [
      'Sitio web profesional montado sobre WordPress.',
      'Acceso a panel de administración para gestionar contenido.',
      'Diseño adaptable a móviles y computadoras.',
      'Secciones comerciales para presentar servicios y captar clientes.',
      'Configuración inicial del sitio lista para publicación.',
    ],
    needsPages: true,
    needsDomainEmail: true,
    wordpressDomainHosting: true,
  },
  {
    id: 'rediseno-web',
    label: 'Rediseño web completo',
    price: 200,
    offerPoints: [
      'Rediseño visual completo con imagen más profesional y moderna.',
      'Reorganización de contenido y estructura para mejorar la experiencia.',
      'Optimización de navegación y llamadas a la acción.',
      'Adaptación responsiva para dispositivos móviles.',
      'Actualización técnica del front-end según el alcance acordado.',
    ],
    needsPages: true,
    needsDomainEmail: true,
  },
  {
    id: 'reservas',
    label: 'Sistema de reservas de clientes',
    price: 300,
    offerPoints: [
      'Sistema para que clientes agenden citas o reservas.',
      'Flujo organizado para disponibilidad y solicitud.',
      'Panel o vista administrativa para control básico de reservas.',
      'Experiencia adaptable a dispositivos móviles.',
      'Base funcional para ordenar la atención del negocio.',
    ],
    needsPages: false,
    needsDomainEmail: true,
  },
  {
    id: 'automatizacion-ia',
    label: 'Automatización de procesos en redes sociales',
    price: 300,
    offerPoints: [
      'Automatización de procesos de atención y respuesta en redes sociales.',
      'Flujos para seguimiento de prospectos, mensajes y oportunidades.',
      'Organización inicial de respuestas y pasos repetitivos del negocio.',
      'Optimización del tiempo operativo en canales sociales.',
      'Implementación funcional según el alcance acordado.',
    ],
    needsPages: false,
    needsDomainEmail: false,
  },
  {
    id: 'ads-meta-google',
    label: 'Campañas Meta Ads / Google Ads — 3 campañas de ventas',
    price: 100,
    offerPoints: [
      'Configuración y gestión de hasta 3 campañas publicitarias.',
      'Enfoque en captar prospectos o ventas para el negocio.',
      'Segmentación inicial según objetivo comercial.',
      'Optimización básica y seguimiento del rendimiento.',
      'Servicio de gestión mensual.',
    ],
    needsPages: false,
    needsDomainEmail: false,
    monthly: true,
  },
  {
    id: 'wordpress-tienda-20',
    label: 'Desarrollo web con WordPress — tienda (20 o más productos)',
    price: 300,
    offerPoints: [
      'Tienda online en WordPress/WooCommerce para vender productos.',
      'Carga inicial de estructura para catálogo y ficha de productos.',
      'Acceso a panel para administrar productos, pedidos y contenido.',
      'Diseño responsive para compras desde celular o computadora.',
      'Configuración base para pagos y operación de la tienda.',
    ],
    needsPages: true,
    needsDomainEmail: true,
    wordpressDomainHosting: true,
  },
  {
    id: 'marketplace-10',
    label: 'Marketplace — hasta 10 productos',
    price: 170,
    offerPoints: [
      'Catálogo digital para vender hasta 10 productos.',
      'Vista de productos con información clara para el cliente.',
      'Acceso administrativo para gestionar inventario o contenido básico.',
      'Experiencia responsive para ventas desde móvil.',
      'Base preparada para integrar procesos comerciales del negocio.',
    ],
    needsPages: false,
    needsDomainEmail: true,
  },
  {
    id: 'marketplace-30',
    label: 'Marketplace — hasta 30 productos (máx.)',
    price: 300,
    offerPoints: [
      'Marketplace preparado para manejar un catálogo más amplio.',
      'Estructura para hasta 30 productos con navegación comercial.',
      'Acceso administrativo para gestión básica del catálogo.',
      'Diseño responsive para mejorar la experiencia de compra.',
      'Base técnica para escalar ventas y operación digital.',
    ],
    needsPages: false,
    needsDomainEmail: true,
  },
  {
    id: 'pasarela',
    label: 'Integración de pasarela de pagos',
    price: 200,
    offerPoints: [
      'Integración técnica de cobros dentro del sitio o sistema.',
      'Configuración inicial del flujo de pago acordado.',
      'Validación básica del proceso de pago.',
      'Soporte de puesta en marcha dentro del alcance contratado.',
      'Enfoque en facilitar cobros digitales a tu negocio.',
    ],
    needsPages: false,
    needsDomainEmail: false,
  },
  {
    id: 'blog',
    label: 'Blog de artículos',
    price: 150,
    offerPoints: [
      'Estructura para publicar artículos y contenido de valor.',
      'Organización por entradas y navegación clara.',
      'Diseño adaptable a celulares y computadoras.',
      'Espacio para fortalecer marca, posicionamiento y confianza.',
      'Gestión básica del contenido según la plataforma contratada.',
    ],
    needsPages: true,
    needsDomainEmail: true,
  },
  {
    id: 'app-movil',
    label: 'App móvil sencilla',
    price: 500,
    offerPoints: [
      'Aplicación móvil básica enfocada en una necesidad principal del negocio.',
      'Pantallas esenciales para operación o atención al cliente.',
      'Interfaz clara y funcional para usuarios finales.',
      'Flujo base listo para pruebas y validación.',
      'Entrega técnica funcional según el alcance acordado.',
    ],
    needsPages: false,
    needsDomainEmail: false,
  },
  {
    id: 'app-movil-pasarela',
    label: 'App móvil con pasarela de pago',
    price: 700,
    offerPoints: [
      'Aplicación móvil con flujo de compra o cobro.',
      'Integración inicial de pasarela de pago según proveedor elegido.',
      'Pantallas clave para usuario, pedido o transacción.',
      'Experiencia funcional enfocada en conversión y uso simple.',
      'Base lista para validar pagos dentro del alcance contratado.',
    ],
    needsPages: false,
    needsDomainEmail: false,
  },
  {
    id: 'app-movil-marketplace-pasarela',
    label: 'App móvil con marketplace y pasarela de pago',
    price: 1000,
    offerPoints: [
      'App móvil para catálogo, compra y cobro desde el celular.',
      'Flujo de marketplace con listado de productos y detalle.',
      'Integración de pasarela de pago dentro del proyecto.',
      'Pantallas principales para clientes y operación comercial.',
      'Base funcional para lanzar una venta digital más completa.',
    ],
    needsPages: false,
    needsDomainEmail: false,
  },
  {
    id: 'mantenimiento',
    label: 'Mantenimiento de sistemas ya creados',
    price: 50,
    offerPoints: [
      'Ajustes técnicos menores sobre sistemas o webs existentes.',
      'Correcciones puntuales y soporte preventivo básico.',
      'Revisión general del funcionamiento según alcance acordado.',
      'Mejoras pequeñas para mantener la operación estable.',
    ],
    needsPages: false,
    needsDomainEmail: false,
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

export type QuoteServiceSnapshot = {
  serviceId: string
  kind: 'catalog' | 'manual'
  label: string
  baseAmount: number
  total: number
  monthly: boolean
  quantityPages: number | null
  hasDomain: YesNo
  hasProfessionalEmail: YesNo
  hasHosting: YesNo
  lines: QuoteLine[]
  offerPoints: string[]
}

export function summarizeQuoteServiceLabels(labels: string[]): string {
  const clean = labels.map((label) => label.trim()).filter(Boolean)
  if (clean.length === 0) return ''
  if (clean.length === 1) return clean[0]
  if (clean.length === 2) return `${clean[0]} + ${clean[1]}`
  return `${clean[0]} + ${clean[1]} + ${clean.length - 2} más`
}

export function getServiceOfferPoints(serviceId?: string | null, fallbackLabel?: string | null): string[] {
  if (serviceId) {
    const byId = getService(serviceId)
    if (byId) return byId.offerPoints.slice(0, 5)
  }
  if (fallbackLabel) {
    const normalized = fallbackLabel.trim().toLowerCase()
    const byLabel = QUOTE_SERVICES.find((service) => service.label.trim().toLowerCase() === normalized)
    if (byLabel) return byLabel.offerPoints.slice(0, 5)
  }
  return []
}

export function buildCatalogQuoteServiceSnapshot(input: {
  serviceId: string
  cantidadPaginas: number
  tieneDominio: YesNo
  tieneCorreo: YesNo
  incluirPasarelaAddon: boolean
}): QuoteServiceSnapshot | null {
  const s = getService(input.serviceId)
  if (!s) return null

  const pages = s.needsPages
    ? Math.max(1, Math.min(50, Number(input.cantidadPaginas) || MAX_INCLUDED_PAGES))
    : MAX_INCLUDED_PAGES

  const lines: QuoteLine[] = [{ label: s.label, amount: s.price }]
  let total = s.price

  if (s.needsPages && pages > MAX_INCLUDED_PAGES) {
    const extra = pages - MAX_INCLUDED_PAGES
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

  return {
    serviceId: s.id,
    kind: 'catalog',
    label: s.label,
    baseAmount: s.price,
    total,
    monthly: s.monthly ?? false,
    quantityPages: s.needsPages ? pages : null,
    hasDomain: s.needsDomainEmail ? input.tieneDominio : '',
    hasProfessionalEmail: s.needsDomainEmail ? input.tieneCorreo : '',
    hasHosting: '',
    lines,
    offerPoints: s.offerPoints.slice(0, 5),
  }
}

export function buildManualQuoteServiceSnapshot(input: {
  label: string
  baseAmount: number
  hasDomain: YesNo
  hasProfessionalEmail: YesNo
  hasHosting?: YesNo
}): QuoteServiceSnapshot {
  const label = input.label.trim() || 'Servicio manual'
  const totals = computeManualQuoteTotals({
    baseAmount: input.baseAmount,
    hasDomain: input.hasDomain,
    hasProfessionalEmail: input.hasProfessionalEmail,
  })
  const lines =
    totals.lines.length > 0
      ? totals.lines.map((line, index) => (index === 0 ? { ...line, label } : line))
      : [{ label, amount: 0 }]

  return {
    serviceId: 'other',
    kind: 'manual',
    label,
    baseAmount: Math.max(0, Number(input.baseAmount) || 0),
    total: totals.total,
    monthly: false,
    quantityPages: null,
    hasDomain: input.hasDomain,
    hasProfessionalEmail: input.hasProfessionalEmail,
    hasHosting: input.hasHosting ?? '',
    lines,
    offerPoints: [],
  }
}

export function combineQuoteServiceSnapshots(services: QuoteServiceSnapshot[]): {
  lines: QuoteLine[]
  total: number
  monthly: boolean
  mixedBilling: boolean
} {
  const clean = services.filter((service) => service.label.trim())
  if (clean.length === 0) {
    return { lines: [], total: 0, monthly: false, mixedBilling: false }
  }

  const firstMonthly = clean[0].monthly
  const mixedBilling = clean.some((service) => service.monthly !== firstMonthly)
  const lines = clean.flatMap((service) =>
    service.lines.map((line, index) => ({
      label: clean.length === 1 ? line.label : index === 0 ? service.label : `${service.label} · ${line.label}`,
      amount: line.amount,
    }))
  )
  const total = clean.reduce((sum, service) => sum + service.total, 0)

  return { lines, total, monthly: firstMonthly, mixedBilling }
}

export function extractQuoteServiceSnapshots(raw: unknown): QuoteServiceSnapshot[] {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return []
  const payload = raw as Record<string, unknown>
  const candidates = payload.selected_services ?? payload.quoteServices
  if (!Array.isArray(candidates)) return []

  const services: QuoteServiceSnapshot[] = []
  for (const item of candidates) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) continue
    const value = item as Record<string, unknown>
    const label = typeof value.label === 'string' ? value.label.trim() : ''
    const serviceId = typeof value.serviceId === 'string' ? value.serviceId : ''
    const kind = value.kind === 'manual' ? 'manual' : 'catalog'
    const baseAmount = typeof value.baseAmount === 'number' ? value.baseAmount : Number(value.baseAmount)
    const total = typeof value.total === 'number' ? value.total : Number(value.total)
    const monthly = value.monthly === true
    const quantityPages =
      typeof value.quantityPages === 'number' && Number.isFinite(value.quantityPages)
        ? value.quantityPages
        : null
    const hasDomain = value.hasDomain === 'si' || value.hasDomain === 'no' ? value.hasDomain : ''
    const hasProfessionalEmail =
      value.hasProfessionalEmail === 'si' || value.hasProfessionalEmail === 'no'
        ? value.hasProfessionalEmail
        : ''
    const hasHosting = value.hasHosting === 'si' || value.hasHosting === 'no' ? value.hasHosting : ''
    const linesRaw = Array.isArray(value.lines) ? value.lines : []
    const lines = linesRaw
      .map((line) => {
        if (!line || typeof line !== 'object' || Array.isArray(line)) return null
        const lineValue = line as Record<string, unknown>
        const lineLabel = typeof lineValue.label === 'string' ? lineValue.label : ''
        const amount = typeof lineValue.amount === 'number' ? lineValue.amount : Number(lineValue.amount)
        if (!lineLabel || !Number.isFinite(amount)) return null
        return { label: lineLabel, amount }
      })
      .filter(Boolean) as QuoteLine[]
    const offerPointsRaw = Array.isArray(value.offerPoints) ? value.offerPoints : []
    const offerPoints = offerPointsRaw
      .filter((point): point is string => typeof point === 'string' && point.trim().length > 0)
      .slice(0, 5)

    if (!label || !serviceId || !Number.isFinite(total) || !Number.isFinite(baseAmount)) continue

    services.push({
      serviceId,
      kind,
      label,
      baseAmount,
      total,
      monthly,
      quantityPages,
      hasDomain,
      hasProfessionalEmail,
      hasHosting,
      lines,
      offerPoints,
    })
  }

  return services
}

export function calculateQuoteLines(input: {
  serviceId: string
  cantidadPaginas: number
  tieneDominio: 'si' | 'no' | ''
  tieneCorreo: 'si' | 'no' | ''
  incluirPasarelaAddon: boolean
}): { lines: QuoteLine[]; total: number } {
  const snapshot = buildCatalogQuoteServiceSnapshot({
    serviceId: input.serviceId,
    cantidadPaginas: input.cantidadPaginas,
    tieneDominio: input.tieneDominio,
    tieneCorreo: input.tieneCorreo,
    incluirPasarelaAddon: input.incluirPasarelaAddon,
  })
  return snapshot ? { lines: snapshot.lines, total: snapshot.total } : { lines: [], total: 0 }
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
  const snapshot = buildCatalogQuoteServiceSnapshot({
    serviceId: input.serviceId,
    cantidadPaginas: input.cantidadPaginas,
    tieneDominio: input.tieneDominio,
    tieneCorreo: input.tieneCorreo,
    incluirPasarelaAddon: input.incluirPasarelaAddon ?? false,
  })
  if (!snapshot) return null
  let lines = snapshot.lines
  let total = snapshot.total
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
