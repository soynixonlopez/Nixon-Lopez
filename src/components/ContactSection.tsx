'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { 
  MessageCircle,
  Send,
  Mail,
  User,
  FileText,
  CheckCircle
} from 'lucide-react'
import TechLogo from './TechLogo'

const SERVICIOS = [
  { id: 'web-profesional', label: 'Sitio web profesional (básico para servicios)' },
  { id: 'landing', label: 'Landing Page' },
  { id: 'web-completo', label: 'Sitio web completo (5 páginas)' },
  { id: 'marketplace', label: 'Sitio web de marketplace' },
  { id: 'empresarial', label: 'Sitio web administrativo / empresarial' },
  { id: 'meta-ads', label: 'Publicidad en Meta Ads' },
  { id: 'google-ads', label: 'Publicidad en Google Ads' },
  { id: 'formularios', label: 'Implementación de Formularios y Reservas' },
  { id: 'automatizacion', label: 'Automatizaciones con IA' },
  { id: 'otro', label: 'Otro servicio' },
]

const ContactSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    tipoServicio: '',
    descripcion: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  // FormSubmit.co: gratis, sin registro. Los mensajes llegan a soynixonlopez@gmail.com
  const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${encodeURIComponent('soynixonlopez@gmail.com')}`

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const servicio = SERVICIOS.find(s => s.id === formData.tipoServicio)
      const response = await fetch(FORMSUBMIT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `Nuevo mensaje de contacto - ${formData.nombre} ${formData.apellido}`,
          Nombre: formData.nombre,
          Apellido: formData.apellido,
          Correo: formData.correo,
          'Tipo de servicio': servicio?.label || formData.tipoServicio,
          Descripción: formData.descripcion,
          Fecha: new Date().toLocaleString('es-ES'),
        }),
      })
      
      const data = await response.json()
      if (response.ok && data.success !== false) {
        setIsSubmitted(true)
        setFormData({
          nombre: '',
          apellido: '',
          correo: '',
          tipoServicio: '',
          descripcion: ''
        })
        setTimeout(() => setIsSubmitted(false), 5000)
      } else {
        throw new Error(data.message || 'Error al enviar el mensaje')
      }
    } catch (err) {
      console.error('Error:', err)
      setError('No se pudo enviar el mensaje. Por favor, intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }




  return (
    <section id="contact" className="py-20 bg-slate-900 text-white relative overflow-hidden" ref={ref}>
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10" />
        {[...Array(15)].map((_, i) => {
          // Posiciones fijas para evitar hydration mismatch
          const positions = [
            { left: 10, top: 15 }, { left: 80, top: 25 }, { left: 30, top: 70 }, { left: 90, top: 45 },
            { left: 20, top: 85 }, { left: 70, top: 10 }, { left: 50, top: 60 }, { left: 15, top: 40 },
            { left: 85, top: 75 }, { left: 40, top: 20 }, { left: 60, top: 90 }, { left: 25, top: 55 },
            { left: 95, top: 30 }, { left: 35, top: 80 }, { left: 75, top: 50 }
          ];
          const position = positions[i] || { left: 50, top: 50 };
          
          return (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-500 rounded-full"
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
              delay: i * 0.3,
            }}
          />
        )})}
      </div>

      <div className="container-padding relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4"
            animate={{ 
              boxShadow: [
                '0 0 0 0 rgba(0, 212, 255, 0.4)',
                '0 0 0 10px rgba(0, 212, 255, 0)',
                '0 0 0 0 rgba(0, 212, 255, 0)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Send size={16} />
            Contacto
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Listo para{' '}
            <span className="gradient-text">Conseguir Más Clientes</span>?
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Completa el formulario y descubre cómo podemos crear 
            la página web perfecta para tu negocio. Respuesta inmediata y cotización gratuita.
          </p>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          className="max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">
              Envíame un <span className="gradient-text">Mensaje</span>
            </h3>
            <p className="text-gray-300 text-center mb-8">
              Completa el formulario y te responderé lo antes posible
            </p>

            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="text-green-300 text-sm">
                  ¡Mensaje enviado exitosamente! Te responderé pronto.
                </p>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg"
              >
                <p className="text-red-300 text-sm">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-300 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Nombre *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    placeholder="Tu nombre"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Apellido */}
                <div>
                  <label htmlFor="apellido" className="block text-sm font-medium text-gray-300 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Apellido *
                  </label>
                  <input
                    type="text"
                    id="apellido"
                    required
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    placeholder="Tu apellido"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Correo */}
              <div>
                <label htmlFor="correo" className="block text-sm font-medium text-gray-300 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  id="correo"
                  required
                  value={formData.correo}
                  onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                  placeholder="tu@email.com"
                  disabled={isSubmitting}
                />
              </div>

              {/* Tipo de Servicio */}
              <div>
                <label htmlFor="tipoServicio" className="block text-sm font-medium text-gray-300 mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Tipo de Servicio *
                </label>
                <select
                  id="tipoServicio"
                  required
                  value={formData.tipoServicio}
                  onChange={(e) => setFormData({ ...formData, tipoServicio: e.target.value })}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                  disabled={isSubmitting}
                >
                  <option value="">Selecciona un servicio</option>
                  {SERVICIOS.map((servicio) => (
                    <option key={servicio.id} value={servicio.id} className="bg-slate-800">
                      {servicio.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Descripción */}
              <div>
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-300 mb-2">
                  <MessageCircle className="w-4 h-4 inline mr-2" />
                  Descripción del Proyecto *
                </label>
                <textarea
                  id="descripcion"
                  required
                  rows={5}
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none"
                  placeholder="Cuéntame sobre tu proyecto, qué necesitas, tus objetivos..."
                  disabled={isSubmitting}
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={!isSubmitting && !isSubmitted ? { scale: 1.02, y: -2 } : {}}
                whileTap={!isSubmitting && !isSubmitted ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Enviando...
                  </>
                ) : isSubmitted ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Mensaje Enviado
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Enviar Mensaje
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Social Media */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >

            <h3 className="text-2xl font-bold text-white mb-6 mt-12">
              Síguenos en nuestras{' '}
              <span className="gradient-text">Redes Sociales</span>
            </h3>
            
            <div className="flex justify-center gap-6">
            <motion.a
              href="https://instagram.com/soynixonlopez"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-300 transition-colors p-3 rounded-full hover:bg-pink-500/10"
              whileHover={{ scale: 1.2, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <TechLogo name="Instagram" size={32} />
            </motion.a>
            <motion.a
              href="https://tiktok.com/@soynixonlopez"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors p-3 rounded-full hover:bg-gray-500/10"
              whileHover={{ scale: 1.2, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <TechLogo name="TikTok" size={32} />
            </motion.a>
            <motion.a
              href="https://facebook.com/soynixonlopez"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors p-3 rounded-full hover:bg-blue-500/10"
              whileHover={{ scale: 1.2, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <TechLogo name="Facebook" size={32} />
            </motion.a>
            <motion.a
              href="https://youtube.com/@soynixonlopez"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300 transition-colors p-3 rounded-full hover:bg-red-500/10"
              whileHover={{ scale: 1.2, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <TechLogo name="YouTube" size={32} />
            </motion.a>
          </div>
        </motion.div>



      </div>
    </section>
  )
}

export default ContactSection