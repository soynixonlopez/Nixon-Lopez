'use client'

import Image from 'next/image'
import { Quote, Star } from 'lucide-react'
import { BOOTCAMP_TESTIMONIALS } from '@/lib/bootcamp'
import {
  BootcampSection,
  PremiumCard,
  SectionLead,
  SectionTitle,
  InlineCta,
} from './shared'

export default function Testimonials() {
  return (
    <BootcampSection id="testimonios" className="border-y border-white/5 bg-[#070d18]">
      <div className="mx-auto max-w-2xl text-center">
        <SectionTitle>Clientes que confían en mi trabajo</SectionTitle>
        <SectionLead className="mx-auto">
          Proyectos reales para empresas y organizaciones en Panamá.
        </SectionLead>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {BOOTCAMP_TESTIMONIALS.map((t, i) => (
          <PremiumCard key={t.name} delay={i * 0.06} className="flex flex-col">
            <div className="mb-4 overflow-hidden rounded-xl border border-white/10 bg-[#080c14]">
              <Image
                src={t.image}
                alt={`Proyecto web — ${t.company}`}
                width={t.imageWidth}
                height={t.imageHeight}
                className="h-auto w-full"
                sizes="(max-width: 768px) 100vw, 320px"
              />
            </div>
            <div className="mb-3 flex gap-0.5" aria-hidden>
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <Quote className="mb-2 h-6 w-6 text-neon-blue/30" aria-hidden />
            <p className="flex-1 text-sm leading-relaxed text-slate-300">&ldquo;{t.quote}&rdquo;</p>
            <footer className="mt-4 border-t border-white/10 pt-3">
              <p className="font-bold text-white">{t.name}</p>
              <p className="text-xs leading-snug text-slate-500">{t.company}</p>
            </footer>
          </PremiumCard>
        ))}
      </div>

      <div className="text-center">
        <InlineCta />
      </div>
    </BootcampSection>
  )
}
