'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import {
  Eye,
  Sparkles,
  Globe,
  Bot,
  Zap,
  GraduationCap,
  Building,
  Calendar,
  Users,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import Image from 'next/image'

const ProjectsSection = () => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

  const getCloudinaryProjectImage = (opts: { localSrc: string; publicId?: string }) => {
    const { localSrc, publicId } = opts
    if (!cloudName) return localSrc

    if (publicId) {
      const encodedPublicId = publicId
        .split('/')
        .map((part) => encodeURIComponent(part))
        .join('/')

      return `https://res.cloudinary.com/${encodeURIComponent(cloudName)}/image/upload/f_auto,q_auto/${encodedPublicId}`
    }

    if (!localSrc.startsWith('/')) return localSrc

    const filename = localSrc.split('/').pop() || ''
    if (!filename) return localSrc

    // Cloudinary public_id typically omits the extension
    const publicIdName = filename.replace(/\.[^.]+$/, '')
    const derivedPublicId = `nlservices/${publicIdName}`

    const encodedPublicId = derivedPublicId
      .split('/')
      .map((part) => encodeURIComponent(part))
      .join('/')

    return `https://res.cloudinary.com/${encodeURIComponent(cloudName)}/image/upload/f_auto,q_auto/${encodedPublicId}`
  }

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)

  /** Enlaces reales de cada proyecto (demo / sitio en vivo) */
  const projectDemoUrls: Record<string, string> = {
    sara: 'https://www.saracarryhau.com',
    fotosonido: 'https://fotosonidopty.vercel.app',
    alquilereventos: 'https://alquilerdeeventos.vercel.app',
    marbi: 'https://marbisilva.vercel.app',
    nutrielys: 'https://www.nutrielys.com',
    obip: 'https://obip.vercel.app',
    python: 'https://pythonlearn.vercel.app',
    realtors: 'https://premierrealtor.vercel.app',
    nixontours: 'https://nixontours.vercel.app',
    yurna: 'https://www.yurnafinance.com',
    tobykids: 'https://tobykids.vercel.app',
    vipal: 'https://www.vipalglasspanama.com',
    quantico: 'https://www.quanticoglobalsystems.com',
    'erp-website': 'https://erpsa.vercel.app',
    masterclass: 'https://www.carmengestilista/masterclass',
    apradap: 'https://www.apradappanama.org',
  }

  /** Orden: más recientes primero (2026 → 2023). Años repartidos entre 2023 y 2026. */
  type ProjectImageFile = {
    slug: string
    title: string
    image: string
    icon: any
    year: string
    cloudinaryUrl?: string
    cloudinaryPublicId?: string
  }

  const projectImageFiles: ProjectImageFile[] = [
    {
      slug: 'sara',
      title: 'Sara Carryhau',
      image: '/proyectos-img/website-Sara.png',
      cloudinaryUrl:
        'https://res.cloudinary.com/dewe5s4xv/image/upload/v1775828409/website-Sara_lgoqij.png',
      icon: Globe,
      year: '2026',
    },
    {
      slug: 'quantico',
      title: 'Quantico',
      image: '/proyectos-img/website-quantico.png',
      cloudinaryUrl:
        'https://res.cloudinary.com/dewe5s4xv/image/upload/v1775828408/website-quantico_ivthee.png',
      icon: Bot,
      year: '2026',
    },
    {
      slug: 'fotosonido',
      title: 'Foto Sonido',
      image: '/proyectos-img/website-fotosonido.png',
      cloudinaryUrl:
        'https://res.cloudinary.com/dewe5s4xv/image/upload/v1775828410/website-fotosonido_vxiizv.png',
      icon: Globe,
      year: '2026',
    },
    {
      slug: 'erp-website',
      title: 'EPR Website',
      image: '/proyectos-img/website-erp.png',
      cloudinaryUrl:
        'https://res.cloudinary.com/dewe5s4xv/image/upload/v1775828409/website-erp_g6jz1u.png',
      icon: Globe,
      year: '2026',
    },
    {
      slug: 'masterclass',
      title: 'Landing Page de Carmen Gonzalez Estilista',
      image: '/images/website-masterclass.png',
      cloudinaryUrl:
        'https://res.cloudinary.com/dewe5s4xv/image/upload/v1775828411/website-masterclass_iv1ix5.png',
      icon: Globe,
      year: '2026',
    },
    {
      slug: 'apradap',
      title: 'APRADAP',
      image: '/images/website-apradap.png',
      cloudinaryUrl:
        'https://res.cloudinary.com/dewe5s4xv/image/upload/v1775828409/website-apradap_ax2agz.png',
      icon: Globe,
      year: '2026',
    },
    {
      slug: 'vipal',
      title: 'VIPAL',
      image: '/proyectos-img/website-vipal.png',
      cloudinaryUrl:
        'https://res.cloudinary.com/dewe5s4xv/image/upload/v1775828409/website-vipal_sh26tk.png',
      icon: Globe,
      year: '2026',
    },
    {
      slug: 'nutrielys',
      title: 'Nutrielys',
      image: '/proyectos-img/website-nutrielys.png',
      cloudinaryUrl:
        'https://res.cloudinary.com/dewe5s4xv/image/upload/v1775828411/website-nutrielys_ttwwxx.png',
      icon: Globe,
      year: '2026',
    },
    {
      slug: 'marbi',
      title: 'Marbi',
      image: '/proyectos-img/website-marbi.png',
      cloudinaryUrl:
        'https://res.cloudinary.com/dewe5s4xv/image/upload/v1775828410/website-marbi_zhrtb2.png',
      icon: Globe,
      year: '2025',
    },
    {
      slug: 'yurna',
      title: 'Yurna',
      image: '/proyectos-img/website-yurna.png',
      cloudinaryUrl:
        'https://res.cloudinary.com/dewe5s4xv/image/upload/v1775828409/website-yurna_vl6thk.png',
      icon: Globe,
      year: '2025',
    },
    {
      slug: 'alquilereventos',
      title: 'Alquiler de Eventos',
      image: '/proyectos-img/website-alquilereventos.png',
      cloudinaryUrl:
        'https://res.cloudinary.com/dewe5s4xv/image/upload/v1775828410/website-alquilereventos_mmf90l.png',
      icon: Zap,
      year: '2025',
    },
    {
      slug: 'nixontours',
      title: 'Nixon Tours',
      image: '/proyectos-img/website-nixontours.png',
      cloudinaryUrl:
        'https://res.cloudinary.com/dewe5s4xv/image/upload/v1775828411/website-nixontours_ob7wp2.png',
      icon: Globe,
      year: '2025',
    },
    {
      slug: 'obip',
      title: 'OBIP',
      image: '/proyectos-img/website-obip.png',
      cloudinaryUrl:
        'https://res.cloudinary.com/dewe5s4xv/image/upload/v1775828408/website-obip_kgji7w.png',
      icon: Users,
      year: '2024',
    },
    {
      slug: 'tobykids',
      title: 'Toby Kids',
      image: '/proyectos-img/website-tobykids.png',
      cloudinaryUrl:
        'https://res.cloudinary.com/dewe5s4xv/image/upload/v1775828409/website-tobykids_qinotp.png',
      icon: Globe,
      year: '2024',
    },
    {
      slug: 'python',
      title: 'Python',
      image: '/proyectos-img/website-python.png',
      cloudinaryUrl:
        'https://res.cloudinary.com/dewe5s4xv/image/upload/v1775828408/website-python_tmd4my.png',
      icon: GraduationCap,
      year: '2024',
    },
    {
      slug: 'realtors',
      title: 'Realtors',
      image: '/proyectos-img/website-realtors.png',
      cloudinaryUrl:
        'https://res.cloudinary.com/dewe5s4xv/image/upload/v1775828408/website-realtors_xihnef.png',
      icon: Building,
      year: '2023',
    },
  ]

  const projects = projectImageFiles.map((p, idx) => {
    const demo =
      projectDemoUrls[p.slug] ?? `https://www.${p.slug.toLowerCase()}.com`
    return {
      id: idx + 1,
      title: p.title,
      description: `Proyecto web: ${p.title}.`,
      longDescription:
        `Proyecto ${p.title} desarrollado para una presencia digital profesional. Incluye diseño moderno, secciones clave y optimización para una excelente experiencia en móviles.`,
      image: p.image,
      cloudinaryUrl: p.cloudinaryUrl,
      cloudinaryPublicId: p.cloudinaryPublicId,
      icon: p.icon,
      gradient: 'from-indigo-500 to-purple-500',
      tags: ['Next.js', 'React', 'Tailwind'],
      allTags: ['Next.js', 'React', 'Tailwind', 'TypeScript'],
      metrics: {
        performance: '95/100',
        responsive: '100%',
        seo: 'Optimizado',
      },
      features: [
        'Diseño moderno y atractivo',
        'Optimizado para móviles',
        'Estructura clara por secciones',
        'Rendimiento mejorado',
        'Implementación profesional',
      ],
      links: {
        demo,
        github: '',
        case: '',
      },
      client: p.title,
      duration: '1 mes',
      year: p.year,
    }
  })

  // Calculate total slides (groups of 3)
  const slideSize = 3
  const totalSlides = Math.ceil(projects.length / slideSize)
  
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart(e.clientX)
    setDragOffset(0)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const currentOffset = e.clientX - dragStart
    setDragOffset(currentOffset)
  }

  const handleMouseUp = () => {
    if (!isDragging) return
    setIsDragging(false)
    
    // If dragged more than 50px, change slide
    if (Math.abs(dragOffset) > 50) {
      if (dragOffset > 0) {
        prevSlide()
      } else {
        nextSlide()
      }
    }
    
    setDragOffset(0)
  }

  // Removed auto-scroll - only manual navigation

  // Get current projects to display (3 per slide)
  const getCurrentProjects = () => {
    const startIndex = currentIndex * slideSize
    return projects.slice(startIndex, startIndex + slideSize)
  }

  return (
    <section id="projects" className="py-20 bg-white dark:bg-slate-900 overflow-x-hidden" ref={ref}>
      <div className="container-padding">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-4"
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(99, 102, 241, 0.4)',
                '0 0 0 10px rgba(99, 102, 241, 0)',
                '0 0 0 0 rgba(99, 102, 241, 0)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles size={16} />
            Proyectos Destacados
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Casos de Éxito{' '}
            <span className="gradient-text">Comprobados</span>
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explora mis proyectos más impactantes. Soluciones reales que han transformado negocios.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative max-w-7xl mx-auto">
          {/* Projects Grid */}
          <motion.div
            className="overflow-hidden px-4 cursor-grab active:cursor-grabbing select-none"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
                initial={{ opacity: 0, x: 50 }}
                animate={{ 
                  opacity: 1, 
                  x: isDragging ? dragOffset * 0.3 : 0 
                }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: isDragging ? 0 : 0.5 }}
              >
                {getCurrentProjects().map((project, index) => {
                  return (
                    <motion.div
                      key={project.id}
                      className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200 dark:border-gray-700 h-full flex flex-col"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -8 }}
                    >
                      {/* Imagen completa (sin recorte): la tarjeta se adapta al aspect ratio */}
                      <div className="relative w-full overflow-hidden rounded-t-2xl bg-slate-100 dark:bg-slate-900/80">
                    <Image
                      src={
                        project.cloudinaryUrl ??
                        getCloudinaryProjectImage({
                          localSrc: project.image,
                          publicId: project.cloudinaryPublicId,
                        })
                      }
                      alt={project.title}
                      width={1200}
                      height={675}
                      className="relative z-0 block w-full h-auto max-h-[min(75vh,720px)] object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      onError={(e) => {
                        // fallback a imagen local si la URL externa falla
                        ;(e.currentTarget as HTMLImageElement).src = project.image
                      }}
                    />
                        
                        {/* Título sobre franja inferior (no tapa toda la imagen) */}
                        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/85 via-black/40 to-transparent pt-16 pb-4 px-4">
                          <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">
                            {project.title}
                          </h3>
                        </div>

                        {/* Hover Overlay - Elegante y profesional */}
                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-6 sm:p-8 z-20">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-center mb-6 max-w-md"
                          >
                            <p className="text-white text-base leading-relaxed">
                              {project.description}
                            </p>
                          </motion.div>
                          {project.links.demo && (
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation()
                                if (!isDragging && Math.abs(dragOffset) < 10) {
                                  window.open(project.links.demo, '_blank')
                                }
                              }}
                              className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold flex items-center gap-2 transform scale-0 group-hover:scale-100 transition-transform duration-300 shadow-xl hover:shadow-2xl hover:bg-gray-50"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Eye className="w-5 h-5" />
                              Ver Proyecto
                            </motion.button>
                          )}
                        </div>
                      </div>

                      {/* Content Area - Información adicional debajo de la imagen */}
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-auto">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{project.client}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{project.year}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Controles debajo (no se superponen a las tarjetas) */}
          <motion.div
            className="mt-10 flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <div className="flex items-center justify-center gap-3">
              <motion.button
                type="button"
                onClick={prevSlide}
                className="w-11 h-11 bg-white dark:bg-slate-800 shadow-lg rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-gray-600 transition-all duration-300"
                whileHover={{ scale: 1.06, y: -1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Ver proyectos anteriores"
                title="Anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <motion.button
                    key={index}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'w-7 bg-indigo-500'
                        : 'w-2.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={`Ir a la página ${index + 1}`}
                  />
                ))}
              </div>

              <motion.button
                type="button"
                onClick={nextSlide}
                className="w-11 h-11 bg-white dark:bg-slate-800 shadow-lg rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-gray-600 transition-all duration-300"
                whileHover={{ scale: 1.06, y: -1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Ver proyectos siguientes"
                title="Siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>


      </div>
    </section>
  )
}

export default ProjectsSection