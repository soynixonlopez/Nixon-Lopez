'use client'

import Image from 'next/image'
import { Instagram, Linkedin } from 'lucide-react'
import { INSTRUCTOR_SOCIAL, INSTRUCTOR_TECH } from '@/lib/masterclass'
import masterclassAbout from '../../../public/images/nixon/masterclass_about.webp'
import {
  GlowOrb,
  MasterclassSection,
  PremiumCard,
  SectionBadge,
  SectionLead,
  SectionTitle,
} from './shared'

const SOCIAL_STYLES = {
  Instagram: {
    icon: Instagram,
    className:
      'border-pink-500/30 bg-gradient-to-br from-pink-500/15 to-purple-500/10 hover:border-pink-400/50 hover:from-pink-500/25',
    iconClass: 'text-pink-400',
  },
  LinkedIn: {
    icon: Linkedin,
    className:
      'border-[#0A66C2]/30 bg-gradient-to-br from-[#0A66C2]/15 to-[#004182]/10 hover:border-[#0A66C2]/50 hover:from-[#0A66C2]/25',
    iconClass: 'text-[#0A66C2]',
  },
} as const

export default function Instructor() {
  return (
    <MasterclassSection id="instructor" className="bg-[#050810]">
      <GlowOrb className="right-1/4 top-1/2 h-80 w-80 -translate-y-1/2 bg-neon-purple/10" />

      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Texto — izquierda */}
        <div className="order-2 lg:order-1">
          <SectionBadge>Instructor</SectionBadge>
          <SectionTitle>Nixon López</SectionTitle>
          <p className="mt-3 text-lg font-medium text-neon-blue">
            Frontend Developer especializado en desarrollo web moderno e Inteligencia Artificial.
          </p>

          <SectionLead>
            He creado soluciones digitales, páginas web y plataformas utilizando tecnologías modernas.
            En esta masterclass compartiré el proceso y herramientas que utilizo actualmente.
          </SectionLead>

          <PremiumCard className="mt-8 !p-5" delay={0}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Conóceme más
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {INSTRUCTOR_SOCIAL.map((social) => {
                const style = SOCIAL_STYLES[social.label]
                const Icon = style.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center gap-3 rounded-xl border p-3.5 transition-all duration-300 hover:-translate-y-0.5 ${style.className}`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/20 ${style.iconClass}`}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-white">{social.label}</span>
                      <span className="block truncate text-xs text-slate-400 group-hover:text-slate-300">
                        {social.handle}
                      </span>
                    </span>
                  </a>
                )
              })}
            </div>
          </PremiumCard>

          <PremiumCard className="mt-4 !p-5" delay={0.05}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Tecnologías
            </p>
            <div className="flex flex-wrap gap-2">
              {INSTRUCTOR_TECH.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </PremiumCard>
        </div>

        {/* Imagen compuesta — derecha */}
        <div className="relative order-1 mx-auto w-full max-w-lg lg:order-2 lg:mx-0 lg:max-w-none">
          <div
            className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-neon-blue/25 to-neon-purple/25 blur-2xl"
            aria-hidden
          />
          <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-black shadow-[0_24px_64px_rgba(0,0,0,0.55)]">
            <Image
              src={masterclassAbout}
              alt="Nixon López creando páginas web profesionales con proyectos reales"
              width={masterclassAbout.width}
              height={masterclassAbout.height}
              quality={80}
              className="h-auto w-full object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 560px"
            />
          </div>
        </div>
      </div>
    </MasterclassSection>
  )
}
