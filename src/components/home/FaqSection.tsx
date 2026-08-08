'use client'

import { AnimatePresence, motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { SectionLabel } from '@/components/marketing/SectionLabel'
import { SectionTitle } from '@/components/marketing/SectionTitle'
import { useMessages } from '@/i18n/LocaleProvider'

export function FaqSection() {
  const messages = useMessages()
  const f = messages.faq
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" ref={ref} className="relative isolate overflow-hidden bg-white py-16 sm:py-24">
      <div
        className="pointer-events-none absolute top-10 right-6 sm:right-10 h-24 w-24 opacity-25"
        aria-hidden
        style={{
          backgroundImage: 'radial-gradient(circle, #94a3b8 1.5px, transparent 1.5px)',
          backgroundSize: '12px 12px',
        }}
      />

      <div className="container-padding relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-14"
        >
          <SectionLabel>{f.sectionLabel}</SectionLabel>
          <SectionTitle>
            {f.titleBefore}
            <span className="brand-accent">{f.titleAccent}</span>
          </SectionTitle>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">{f.subtitle}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="space-y-3"
        >
          {f.items.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <article
                key={item.question}
                className={`rounded-2xl border bg-white overflow-hidden transition-shadow duration-300 ${
                  isOpen
                    ? 'border-brand/20 shadow-[0_8px_30px_rgba(15,23,42,0.06)]'
                    : 'border-slate-200/80 shadow-sm'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 text-left min-h-[56px] hover:bg-slate-50/80 transition"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-slate-900 text-sm sm:text-base leading-snug">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-brand transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-5 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                        {item.answer}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
