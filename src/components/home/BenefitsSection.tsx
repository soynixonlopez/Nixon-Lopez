'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, ListChecks, Rocket, ShieldCheck, Smartphone, Users } from 'lucide-react'
import TechLogo from '@/components/TechLogo'
import { SectionLabel } from '@/components/marketing/SectionLabel'
import { BRAND_ICON_TONES } from '@/lib/brand-icons'
import { HOME_BENEFITS, quoteUrl } from '@/lib/marketing'

const BENEFIT_ICONS = {
  users: Users,
  shield: ShieldCheck,
  whatsapp: Smartphone,
  process: ListChecks,
} as const

function BenefitIcon({
  icon,
  tone,
}: {
  icon: (typeof HOME_BENEFITS)[number]['icon']
  tone: (typeof HOME_BENEFITS)[number]['color']
}) {
  const theme = BRAND_ICON_TONES[tone]

  if (icon === 'whatsapp') {
    return (
      <span className={`relative inline-flex h-12 w-12 items-center justify-center rounded-lg ${theme.wrap}`}>
        <Smartphone className="h-6 w-6" aria-hidden />
        <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-sm bg-white shadow-sm">
          <TechLogo name="WhatsApp" size={12} />
        </span>
      </span>
    )
  }

  const Icon = BENEFIT_ICONS[icon]
  return (
    <span className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${theme.wrap}`}>
      <Icon className="h-6 w-6" aria-hidden />
    </span>
  )
}

export function BenefitsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="benefits" ref={ref} className="relative isolate overflow-hidden py-16 sm:py-24">
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/eleccion_background.webp')" }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 z-0 bg-white/30" aria-hidden />

      <div className="container-padding relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center mb-10 sm:mb-14"
        >
          <SectionLabel>Por qué trabajar conmigo</SectionLabel>
          <h2 className="text-2xl sm:text-4xl md:text-[2.65rem] font-bold tracking-tight text-slate-900 leading-tight">
            No compras una página web.
            <br />
            <span className="text-brand">Construyes una herramienta para crecer.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Una web profesional no solo se ve bien. Te ayuda a generar confianza, recibir consultas y convertir
            visitantes en clientes.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
        >
          {HOME_BENEFITS.map((benefit) => (
            <article
              key={benefit.title}
              className="flex flex-col border-t border-brand/20 bg-white/85 px-5 py-6 sm:px-6 sm:py-7 backdrop-blur-sm"
            >
              <div className="mb-4">
                <BenefitIcon icon={benefit.icon} tone={benefit.color} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">{benefit.title}</h3>
              <p className="mt-2 text-sm sm:text-[15px] text-slate-600 leading-relaxed">{benefit.description}</p>
            </article>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, delay: 0.14 }}
          className="mt-10 sm:mt-12 flex flex-col items-center"
        >
          <Link
            href={quoteUrl()}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-4 min-h-[52px] text-base font-semibold text-white shadow-[0_12px_32px_rgba(30,58,95,0.28)] transition hover:bg-brand-light active:scale-[0.98] w-full sm:w-auto"
          >
            <Rocket className="h-5 w-5 shrink-0" aria-hidden />
            Quiero una web que genere clientes
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </Link>
          <p className="mt-4 inline-flex items-center gap-2 text-sm text-slate-500">
            <ShieldCheck className="h-4 w-4 shrink-0 text-brand" aria-hidden />
            Seriedad, compromiso y resultados garantizados.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
