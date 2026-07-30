const CLOUDINARY = 'https://res.cloudinary.com/dewe5s4xv/image/upload/f_auto,q_auto,w_1200'

/** Mockups flotantes del hero masterclass (tarjetas alrededor del perfil) */
export const MASTERCLASS_HERO_FLOATS = [
  '/images/projects/hero_image1.webp',
  '/images/projects/hero_image2.webp',
  '/images/projects/hero_image3.webp',
  '/images/projects/hero_image4.webp',
] as const

/** Capturas reales optimizadas (WebP) — carrusel y casos de éxito */
export const PROJECT_HERO_PREVIEWS = {
  aquarumbos: '/images/projects/aquarumbos_preview.webp',
  aserta: '/images/projects/aserta_preview.webp',
  sara: '/images/projects/sara_preview.webp',
  spl: '/images/projects/spl_preview.webp',
  nutrielys: '/images/projects/hero_image3.webp',
} as const

/** @deprecated Usar PROJECT_HERO_PREVIEWS */
export const PROJECT_STATIC_PREVIEWS = {
  aserta: PROJECT_HERO_PREVIEWS.aserta,
  sara: PROJECT_HERO_PREVIEWS.sara,
} as const

/** Captura en vivo del sitio publicado (preview real vía thum.io). */
export function projectLivePreview(demoUrl: string, opts?: { wait?: number; crop?: number }) {
  const wait = opts?.wait ? `/wait/${opts.wait}` : ''
  const crop = opts?.crop ? `/crop/${opts.crop}` : '/crop/800'
  return `https://image.thum.io/get/width/1200/png/noanimate${crop}${wait}/${demoUrl}`
}

/** Convierte URL de preview en prefetch (encola captura completa en thum.io) */
export function toLivePreviewPrefetchUrl(thumPreviewUrl: string) {
  return thumPreviewUrl.replace('/get/', '/get/prefetch/')
}

export function projectCloudinaryImage(path: string) {
  return `${CLOUDINARY}/${path}`
}

/** Imagen Cloudinary o captura del sitio en vivo cuando no hay mockup subido. */
export function projectImageUrl(demoUrl: string, cloudinaryPath?: string, preferLive = false) {
  if (!preferLive && cloudinaryPath) return `${CLOUDINARY}/${cloudinaryPath}`
  return projectLivePreview(demoUrl)
}

/** URLs canónicas de proyectos destacados */
export const PROJECT_LIVE_URLS = {
  aquarumbos: 'https://www.aquarumbos.com',
  aserta: 'https://www.asertasa.com',
  sara: 'https://www.saracarryhau.com',
  spl: 'https://www.splbusiness.com',
  nutrielys: 'https://www.nutrielys.com',
} as const

export type CaseStudy = {
  slug: string
  company: string
  industry: string
  positioning?: string
  problem: string
  solution: string
  result: string
  technologies: string[]
  demoUrl: string
  image: string
  ctaLabel: string
  /** Servicio preseleccionado en el cotizador */
  quoteServiceId?: string
  /** Si true, el CTA principal abre WhatsApp en lugar del cotizador */
  ctaWhatsApp?: boolean
}

export type ArchiveProject = {
  slug: string
  company: string
  category: string
  summary: string
  demoUrl?: string
  image?: string
}

export type FeaturedProject = {
  slug: string
  company: string
  category: string
  categoryTone: 'blue' | 'green' | 'purple' | 'orange' | 'pink'
  description: string
  demoUrl: string
  image: string
}

/** Home — galería premium de proyectos destacados (5 items, orden fijo) */
export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    slug: 'sara',
    company: 'Sara Carryhau',
    category: 'Marca profesional',
    categoryTone: 'blue',
    description: 'Web enfocada en transmitir confianza y captar nuevos clientes.',
    demoUrl: PROJECT_LIVE_URLS.sara,
    image: PROJECT_HERO_PREVIEWS.sara,
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
    slug: 'santa-catalina-vip',
    company: 'Santa Catalina VIP Transportation',
    category: 'Turismo y transporte',
    categoryTone: 'orange',
    description: 'Presencia digital profesional para captar turistas y aumentar reservas.',
    demoUrl: 'https://santacatalinaviptransportation.com',
    image: projectLivePreview('https://santacatalinaviptransportation.com', { wait: 6 }),
  },
  {
    slug: 'cositas-lindas',
    company: 'Cositas Lindas PTY',
    category: 'Marketplace',
    categoryTone: 'pink',
    description: 'Experiencia ecommerce para conectar productos con clientes.',
    demoUrl: 'https://tienda.cosas-lindas.com',
    image: projectLivePreview('https://tienda.cosas-lindas.com', { wait: 5 }),
  },
]

/** Home — casos de éxito con copy extendido (página /proyectos y referencias) */
export const FEATURED_CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'aquarumbos',
    company: 'Aquarumbos',
    industry: 'Plataforma educativa digital',
    positioning: 'Solución digital completa para capacitación y ventas online',
    problem:
      'La marca necesitaba una plataforma profesional para promocionar capacitaciones y gestionar ventas online.',
    solution:
      'Plataforma web moderna con experiencia optimizada para usuarios, integración de pagos con Hotmart y estructura preparada para crecer.',
    result: 'Una plataforma digital profesional para captar alumnos y comercializar capacitaciones.',
    technologies: ['Next.js', 'React', 'TypeScript', 'WordPress Headless', 'Hotmart'],
    demoUrl: PROJECT_LIVE_URLS.aquarumbos,
    image: PROJECT_HERO_PREVIEWS.aquarumbos,
    ctaLabel: 'Quiero un proyecto similar',
    quoteServiceId: 'reservas',
  },
  {
    slug: 'aserta',
    company: 'Aserta S.A.',
    industry: 'Sistema web empresarial',
    positioning: 'Soluciones personalizadas para empresas, no solo páginas web',
    problem: 'La empresa necesitaba digitalizar un proceso y facilitar la interacción de sus usuarios.',
    solution:
      'Herramienta web personalizada con automatización y una experiencia simplificada para el equipo y sus clientes.',
    result: 'Un sistema digital que mejora procesos y facilita la gestión.',
    technologies: ['Next.js', 'React', 'Supabase', 'Automatización'],
    demoUrl: PROJECT_LIVE_URLS.aserta,
    image: PROJECT_HERO_PREVIEWS.aserta,
    ctaLabel: 'Necesito una solución para mi empresa',
    quoteServiceId: 'reservas',
    ctaWhatsApp: true,
  },
  {
    slug: 'sara',
    company: 'Sara Carryhau',
    industry: 'Página web profesional / Marca personal',
    positioning: 'El perfil de cliente más común: profesionales y emprendedores',
    problem: 'Necesitaba una presencia digital profesional para mostrar sus servicios y generar confianza.',
    solution:
      'Diseño y desarrollo de página web moderna enfocada en imagen profesional y captación de clientes.',
    result: 'Una presencia digital preparada para conectar con nuevos clientes.',
    technologies: ['Next.js', 'Diseño responsive', 'SEO'],
    demoUrl: PROJECT_LIVE_URLS.sara,
    image: PROJECT_HERO_PREVIEWS.sara,
    ctaLabel: 'Quiero mi página profesional',
    quoteServiceId: 'web-negocio',
  },
  {
    slug: 'spl-business',
    company: 'SPL Business',
    industry: 'Sitio web corporativo',
    positioning: 'Experiencia creando sitios para empresas y servicios profesionales',
    problem: 'La marca necesitaba comunicar sus servicios y fortalecer su presencia digital.',
    solution: 'Sitio corporativo moderno enfocado en confianza y conversión.',
    result: 'Una plataforma digital profesional para presentar servicios.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    demoUrl: PROJECT_LIVE_URLS.spl,
    image: PROJECT_HERO_PREVIEWS.spl,
    ctaLabel: 'Crear mi sitio empresarial',
    quoteServiceId: 'web-negocio',
  },
  {
    slug: 'nutrielys',
    company: 'Nutrielys',
    industry: 'Salud y bienestar',
    positioning: 'Webs profesionales para negocios de servicios en salud',
    problem: 'Necesitaba una plataforma digital para presentar servicios y conectar con clientes.',
    solution: 'Diseño web profesional adaptado al sector de bienestar.',
    result: 'Mayor presencia digital y una experiencia profesional para sus usuarios.',
    technologies: ['Next.js', 'Diseño responsive', 'SEO'],
    demoUrl: PROJECT_LIVE_URLS.nutrielys,
    image: PROJECT_HERO_PREVIEWS.nutrielys,
    ctaLabel: 'Quiero una web para mi negocio',
    quoteServiceId: 'web-negocio',
  },
]

/** Página /proyectos — portafolio extendido sin competir con casos de éxito del Home */
export const MORE_PROJECTS: ArchiveProject[] = [
  {
    slug: 'cositas-lindas',
    company: 'Cositas Lindas PTY',
    category: 'Tienda online',
    summary: 'E-commerce para retail de manualidades y scrapbook con catálogo y checkout online.',
    demoUrl: 'https://tienda.cosas-lindas.com',
    image: projectLivePreview('https://tienda.cosas-lindas.com'),
  },
  {
    slug: 'apradap',
    company: 'Apradap',
    category: 'Sitio institucional',
    summary: 'Presencia digital para organización profesional con información clara y accesible.',
    demoUrl: 'https://www.apradappanama.org',
    image: projectLivePreview('https://www.apradappanama.org'),
  },
  {
    slug: 'quantico',
    company: 'Quantico Global Systems',
    category: 'Web corporativa B2B',
    summary: 'Sitio corporativo para servicios internacionales con propuesta de valor clara.',
    demoUrl: 'https://www.quanticoglobalsystems.com',
    image: projectLivePreview('https://www.quanticoglobalsystems.com'),
  },
  {
    slug: 'santa-catalina',
    company: 'Santa Catalina',
    category: 'Marketing / Ads',
    summary: 'Estrategia y campañas digitales para aumentar visibilidad y captación de clientes.',
  },
  {
    slug: 'vipal',
    company: 'VIPAL Glass Panama',
    category: 'Catálogo comercial',
    summary: 'Web con catálogo visual y canal de contacto para consultas comerciales.',
    demoUrl: 'https://www.vipalglasspanama.com',
    image: projectLivePreview('https://www.vipalglasspanama.com'),
  },
  {
    slug: 'masterclass',
    company: 'Carmen González Estilista',
    category: 'Landing de venta',
    summary: 'Página comercial para promocionar y vender formación online.',
    demoUrl: 'https://www.carmengestilista/masterclass',
    image: projectLivePreview('https://www.carmengestilista/masterclass'),
  },
  {
    slug: 'fotosonido',
    company: 'Foto Sonido',
    category: 'Página web profesional',
    summary: 'Sitio para negocio de servicios con presencia digital moderna.',
    demoUrl: 'https://fotosonidopty.vercel.app',
    image: projectLivePreview('https://fotosonidopty.vercel.app'),
  },
  {
    slug: 'marbi',
    company: 'Marbi Silva',
    category: 'Marca personal',
    summary: 'Web profesional para consultora con enfoque en confianza y contacto directo.',
    demoUrl: 'https://marbisilva.vercel.app',
    image: projectLivePreview('https://marbisilva.vercel.app'),
  },
]

export function isLivePreviewImage(src: string) {
  return src.includes('image.thum.io') || src.includes('mshots/v1')
}

export function getFeaturedCaseStudy(slug: string) {
  return FEATURED_CASE_STUDIES.find((item) => item.slug === slug)
}
