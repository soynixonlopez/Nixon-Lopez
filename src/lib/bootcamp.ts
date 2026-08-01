/**
 * Configuración central del Bootcamp — edita copy, precio, urgencia y Hotmart aquí.
 */
export const BOOTCAMP_HOTMART_URL = 'https://pay.hotmart.com/E106976063A?off=nu69zfg0'

export const BOOTCAMP_META = {
  title: 'Bootcamp: Webs Profesionales con IA en 6 Semanas',
  description:
    'Aprende a crear y vender páginas web con IA. Precio fundador $79 — luego $99 — regular $149.',
  keywords: [
    'bootcamp desarrollo web',
    'crear páginas web con IA',
    'curso Cursor ChatGPT',
    'Next.js bootcamp',
    'freelance desarrollo web',
    'Nixon López',
  ] as const,
} as const

export const BOOTCAMP_PRICING = {
  /** Precio activo mostrado en toda la landing */
  price: 79,
  founderPrice: 79,
  launchPrice: 99,
  regularPrice: 149,
  currency: 'USD',
  priceLabel: '$79',
  founderLabel: '$79',
  launchLabel: '$99',
  regularLabel: '$149',
  founderBadge: 'Precio fundador',
  founderNote: 'Precio actual — exclusivo asistentes a la masterclass',
  launchBadge: 'Precio de lanzamiento',
  launchNote: 'Sube a $99 cuando termine el precio fundador',
  regularNote: 'Precio regular $149',
  progressionNote: 'Luego $99 · Regular $149',
  ctaLabel: 'Reservar mi cupo — $79',
  ctaShortLabel: 'Reservar — $79',
  ctaEnrollLabel: 'Quiero inscribirme — $79',
  perPersonNote: 'Por persona',
  installments: 'Cuotas con Hotmart',
  duration: '6 semanas',
} as const

export const BOOTCAMP_URGENCY = {
  totalSpots: 25,
  spotsTaken: 17,
  enrollmentDeadlineIso: '2026-08-15T23:59:59-05:00',
  spotsLabel: 'Cupos limitados',
} as const

export const BOOTCAMP_HERO = {
  badge: 'Precio fundador $79 · 6 semanas en vivo',
  title: 'Crea Webs Profesionales con IA y Consigue tus Primeros Clientes',
  titleAccent: 'en 6 Semanas',
  subtitle: 'ChatGPT, Cursor y Claude como copiloto — publica proyectos reales aunque empieces desde cero.',
  primaryCta: 'Reservar mi cupo — $79',
  secondaryCta: 'Ver programa',
  urgency: 'Luego sube a $99 · Precio regular $149',
} as const

export const BOOTCAMP_TRUST_ITEMS = [
  'Clases en vivo',
  'Grabaciones',
  'Comunidad VIP',
  'Certificado',
  'Proyectos reales',
  'Soporte directo',
] as const

export const BOOTCAMP_AUDIENCE = [
  { emoji: '🎓', title: 'Estudiantes', hook: 'Portafolio real antes de graduarte' },
  { emoji: '🚀', title: 'Emprendedores', hook: 'Tu web sin depender de nadie' },
  { emoji: '💼', title: 'Freelancers', hook: 'Cobra por landings con IA' },
  { emoji: '🎨', title: 'Diseñadores', hook: 'De Figma a producción' },
  { emoji: '✨', title: 'Principiantes', hook: 'Método paso a paso' },
  { emoji: '💰', title: 'Monetizadores', hook: 'Clientes + ingresos con IA' },
] as const

export const BOOTCAMP_PROBLEM_CARDS = [
  {
    emoji: '⏳',
    title: 'Antes: años de estudio',
    line: 'Hoy la IA acelera todo — si sabes el método.',
  },
  {
    emoji: '🤖',
    title: 'IA sin rumbo = tiempo perdido',
    line: 'Necesitas un sistema, no más tutoriales sueltos.',
  },
  {
    emoji: '🎯',
    title: 'El bootcamp te da el mapa',
    line: 'De la idea al cliente pagando — en 6 semanas.',
  },
] as const

export const BOOTCAMP_OUTCOMES = [
  'Landings que convierten',
  'Sitios web completos',
  'Publicados en Vercel',
  'Portafolio que vende',
  'IA en cada fase',
  'Primeros clientes',
  'Cobrar por proyectos',
] as const

export const BOOTCAMP_CURRICULUM = [
  { week: 1, title: 'IA + herramientas', tags: ['ChatGPT', 'Cursor', 'Claude', 'Lovable'] },
  { week: 2, title: 'Landing Pages', tags: ['Responsive', 'SEO', 'Formularios'] },
  { week: 3, title: 'Sitios profesionales', tags: ['Arquitectura', 'WhatsApp', 'Navegación'] },
  { week: 4, title: 'IA avanzada', tags: ['APIs', 'Automatización', 'Optimización'] },
  { week: 5, title: 'Conseguir clientes', tags: ['Prospectar', 'Cotizar', 'Cerrar'] },
  { week: 6, title: 'Lanzamiento', tags: ['GitHub', 'Vercel', 'Portafolio final'] },
] as const

export const BOOTCAMP_BONUSES = [
  '📐 Plantillas',
  '✨ Prompts pro',
  '📦 Recursos',
  '💬 Comunidad',
  '🎬 Grabaciones',
  '🏆 Certificado',
  '🔄 Actualizaciones',
  '📥 Material extra',
] as const

export const BOOTCAMP_INSTRUCTOR = {
  name: 'Nixon López',
  role: 'Frontend Dev · Especialista IA · Mentor',
  bio: 'Creo webs y plataformas reales con React, Next.js e IA. Te enseño el mismo flujo que uso con clientes hoy.',
  tech: ['React', 'Next.js', 'Cursor', 'Vercel', 'IA'] as const,
  social: [
    { label: 'Instagram', handle: '@nixonlopes.dev', href: 'https://www.instagram.com/nixonlopes.dev/' },
    { label: 'LinkedIn', handle: 'in/nixonlopez', href: 'https://www.linkedin.com/in/nixonlopez' },
    { label: 'GitHub', handle: 'soynixonlopez', href: 'https://github.com/soynixonlopez' },
  ] as const,
} as const

export const BOOTCAMP_TESTIMONIALS = [
  {
    name: 'Elta Cecilia Ávila',
    company: 'Aserta S.A.',
    quote:
      'Nixon desarrolló una solución digital a medida que simplificó nuestros procesos. Profesional, claro en cada etapa y con resultados que nuestro equipo usa todos los días.',
    image: '/images/projects/aserta_preview.webp',
    imageWidth: 1200,
    imageHeight: 582,
  },
  {
    name: 'María Alejandra Rumbos',
    company: 'Aquarumbos',
    quote:
      'La plataforma quedó moderna y lista para captar alumnos y vender capacitaciones. Entendió la visión del negocio y la llevó a un nivel que transmite total confianza.',
    image: '/images/projects/aquarumbos_preview.webp',
    imageWidth: 1200,
    imageHeight: 585,
  },
  {
    name: 'Apradap',
    company: 'Asociación Panameña de la Preservación de la Rana Dorada',
    quote:
      'Nuestra web comunica la misión de la asociación con claridad y seriedad. Un trabajo impecable que refleja el compromiso de nuestra organización.',
    image:
      'https://res.cloudinary.com/dewe5s4xv/image/upload/v1775828409/website-apradap_ax2agz.png',
    imageWidth: 1200,
    imageHeight: 675,
  },
] as const

/** Soporte e inscripción con métodos alternativos de pago */
export const BOOTCAMP_SUPPORT = {
  email: 'info@nixonlopez.com',
  whatsappMessage:
    'Hola Nixon, quiero inscribirme al Bootcamp. Necesito pagar por Yappy o transferencia bancaria. ¿Me indicas los pasos?',
  whatsappYappyMessage:
    'Hola Nixon, quiero inscribirme al Bootcamp y pagar por Yappy. ¿Me confirmas el monto y los pasos para enviarte el comprobante?',
  whatsappTransferMessage:
    'Hola Nixon, quiero inscribirme al Bootcamp y pagar por transferencia bancaria. ¿Me confirmas el monto y los datos para enviarte el comprobante?',
} as const

export const BOOTCAMP_PAYMENT = {
  cardTitle: 'Tarjeta o débito',
  cardDescription: 'Pago seguro en Hotmart · acceso inmediato al confirmar.',
  altTitle: '¿No puedes pagar con tarjeta?',
  altDescription:
    'Escríbenos a soporte y te ayudamos a inscribirte con Yappy o transferencia bancaria. Envía tu comprobante y activamos tu acceso.',
  yappyName: 'NixonLopez',
  yappyPhone: '6324-8854',
  bankName: 'Banco General',
  bankAccountType: 'Cuenta de ahorro',
  bankHolder: 'Nixon Jill Lopez Hernandez',
  bankAccountNumber: '04-16-98-240572-1',
  steps: [
    'Escríbenos por WhatsApp o correo indicando que quieres inscribirte al Bootcamp.',
    `Realiza el pago por Yappy o transferencia al monto vigente (${BOOTCAMP_PRICING.priceLabel} precio fundador).`,
    'Envía captura del comprobante con tu nombre completo y correo.',
    'Te confirmamos y te damos acceso al Bootcamp (Hotmart + comunidad).',
  ],
} as const

export const BOOTCAMP_FAQ = [
  { q: '¿Necesito saber programar?', a: 'No. IA + método guiado. Partes desde cero.' },
  { q: '¿Qué pasa si no puedo en vivo?', a: 'Todo queda grabado en Hotmart + comunidad WhatsApp.' },
  { q: '¿Hay certificado?', a: 'Sí, digital al completar las 6 semanas.' },
  { q: '¿Cuánto dura?', a: '6 semanas · clases en vivo + proyectos semanales.' },
  { q: '¿Qué necesito?', a: 'PC, internet y Cursor/ChatGPT. Te guiamos en el setup.' },
  { q: '¿Cómo accedo tras pagar?', a: 'Con tarjeta en Hotmart: acceso inmediato. Con Yappy/transferencia: te activamos al confirmar tu comprobante.' },
  {
    q: '¿Hay precio especial si fui a la masterclass?',
    a: `Sí. Ahora el precio fundador es ${BOOTCAMP_PRICING.founderLabel}. Luego sube a ${BOOTCAMP_PRICING.launchLabel} y el precio regular es ${BOOTCAMP_PRICING.regularLabel}.`,
  },
  {
    q: '¿Puedo pagar sin tarjeta?',
    a: `Sí. Contáctanos por WhatsApp o ${BOOTCAMP_SUPPORT.email} para pagar con Yappy o transferencia bancaria. Te guiamos paso a paso y activamos tu acceso al confirmar el pago.`,
  },
] as const

export const BOOTCAMP_OFFER_INCLUDES = [
  '6 semanas en vivo',
  'Grabaciones de por vida',
  'Comunidad WhatsApp',
  'Certificado',
  'Plantillas + prompts',
  'Proyecto final publicado',
] as const

export const BOOTCAMP_FOOTER = {
  email: 'info@nixonlopez.com',
  website: 'https://www.nixonlopez.com',
  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/nixonlopes.dev/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/nixonlopez' },
    { label: 'GitHub', href: 'https://github.com/soynixonlopez' },
  ] as const,
} as const
