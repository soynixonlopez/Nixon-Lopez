'use client'

import { BOOTCAMP_BONUSES } from '@/lib/bootcamp'
import {
  BootcampSection,
  SectionCta,
  SectionLead,
  SectionTitle,
  GradientHighlight,
  fadeUp,
} from './shared'
import { motion } from 'framer-motion'

export default function Bonuses() {
  return (
    <BootcampSection id="bonos">
      <div className="mx-auto max-w-2xl text-center">
        <SectionTitle>
          Bonos incluidos <GradientHighlight>sin costo extra</GradientHighlight>
        </SectionTitle>
        <SectionLead className="mx-auto">Todo lo que necesitas para arrancar rápido.</SectionLead>
      </div>

      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
        className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {BOOTCAMP_BONUSES.map((bonus, i) => (
          <motion.li
            key={bonus}
            custom={i}
            variants={fadeUp}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 text-center text-sm font-bold text-slate-200 transition hover:border-neon-blue/30"
          >
            {bonus}
          </motion.li>
        ))}
      </motion.ul>

      <SectionCta className="justify-center" />
    </BootcampSection>
  )
}
