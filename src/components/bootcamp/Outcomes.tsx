'use client'

import { Check } from 'lucide-react'
import { BOOTCAMP_OUTCOMES } from '@/lib/bootcamp'
import {
  BootcampSection,
  SectionCta,
  SectionLead,
  SectionTitle,
  GradientHighlight,
  fadeUp,
} from './shared'
import { motion } from 'framer-motion'

export default function Outcomes() {
  return (
    <BootcampSection id="resultados" className="border-y border-white/5 bg-[#070d18]">
      <div className="mx-auto max-w-2xl text-center">
        <SectionTitle>
          Al terminar <GradientHighlight>podrás</GradientHighlight>
        </SectionTitle>
        <SectionLead className="mx-auto">Habilidades concretas. No promesas vacías.</SectionLead>
      </div>

      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
        className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {BOOTCAMP_OUTCOMES.map((outcome, i) => (
          <motion.li
            key={outcome}
            custom={i}
            variants={fadeUp}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-neon-blue to-neon-purple">
              <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} aria-hidden />
            </span>
            <span className="text-sm font-semibold text-slate-200 sm:text-base">{outcome}</span>
          </motion.li>
        ))}
      </motion.ul>

      <SectionCta className="justify-center" />
    </BootcampSection>
  )
}
