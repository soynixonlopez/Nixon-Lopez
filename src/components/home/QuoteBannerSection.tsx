'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import {
  ArrowRight,
  Calculator,
  Clock,
  Code,
  FileText,
  Headphones,
  ListChecks,
  Lock,
  Mail,
  Monitor,
  Rocket,
  Shield,
  ShoppingCart,
  Zap,
} from 'lucide-react'
import {
  buildWhatsAppUrl,
  QUOTE_DETAIL_OPTIONS,
  QUOTE_FORM_OPTIONS,
  QUOTE_PROCESS_FEATURES,
  QUOTE_SECTION_BENEFITS,
  WHATSAPP_MESSAGES,
  quoteUrl,
} from '@/lib/marketing'

const BENEFIT_ICONS = { zap: Zap, shield: Shield, document: FileText } as const
const FORM_ICONS = { monitor: Monitor, rocket: Rocket, cart: ShoppingCart, code: Code } as const
const PROCESS_ICONS = { clock: Clock, list: ListChecks, mail: Mail, headphones: Headphones } as const

const COLOR_THEMES = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', ring: 'ring-blue-500', border: 'border-blue-200' },
  green: { bg: 'bg-emerald-100', text: 'text-emerald-600', ring: 'ring-emerald-500', border: 'border-emerald-200' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', ring: 'ring-purple-500', border: 'border-purple-200' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', ring: 'ring-orange-500', border: 'border-orange-200' },
} as const

export function QuoteBannerSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const router = useRouter()
  const [selectedService, setSelectedService] = useState<string>(QUOTE_FORM_OPTIONS[0].id)
  const [projectDetail, setProjectDetail] = useState('')

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const option = QUOTE_FORM_OPTIONS.find((item) => item.id === selectedService)
    if (!option) return

    if ('whatsapp' in option && option.whatsapp) {
      const detail = QUOTE_DETAIL_OPTIONS.find((item) => item.value === projectDetail)?.label
      const message = detail
        ? `${WHATSAPP_MESSAGES.customSoftware} (${detail})`
        : WHATSAPP_MESSAGES.customSoftware
      window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer')
      return
    }

    router.push(quoteUrl(selectedService))
  }

  return (
    <section id="cotizar" ref={ref} className="relative isolate overflow-hidden bg-white py-16 sm:py-24">
      <div
        className="pointer-events-none absolute top-0 left-0 h-64 w-64 rounded-full bg-gradient-to-br from-blue-100/50 to-transparent blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-gradient-to-tl from-purple-100/40 to-transparent blur-3xl"
        aria-hidden
      />

      <div className="container-padding relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-3.5 py-1.5 mb-5">
              <Calculator className="h-4 w-4 text-brand" aria-hidden />
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                Cotización transparente
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-[2.5rem] font-bold tracking-tight text-slate-900 leading-tight">
              Descubre cuánto cuesta tu proyecto{' '}
              <span className="gradient-text">en minutos</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Selecciona lo que necesitas y recibe una propuesta personalizada con alcance, inversión estimada y
              próximos pasos.
            </p>

            <ul className="mt-8 space-y-5">
              {QUOTE_SECTION_BENEFITS.map((benefit) => {
                const Icon = BENEFIT_ICONS[benefit.icon]
                const theme = COLOR_THEMES[benefit.color]
                return (
                  <li key={benefit.title} className="flex items-start gap-4">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${theme.bg}`}>
                      <Icon className={`h-5 w-5 ${theme.text}`} aria-hidden />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{benefit.title}</p>
                      <p className="mt-0.5 text-sm sm:text-base text-slate-600 leading-relaxed">{benefit.description}</p>
                    </div>
                  </li>
                )
              })}
            </ul>

            <Link
              href={quoteUrl()}
              className="mt-8 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-brand px-6 py-4 min-h-[52px] text-base font-semibold text-white shadow-md transition hover:bg-brand-light active:scale-[0.98]"
            >
              Comenzar mi cotización
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-slate-500">
              <Lock className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
              Tus datos están seguros. No compartimos tu información.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 lg:p-7 shadow-[0_12px_40px_rgba(15,23,42,0.08)]"
            >
              <div className="flex items-start gap-3 mb-6 pb-5 border-b border-slate-100">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                  <Calculator className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Cotizador online</p>
                  <p className="text-sm text-slate-500">Cuéntanos qué necesitas</p>
                </div>
              </div>

              <fieldset className="space-y-3">
                <legend className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                    1
                  </span>
                  ¿Qué tipo de proyecto necesitas?
                </legend>
                {QUOTE_FORM_OPTIONS.map((option) => {
                  const Icon = FORM_ICONS[option.icon]
                  const theme = COLOR_THEMES[option.color]
                  const isSelected = selectedService === option.id
                  return (
                    <label
                      key={option.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition ${
                        isSelected
                          ? `${theme.border} bg-slate-50 ring-2 ${theme.ring}`
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="quote-service"
                        value={option.id}
                        checked={isSelected}
                        onChange={() => setSelectedService(option.id)}
                        className="sr-only"
                      />
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${theme.bg}`}>
                        <Icon className={`h-5 w-5 ${theme.text}`} aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900">{option.title}</p>
                        <p className="text-xs sm:text-sm text-slate-500">{option.subtitle}</p>
                      </div>
                    </label>
                  )
                })}
              </fieldset>

              <div className="mt-6">
                <label htmlFor="quote-detail" className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                    2
                  </span>
                  Cuéntanos más sobre tu proyecto
                </label>
                <select
                  id="quote-detail"
                  value={projectDetail}
                  onChange={(event) => setProjectDetail(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
                >
                  <option value="">Selecciona la opción que mejor describa tu proyecto</option>
                  {QUOTE_DETAIL_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 min-h-[52px] text-base font-semibold text-white shadow-md transition hover:from-blue-700 hover:to-purple-700 active:scale-[0.98]"
              >
                Generar mi propuesta
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
              </button>

              <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
                <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                Recibirás tu propuesta al instante en tu correo y WhatsApp.
              </p>
            </form>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, delay: 0.14 }}
          className="mt-10 sm:mt-12 rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white px-5 py-6 sm:px-8 shadow-[0_8px_30px_rgba(15,23,42,0.05)]"
        >
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {QUOTE_PROCESS_FEATURES.map((feature) => {
              const Icon = PROCESS_ICONS[feature.icon]
              const theme = COLOR_THEMES[feature.color]
              return (
                <li key={feature.title} className="flex flex-col items-center text-center sm:items-start sm:text-left">
                  <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-2xl ${theme.bg}`}>
                    <Icon className={`h-5 w-5 ${theme.text}`} aria-hidden />
                  </div>
                  <p className="font-bold text-slate-900 text-sm sm:text-base">{feature.title}</p>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                </li>
              )
            })}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}
