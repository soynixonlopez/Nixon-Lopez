'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, Check, Clock, Send } from 'lucide-react'
import TechLogo from '@/components/TechLogo'
import { SectionLabel } from '@/components/marketing/SectionLabel'
import { SectionTitle } from '@/components/marketing/SectionTitle'
import { MASTERCLASS_HERO_FLOATS } from '@/lib/case-studies'
import { buildWhatsAppUrl, FINAL_CTA_TRUST, WHATSAPP_MESSAGES, quoteUrl } from '@/lib/marketing'

const SHOWCASE_MOCKUPS = [
  {
    image: MASTERCLASS_HERO_FLOATS[0],
    className: 'left-0 top-10 z-[1] w-[46%] -rotate-6',
  },
  {
    image: MASTERCLASS_HERO_FLOATS[1],
    className: 'left-[28%] top-0 z-[3] w-[50%] rotate-3',
  },
  {
    image: MASTERCLASS_HERO_FLOATS[2],
    className: 'right-0 bottom-0 z-[2] w-[44%] -rotate-3',
  },
] as const

function BrowserMockup({ src, className }: { src: string; className: string }) {
  return (
    <div className={`absolute ${className}`}>
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_20px_50px_rgba(30,58,95,0.18)] ring-1 ring-slate-100">
        <div className="flex items-center gap-1 border-b border-slate-100 bg-slate-50 px-2.5 py-2" aria-hidden>
          <span className="h-2 w-2 rounded-full bg-red-400/80" />
          <span className="h-2 w-2 rounded-full bg-amber-400/80" />
          <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
        </div>
        <div className="relative aspect-[16/10]">
          <Image src={src} alt="" fill className="object-cover object-top" sizes="280px" />
        </div>
      </div>
    </div>
  )
}

export function FinalCtaSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="contact" ref={ref} className="relative overflow-hidden bg-slate-50 py-16 sm:py-20 lg:py-24">
      <div
        className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-gradient-to-bl from-neon-purple/10 to-transparent blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full bg-gradient-to-tr from-neon-blue/10 to-transparent blur-3xl"
        aria-hidden
      />

      <div className="container-padding relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 xl:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.5 }}
          >
            <SectionLabel align="left">Listo para crecer</SectionLabel>

            <SectionTitle>
              Tu negocio merece una presencia{' '}
              <span className="text-brand">digital profesional</span>
            </SectionTitle>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Cuéntame tu idea y encontremos la solución correcta para ayudarte a conseguir más clientes
              online.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={quoteUrl()}
                className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-brand px-7 py-4 text-base font-semibold text-white shadow-md transition hover:bg-brand-light active:scale-[0.98] sm:w-auto"
              >
                Obtener cotización
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
              </Link>
              <a
                href={buildWhatsAppUrl(WHATSAPP_MESSAGES.final)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-4 text-base font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] sm:w-auto"
              >
                <TechLogo name="WhatsApp" size={22} />
                Hablar por WhatsApp
              </a>
            </div>

            <ul className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
              {FINAL_CTA_TRUST.map((item) => (
                <li key={item} className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <Check className="h-4 w-4 shrink-0 text-neon-blue" strokeWidth={2.5} aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="relative mx-auto hidden h-[320px] w-full max-w-[480px] lg:block xl:h-[360px] xl:max-w-[520px]"
          >
            <div
              className="pointer-events-none absolute -right-2 top-6 grid grid-cols-3 gap-1 opacity-25"
              aria-hidden
            >
              {Array.from({ length: 9 }).map((_, i) => (
                <span key={i} className="h-1 w-1 rounded-full bg-brand" />
              ))}
            </div>
            {SHOWCASE_MOCKUPS.map((mockup) => (
              <BrowserMockup key={mockup.image} src={mockup.image} className={mockup.className} />
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="mt-10 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_40px_rgba(15,23,42,0.06)] sm:mt-12"
        >
          <div className="grid divide-y divide-slate-100 md:grid-cols-2 md:divide-x md:divide-y-0">
            <div className="flex items-start gap-4 p-6 sm:p-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand/10">
                <Send className="h-5 w-5 text-brand" aria-hidden />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 sm:text-lg">Respuesta rápida y sin rodeos</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600 sm:text-base">
                  Cuéntame tu proyecto y te daré una propuesta clara para que tomes la mejor decisión.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 sm:p-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neon-purple/10">
                <Clock className="h-5 w-5 text-neon-purple" aria-hidden />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 sm:text-lg">Respuesta en menos de 24h</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600 sm:text-base">
                  Normalmente respondemos en pocas horas.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
