'use client'

import { useMemo, useState } from 'react'
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
  MAX_INCLUDED_PAGES,
  PRICE_EXTRA_PAGE_USD,
  buildCatalogQuoteServiceSnapshot,
  combineQuoteServiceSnapshots,
  formatQuoteProjectSummary,
  getQuoteAddonIfMissing,
  getService,
  summarizeQuoteServiceLabels,
  type QuoteServiceSnapshot,
  type YesNo,
} from '@/lib/quote-pricing'
import { INVOICE_BRANDING } from '@/lib/invoice-branding'
import { rateLimitFriendlyMessage } from '@/lib/utils'

const OBSERVACIONES_IMAGENES =
  'Cada sitio web puede requerir funcionalidades adicionales según el alcance. En esos casos, contacta al desarrollador, ya que podrían generarse gastos extras.'
const OBSERVACIONES_HOSTING_DB =
  'Hosting y base de datos dependen del tráfico y escala del proyecto; se acuerdan según necesidad.'

const STEPS = [
  { n: 1, title: 'Datos generales' },
  { n: 2, title: 'Servicios' },
  { n: 3, title: 'Detalles' },
  { n: 4, title: 'Resumen' },
] as const

type PublicServiceConfig = {
  cantidadPaginas: number
  tieneDominio: YesNo
  tieneCorreo: YesNo
  incluirPasarelaAddon: boolean
}

function createServiceConfig(serviceId: string): PublicServiceConfig {
  const service = getService(serviceId)
  return {
    cantidadPaginas: service?.needsPages ? MAX_INCLUDED_PAGES : 1,
    tieneDominio: '',
    tieneCorreo: '',
    incluirPasarelaAddon: false,
  }
}

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function buildSelectedServices(
  selectedIds: string[],
  serviceConfigs: Record<string, PublicServiceConfig>
): QuoteServiceSnapshot[] {
  return selectedIds
    .map((serviceId) => {
      const config = serviceConfigs[serviceId] ?? createServiceConfig(serviceId)
      return buildCatalogQuoteServiceSnapshot({
        serviceId,
        cantidadPaginas: config.cantidadPaginas,
        tieneDominio: config.tieneDominio,
        tieneCorreo: config.tieneCorreo,
        incluirPasarelaAddon: config.incluirPasarelaAddon,
      })
    })
    .filter(Boolean) as QuoteServiceSnapshot[]
}

export default function CotizacionPage() {
  const [paso, setPaso] = useState(1)
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    selectedServices: [] as string[],
    serviceConfigs: {} as Record<string, PublicServiceConfig>,
    comentarios: '',
  })
  const [enviando, setEnviando] = useState(false)
  const [cotizacionEnviada, setCotizacionEnviada] = useState(false)
  const [correoPdfOk, setCorreoPdfOk] = useState(true)
  const [envioError, setEnvioError] = useState('')

  const selectedServices = useMemo(
    () => buildSelectedServices(form.selectedServices, form.serviceConfigs),
    [form.selectedServices, form.serviceConfigs]
  )
  const selectedCatalogServices = useMemo(
    () =>
      form.selectedServices
        .map((serviceId) => getService(serviceId))
        .filter(Boolean) as NonNullable<ReturnType<typeof getService>>[],
    [form.selectedServices]
  )
  const pricing = useMemo(() => combineQuoteServiceSnapshots(selectedServices), [selectedServices])
  const serviceSummary = useMemo(
    () => summarizeQuoteServiceLabels(selectedServices.map((service) => service.label)),
    [selectedServices]
  )

  const puedePaso1 =
    form.nombre.trim() &&
    form.apellido.trim() &&
    form.correo.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)

  const puedePaso2 = selectedServices.length > 0 && !pricing.mixedBilling

  const puedePaso3 =
    selectedCatalogServices.every((service) => {
      const config = form.serviceConfigs[service.id] ?? createServiceConfig(service.id)
      const paginasOk = !service.needsPages || (config.cantidadPaginas >= 1 && config.cantidadPaginas <= 50)
      const dominioOk =
        !service.needsDomainEmail || (config.tieneDominio === 'si' || config.tieneDominio === 'no')
      const correoOk =
        !service.needsDomainEmail || (config.tieneCorreo === 'si' || config.tieneCorreo === 'no')
      return paginasOk && dominioOk && correoOk
    }) && !pricing.mixedBilling

  const puedeSiguiente =
    (paso === 1 && puedePaso1) ||
    (paso === 2 && puedePaso2) ||
    (paso === 3 && puedePaso3) ||
    paso === 4

  const updateServiceConfig = (serviceId: string, patch: Partial<PublicServiceConfig>) => {
    setForm((current) => ({
      ...current,
      serviceConfigs: {
        ...current.serviceConfigs,
        [serviceId]: {
          ...(current.serviceConfigs[serviceId] ?? createServiceConfig(serviceId)),
          ...patch,
        },
      },
    }))
  }

  const toggleService = (serviceId: string) => {
    setForm((current) => {
      const alreadySelected = current.selectedServices.includes(serviceId)
      const nextSelected = alreadySelected
        ? current.selectedServices.filter((id) => id !== serviceId)
        : [...current.selectedServices, serviceId]

      return {
        ...current,
        selectedServices: nextSelected,
        serviceConfigs: current.serviceConfigs[serviceId]
          ? current.serviceConfigs
          : {
              ...current.serviceConfigs,
              [serviceId]: createServiceConfig(serviceId),
            },
      }
    })
  }

  const handlePrint = () => {
    const ventana = window.open('', '_blank')
    if (!ventana) return

    const accent = INVOICE_BRANDING.accentHex
    const clientName = `${form.nombre} ${form.apellido}`.trim()
    const projectSummary = formatQuoteProjectSummary({ clientName })
    const lineasHtml = pricing.lines
      .map(
        (line) =>
          `<tr><td style="padding:10px;border-bottom:1px solid #e2e8f0;">${escapeHtml(line.label)}</td><td style="padding:10px;text-align:right;border-bottom:1px solid #e2e8f0;white-space:nowrap;">$${line.amount.toFixed(2)}</td></tr>`
      )
      .join('')
    const servicesHtml = selectedServices
      .map((service) => {
        return `<div style="border:1px solid #e2e8f0;border-radius:10px;padding:14px;margin-bottom:12px;">
            <div style="display:flex;justify-content:space-between;gap:16px;align-items:flex-start;">
              <p style="margin:0;font-weight:700;color:${accent};">${escapeHtml(service.label)}</p>
              <p style="margin:0;font-weight:700;color:#0f172a;white-space:nowrap;">$${service.total.toFixed(2)}${pricing.monthly ? '/mes' : ''}</p>
            </div>
          </div>`
      })
      .join('')
    const includesHtml = selectedServices
      .map((service) => {
        const pointsHtml = service.offerPoints.length
          ? `<ul style="margin:10px 0 0;padding-left:18px;color:#334155;font-size:13px;line-height:1.6;">${service.offerPoints
              .map((point) => `<li>${escapeHtml(point)}</li>`)
              .join('')}</ul>`
          : '<p style="margin:10px 0 0;color:#64748b;font-size:13px;">Alcance sujeto a la cotización aprobada.</p>'
        return `<div style="border:1px solid #e2e8f0;border-radius:10px;padding:14px;margin-bottom:12px;">
            <p style="margin:0;font-weight:700;color:${accent};">${escapeHtml(service.label)}</p>
            ${pointsHtml}
          </div>`
      })
      .join('')

    ventana.document.write(`<!DOCTYPE html><html><head><title>Cotización — Nixon Lopez Services</title>
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
          <span class="label">Servicios incluidos</span>
          <p style="margin:0 0 12px;color:#64748b;font-size:13px;">${escapeHtml(projectSummary)}</p>
          <div class="client">${servicesHtml || '<p style="margin:0;color:#64748b;">Sin servicios seleccionados.</p>'}</div>
        </section>
        <section class="block" style="padding-top:0">
          <table><thead><tr><th>Concepto</th><th class="num">Importe</th></tr></thead><tbody>${lineasHtml}</tbody></table>
          <div class="total"><span>Total estimado</span><b>$${pricing.total.toFixed(2)} USD${pricing.monthly ? ' / mes' : ''}</b></div>
        </section>
        <section class="block" style="padding-top:0">
          <span class="label">Lo que incluye cada servicio</span>
          <div class="client">${includesHtml || '<p style="margin:0;color:#64748b;">Sin detalle de servicios.</p>'}</div>
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

  const handleAceptarCotizacion = async () => {
    setEnvioError('')
    setEnviando(true)
    try {
      const includesDomainOrEmail = selectedServices.some(
        (service) => service.hasDomain === 'no' || service.hasProfessionalEmail === 'no'
      )
      const hasPaymentGateway = selectedServices.some(
        (service) =>
          service.serviceId === 'pasarela' ||
          service.lines.some((line) => line.label.toLowerCase().includes('pasarela'))
      )

      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          apellido: form.apellido,
          correo: form.correo,
          tipoServicio: selectedServices.length === 1 ? selectedServices[0].serviceId : 'multiple',
          servicio: serviceSummary,
          cantidadPaginas:
            selectedServices.length === 1 && selectedServices[0].quantityPages != null
              ? String(selectedServices[0].quantityPages)
              : '',
          incluyeDominioHostingCorreo: includesDomainOrEmail
            ? 'Sí, según el desglose por servicio de la cotización.'
            : 'No aplica',
          pasarelaPagos: hasPaymentGateway ? 'Sí, según el desglose por servicio.' : 'No',
          total: `$${pricing.total.toFixed(2)}${pricing.monthly ? '/mes' : ''}`,
          totalNumeric: pricing.total,
          monthly: pricing.monthly,
          breakdown: { lines: pricing.lines },
          selected_services: selectedServices,
          comentarios: form.comentarios,
          ...(selectedServices.some((service) => service.quantityPages != null)
            ? {
                observacionImagenes: OBSERVACIONES_IMAGENES,
                observacionHostingDb: OBSERVACIONES_HOSTING_DB,
              }
            : {}),
        }),
      })

      if (response.ok) {
        const data = (await response.json().catch(() => ({}))) as { clientEmailSent?: boolean }
        setCorreoPdfOk(data.clientEmailSent !== false)
        setCotizacionEnviada(true)
      } else if (response.status === 429) {
        setEnvioError(rateLimitFriendlyMessage(response.headers.get('Retry-After')))
      } else {
        const data = (await response.json().catch(() => null)) as { error?: string } | null
        setEnvioError(
          typeof data?.error === 'string'
            ? data.error
            : 'No se pudo enviar la cotización. Intenta de nuevo o contáctanos por contacto.'
        )
      }
    } catch (error) {
      console.error(error)
      setEnvioError('No se pudo enviar la cotización. Intenta de nuevo o contáctanos.')
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
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Cotización online</h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Presupuesto estimado en USD, sin compromiso. Ahora puedes combinar varios servicios en una sola cotización.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-10">
            {STEPS.map((step) => (
              <div
                key={step.n}
                className={`rounded-xl border px-2 py-3 sm:px-3 text-left transition-colors ${
                  paso === step.n
                    ? 'border-blue-500/60 bg-blue-500/10 ring-1 ring-blue-500/30'
                    : paso > step.n
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : 'border-white/10 bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      paso > step.n
                        ? 'bg-emerald-500 text-white'
                        : paso === step.n
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/10 text-slate-500'
                    }`}
                  >
                    {paso > step.n ? <Check className="w-3.5 h-3.5" /> : step.n}
                  </span>
                  <span className="text-[11px] sm:text-xs font-semibold text-white leading-tight">{step.title}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900/50 rounded-2xl border border-white/10 p-5 sm:p-8 shadow-2xl shadow-black/40">
            {paso === 1 ? (
              <motion.section initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <div className="flex items-center gap-2 text-blue-400 mb-2">
                  <User className="w-5 h-5" />
                  <h2 className="text-lg font-semibold text-white">Datos de contacto</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Nombre</label>
                    <input
                      type="text"
                      value={form.nombre}
                      onChange={(e) => setForm((current) => ({ ...current, nombre: e.target.value }))}
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Apellido</label>
                    <input
                      type="text"
                      value={form.apellido}
                      onChange={(e) => setForm((current) => ({ ...current, apellido: e.target.value }))}
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
                      onChange={(e) => setForm((current) => ({ ...current, correo: e.target.value }))}
                      className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="tu@correo.com"
                    />
                  </div>
                </div>
              </motion.section>
            ) : null}

            {paso === 2 ? (
              <motion.section initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="flex items-center gap-2 text-blue-400 mb-2">
                  <Layers className="w-5 h-5" />
                  <h2 className="text-lg font-semibold text-white">Elige uno o varios servicios</h2>
                </div>
                <p className="text-sm text-slate-500">
                  Puedes armar un paquete completo y recibir una sola cotización con un solo contrato.
                </p>
                {pricing.mixedBilling ? (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                    No combines servicios mensuales con servicios de pago único en el mismo documento.
                  </div>
                ) : null}
                <div className="space-y-2 max-h-[min(60vh,420px)] overflow-y-auto pr-1 admin-table-scroll">
                  {QUOTE_SERVICES.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => toggleService(service.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 ${
                        form.selectedServices.includes(service.id)
                          ? 'border-blue-500 bg-blue-500/15 text-white ring-1 ring-blue-500/20'
                          : 'border-white/15 bg-white/[0.03] text-slate-300 hover:border-white/25'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{service.label}</span>
                          {form.selectedServices.includes(service.id) ? <Check className="w-4 h-4 text-blue-300" /> : null}
                        </div>
                        <p className="mt-1 text-xs text-slate-400 line-clamp-2">{service.offerPoints[0]}</p>
                      </div>
                      <span className="font-semibold text-blue-400 text-sm whitespace-nowrap">
                        ${service.price}
                        {service.monthly ? '/mes' : ''}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-400">
                  Seleccionados: <span className="text-white font-medium">{selectedServices.length}</span>
                </p>
              </motion.section>
            ) : null}

            {paso === 3 ? (
              <motion.section initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="flex items-center gap-2 text-blue-400 mb-2">
                  <Calculator className="w-5 h-5" />
                  <h2 className="text-lg font-semibold text-white">Detalles de cada servicio</h2>
                </div>

                {selectedCatalogServices.map((service) => {
                  const config = form.serviceConfigs[service.id] ?? createServiceConfig(service.id)
                  const quoteAddOns = getQuoteAddonIfMissing(service)
                  const paginasExtra =
                    service.needsPages && config.cantidadPaginas > MAX_INCLUDED_PAGES
                      ? config.cantidadPaginas - MAX_INCLUDED_PAGES
                      : 0

                  return (
                    <div key={service.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div>
                          <h3 className="text-base font-semibold text-white">{service.label}</h3>
                          <p className="text-xs text-slate-400 mt-1">
                            Configura este servicio dentro de la misma cotización.
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-blue-400">
                          ${service.price}
                          {service.monthly ? '/mes' : ''}
                        </span>
                      </div>

                      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-300">Qué incluye</p>
                        <ul className="mt-2 space-y-2 text-sm text-slate-300 list-disc pl-5">
                          {service.offerPoints.map((point) => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                      </div>

                      {service.needsPages ? (
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Páginas a desarrollar (hasta {MAX_INCLUDED_PAGES} incluidas en el precio base)
                          </label>
                          <input
                            type="number"
                            min={1}
                            max={50}
                            value={config.cantidadPaginas}
                            onChange={(e) =>
                              updateServiceConfig(service.id, {
                                cantidadPaginas: Math.max(1, Math.min(50, Number(e.target.value) || 1)),
                              })
                            }
                            className="w-full max-w-xs bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white"
                          />
                          {paginasExtra > 0 ? (
                            <p className="text-xs text-blue-400 mt-2">
                              +${PRICE_EXTRA_PAGE_USD} por página adicional ({paginasExtra} páginas × ${PRICE_EXTRA_PAGE_USD} =
                              ${paginasExtra * PRICE_EXTRA_PAGE_USD})
                            </p>
                          ) : null}
                        </div>
                      ) : null}

                      {service.needsDomainEmail ? (
                        <div className="grid gap-4 sm:grid-cols-2 sm:items-stretch">
                          <div className="flex flex-col sm:h-full">
                            <span className="block text-sm font-medium text-slate-300 mb-2">¿Ya tienes dominio?</span>
                            <div className="hidden min-h-0 sm:block sm:flex-1" aria-hidden />
                            <div className="mt-auto flex gap-2">
                              {(['si', 'no'] as const).map((option) => (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => updateServiceConfig(service.id, { tieneDominio: option })}
                                  className={`flex-1 py-2.5 rounded-xl border text-sm ${
                                    config.tieneDominio === option
                                      ? 'border-blue-500 bg-blue-500/20 text-white'
                                      : 'border-white/15 text-slate-400'
                                  }`}
                                >
                                  {option === 'si' ? 'Sí' : `No (+$${quoteAddOns.domainUsd})`}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-col sm:h-full">
                            {quoteAddOns.isWordPressHosting ? (
                              <>
                                <span className="block text-sm font-medium text-slate-300 mb-1">
                                  ¿Ya tienes hosting para el sitio?
                                </span>
                                <span className="block text-xs text-slate-500 mb-2 leading-snug">
                                  Si no, el 1.er año de hosting va en presupuesto (+${quoteAddOns.secondUsd}).
                                </span>
                              </>
                            ) : (
                              <span className="block text-sm font-medium text-slate-300 mb-2">¿Correo profesional?</span>
                            )}
                            <div className="hidden min-h-0 sm:block sm:flex-1" aria-hidden />
                            <div className="mt-auto flex gap-2">
                              {(['si', 'no'] as const).map((option) => (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => updateServiceConfig(service.id, { tieneCorreo: option })}
                                  className={`flex-1 py-2.5 rounded-xl border text-sm ${
                                    config.tieneCorreo === option
                                      ? 'border-blue-500 bg-blue-500/20 text-white'
                                      : 'border-white/15 text-slate-400'
                                  }`}
                                >
                                  {option === 'si' ? 'Sí' : `No (+$${quoteAddOns.secondUsd})`}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : null}

                      {service.needsPages && service.id !== 'pasarela' ? (
                        <label className="flex items-start gap-3 cursor-pointer rounded-xl border border-white/10 bg-white/[0.03] p-4">
                          <input
                            type="checkbox"
                            checked={config.incluirPasarelaAddon}
                            onChange={(e) =>
                              updateServiceConfig(service.id, { incluirPasarelaAddon: e.target.checked })
                            }
                            className="mt-1 rounded border-white/30 bg-white/5 text-blue-500"
                          />
                          <span className="text-sm text-slate-300">
                            Añadir integración de pasarela de pagos al sitio (+$200)
                          </span>
                        </label>
                      ) : null}
                    </div>
                  )
                })}

                {selectedCatalogServices.some((service) => service.needsPages) ? (
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
                ) : null}

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Comentarios adicionales</label>
                  <textarea
                    value={form.comentarios}
                    onChange={(e) => setForm((current) => ({ ...current, comentarios: e.target.value }))}
                    rows={3}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-slate-500 resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Ej.: referencias de diseño, plazos deseados, integraciones…"
                  />
                </div>
              </motion.section>
            ) : null}

            {paso === 4 ? (
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

                  <div className="px-4 sm:px-6 pb-4">
                    <div
                      className="text-white text-[11px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-t inline-block"
                      style={{ backgroundColor: INVOICE_BRANDING.accentHex }}
                    >
                      Servicios incluidos
                    </div>
                    <div className="border border-t-0 border-slate-200 rounded-b px-3 py-3 space-y-4">
                      <p className="text-xs text-slate-500">
                        {formatQuoteProjectSummary({
                          clientName: `${form.nombre} ${form.apellido}`.trim(),
                        })}
                      </p>
                      {selectedServices.map((service) => (
                        <div key={service.serviceId} className="rounded-lg border border-slate-200 p-3">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <p className="font-semibold text-slate-900">{service.label}</p>
                            <p className="font-semibold text-slate-700">
                              ${service.total.toFixed(2)}
                              {pricing.monthly ? ' / mes' : ''}
                            </p>
                          </div>
                        </div>
                      ))}
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
                          {pricing.lines.map((line, index) => (
                            <tr key={`${line.label}-${index}`}>
                              <td className="px-3 py-2 text-slate-800 break-words">{line.label}</td>
                              <td className="px-3 py-2 text-right tabular-nums whitespace-nowrap">
                                ${line.amount.toFixed(2)}
                              </td>
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
                        ${pricing.total.toFixed(2)} USD{pricing.monthly ? ' / mes' : ''}
                      </span>
                    </div>

                    <div className="mt-6">
                      <div
                        className="text-white text-[11px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-t inline-block"
                        style={{ backgroundColor: INVOICE_BRANDING.accentHex }}
                      >
                        Lo que incluye cada servicio
                      </div>
                      <div className="border border-t-0 border-slate-200 rounded-b px-3 py-3 space-y-4">
                        {selectedServices.map((service) => (
                          <div key={`${service.serviceId}-includes`} className="rounded-lg border border-slate-200 p-3">
                            <p className="font-semibold text-slate-900">{service.label}</p>
                            {service.offerPoints.length ? (
                              <ul className="mt-3 text-sm text-slate-700 list-disc pl-5 space-y-1">
                                {service.offerPoints.map((point) => (
                                  <li key={point}>{point}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="mt-2 text-sm text-slate-600">Alcance sujeto a la cotización aprobada.</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {cotizacionEnviada ? (
                  correoPdfOk ? (
                    <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                      <CheckCircle className="w-5 h-5 shrink-0" />
                      <p>
                        Hemos recibido tu cotización. Revisa tu correo: te enviamos el resumen y el contrato en PDF,
                        con el enlace para enviarlo por WhatsApp cuando lo tengas listo.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 text-amber-100 bg-amber-500/10 border border-amber-500/35 rounded-xl p-4">
                      <div className="flex items-start gap-2">
                        <Info className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                        <p>
                          Tu cotización quedó registrada, pero <strong className="font-semibold">no pudimos entregar el correo con los PDFs</strong> a{' '}
                          <span className="break-all">{form.correo}</span>.
                        </p>
                      </div>
                      <p className="text-sm text-slate-300 pl-7">
                        Escríbenos a{' '}
                        <a href={`mailto:${INVOICE_BRANDING.email}`} className="text-blue-300 hover:underline break-all">
                          {INVOICE_BRANDING.email}
                        </a>{' '}
                        indicando tu nombre y este correo; te reenviamos los archivos manualmente.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col gap-3">
                    {envioError ? (
                      <div
                        role="alert"
                        className="flex items-start gap-2 text-amber-100 bg-amber-500/15 border border-amber-500/40 rounded-xl p-4 text-sm"
                      >
                        <Info className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                        <p>{envioError}</p>
                      </div>
                    ) : null}
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
                        {enviando ? (
                          'Enviando…'
                        ) : (
                          <>
                            <Send className="w-5 h-5" /> Enviar cotización
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <p className="text-xs text-slate-500 text-center">
                  Al enviar, tu solicitud llega a nuestro correo para seguimiento.
                </p>
                <Link href="/#contact" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm">
                  ¿Prefieres hablarlo antes? Ir a contacto
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.section>
            ) : null}
          </div>

          <div className="flex justify-between items-center mt-8">
            {paso > 1 && paso < 4 ? (
              <button
                type="button"
                onClick={() => setPaso((current) => current - 1)}
                className="text-slate-400 hover:text-white text-sm py-2"
              >
                Atrás
              </button>
            ) : null}
            {paso < 4 ? (
              <button
                type="button"
                onClick={() => setPaso((current) => current + 1)}
                disabled={!puedeSiguiente}
                className="ml-auto flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {paso === 3 ? 'Ver presupuesto' : 'Siguiente'}
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
