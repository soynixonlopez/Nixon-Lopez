'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { X, Mail, Send } from 'lucide-react'
import Link from 'next/link'
import TechLogo from './TechLogo'

const Footer = () => {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false)
  const [isCookiesModalOpen, setIsCookiesModalOpen] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false)
  const [isNewsletterSubmitted, setIsNewsletterSubmitted] = useState(false)
  

  // FormSubmit.co: gratis, sin registro. Los correos llegan a soynixonlopez@gmail.com (la primera vez debes confirmar el email desde el enlace que te envían).
  const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${encodeURIComponent('soynixonlopez@gmail.com')}`

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsNewsletterSubmitting(true)
    try {
      const response = await fetch(FORMSUBMIT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email: newsletterEmail,
          _subject: 'Nueva suscripción al newsletter - Nixon López',
        }),
      })
      const data = await response.json()
      if (response.ok && data.success !== false) {
        setIsNewsletterSubmitting(false)
        setIsNewsletterSubmitted(true)
        setNewsletterEmail('')
        setTimeout(() => setIsNewsletterSubmitted(false), 3000)
      } else {
        throw new Error(data.message || 'Error al suscribirse')
      }
    } catch (error) {
      console.error('Error:', error)
      setIsNewsletterSubmitting(false)
      alert('Hubo un error al suscribirse. Por favor, intenta de nuevo.')
    }
  }

  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://instagram.com/soynixonlopez',
      color: 'hover:text-pink-400'
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
      href: 'https://youtube.com/@soynixonlopez',
      color: 'hover:text-red-400'
    }
  ]

  const quickLinks = [
    { name: 'Servicios', href: '#services' },
    { name: 'Sobre Mí', href: '#about' },
    { name: 'Proyectos', href: '#projects' },
    { name: 'Contacto', href: '#contact' },
  ]

  const services = [
    { name: 'Desarrollo Web', href: '#services' },
    { name: 'Aplicaciones Móviles', href: '#services' },
    { name: 'Automatizaciones con IA', href: '#services' },
    { name: 'Consultoría Técnica', href: '#contact' }
  ]

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-slate-950 text-white relative overflow-hidden">
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
              <motion.div
                className="flex items-center mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <img 
                  src="/images/logo-blanco.png" 
                  alt="Nixon López Logo" 
                  className="h-14 w-auto object-contain"
                />
              </motion.div>
              
              <motion.p
                className="text-gray-400 text-sm leading-relaxed mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                5 años transformando negocios con tecnología de vanguardia. 
                Especialista en IA, desarrollo web y automatizaciones.
              </motion.p>

              {/* Social Links */}
              <motion.div
                className="flex space-x-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-400 ${social.color} transition-colors p-2 rounded-lg hover:bg-white/5`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <TechLogo name={social.name} size={20} />
                  </motion.a>
                ))}
              </motion.div>
            </div>

            {/* Quick Links */}
            <div>
              <motion.h3
                className="font-semibold text-lg mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Enlaces Rápidos
              </motion.h3>
              <motion.ul
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {quickLinks.map((link, index) => (
                  <li key={link.name}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-gray-400 hover:text-white transition-colors text-sm hover:translate-x-1 transform transition-transform duration-200 block"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </motion.ul>
            </div>

            {/* Services */}
            <div>
              <motion.h3
                className="font-semibold text-lg mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Servicios
              </motion.h3>
              <motion.ul
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {services.map((service, index) => (
                  <li key={service.name}>
                    {service.href.startsWith('#') ? (
                      <button
                        onClick={() => scrollToSection(service.href)}
                        className="text-gray-400 hover:text-white transition-colors text-sm hover:translate-x-1 transform transition-transform duration-200 block"
                      >
                        {service.name}
                      </button>
                    ) : (
                      <Link
                        href={service.href}
                        className="text-gray-400 hover:text-white transition-colors text-sm hover:translate-x-1 transform transition-transform duration-200 block"
                      >
                        {service.name}
                      </Link>
                    )}
                  </li>
                ))}
              </motion.ul>
            </div>

            {/* Newsletter */}
            <div>
              <motion.h3
                className="font-semibold text-lg mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Newsletter
              </motion.h3>
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <p className="text-gray-400 text-sm">
                  Mantente al día con las últimas tendencias en IA y desarrollo web.
                </p>
                
                {isNewsletterSubmitted && (
                  <motion.div
                    className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 flex items-center gap-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Mail className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm">¡Suscrito exitosamente!</span>
                  </motion.div>
                )}

                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <div>
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="tu@email.com"
                      required
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300 text-sm"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={isNewsletterSubmitting}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: isNewsletterSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isNewsletterSubmitting ? 1 : 0.98 }}
                  >
                    {isNewsletterSubmitting ? (
                      <>
                        <motion.div
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Suscribiendo...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Suscribirse
                      </>
                    )}
                  </motion.button>
                </form>
                
                <p className="text-gray-500 text-xs">
                  Sin spam. Cancela cuando quieras.
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800">
          <div className="container-padding py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
                          <motion.p
              className="text-gray-400 text-sm mb-4 md:mb-0"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              © {new Date().getFullYear()} Nixon López. Todos los derechos reservados.
            </motion.p>
              
              <div className="flex items-center gap-6">
                <motion.button
                  onClick={() => setIsPrivacyModalOpen(true)}
                  className="text-gray-400 hover:text-white transition-colors text-sm underline"
                  whileHover={{ y: -1 }}
                >
                  Políticas de Privacidad
                </motion.button>
                
                <motion.button
                  onClick={() => setIsCookiesModalOpen(true)}
                  className="text-gray-400 hover:text-white transition-colors text-sm underline"
                  whileHover={{ y: -1 }}
                >
                  Políticas de Cookies
                </motion.button>
                
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {isPrivacyModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsPrivacyModalOpen(false)}
        >
          <motion.div
            className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">Políticas de Privacidad</h2>
              <button
                onClick={() => setIsPrivacyModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-2"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 text-gray-300 space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">1. Información que Recopilamos</h3>
                <p className="text-sm leading-relaxed">
                  Recopilamos información que nos proporcionas directamente, como cuando te contactas a través de nuestro formulario, 
                  envías un correo electrónico o nos contactas de otra manera. Esta información puede incluir tu nombre, dirección 
                  de correo electrónico y cualquier otra información que decidas proporcionar.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">2. Uso de la Información</h3>
                <p className="text-sm leading-relaxed">
                  Utilizamos la información que recopilamos para responder a tus consultas, proporcionar servicios, mejorar nuestro 
                  sitio web y comunicarnos contigo sobre nuestros servicios. No vendemos, alquilamos ni compartimos tu información 
                  personal con terceros sin tu consentimiento.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">3. Cookies y Tecnologías Similares</h3>
                <p className="text-sm leading-relaxed">
                  Nuestro sitio web puede utilizar cookies y tecnologías similares para mejorar tu experiencia de navegación. 
                  Puedes configurar tu navegador para rechazar cookies, pero esto puede afectar la funcionalidad del sitio.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">4. Seguridad de la Información</h3>
                <p className="text-sm leading-relaxed">
                  Implementamos medidas de seguridad apropiadas para proteger tu información personal contra acceso no autorizado, 
                  alteración, divulgación o destrucción. Sin embargo, ningún método de transmisión por Internet es 100% seguro.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">5. Tus Derechos</h3>
                <p className="text-sm leading-relaxed">
                  Tienes derecho a acceder, corregir o eliminar tu información personal. También puedes optar por no recibir 
                  comunicaciones de marketing. Para ejercer estos derechos, contáctanos a través de la información de contacto 
                  proporcionada en este sitio.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">6. Cambios en esta Política</h3>
                <p className="text-sm leading-relaxed">
                  Podemos actualizar esta política de privacidad de vez en cuando. Te notificaremos cualquier cambio 
                  significativo publicando la nueva política en este sitio y actualizando la fecha de "última actualización".
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">7. Contacto</h3>
                <p className="text-sm leading-relaxed">
                  Si tienes preguntas sobre esta política de privacidad o nuestras prácticas de privacidad, 
                  contáctanos en: soynixonlopez@gmail.com
                </p>
              </div>

              <div className="text-xs text-gray-500 pt-4 border-t border-gray-700">
                <p>Última actualización: {new Date().toLocaleDateString('es-ES')}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-6 border-t border-gray-700">
              <motion.button
                onClick={() => setIsPrivacyModalOpen(false)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cerrar
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Cookies Policy Modal */}
      {isCookiesModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCookiesModalOpen(false)}
        >
          <motion.div
            className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">Políticas de Cookies</h2>
              <button
                onClick={() => setIsCookiesModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-2"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 text-gray-300 space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">1. ¿Qué son las Cookies?</h3>
                <p className="text-sm leading-relaxed">
                  Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas nuestro sitio web. 
                  Estas cookies nos ayudan a mejorar tu experiencia de navegación, recordar tus preferencias y analizar cómo 
                  utilizas nuestro sitio.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">2. Tipos de Cookies que Utilizamos</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">Cookies Esenciales</h4>
                    <p className="text-sm leading-relaxed">
                      Estas cookies son necesarias para el funcionamiento básico del sitio web y no se pueden desactivar. 
                      Incluyen cookies de sesión, seguridad y funcionalidad básica.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">Cookies de Rendimiento</h4>
                    <p className="text-sm leading-relaxed">
                      Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web, proporcionando información 
                      sobre las páginas visitadas, tiempo de permanencia y posibles errores.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">Cookies de Funcionalidad</h4>
                    <p className="text-sm leading-relaxed">
                      Permiten que el sitio web recuerde las elecciones que haces (como tu nombre de usuario, idioma o región) 
                      y proporcionan características mejoradas y más personales.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">3. Cookies de Terceros</h3>
                <p className="text-sm leading-relaxed">
                  Nuestro sitio puede utilizar servicios de terceros como Google Analytics, redes sociales o herramientas 
                  de marketing. Estas empresas pueden establecer sus propias cookies en tu dispositivo. Te recomendamos 
                  revisar las políticas de privacidad de estos servicios.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">4. Gestión de Cookies</h3>
                <p className="text-sm leading-relaxed">
                  Puedes controlar y gestionar las cookies a través de la configuración de tu navegador. La mayoría de 
                  los navegadores te permiten rechazar cookies o recibir una notificación antes de que se instale una cookie. 
                  Sin embargo, ten en cuenta que deshabilitar ciertas cookies puede afectar la funcionalidad del sitio.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">5. Cookies en Dispositivos Móviles</h3>
                <p className="text-sm leading-relaxed">
                  Si accedes a nuestro sitio desde un dispositivo móvil, también utilizamos cookies para optimizar tu 
                  experiencia. Puedes gestionar estas cookies a través de la configuración de tu navegador móvil.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">6. Actualizaciones de esta Política</h3>
                <p className="text-sm leading-relaxed">
                  Podemos actualizar esta política de cookies de vez en cuando para reflejar cambios en nuestras prácticas 
                  o por otras razones operativas, legales o regulatorias. Te recomendamos revisar esta página periódicamente.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">7. Contacto</h3>
                <p className="text-sm leading-relaxed">
                  Si tienes preguntas sobre nuestra política de cookies o cómo utilizamos las cookies en nuestro sitio, 
                  contáctanos en: soynixonlopez@gmail.com
                </p>
              </div>

              <div className="text-xs text-gray-500 pt-4 border-t border-gray-700">
                <p>Última actualización: {new Date().toLocaleDateString('es-ES')}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-6 border-t border-gray-700">
              <motion.button
                onClick={() => setIsCookiesModalOpen(false)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cerrar
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </footer>
  )
}

export default Footer
