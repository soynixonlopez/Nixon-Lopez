import { PROJECT_HERO_PREVIEWS, PROJECT_LIVE_URLS, type FeaturedProject } from '@/lib/case-studies'

export type MasterclassEventConfig = {
  slug: string
  name: string
  shortName: string
  dateLabel: string
  timeLabel: string
  timezone: string
  timezoneLabel: string
  modality: string
  cost: string
  urgency: string
  whatsappCommunityUrl: string
  whatsappCommunityName: string
  googleMeetUrl: string
  googleCalendarUrl: string
  startDateIso: string
  endDateIso: string
  /** Evento que recibe registros en /masterclass */
  active?: boolean
}

export const MASTERCLASS_EVENT: MasterclassEventConfig = {
  slug: 'masterclass-ia-agosto-2026',
  name: 'Masterclass Gratuita: Aprende a crear páginas web profesionales con Inteligencia Artificial',
  shortName: 'MasterClass Aprende a Crear Web Profesionales con IA',
  dateLabel: 'Sábado 1 de agosto',
  timeLabel: '10:00 AM - 11:30 AM',
  timezone: 'America/Panama',
  timezoneLabel: 'Hora de Panamá (GMT-5)',
  modality: 'Online en vivo',
  cost: 'Acceso gratuito',
  urgency: 'Cupos limitados para participantes en vivo',
  whatsappCommunityUrl: 'https://chat.whatsapp.com/ExznHRowGGO3kHzzXuvwOi',
  whatsappCommunityName: 'MasterClass Aprende A Crear Web Profesionales con IA',
  googleMeetUrl: 'https://meet.google.com/ppi-fknh-dtu',
  googleCalendarUrl:
    'https://calendar.google.com/calendar/render?action=TEMPLATE&text=MasterClass+Aprende+a+Crear+Web+Profesionales+con+IA&dates=20260801T100000/20260801T113000&ctz=America%2FPanama&details=Enlace+de+acceso%3A+https%3A%2F%2Fmeet.google.com%2Fppi-fknh-dtu%0A%0AComunidad+WhatsApp%3A+https%3A%2F%2Fchat.whatsapp.com%2FExznHRowGGO3kHzzXuvwOi&location=https%3A%2F%2Fmeet.google.com%2Fppi-fknh-dtu',
  startDateIso: '2026-08-01T10:00:00-05:00',
  endDateIso: '2026-08-01T11:30:00-05:00',
  active: true,
}

/**
 * Lista de eventos (masterclass, bootcamps, etc.).
 * Para un evento nuevo: duplica el objeto, cambia slug/fechas/enlaces y pon `active: true`.
 * Solo un evento debe estar activo — es el que usa la landing `/masterclass`.
 */
export const MASTERCLASS_EVENTS: MasterclassEventConfig[] = [MASTERCLASS_EVENT]

export function getMasterclassEventBySlug(slug: string): MasterclassEventConfig {
  return MASTERCLASS_EVENTS.find((e) => e.slug === slug) ?? MASTERCLASS_EVENT
}

export const MASTERCLASS_REGISTRATION_STATUSES = {
  registered: 'Registrado',
  confirmed: 'Confirmado',
  attended: 'Asistió',
  cancelled: 'Cancelado',
} as const

export type MasterclassRegistrationStatus = keyof typeof MASTERCLASS_REGISTRATION_STATUSES

export const MASTERCLASS_PROBLEM_CARDS = [
  {
    emoji: '🤖',
    title: 'Crear más rápido',
    description:
      'Utiliza IA como asistente para acelerar cada etapa del desarrollo y evitar bloqueos innecesarios.',
  },
  {
    emoji: '🎨',
    title: 'Diseñar mejor',
    description:
      'Aprende a generar interfaces modernas que transmiten confianza y convierten visitantes en clientes.',
  },
  {
    emoji: '💻',
    title: 'Desarrollar proyectos reales',
    description:
      'Sal de la teoría y construye páginas funcionales con herramientas que usan desarrolladores hoy.',
  },
] as const

export const MASTERCLASS_PIPELINE = [
  { label: 'Idea', icon: '💡' },
  { label: 'Diseño', icon: '🎨' },
  { label: 'IA', icon: '🤖' },
  { label: 'Código', icon: '💻' },
  { label: 'Página profesional', icon: '🚀' },
] as const

export const MASTERCLASS_LEARNING = [
  {
    emoji: '🤖',
    title: 'Cómo utilizar IA para desarrollar páginas web',
    description: 'Flujos prácticos para idear, estructurar y construir con asistencia inteligente.',
  },
  {
    emoji: '🎨',
    title: 'Cómo crear diseños modernos que generan confianza',
    description: 'Principios visuales y layouts que elevan la percepción de tu proyecto.',
  },
  {
    emoji: '⚡',
    title: 'Herramientas utilizadas por desarrolladores modernos',
    description: 'Stack actual: React, Next.js, TypeScript, Tailwind y herramientas de IA.',
  },
  {
    emoji: '💻',
    title: 'Cómo transformar una idea en una página funcional',
    description: 'Del concepto al deploy con un proceso claro y replicable.',
  },
  {
    emoji: '🚀',
    title: 'Cómo convertir esta habilidad en oportunidades profesionales',
    description: 'Camino para monetizar tu conocimiento y ofrecer servicios digitales.',
  },
] as const

export const MASTERCLASS_LIVE_DEMO = [
  { step: 'Idea inicial', description: 'Definimos el objetivo y la estructura de la página.' },
  { step: 'Diseño', description: 'Creamos una interfaz moderna con apoyo de IA.' },
  { step: 'Código', description: 'Desarrollamos componentes reales listos para producción.' },
  { step: 'Resultado final', description: 'Ves la página funcionando en vivo durante la clase.' },
] as const

export const MASTERCLASS_AUDIENCE = [
  'Quieres aprender desarrollo web desde cero',
  'Eres emprendedor y quieres crear tus propias páginas',
  'Quieres aprender una habilidad digital rentable',
  'Quieres potenciarte usando inteligencia artificial',
  'Buscas nuevas oportunidades profesionales',
] as const

export const INSTRUCTOR_TECH = ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'AI Tools'] as const

export const INSTRUCTOR_SOCIAL = [
  {
    label: 'Instagram',
    handle: '@nixonlopes.dev',
    href: 'https://www.instagram.com/nixonlopes.dev/',
  },
  {
    label: 'LinkedIn',
    handle: 'in/nixonlopez',
    href: 'https://www.linkedin.com/in/nixonlopez',
  },
] as const

/** Proyectos de autoridad — previews locales (sin depender de thum.io) */
export const MASTERCLASS_PROJECTS: FeaturedProject[] = [
  {
    slug: 'spl-business',
    company: 'SPL Business',
    category: 'Sitio web corporativo',
    categoryTone: 'blue',
    description: 'Sitio corporativo moderno enfocado en confianza y conversión.',
    demoUrl: PROJECT_LIVE_URLS.spl,
    image: PROJECT_HERO_PREVIEWS.spl,
  },
  {
    slug: 'aquarumbos',
    company: 'Aquarumbos',
    category: 'Plataforma educativa',
    categoryTone: 'blue',
    description:
      'Plataforma moderna para capacitaciones con integración de pagos y experiencia optimizada.',
    demoUrl: PROJECT_LIVE_URLS.aquarumbos,
    image: PROJECT_HERO_PREVIEWS.aquarumbos,
  },
  {
    slug: 'aserta',
    company: 'Aserta S.A.',
    category: 'Solución empresarial',
    categoryTone: 'green',
    description: 'Herramienta digital para automatizar procesos y facilitar decisiones.',
    demoUrl: PROJECT_LIVE_URLS.aserta,
    image: PROJECT_HERO_PREVIEWS.aserta,
  },
  {
    slug: 'sara',
    company: 'Sara Carryhau',
    category: 'Marca profesional',
    categoryTone: 'purple',
    description: 'Web enfocada en transmitir confianza y captar nuevos clientes.',
    demoUrl: PROJECT_LIVE_URLS.sara,
    image: PROJECT_HERO_PREVIEWS.sara,
  },
]
