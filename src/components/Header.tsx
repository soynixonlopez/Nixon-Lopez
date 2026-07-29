'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import { CtaButtons } from '@/components/marketing/CtaButtons'
import { HOME_NAV, quoteUrl } from '@/lib/marketing'

const Header = () => {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
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
      window.location.hash = href.slice(1)
      setIsMenuOpen(false)
    } else {
      window.location.href = href
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 safe-area-header ${
        isScrolled || isMenuOpen
          ? 'bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm'
          : 'bg-white/70 backdrop-blur-sm'
      }`}
    >
      <div className="container-padding max-w-6xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 md:h-16 min-h-[56px] gap-3">
          <Link href="/" className="flex items-center shrink-0 min-w-0 max-w-[11rem]">
            <Image
              src="/images/logoweb.png"
              alt="Nixon Lopez Services"
              className="h-7 w-auto object-contain object-left"
              width={1306}
              height={199}
              sizes="180px"
              priority
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {HOME_NAV.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => scrollToSection(item.href)}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                {item.name}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center shrink-0">
            <CtaButtons size="sm" quoteHref={quoteUrl()} quoteLabel="Obtener cotización" whatsappLabel="WhatsApp" />
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-slate-700 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-slate-100"
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            aria-label="Cerrar menú"
            onClick={() => setIsMenuOpen(false)}
          />
          <nav className="fixed top-0 right-0 h-full w-[min(320px,100%-1rem)] bg-white border-l border-slate-200 z-50 lg:hidden safe-area-nav shadow-xl">
            <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
              <span className="font-semibold text-slate-900">Menú</span>
              <button type="button" onClick={() => setIsMenuOpen(false)} aria-label="Cerrar">
                <X size={22} />
              </button>
            </div>
            <div className="p-4 space-y-1">
              {HOME_NAV.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => scrollToSection(item.href)}
                  className="w-full text-left px-3 py-3 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                >
                  {item.name}
                </button>
              ))}
              <div className="pt-4 border-t border-slate-100">
                <CtaButtons
                  layout="column"
                  quoteHref={quoteUrl()}
                  quoteLabel="Obtener cotización"
                  whatsappLabel="Escríbeme por WhatsApp"
                />
              </div>
            </div>
          </nav>
        </>
      ) : null}
    </header>
  )
}

export default Header
