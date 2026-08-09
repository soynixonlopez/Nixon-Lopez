'use client'

import { useMessages } from '@/i18n/LocaleProvider'

export function TrustStrip() {
  const messages = useMessages()
  const { trustStrip } = messages

  return (
    <section aria-label={trustStrip.ariaLabel} className="border-y border-slate-200 bg-slate-50 py-4 sm:py-5 dark:border-slate-800 dark:bg-slate-950">
      <div className="container-padding max-w-6xl mx-auto px-4 sm:px-6">
        <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-8">
          {trustStrip.labels.map((label) => (
            <li
              key={label}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand shrink-0" aria-hidden />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
