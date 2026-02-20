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

  const projects = [
    {
      id: 1,
      title: "Sitio Web para Estética",
      description: "Sitio web profesional para centro de estética con diseño moderno y elegante que muestra servicios, galería y contacto.",
      longDescription: "Sitio web profesional desarrollado para centro de estética con diseño moderno y elegante. Incluye sección de servicios, galería de trabajos, información de contacto y formularios de reserva. Optimizado para móviles y con excelente rendimiento.",
      image: "/images/website-Sara.png",
      icon: Globe,
      gradient: "from-pink-500 to-rose-600",
      tags: ["Next.js", "Tailwind", "TypeScript"],
      allTags: ["Next.js", "Tailwind", "TypeScript", "Vercel"],
      metrics: {
        performance: "95/100",
        responsive: "100%",
        seo: "Optimizado"
      },
      features: [
        "Diseño moderno y elegante",
        "Galería de trabajos",
        "Formularios de contacto",
        "Optimizado para móviles",
        "Performance optimizada"
      ],
      links: {
        demo: "https://sara-carryhau-project.vercel.app/",
        github: "",
        case: ""
      },
      client: "Centro de Estética",
      duration: "1 mes",
      year: "2024"
    },
    {
      id: 2,
      title: "Sitio Web para Aprender a Programar",
      description: "Plataforma educativa interactiva para aprender Python desde cero con lecciones, ejercicios y código interactivo.",
      longDescription: "Plataforma educativa interactiva diseñada para enseñar Python desde cero. Incluye lecciones paso a paso, ejercicios prácticos, editor de código integrado y sistema de seguimiento de progreso. Perfecta para principiantes que quieren aprender programación de forma interactiva.",
      image: "/images/website-python.png",
      icon: GraduationCap,
      gradient: "from-blue-500 to-cyan-600",
      tags: ["Next.js", "React", "TypeScript"],
      allTags: ["Next.js", "React", "TypeScript", "Tailwind"],
      metrics: {
        lessons: "20+",
        students: "Activos",
        interactivity: "100%"
      },
      features: [
        "Lecciones interactivas",
        "Editor de código integrado",
        "Ejercicios prácticos",
        "Seguimiento de progreso",
        "Diseño intuitivo y moderno"
      ],
      links: {
        demo: "https://pythonlearn.vercel.app/",
        github: "",
        case: ""
      },
      client: "Python Junior Course",
      duration: "2 meses",
      year: "2024"
    },
    {
      id: 3,
      title: "Formulario de Reservas",
      description: "Sistema completo de reservas para agencia de viajes con formulario dinámico, cálculo de cotizaciones y generación de PDF.",
      longDescription: "Sistema completo de reservas desarrollado para agencia de viajes. Incluye formulario dinámico con múltiples opciones, cálculo automático de cotizaciones según destino, hospedaje y servicios adicionales. Genera cotizaciones en PDF y permite gestionar reservas de forma eficiente.",
      image: "/images/reservas-tropical.png",
      icon: Calendar,
      gradient: "from-emerald-500 to-teal-600",
      tags: ["Next.js", "React", "Tailwind"],
      allTags: ["Next.js", "React", "Tailwind", "JavaScript"],
      metrics: {
        destinations: "8+",
        bookings: "Múltiples",
        efficiency: "Alta"
      },
      features: [
        "Formulario de reservas completo",
        "Cálculo automático de cotizaciones",
        "Múltiples destinos y opciones",
        "Generación de PDF",
        "Diseño intuitivo y responsive"
      ],
      links: {
        demo: "https://tropicaldreams.vercel.app/",
        github: "",
        case: ""
      },
      client: "Tropical Dreams Tours",
      duration: "1 mes",
      year: "2024"
    },
    {
      id: 4,
      title: "Sitio Web para Fotografía",
      description: "Sitio web profesional para fotógrafa con portafolio, galería de trabajos y sistema de contacto.",
      longDescription: "Sitio web profesional desarrollado para fotógrafa. Incluye portafolio visual, galería de trabajos organizada por categorías, información sobre servicios y sistema de contacto. Diseño elegante que destaca la calidad visual de las fotografías.",
      image: "/images/website-jill.png",
      icon: Globe,
      gradient: "from-sky-500 to-blue-600",
      tags: ["Next.js", "React", "Tailwind"],
      allTags: ["Next.js", "React", "Tailwind", "TypeScript"],
      metrics: {
        portfolio: "Completo",
        gallery: "Organizada",
        design: "Elegante"
      },
      features: [
        "Portafolio visual",
        "Galería de trabajos",
        "Categorías organizadas",
        "Sistema de contacto",
        "Diseño elegante y profesional"
      ],
      links: {
        demo: "",
        github: "",
        case: ""
      },
      client: "Fotografía Profesional",
      duration: "1 mes",
      year: "2024"
    },
    {
      id: 5,
      title: "Sitio Web para Agencia de Modelaje",
      description: "Plataforma web profesional para academia de modelaje indígena con información de estudiantes, competencias y eventos.",
      longDescription: "Plataforma web profesional desarrollada para academia de modelaje indígena. Incluye información sobre la academia, equipo, estudiantes destacados, competencias y eventos. Celebra la belleza ancestral y promueve la cultura indígena panameña a través del modelaje profesional.",
      image: "/images/website-obit.png",
      icon: Users,
      gradient: "from-purple-500 to-pink-600",
      tags: ["Next.js", "React", "Tailwind"],
      allTags: ["Next.js", "React", "Tailwind", "TypeScript"],
      metrics: {
        students: "14+",
        competitions: "Múltiples",
        impact: "Cultural"
      },
      features: [
        "Información de la academia",
        "Galería de estudiantes",
        "Calendario de eventos",
        "Sistema de inscripciones",
        "Diseño elegante y cultural"
      ],
      links: {
        demo: "https://obip.vercel.app/",
        github: "",
        case: ""
      },
      client: "OBIP - Bellezas Indígenas",
      duration: "2 meses",
      year: "2024"
    },
    {
      id: 6,
      title: "Landing Page para Estilista",
      description: "Landing page profesional para estilista y colorista con presentación de ebook, beneficios y sistema de compra.",
      longDescription: "Landing page profesional desarrollada para estilista y colorista profesional. Presenta un ebook sobre colorimetría capilar con diseño atractivo, beneficios claros, testimonios y sistema de compra. Optimizada para conversión y diseño moderno que refleja la profesionalidad del servicio.",
      image: "/images/landingpage-carmen.png",
      icon: Zap,
      gradient: "from-orange-500 to-red-600",
      tags: ["Next.js", "React", "Tailwind"],
      allTags: ["Next.js", "React", "Tailwind", "JavaScript"],
      metrics: {
        sales: "42+",
        conversion: "Optimizada",
        design: "Profesional"
      },
      features: [
        "Presentación del producto",
        "Sección de beneficios",
        "Testimonios",
        "Sistema de compra",
        "Diseño profesional y atractivo"
      ],
      links: {
        demo: "https://carmengonzalezestilista.vercel.app/",
        github: "",
        case: ""
      },
      client: "Carmen González Estilista",
      duration: "1 mes",
      year: "2024"
    }
  ]

  // Calculate total slides (groups of 2)
  const totalSlides = Math.ceil(projects.length / 2)
  
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

  // Get current projects to display (2 per slide)
  const getCurrentProjects = () => {
    const startIndex = currentIndex * 2
    return projects.slice(startIndex, startIndex + 2)
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
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
                initial={{ opacity: 0, x: 50 }}
                animate={{ 
                  opacity: 1, 
                  x: isDragging ? dragOffset * 0.3 : 0 
                }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: isDragging ? 0 : 0.5 }}
              >
                {getCurrentProjects().map((project, index) => {
                  const IconComponent = project.icon
                  
                  return (
                    <motion.div
                      key={project.id}
                      className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200 dark:border-gray-700 h-full flex flex-col"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -8 }}
                    >
                      {/* Image Area - Imagen desde los bordes redondeados superiores */}
                      <div className="relative w-full h-80 overflow-hidden rounded-t-2xl">
                        {/* Imagen del proyecto - cubre todo el espacio desde arriba sin espacios */}
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                        
                        {/* Gradient Overlay superior sutil para mejor legibilidad */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent rounded-t-2xl" />
                        
                        {/* Gradient Overlay inferior para el título */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-t-2xl" />

                        {/* Title - Posicionado en la parte inferior */}
                        <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
                          <h3 className="text-2xl font-bold text-white drop-shadow-2xl">
                            {project.title}
                          </h3>
                        </div>

                        {/* Hover Overlay - Elegante y profesional */}
                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-8 z-20">
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