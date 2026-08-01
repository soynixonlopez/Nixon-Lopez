'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { BOOTCAMP_FAQ } from '@/lib/bootcamp'
import { BootcampSection, SectionCta, SectionLead, SectionTitle } from './shared'
import { AnimatePresence, motion } from 'framer-motion'

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <BootcampSection id="faq">
      <div className="mx-auto max-w-2xl text-center">
        <SectionTitle>FAQ</SectionTitle>
        <SectionLead className="mx-auto">Respuestas rápidas. Sin rodeos.</SectionLead>
      </div>

      <div className="mx-auto mt-10 max-w-2xl divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.02]">
        {BOOTCAMP_FAQ.map((item, i) => {
          const isOpen = open === i
          return (
            <div key={item.q}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/[0.03]"
                aria-expanded={isOpen}
              >
                <span className="font-semibold text-white">{item.q}</span>
                <ChevronDown className={`h-5 w-5 shrink-0 text-slate-500 transition ${isOpen ? 'rotate-180' : ''}`} aria-hidden />
              </button>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden px-5 pb-4 text-sm text-slate-400"
                  >
                    {item.a}
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      <SectionCta className="justify-center" />
    </BootcampSection>
  )
}
