import { WHATSAPP_E164 } from '@/lib/site-contact'

export const BRAND_ACCENT = '#1e3a5f'

/** Retratos del home — public/images/nixon */
export const HOME_IMAGES = {
  hero: '/images/nixon/masterclass_hero.webp',
  about: '/images/nixon/nixon_about.webp',
  /** Imagen social / Open Graph (mejor CTR que el logo horizontal) */
  og: '/images/nixon/masterclass_hero.webp',
  heroWidth: 1086,
  heroHeight: 1448,
  aboutWidth: 1092,
  aboutHeight: 1440,
} as const

export const WHATSAPP_MESSAGES = {
  default: 'Hola Nixon, quiero cotizar una página web para mi negocio. ¿Me ayudas?',
  hero: 'Hola Nixon, vi tu web y me gustaría hablar sobre un proyecto para mi negocio.',
  problem: 'Hola Nixon, creo que mi negocio necesita una web para conseguir más clientes. ¿Podemos hablar?',
  benefits: 'Hola Nixon, quiero saber cómo puedo conseguir más clientes con una web profesional.',
  serviceWeb: 'Hola Nixon, quiero una página web profesional para mi negocio.',
  serviceLanding: 'Hola Nixon, me interesa una landing page de ventas para mi negocio.',
  serviceStore: 'Hola Nixon, me interesa abrir una tienda online para vender mis productos.',
  customSoftware: 'Hola Nixon, necesito un sistema a medida para mi negocio. ¿Podemos cotizar?',
  cases: 'Hola Nixon, vi tus proyectos y quiero algo similar para mi negocio.',
  process: 'Hola Nixon, quiero empezar el proceso de cotización para mi proyecto.',
  faq: 'Hola Nixon, tengo algunas dudas sobre contratar una web. ¿Me orientas?',
  about: 'Hola Nixon, me gustaría contarte sobre mi negocio y recibir una propuesta.',
  final: 'Hola Nixon, estoy listo/a para solicitar cotización de mi proyecto.',
  caseAquarumbos: 'Hola Nixon, vi el caso de Aquarumbos y quiero un proyecto similar para mi negocio.',
  caseAserta: 'Hola Nixon, vi el caso de Aserta y necesito una solución digital para mi empresa.',
  caseSara: 'Hola Nixon, vi el caso de Sara Carryhau y quiero mi página profesional.',
  caseSpl: 'Hola Nixon, vi el caso de SPL Business y quiero crear mi sitio empresarial.',
  caseNutrielys: 'Hola Nixon, vi el caso de Nutrielys y quiero una web para mi negocio.',
} as const

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(message)}`
}

export function quoteUrl(serviceId?: string) {
  return serviceId ? `/cotizacion?service=${encodeURIComponent(serviceId)}` : '/cotizacion'
}

export const HOME_NAV = [
  { name: 'Servicios', href: '#services' },
  { name: 'Proyectos', href: '#projects' },
  { name: 'Proceso', href: '#process' },
  { name: 'Preguntas', href: '#faq' },
  { name: 'Sobre mí', href: '#about' },
] as const

/** Badges de confianza en el hero */
export const HERO_TRUST_BADGES = [
  {
    title: '+50',
    subtitle: 'Proyectos entregados',
    icon: 'users' as const,
    color: 'violet',
  },
  {
    title: 'Atención directa',
    subtitle: 'Conmigo',
    icon: 'whatsapp' as const,
    color: 'green',
  },
  {
    title: 'Diseño + Desarrollo',
    subtitle: '+ Estrategia',
    icon: 'shield' as const,
    color: 'blue',
  },
  {
    title: 'Panamá',
    subtitle: 'y clientes internacionales',
    icon: 'globe' as const,
    color: 'purple',
  },
] as const

/** Stack visible en la barra inferior del hero */
export const HERO_TECH_STACK = [
  'Next.js',
  'React',
  'TypeScript',
  'WordPress',
  'Tailwind CSS',
  'Supabase',
] as const

/** Señales de confianza — reducen fricción antes del clic */
export const TRUST_SIGNALS = [
  { label: '+50 proyectos entregados' },
  { label: 'Contrato profesional incluido' },
  { label: 'Cotización automática en minutos' },
  { label: 'Facturación formal' },
  { label: 'Atención directa con Nixon' },
  { label: 'WhatsApp siempre disponible' },
] as const

export const HOME_SERVICES = [
  {
    id: 'web-negocio',
    icon: 'monitor' as const,
    color: 'blue' as const,
    title: 'Página web profesional',
    description: 'Para negocios que necesitan verse profesionales y conseguir más clientes online.',
    features: ['Diseño personalizado', 'Adaptada a celular', 'WhatsApp integrado', 'Optimización básica SEO'],
    priceLabel: 'Desde $90',
    ctaLabel: 'Quiero mi página web',
  },
  {
    id: 'landing',
    icon: 'rocket' as const,
    color: 'green' as const,
    title: 'Landing page de ventas',
    description: 'Para vender un servicio, curso o campaña específica.',
    features: [
      'Diseño enfocado en conversión',
      'Formularios y captación',
      'Integraciones (email, pagos)',
      'WhatsApp o pagos online',
    ],
    priceLabel: 'Desde $150',
    ctaLabel: 'Crear mi landing',
  },
  {
    id: 'wordpress-tienda-20',
    icon: 'cart' as const,
    color: 'purple' as const,
    title: 'Tienda online',
    description: 'Para vender productos sin depender solamente de un local físico.',
    features: [
      'Catálogo de productos',
      'Carrito de compra',
      'Métodos de pago',
      'Administración de productos',
    ],
    priceLabel: 'Desde $300',
    ctaLabel: 'Quiero vender online',
  },
  {
    id: 'reservas',
    icon: 'settings' as const,
    color: 'orange' as const,
    title: 'Sistema personalizado',
    description: 'Para negocios que necesitan algo más que una página web.',
    features: [
      'Reservas y agendamientos',
      'Plataformas a medida',
      'Automatización de procesos',
      'Integraciones y paneles',
    ],
    priceLabel: 'Según proyecto',
    ctaLabel: 'Cuéntame mi idea',
    whatsapp: true,
  },
] as const

export const SERVICES_TRUST_PILLS = [
  { icon: 'clock' as const, color: 'blue' as const, label: 'Entrega a tiempo' },
  { icon: 'message' as const, color: 'green' as const, label: 'Comunicación clara' },
  { icon: 'lock' as const, color: 'purple' as const, label: 'Seguridad y respaldo' },
  { icon: 'headphones' as const, color: 'orange' as const, label: 'Soporte post-entrega' },
] as const

export const QUOTE_SECTION_BENEFITS = [
  {
    icon: 'timer' as const,
    color: 'blue' as const,
    title: 'Rápido y sin compromiso',
    description: 'Obtén tu estimación en menos de 2 minutos.',
  },
  {
    icon: 'shield' as const,
    color: 'green' as const,
    title: 'Precio estimado al instante',
    description: 'Sabrás cuánto puede costar tu proyecto antes de hablar con nosotros.',
  },
  {
    icon: 'document' as const,
    color: 'purple' as const,
    title: 'Propuesta personalizada',
    description: 'Te enviamos una propuesta adaptada a las necesidades de tu negocio.',
  },
] as const

export const QUOTE_FORM_OPTIONS = [
  {
    id: 'web-negocio',
    icon: 'monitor' as const,
    color: 'blue' as const,
    title: 'Página web',
    subtitle: 'Sitio web profesional para tu negocio.',
  },
  {
    id: 'landing',
    icon: 'rocket' as const,
    color: 'green' as const,
    title: 'Landing page',
    subtitle: 'Página de ventas o campaña específica.',
  },
  {
    id: 'wordpress-tienda-20',
    icon: 'cart' as const,
    color: 'purple' as const,
    title: 'Tienda online',
    subtitle: 'Vende tus productos por internet.',
  },
  {
    id: 'sistema',
    icon: 'code' as const,
    color: 'orange' as const,
    title: 'Sistema personalizado',
    subtitle: 'Desarrollo a medida para tu negocio.',
  },
] as const

export const QUOTE_DETAIL_OPTIONS = [
  { value: 'primera-web', label: 'Quiero mi primera web para mi negocio' },
  { value: 'mejorar-web', label: 'Necesito mejorar mi sitio actual' },
  { value: 'vender-online', label: 'Quiero vender productos o servicios online' },
  { value: 'landing-campana', label: 'Necesito una landing para una campaña' },
  { value: 'sistema-medida', label: 'Busco un sistema o automatización a medida' },
  { value: 'otro', label: 'Otro — lo explico en la cotización' },
] as const

export const HOME_BENEFITS = [
  {
    icon: 'users' as const,
    color: 'blue' as const,
    title: 'Más clientes potenciales',
    description: 'Tu web trabaja 24/7 captando personas interesadas en tus servicios.',
  },
  {
    icon: 'shield' as const,
    color: 'purple' as const,
    title: 'Más confianza para tu negocio',
    description: 'Una presencia profesional hace que te elijan frente a la competencia.',
  },
  {
    icon: 'whatsapp' as const,
    color: 'green' as const,
    title: 'Lista para vender desde celular',
    description: 'Tus clientes pueden contactarte fácilmente por WhatsApp con un solo clic.',
  },
  {
    icon: 'process' as const,
    color: 'orange' as const,
    title: 'Proceso claro y sin complicaciones',
    description: 'Comunicación directa, contrato y acompañamiento durante todo el proyecto.',
  },
] as const

export const HOME_PROBLEMS = [
  {
    icon: 'search' as const,
    problem: 'Te buscan en Google y no apareces — o lo que aparece no inspira confianza.',
    solution:
      'Creamos una web profesional optimizada para Google y diseñada para transmitir confianza desde el primer segundo.',
  },
  {
    icon: 'message' as const,
    problem: 'Dependes del boca a boca y pierdes clientes que nunca te encontraron.',
    solution: 'Te damos presencia digital estratégica con WhatsApp directo para que te contacten al instante.',
  },
  {
    icon: 'clock' as const,
    problem: 'Pierdes horas en tareas que podrían automatizarse y te alejan de lo importante.',
    solution:
      'Implementamos sistemas e IA que te devuelven tiempo para enfocarte en vender y hacer crecer tu negocio.',
  },
] as const

export const HOME_PROCESS = [
  {
    step: '1',
    icon: 'quote' as const,
    color: 'blue' as const,
    title: 'Cotizas en minutos',
    description: 'Eliges lo que necesitas en el cotizador online. Sin llamadas ni esperas.',
  },
  {
    step: '2',
    icon: 'proposal' as const,
    color: 'green' as const,
    title: 'Recibes tu propuesta',
    description: 'PDF con precio, alcance y detalles. La revisas con calma, sin presiones.',
  },
  {
    step: '3',
    icon: 'contract' as const,
    color: 'purple' as const,
    title: 'Firmamos contrato',
    description: 'Documento formal que protege a ambas partes.',
    highlight: '50% para iniciar.',
  },
  {
    step: '4',
    icon: 'develop' as const,
    color: 'orange' as const,
    title: 'Desarrollamos juntos',
    description: 'Comunicación directa conmigo. Sabes en qué va tu proyecto en todo momento.',
  },
  {
    step: '5',
    icon: 'launch' as const,
    color: 'pink' as const,
    title: 'Lanzamos tu web',
    description: 'Entrega, ajustes finales y tu negocio listo para captar clientes.',
  },
] as const

export const HOME_FAQ = [
  {
    question: '¿Cuánto tarda una página web?',
    answer:
      'Una web profesional normalmente está lista entre 5 y 10 días hábiles dependiendo del alcance del proyecto y la entrega del contenido.',
  },
  {
    question: '¿Qué incluye el desarrollo?',
    answer:
      'Diseño personalizado, adaptación móvil, optimización básica, integración con WhatsApp y acompañamiento durante el proceso.',
  },
  {
    question: '¿Necesito comprar dominio y hosting?',
    answer:
      'Te ayudo a elegir y configurar las herramientas necesarias para que tu proyecto funcione correctamente.',
  },
  {
    question: '¿Puedo pagar en partes?',
    answer:
      'Sí. Normalmente trabajamos con un pago inicial para comenzar y el restante al finalizar.',
  },
  {
    question: '¿Puedo ampliar mi web después?',
    answer: 'Sí. Las soluciones pueden crecer según las necesidades de tu negocio.',
  },
] as const

export const ABOUT_STATS = [
  { value: '+50', label: 'Proyectos entregados', color: 'blue' as const },
  { value: '5+', label: 'Años creando soluciones digitales', color: 'purple' as const },
  { value: '100%', label: 'Atención directa conmigo', color: 'green' as const },
] as const

export const ABOUT_CHECKLIST = [
  'Comunicación directa',
  'Soluciones personalizadas',
  'Diseño enfocado en resultados',
  'Tecnología moderna',
] as const

export const ABOUT_SOCIAL = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/nixonlopez',
    tone: 'linkedin' as const,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/soynixonlopez',
    tone: 'github' as const,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/nixonlopes.dev/',
    tone: 'instagram' as const,
  },
] as const

export const FOOTER_SERVICES = [
  { label: 'Página web', href: '/cotizacion?service=web-negocio' },
  { label: 'Landing page', href: '/cotizacion?service=landing' },
  { label: 'Tienda online', href: '/cotizacion?service=wordpress-tienda-20' },
  { label: 'Sistemas personalizados', href: '/cotizacion?service=sistema' },
] as const

export const FINAL_CTA_TRUST = [
  'Atención directa conmigo',
  'Proceso claro',
  'Soluciones personalizadas',
] as const

export const CONTACT_EMAIL = 'info@nixonlopez.com' as const

export type { ArchiveProject, CaseStudy, FeaturedProject } from '@/lib/case-studies'
export {
  FEATURED_CASE_STUDIES,
  FEATURED_PROJECTS,
  MORE_PROJECTS,
  PROJECT_LIVE_URLS,
  PROJECT_HERO_PREVIEWS,
  PROJECT_STATIC_PREVIEWS,
  getFeaturedCaseStudy,
  projectImageUrl,
  projectLivePreview,
  isLivePreviewImage,
} from '@/lib/case-studies'

export const VERIFIED_TESTIMONIALS = [
  {
    name: 'Sara Carryhau',
    company: 'Centro de estética',
    initials: 'SC',
    avatarColor: 'purple' as const,
    content:
      'Desde que tengo mi página recibo más consultas. La integración con WhatsApp funciona perfecto y mis clientas me dicen que se ve muy profesional.',
    highlights: ['más consultas', 'muy profesional'],
  },
  {
    name: 'Carmen González',
    company: 'Estilista profesional',
    initials: 'CG',
    avatarColor: 'blue' as const,
    content:
      'Mi landing page superó lo que esperaba. Se ve increíble y ha impulsado las ventas de mi masterclass de verdad.',
    highlights: ['superó lo que esperaba', 'ventas de mi masterclass'],
  },
  {
    name: 'Carlos Herrera',
    company: 'Formación en programación',
    initials: 'CH',
    avatarColor: 'green' as const,
    content:
      'Mis estudiantes acceden a los cursos sin problemas desde el celular. La plataforma es rápida y fácil de usar.',
    highlights: ['rápida y fácil de usar', 'sin problemas'],
  },
] as const
