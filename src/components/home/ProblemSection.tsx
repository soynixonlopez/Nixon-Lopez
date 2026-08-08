'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import { useMessages } from '@/i18n/LocaleProvider'
import { buildWhatsAppUrl, HOME_PROBLEMS, quoteUrl } from '@/lib/marketing'

const PROBLEM_ICONS = {
  search: Search,
  message: MessageCircle,
  clock: Clock,
} as const

const CARD_THEMES = [
  {
    card: 'border-blue-200/70 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/50 dark:to-slate-900 dark:border-blue-800/50',
    header: 'border-blue-100/80 bg-gradient-to-r from-blue-100/70 via-blue-50/40 to-transparent dark:border-blue-800/40 dark:from-blue-900/40',
    icon: 'bg-blue-600 text-white shadow-blue-600/25',
    accent: 'border-blue-600',
    accentBar: 'bg-blue-600',
    label: 'text-blue-700 dark:text-blue-300',
    solutionBox: 'bg-gradient-to-br from-blue-50 to-sky-50/80 dark:from-blue-950/40 dark:to-slate-900/80',
    solutionLabel: 'text-blue-700 dark:text-blue-300',
    divider: 'text-blue-400',
    activeRing: 'ring-1 ring-blue-300/50 shadow-[0_18px_50px_rgba(37,99,235,0.16)]',
  },
  {
    card: 'border-emerald-200/70 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/45 dark:to-slate-900 dark:border-emerald-800/50',
    header: 'border-emerald-100/80 bg-gradient-to-r from-emerald-100/70 via-emerald-50/40 to-transparent dark:border-emerald-800/40 dark:from-emerald-900/40',
    icon: 'bg-emerald-600 text-white shadow-emerald-600/25',
    accent: 'border-emerald-600',
    accentBar: 'bg-emerald-600',
    label: 'text-emerald-700 dark:text-emerald-300',
    solutionBox: 'bg-gradient-to-br from-emerald-50 to-teal-50/80 dark:from-emerald-950/40 dark:to-slate-900/80',
    solutionLabel: 'text-emerald-700 dark:text-emerald-300',
    divider: 'text-emerald-400',
    activeRing: 'ring-1 ring-emerald-300/50 shadow-[0_18px_50px_rgba(5,150,105,0.16)]',
  },
  {
    card: 'border-amber-200/70 bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/40 dark:to-slate-900 dark:border-amber-800/50',
    header: 'border-amber-100/80 bg-gradient-to-r from-amber-100/70 via-amber-50/40 to-transparent dark:border-amber-800/40 dark:from-amber-900/40',
    icon: 'bg-amber-500 text-white shadow-amber-500/25',
    accent: 'border-amber-500',
    accentBar: 'bg-amber-500',
    label: 'text-amber-700 dark:text-amber-300',
    solutionBox: 'bg-gradient-to-br from-amber-50 to-orange-50/80 dark:from-amber-950/35 dark:to-slate-900/80',
    solutionLabel: 'text-amber-700 dark:text-amber-300',
    divider: 'text-amber-400',
    activeRing: 'ring-1 ring-amber-300/50 shadow-[0_18px_50px_rgba(245,158,11,0.16)]',
  },
] as const

const AUTO_MS = 6500
const CARD_WIDTH_CLASS = 'w-[min(86vw,30rem)]'
/** Tres copias para loop infinito sin saltos visibles */
const LOOP_COPIES = 3

export function ProblemSection() {
  const messages = useMessages()
  const p = messages.problems
  const chipTitles = p.chipTitles
  const chipResults = p.chipResults
  const scrollerRef = useRef<HTMLDivElement>(null)
  const jumpingRef = useRef(false)
  const [activeLogical, setActiveLogical] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = HOME_PROBLEMS.length
  const middleStart = total

  const loopSlides = useMemo(
    () =>
      Array.from({ length: total * LOOP_COPIES }, (_, trackIndex) => ({
        trackIndex,
        logicalIndex: trackIndex % total,
      })),
    [total],
  )

  const scrollToTrack = useCallback((trackIndex: number, behavior: ScrollBehavior = 'smooth') => {
    const scroller = scrollerRef.current
    const slide = scroller?.children[trackIndex] as HTMLElement | undefined
    if (!scroller || !slide) return
    const left = slide.offsetLeft - (scroller.clientWidth - slide.offsetWidth) / 2
    scroller.scrollTo({ left: Math.max(0, left), behavior })
  }, [])

  const normalizeLoop = useCallback(() => {
    const scroller = scrollerRef.current
    if (!scroller || jumpingRef.current) return

    const center = scroller.scrollLeft + scroller.clientWidth / 2
    let closest = middleStart
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

    const logical = closest % total
    setActiveLogical(logical)

    // Si estamos en la copia inicial o final, saltar a la copia del medio (sin animación)
    if (closest < total || closest >= total * 2) {
      jumpingRef.current = true
      const target = middleStart + logical
      scroller.classList.remove('scroll-smooth')
      scrollToTrack(target, 'auto')
      requestAnimationFrame(() => {
        scroller.classList.add('scroll-smooth')
        jumpingRef.current = false
      })
    }
  }, [middleStart, scrollToTrack, total])

  const goToLogical = useCallback(
    (logicalIndex: number, direction: 1 | -1 | 0 = 0) => {
      const scroller = scrollerRef.current
      if (!scroller) return

      const center = scroller.scrollLeft + scroller.clientWidth / 2
      let currentTrack = middleStart
      let closestDist = Infinity
      Array.from(scroller.children).forEach((child, index) => {
        const el = child as HTMLElement
        const mid = el.offsetLeft + el.offsetWidth / 2
        const dist = Math.abs(mid - center)
        if (dist < closestDist) {
          closestDist = dist
          currentTrack = index
        }
      })

      let targetTrack: number
      if (direction === 1) {
        targetTrack = currentTrack + 1
      } else if (direction === -1) {
        targetTrack = currentTrack - 1
      } else {
        // Ir al mismo slide lógico más cercano en la copia del medio
        targetTrack = middleStart + ((logicalIndex % total) + total) % total
      }

      scrollToTrack(targetTrack, 'smooth')
      setActiveLogical(((logicalIndex % total) + total) % total)
    },
    [middleStart, scrollToTrack, total],
  )

  const goPrev = useCallback(() => {
    goToLogical((activeLogical - 1 + total) % total, -1)
  }, [activeLogical, goToLogical, total])

  const goNext = useCallback(() => {
    goToLogical((activeLogical + 1) % total, 1)
  }, [activeLogical, goToLogical, total])

  // Arrancar en la primera tarjeta de la copia del medio (centrada)
  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      const scroller = scrollerRef.current
      scroller?.classList.remove('scroll-smooth')
      scrollToTrack(middleStart, 'auto')
      requestAnimationFrame(() => scroller?.classList.add('scroll-smooth'))
    })
    return () => window.cancelAnimationFrame(id)
  }, [middleStart, scrollToTrack])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    let raf = 0
    const onScroll = () => {
      if (jumpingRef.current) return
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(normalizeLoop)
    }

    scroller.addEventListener('scroll', onScroll, { passive: true })
    scroller.addEventListener('scrollend', normalizeLoop)
    return () => {
      cancelAnimationFrame(raf)
      scroller.removeEventListener('scroll', onScroll)
      scroller.removeEventListener('scrollend', normalizeLoop)
    }
  }, [normalizeLoop])

  useEffect(() => {
    if (paused) return
    const id = window.setInterval(() => {
      goNext()
    }, AUTO_MS)
    return () => window.clearInterval(id)
  }, [goNext, paused])

  return (
    <section id="problem" className="relative isolate overflow-hidden bg-slate-50/90 py-16 sm:py-24">
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

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="container-padding mx-auto mb-8 max-w-3xl px-4 text-center sm:mb-10 sm:px-6">
          <SectionLabel>{p.sectionLabel}</SectionLabel>
          <SectionTitle>
            {p.titleBefore}
            <span className="text-brand">{p.titleAccent}</span>
          </SectionTitle>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">{p.subtitle}</p>
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
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-5"
            style={{
              paddingLeft: 'max(1rem, calc((100% - min(86vw, 30rem)) / 2))',
              paddingRight: 'max(1rem, calc((100% - min(86vw, 30rem)) / 2))',
            }}
            aria-roledescription="carrusel"
            aria-label={p.carouselLabel}
          >
            {loopSlides.map(({ trackIndex, logicalIndex }) => {
              const item = HOME_PROBLEMS[logicalIndex]
              const Icon = PROBLEM_ICONS[item.icon]
              const copy = p.items[logicalIndex]
              const chipTitle = chipTitles[logicalIndex] ?? ''
              const theme = CARD_THEMES[logicalIndex % CARD_THEMES.length]
              if (!copy) return null
              const active = logicalIndex === activeLogical
              return (
                <article
                  key={`${chipTitle}-${trackIndex}`}
                  className={`${CARD_WIDTH_CLASS} shrink-0 snap-center`}
                  aria-roledescription="slide"
                  aria-label={`${p.situationLabel} ${logicalIndex + 1}: ${chipTitle}`}
                  aria-hidden={trackIndex < total || trackIndex >= total * 2}
                >
                  <div
                    className={`flex h-full flex-col overflow-hidden rounded-[1.75rem] border backdrop-blur-sm transition duration-300 ${theme.card} ${
                      active ? theme.activeRing : 'opacity-85 scale-[0.985]'
                    }`}
                  >
                    <div className={`flex items-center gap-3 border-b px-5 py-4 sm:px-7 ${theme.header}`}>
                      <span
                        className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm ${theme.icon}`}
                      >
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <div>
                        <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${theme.label}`}>
                          {p.situationLabel} {logicalIndex + 1}
                        </p>
                        <p className="text-base font-bold text-slate-900 dark:text-slate-50">{chipTitle}</p>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col px-5 py-6 sm:px-7 sm:py-7">
                      <div className={`border-l-4 pl-4 sm:pl-5 ${theme.accent}`}>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          {p.problemLabel}
                        </p>
                        <h3 className="mt-2 text-xl font-bold leading-snug tracking-tight text-slate-900 dark:text-slate-50 sm:text-2xl">
                          {copy.problem}
                        </h3>
                      </div>

                      <div className={`my-5 flex items-center gap-3 ${theme.divider}`} aria-hidden>
                        <span className="h-px flex-1 bg-current opacity-25" />
                        <ArrowDown className="h-4 w-4" />
                        <span className="h-px flex-1 bg-current opacity-25" />
                      </div>

                      <div className={`mt-auto rounded-2xl px-4 py-4 sm:px-5 sm:py-5 ${theme.solutionBox}`}>
                        <p
                          className={`mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] ${theme.solutionLabel}`}
                        >
                          <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
                          {p.solutionLabel}
                        </p>
                        <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 sm:text-[1.05rem]">
                          {copy.solution}
                        </p>
                        <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                          <span className={`h-1.5 w-8 rounded-full ${theme.accentBar}`} aria-hidden />
                          {chipResults[logicalIndex]}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="container-padding mx-auto mt-5 flex max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
            <div className="flex items-center gap-1.5">
              {HOME_PROBLEMS.map((_, index) => (
                <button
                  key={chipTitles[index] ?? index}
                  type="button"
                  aria-label={`${p.goToSituation} ${chipTitles[index] ?? index + 1}`}
                  onClick={() => goToLogical(index, 0)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === activeLogical ? 'w-8 bg-brand' : 'w-1.5 bg-slate-300 hover:bg-brand/40'
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrev}
                aria-label={p.prevSituation}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-brand shadow-sm transition hover:border-brand/30 hover:bg-brand/[0.04] dark:border-slate-700 dark:bg-slate-900"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label={p.nextSituation}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-brand shadow-sm transition hover:border-brand/30 hover:bg-brand/[0.04] dark:border-slate-700 dark:bg-slate-900"
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
            </div>
          </div>
        </div>

        <div className="container-padding mx-auto mt-10 flex max-w-6xl flex-col items-center px-4 sm:mt-12 sm:px-6">
          <div className="flex w-full max-w-xl flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={quoteUrl()}
              className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-4 text-base font-semibold text-white shadow-md transition hover:bg-brand-light active:scale-[0.98] sm:w-auto"
            >
              <Rocket className="h-5 w-5 shrink-0" aria-hidden />
              {p.ctaPrimary}
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
            <a
              href={buildWhatsAppUrl(messages.whatsappMessages.problem)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-4 text-base font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] sm:w-auto dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <TechLogo name="WhatsApp" size={22} />
              {p.ctaSecondary}
            </a>
          </div>
          <p className="mt-4 inline-flex items-center gap-2 text-sm text-slate-500">
            <Shield className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
            {p.trustNote}
          </p>
        </div>
      </div>
    </section>
  )
}
