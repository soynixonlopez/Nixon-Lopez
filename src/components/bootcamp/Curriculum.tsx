'use client'

import { BOOTCAMP_CURRICULUM, BOOTCAMP_PRICING } from '@/lib/bootcamp'
import {
  BootcampSection,
  GlowOrb,
  SectionCta,
  SectionLead,
  SectionTitle,
  GradientHighlight,
  fadeUp,
} from './shared'
import { motion } from 'framer-motion'

export default function Curriculum() {
  return (
    <BootcampSection id="programa" className="bg-[#050810]">
      <GlowOrb className="left-0 top-1/3 h-64 w-64 bg-neon-blue/10" />

      <div className="mx-auto max-w-2xl text-center">
        <SectionTitle>
          6 semanas. <GradientHighlight>1 proyecto cada semana.</GradientHighlight>
        </SectionTitle>
        <SectionLead className="mx-auto">En vivo + grabado. De cero a portafolio publicado.</SectionLead>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BOOTCAMP_CURRICULUM.map((week, i) => (
          <motion.article
            key={week.week}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-neon-blue/30 hover:bg-white/[0.05]"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 text-sm font-bold text-neon-blue ring-1 ring-neon-blue/30">
                S{week.week}
              </span>
              <h3 className="text-lg font-bold text-white">{week.title}</h3>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {week.tags.map((tag) => (
                <span key={tag} className="rounded-md border border-white/10 bg-black/20 px-2 py-1 text-xs text-slate-400">
                  {tag}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>

      <SectionCta label={BOOTCAMP_PRICING.ctaEnrollLabel} className="justify-center" />
    </BootcampSection>
  )
}
