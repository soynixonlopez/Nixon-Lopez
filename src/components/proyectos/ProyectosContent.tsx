'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, ArrowLeft, ArrowRight } from 'lucide-react'
import { CtaButtons } from '@/components/marketing/CtaButtons'
import { useMessages } from '@/i18n/LocaleProvider'
import { MORE_PROJECTS, quoteUrl } from '@/lib/marketing'
import { isLivePreviewImage } from '@/lib/case-studies'

export function ProyectosContent() {
  const messages = useMessages()
  const p = messages.projectsPage

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 pt-24 sm:pt-28 pb-16">
      <div className="container-padding max-w-6xl mx-auto px-4 sm:px-6">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 min-h-[44px]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {p.backToCases}
        </Link>

        <header className="mt-4 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand mb-3">{p.eyebrow}</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
            {p.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">{p.subtitle}</p>
        </header>

        <div className="mt-10 sm:mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {MORE_PROJECTS.map((project) => {
            const copy = p.moreProjects.find((item) => item.slug === project.slug)
            const category = copy?.category ?? project.category
            const summary = copy?.summary ?? project.summary
            const alt = p.projectAlt.replace('{company}', project.company)

            return (
              <article
                key={project.slug}
                className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-md hover:border-brand/20 transition"
              >
                <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-800">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={alt}
                      fill
                      className="object-contain object-top bg-slate-50 dark:bg-slate-800"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      unoptimized={isLivePreviewImage(project.image)}
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-brand/10 via-slate-50 to-brand/5 dark:from-brand/20 dark:via-slate-900 dark:to-brand/10 p-6 text-center">
                      <p className="text-xs font-semibold uppercase tracking-wider text-brand">{p.campaignFallback}</p>
                      <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">{project.company}</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-1 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand">{category}</p>
                  <h2 className="mt-2 text-lg font-bold text-slate-900 dark:text-slate-50">{project.company}</h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-1">{summary}</p>
                  {project.demoUrl ? (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100 hover:border-slate-300 dark:hover:border-slate-600 min-h-[48px] transition"
                    >
                      {p.viewProject}
                      <ExternalLink className="h-4 w-4" aria-hidden />
                    </a>
                  ) : (
                    <p className="mt-5 text-xs text-slate-500 italic">{p.marketingOnly}</p>
                  )}
                </div>
              </article>
            )
          })}
        </div>

        <div className="mt-14 sm:mt-16 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6 sm:p-10 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50">{p.ctaTitle}</h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">{p.ctaSubtitle}</p>
          <CtaButtons
            className="mt-6 justify-center"
            quoteHref={quoteUrl()}
            quoteLabel={messages.common.getQuote}
            whatsappMessage={messages.whatsappMessages.cases}
            whatsappLabel={messages.common.whatsappLong}
          />
          <Link
            href="/"
            className="mt-4 inline-flex items-center justify-center gap-2 text-sm font-semibold text-brand hover:underline min-h-[44px]"
          >
            {p.backHome}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </main>
  )
}
