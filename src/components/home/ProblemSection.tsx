'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  MessageCircle,
  Rocket,
  Search,
  Shield,
} from 'lucide-react'
import TechLogo from '@/components/TechLogo'
import { SectionLabel } from '@/components/marketing/SectionLabel'
import { SectionTitle } from '@/components/marketing/SectionTitle'
import { BRAND_ICON_TONES, type BrandIconTone } from '@/lib/brand-icons'
import { buildWhatsAppUrl, HOME_PROBLEMS, WHATSAPP_MESSAGES, quoteUrl } from '@/lib/marketing'

const PROBLEM_ICONS = {
  search: Search,
  message: MessageCircle,
  clock: Clock,
} as const

const PROBLEM_TONES: BrandIconTone[] = ['blue', 'purple', 'green']
const PROBLEM_TITLES = ['Visibilidad', 'Presencia', 'Tiempo'] as const
const AUTO_MS = 6000
const SWIPE_THRESHOLD = 48

function ProblemSlide({ index }: { index: number }) {
  const item = HOME_PROBLEMS[index]
  const Icon = PROBLEM_ICONS[item.icon]
  const theme = BRAND_ICON_TONES[PROBLEM_TONES[index % PROBLEM_TONES.length]]
  const number = String(index + 1).padStart(2, '0')

  return (
    <article
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
      aria-roledescription="slide"
      aria-label={`Situación ${index + 1} de ${HOME_PROBLEMS.length}`}
    >
      <div className="grid min-h-[340px] sm:min-h-[380px] lg:min-h-[400px] lg:grid-cols-2">
        <div className="bg-slate-50/90">
          <div className="flex h-full flex-col justify-between gap-8 px-7 py-8 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
            <div>
              <div className="mb-6 flex items-center justify-between gap-4">
                <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${theme.wrap} shadow-sm`}>
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <span className="font-mono text-sm tracking-widest text-slate-400">{number}</span>
              </div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">El problema</p>
              <h3 className="max-w-md text-xl font-bold leading-snug tracking-tight text-slate-900 sm:text-2xl lg:text-[1.7rem]">
                {item.problem}
              </h3>
            </div>
            <p className="text-sm text-slate-500">
              Situación {index + 1} de {HOME_PROBLEMS.length} · {PROBLEM_TITLES[index]}
            </p>
          </div>
        </div>

        <div className="border-t border-slate-200 lg:border-t-0 lg:border-l">
          <div className="flex h-full flex-col justify-between gap-8 px-7 py-8 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
            <div>
              <p className={`mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] ${theme.icon}`}>
                <Check className="h-4 w-4 shrink-0" aria-hidden />
                Cómo lo resolvemos
              </p>
              <p className="max-w-md text-base leading-relaxed text-slate-600 sm:text-lg">{item.solution}</p>
            </div>

            <div className="flex items-start gap-3">
              <span className={`mt-1.5 h-1.5 w-10 shrink-0 rounded-full ${theme.accent}`} aria-hidden />
              <span className="text-sm font-medium leading-snug text-slate-700">
                Resultado: más clientes, menos fricción.
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export function ProblemSection() {
  const [mounted, setMounted] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const total = HOME_PROBLEMS.length

  useEffect(() => {
    setMounted(true)
  }, [])

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((index + total) % total)
    },
    [total],
  )

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])

  useEffect(() => {
    if (!mounted || paused) return
    const id = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % total)
    }, AUTO_MS)
    return () => window.clearInterval(id)
  }, [mounted, paused, total])

  const onTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null
    setPaused(true)
  }

  const onTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = touchStartX.current - (event.changedTouches[0]?.clientX ?? touchStartX.current)
    if (delta > SWIPE_THRESHOLD) goNext()
    else if (delta < -SWIPE_THRESHOLD) goPrev()
    touchStartX.current = null
    setPaused(false)
  }

  return (
    <section id="problem" className="relative overflow-hidden bg-slate-50/80 py-16 sm:py-24">
      <div
        className="pointer-events-none absolute top-8 left-6 h-24 w-24 opacity-40 sm:left-10"
        aria-hidden
        style={{
          backgroundImage: 'radial-gradient(circle, #94a3b8 1.5px, transparent 1.5px)',
          backgroundSize: '12px 12px',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
          <SectionLabel>¿Te suena familiar?</SectionLabel>
          <SectionTitle>
            Si no te encuentran online, tu competencia se queda con{' '}
            <span className="text-brand">tus clientes.</span>
          </SectionTitle>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Estos son los problemas que resolvemos todos los días para dueños de negocio como tú.
          </p>
        </div>

        <div
          className="mb-5 grid grid-cols-3 gap-2 sm:gap-3"
          role="tablist"
          aria-label="Situaciones"
        >
          {HOME_PROBLEMS.map((problem, index) => {
            const active = index === activeIndex
            const theme = BRAND_ICON_TONES[PROBLEM_TONES[index % PROBLEM_TONES.length]]
            return (
              <button
                key={problem.problem}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Ver situación ${index + 1}: ${PROBLEM_TITLES[index]}`}
                  onClick={() => goTo(index)}
                className={`rounded-xl border px-3 py-3 text-left transition sm:px-4 sm:py-3.5 ${
                  active
                    ? `${theme.card} shadow-sm`
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className={`block text-[11px] font-semibold uppercase tracking-wider ${active ? theme.icon : 'text-slate-400'}`}>
                  0{index + 1}
                </span>
                <span className={`mt-1 block text-sm font-semibold sm:text-[15px] ${active ? 'text-slate-900' : 'text-slate-600'}`}>
                  {PROBLEM_TITLES[index]}
                </span>
              </button>
            )
          })}
        </div>

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="overflow-hidden">
            {!mounted ? (
              <ProblemSlide index={0} />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={HOME_PROBLEMS[activeIndex].problem}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                >
                  <ProblemSlide index={activeIndex} />
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          <div className="mt-5 flex items-center justify-between gap-4">
            <p className="text-xs text-slate-500 sm:text-sm">Desliza o usa las flechas. Cambia sola cada unos segundos.</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Situación anterior"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-brand shadow-sm transition hover:border-brand/30 hover:bg-slate-50"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Situación siguiente"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-brand shadow-sm transition hover:border-brand/30 hover:bg-slate-50"
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center sm:mt-12">
          <div className="flex w-full max-w-xl flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={quoteUrl()}
              className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-4 text-base font-semibold text-white shadow-md transition hover:bg-brand-light active:scale-[0.98] sm:w-auto"
            >
              <Rocket className="h-5 w-5 shrink-0" aria-hidden />
              Quiero solucionarlo ya
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
            <a
              href={buildWhatsAppUrl(WHATSAPP_MESSAGES.problem)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-4 text-base font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] sm:w-auto"
            >
              <TechLogo name="WhatsApp" size={22} />
              Cuéntame mi caso
            </a>
          </div>
          <p className="mt-4 inline-flex items-center gap-2 text-sm text-slate-500">
            <Shield className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
            Atención directa conmigo por WhatsApp. Sin intermediarios.
          </p>
        </div>
      </div>
    </section>
  )
}
