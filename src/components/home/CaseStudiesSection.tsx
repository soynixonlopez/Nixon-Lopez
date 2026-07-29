'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, FolderOpen, Rocket } from 'lucide-react'
import { FEATURED_PROJECTS, quoteUrl } from '@/lib/marketing'
import { ProjectCarousel } from '@/components/marketing/ProjectCarousel'

export function CaseStudiesSection() {
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
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-3.5 py-1.5 mb-4">
            <FolderOpen className="h-4 w-4 text-brand" aria-hidden />
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-brand">
              Proyectos destacados
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-[2.65rem] font-bold tracking-tight text-slate-900 leading-tight">
            Diseños que convierten ideas en{' '}
            <span className="gradient-text">negocios digitales</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Una selección de proyectos reales creados para diferentes industrias y necesidades.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          <ProjectCarousel projects={FEATURED_PROJECTS} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, delay: 0.14 }}
          className="mt-10 sm:mt-12 rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white px-5 py-5 sm:px-8 sm:py-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)]"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-8">
            <div className="flex items-start gap-4 flex-1">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand text-white">
                <Rocket className="h-6 w-6" aria-hidden />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold text-slate-900">
                  ¿Listo para que tu proyecto sea el próximo?
                </p>
                <p className="mt-1 text-sm sm:text-base text-slate-600">
                  Hablemos sobre cómo podemos ayudarte a lograrlo.
                </p>
              </div>
            </div>
            <Link
              href={quoteUrl()}
              className="inline-flex w-full lg:w-auto shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 min-h-[52px] text-base font-semibold text-white shadow-md transition hover:from-blue-700 hover:to-purple-700 active:scale-[0.98]"
            >
              Quiero iniciar mi proyecto
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
          </div>
        </motion.div>

        <p className="mt-8 text-center">
          <Link
            href="/proyectos"
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-brand hover:underline min-h-[44px]"
          >
            Ver portafolio completo
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </p>
      </div>
    </section>
  )
}
