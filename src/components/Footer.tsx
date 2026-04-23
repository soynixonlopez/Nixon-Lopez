'use client'

import { useState } from 'react'
import { Mail, Send } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import TechLogo from './TechLogo'
import { rateLimitFriendlyMessage } from '@/lib/utils'

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false)
  const [isNewsletterSubmitted, setIsNewsletterSubmitted] = useState(false)
  const [newsletterError, setNewsletterError] = useState('')

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setNewsletterError('')
    setIsNewsletterSubmitting(true)
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newsletterEmail,
        }),
      })
      if (response.ok) {
        setIsNewsletterSubmitted(true)
        setNewsletterEmail('')
        setTimeout(() => setIsNewsletterSubmitted(false), 3000)
      } else if (response.status === 429) {
        setNewsletterError(rateLimitFriendlyMessage(response.headers.get('Retry-After')))
      } else {
        const data = (await response.json().catch(() => null)) as { error?: string } | null
        setNewsletterError(
          typeof data?.error === 'string'
            ? data.error
            : 'No se pudo completar la suscripción. Intenta de nuevo.'
        )
      }
    } catch (error) {
      console.error('Error:', error)
      setNewsletterError('No se pudo completar la suscripción. Intenta de nuevo.')
    } finally {
      setIsNewsletterSubmitting(false)
    }
  }

  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/nixondev.ai/',
      color: 'hover:text-pink-400'
    },
    {
      name: 'GitHub',
      href: 'https://github.com/soynixonlopez',
      color: 'hover:text-gray-300',
    },
    {
      name: 'Facebook',
      href: 'https://facebook.com/soynixonlopez',
      color: 'hover:text-blue-400'
    },
    {
      name: 'TikTok',
      href: 'https://tiktok.com/@soynixonlopez',
      color: 'hover:text-gray-400'
    },
    {
      name: 'YouTube',
      href: 'https://www.youtube.com/@soynixonlopez',
      color: 'hover:text-red-400'
    }
  ]

  const quickLinks = [
    { name: 'Servicios', href: '#services' },
    { name: 'Sobre mí', href: '#about' },
    { name: 'Portafolio', href: '#projects' },
    { name: 'Contacto', href: '#contact' },
  ]

  const services = [
    { name: 'Diseño y Desarrollo Web para Negocios', href: '#services' },
    { name: 'Desarrollo de Apps Móviles para Negocios', href: '#services' },
    { name: 'Automatizaciones con IA', href: '#services' }
  ]

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-slate-950 text-white relative overflow-hidden text-left">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center" />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container-padding py-16">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="flex items-center mb-6">
                <Image
                  src="/images/logoweb.png"
                  alt="Nixon López — logo"
                  className="h-8 w-auto max-h-9 object-contain object-left sm:h-9 sm:max-h-10"
                  width={1306}
                  height={199}
                  sizes="(max-width: 768px) 85vw, 320px"
                />
              </div>
              
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                5 años transformando negocios con tecnología de vanguardia. 
                Especialista en IA, desarrollo web y automatizaciones.
              </p>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-400 ${social.color} transition-colors p-2 rounded-lg hover:bg-white/5`}
                  >
                    <TechLogo name={social.name} size={20} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-lg mb-6">
                Enlaces Rápidos
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={link.name}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="w-full text-left text-gray-400 hover:text-white transition-colors text-sm leading-relaxed hover:translate-x-1 transform transition-transform duration-200 block"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-semibold text-lg mb-6">
                Servicios
              </h3>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li key={service.name}>
                    {service.href.startsWith('#') ? (
                      <button
                        onClick={() => scrollToSection(service.href)}
                        className="w-full text-left text-gray-400 hover:text-white transition-colors text-sm leading-relaxed hover:translate-x-1 transform transition-transform duration-200 block"
                      >
                        {service.name}
                      </button>
                    ) : (
                      <Link
                        href={service.href}
                        className="w-full text-left text-gray-400 hover:text-white transition-colors text-sm leading-relaxed hover:translate-x-1 transform transition-transform duration-200 block"
                      >
                        {service.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="font-semibold text-lg mb-6">
                Newsletter
              </h3>
              <div className="space-y-4">
                <p className="text-gray-400 text-sm">
                  Mantente al día con las últimas tendencias en IA y desarrollo web.
                </p>
                
                {isNewsletterSubmitted && (
                  <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm">¡Suscrito exitosamente!</span>
                  </div>
                )}

                {newsletterError && (
                  <div
                    role="alert"
                    className="bg-amber-500/15 border border-amber-500/40 rounded-lg p-3 text-amber-100 text-sm"
                  >
                    {newsletterError}
                  </div>
                )}

                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <div>
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => {
                        setNewsletterEmail(e.target.value)
                        setNewsletterError('')
                      }}
                      placeholder="tu@email.com"
                      required
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300 text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isNewsletterSubmitting}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isNewsletterSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Suscribiendo...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Suscribirse
                      </>
                    )}
                  </button>
                </form>
                
                <p className="text-gray-500 text-xs">
                  Sin spam. Cancela cuando quieras.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800">
          <div className="container-padding py-6">
            <div className="flex flex-col md:flex-row justify-between items-start">
            <p
              className="text-gray-400 text-sm mb-4 md:mb-0"
            >
              © {new Date().getFullYear()} Nixon López. Todos los derechos reservados.
            </p>
              
              <div className="flex items-center gap-6">
                <Link
                  href="/politica-de-privacidad"
                  className="text-gray-400 hover:text-white transition-colors text-sm underline"
                >
                  Política de Privacidad
                </Link>
                
                <Link
                  href="/politica-de-cookies"
                  className="text-gray-400 hover:text-white transition-colors text-sm underline"
                >
                  Política de Cookies
                </Link>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
