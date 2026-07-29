'use client'

import { useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import type { CaseStudy } from '@/lib/case-studies'
import { isLivePreviewImage } from '@/lib/case-studies'
import { buildWhatsAppUrl, quoteUrl, WHATSAPP_MESSAGES } from '@/lib/marketing'

const SWIPE_THRESHOLD = 48

const CASE_WHATSAPP: Record<string, string> = {
  aquarumbos: WHATSAPP_MESSAGES.caseAquarumbos,
  aserta: WHATSAPP_MESSAGES.caseAserta,
  sara: WHATSAPP_MESSAGES.caseSara,
  'spl-business': WHATSAPP_MESSAGES.caseSpl,
  nutrielys: WHATSAPP_MESSAGES.caseNutrielys,
}

type Props = {
  projects: CaseStudy[]
}

export function CaseStudyCarousel({ projects }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const total = projects.length
  const project = projects[activeIndex]

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((index + total) % total)
    },
    [total],
  )

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])

  const onTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null
  }

  const onTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = touchStartX.current - (event.changedTouches[0]?.clientX ?? touchStartX.current)
    if (delta > SWIPE_THRESHOLD) goNext()
    else if (delta < -SWIPE_THRESHOLD) goPrev()
    touchStartX.current = null
  }

  const ctaHref = project.ctaWhatsApp
    ? buildWhatsAppUrl(CASE_WHATSAPP[project.slug] ?? WHATSAPP_MESSAGES.cases)
    : quoteUrl(project.quoteServiceId)

  const CtaIcon = project.ctaWhatsApp ? ExternalLink : ArrowRight

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Casos de éxito"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {projects.map((item, index) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Ver caso ${item.company}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              className={`h-2 rounded-full transition-all ${
                index === activeIndex ? 'w-7 bg-brand' : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <p className="text-xs sm:text-sm text-slate-500 tabular-nums" aria-live="polite">
            {activeIndex + 1} / {total}
          </p>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Caso anterior"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Siguiente caso"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={project.slug}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="grid lg:grid-cols-[1.05fr_0.95fr]"
          >
            <div className="p-5 sm:p-8 order-2 lg:order-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand">{project.industry}</p>
              <h3 className="mt-2 text-xl sm:text-2xl font-bold text-slate-900">{project.company}</h3>

              {project.positioning ? (
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{project.positioning}</p>
              ) : null}

              <div className="mt-5 sm:mt-6 space-y-3 sm:space-y-4 text-sm sm:text-base">
                <div>
                  <p className="font-semibold text-slate-900">Problema</p>
                  <p className="mt-1 text-slate-600 leading-relaxed">{project.problem}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Solución</p>
                  <p className="mt-1 text-slate-600 leading-relaxed">{project.solution}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Resultado</p>
                  <p className="mt-1 text-slate-600 leading-relaxed">{project.result}</p>
                </div>
              </div>

              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tecnologías utilizadas">
                {project.technologies.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] sm:text-xs text-slate-500"
                  >
                    {tech}
                  </li>
                ))}
              </ul>

              <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-3">
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:border-slate-300 min-h-[48px] transition"
                >
                  Ver proyecto en vivo
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </a>
                {project.ctaWhatsApp ? (
                  <a
                    href={ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-light min-h-[48px] transition"
                  >
                    {project.ctaLabel}
                    <CtaIcon className="h-4 w-4" aria-hidden />
                  </a>
                ) : (
                  <Link
                    href={ctaHref}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-light min-h-[48px] transition"
                  >
                    {project.ctaLabel}
                    <CtaIcon className="h-4 w-4" aria-hidden />
                  </Link>
                )}
              </div>
            </div>

            <div className="relative order-1 lg:order-2 aspect-[16/10] sm:aspect-[16/11] lg:aspect-auto lg:min-h-[360px] bg-slate-50 overflow-hidden">
              <Image
                src={project.image}
                alt={`Proyecto ${project.company}`}
                fill
                className={
                  isLivePreviewImage(project.image)
                    ? 'object-contain object-top p-1 sm:p-2'
                    : 'object-cover object-top'
                }
                sizes="(max-width: 1024px) 100vw, 520px"
                priority={activeIndex === 0}
                unoptimized={isLivePreviewImage(project.image)}
              />
            </div>
          </motion.article>
        </AnimatePresence>
      </div>

      <p className="mt-3 text-center text-xs text-slate-400 sm:hidden">Desliza para ver más casos de éxito</p>
    </div>
  )
}
