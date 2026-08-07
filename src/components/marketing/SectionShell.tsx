'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { CtaButtons } from '@/components/marketing/CtaButtons'
import { SectionLabel } from '@/components/marketing/SectionLabel'
import { SectionTitle } from '@/components/marketing/SectionTitle'

type Props = {
  id?: string
  eyebrow?: string
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
  tone?: 'white' | 'muted'
  cta?: boolean
  quoteHref?: string
  whatsappMessage?: string
  quoteLabel?: string
  whatsappLabel?: string
}

export function SectionShell({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className = '',
  tone = 'white',
  cta = false,
  quoteHref,
  whatsappMessage,
  quoteLabel,
  whatsappLabel,
}: Props) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const bg = tone === 'muted' ? 'bg-slate-50' : 'bg-white'

  return (
    <section id={id} ref={ref} className={`py-16 sm:py-24 ${bg} ${className}`}>
      <div className="container-padding max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-10 sm:mb-14"
        >
          {eyebrow ? <SectionLabel align="left">{eyebrow}</SectionLabel> : null}
          <SectionTitle>
            {title}
          </SectionTitle>
          {subtitle ? (
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">{subtitle}</p>
          ) : null}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          {children}
        </motion.div>

        {cta ? (
          <div className="mt-10 sm:mt-12">
            <CtaButtons
              quoteHref={quoteHref}
              whatsappMessage={whatsappMessage}
              quoteLabel={quoteLabel}
              whatsappLabel={whatsappLabel}
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}
