'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, Check, Clock, MessageCircle, Rocket, Search, Shield } from 'lucide-react'
import TechLogo from '@/components/TechLogo'
import { SectionLabel } from '@/components/marketing/SectionLabel'
import { BRAND_ICON_TONES, type BrandIconTone } from '@/lib/brand-icons'
import { buildWhatsAppUrl, HOME_PROBLEMS, WHATSAPP_MESSAGES, quoteUrl } from '@/lib/marketing'

const PROBLEM_ICONS = {
  search: Search,
  message: MessageCircle,
  clock: Clock,
} as const

const PROBLEM_TONES: BrandIconTone[] = ['blue', 'purple', 'green']

export function ProblemSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="problem" ref={ref} className="relative overflow-hidden bg-slate-50/80 py-16 sm:py-24">
      <div
        className="pointer-events-none absolute top-8 left-6 sm:left-10 h-24 w-24 opacity-40"
        aria-hidden
        style={{
          backgroundImage: 'radial-gradient(circle, #94a3b8 1.5px, transparent 1.5px)',
          backgroundSize: '12px 12px',
        }}
      />
      <div
        className="pointer-events-none absolute top-1/4 right-[-8%] h-72 w-72 rounded-full border border-slate-200/60 opacity-50"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-10 right-[4%] h-48 w-48 rounded-full border border-slate-200/40 opacity-40"
        aria-hidden
      />

      <div className="container-padding relative max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center mb-10 sm:mb-14"
        >
          <SectionLabel>¿Te suena familiar?</SectionLabel>
          <h2 className="text-2xl sm:text-4xl md:text-[2.65rem] font-bold tracking-tight text-slate-900 leading-tight">
            Si no te encuentran online, tu competencia se queda con{' '}
            <span className="text-brand">tus clientes.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Estos son los problemas que resolvemos todos los días para dueños de negocio como tú.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="grid md:grid-cols-3 gap-5 sm:gap-6"
        >
          {HOME_PROBLEMS.map((item, index) => {
            const Icon = PROBLEM_ICONS[item.icon]
            const theme = BRAND_ICON_TONES[PROBLEM_TONES[index % PROBLEM_TONES.length]]
            return (
              <article
                key={item.problem}
                className="flex flex-col border-t border-slate-200 bg-white"
              >
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${theme.wrap}`}>
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="text-xs font-medium text-slate-500">Tu situación</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">{item.problem}</h3>
                </div>

                <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6 sm:py-5">
                  <p className="mb-2 flex items-center gap-2 text-sm font-medium text-brand">
                    <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
                    Cómo te ayudamos
                  </p>
                  <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed">{item.solution}</p>
                </div>
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
          <div className="flex w-full max-w-xl flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={quoteUrl()}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-4 min-h-[52px] text-base font-semibold text-white shadow-md transition hover:bg-brand-light active:scale-[0.98] w-full sm:w-auto"
            >
              <Rocket className="h-5 w-5 shrink-0" aria-hidden />
              Quiero solucionarlo ya
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
            <a
              href={buildWhatsAppUrl(WHATSAPP_MESSAGES.problem)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-4 min-h-[52px] text-base font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] w-full sm:w-auto"
            >
              <TechLogo name="WhatsApp" size={22} />
              Cuéntame mi caso
            </a>
          </div>
          <p className="mt-4 inline-flex items-center gap-2 text-sm text-slate-500">
            <Shield className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
            Atención directa conmigo por WhatsApp. Sin intermediarios.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
