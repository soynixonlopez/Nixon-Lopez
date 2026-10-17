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
import { SectionLabel } from '@/components/marketing/SectionLabel'
import { SectionTitle } from '@/components/marketing/SectionTitle'
import { useMessages } from '@/i18n/LocaleProvider'
import { BRAND_ICON_TONES } from '@/lib/brand-icons'
import { buildWhatsAppUrl, SERVICES_TRUST_PILLS, quoteUrl } from '@/lib/marketing'
import { MARKETING_PLANS, WEB_PLANS, type CatalogPlan } from '@/lib/service-catalog'

const PLAN_ICONS: Record<string, typeof Monitor> = {
  landing: Rocket,
  profesional: Monitor,
  'web-panel': Settings,
  corporativo: Monitor,
  tienda: ShoppingCart,
  reservas: Calendar,
  'mkt-presencia': MessageCircle,
  'mkt-crecimiento': Rocket,
  'mkt-integral': Settings,
}

function PlanGrid({
  plans,
  monthly,
  isInView,
}: {
  plans: readonly CatalogPlan[]
  monthly?: boolean
  isInView: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.08 }}
      className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5"
    >
      {plans.map((plan) => {
        const Icon = PLAN_ICONS[plan.id] ?? Monitor
        const theme = BRAND_ICON_TONES[monthly ? 'orange' : 'blue']
        return (
          <article
            key={plan.id}
            className={`flex flex-col rounded-xl border px-5 py-6 sm:px-6 ${monthly ? 'border-amber-200 bg-amber-50/40' : theme.card} ${plan.recommended ? 'ring-2 ring-amber-400' : ''}`}
          >
            <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${monthly ? 'bg-amber-100 text-amber-800' : theme.wrap}`}>
              <Icon className="h-6 w-6" aria-hidden />
            </div>
            {plan.recommended ? (
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-amber-800">Recomendado</p>
            ) : null}
            <h3 className="text-lg font-bold text-slate-900 leading-snug dark:text-slate-50">{plan.label}</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed dark:text-slate-300">{plan.description}</p>
            <ul className="mt-4 space-y-2.5 flex-1">
              {plan.includes.slice(0, 4).map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-slate-700">
                  <Check className={`mt-0.5 h-4 w-4 shrink-0 ${monthly ? 'text-amber-700' : theme.icon}`} strokeWidth={2.5} aria-hidden />
                  {feature}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-slate-500">No incluye: {plan.excludes[0]}</p>
            <p className="mt-3 text-sm text-slate-500">
              Inversión:{' '}
              <span className="font-bold text-slate-900">
                ${plan.basePrice}
                {monthly ? '/mes' : ''}
              </span>
            </p>
            <div className="mt-4">
              <Link
                href={quoteUrl(plan.id)}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-md px-5 py-3.5 min-h-[48px] text-sm font-semibold text-white transition active:scale-[0.98] ${monthly ? 'bg-amber-700 hover:bg-amber-800' : theme.button}`}
              >
                Cotizar este plan
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
              </Link>
            </div>
          </article>
        )
      })}
    </motion.div>
  )
}

const PILL_ICONS = {
  clock: Clock,
  message: MessageCircle,
  lock: Lock,
  headphones: Headphones,
} as const

export function ServicesPreviewSection() {
  const messages = useMessages()
  const s = messages.services
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="services" ref={ref} className="relative isolate overflow-hidden bg-slate-50/80 py-16 sm:py-24 dark:bg-slate-950">
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
          <SectionLabel>{s.sectionLabel}</SectionLabel>
          <SectionTitle>
            {s.titleBefore}
            <span className="brand-accent">{s.titleAccent}</span>
          </SectionTitle>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">{s.subtitle}</p>
        </motion.div>

        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">Desarrollo web · pago único</h3>
        <PlanGrid plans={WEB_PLANS} isInView={isInView} />
        <h3 className="mb-4 mt-10 text-sm font-bold uppercase tracking-wide text-amber-800">Marketing digital · mensual</h3>
        <PlanGrid plans={MARKETING_PLANS} monthly isInView={isInView} />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="mt-8 sm:mt-10 border-y border-slate-200 bg-white px-5 py-5 sm:px-8 sm:py-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
            <div className="flex items-start gap-4 lg:max-w-xl">
              <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-brand" aria-hidden />
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900">{s.focusBold}</span> {s.focusRest}
              </p>
            </div>
            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-5 flex-1">
              {SERVICES_TRUST_PILLS.map((pill, index) => {
                const PillIcon = PILL_ICONS[pill.icon]
                const theme = BRAND_ICON_TONES[pill.color]
                const label = s.trustPills[index] ?? pill.label
                return (
                  <li key={pill.icon} className="flex flex-col items-center text-center gap-2">
                    <span className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${theme.wrap}`}>
                      <PillIcon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="text-xs font-medium text-slate-600 leading-snug">{label}</span>
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
            {s.scheduleCall}
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </Link>
          <a
            href={buildWhatsAppUrl(messages.whatsappMessages.default)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border-2 border-emerald-200 bg-white px-6 py-4 min-h-[52px] text-base font-semibold text-slate-900 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50/50 active:scale-[0.98]"
          >
            <TechLogo name="WhatsApp" size={22} />
            {s.talkWhatsapp}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
