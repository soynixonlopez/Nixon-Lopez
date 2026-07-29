'use client'

import Image from 'next/image'
import { INSTRUCTOR_TECH } from '@/lib/masterclass'
import aboutMeLandingWebp from '../../../public/images/aboutme_landing.webp'
import {
  GlowOrb,
  MasterclassSection,
  PremiumCard,
  SectionBadge,
  SectionLead,
  SectionTitle,
} from './shared'

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

        {/* Foto — derecha, resolución nativa sin recorte forzado */}
        <div className="relative order-1 mx-auto w-full max-w-md lg:order-2 lg:mx-0 lg:max-w-none">
          <div
            className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-neon-blue/30 to-neon-purple/30 blur-2xl"
            aria-hidden
          />
          <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#1a1a1a] shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
            <Image
              src={aboutMeLandingWebp}
              alt="Nixon López — Frontend Developer"
              width={aboutMeLandingWebp.width}
              height={aboutMeLandingWebp.height}
              quality={95}
              placeholder="blur"
              blurDataURL={aboutMeLandingWebp.blurDataURL}
              className="h-auto w-full object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 640px"
            />
          </div>
        </div>
      </div>
    </MasterclassSection>
  )
}
