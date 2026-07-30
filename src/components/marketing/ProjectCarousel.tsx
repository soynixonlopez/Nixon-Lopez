'use client'

import { useCallback, useRef, useState } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import type { FeaturedProject } from '@/lib/case-studies'
import { ProjectPreviewImage } from '@/components/marketing/ProjectPreviewImage'

const SWIPE_THRESHOLD = 48

const CATEGORY_STYLES_LIGHT = {
  blue: 'bg-blue-50 text-blue-700 ring-blue-100',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  purple: 'bg-purple-50 text-purple-700 ring-purple-100',
  orange: 'bg-amber-50 text-amber-700 ring-amber-100',
  pink: 'bg-pink-50 text-pink-700 ring-pink-100',
} as const

const CATEGORY_STYLES_DARK = {
  blue: 'bg-neon-blue/15 text-neon-blue ring-neon-blue/25',
  green: 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/25',
  purple: 'bg-neon-purple/15 text-neon-purple ring-neon-purple/25',
  orange: 'bg-amber-500/15 text-amber-400 ring-amber-500/25',
  pink: 'bg-pink-500/15 text-pink-400 ring-pink-500/25',
} as const

type CarouselTheme = 'light' | 'dark'

type Props = {
  projects: FeaturedProject[]
  theme?: CarouselTheme
}

function ProjectCard({
  project,
  isFocused,
  onHover,
  onLeave,
  layout = 'desktop',
  theme = 'light',
}: {
  project: FeaturedProject
  isFocused: boolean
  onHover?: () => void
  onLeave?: () => void
  layout?: 'desktop' | 'mobile'
  theme?: CarouselTheme
}) {
  const isDark = theme === 'dark'
  const categoryStyles = isDark ? CATEGORY_STYLES_DARK : CATEGORY_STYLES_LIGHT
  const categoryClass = categoryStyles[project.categoryTone]

  return (
    <article
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`group flex h-full flex-col overflow-hidden rounded-3xl border transition-all duration-300 ease-out ${
        isDark ? 'bg-[#0a0f18]' : 'bg-white'
      } ${
        isFocused
          ? isDark
            ? 'border-neon-blue/40 shadow-[0_0_0_1px_rgba(0,212,255,0.2),0_24px_60px_rgba(0,212,255,0.18)] scale-[1.02] z-10'
            : 'border-purple-200/80 shadow-[0_0_0_1px_rgba(139,92,246,0.15),0_24px_60px_rgba(99,102,241,0.14)] scale-[1.02] z-10'
          : isDark
            ? 'border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.35)] opacity-[0.88] scale-[0.98]'
            : 'border-slate-200/80 shadow-[0_8px_30px_rgba(15,23,42,0.06)] opacity-[0.88] scale-[0.98]'
      } ${layout === 'desktop' ? 'min-h-[420px]' : 'min-h-[380px]'}`}
    >
      <div className={`relative aspect-[16/11] sm:aspect-[16/10] overflow-hidden ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
        <ProjectPreviewImage
          src={project.image}
          alt={`Proyecto ${project.company}`}
          isDark={isDark}
          sizes={isFocused ? '(max-width: 768px) 90vw, 520px' : '(max-width: 768px) 70vw, 220px'}
          className={`object-cover object-top transition-transform duration-300 ${isFocused ? 'scale-105' : 'scale-100'}`}
        />
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${categoryClass}`}>
          {project.category}
        </span>
        <h3 className={`mt-3 text-base font-bold leading-snug sm:text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {project.company}
        </h3>
        <p
          className={`mt-2 text-sm leading-relaxed transition-all duration-300 ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          } ${isFocused ? 'line-clamp-none' : 'line-clamp-2'}`}
        >
          {project.description}
        </p>
        <a
          href={project.demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold transition hover:gap-2 ${
            isDark ? 'text-neon-blue hover:text-neon-purple' : 'text-brand hover:gap-2'
          } ${isFocused ? 'opacity-100' : 'opacity-80'}`}
        >
          Ver proyecto
          <ArrowRight className="h-4 w-4" aria-hidden />
        </a>
      </div>
    </article>
  )
}

export function ProjectCarousel({ projects, theme = 'light' }: Props) {
  const isDark = theme === 'dark'
  const [activeIndex, setActiveIndex] = useState(Math.min(1, projects.length - 1))
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const touchStartX = useRef<number | null>(null)
  const total = projects.length
  const focusIndex = hoveredIndex ?? activeIndex

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((index + total) % total)
      setHoveredIndex(null)
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

  const navBtnClass = isDark
    ? 'flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-neon-blue shadow-sm transition hover:border-neon-blue/40 hover:bg-white/10'
    : 'flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-brand shadow-sm transition hover:border-brand/30 hover:bg-slate-50'

  const dotActiveClass = isDark ? 'h-2.5 w-2.5 bg-neon-blue' : 'h-2.5 w-2.5 bg-brand'
  const dotInactiveClass = isDark
    ? 'h-2 w-2 bg-white/25 hover:bg-white/40'
    : 'h-2 w-2 bg-slate-300 hover:bg-slate-400'

  return (
    <div>
      {/* Desktop — expandable gallery */}
      <div
        className="hidden h-[440px] items-stretch gap-3 md:flex lg:h-[460px] lg:gap-4"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {projects.map((project, index) => {
          const isFocused = index === focusIndex
          return (
            <div
              key={project.slug}
              className={`transition-all duration-300 ease-out ${
                isFocused ? 'min-w-[300px] flex-[2.35]' : 'max-w-[220px] min-w-[150px] flex-[1]'
              }`}
            >
              <ProjectCard
                project={project}
                isFocused={isFocused}
                onHover={() => setHoveredIndex(index)}
                onLeave={() => setHoveredIndex(null)}
                theme={theme}
              />
            </div>
          )
        })}
      </div>

      {/* Mobile — swipe carousel */}
      <div className="md:hidden" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="overflow-hidden px-1">
          <ProjectCard project={projects[activeIndex]} isFocused layout="mobile" theme={theme} />
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button type="button" onClick={goPrev} aria-label="Proyecto anterior" className={navBtnClass}>
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>

        <div className="flex items-center gap-2">
          {projects.map((project, index) => (
            <button
              key={project.slug}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Ver ${project.company}`}
              className={`rounded-full transition-all duration-300 ${
                index === activeIndex ? dotActiveClass : dotInactiveClass
              }`}
            />
          ))}
        </div>

        <button type="button" onClick={goNext} aria-label="Proyecto siguiente" className={navBtnClass}>
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </div>
  )
}
