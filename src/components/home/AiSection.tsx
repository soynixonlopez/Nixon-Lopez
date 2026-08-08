'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  ArrowRight,
  Clock3,
  Code2,
  MessageCircle,
  Repeat2,
  Rocket,
  Timer,
  TrendingUp,
  User,
} from 'lucide-react'
import TechLogo from '@/components/TechLogo'
import { SectionLabel } from '@/components/marketing/SectionLabel'
import { SectionTitle } from '@/components/marketing/SectionTitle'
import { useMessages } from '@/i18n/LocaleProvider'
import { BRAND_ICON_TONES, type BrandIconTone } from '@/lib/brand-icons'
import { buildWhatsAppUrl, quoteUrl } from '@/lib/marketing'

const AI_FEATURE_META = [
  { icon: Clock3, tone: 'blue' as BrandIconTone },
  { icon: Repeat2, tone: 'orange' as BrandIconTone },
  { icon: User, tone: 'purple' as BrandIconTone },
  { icon: TrendingUp, tone: 'green' as BrandIconTone },
] as const

function AiIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[420px]">
      <div className="absolute -right-6 top-8 h-28 w-28 rounded-full bg-neon-blue/15 blur-3xl" aria-hidden />
      <div
        className="absolute -left-4 bottom-6 h-20 w-20 rounded-full bg-neon-purple/10 blur-2xl"
        aria-hidden
      />

      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_24px_60px_rgba(30,58,95,0.12)] sm:p-5">
        <div className="mb-4 flex items-center gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        </div>

        <div className="relative flex min-h-[180px] items-center justify-center rounded-xl bg-gradient-to-br from-slate-50 to-brand/[0.04] p-6 sm:min-h-[200px]">
          <div className="absolute left-4 top-1/2 h-16 w-1 -translate-y-1/2 rounded-full bg-gradient-to-b from-transparent via-neon-blue/40 to-transparent" aria-hidden />
          <div className="absolute right-6 top-1/3 h-12 w-1 rounded-full bg-gradient-to-b from-transparent via-neon-purple/30 to-transparent" aria-hidden />

          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-brand shadow-[0_16px_40px_rgba(30,58,95,0.25)] sm:h-28 sm:w-28">
            <Code2 className="h-10 w-10 text-white sm:h-12 sm:w-12" strokeWidth={1.75} aria-hidden />
          </div>

          <div className="absolute bottom-5 left-5 flex h-11 w-11 items-center justify-center rounded-lg bg-neon-blue/15 text-neon-blue shadow-sm">
            <MessageCircle className="h-5 w-5" aria-hidden />
          </div>

          <div className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200/80 bg-white shadow-sm">
            <Timer className="h-5 w-5 text-neon-purple" aria-hidden />
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute -right-2 top-1/2 grid grid-cols-3 gap-1 opacity-30"
        aria-hidden
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className="h-1 w-1 rounded-full bg-brand" />
        ))}
      </div>
    </div>
  )
}

export function AiSection() {
  const messages = useMessages()
  const ai = messages.ai
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="ai" ref={ref} className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div
        className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-gradient-to-bl from-neon-blue/10 to-transparent blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-gradient-to-tr from-neon-purple/5 to-transparent blur-3xl"
        aria-hidden
      />

      <div className="container-padding relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.5 }}
          className="grid items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-14"
        >
          <div className="max-w-2xl">
            <SectionLabel align="left">{ai.sectionLabel}</SectionLabel>
            <SectionTitle>
              {ai.titleBefore}
              <span className="brand-accent">{ai.titleAccent}</span>
            </SectionTitle>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              {ai.subtitleBefore}
              <span className="font-semibold brand-accent">{ai.subtitleHighlight}</span>
            </p>
          </div>

          <AiIllustration />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mt-12 sm:mt-14 lg:mt-16"
        >
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_40px_rgba(15,23,42,0.06)]">
            <ul className="grid divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4 lg:divide-y-0">
              {AI_FEATURE_META.map((meta, index) => {
                const copy = ai.features[index]
                if (!copy) return null
                const Icon = meta.icon
                const theme = BRAND_ICON_TONES[meta.tone]
                return (
                  <li
                    key={copy.title}
                    className="flex flex-col items-center px-5 py-8 text-center sm:px-6 sm:py-9"
                  >
                    <span className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${theme.wrap}`}>
                      <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                    </span>
                    <h3 className="mt-4 text-sm font-bold text-slate-900 sm:text-base">{copy.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">{copy.description}</p>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center">
            <Link
              href={quoteUrl()}
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-brand-light active:scale-[0.98] sm:w-auto sm:text-base"
            >
              <Rocket className="h-4 w-4 shrink-0" aria-hidden />
              {ai.ctaPrimary}
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
            <a
              href={buildWhatsAppUrl(messages.whatsappMessages.default)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] sm:w-auto sm:text-base"
            >
              <TechLogo name="WhatsApp" size={20} />
              {ai.ctaSecondary}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
