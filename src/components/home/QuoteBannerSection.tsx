'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  ArrowRight,
  Calculator,
  Code,
  Lock,
  Monitor,
  Rocket,
  ShoppingCart,
} from 'lucide-react'
import { SectionLabel } from '@/components/marketing/SectionLabel'
import { SectionTitle } from '@/components/marketing/SectionTitle'
import { useMessages } from '@/i18n/LocaleProvider'
import { BRAND_ICON_TONES } from '@/lib/brand-icons'
import { QUOTE_FORM_OPTIONS, quoteUrl } from '@/lib/marketing'

const FORM_ICONS = { monitor: Monitor, rocket: Rocket, cart: ShoppingCart, code: Code } as const

export function QuoteBannerSection() {
  const messages = useMessages()
  const q = messages.quoteBanner
  const router = useRouter()
  const [selectedService, setSelectedService] = useState<string>(q.formOptions[0]?.id ?? 'web-negocio')
  const [projectDetail, setProjectDetail] = useState('')

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const option = QUOTE_FORM_OPTIONS.find((item) => item.id === selectedService)
    if (!option) return
    const base = quoteUrl(selectedService)
    const url = projectDetail
      ? `${base}${base.includes('?') ? '&' : '?'}detail=${encodeURIComponent(projectDetail)}`
      : base
    router.push(url)
  }

  return (
    <section id="cotizar" className="relative isolate overflow-hidden bg-white py-16 sm:py-24">
      <div
        className="pointer-events-none absolute top-0 left-0 h-64 w-64 rounded-full bg-gradient-to-br from-blue-100/50 to-transparent blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-gradient-to-tl from-purple-100/40 to-transparent blur-3xl"
        aria-hidden
      />

      <div className="container-padding relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-8 max-w-3xl text-center lg:mb-12">
          <SectionLabel>{q.sectionLabel}</SectionLabel>
          <SectionTitle>
            {q.titleBefore}
            <span className="text-brand">{q.titleAccent}</span>
          </SectionTitle>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">{q.subtitle}</p>
        </div>

        <div className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-10">
          {/* Izquierda — imagen */}
          <div className="h-full">
            <Link
              href={quoteUrl()}
              className="group relative block h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.08)] transition hover:shadow-[0_16px_48px_rgba(15,23,42,0.12)] sm:rounded-3xl"
            >
              <Image
                src="/images/cotizador.png"
                alt={q.imageAlt}
                width={1092}
                height={1440}
                priority
                unoptimized
                className="h-full min-h-[320px] w-full object-cover object-center transition duration-500 group-hover:scale-[1.02] sm:min-h-[420px]"
                sizes="(max-width: 1024px) 100vw, 540px"
              />
            </Link>
          </div>

          {/* Derecha — formulario */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)] sm:rounded-3xl sm:p-6 lg:p-7"
          >
            <div className="mb-6 flex items-start gap-3 border-b border-slate-100 pb-5">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${BRAND_ICON_TONES.blue.wrap}`}>
                <Calculator className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <p className="font-bold text-slate-900">{q.formTitle}</p>
                <p className="text-sm text-slate-500">{q.formSubtitle}</p>
              </div>
            </div>

            <fieldset className="space-y-3">
              <legend className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                  1
                </span>
                {q.step1Legend}
              </legend>
              {QUOTE_FORM_OPTIONS.map((option) => {
                const copy = q.formOptions.find((item) => item.id === option.id)
                if (!copy) return null
                const Icon = FORM_ICONS[option.icon]
                const theme = BRAND_ICON_TONES[option.color]
                const isSelected = selectedService === option.id
                return (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition ${
                      isSelected
                        ? `${theme.border} bg-slate-50 ring-2 ${theme.ring}`
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="quote-service"
                      value={option.id}
                      checked={isSelected}
                      onChange={() => setSelectedService(option.id)}
                      className="sr-only"
                    />
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${theme.wrap}`}>
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">{copy.title}</p>
                      <p className="text-xs text-slate-500 sm:text-sm">{copy.subtitle}</p>
                    </div>
                  </label>
                )
              })}
            </fieldset>

            <div className="mt-6">
              <label htmlFor="quote-detail" className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                  2
                </span>
                {q.step2Legend}
              </label>
              <select
                id="quote-detail"
                value={projectDetail}
                onChange={(event) => setProjectDetail(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
              >
                <option value="">{q.detailPlaceholder}</option>
                {q.detailOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-md bg-brand px-6 py-4 text-base font-semibold text-white transition hover:bg-brand-light active:scale-[0.98]"
            >
              {q.submit}
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </button>

            <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
              <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {q.footerNote}
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
