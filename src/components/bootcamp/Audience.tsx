'use client'

import { BOOTCAMP_AUDIENCE } from '@/lib/bootcamp'
import {
  BootcampSection,
  PremiumCard,
  SectionCta,
  SectionLead,
  SectionTitle,
  GradientHighlight,
} from './shared'

export default function Audience() {
  return (
    <BootcampSection id="para-quien">
      <div className="mx-auto max-w-2xl text-center">
        <SectionTitle>
          ¿Es para ti? <GradientHighlight>Sí, si quieres resultados.</GradientHighlight>
        </SectionTitle>
        <SectionLead className="mx-auto">6 perfiles. Un mismo objetivo: publicar y vender con IA.</SectionLead>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BOOTCAMP_AUDIENCE.map((item, i) => (
          <PremiumCard key={item.title} delay={i * 0.05} className="!p-5 text-center">
            <span className="text-3xl" aria-hidden>{item.emoji}</span>
            <h3 className="mt-3 text-lg font-bold text-white">{item.title}</h3>
            <p className="mt-1 text-sm text-slate-400">{item.hook}</p>
          </PremiumCard>
        ))}
      </div>

      <SectionCta className="justify-center" />
    </BootcampSection>
  )
}
