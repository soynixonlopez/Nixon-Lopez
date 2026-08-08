'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ArrowDown,
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
import { buildWhatsAppUrl, HOME_PROBLEMS, WHATSAPP_MESSAGES, quoteUrl } from '@/lib/marketing'

const PROBLEM_ICONS = {
  search: Search,
  message: MessageCircle,
  clock: Clock,
} as const

const PROBLEM_TITLES = ['Visibilidad', 'Presencia', 'Tiempo'] as const
const PROBLEM_RESULTS = [
  'Más confianza cuando te buscan.',
  'Más contactos sin depender solo del boca a boca.',
  'Más tiempo para vender y crecer.',
] as const

const AUTO_MS = 7000
const SWIPE_THRESHOLD = 48

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
    [total]
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

  const active = HOME_PROBLEMS[activeIndex]
  const ActiveIcon = PROBLEM_ICONS[active.icon]

  return (
    <section id="problem" className="relative isolate overflow-hidden bg-white py-16 sm:py-24">
      <div
        className="pointer-events-none absolute -top-24 left-0 h-72 w-72 rounded-full bg-gradient-to-br from-brand/10 to-transparent blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-0 bottom-0 h-80 w-80 rounded-full bg-gradient-to-tl from-neon-purple/10 to-transparent blur-3xl"
        aria-hidden
      />

      <div className="container-padding relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
          <SectionLabel>¿Te suena familiar?</SectionLabel>
          <SectionTitle>
            Si no te encuentran online, tu competencia se queda con{' '}
            <span className="text-brand">tus clientes.</span>
          </SectionTitle>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Tres situaciones reales. Una solución clara para cada una.
          </p>
        </div>

        <div
          className="grid items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Selector lateral / móvil */}
          <div
            className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-2 lg:overflow-visible lg:pb-0"
            role="tablist"
            aria-label="Situaciones"
          >
            {HOME_PROBLEMS.map((item, index) => {
              const isActive = index === activeIndex
              const Icon = PROBLEM_ICONS[item.icon]
              return (
                <button
                  key={PROBLEM_TITLES[index]}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="problem-panel"
                  onClick={() => goTo(index)}
                  className={`group relative min-w-[9.5rem] flex-1 rounded-2xl border px-4 py-3.5 text-left transition lg:min-w-0 lg:flex-none ${
                    isActive
                      ? 'border-brand/25 bg-brand text-white shadow-[0_12px_32px_rgba(30,58,95,0.22)]'
                      : 'border-slate-200/90 bg-white text-slate-700 hover:border-brand/20 hover:bg-brand/[0.03]'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isActive ? 'bg-white/15 text-white' : 'bg-brand/[0.06] text-brand'
                      }`}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span
                        className={`block text-[11px] font-semibold uppercase tracking-[0.16em] ${
                          isActive ? 'text-white/70' : 'text-slate-400'
                        }`}
                      >
                        0{index + 1}
                      </span>
                      <span className="mt-0.5 block text-sm font-bold sm:text-[15px]">
                        {PROBLEM_TITLES[index]}
                      </span>
                    </span>
                  </span>
                </button>
              )
            })}
          </div>

          {/* Panel narrativo */}
          <div
            id="problem-panel"
            role="tabpanel"
            aria-live="polite"
            className="relative min-w-0"
          >
            <div className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-gradient-to-br from-white via-white to-slate-50 shadow-[0_20px_50px_rgba(30,58,95,0.08)]">
              {!mounted ? (
                <ProblemPanel
                  index={0}
                  icon={PROBLEM_ICONS[HOME_PROBLEMS[0].icon]}
                  problem={HOME_PROBLEMS[0].problem}
                  solution={HOME_PROBLEMS[0].solution}
                  result={PROBLEM_RESULTS[0]}
                  title={PROBLEM_TITLES[0]}
                />
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.problem}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                  >
                    <ProblemPanel
                      index={activeIndex}
                      icon={ActiveIcon}
                      problem={active.problem}
                      solution={active.solution}
                      result={PROBLEM_RESULTS[activeIndex]}
                      title={PROBLEM_TITLES[activeIndex]}
                    />
                  </motion.div>
                </AnimatePresence>
              )}

              <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:px-8">
                <div className="flex items-center gap-1.5" aria-hidden>
                  {HOME_PROBLEMS.map((_, index) => (
                    <span
                      key={PROBLEM_TITLES[index]}
                      className={`h-1.5 rounded-full transition-all ${
                        index === activeIndex ? 'w-7 bg-brand' : 'w-1.5 bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Situación anterior"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-brand transition hover:border-brand/30 hover:bg-brand/[0.04]"
                  >
                    <ChevronLeft className="h-5 w-5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Situación siguiente"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-brand transition hover:border-brand/30 hover:bg-brand/[0.04]"
                  >
                    <ChevronRight className="h-5 w-5" aria-hidden />
                  </button>
                </div>
              </div>
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

function ProblemPanel({
  index,
  icon: Icon,
  problem,
  solution,
  result,
  title,
}: {
  index: number
  icon: typeof Search
  problem: string
  solution: string
  result: string
  title: string
}) {
  return (
    <div className="px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
      <div className="mb-6 flex items-center gap-3">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/[0.08] text-brand">
          <Icon className="h-6 w-6" aria-hidden />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand/80">
            Situación {index + 1}
          </p>
          <p className="text-sm font-bold text-slate-900">{title}</p>
        </div>
      </div>

      <div className="relative border-l-4 border-brand/80 pl-5 sm:pl-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">El problema</p>
        <h3 className="mt-2 max-w-2xl text-xl font-bold leading-snug tracking-tight text-slate-900 sm:text-2xl lg:text-[1.75rem]">
          {problem}
        </h3>
      </div>

      <div className="my-6 flex items-center gap-3 text-brand/50 sm:my-7" aria-hidden>
        <span className="h-px flex-1 bg-gradient-to-r from-brand/25 to-transparent" />
        <ArrowDown className="h-4 w-4" />
        <span className="h-px flex-1 bg-gradient-to-l from-brand/25 to-transparent" />
      </div>

      <div className="rounded-2xl bg-brand/[0.04] px-5 py-5 sm:px-6 sm:py-6">
        <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
          Cómo lo resolvemos
        </p>
        <p className="max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg">{solution}</p>
        <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
          <span className="h-1.5 w-8 rounded-full bg-brand" aria-hidden />
          {result}
        </p>
      </div>
    </div>
  )
}
