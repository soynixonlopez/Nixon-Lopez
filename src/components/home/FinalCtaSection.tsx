'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, Check, Rocket } from 'lucide-react'
import TechLogo from '@/components/TechLogo'
import { buildWhatsAppUrl, FINAL_CTA_TRUST, WHATSAPP_MESSAGES, quoteUrl } from '@/lib/marketing'

export function FinalCtaSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="contact" ref={ref} className="relative overflow-hidden py-16 sm:py-24">
      <div className="absolute inset-0 bg-brand" aria-hidden />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.15),transparent_45%)]"
        aria-hidden
      />

      <div className="container-padding relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 mb-5">
            <Rocket className="h-4 w-4 text-white/90" aria-hidden />
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-white/90">
              Listo para crecer
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-[2.75rem] font-bold tracking-tight text-white leading-tight">
            Tu negocio merece una presencia digital profesional
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/85 leading-relaxed max-w-2xl mx-auto">
            Cuéntame tu idea y encontremos la solución correcta para ayudarte a conseguir más clientes online.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={quoteUrl()}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white px-7 py-4 min-h-[52px] text-base font-semibold text-brand shadow-lg transition hover:bg-slate-100 active:scale-[0.98]"
            >
              Obtener cotización
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
            <a
              href={buildWhatsAppUrl(WHATSAPP_MESSAGES.final)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-7 py-4 min-h-[52px] text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/15 active:scale-[0.98]"
            >
              <TechLogo name="WhatsApp" size={22} light />
              Hablar por WhatsApp
            </a>
          </div>

          <ul className="mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {FINAL_CTA_TRUST.map((item) => (
              <li key={item} className="inline-flex items-center gap-2 text-sm text-white/80">
                <Check className="h-4 w-4 shrink-0 text-emerald-300" strokeWidth={2.5} aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}
