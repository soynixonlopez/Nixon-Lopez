'use client'

import { GlowOrb, MasterclassCta, MasterclassSection, SectionLead, SectionTitle } from './shared'

export default function CTA() {
  return (
    <MasterclassSection className="relative overflow-hidden pb-24">
      <GlowOrb className="left-1/2 top-0 h-80 w-[600px] -translate-x-1/2 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20" />

      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] px-6 py-12 text-center shadow-[0_24px_80px_rgba(0,212,255,0.12)] sm:px-12 sm:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 0%, rgba(0,212,255,0.15), transparent 50%)',
          }}
        />

        <SectionTitle>Tu primera página web profesional puede comenzar aquí</SectionTitle>

        <SectionLead className="mx-auto">
          No necesitas experiencia previa. Solo aprender el proceso correcto y utilizar las herramientas
          adecuadas.
        </SectionLead>

        <div className="relative mt-8">
          <MasterclassCta href="#registro">Reservar mi cupo gratis</MasterclassCta>
        </div>
      </div>
    </MasterclassSection>
  )
}
