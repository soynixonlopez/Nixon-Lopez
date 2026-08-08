'use client'

import Link from 'next/link'
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

const AUTO_MS = 6500

export function ProblemSection() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = HOME_PROBLEMS.length

  const goTo = useCallback((index: number) => {
    const next = (index + total) % total
    const slide = scrollerRef.current?.children[next] as HTMLElement | undefined
    slide?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    setActiveIndex(next)
  }, [total])

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const onScroll = () => {
      const center = scroller.scrollLeft + scroller.clientWidth / 2
      let closest = 0
      let closestDist = Infinity
      Array.from(scroller.children).forEach((child, index) => {
        const el = child as HTMLElement
        const mid = el.offsetLeft + el.offsetWidth / 2
        const dist = Math.abs(mid - center)
        if (dist < closestDist) {
          closestDist = dist
          closest = index
        }
      })
      setActiveIndex(closest)
    }

    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => scroller.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (paused) return
    const id = window.setInterval(() => {
      goTo(activeIndex + 1)
    }, AUTO_MS)
    return () => window.clearInterval(id)
  }, [activeIndex, goTo, paused])

  return (
    <section id="problem" className="relative isolate overflow-hidden bg-slate-50/90 py-16 sm:py-24">
      {/* Fondo marca */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(30,58,95,0.14) 1px, transparent 0)',
          backgroundSize: '22px 22px',
        }}
      />
      <div
        className="pointer-events-none absolute -top-24 -left-16 h-80 w-80 rounded-full bg-gradient-to-br from-brand/15 via-brand/5 to-transparent blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-gradient-to-tl from-neon-purple/15 via-transparent to-transparent blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-64 w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/[0.04] blur-3xl"
        aria-hidden
      />

      <div className="container-padding relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-10">
          <SectionLabel>¿Te suena familiar?</SectionLabel>
          <SectionTitle>
            Si no te encuentran online, tu competencia se queda con{' '}
            <span className="text-brand">tus clientes.</span>
          </SectionTitle>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Desliza las situaciones. Cada una tiene una solución clara.
          </p>
        </div>

        {/* Chips del carrusel */}
        <div
          className="mb-5 flex justify-center gap-2 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Situaciones"
        >
          {HOME_PROBLEMS.map((item, index) => {
            const active = index === activeIndex
            const Icon = PROBLEM_ICONS[item.icon]
            return (
              <button
                key={PROBLEM_TITLES[index]}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => goTo(index)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition ${
                  active
                    ? 'border-brand bg-brand text-white shadow-md shadow-brand/20'
                    : 'border-slate-200/90 bg-white/90 text-slate-600 hover:border-brand/25 hover:text-brand'
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden />
                <span className="tabular-nums opacity-70">0{index + 1}</span>
                {PROBLEM_TITLES[index]}
              </button>
            )
          })}
        </div>

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-2 sm:gap-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-[max(0.5rem,calc((100%-40rem)/2))]"
            aria-roledescription="carrusel"
            aria-label="Problemas y soluciones"
          >
            {HOME_PROBLEMS.map((item, index) => {
              const Icon = PROBLEM_ICONS[item.icon]
              return (
                <article
                  key={PROBLEM_TITLES[index]}
                  className="w-[min(92vw,36rem)] shrink-0 snap-center sm:w-[40rem]"
                  aria-roledescription="slide"
                  aria-label={`Situación ${index + 1}: ${PROBLEM_TITLES[index]}`}
                >
                  <div
                    className={`flex h-full flex-col overflow-hidden rounded-[1.75rem] border bg-white/95 shadow-[0_18px_50px_rgba(30,58,95,0.1)] backdrop-blur-sm transition duration-300 ${
                      index === activeIndex
                        ? 'border-brand/25 ring-1 ring-brand/10'
                        : 'border-slate-200/80 opacity-90'
                    }`}
                  >
                    <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-brand/[0.06] via-white to-neon-purple/[0.05] px-5 py-4 sm:px-7">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-white shadow-sm">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand/80">
                          Situación {index + 1}
                        </p>
                        <p className="text-base font-bold text-slate-900">{PROBLEM_TITLES[index]}</p>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col px-5 py-6 sm:px-7 sm:py-7">
                      <div className="border-l-4 border-brand pl-4 sm:pl-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          El problema
                        </p>
                        <h3 className="mt-2 text-xl font-bold leading-snug tracking-tight text-slate-900 sm:text-2xl">
                          {item.problem}
                        </h3>
                      </div>

                      <div className="my-5 flex items-center gap-3 text-brand/40" aria-hidden>
                        <span className="h-px flex-1 bg-gradient-to-r from-brand/20 to-transparent" />
                        <ArrowDown className="h-4 w-4" />
                        <span className="h-px flex-1 bg-gradient-to-l from-brand/20 to-transparent" />
                      </div>

                      <div className="mt-auto rounded-2xl bg-gradient-to-br from-brand/[0.06] to-neon-purple/[0.05] px-4 py-4 sm:px-5 sm:py-5">
                        <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                          <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
                          Cómo lo resolvemos
                        </p>
                        <p className="text-base leading-relaxed text-slate-700 sm:text-[1.05rem]">
                          {item.solution}
                        </p>
                        <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                          <span className="h-1.5 w-8 rounded-full bg-brand" aria-hidden />
                          {PROBLEM_RESULTS[index]}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          {/* Controles */}
          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5" aria-hidden>
              {HOME_PROBLEMS.map((_, index) => (
                <button
                  key={PROBLEM_TITLES[index]}
                  type="button"
                  aria-label={`Ir a ${PROBLEM_TITLES[index]}`}
                  onClick={() => goTo(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === activeIndex ? 'w-8 bg-brand' : 'w-1.5 bg-slate-300 hover:bg-brand/40'
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Situación anterior"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-brand shadow-sm transition hover:border-brand/30 hover:bg-brand/[0.04]"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Situación siguiente"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-brand shadow-sm transition hover:border-brand/30 hover:bg-brand/[0.04]"
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
