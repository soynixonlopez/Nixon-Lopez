'use client'

import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Check, User } from 'lucide-react'
import { ABOUT_CHECKLIST, ABOUT_STATS, HOME_IMAGES } from '@/lib/marketing'

export function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="about" ref={ref} className="relative isolate overflow-hidden bg-slate-50/50 py-16 sm:py-24">
      <div
        className="pointer-events-none absolute top-10 left-6 sm:left-10 h-24 w-24 opacity-30"
        aria-hidden
        style={{
          backgroundImage: 'radial-gradient(circle, #94a3b8 1.5px, transparent 1.5px)',
          backgroundSize: '12px 12px',
        }}
      />
      <div
        className="pointer-events-none absolute -top-12 right-[-8%] h-72 w-72 rounded-full bg-gradient-to-br from-blue-200/30 via-indigo-200/20 to-purple-200/15 blur-3xl"
        aria-hidden
      />

      <div className="container-padding relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-3.5 py-1.5 mb-5">
              <User className="h-4 w-4 text-brand" aria-hidden />
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                Sobre mí
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-[2.45rem] font-bold tracking-tight text-slate-900 leading-tight">
              Trabajo contigo directamente,{' '}
              <span className="gradient-text">no con una agencia donde nadie conoce tu proyecto</span>
            </h2>

            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed">
              Soy Nixon López, desarrollador web especializado en crear páginas y soluciones digitales para negocios
              que quieren mejorar su presencia online y conseguir más clientes.
            </p>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Mi enfoque no es solamente crear una web bonita, sino entender tu negocio y construir una solución que
              realmente ayude a crecer.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4 sm:gap-6 max-w-lg">
              {ABOUT_STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl sm:text-3xl font-bold text-brand tracking-tight">{stat.value}</p>
                  <p className="mt-1 text-[11px] sm:text-xs text-slate-600 leading-snug">{stat.label}</p>
                </div>
              ))}
            </div>

            <ul className="mt-8 grid sm:grid-cols-2 gap-3 max-w-lg">
              {ABOUT_CHECKLIST.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm sm:text-base text-slate-700">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                    <Check className="h-3 w-3 stroke-[3]" aria-hidden />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="relative mx-auto w-full max-w-[min(100%,380px)] lg:max-w-none"
          >
            <div
              className="pointer-events-none absolute -inset-3 rounded-3xl bg-gradient-to-br from-brand/15 via-blue-200/20 to-indigo-200/10 blur-2xl"
              aria-hidden
            />
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_24px_64px_rgba(15,23,42,0.10)]">
              <div className="relative aspect-[4/5] sm:aspect-[960/1200]">
                <Image
                  src={HOME_IMAGES.about}
                  alt="Nixon López en su espacio de trabajo — desarrollo web e IA"
                  fill
                  className="object-cover object-[center_20%]"
                  sizes="(max-width: 640px) 380px, (max-width: 1024px) 440px, 480px"
                  quality={80}
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/75 via-slate-900/25 to-transparent px-4 pb-4 pt-16">
                <p className="text-sm font-semibold text-white">Nixon López</p>
                <p className="text-xs text-slate-200/90">Desarrollo web · IA · Panamá</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
