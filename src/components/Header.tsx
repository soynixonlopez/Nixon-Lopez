'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, Calculator } from 'lucide-react'

const Header = () => {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevenir scroll del body cuando el menú está abierto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    // Cleanup al desmontar el componente
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const menuItems = [
    { name: 'Inicio', href: '#hero' },
    { name: 'Servicios', href: '#services' },
    { name: 'Proyectos', href: '#projects' },
    { name: 'Contacto', href: '#contact' },
  ]

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      // Si estamos en otra página (ej. /cotizacion), ir al inicio con el hash
      if (pathname !== '/') {
        window.location.href = `/${href}`
        setIsMenuOpen(false)
        return
      }
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
        setIsMenuOpen(false)
      }
    } else {
      window.location.href = href
    }
  }

  const redirectToCotizacion = () => {
    window.location.href = '/cotizacion'
  }

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 safe-area-header ${
        isScrolled || isMenuOpen
          ? 'bg-slate-900 border-b border-white/10' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container-padding px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20 min-h-[56px]">
          {/* Logo */}
          <motion.a
            href="/"
            className="flex items-center shrink-0 min-w-0"
            whileHover={{ scale: 1.05 }}
          >
            <img 
              src="/images/logo-blanco.png" 
              alt="Nixon López Logo" 
              className="h-9 w-auto max-h-12 object-contain sm:h-10 md:h-12"
            />
          </motion.a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {menuItems.map((item, index) => (
              <motion.button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-gray-300 hover:text-white transition-colors relative group"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-300" />
              </motion.button>
            ))}
          </nav>

          {/* Botón Cotizar */}
          <motion.button
            onClick={redirectToCotizacion}
            className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Calculator className="w-4 h-4" />
            <span>Cotizar</span>
          </motion.button>

          {/* Mobile Menu Button - área táctil mínima 44px */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-3 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg active:bg-white/10"
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Mobile Navigation Menu - desde debajo del header */}
        <motion.nav
          className="fixed top-0 right-0 h-full w-[min(320px,100vw-2rem)] max-w-[calc(100vw-2rem)] bg-slate-900 border-l border-white/10 z-50 md:hidden transform transition-transform duration-300 ease-in-out safe-area-nav"
          style={{ backgroundColor: '#0f172a', paddingTop: 'max(env(safe-area-inset-top), 0px)' }}
          initial={{ x: '100%' }}
          animate={{ x: isMenuOpen ? 0 : '100%' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <div className="flex flex-col h-full overflow-y-auto">
            {/* Header del menú móvil */}
            <div className="flex items-center justify-between px-4 py-4 sm:p-5 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <img 
                  src="/images/logo-blanco.png" 
                  alt="Nixon López Logo" 
                  className="h-9 w-auto object-contain shrink-0"
                />
                <span className="text-white font-semibold text-sm sm:text-base truncate">Menú</span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg active:bg-white/10 -mr-1"
                aria-label="Cerrar menú"
              >
                <X size={24} />
              </button>
            </div>

            {/* Navegación */}
            <div className="flex-1 px-4 py-6 sm:px-5 sm:py-8 overflow-y-auto">
              <div className="space-y-1">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className="w-full text-left text-gray-300 hover:text-white transition-all duration-200 py-3.5 px-4 rounded-lg hover:bg-white/5 active:bg-white/10 group min-h-[48px] flex items-center"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      <span className="text-lg font-medium">{item.name}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Botón Cotizar */}
              <motion.div
                className="mt-6 pt-5 border-t border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <button
                  onClick={redirectToCotizacion}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3.5 rounded-xl font-semibold text-base hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 min-h-[48px]"
                >
                  <Calculator className="w-5 h-5 shrink-0" />
                  <span>Cotizar</span>
                </button>
              </motion.div>
            </div>

            {/* Footer del menú */}
            <div className="px-4 py-4 sm:p-5 border-t border-white/10 shrink-0">
              <div className="text-center text-gray-400 text-sm">
                <p>Desarrollo Web & IA</p>
                <p className="text-xs mt-1">© 2025 Nixon López</p>
              </div>
            </div>
          </div>
        </motion.nav>
      </div>
    </motion.header>
  )
}

export default Header
