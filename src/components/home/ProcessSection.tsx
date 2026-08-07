'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  ArrowRight,
  Calculator,
  Check,
  FileText,
  MessageCircle,
  PenLine,
  Rocket,
  Users,
} from 'lucide-react'
import TechLogo from '@/components/TechLogo'
import { SectionLabel } from '@/components/marketing/SectionLabel'
import { SectionTitle } from '@/components/marketing/SectionTitle'
import { BRAND_ICON_TONES } from '@/lib/brand-icons'
import { buildWhatsAppUrl, HOME_PROCESS, WHATSAPP_MESSAGES, quoteUrl } from '@/lib/marketing'

const STEP_ICONS = {
  quote: MessageCircle,
  proposal: FileText,
  contract: PenLine,
  develop: Users,
  launch: Rocket,
} as const

function ProcessIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[260px] sm:max-w-[300px] lg:max-w-[320px]">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_20px_50px_rgba(30,58,95,0.12)] sm:p-6">
        <div className="space-y-3">
          {[0, 1, 2].map((line) => (
            <div key={line} className="flex items-center gap-2.5">
              <Check className="h-4 w-4 shrink-0 text-brand" strokeWidth={2.5} aria-hidden />
              <div
                className="h-2 rounded-full bg-slate-100"
                style={{ width: `${72 - line * 8}%` }}
                aria-hidden
              />
            </div>
          ))}
          <svg
            viewBox="0 0 120 32"
            className="mt-2 h-8 w-28 text-brand/70"
            fill="none"
            aria-hidden
          >
            <path
              d="M8 22 C22 8, 38 28, 52 16 S78 6, 96 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
      <div className="absolute -bottom-3 -right-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand to-neon-purple shadow-[0_12px_28px_rgba(30,58,95,0.35)] sm:-bottom-4 sm:-right-4 sm:h-16 sm:w-16">
        <Rocket className="h-6 w-6 text-white sm:h-7 sm:w-7" aria-hidden />
      </div>
    </div>
  )
}

export function ProcessSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="process" ref={ref} className="bg-slate-50 py-16 sm:py-20 lg:py-24">
      <div className="container-padding mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.5 }}
          className="grid items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-12"
        >
          <div className="max-w-2xl">
            <SectionLabel align="left">Proceso simple</SectionLabel>
            <SectionTitle>
              De la cotización a tu web publicada,{' '}
              <span className="text-brand">sin sorpresas</span>
            </SectionTitle>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              Sabes qué sigue en cada paso. Contrato formal, pago en dos partes y comunicación directa
              conmigo.
            </p>
          </div>

          <ProcessIllustration />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mt-12 sm:mt-14 lg:mt-16"
        >
          <div className="relative mb-6 hidden lg:block">
            <div
              className="absolute left-[10%] right-[10%] top-5 border-t-2 border-dashed border-brand/25"
              aria-hidden
            />
            <ol className="relative grid grid-cols-5 gap-4">
              {HOME_PROCESS.map((item) => {
                const theme = BRAND_ICON_TONES[item.color]
                return (
                  <li key={item.step} className="flex justify-center">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-md ring-4 ring-slate-50 ${theme.button}`}
                    >
                      {item.step}
                    </span>
                  </li>
                )
              })}
            </ol>
          </div>

          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
            {HOME_PROCESS.map((item) => {
              const Icon = STEP_ICONS[item.icon]
              const theme = BRAND_ICON_TONES[item.color]
              return (
                <li
                  key={item.step}
                  className={`flex flex-col items-center rounded-xl border px-4 py-6 text-center transition-shadow hover:shadow-md sm:px-5 sm:py-7 ${theme.card}`}
                >
                  <span
                    className={`mb-3 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white lg:hidden ${theme.button}`}
                  >
                    {item.step}
                  </span>
                  <div className={`flex h-14 w-14 items-center justify-center rounded-lg ${theme.wrap}`}>
                    <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-slate-900 sm:text-base">{item.title}</h3>
                  <div className={`mt-3 h-0.5 w-8 rounded-full ${theme.accent}`} aria-hidden />
                  <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {item.description}
                    {'highlight' in item && item.highlight ? (
                      <>
                        {' '}
                        <span className={`font-semibold ${theme.icon}`}>{item.highlight}</span>
                      </>
                    ) : null}
                  </p>
                </li>
              )
            })}
          </ol>

          <div className="mt-10 rounded-2xl border border-brand/10 bg-gradient-to-r from-brand/[0.04] via-neon-blue/[0.06] to-neon-purple/[0.04] p-5 sm:mt-12 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand/10">
                  <MessageCircle className="h-6 w-6 text-brand" aria-hidden />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                    ¿Listo para dar el siguiente paso?
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 sm:text-base">
                    Cotiza tu proyecto en minutos y recibe una propuesta clara, sin compromiso.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:shrink-0">
                <Link
                  href={quoteUrl()}
                  className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-light px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg active:scale-[0.98] sm:w-auto sm:text-base"
                >
                  <Calculator className="h-4 w-4 shrink-0" aria-hidden />
                  Empezar mi cotización
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                </Link>
                <a
                  href={buildWhatsAppUrl(WHATSAPP_MESSAGES.process)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] sm:w-auto sm:text-base"
                >
                  <TechLogo name="WhatsApp" size={20} />
                  Tengo una pregunta
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
