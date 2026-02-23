'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  MessageSquare,
  Calculator,
  Printer,
  ArrowRight,
  Check,
  Send,
  CheckCircle,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

const SERVICIOS = [
  { id: 'landing', label: 'Landing Page', precio: 170, tipo: 'web' },
  { id: 'web-5-secciones', label: 'Sitio Web 5 Secciones', precio: 320, tipo: 'web' },
  { id: 'portafolio', label: 'Portafolio Profesional', precio: 280, tipo: 'web' },
  { id: 'reservas-pedidos', label: 'Sitio con Reservas o Pedidos', precio: 500, tipo: 'web' },
  { id: 'ecommerce', label: 'Ecommerce (con pasarela)', precio: 850, tipo: 'web' },
  { id: 'marketplace', label: 'Marketplace', precio: 1500, tipo: 'web' },
  { id: 'blog', label: 'Blog simple', precio: 150, tipo: 'web' },
  { id: 'ajustes-wp', label: 'Ajustes WordPress', precio: 100, tipo: 'web' },
] as const

const PRECIO_DOMINIO_HOSTING_CORREO = 35
const PRECIO_PAGINA_EXTRA = 20

export default function CotizacionPage() {
  const [paso, setPaso] = useState(1)
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    tipoServicio: '',
    cantidadPaginas: 5,
    tieneDominio: '' as '' | 'si' | 'no',
    tieneHosting: '' as '' | 'si' | 'no',
    tieneCorreo: '' as '' | 'si' | 'no',
    incluirDominioHostingCorreo: false,
    comentarios: '',
  })
  const [enviando, setEnviando] = useState(false)
  const [cotizacionEnviada, setCotizacionEnviada] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  const servicio = SERVICIOS.find((s) => s.id === form.tipoServicio)
  const esWeb = servicio?.tipo === 'web'
  const necesitaExtras =
    esWeb &&
    (form.tieneDominio === 'no' || form.tieneHosting === 'no' || form.tieneCorreo === 'no')
  const extrasIncluidos = esWeb && form.incluirDominioHostingCorreo

  const base = servicio ? servicio.precio : 0
  const extrasHosting = extrasIncluidos ? PRECIO_DOMINIO_HOSTING_CORREO : 0
  const paginasExtra = esWeb && form.cantidadPaginas > 5 ? form.cantidadPaginas - 5 : 0
  const costoPaginasExtra = paginasExtra * PRECIO_PAGINA_EXTRA
  const total = base + extrasHosting + costoPaginasExtra

  // FormSubmit.co: gratis, sin registro. Las cotizaciones aceptadas llegan a soynixonlopez@gmail.com
  const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${encodeURIComponent('soynixonlopez@gmail.com')}`

  const handlePrint = () => {
    const ventana = window.open('', '_blank')
    if (!ventana) return
    const lineasExtra = []
    if (esWeb && paginasExtra > 0) {
      lineasExtra.push(`<div class="row"><span class="label">Páginas adicionales (${paginasExtra} x $${PRECIO_PAGINA_EXTRA}):</span> $${costoPaginasExtra}</div>`)
    }
    ventana.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cotización - Nixon López Services</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 24px; color: #1e293b; max-width: 600px; margin: 0 auto; }
            .brand { margin-bottom: 8px; }
            h1 { color: #0f172a; font-size: 1.5rem; margin: 0; }
            .ruc { color: #64748b; font-size: 0.9rem; margin: 4px 0 0 0; }
            .desc { color: #475569; font-size: 0.85rem; margin: 8px 0 16px 0; line-height: 1.4; }
            h2 { color: #0f172a; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; font-size: 1.1rem; margin-top: 20px; }
            .row { margin: 12px 0; }
            .label { font-weight: 600; color: #64748b; }
            .total { font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-top: 24px; }
            .footer { margin-top: 32px; font-size: 12px; color: #94a3b8; }
          </style>
        </head>
        <body>
          <div class="brand">
            <h1>Nixon López Services</h1>
            <p class="ruc">RUC 10-711-1351</p>
            <p class="desc">Servicios de diseño y desarrollo web y apps para empresas en crecimiento.</p>
          </div>
          <h2>Cotización</h2>
          <div class="row"><span class="label">Cliente:</span> ${form.nombre} ${form.apellido}</div>
          <div class="row"><span class="label">Correo:</span> ${form.correo}</div>
          <div class="row"><span class="label">Servicio:</span> ${servicio?.label ?? '-'}</div>
          ${esWeb ? `<div class="row"><span class="label">Cantidad de páginas:</span> ${form.cantidadPaginas}</div>` : ''}
          ${lineasExtra.join('')}
          ${esWeb ? `<div class="row"><span class="label">Incluye dominio, hosting y correo:</span> ${extrasIncluidos ? 'Sí (+$' + PRECIO_DOMINIO_HOSTING_CORREO + ')' : 'No'}</div>` : ''}
          ${form.comentarios ? `<div class="row"><span class="label">Comentarios:</span> ${form.comentarios}</div>` : ''}
          <div class="row total">Total: $${total}${servicio && 'mensual' in servicio && servicio.mensual ? '/mes' : ''}</div>
          <p class="footer">Generado el ${new Date().toLocaleDateString('es-ES')}. Demo en menos de 2 horas. Presencia digital con Nixon López.</p>
        </body>
      </html>
    `)
    ventana.document.close()
    ventana.focus()
    ventana.print()
    ventana.close()
  }

  const handleAceptarCotizacion = async () => {
    setEnviando(true)
    try {
      const response = await fetch(FORMSUBMIT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `Cotización aceptada - ${form.nombre} ${form.apellido}`,
          Nombre: form.nombre,
          Apellido: form.apellido,
          Correo: form.correo,
          Servicio: servicio?.label ?? '',
          'Cantidad de páginas': String(form.cantidadPaginas),
          'Incluye dominio/hosting/correo': extrasIncluidos ? 'Sí' : 'No',
          Total: `$${total}${servicio && 'mensual' in servicio && servicio.mensual ? '/mes' : ''}`,
          Comentarios: form.comentarios,
          Fecha: new Date().toLocaleString('es-ES'),
        }),
      })
      const data = await response.json()
      if (response.ok && data.success !== false) {
        setCotizacionEnviada(true)
      } else {
        throw new Error(data.message || 'Error al enviar')
      }
    } catch (e) {
      console.error(e)
      alert('No se pudo enviar la cotización. Intenta de nuevo o contáctanos por otro medio.')
    } finally {
      setEnviando(false)
    }
  }

  const puedeSiguiente =
    (paso === 1 &&
      form.nombre.trim() &&
      form.apellido.trim() &&
      form.correo.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) ||
    (paso === 2 && form.tipoServicio) ||
    (paso === 3 && true) ||
    paso === 4

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-950 pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-xl sm:max-w-2xl mx-auto">
          {/* Título */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-10"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
              Solicitar cotización
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Responde unas preguntas y obtén tu presupuesto. Incluye demo en menos de 2 horas.
            </p>
          </motion.div>

          {/* Indicador de pasos */}
          <div className="flex justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  paso >= n ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-400'
                }`}
              >
                {paso > n ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : n}
              </div>
            ))}
          </div>

          {/* Contenedor del formulario / resumen */}
          <div className="bg-slate-900/60 rounded-2xl border border-white/10 p-4 sm:p-6 md:p-8 shadow-xl">
            {paso === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4 sm:space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Nombre</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        value={form.nombre}
                        onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                        className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-2.5 sm:py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm sm:text-base"
                        placeholder="Tu nombre"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Apellido</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        value={form.apellido}
                        onChange={(e) => setForm((f) => ({ ...f, apellido: e.target.value }))}
                        className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-2.5 sm:py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm sm:text-base"
                        placeholder="Tu apellido"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Correo electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      value={form.correo}
                      onChange={(e) => setForm((f) => ({ ...f, correo: e.target.value }))}
                      className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-2.5 sm:py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm sm:text-base"
                      placeholder="tu@correo.com"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {paso === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-3 sm:space-y-4"
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de servicio</label>
                <div className="space-y-2">
                  {SERVICIOS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, tipoServicio: s.id }))}
                      className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 ${
                        form.tipoServicio === s.id
                          ? 'border-blue-500 bg-blue-500/10 text-white'
                          : 'border-white/20 bg-white/5 text-gray-300 hover:border-white/40'
                      }`}
                    >
                      <span className="text-sm sm:text-base">{s.label}</span>
                      <span className="font-semibold text-blue-400 text-sm sm:text-base">
                        ${s.precio}{'mensual' in s && s.mensual ? '/mes' : ''}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {paso === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4 sm:space-y-6"
              >
                {esWeb && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Cantidad de páginas
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={50}
                        value={form.cantidadPaginas}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            cantidadPaginas: Math.max(1, Math.min(50, Number(e.target.value) || 1)),
                          }))
                        }
                        className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 sm:py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm sm:text-base"
                      />
                      {form.cantidadPaginas > 5 && (
                        <p className="text-xs text-blue-400 mt-1">
                          +${PRECIO_PAGINA_EXTRA} por cada página después de 5 (${(form.cantidadPaginas - 5) * PRECIO_PAGINA_EXTRA} adicional)
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">¿Tienes dominio?</label>
                        <div className="flex gap-2">
                          {(['si', 'no'] as const).map((op) => (
                            <button
                              key={op}
                              type="button"
                              onClick={() => setForm((f) => ({ ...f, tieneDominio: op }))}
                              className={`flex-1 py-2 rounded-lg border text-sm ${
                                form.tieneDominio === op
                                  ? 'border-blue-500 bg-blue-500/20 text-white'
                                  : 'border-white/20 text-gray-400'
                              }`}
                            >
                              {op === 'si' ? 'Sí' : 'No'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">¿Tienes hosting?</label>
                        <div className="flex gap-2">
                          {(['si', 'no'] as const).map((op) => (
                            <button
                              key={op}
                              type="button"
                              onClick={() => setForm((f) => ({ ...f, tieneHosting: op }))}
                              className={`flex-1 py-2 rounded-lg border text-sm ${
                                form.tieneHosting === op
                                  ? 'border-blue-500 bg-blue-500/20 text-white'
                                  : 'border-white/20 text-gray-400'
                              }`}
                            >
                              {op === 'si' ? 'Sí' : 'No'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">¿Correo profesional?</label>
                        <div className="flex gap-2">
                          {(['si', 'no'] as const).map((op) => (
                            <button
                              key={op}
                              type="button"
                              onClick={() => setForm((f) => ({ ...f, tieneCorreo: op }))}
                              className={`flex-1 py-2 rounded-lg border text-sm ${
                                form.tieneCorreo === op
                                  ? 'border-blue-500 bg-blue-500/20 text-white'
                                  : 'border-white/20 text-gray-400'
                              }`}
                            >
                              {op === 'si' ? 'Sí' : 'No'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    {necesitaExtras && (
                      <div className="bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10">
                        <label className="flex items-center gap-3 cursor-pointer flex-wrap">
                          <input
                            type="checkbox"
                            checked={form.incluirDominioHostingCorreo}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                incluirDominioHostingCorreo: e.target.checked,
                              }))
                            }
                            className="rounded border-white/30 bg-white/5 text-blue-500 focus:ring-blue-500"
                          />
                          <span className="text-gray-300 text-sm sm:text-base">
                            Incluir dominio, hosting y correo profesional (+${PRECIO_DOMINIO_HOSTING_CORREO})
                          </span>
                        </label>
                      </div>
                    )}
                  </>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Comentarios adicionales
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <textarea
                      value={form.comentarios}
                      onChange={(e) => setForm((f) => ({ ...f, comentarios: e.target.value }))}
                      rows={3}
                      className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-2.5 sm:py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none text-sm sm:text-base"
                      placeholder="Cuéntame sobre tu proyecto..."
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {paso === 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                ref={printRef}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 text-blue-400">
                  <Calculator className="w-7 h-7 sm:w-8 sm:h-8" />
                  <h2 className="text-lg sm:text-xl font-bold text-white">Tu cotización</h2>
                </div>

                <div className="space-y-2 sm:space-y-3 text-gray-300 text-sm sm:text-base">
                  <p><span className="text-gray-500">Cliente:</span> {form.nombre} {form.apellido}</p>
                  <p><span className="text-gray-500">Correo:</span> {form.correo}</p>
                  <p><span className="text-gray-500">Servicio:</span> {servicio?.label}</p>
                  {esWeb && (
                    <>
                      <p><span className="text-gray-500">Páginas:</span> {form.cantidadPaginas}</p>
                      {paginasExtra > 0 && (
                        <p><span className="text-gray-500">Páginas adicionales ({paginasExtra} × ${PRECIO_PAGINA_EXTRA}):</span> +${costoPaginasExtra}</p>
                      )}
                      {extrasIncluidos && (
                        <p><span className="text-gray-500">Dominio, hosting y correo:</span> +${PRECIO_DOMINIO_HOSTING_CORREO}</p>
                      )}
                    </>
                  )}
                  {form.comentarios && (
                    <p><span className="text-gray-500">Comentarios:</span> {form.comentarios}</p>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-xl sm:text-2xl font-bold text-white">
                    Total: ${total}{servicio && 'mensual' in servicio && servicio.mensual ? '/mes' : ''}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Demo en menos de 2 horas. Presencia digital con Nixon López.
                  </p>
                </div>

                {cotizacionEnviada ? (
                  <div className="flex items-center gap-2 text-green-400 bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm sm:text-base">
                      Cotización enviada a soynixonlopez@gmail.com. Te contactaremos pronto.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      type="button"
                      onClick={handlePrint}
                      className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl font-medium transition-colors text-sm sm:text-base"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
                      Imprimir
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={handleAceptarCotizacion}
                      disabled={enviando}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base"
                      whileHover={{ scale: enviando ? 1 : 1.02 }}
                      whileTap={{ scale: enviando ? 1 : 0.98 }}
                    >
                      {enviando ? (
                        <>
                          <motion.div
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                          Aceptar cotización
                        </>
                      )}
                    </motion.button>
                  </div>
                )}

                {!cotizacionEnviada && (
                  <p className="text-xs text-gray-500 text-center">
                    Al aceptar, la cotización se enviará a soynixonlopez@gmail.com para dar seguimiento.
                  </p>
                )}

                <div className="pt-2">
                  <Link
                    href="/#contact"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Contactar para continuar
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            )}
          </div>

          {/* Navegación entre pasos */}
          <div className="flex justify-between items-center mt-6 sm:mt-8">
            {paso > 1 && paso < 4 && (
              <motion.button
                type="button"
                onClick={() => setPaso((p) => p - 1)}
                className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base py-2"
              >
                Atrás
              </motion.button>
            )}
            {paso < 4 ? (
              <motion.button
                type="button"
                onClick={() => setPaso((p) => p + 1)}
                disabled={!puedeSiguiente}
                className="ml-auto flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/25 transition-all text-sm sm:text-base"
              >
                {paso === 3 ? 'Ver cotización' : 'Siguiente'}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <div className="ml-auto" />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
