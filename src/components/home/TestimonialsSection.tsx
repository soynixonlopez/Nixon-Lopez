'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, MessageCircle, Quote, Star } from 'lucide-react'
import TechLogo from '@/components/TechLogo'
import { SectionLabel } from '@/components/marketing/SectionLabel'
import { SectionTitle } from '@/components/marketing/SectionTitle'
import {
  buildWhatsAppUrl,
  VERIFIED_TESTIMONIALS,
  WHATSAPP_MESSAGES,
} from '@/lib/marketing'

const AVATAR_COLORS = {
  purple: 'bg-purple-100 text-purple-700',
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-emerald-100 text-emerald-700',
} as const

function renderHighlightedContent(content: string, highlights: readonly string[]) {
  if (!highlights.length) return content

  const pattern = new RegExp(`(${highlights.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi')
  const parts = content.split(pattern)

  return parts.map((part, index) => {
    const isHighlight = highlights.some((h) => h.toLowerCase() === part.toLowerCase())
    if (isHighlight) {
      return (
        <strong key={`${part}-${index}`} className="font-semibold text-slate-900">
          {part}
        </strong>
      )
    }
    return part
  })
}

export function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="testimonials" ref={ref} className="relative isolate overflow-hidden bg-white py-16 sm:py-24">
      <div
        className="pointer-events-none absolute top-12 left-6 sm:left-10 h-24 w-24 opacity-30"
        aria-hidden
        style={{
          backgroundImage: 'radial-gradient(circle, #94a3b8 1.5px, transparent 1.5px)',
          backgroundSize: '12px 12px',
        }}
      />
      <div
        className="pointer-events-none absolute top-16 right-4 sm:right-10 text-[120px] sm:text-[160px] font-serif leading-none text-slate-100 select-none"
        aria-hidden
      >
        &ldquo;
      </div>

      <div className="container-padding relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center mb-10 sm:mb-14"
        >
          <SectionLabel>Clientes reales</SectionLabel>
          <SectionTitle>
            Negocios que confiaron en <span className="text-brand">mi trabajo</span>
          </SectionTitle>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Resultados y experiencias de clientes que decidieron mejorar su presencia digital.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="grid md:grid-cols-3 gap-4 sm:gap-5"
        >
          {VERIFIED_TESTIMONIALS.map((item) => (
            <blockquote
              key={item.name}
              className="flex flex-col rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)]"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-sm">
                  <Quote className="h-5 w-5 fill-white/20" aria-hidden />
                </div>
                <div className="flex items-center gap-0.5" role="img" aria-label="5 estrellas">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
                  ))}
                </div>
              </div>

              <p className="flex-1 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                &ldquo;{renderHighlightedContent(item.content, item.highlights)}&rdquo;
              </p>

              <footer className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${AVATAR_COLORS[item.avatarColor]}`}
                >
                  {item.initials}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.company}</p>
                </div>
              </footer>
            </blockquote>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="mt-8 sm:mt-10 border-y border-slate-200 bg-white px-5 py-5 sm:px-8 sm:py-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-8">
            <div className="flex-1">
              <p className="text-lg sm:text-xl font-bold text-slate-900">¿Listo para trabajar juntos?</p>
              <p className="mt-1 text-sm sm:text-base text-slate-600">
                Hablemos de tu proyecto y hagamos que suceda.
              </p>
            </div>
            <a
              href={buildWhatsAppUrl(WHATSAPP_MESSAGES.default)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full lg:w-auto shrink-0 items-center justify-center gap-2 rounded-md bg-brand px-6 py-4 min-h-[52px] text-base font-semibold text-white transition hover:bg-brand-light active:scale-[0.98]"
            >
              <TechLogo name="WhatsApp" size={22} light />
              Hablemos de tu proyecto
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
