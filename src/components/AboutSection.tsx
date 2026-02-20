'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { 
  GraduationCap, 
  Users, 
  Rocket,
  Sparkles,
  CheckCircle2
} from 'lucide-react'

const AboutSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const achievements = [
    { text: 'Atraer más clientes con diseño profesional y estrategias de conversión', icon: Rocket },
    { text: 'Integración de WhatsApp para contacto inmediato y mejor comunicación', icon: Users },
    { text: 'Más de 50 negocios ya están consiguiendo más clientes con mis servicios', icon: GraduationCap },
  ]

  return (
    <section id="about" className="py-24 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden" ref={ref}>
      {/* Enhanced Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] dark:opacity-[0.05]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container-padding relative z-10">
        {/* Enhanced Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full text-sm font-medium mb-6 shadow-lg shadow-orange-500/25"
            animate={{ 
              boxShadow: [
                '0 0 0 0 rgba(249, 115, 22, 0.4)',
                '0 0 0 10px rgba(249, 115, 22, 0)',
                '0 0 0 0 rgba(249, 115, 22, 0)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles size={18} />
            Sobre Mí
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Hola, Soy{' '}
            <span className="gradient-text bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 bg-clip-text text-transparent">
              Nixon López
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Desarrollador Web Profesional especializado en crear soluciones digitales que impulsan negocios hacia el éxito
          </p>
        </motion.div>

        {/* Enhanced Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Column - Enhanced Content */}
          <motion.div
            className="space-y-10"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Enhanced Main Description */}
            <div className="space-y-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 dark:border-slate-700/50 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Users size={24} className="text-white" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  ¿Quién Soy?
                </h3>
              </div>
              
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                Soy <strong className="text-orange-500 dark:text-orange-400 font-bold">Nixon López</strong>, desarrollador web profesional con pasión por crear 
                soluciones digitales que realmente funcionan. Me especializo en desarrollo de páginas web y aplicaciones web 
                modernas, optimizadas para convertir visitantes en clientes y hacer crecer tu negocio.
              </p>
            </div>

            {/* Enhanced Achievements List */}
            <motion.div 
              className="space-y-5"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  className="group relative overflow-hidden bg-white dark:bg-slate-800 rounded-2xl border-2 border-gray-200/80 dark:border-slate-700/80 shadow-lg hover:shadow-2xl transition-all duration-500 hover:border-orange-500/50 dark:hover:border-orange-500/50"
                  initial={{ opacity: 0, x: -30, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -30, scale: 0.95 }}
                  transition={{ delay: 0.5 + index * 0.15, type: "spring", stiffness: 100 }}
                  whileHover={{ 
                    x: 8, 
                    scale: 1.02,
                    boxShadow: "0 25px 50px rgba(249, 115, 22, 0.15)"
                  }}
                >
                  {/* Enhanced animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Enhanced Content */}
                  <div className="relative flex items-center gap-5 p-6">
                    {/* Enhanced Icon */}
                    <motion.div 
                      className="flex-shrink-0 relative"
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                        <achievement.icon size={24} className="text-white" />
                      </div>
                      
                      {/* Enhanced Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                    </motion.div>
                    
                    {/* Enhanced Text content */}
                    <div className="flex-1 flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <motion.p 
                        className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-200 leading-relaxed group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300"
                        initial={{ opacity: 0.8 }}
                        whileHover={{ opacity: 1 }}
                      >
                        {achievement.text}
                      </motion.p>
                    </div>
                  </div>
                  
                  {/* Enhanced Bottom accent line */}
                  <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 w-0 group-hover:w-full transition-all duration-500"></div>
                </motion.div>
              ))}
            </motion.div>

          </motion.div>

          {/* Enhanced Right Column - Image */}
          <motion.div
            className="relative flex items-center justify-center h-full lg:sticky lg:top-24"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Enhanced image container with decorative elements */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Decorative gradient circles */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-2xl" />
              
              {/* Image with enhanced styling */}
              <motion.div
                className="relative z-10"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/images/AboutMePicture.png"
                  alt="Nixon López - Desarrollador Web Profesional"
                  width={800}
                  height={1000}
                  className="w-full h-full max-h-[800px] object-contain drop-shadow-2xl"
                  priority
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
