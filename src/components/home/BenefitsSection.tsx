'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, Rocket, ShieldCheck, Smartphone, Users, Zap } from 'lucide-react'
import TechLogo from '@/components/TechLogo'
import { HOME_BENEFITS, quoteUrl } from '@/lib/marketing'

const BENEFIT_ICONS = {
  users: Users,
  shield: ShieldCheck,
  whatsapp: Smartphone,
  zap: Zap,
} as const

const BENEFIT_THEMES = {
  blue: {
    iconBg: 'bg-blue-100 text-blue-600',
    accent: 'bg-blue-500',
  },
  purple: {
    iconBg: 'bg-purple-100 text-purple-600',
    accent: 'bg-purple-500',
  },
  green: {
    iconBg: 'bg-emerald-100 text-emerald-600',
    accent: 'bg-emerald-500',
  },
  orange: {
    iconBg: 'bg-orange-100 text-orange-600',
    accent: 'bg-orange-500',
  },
} as const

function BenefitIcon({ icon, className }: { icon: (typeof HOME_BENEFITS)[number]['icon']; className: string }) {
  if (icon === 'whatsapp') {
    return (
      <span className={`relative flex items-center justify-center ${className}`}>
        <Smartphone className="h-6 w-6" aria-hidden />
        <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-sm">
          <TechLogo name="WhatsApp" size={12} />
        </span>
      </span>
    )
  }

  const Icon = BENEFIT_ICONS[icon]
  return <Icon className={`h-6 w-6 ${className}`} aria-hidden />
}

export function BenefitsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="benefits" ref={ref} className="relative isolate overflow-hidden py-16 sm:py-24">
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/eleccion_background.png')" }}
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
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-3.5 py-1.5 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-brand shrink-0" aria-hidden />
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-brand">
              Por qué elegir trabajar conmigo
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-[2.65rem] font-bold tracking-tight text-slate-900 leading-tight">
            No compras una página web.
            <br />
            <span className="gradient-text">Construyes una herramienta para crecer.</span>
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
          {HOME_BENEFITS.map((benefit) => {
            const theme = BENEFIT_THEMES[benefit.color]
            return (
              <article
                key={benefit.title}
                className="flex flex-col items-center rounded-2xl sm:rounded-3xl border border-white/80 bg-white/90 backdrop-blur-sm px-5 py-6 sm:px-6 sm:py-7 text-center shadow-[0_8px_30px_rgba(15,23,42,0.06)]"
              >
                <div
                  className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${theme.iconBg}`}
                >
                  <BenefitIcon icon={benefit.icon} className="" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">{benefit.title}</h3>
                <span className={`mt-2 mb-3 h-1 w-10 rounded-full ${theme.accent}`} aria-hidden />
                <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed">{benefit.description}</p>
              </article>
            )
          })}
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
            <ShieldCheck className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
            Seriedad, compromiso y resultados garantizados.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
