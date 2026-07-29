'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  ArrowRight,
  Calendar,
  Check,
  Clock,
  Headphones,
  Lock,
  MessageCircle,
  Monitor,
  Rocket,
  Settings,
  ShieldCheck,
  ShoppingCart,
} from 'lucide-react'
import TechLogo from '@/components/TechLogo'
import {
  buildWhatsAppUrl,
  HOME_SERVICES,
  SERVICES_TRUST_PILLS,
  WHATSAPP_MESSAGES,
  quoteUrl,
} from '@/lib/marketing'

const SERVICE_ICONS = {
  monitor: Monitor,
  rocket: Rocket,
  cart: ShoppingCart,
  settings: Settings,
} as const

const SERVICE_THEMES = {
  blue: {
    iconBg: 'bg-blue-100 text-blue-600',
    accent: 'bg-blue-500',
    check: 'text-blue-500',
    price: 'text-blue-600',
  },
  green: {
    iconBg: 'bg-emerald-100 text-emerald-600',
    accent: 'bg-emerald-500',
    check: 'text-emerald-500',
    price: 'text-emerald-600',
  },
  purple: {
    iconBg: 'bg-purple-100 text-purple-600',
    accent: 'bg-purple-500',
    check: 'text-purple-500',
    price: 'text-purple-600',
  },
  orange: {
    iconBg: 'bg-orange-100 text-orange-600',
    accent: 'bg-orange-500',
    check: 'text-orange-500',
    price: 'text-orange-600',
  },
} as const

const PILL_THEMES = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-emerald-100 text-emerald-600',
  purple: 'bg-purple-100 text-purple-600',
  orange: 'bg-orange-100 text-orange-600',
} as const

const PILL_ICONS = {
  clock: Clock,
  message: MessageCircle,
  lock: Lock,
  headphones: Headphones,
} as const

function serviceWhatsAppMessage(serviceId: string) {
  switch (serviceId) {
    case 'landing':
      return WHATSAPP_MESSAGES.serviceLanding
    case 'wordpress-tienda-20':
      return WHATSAPP_MESSAGES.serviceStore
    case 'reservas':
      return WHATSAPP_MESSAGES.customSoftware
    default:
      return WHATSAPP_MESSAGES.serviceWeb
  }
}

export function ServicesPreviewSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="services" ref={ref} className="relative isolate overflow-hidden bg-slate-50/80 py-16 sm:py-24">
      <div
        className="pointer-events-none absolute top-10 left-6 sm:left-10 h-24 w-24 opacity-35"
        aria-hidden
        style={{
          backgroundImage: 'radial-gradient(circle, #94a3b8 1.5px, transparent 1.5px)',
          backgroundSize: '12px 12px',
        }}
      />
      <div
        className="pointer-events-none absolute -top-16 right-[-6%] h-80 w-80 rounded-full bg-gradient-to-br from-blue-200/40 via-indigo-200/25 to-purple-200/20 blur-3xl"
        aria-hidden
      />

      <div className="container-padding relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-3.5 py-1.5 mb-4">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-brand">Servicios</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-[2.65rem] font-bold tracking-tight text-slate-900 leading-tight">
            Soluciones digitales para{' '}
            <span className="gradient-text">cada etapa de tu negocio</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Empieza con lo que necesitas hoy y escala cuando tu negocio crezca.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5"
        >
          {HOME_SERVICES.map((service) => {
            const theme = SERVICE_THEMES[service.color]
            const Icon = SERVICE_ICONS[service.icon]
            const isWhatsApp = 'whatsapp' in service && service.whatsapp

            return (
              <article
                key={service.id}
                className="flex flex-col rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)]"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${theme.iconBg}`}>
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">{service.title}</h3>
                <span className={`mt-2 mb-3 h-1 w-10 rounded-full ${theme.accent}`} aria-hidden />
                <p className="text-sm text-slate-600 leading-relaxed">{service.description}</p>

                <ul className="mt-4 space-y-2.5 flex-1">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-slate-700">
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${theme.check}`} strokeWidth={2.5} aria-hidden />
                      {feature}
                    </li>
                  ))}
                </ul>

                <p className="mt-5 text-sm text-slate-500">
                  Inversión:{' '}
                  <span className={`font-bold ${theme.price}`}>{service.priceLabel}</span>
                </p>

                <div className="mt-4">
                  {isWhatsApp ? (
                    <a
                      href={buildWhatsAppUrl(serviceWhatsAppMessage(service.id))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3.5 min-h-[48px] text-sm font-semibold text-white transition hover:bg-brand-light active:scale-[0.98]"
                    >
                      {service.ctaLabel}
                      <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                    </a>
                  ) : (
                    <Link
                      href={quoteUrl(service.id)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3.5 min-h-[48px] text-sm font-semibold text-white transition hover:bg-brand-light active:scale-[0.98]"
                    >
                      {service.ctaLabel}
                      <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                    </Link>
                  )}
                </div>
              </article>
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="mt-8 sm:mt-10 rounded-2xl sm:rounded-3xl border border-blue-100/80 bg-blue-50/60 px-5 py-5 sm:px-8 sm:py-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
            <div className="flex items-start gap-4 lg:max-w-xl">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand text-white">
                <ShieldCheck className="h-6 w-6" aria-hidden />
              </div>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900">Enfoque en resultados, no en tecnología.</span> Cada
                proyecto está pensado para ayudarte a conseguir más clientes, ahorrar tiempo y hacer crecer tu
                negocio.
              </p>
            </div>
            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-5 flex-1">
              {SERVICES_TRUST_PILLS.map((pill) => {
                const PillIcon = PILL_ICONS[pill.icon]
                return (
                  <li key={pill.label} className="flex flex-col items-center text-center gap-2">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${PILL_THEMES[pill.color]}`}
                    >
                      <PillIcon className="h-5 w-5" aria-hidden />
                    </div>
                    <span className="text-xs font-medium text-slate-600 leading-snug">{pill.label}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            href={quoteUrl()}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-brand px-6 py-4 min-h-[52px] text-base font-semibold text-white shadow-md transition hover:bg-brand-light active:scale-[0.98]"
          >
            <Calendar className="h-5 w-5 shrink-0" aria-hidden />
            Agendar una llamada gratuita
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </Link>
          <a
            href={buildWhatsAppUrl(WHATSAPP_MESSAGES.default)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border-2 border-emerald-200 bg-white px-6 py-4 min-h-[52px] text-base font-semibold text-slate-900 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50/50 active:scale-[0.98]"
          >
            <TechLogo name="WhatsApp" size={22} />
            Hablemos por WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  )
}
