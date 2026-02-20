'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Globe, Smartphone, Zap, Users, Code } from 'lucide-react'

const WhyChooseSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const features = [
    {
      icon: Code,
      title: "Desarrollo Web y WebApps Profesionales",
      description: "Sitios web y aplicaciones web modernas, responsivas y optimizadas que convierten visitantes en clientes. Tecnologías de vanguardia y diseño profesional."
    },
    {
      icon: Zap,
      title: "Performance Optimizado",
      description: "Velocidad de carga ultrarrápida, SEO optimizado para Google y mejores prácticas de desarrollo que garantizan un rendimiento excepcional."
    },
    {
      icon: Users,
      title: "Experiencia de Usuario Excepcional",
      description: "Interfaces intuitivas, atractivas y fáciles de usar diseñadas para maximizar conversiones y brindar una experiencia memorable a tus usuarios."
    }
  ]

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-slate-900">
      <div className="container-padding">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            ¿Por qué elegir{' '}
            <span className="gradient-text">mis Servicios</span>?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Desarrollo web y webapps profesionales con enfoque en performance, seguridad y experiencia de usuario. 
            Soluciones completas que impulsan tu negocio hacia el éxito digital.
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          {/* Main Container */}
          <div className="relative">
            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Features List */}
              <div className="space-y-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="group relative"
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Number */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm group-hover:from-indigo-600 group-hover:to-purple-700 transition-all duration-300 shadow-lg">
                          {index + 1}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <feature.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors duration-300" />
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                            {feature.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Connecting Line */}
                    {index < features.length - 1 && (
                      <div className="absolute left-6 top-14 w-0.5 h-8 bg-gradient-to-b from-indigo-200 to-purple-200 dark:from-indigo-700 dark:to-purple-700" />
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Right Side - Service Cards */}
              <div className="relative">
                <motion.div
                  className="relative space-y-6"
                  initial={{ opacity: 0, x: 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  {/* Main Service Card */}
                  <motion.div
                    className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 shadow-2xl text-white hover:shadow-purple-500/30 transition-all duration-300"
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Code className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">
                        Soluciones Digitales
                      </h3>
                      <p className="text-white/80 text-sm">
                        Desarrollo web y webapps profesionales
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                        <div className="text-2xl font-bold mb-1">100%</div>
                        <div className="text-sm text-white/80">Responsive</div>
                      </div>
                      <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                        <div className="text-2xl font-bold mb-1">SEO</div>
                        <div className="text-sm text-white/80">Optimizado</div>
                      </div>
                    </div>
                    
                    <motion.button
                      className="w-full bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const phoneNumber = '+50768252312'
                        const message = encodeURIComponent('Hola, estoy interesado en comenzar un proyecto')
                        const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${message}`
                        window.open(whatsappUrl, '_blank')
                      }}
                    >
                      Comenzar Proyecto
                    </motion.button>
                  </motion.div>

                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-indigo-500 rounded-full opacity-20 animate-pulse" />
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-500 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyChooseSection
