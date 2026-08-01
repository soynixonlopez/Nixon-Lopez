'use client'

import { BOOTCAMP_TRUST_ITEMS } from '@/lib/bootcamp'
import { BootcampSection, fadeUp } from './shared'
import { motion } from 'framer-motion'

export default function TrustBar() {
  return (
    <BootcampSection id="confianza" className="!py-10 sm:!py-12 border-y border-white/5 bg-[#050810]">
      <motion.ul
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-10"
      >
        {BOOTCAMP_TRUST_ITEMS.map((label) => (
          <motion.li key={label} variants={fadeUp} className="flex items-center gap-2 text-sm font-semibold text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-neon-blue shadow-[0_0_8px_rgba(0,212,255,0.8)]" aria-hidden />
            {label}
          </motion.li>
        ))}
      </motion.ul>
    </BootcampSection>
  )
}
