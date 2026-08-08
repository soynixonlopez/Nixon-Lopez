'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { useMessages } from '@/i18n/LocaleProvider'
import { quoteUrl } from '@/lib/marketing'
import type { FeaturedProject } from '@/lib/case-studies'
import { ProjectCarousel } from '@/components/marketing/ProjectCarousel'
import { SectionLabel } from '@/components/marketing/SectionLabel'
import { SectionTitle } from '@/components/marketing/SectionTitle'

export function CaseStudiesSection({ projects }: { projects: FeaturedProject[] }) {
  const messages = useMessages()
  const c = messages.cases
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="projects" ref={ref} className="relative isolate overflow-hidden bg-slate-50/50 py-16 sm:py-24">
      <div
        className="pointer-events-none absolute top-10 left-6 sm:left-10 h-24 w-24 opacity-30"
        aria-hidden
        style={{
          backgroundImage: 'radial-gradient(circle, #94a3b8 1.5px, transparent 1.5px)',
          backgroundSize: '12px 12px',
        }}
      />
      <div
        className="pointer-events-none absolute -top-12 right-[-8%] h-72 w-72 rounded-full bg-gradient-to-br from-blue-200/35 via-indigo-200/20 to-purple-200/15 blur-3xl"
        aria-hidden
      />

      <div className="container-padding relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center mb-10 sm:mb-14"
        >
          <SectionLabel>{c.sectionLabel}</SectionLabel>
          <SectionTitle>
            {c.titleBefore}
            <span className="text-brand">{c.titleAccent}</span>
          </SectionTitle>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">{c.subtitle}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          <ProjectCarousel projects={projects} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, delay: 0.14 }}
          className="mt-10 sm:mt-12 border-y border-slate-200 bg-white px-5 py-5 sm:px-8 sm:py-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-8">
            <div className="flex-1">
              <p className="text-lg sm:text-xl font-bold text-slate-900">{c.bannerTitle}</p>
              <p className="mt-1 text-sm sm:text-base text-slate-600">{c.bannerSubtitle}</p>
            </div>
            <Link
              href={quoteUrl()}
              className="inline-flex w-full lg:w-auto shrink-0 items-center justify-center gap-2 rounded-md bg-brand px-6 py-4 min-h-[52px] text-base font-semibold text-white transition hover:bg-brand-light active:scale-[0.98]"
            >
              {c.bannerCta}
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
          </div>
        </motion.div>

        <p className="mt-8 text-center">
          <Link
            href="/proyectos"
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-brand hover:underline min-h-[44px]"
          >
            {c.viewPortfolio}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </p>
      </div>
    </section>
  )
}
