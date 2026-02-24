'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ChevronDown, Sparkles, Bot, Code, Zap, Calculator, Star } from 'lucide-react'
import Image from 'next/image'
import { useQuoteModal } from '@/hooks/useQuoteModal'
import QuoteModal from './QuoteModal'
import TechLogo from './TechLogo'

const HeroSection = () => {
  const [currentText, setCurrentText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const { isOpen, serviceType, openModal, closeModal } = useQuoteModal()
  
  const texts = [
    'Páginas Web para Negocios',
    'Más Clientes para tu Negocio',
    'WhatsApp Integrado',
    'Sitios que Venden'
  ]

  useEffect(() => {
    const timeout = setTimeout(() => {
      const current = texts[currentIndex]
      
      if (!isDeleting) {
        setCurrentText(current.substring(0, currentText.length + 1))
        
        if (currentText === current) {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        setCurrentText(current.substring(0, currentText.length - 1))
        
        if (currentText === '') {
          setIsDeleting(false)
          setCurrentIndex((prev) => (prev + 1) % texts.length)
        }
      }
    }, isDeleting ? 50 : 100)

    return () => clearTimeout(timeout)
  }, [currentText, currentIndex, isDeleting])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8
      }
    }
  }

  const floatingIcons = [
    { Icon: Bot, delay: 0, position: { top: '20%', left: '10%' } },
    { Icon: Code, delay: 2, position: { top: '30%', right: '15%' } },
    { Icon: Zap, delay: 4, position: { bottom: '30%', left: '15%' } },
    { Icon: Sparkles, delay: 1, position: { top: '60%', right: '10%' } },
  ]

  return (
    <section id="hero" className="relative min-h-screen h-auto md:h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8 md:py-0 pb-0">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => {
          // Posiciones fijas basadas en el índice para evitar hidration mismatch
          const positions = [
            { left: 15, top: 20 }, { left: 85, top: 35 }, { left: 45, top: 60 }, { left: 70, top: 15 },
            { left: 25, top: 75 }, { left: 90, top: 80 }, { left: 10, top: 45 }, { left: 60, top: 90 },
            { left: 35, top: 25 }, { left: 80, top: 55 }, { left: 20, top: 85 }, { left: 65, top: 10 },
            { left: 40, top: 70 }, { left: 95, top: 40 }, { left: 5, top: 65 }, { left: 75, top: 30 },
            { left: 30, top: 95 }, { left: 85, top: 20 }, { left: 50, top: 50 }, { left: 15, top: 80 }
          ];
          const position = positions[i] || { left: 50, top: 50 };
          
          return (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            style={{
              left: `${position.left}%`,
              top: `${position.top}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        )})}
      </div>

      {/* Floating tech icons */}
      {floatingIcons.map(({ Icon, delay, position }, index) => (
        <motion.div
          key={index}
          className="absolute text-blue-400/30"
          style={position}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: delay,
          }}
        >
          <Icon size={24} />
        </motion.div>
      ))}

      {/* Main content */}
      <motion.div
        className="relative z-10 container-padding h-full pt-[calc(3.5rem+env(safe-area-inset-top,0px))] sm:pt-[calc(4rem+env(safe-area-inset-top,0px))] md:pt-20 pb-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Two column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center md:items-stretch h-full">
          
          {/* Left column - Content */}
          <motion.div
            variants={itemVariants}
            className="text-center md:text-left flex flex-col justify-center h-full"
          >
            {/* Greeting */}
            <motion.div
              variants={itemVariants}
              className="mb-6"
            >
              <span className="text-blue-400 font-mono text-2xl tracking-wider">
                ¿Tu Negocio Necesita Más Clientes?
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl font-bold mb-6"
            >
              <span className="gradient-text">Hola, Soy Nixon</span>
            </motion.h1>

            {/* Animated subtitle */}
            <motion.div
              variants={itemVariants}
              className="mb-8"
            >
              <h2 className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-2">
                Especialistas en{' '}
                <span className="text-blue-400 font-semibold">
                  {currentText}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="ml-1"
                  >
                    |
                  </motion.span>
                </span>
              </h2>
              <p className="pt-5 text-gray-400 max-w-2xl mx-auto lg:mx-0 text-lg"> 
                Creamos páginas web profesionales para negocios de servicios. Conecta con más clientes, integra WhatsApp y convierte visitantes en ventas.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8"
            >
              <motion.button
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-green-500/50"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const phoneNumber = '+50768252312'
                  const message = encodeURIComponent('Hola, estoy interesado en solicitar una cotización')
                  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${message}`
                  window.open(whatsappUrl, '_blank')
                }}
              >
                <TechLogo name="WhatsApp" size={28} />
                Contactar por WhatsApp
              </motion.button>
              
              <motion.button
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2 border border-white/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const projectsSection = document.getElementById('projects')
                  if (projectsSection) {
                    projectsSection.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              >
                <Star className="w-5 h-5" />
                Ver Proyectos
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right column - Profile Image */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center md:justify-end h-full relative"
          >
            <motion.div
              className="relative w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl h-[500px] sm:h-[600px] md:h-full"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {/* Profile image container */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src="/images/nixonprofile.png"
                  alt="Páginas Web Profesionales para Negocios de Servicios"
                  fill
                  className="object-contain object-bottom"
                  priority
                />
              </div>
              
              {/* Floating tech icons around the image - closer and better distributed */}
              <motion.div
                className="absolute top-8 right-2 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
                animate={{ 
                  y: [0, -8, 0],
                  rotate: [0, 360]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Bot className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
              </motion.div>
              
              <motion.div
                className="absolute bottom-8 left-2 sm:left-4 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-purple-500 rounded-full flex items-center justify-center shadow-lg"
                animate={{ 
                  y: [0, 8, 0],
                  rotate: [0, -360]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <Code className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
              </motion.div>
              
              <motion.div
                className="absolute top-1/4 left-1 sm:left-2 w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                animate={{ 
                  x: [0, -5, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </motion.div>
              
              <motion.div
                className="absolute top-3/4 right-1 sm:right-2 w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
                animate={{ 
                  y: [0, -6, 0],
                  rotate: [0, 90, 180, 270, 360]
                }}
                transition={{ 
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5
                }}
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </motion.div>
              
              <motion.div
                className="absolute top-1/2 left-0 sm:left-1 w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg"
                animate={{ 
                  x: [0, -3, 0],
                  rotate: [0, -180, -360]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                <Star className="w-4 h-4 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
              </motion.div>
              
              <motion.div
                className="absolute top-1/2 right-0 sm:right-1 w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg"
                animate={{ 
                  x: [0, 3, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2.5
                }}
              >
                <Calculator className="w-4 h-4 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Gradient overlay - only on desktop */}
      <div className="hidden md:block absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent" />
      
      {/* Quote Modal */}
      <QuoteModal
        isOpen={isOpen}
        onClose={closeModal}
        serviceType={serviceType}
      />
    </section>
  )
}

export default HeroSection
