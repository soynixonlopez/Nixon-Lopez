'use client'

import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { MASTERCLASS_PIPELINE, MASTERCLASS_PROBLEM_CARDS } from '@/lib/masterclass'
import {
  fadeUp,
  GlowOrb,
  MasterclassSection,
  PremiumCard,
  SectionLead,
  SectionTitle,
} from './shared'

export default function Benefits() {
  return (
    <>
      {/* Sección de problema */}
      <MasterclassSection id="beneficios" className="bg-[#050810]">
        <GlowOrb className="right-0 top-1/2 h-72 w-72 -translate-y-1/2 bg-neon-purple/10" />

        <div className="mx-auto max-w-3xl text-center">
          <SectionTitle>
            La inteligencia artificial está cambiando la forma de{' '}
            <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
              crear páginas web
            </span>
          </SectionTitle>
          <SectionLead className="mx-auto">
            Antes crear páginas profesionales requería años de aprendizaje. Hoy, con las herramientas
            correctas, puedes acelerar el proceso y desarrollar proyectos reales utilizando inteligencia
            artificial como asistente.
          </SectionLead>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MASTERCLASS_PROBLEM_CARDS.map((card, i) => (
            <PremiumCard key={card.title} delay={i}>
              <span className="text-3xl" aria-hidden>
                {card.emoji}
              </span>
              <h3 className="mt-4 text-xl font-bold text-white">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{card.description}</p>
            </PremiumCard>
          ))}
        </div>
      </MasterclassSection>

      {/* Sección de transformación */}
      <MasterclassSection className="border-y border-white/5 bg-[#070d18]">
        <div className="mx-auto max-w-3xl text-center">
          <SectionTitle>
            De una idea a una página web profesional{' '}
            <span className="text-neon-blue">usando IA</span>
          </SectionTitle>
        </div>

        <div className="mx-auto mt-14 flex max-w-md flex-col items-center gap-0 sm:max-w-none sm:flex-row sm:justify-center sm:gap-0">
          {MASTERCLASS_PIPELINE.map((step, i) => (
            <div key={step.label} className="flex flex-col items-center sm:flex-row">
              <motion.div
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                className="relative flex flex-col items-center"
              >
                <div className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl border border-white/15 bg-gradient-to-br from-white/[0.08] to-white/[0.02] shadow-[0_8px_32px_rgba(0,212,255,0.12)] transition-transform hover:scale-105 sm:h-24 sm:w-24">
                  <span className="text-2xl" aria-hidden>
                    {step.icon}
                  </span>
                  <span className="mt-1 text-center text-xs font-semibold text-slate-200 sm:text-sm">
                    {step.label}
                  </span>
                </div>
              </motion.div>

              {i < MASTERCLASS_PIPELINE.length - 1 && (
                <>
                  <ArrowDown
                    className="my-2 h-6 w-6 text-neon-blue/60 sm:hidden"
                    aria-hidden
                  />
                  <div
                    className="mx-2 hidden h-px w-8 bg-gradient-to-r from-neon-blue/60 to-neon-purple/60 sm:block lg:w-12"
                    aria-hidden
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </MasterclassSection>
    </>
  )
}
