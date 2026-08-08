export const LANDING_IMAGE = {
  maxUploadBytes: 8 * 1024 * 1024,
  bucket: 'landings',
} as const

export type LandingPaymentMethod =
  | 'hotmart'
  | 'paguelo_facil'
  | 'cubo'
  | 'yappy'
  | 'bank_transfer'
  | 'custom'

export type LandingPayment = {
  primary_method: LandingPaymentMethod
  checkout_url: string
  hotmart_url: string
  paguelo_facil_url: string
  cubo_url: string
  yappy_number: string
  yappy_name: string
  bank_name: string
  bank_account: string
  bank_holder: string
  bank_type: string
  custom_label: string
  custom_instructions: string
  cta_label: string
}

export type LandingBenefit = {
  id: string
  title: string
  description: string
}

export type LandingContent = {
  eyebrow: string
  headline: string
  subheadline: string
  hero_image_url: string
  hero_image_path: string
  cta_primary: string
  cta_secondary: string
  benefits_title: string
  benefits: LandingBenefit[]
  about_title: string
  about_body: string
  about_image_url: string
  about_image_path: string
  offer_title: string
  offer_body: string
  guarantee_text: string
  footer_note: string
}

export type LandingPageRow = {
  id: string
  created_at: string
  updated_at: string
  slug: string
  title: string
  is_published: boolean
  price_amount: number
  price_label: string
  price_note: string | null
  content: LandingContent
  payment: LandingPayment
  seo_title: string | null
  seo_description: string | null
}

export function slugifyLanding(input: string) {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export function emptyLandingContent(): LandingContent {
  return {
    eyebrow: 'Oferta especial',
    headline: 'Tu servicio destacado',
    subheadline: 'Describe el valor principal en una frase clara.',
    hero_image_url: '',
    hero_image_path: '',
    cta_primary: 'Quiero este servicio',
    cta_secondary: 'Hablar por WhatsApp',
    benefits_title: 'Qué incluye',
    benefits: [
      {
        id: cryptoRandomId(),
        title: 'Entrega profesional',
        description: 'Diseño y desarrollo con estándar de calidad.',
      },
      {
        id: cryptoRandomId(),
        title: 'Soporte cercano',
        description: 'Acompañamiento durante el proceso.',
      },
      {
        id: cryptoRandomId(),
        title: 'Resultados claros',
        description: 'Enfocado en conversión y presencia digital.',
      },
    ],
    about_title: 'Sobre el servicio',
    about_body: 'Explica para quién es, qué problema resuelve y el resultado esperado.',
    about_image_url: '',
    about_image_path: '',
    offer_title: 'Inversión',
    offer_body: 'Pago único. Sin costos ocultos.',
    guarantee_text: 'Si tienes dudas, escríbeme antes de comprar.',
    footer_note: 'Nixon Lopez Services',
  }
}

export function emptyLandingPayment(): LandingPayment {
  return {
    primary_method: 'hotmart',
    checkout_url: '',
    hotmart_url: '',
    paguelo_facil_url: '',
    cubo_url: '',
    yappy_number: '',
    yappy_name: '',
    bank_name: '',
    bank_account: '',
    bank_holder: '',
    bank_type: 'Ahorros',
    custom_label: 'Pago alternativo',
    custom_instructions: '',
    cta_label: 'Comprar ahora',
  }
}

export function normalizeLandingContent(raw: unknown): LandingContent {
  const base = emptyLandingContent()
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return base
  const value = raw as Record<string, unknown>
  return {
    ...base,
    eyebrow: str(value.eyebrow, base.eyebrow),
    headline: str(value.headline, base.headline),
    subheadline: str(value.subheadline, base.subheadline),
    hero_image_url: str(value.hero_image_url, ''),
    hero_image_path: str(value.hero_image_path, ''),
    cta_primary: str(value.cta_primary, base.cta_primary),
    cta_secondary: str(value.cta_secondary, base.cta_secondary),
    benefits_title: str(value.benefits_title, base.benefits_title),
    benefits: Array.isArray(value.benefits)
      ? value.benefits
          .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
          .map((item) => ({
            id: str(item.id, cryptoRandomId()),
            title: str(item.title, 'Beneficio'),
            description: str(item.description, ''),
          }))
      : base.benefits,
    about_title: str(value.about_title, base.about_title),
    about_body: str(value.about_body, base.about_body),
    about_image_url: str(value.about_image_url, ''),
    about_image_path: str(value.about_image_path, ''),
    offer_title: str(value.offer_title, base.offer_title),
    offer_body: str(value.offer_body, base.offer_body),
    guarantee_text: str(value.guarantee_text, base.guarantee_text),
    footer_note: str(value.footer_note, base.footer_note),
  }
}

export function normalizeLandingPayment(raw: unknown): LandingPayment {
  const base = emptyLandingPayment()
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return base
  const value = raw as Record<string, unknown>
  const method = value.primary_method
  return {
    ...base,
    primary_method:
      method === 'hotmart' ||
      method === 'paguelo_facil' ||
      method === 'cubo' ||
      method === 'yappy' ||
      method === 'bank_transfer' ||
      method === 'custom'
        ? method
        : 'hotmart',
    checkout_url: str(value.checkout_url, ''),
    hotmart_url: str(value.hotmart_url, ''),
    paguelo_facil_url: str(value.paguelo_facil_url, ''),
    cubo_url: str(value.cubo_url, ''),
    yappy_number: str(value.yappy_number, ''),
    yappy_name: str(value.yappy_name, ''),
    bank_name: str(value.bank_name, ''),
    bank_account: str(value.bank_account, ''),
    bank_holder: str(value.bank_holder, ''),
    bank_type: str(value.bank_type, 'Ahorros'),
    custom_label: str(value.custom_label, base.custom_label),
    custom_instructions: str(value.custom_instructions, ''),
    cta_label: str(value.cta_label, base.cta_label),
  }
}

export function resolveCheckoutUrl(payment: LandingPayment): string | null {
  if (payment.checkout_url.trim()) return payment.checkout_url.trim()
  if (payment.primary_method === 'hotmart' && payment.hotmart_url.trim()) return payment.hotmart_url.trim()
  if (payment.primary_method === 'paguelo_facil' && payment.paguelo_facil_url.trim()) {
    return payment.paguelo_facil_url.trim()
  }
  if (payment.primary_method === 'cubo' && payment.cubo_url.trim()) return payment.cubo_url.trim()
  return null
}

function str(value: unknown, fallback: string) {
  return typeof value === 'string' ? value : fallback
}

function cryptoRandomId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `b-${Math.random().toString(36).slice(2, 10)}`
}
