'use client'

import { BOOTCAMP_PROBLEM_CARDS } from '@/lib/bootcamp'
import {
  BootcampSection,
  GlowOrb,
  PremiumCard,
  SectionCta,
  SectionLead,
  SectionTitle,
  GradientHighlight,
} from './shared'

export default function Problem() {
  return (
    <BootcampSection id="problema" className="bg-[#050810]">
      <GlowOrb className="right-0 top-1/2 h-72 w-72 -translate-y-1/2 bg-neon-purple/10" />

      <div className="mx-auto max-w-2xl text-center">
        <SectionTitle>
          La IA cambió el juego. <GradientHighlight>¿Tienes el mapa?</GradientHighlight>
        </SectionTitle>
        <SectionLead className="mx-auto">Sin método = meses perdidos. Con método = proyectos en semanas.</SectionLead>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {BOOTCAMP_PROBLEM_CARDS.map((card, i) => (
          <PremiumCard key={card.title} delay={i} className="text-center">
            <span className="text-3xl" aria-hidden>{card.emoji}</span>
            <h3 className="mt-4 text-lg font-bold text-white">{card.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{card.line}</p>
          </PremiumCard>
        ))}
      </div>

      <SectionCta className="justify-center" />
    </BootcampSection>
  )
}
