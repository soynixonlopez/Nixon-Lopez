'use client'

import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { BOOTCAMP_HOTMART_URL, BOOTCAMP_PRICING } from '@/lib/bootcamp'
import { bootcampCtaPrimary } from '@/lib/bootcamp-ui'

export {
  fadeUp,
  staggerContainer,
  MasterclassSection as BootcampSection,
  SectionBadge,
  SectionTitle,
  SectionLead,
  PremiumCard,
  GlowOrb,
  MasterclassCta,
} from '@/components/masterclass/shared'

export function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <motion.span variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="mb-4 inline-flex items-center gap-2 rounded-full border border-neon-blue/30 bg-neon-blue/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-neon-blue">
      {children}
    </motion.span>
  )
}

export function SectionCta({
  label = BOOTCAMP_PRICING.ctaLabel,
  href = BOOTCAMP_HOTMART_URL,
  className = '',
}: {
  label?: string
  href?: string
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`mt-10 flex justify-center ${className}`}
    >
      <a href={href} target="_blank" rel="noopener noreferrer" className={bootcampCtaPrimary}>
        {label}
      </a>
    </motion.div>
  )
}

export function GradientHighlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gradient-to-r from-neon-blue via-white to-neon-purple bg-clip-text text-transparent">
      {children}
    </span>
  )
}

export function InlineCta({ label = BOOTCAMP_PRICING.ctaEnrollLabel }: { label?: string }) {
  return (
    <a
      href={BOOTCAMP_HOTMART_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-neon-blue transition hover:text-white"
    >
      {label}
      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
    </a>
  )
}
