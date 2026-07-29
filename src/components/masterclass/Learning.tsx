'use client'

import { CheckCircle2 } from 'lucide-react'
import {
  MASTERCLASS_AUDIENCE,
  MASTERCLASS_LEARNING,
  MASTERCLASS_LIVE_DEMO,
} from '@/lib/masterclass'
import {
  GlowOrb,
  MasterclassSection,
  PremiumCard,
  SectionBadge,
  SectionLead,
  SectionTitle,
} from './shared'

export default function Learning() {
  return (
    <>
      {/* Lo que aprenderás */}
      <MasterclassSection id="aprendizaje">
        <GlowOrb className="left-0 top-0 h-64 w-64 bg-neon-blue/10" />

        <SectionBadge>Contenido de la masterclass</SectionBadge>
        <SectionTitle>Lo que aprenderás durante la Masterclass</SectionTitle>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MASTERCLASS_LEARNING.map((item, i) => (
            <PremiumCard
              key={item.title}
              delay={i}
              className={i === 4 ? 'sm:col-span-2 lg:col-span-1' : ''}
            >
              <span className="text-2xl" aria-hidden>
                {item.emoji}
              </span>
              <h3 className="mt-3 text-lg font-bold leading-snug text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.description}</p>
            </PremiumCard>
          ))}
        </div>
      </MasterclassSection>

      {/* Demostración en vivo */}
      <MasterclassSection className="bg-[#070d18]">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionBadge>En vivo</SectionBadge>
            <SectionTitle>No será solo teoría, veremos el proceso real</SectionTitle>
            <SectionLead>
              Durante la clase veremos cómo una idea se convierte en una página web utilizando
              herramientas actuales.
            </SectionLead>
          </div>

          <div className="relative">
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 blur-xl" aria-hidden />
            <div className="relative grid gap-4 sm:grid-cols-2">
              {MASTERCLASS_LIVE_DEMO.map((item, i) => (
                <PremiumCard key={item.step} delay={i} className="!p-5">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-neon-blue/20 text-sm font-bold text-neon-blue">
                    {i + 1}
                  </div>
                  <h3 className="font-bold text-white">{item.step}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{item.description}</p>
                </PremiumCard>
              ))}
            </div>
          </div>
        </div>
      </MasterclassSection>

      {/* Para quién es */}
      <MasterclassSection id="para-quien">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <SectionTitle>Esta Masterclass es para ti si...</SectionTitle>
          </div>

          <ul className="mt-10 flex flex-col gap-2.5">
            {MASTERCLASS_AUDIENCE.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 sm:px-5 sm:py-4"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-neon-blue" aria-hidden />
                <span className="text-sm leading-snug text-slate-200 sm:text-base sm:whitespace-nowrap">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </MasterclassSection>
    </>
  )
}
