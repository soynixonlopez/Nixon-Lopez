'use client'

import { useState } from 'react'
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
  Info,
  Layers,
  Sparkles,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import {
  QUOTE_SERVICES,
  calculateQuoteLines,
  getService,
  MAX_INCLUDED_PAGES,
  PRICE_EXTRA_PAGE_USD,
  PRICE_DOMAIN_USD,
  PRICE_EMAIL_USD,
} from '@/lib/quote-pricing'
import { INVOICE_BRANDING } from '@/lib/invoice-branding'

const MAX_IMAGENES_POR_SITIO = 20
const OBSERVACIONES_IMAGENES =
  'Cada sitio web puede requerir funcionalidades adicionales según el alcance. En esos casos, contacta al desarrollador, ya que podrían generarse gastos extras.'
const OBSERVACIONES_HOSTING_DB =
  'Hosting y base de datos dependen del tráfico y escala del proyecto; se acuerdan según necesidad.'

const STEPS = [
  { n: 1, title: 'Datos generales', desc: 'Nombre y correo de contacto' },
  { n: 2, title: 'Tipo de servicio', desc: 'Elige el paquete que mejor encaje' },
  { n: 3, title: 'Detalles', desc: 'Páginas, dominio, correo y comentarios' },
  { n: 4, title: 'Resumen', desc: 'Revisa y envía tu cotización' },
]

export default function CotizacionPage() {
  const [paso, setPaso] = useState(1)
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    tipoServicio: '',
    cantidadPaginas: 5,
    tieneDominio: '' as '' | 'si' | 'no',
    tieneCorreo: '' as '' | 'si' | 'no',
    incluirPasarelaAddon: false,
    comentarios: '',
  })
  const [enviando, setEnviando] = useState(false)
  const [cotizacionEnviada, setCotizacionEnviada] = useState(false)

  const servicio = getService(form.tipoServicio)
  const needsPages = servicio?.needsPages ?? false
  const needsDomainEmail = servicio?.needsDomainEmail ?? false
  const esPasarelaSolo = form.tipoServicio === 'pasarela'
  const monthly = servicio?.monthly ?? false

  const { lines, total } = calculateQuoteLines({
    serviceId: form.tipoServicio,
    cantidadPaginas: form.cantidadPaginas,
    tieneDominio: form.tieneDominio,
    tieneCorreo: form.tieneCorreo,
    incluirPasarelaAddon: esPasarelaSolo ? false : form.incluirPasarelaAddon,
  })

  const paginasExtra =
    needsPages && form.cantidadPaginas > MAX_INCLUDED_PAGES
      ? form.cantidadPaginas - MAX_INCLUDED_PAGES
      : 0

  const puedePaso1 =
    form.nombre.trim() &&
    form.apellido.trim() &&
    form.correo.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)

  const puedePaso2 = Boolean(form.tipoServicio)

  const puedePaso3 =
    (!needsPages || (form.cantidadPaginas >= 1 && form.cantidadPaginas <= 50)) &&
    (!needsDomainEmail || (form.tieneDominio === 'si' || form.tieneDominio === 'no')) &&
    (!needsDomainEmail || (form.tieneCorreo === 'si' || form.tieneCorreo === 'no'))

  const puedeSiguiente =
    (paso === 1 && puedePaso1) ||
    (paso === 2 && puedePaso2) ||
    (paso === 3 && puedePaso3) ||
    paso === 4

  const handlePrint = () => {
    const ventana = window.open('', '_blank')
    if (!ventana) return
    const accent = INVOICE_BRANDING.accentHex
    const clientName = `${form.nombre} ${form.apellido}`.trim()
    const lineasHtml = lines
      .map(
        (l) =>
          `<tr><td style="padding:10px;border-bottom:1px solid #e2e8f0;">${escapeHtml(l.label)}</td><td style="padding:10px;text-align:right;border-bottom:1px solid #e2e8f0;white-space:nowrap;">$${l.amount.toFixed(2)}</td></tr>`
      )
      .join('')
    ventana.document.write(`<!DOCTYPE html><html><head><title>Cotización — NL Services</title>
      <style>
        *{box-sizing:border-box}
        body{font-family:system-ui,sans-serif;padding:20px;color:#0f172a;max-width:860px;margin:0 auto;background:#fff}
        .sheet{border:1px solid #e2e8f0;border-radius:12px;overflow:hidden}
        .head{display:flex;justify-content:space-between;gap:20px;padding:24px;border-bottom:1px solid #e2e8f0}
        .brand{font-weight:800;font-size:1.25rem;color:${accent};margin:0}
        .sub{margin:6px 0 0;color:#64748b;font-size:0.9rem}
        .right{text-align:right}
        .doc{font-size:1.7rem;font-weight:800;color:${accent};margin:0}
        .muted{color:#64748b;font-size:0.85rem;margin-top:6px}
        .block{padding:20px 24px}
        .label{display:inline-block;background:${accent};color:#fff;font-weight:700;font-size:11px;padding:8px 12px;border-radius:6px 6px 0 0;text-transform:uppercase}
        .client{border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;padding:12px}
        .client p{margin:4px 0}
        table{width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden}
        thead tr{background:${accent};color:#fff}
        th{padding:10px;text-align:left;font-size:13px}
        .num{text-align:right}
        .total{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:16px;background:${accent};color:#fff;padding:12px 14px;border-radius:8px}
        .total b{font-size:1.2rem}
        .obs{margin-top:14px;padding:12px;background:#f8fafc;border-radius:8px;font-size:0.84rem;color:#475569;border:1px solid #e2e8f0}
      </style></head><body>
      <article class="sheet">
        <section class="head">
          <div>
            <h1 class="brand">${escapeHtml(INVOICE_BRANDING.businessName)}</h1>
            <p class="sub">${escapeHtml(INVOICE_BRANDING.businessSubtitle)}</p>
            <p class="muted">RUC: ${escapeHtml(INVOICE_BRANDING.ruc)} · ${escapeHtml(INVOICE_BRANDING.email)}</p>
          </div>
          <div class="right">
            <p class="doc">COTIZACIÓN</p>
            <p class="muted">${new Date().toLocaleDateString('es-PA')}</p>
          </div>
        </section>
        <section class="block">
          <span class="label">Cliente</span>
          <div class="client">
            <p><strong>${escapeHtml(clientName || 'Cliente')}</strong></p>
            <p>${escapeHtml(form.correo)}</p>
          </div>
        </section>
        <section class="block" style="padding-top:0">
          <table><thead><tr><th>Concepto</th><th class="num">Importe</th></tr></thead><tbody>${lineasHtml}</tbody></table>
          <div class="total"><span>Total estimado</span><b>$${total.toFixed(2)} USD${monthly ? ' / mes' : ''}</b></div>
        </section>
      </article>
      ${form.comentarios ? `<p><strong>Comentarios:</strong> ${escapeHtml(form.comentarios)}</p>` : ''}
      <div class="obs"><strong>Nota:</strong> ${OBSERVACIONES_IMAGENES}</div>
      <p style="margin-top:24px;font-size:12px;color:#94a3b8;">${new Date().toLocaleString('es-PA')}</p>
      </body></html>`)
    ventana.document.close()
    ventana.focus()
    ventana.print()
    ventana.close()
  }

  function escapeHtml(s: string) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  const handleAceptarCotizacion = async () => {
    setEnviando(true)
    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          apellido: form.apellido,
          correo: form.correo,
          tipoServicio: form.tipoServicio,
          servicio: servicio?.label ?? '',
          cantidadPaginas: needsPages ? String(form.cantidadPaginas) : '',
          incluyeDominioHostingCorreo:
            needsDomainEmail && (form.tieneDominio === 'no' || form.tieneCorreo === 'no')
              ? 'Sí (dominio/correo en presupuesto)'
              : 'No aplica',
          pasarelaPagos:
            !esPasarelaSolo && needsPages && form.incluirPasarelaAddon
              ? 'Sí (add-on)'
              : esPasarelaSolo
                ? 'Servicio pasarela'
                : 'No',
          total: `$${total}${monthly ? '/mes' : ''}`,
          totalNumeric: total,
          monthly,
          tieneDominio: form.tieneDominio,
          tieneCorreo: form.tieneCorreo,
          breakdown: { lines },
          comentarios: form.comentarios,
          ...(needsPages
            ? {
                observacionImagenes: OBSERVACIONES_IMAGENES,
                observacionHostingDb: OBSERVACIONES_HOSTING_DB,
              }
            : {}),
        }),
      })
      if (response.ok) setCotizacionEnviada(true)
      else throw new Error('Error')
    } catch (e) {
      console.error(e)
      alert('No se pudo enviar la cotización. Intenta de nuevo o contáctanos.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-950 pt-24 sm:pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-white/10 mb-4">
              <Sparkles className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Solicitar cotización</h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
              Completa por partes: datos generales, tipo de servicio y detalles. Obtén un presupuesto claro en USD.
            </p>
          </motion.div>

          {/* Pasos */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-10">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className={`rounded-xl border px-2 py-3 sm:px-3 text-left transition-colors ${
                  paso === s.n
                    ? 'border-blue-500/60 bg-blue-500/10 ring-1 ring-blue-500/30'
                    : paso > s.n
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : 'border-white/10 bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      paso > s.n
                        ? 'bg-emerald-500 text-white'
                        : paso === s.n
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/10 text-slate-500'
                    }`}
                  >
                    {paso > s.n ? <Check className="w-3.5 h-3.5" /> : s.n}
                  </span>
                  <span className="text-[11px] sm:text-xs font-semibold text-white leading-tight">{s.title}</span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 pl-9 hidden sm:block">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-900/50 rounded-2xl border border-white/10 p-5 sm:p-8 shadow-2xl shadow-black/40">
            {paso === 1 && (
              <motion.section
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <div className="flex items-center gap-2 text-blue-400 mb-2">
                  <User className="w-5 h-5" />
                  <h2 className="text-lg font-semibold text-white">1. Datos generales</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Nombre</label>
                    <input
                      type="text"
                      value={form.nombre}
                      onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Apellido</label>
                    <input
                      type="text"
                      value={form.apellido}
                      onChange={(e) => setForm((f) => ({ ...f, apellido: e.target.value }))}
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Tu apellido"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Correo electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={form.correo}
                      onChange={(e) => setForm((f) => ({ ...f, correo: e.target.value }))}
                      className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="tu@correo.com"
                    />
                  </div>
                </div>
              </motion.section>
            )}

            {paso === 2 && (
              <motion.section initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="flex items-center gap-2 text-blue-400 mb-2">
                  <Layers className="w-5 h-5" />
                  <h2 className="text-lg font-semibold text-white">2. Tipo de servicio</h2>
                </div>
                <p className="text-sm text-slate-500">Selecciona una opción. Los precios base se muestran en USD.</p>
                <div className="space-y-2 max-h-[min(60vh,420px)] overflow-y-auto pr-1 admin-table-scroll">
                  {QUOTE_SERVICES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          tipoServicio: s.id,
                          incluirPasarelaAddon: false,
                        }))
                      }
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 ${
                        form.tipoServicio === s.id
                          ? 'border-blue-500 bg-blue-500/15 text-white'
                          : 'border-white/15 bg-white/[0.03] text-slate-300 hover:border-white/25'
                      }`}
                    >
                      <span className="text-sm">{s.label}</span>
                      <span className="font-semibold text-blue-400 text-sm whitespace-nowrap">
                        ${s.price}
                        {s.monthly ? '/mes' : ''}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.section>
            )}

            {paso === 3 && (
              <motion.section initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="flex items-center gap-2 text-blue-400 mb-2">
                  <Calculator className="w-5 h-5" />
                  <h2 className="text-lg font-semibold text-white">3. Detalles del proyecto</h2>
                </div>

                {needsPages && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Cantidad de páginas a desarrollar (incluye hasta {MAX_INCLUDED_PAGES} en base)
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
                      className="w-full max-w-xs bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white"
                    />
                    {paginasExtra > 0 && (
                      <p className="text-xs text-blue-400 mt-2">
                        +${PRICE_EXTRA_PAGE_USD} por página adicional ({paginasExtra} páginas × ${PRICE_EXTRA_PAGE_USD} = $
                        {paginasExtra * PRICE_EXTRA_PAGE_USD})
                      </p>
                    )}
                  </div>
                )}

                {needsDomainEmail && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <span className="block text-sm font-medium text-slate-300 mb-2">¿Ya tienes dominio?</span>
                      <div className="flex gap-2">
                        {(['si', 'no'] as const).map((op) => (
                          <button
                            key={op}
                            type="button"
                            onClick={() => setForm((f) => ({ ...f, tieneDominio: op }))}
                            className={`flex-1 py-2.5 rounded-xl border text-sm ${
                              form.tieneDominio === op
                                ? 'border-blue-500 bg-blue-500/20 text-white'
                                : 'border-white/15 text-slate-400'
                            }`}
                          >
                            {op === 'si' ? 'Sí' : `No (+$${PRICE_DOMAIN_USD})`}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-slate-300 mb-2">¿Correo profesional?</span>
                      <div className="flex gap-2">
                        {(['si', 'no'] as const).map((op) => (
                          <button
                            key={op}
                            type="button"
                            onClick={() => setForm((f) => ({ ...f, tieneCorreo: op }))}
                            className={`flex-1 py-2.5 rounded-xl border text-sm ${
                              form.tieneCorreo === op
                                ? 'border-blue-500 bg-blue-500/20 text-white'
                                : 'border-white/15 text-slate-400'
                            }`}
                          >
                            {op === 'si' ? 'Sí' : `No (+$${PRICE_EMAIL_USD})`}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {needsPages && !esPasarelaSolo && (
                  <label className="flex items-start gap-3 cursor-pointer rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <input
                      type="checkbox"
                      checked={form.incluirPasarelaAddon}
                      onChange={(e) => setForm((f) => ({ ...f, incluirPasarelaAddon: e.target.checked }))}
                      className="mt-1 rounded border-white/30 bg-white/5 text-blue-500"
                    />
                    <span className="text-sm text-slate-300">
                      Añadir integración de pasarela de pagos al sitio (+$200)
                    </span>
                  </label>
                )}

                {needsPages && (
                  <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 space-y-2">
                    <p className="text-xs text-slate-300 flex gap-2">
                      <Info className="w-4 h-4 shrink-0 text-blue-400" />
                      {OBSERVACIONES_IMAGENES}
                    </p>
                    <p className="text-xs text-slate-400 flex gap-2">
                      <Info className="w-4 h-4 shrink-0 text-blue-400/80" />
                      {OBSERVACIONES_HOSTING_DB}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Comentarios adicionales</label>
                  <textarea
                    value={form.comentarios}
                    onChange={(e) => setForm((f) => ({ ...f, comentarios: e.target.value }))}
                    rows={3}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-slate-500 resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Describe tu proyecto, plazos o referencias..."
                  />
                </div>
              </motion.section>
            )}

            {paso === 4 && (
              <motion.section
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="bg-white text-slate-900 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 px-4 sm:px-6 py-5 border-b border-slate-200">
                    <div>
                      <div className="relative h-12 w-44 sm:h-14 sm:w-52 max-w-full">
                        <Image
                          src={INVOICE_BRANDING.logoPath}
                          alt={INVOICE_BRANDING.logoAlt}
                          fill
                          className="object-contain object-left"
                          sizes="(max-width: 640px) 176px, 208px"
                          priority
                        />
                      </div>
                      <p className="text-base sm:text-lg font-bold mt-3" style={{ color: INVOICE_BRANDING.accentHex }}>
                        {INVOICE_BRANDING.businessName}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-600">{INVOICE_BRANDING.businessSubtitle}</p>
                      <p className="text-[11px] text-slate-500 mt-1">RUC: {INVOICE_BRANDING.ruc}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: INVOICE_BRANDING.accentHex }}>
                        COTIZACIÓN
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{new Date().toLocaleDateString('es-PA')}</p>
                    </div>
                  </div>

                  <div className="px-4 sm:px-6 py-4">
                    <div
                      className="text-white text-[11px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-t inline-block"
                      style={{ backgroundColor: INVOICE_BRANDING.accentHex }}
                    >
                      Cliente
                    </div>
                    <div className="border border-t-0 border-slate-200 rounded-b px-3 py-3 text-sm">
                      <p className="font-semibold text-slate-900 break-words">
                        {form.nombre} {form.apellido}
                      </p>
                      <p className="text-slate-600 break-all">{form.correo}</p>
                    </div>
                  </div>

                  <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[280px] text-xs sm:text-sm border border-slate-200 rounded-lg overflow-hidden">
                        <thead>
                          <tr style={{ backgroundColor: INVOICE_BRANDING.accentHex }} className="text-white">
                            <th className="text-left px-3 py-2 font-semibold">Concepto</th>
                            <th className="text-right px-3 py-2 font-semibold whitespace-nowrap">Importe</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {lines.map((l, i) => (
                            <tr key={i}>
                              <td className="px-3 py-2 text-slate-800 break-words">{l.label}</td>
                              <td className="px-3 py-2 text-right tabular-nums whitespace-nowrap">${l.amount.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div
                      className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-white px-4 py-3 rounded-lg"
                      style={{ backgroundColor: INVOICE_BRANDING.accentHex }}
                    >
                      <span className="font-bold uppercase text-sm">Total estimado</span>
                      <span className="text-lg sm:text-xl font-bold tabular-nums">
                        ${total.toFixed(2)} USD{monthly ? ' / mes' : ''}
                      </span>
                    </div>
                  </div>
                </div>

                {cotizacionEnviada ? (
                  <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                    <CheckCircle className="w-5 h-5 shrink-0" />
                    <p>Cotización enviada. Te contactaremos pronto.</p>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-5 py-3.5 rounded-xl font-medium transition-colors print:hidden"
                    >
                      <Printer className="w-5 h-5" />
                      Imprimir / PDF
                    </button>
                    <button
                      type="button"
                      onClick={handleAceptarCotizacion}
                      disabled={enviando}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-3.5 rounded-xl font-medium disabled:opacity-60"
                    >
                      {enviando ? 'Enviando…' : (
                        <>
                          <Send className="w-5 h-5" /> Enviar cotización
                        </>
                      )}
                    </button>
                  </div>
                )}

                <p className="text-xs text-slate-500 text-center">
                  Al enviar, recibimos tu solicitud en nuestro correo de seguimiento.
                </p>
                <Link href="/#contact" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm">
                  ¿Prefieres hablar antes? Contactar
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.section>
            )}
          </div>

          <div className="flex justify-between items-center mt-8">
            {paso > 1 && paso < 4 && (
              <button
                type="button"
                onClick={() => setPaso((p) => p - 1)}
                className="text-slate-400 hover:text-white text-sm py-2"
              >
                Atrás
              </button>
            )}
            {paso < 4 ? (
              <button
                type="button"
                onClick={() => setPaso((p) => p + 1)}
                disabled={!puedeSiguiente}
                className="ml-auto flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {paso === 3 ? 'Ver resumen' : 'Siguiente'}
                <ArrowRight className="w-4 h-4" />
              </button>
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
