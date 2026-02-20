'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

const TestimonialsSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      id: 1,
      name: "Sara Carryhau",
      rating: 5,
      content: "Nixon creó mi página web para mi centro de estética y ha sido increíble. Desde que tengo la página, he recibido muchas más consultas y reservas. La integración con WhatsApp funciona perfecto y mis clientes pueden contactarme fácilmente. Muy profesional y siempre disponible para ayudarme.",
    },
    {
      id: 2,
      name: "Carmen González",
      rating: 5,
      content: "Trabajé con Nixon para crear mi landing page y superó todas mis expectativas. El diseño es hermoso, se ve profesional y ha aumentado mis ventas del ebook significativamente. Además, la página carga súper rápido en todos los dispositivos. Lo recomiendo totalmente.",
    },
    {
      id: 3,
      name: "Jill Martínez",
      rating: 5,
      content: "Como fotógrafa, necesitaba un portafolio web que realmente mostrara mi trabajo. Nixon creó una página increíble donde puedo mostrar todas mis fotografías de forma elegante. Mis clientes quedan impresionados y ahora recibo más solicitudes de trabajo. Excelente servicio.",
    },
    {
      id: 4,
      name: "Roberto Vargas",
      rating: 5,
      content: "Necesitaba un sitio web para mi agencia de viajes con sistema de reservas. Nixon desarrolló todo perfectamente, el formulario de reservas funciona muy bien y genera las cotizaciones automáticamente. Ha simplificado mucho mi trabajo y mis clientes están muy contentos con la facilidad para reservar.",
    },
    {
      id: 5,
      name: "Ana Rodríguez",
      rating: 5,
      content: "Nixon me ayudó a crear una aplicación web para mi negocio y ha sido un cambio total. La automatización con IA que implementó me ahorra muchísimo tiempo. Ahora puedo atender más clientes sin contratar más personal. Es un profesional de verdad, muy recomendado.",
    },
    {
      id: 6,
      name: "Carlos Herrera",
      rating: 5,
      content: "Mi página web para aprender programación que Nixon desarrolló es excelente. Los estudiantes pueden acceder fácilmente, el diseño es moderno y la experiencia de usuario es perfecta. Ha aumentado significativamente el número de personas que se inscriben a mis cursos. Muy satisfecho con el trabajo.",
    }
  ]

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section id="testimonials" className="py-20 bg-slate-50 dark:bg-slate-900 relative overflow-hidden" ref={ref}>
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
      </div>

      <div className="container-padding relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Lo que dicen mis{' '}
            <span className="gradient-text">Clientes</span>
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Testimonios de clientes satisfechos con mis servicios.
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="max-w-4xl mx-auto relative">
          {/* Navigation Buttons */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
            <motion.button
              onClick={prevTestimonial}
              className="w-12 h-12 bg-white dark:bg-slate-800 shadow-lg rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-blue-500 hover:text-white transition-all duration-300 border border-gray-200 dark:border-gray-600"
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={20} />
            </motion.button>
          </div>

          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
            <motion.button
              onClick={nextTestimonial}
              className="w-12 h-12 bg-white dark:bg-slate-800 shadow-lg rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-blue-500 hover:text-white transition-all duration-300 border border-gray-200 dark:border-gray-600"
              whileHover={{ scale: 1.1, x: 2 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>

          {/* Carousel Container */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial.id}
                className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100 dark:border-gray-700 text-center"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {/* Rating */}
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed italic max-w-3xl mx-auto">
                  "{currentTestimonial.content}"
                </blockquote>

                {/* Client Info */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                    {currentTestimonial.name.charAt(0)}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {currentTestimonial.name}
                  </h4>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-blue-500 scale-125'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
