'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import {
  ExternalLink,
  Github,
  Eye,
  Sparkles,
  Globe,
  Bot,
  Zap,
  GraduationCap,
  Building,
  X,
  Calendar,
  Users,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Play
} from 'lucide-react'

const ProjectsSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [selectedProject, setSelectedProject] = useState<any>(null)
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
    quantico: 'https://www.quanticoglobalsystem.com',
  }

  const projectImageFiles = [
    { slug: 'fotosonido', title: 'Foto Sonido', image: '/proyectos-img/website-fotosonido.png', icon: Globe },
    { slug: 'alquilereventos', title: 'Alquiler de Eventos', image: '/proyectos-img/website-alquilereventos.png', icon: Zap },
    { slug: 'sara', title: 'Sara Carryhau', image: '/proyectos-img/website-Sara.png', icon: Globe },
    { slug: 'marbi', title: 'Marbi', image: '/proyectos-img/website-marbi.png', icon: Globe },
    { slug: 'nutrielys', title: 'Nutrielys', image: '/proyectos-img/website-nutrielys.png', icon: Globe },
    { slug: 'obip', title: 'OBIP', image: '/proyectos-img/website-obip.png', icon: Users },
    { slug: 'python', title: 'Python', image: '/proyectos-img/website-python.png', icon: GraduationCap },
    { slug: 'realtors', title: 'Realtors', image: '/proyectos-img/website-realtors.png', icon: Building },
    { slug: 'nixontours', title: 'Nixon Tours', image: '/proyectos-img/website-nixontours.png', icon: Globe },
    { slug: 'yurna', title: 'Yurna', image: '/proyectos-img/website-yurna.png', icon: Globe },
    { slug: 'tobykids', title: 'Toby Kids', image: '/proyectos-img/website-tobykids.png', icon: Globe },
    { slug: 'vipal', title: 'VIPAL', image: '/proyectos-img/website-vipal.png', icon: Globe },
    { slug: 'quantico', title: 'Quantico', image: '/proyectos-img/website-quantico.png', icon: Bot },
  ] as const

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
      year: '2024',
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

  const openProjectDetails = (project: any) => {
    setSelectedProject(project)
  }

  const closeProjectDetails = () => {
    setSelectedProject(null)
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
    <section id="projects" className="py-20 bg-white dark:bg-slate-900" ref={ref}>
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
          {/* Navigation Buttons */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
            <motion.button
              onClick={prevSlide}
              className="w-12 h-12 bg-white dark:bg-slate-800 shadow-xl rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-gray-600 transition-all duration-300"
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
          </div>

          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
            <motion.button
              onClick={nextSlide}
              className="w-12 h-12 bg-white dark:bg-slate-800 shadow-xl rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-gray-600 transition-all duration-300"
              whileHover={{ scale: 1.1, x: 2 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>

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
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="relative z-0 block w-full h-auto max-h-[min(75vh,720px)] object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]"
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

                      {/* Click Area para abrir modal */}
                      <div 
                        className="absolute inset-0 cursor-pointer z-10"
                        onClick={(e) => {
                          // Only open modal if not dragging
                          if (!isDragging && Math.abs(dragOffset) < 10) {
                            openProjectDetails(project)
                          }
                        }}
                      />
                    </motion.div>
                  )
                })}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Dots Indicator */}
          <motion.div
            className="flex justify-center mt-8 gap-2"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {Array.from({ length: totalSlides }).map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-indigo-500 scale-125'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
              />
            ))}
          </motion.div>

          {/* Slide Counter */}
          <motion.div
            className="text-center mt-4"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {currentIndex + 1} de {totalSlides} páginas
            </span>
          </motion.div>
        </div>


      </div>

      {/* Enhanced Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeProjectDetails}
          >
            <motion.div
              className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeProjectDetails}
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-700 transition-colors duration-300 shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header con imagen - cubriendo todo el espacio superior */}
              <div className="relative h-96 overflow-hidden bg-gray-100 dark:bg-slate-700">
                {/* Imagen de fondo - se ve completa sin recortar */}
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.title}
                  className="w-full h-full object-contain object-center"
                />
                {/* Overlay con gradiente elegante */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
                
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                  <motion.div
                    className="w-20 h-20 mx-auto mb-4 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-xl"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
                  >
                    <selectedProject.icon className="w-10 h-10 text-white" />
                  </motion.div>
                  <motion.h2
                    className="text-3xl md:text-4xl font-bold mb-4 text-center drop-shadow-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    {selectedProject.title}
                  </motion.h2>
                  <motion.div
                    className="flex items-center justify-center gap-4 text-sm opacity-90 flex-wrap"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                      <Users className="w-4 h-4" />
                      {selectedProject.client}
                    </div>
                    <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                      <Calendar className="w-4 h-4" />
                      {selectedProject.duration}
                    </div>
                    <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                      <TrendingUp className="w-4 h-4" />
                      {selectedProject.year}
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="p-8">
                {/* Description */}
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                    {selectedProject.longDescription}
                  </p>
                </motion.div>

                {/* Metrics */}
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Resultados Medibles
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(selectedProject.metrics).map(([key, value]: [string, any], index) => (
                      <motion.div
                        key={key}
                        className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800 rounded-xl"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                      >
                        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                          {value}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Features */}
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Características Principales
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {selectedProject.features.map((feature: any, index: number) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.05, duration: 0.3 }}
                      >
                        <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  className="flex gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <motion.a
                    href={selectedProject.links.demo}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold text-center hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Play className="w-5 h-5" />
                    Ver Demo en Vivo
                  </motion.a>
                  <motion.a
                    href={selectedProject.links.github}
                    className="px-6 py-4 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-300 flex items-center gap-2"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Github className="w-5 h-5" />
                    Código
                  </motion.a>
                  <motion.a
                    href={selectedProject.links.case}
                    className="px-6 py-4 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-300 flex items-center gap-2"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ExternalLink className="w-5 h-5" />
                    Caso de Estudio
                  </motion.a>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default ProjectsSection