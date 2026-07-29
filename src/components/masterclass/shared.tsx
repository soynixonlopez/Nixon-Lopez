'use client'

import { motion, useInView, type Variants } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

type SectionProps = {
  id?: string
  children: ReactNode
  className?: string
  dark?: boolean
}

export function MasterclassSection({ id, children, className = '', dark = true }: SectionProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section
      id={id}
      ref={ref}
      className={`relative py-16 sm:py-20 lg:py-24 ${dark ? 'text-white' : ''} ${className}`}
    >
      <motion.div
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={staggerContainer}
        className="container relative z-10"
      >
        {children}
      </motion.div>
    </section>
  )
}

export function SectionBadge({ children }: { children: ReactNode }) {
  return (
    <motion.span
      variants={fadeUp}
      className="mb-4 inline-flex items-center gap-2 rounded-full border border-neon-blue/30 bg-neon-blue/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-neon-blue"
    >
      {children}
    </motion.span>
  )
}

export function SectionTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.h2
      variants={fadeUp}
      className={`text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem] ${className}`}
    >
      {children}
    </motion.h2>
  )
}

export function SectionLead({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.p
      variants={fadeUp}
      className={`mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg ${className}`}
    >
      {children}
    </motion.p>
  )
}

type CtaButtonProps = {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'outline'
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}

export function MasterclassCta({
  children,
  href = '#registro',
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
}: CtaButtonProps) {
  const base =
    'inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl px-8 py-4 text-sm font-bold uppercase tracking-wide transition-all duration-300 sm:text-base'
  const styles =
    variant === 'primary'
      ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-[0_0_40px_rgba(0,212,255,0.35)] hover:shadow-[0_0_56px_rgba(0,212,255,0.5)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100'
      : 'border border-white/20 bg-white/5 text-white hover:border-neon-blue/50 hover:bg-white/10'

  const cls = `${base} ${styles} ${className}`

  if (type === 'submit' || !href) {
    return (
      <button type={type} onClick={onClick} disabled={disabled} className={cls}>
        {children}
      </button>
    )
  }

  return (
    <a href={href} onClick={onClick} className={cls}>
      {children}
    </a>
  )
}

export function GlowOrb({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full blur-3xl ${className ?? ''}`}
    />
  )
}

export function PremiumCard({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      custom={delay}
      variants={fadeUp}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-sm transition-colors hover:border-neon-blue/30 hover:bg-white/[0.06] sm:p-8 ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0,212,255,0.06), transparent 40%)',
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
