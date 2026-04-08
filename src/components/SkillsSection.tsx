'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Layers } from 'lucide-react'
import TechLogo from './TechLogo'

/** Orden del carrusel: visibles en loop infinito (duplicado en DOM para la animación). */
const TECH_STACK = [
  { name: 'React' as const },
  { name: 'Next.js' as const },
  { name: 'TypeScript' as const },
  { name: 'Node.js' as const },
  { name: 'Python' as const },
  { name: 'OpenAI' as const },
  { name: 'PostgreSQL' as const },
  { name: 'MongoDB' as const },
  { name: 'Tailwind' as const },
  { name: 'Framer Motion' as const },
  { name: 'Docker' as const },
  { name: 'AWS' as const },
  { name: 'Git' as const },
  { name: 'Figma' as const },
  { name: 'Vercel' as const },
  { name: 'LangChain' as const },
  { name: 'Supabase' as const },
  { name: 'Prisma' as const },
  { name: 'GraphQL' as const },
  { name: 'Stripe' as const },
] as const

function TechCard({ name }: { name: string }) {
  return (
    <div className="flex-shrink-0 flex flex-col items-center p-5 sm:p-6 bg-white/90 dark:bg-slate-800/90 rounded-2xl shadow-md border border-slate-200/80 dark:border-slate-600/80 hover:shadow-lg hover:border-cyan-500/30 dark:hover:border-cyan-400/20 transition-all duration-300 min-w-[128px] sm:min-w-[140px] group hover:-translate-y-1">
      <div className="mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300 relative">
        <TechLogo name={name} size={48} />
      </div>
      <span className="text-xs sm:text-sm font-semibold text-center text-slate-800 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
        {name}
      </span>
    </div>
  )
}

const SkillsSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const items = [...TECH_STACK, ...TECH_STACK]

  return (
    <section
      id="tech-stack"
      ref={ref}
      aria-labelledby="tech-stack-heading"
      className="relative py-12 md:py-16 bg-gradient-to-b from-slate-100/90 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-y border-slate-200/60 dark:border-white/5"
    >
      <div className="container-padding">
        <motion.div
          className="text-center mb-10 md:mb-12 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/15 to-violet-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Layers size={16} className="shrink-0" aria-hidden />
            Stack profesional
          </div>
          <h2
            id="tech-stack-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4"
          >
            Tecnologías con las que{' '}
            <span className="gradient-text">trabajo</span>
          </h2>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Herramientas y frameworks que uso a diario para sitios web, automatizaciones e IA —
            mismo stack que verás en tus proyectos.
          </p>
        </motion.div>

        <motion.div
          className="relative max-w-[100vw] left-1/2 -translate-x-1/2 w-screen px-0"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          <div className="relative overflow-hidden py-2">
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 sm:w-20 md:w-28 bg-gradient-to-r from-slate-100 dark:from-slate-950 to-transparent"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 sm:w-20 md:w-28 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent"
              aria-hidden
            />
            <div className="flex w-max animate-scroll-infinite motion-reduce:animate-none gap-6 sm:gap-8 pl-6">
              {items.map((tech, index) => (
                <TechCard key={`${tech.name}-${index}`} name={tech.name} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default SkillsSection
