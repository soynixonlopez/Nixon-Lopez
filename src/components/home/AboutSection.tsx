'use client'

import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Check, Github, Instagram, Linkedin } from 'lucide-react'
import { SectionLabel } from '@/components/marketing/SectionLabel'
import { SectionTitle } from '@/components/marketing/SectionTitle'
import { BRAND_ICON_TONES } from '@/lib/brand-icons'
import { ABOUT_CHECKLIST, ABOUT_SOCIAL, ABOUT_STATS, HOME_IMAGES } from '@/lib/marketing'

const SOCIAL_STYLES = {
  linkedin: {
    Icon: Linkedin,
    className: 'bg-[#0A66C2] text-white hover:bg-[#084e96]',
  },
  github: {
    Icon: Github,
    className: 'bg-slate-900 text-white hover:bg-slate-800',
  },
  instagram: {
    Icon: Instagram,
    className: 'bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white hover:opacity-95',
  },
} as const

export function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="about" ref={ref} className="relative isolate overflow-hidden bg-white py-16 sm:py-24">
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-full max-w-xl bg-gradient-to-l from-brand/[0.04] to-transparent lg:w-1/2"
        aria-hidden
      />

      <div className="container-padding relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.5 }}
          >
            <SectionLabel align="left">Sobre mí</SectionLabel>

            <SectionTitle>
              Trabajo contigo directamente,{' '}
              <span className="text-brand">no con una agencia donde nadie conoce tu proyecto</span>
            </SectionTitle>

            <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
              Soy Nixon López, desarrollador web especializado en crear páginas y soluciones digitales para negocios
              que quieren mejorar su presencia online y conseguir más clientes.
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              Mi enfoque no es solamente crear una web bonita, sino entender tu negocio y construir una solución que
              realmente ayude a crecer.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3 max-w-xl">
              {ABOUT_STATS.map((stat) => {
                const theme = BRAND_ICON_TONES[stat.color]
                return (
                  <div key={stat.label} className={`rounded-xl border px-3 py-3 sm:px-4 sm:py-4 ${theme.card}`}>
                    <p className={`text-2xl font-bold tracking-tight sm:text-3xl ${theme.icon}`}>{stat.value}</p>
                    <p className="mt-1 text-[11px] leading-snug text-slate-600 sm:text-xs">{stat.label}</p>
                  </div>
                )
              })}
            </div>

            <ul className="mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
              {ABOUT_CHECKLIST.map((item, index) => {
                const tones = ['blue', 'green', 'purple', 'orange'] as const
                const theme = BRAND_ICON_TONES[tones[index % tones.length]]
                return (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-slate-700 sm:text-base">
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${theme.wrap}`}>
                      <Check className="h-3.5 w-3.5" strokeWidth={2.75} aria-hidden />
                    </span>
                    {item}
                  </li>
                )
              })}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <figure className="relative overflow-hidden rounded-2xl border border-brand/15 bg-brand shadow-[0_28px_70px_rgba(30,58,95,0.22)]">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={HOME_IMAGES.about}
                  alt="Nixon López en su espacio de trabajo — desarrollo web en Panamá"
                  fill
                  className="object-cover object-[center_18%]"
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 420px, 560px"
                  quality={85}
                />
              </div>

              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand via-brand/80 to-transparent px-5 pb-5 pt-24">
                <p className="text-lg font-bold text-white">Nixon López</p>
                <p className="mt-0.5 text-sm text-white/85">Desarrollo web · Panamá</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {ABOUT_SOCIAL.map((social) => {
                    const style = SOCIAL_STYLES[social.tone]
                    const Icon = style.Icon
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Seguir en ${social.label}`}
                        className={`inline-flex min-h-[44px] items-center gap-2 rounded-md px-3.5 py-2 text-sm font-semibold shadow-sm transition active:scale-[0.98] ${style.className}`}
                      >
                        <Icon className="h-4 w-4 shrink-0" aria-hidden />
                        {social.label}
                      </a>
                    )
                  })}
                </div>
              </figcaption>
            </figure>

            <p className="mt-3 text-center text-xs text-slate-500 sm:text-left">
              Sígueme para ver proyectos, tips y actualizaciones.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
