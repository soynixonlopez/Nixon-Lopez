import {
  PROJECT_HERO_PREVIEWS,
  PROJECT_LIVE_URLS,
  projectLivePreview,
  type FeaturedProject,
} from '@/lib/case-studies'

export const MASTERCLASS_EVENT = {
  slug: 'masterclass-ia-agosto-2026',
  name: 'Masterclass Gratuita: Aprende a crear páginas web profesionales con Inteligencia Artificial',
  dateLabel: 'Sábado 1 de agosto',
  timeLabel: '10:00 AM - 12:00 PM',
  modality: 'Online en vivo',
  cost: 'Acceso gratuito',
  urgency: 'Cupos limitados para participantes en vivo',
} as const

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

/** Proyectos de autoridad — formato carrusel (igual que home) */
export const MASTERCLASS_PROJECTS: FeaturedProject[] = [
  {
    slug: 'spl-business',
    company: 'SPL Business',
    category: 'Sitio web corporativo',
    categoryTone: 'blue',
    description: 'Sitio corporativo moderno enfocado en confianza y conversión.',
    demoUrl: PROJECT_LIVE_URLS.spl,
    image: projectLivePreview(PROJECT_LIVE_URLS.spl),
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
    company: 'Aserta',
    category: 'Solución empresarial',
    categoryTone: 'green',
    description: 'Herramienta digital para automatizar procesos y facilitar decisiones.',
    demoUrl: PROJECT_LIVE_URLS.aserta,
    image: PROJECT_HERO_PREVIEWS.aserta,
  },
  {
    slug: 'cositas-lindas',
    company: 'Marketplace Cositas Lindas',
    category: 'E-commerce',
    categoryTone: 'pink',
    description: 'Experiencia ecommerce para conectar productos con clientes.',
    demoUrl: 'https://tienda.cosas-lindas.com',
    image: projectLivePreview('https://tienda.cosas-lindas.com', { wait: 5 }),
  },
]
