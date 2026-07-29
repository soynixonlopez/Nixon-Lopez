'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import TechLogo from '@/components/TechLogo'
import { buildWhatsAppUrl, quoteUrl, WHATSAPP_MESSAGES } from '@/lib/marketing'

type Props = {
  quoteHref?: string
  whatsappMessage?: string
  quoteLabel?: string
  whatsappLabel?: string
  layout?: 'row' | 'column'
  size?: 'sm' | 'md' | 'lg'
  showQuote?: boolean
  showWhatsApp?: boolean
  className?: string
  fullWidthMobile?: boolean
}

const sizeClasses = {
  sm: 'text-sm px-4 py-3 min-h-[48px]',
  md: 'text-sm sm:text-base px-5 py-3.5 min-h-[48px]',
  lg: 'text-base px-6 py-4 min-h-[52px]',
}

export function CtaButtons({
  quoteHref = quoteUrl(),
  whatsappMessage = WHATSAPP_MESSAGES.default,
  quoteLabel = 'Obtener cotización',
  whatsappLabel = 'Hablemos por WhatsApp',
  layout = 'row',
  size = 'md',
  showQuote = true,
  showWhatsApp = true,
  className = '',
  fullWidthMobile = true,
}: Props) {
  const layoutClass = layout === 'column' ? 'flex-col' : 'flex-col sm:flex-row'
  const widthClass = fullWidthMobile ? 'w-full sm:w-auto' : ''

  return (
    <div className={`flex ${layoutClass} gap-3 ${className}`}>
      {showQuote ? (
        <Link
          href={quoteHref}
          className={`inline-flex items-center justify-center gap-2 rounded-full bg-brand font-semibold text-white shadow-sm transition hover:bg-brand-light active:scale-[0.98] ${sizeClasses[size]} ${widthClass}`}
        >
          {quoteLabel}
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
        </Link>
      ) : null}
      {showWhatsApp ? (
        <a
          href={buildWhatsAppUrl(whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] ${sizeClasses[size]} ${widthClass}`}
        >
          <TechLogo name="WhatsApp" size={20} />
          {whatsappLabel}
        </a>
      ) : null}
    </div>
  )
}
