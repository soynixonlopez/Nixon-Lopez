'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Calculator } from 'lucide-react'
import Image from 'next/image'

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
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const menuItems = [
    { name: 'Inicio', href: '#hero' },
    { name: 'Servicios', href: '#services' },
    { name: 'Beneficios', href: '#why-choose' },
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
        return
      }
      // Sección aún no montada (carga diferida): fijar hash para que HomeBelowFold cargue y HashScroll haga scroll
      window.location.hash = href.slice(1)
      setIsMenuOpen(false)
    } else {
      window.location.href = href
    }
  }

  const redirectToCotizacion = () => {
    window.location.href = '/cotizacion'
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 safe-area-header ${
        isScrolled || isMenuOpen
          ? 'bg-slate-900 border-b border-white/10' 
          : 'bg-transparent'
      }`}
    >
      <div className="container-padding px-3 sm:px-4">
        <div className="flex items-center justify-between h-12 sm:h-14 md:h-16 min-h-[48px]">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center shrink-0 min-w-0 max-w-[min(62vw,11rem)] sm:max-w-[min(52vw,12.5rem)] md:max-w-[min(40vw,14rem)]"
          >
            <Image
              src="/images/logoweb.png"
              alt="Nixon López — logo"
              className="h-6 w-auto max-h-7 object-contain object-left sm:h-7 sm:max-h-8 md:h-7 md:max-h-9 lg:h-8 lg:max-h-9"
              width={1306}
              height={199}
              sizes="(max-width: 768px) 72vw, 320px"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-gray-300 hover:text-white transition-colors relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </nav>

          {/* Botón Cotizar */}
          <button
            onClick={redirectToCotizacion}
            className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
          >
            <Calculator className="w-4 h-4" />
            <span>Cotizar</span>
          </button>

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
        <div
          className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMenuOpen(false)}
          aria-hidden={!isMenuOpen}
        />

        {/* Mobile Navigation Menu - desde debajo del header */}
        <nav
          className={`fixed top-0 right-0 h-full w-[min(320px,calc(100%-2rem))] max-w-[calc(100%-2rem)] bg-slate-900 border-l border-white/10 z-50 md:hidden transform transition-transform duration-300 ease-in-out safe-area-nav ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ backgroundColor: '#0f172a', paddingTop: 'max(env(safe-area-inset-top), 0px)' }}
          aria-hidden={!isMenuOpen}
        >
          <div className="flex flex-col h-full overflow-y-auto">
            {/* Header del menú móvil */}
            <div className="flex items-center justify-between px-4 py-4 sm:p-5 border-b border-white/10 shrink-0 gap-2">
              <div className="flex items-center min-w-0 flex-1">
                <Image
                  src="/images/logoweb.png"
                  alt="Nixon López — logo"
                  className="h-6 w-auto max-h-7 object-contain object-left shrink-0 sm:h-7 sm:max-h-8 max-w-[min(100%,11rem)]"
                  width={1306}
                  height={199}
                  sizes="160px"
                  priority={false}
                />
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
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    style={{
                      animationDelay: isMenuOpen ? `${index * 45}ms` : undefined,
                    }}
                    className={`w-full text-left text-gray-300 hover:text-white transition-all duration-200 py-3.5 px-4 rounded-lg hover:bg-white/5 active:bg-white/10 group min-h-[48px] flex items-center ${
                      isMenuOpen ? 'max-md:motion-safe:animate-mobile-nav-in' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      <span className="text-lg font-medium">{item.name}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Botón Cotizar */}
              <div
                className={`mt-6 pt-5 border-t border-white/10 ${
                  isMenuOpen ? 'max-md:motion-safe:animate-mobile-nav-in' : ''
                }`}
                style={{ animationDelay: isMenuOpen ? `${menuItems.length * 45}ms` : undefined }}
              >
                <button
                  onClick={redirectToCotizacion}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3.5 rounded-xl font-semibold text-base hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 min-h-[48px]"
                >
                  <Calculator className="w-5 h-5 shrink-0" />
                  <span>Cotizar</span>
                </button>
              </div>
            </div>

            {/* Footer del menú */}
            <div className="px-4 py-4 sm:p-5 border-t border-white/10 shrink-0">
              <div className="text-center text-gray-400 text-sm">
                <p>Desarrollo Web & IA</p>
                <p className="text-xs mt-1">© {new Date().getFullYear()} Nixon López</p>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
