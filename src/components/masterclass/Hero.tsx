'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calendar, Clock, Monitor, Sparkles, Ticket } from 'lucide-react'
import { PROJECT_HERO_PREVIEWS } from '@/lib/case-studies'
import { MASTERCLASS_EVENT } from '@/lib/masterclass'
import nixonProfileWebp from '../../../public/images/nixonprofile.webp'
import { fadeUp, GlowOrb, MasterclassCta } from './shared'

const EVENT_DETAILS = [
  { icon: Calendar, label: MASTERCLASS_EVENT.dateLabel },
  { icon: Clock, label: MASTERCLASS_EVENT.timeLabel },
  { icon: Monitor, label: MASTERCLASS_EVENT.modality },
  { icon: Ticket, label: MASTERCLASS_EVENT.cost },
] as const

type FloatProject = {
  slug: keyof typeof PROJECT_HERO_PREVIEWS
  position: string
  width: string
  zIndex: string
  transform: string
  floatDelay: number
  floatY: number
}

/** Tres pantallas alrededor del perfil — distribución original, rostro libre arriba */
const FLOAT_PROJECTS: FloatProject[] = [
  {
    slug: 'aserta',
    position: 'top-[40%] left-[0%]',
    width: 'w-[140px] sm:w-[172px] lg:w-[196px]',
    zIndex: 'z-[48]',
    transform: '[transform:rotateY(-8deg)_rotateZ(-5deg)] origin-center',
    floatDelay: 0.15,
    floatY: 5,
  },
  {
    slug: 'aquarumbos',
    position: 'top-[46%] right-[0%] sm:right-[2%]',
    width: 'w-[140px] sm:w-[172px] lg:w-[196px]',
    zIndex: 'z-[50]',
    transform: '[transform:rotateY(-7deg)_rotateZ(6deg)] origin-center',
    floatDelay: 0.35,
    floatY: -5,
  },
  {
    slug: 'nutrielys',
    position: 'bottom-[0%] right-[0%] sm:right-[1%]',
    width: 'w-[140px] sm:w-[172px] lg:w-[196px]',
    zIndex: 'z-[55]',
    transform: '[transform:rotateY(-10deg)_rotateZ(3deg)] origin-bottom-right',
    floatDelay: 0.55,
    floatY: 6,
  },
]

function HeroProjectScreen({
  item,
  priority = false,
}: {
  item: FloatProject
  priority?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.45 + item.floatDelay, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute pointer-events-none ${item.zIndex} ${item.width} ${item.position} ${item.transform}`}
      aria-hidden
    >
      <motion.div
        animate={{ y: [0, item.floatY, 0] }}
        transition={{
          duration: 4.5 + item.floatDelay,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: item.floatDelay,
        }}
      >
        <div className="overflow-hidden rounded-2xl border border-white/25 bg-[#0d1117]/95 p-1.5 shadow-[0_24px_60px_rgba(0,212,255,0.28)] ring-1 ring-neon-blue/25 backdrop-blur-sm">
          <div className="flex items-center gap-1.5 rounded-t-xl border-b border-white/10 bg-[#161b22] px-2 py-1.5">
            <span className="h-2 w-2 rounded-full bg-red-400/90" />
            <span className="h-2 w-2 rounded-full bg-amber-400/90" />
            <span className="h-2 w-2 rounded-full bg-emerald-400/90" />
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-b-xl bg-slate-900">
            <Image
              src={PROJECT_HERO_PREVIEWS[item.slug]}
              alt=""
              fill
              className="object-cover object-top"
              sizes="224px"
              priority={priority}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: 0.2 }}
      className="relative mr-auto ml-0 w-full max-w-[min(100%,520px)] -translate-y-8 sm:max-w-[560px] sm:-translate-y-12 lg:max-w-[600px] lg:-translate-y-16"
    >
      <div className="relative min-h-[440px] sm:min-h-[520px] lg:min-h-[580px] xl:min-h-[620px]">
        {/* Glow detrás del perfil */}
        <div
          aria-hidden
          className="absolute bottom-0 left-[20%] h-[82%] w-[85%] -translate-x-1/2 rounded-full bg-gradient-to-t from-neon-blue/35 via-neon-purple/18 to-transparent blur-3xl"
        />

        {/* Capa 1 — perfil ligeramente a la izquierda del centro */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-0 left-[20%] z-10 w-[112%] max-w-[340px] -translate-x-1/2 sm:max-w-[420px] lg:max-w-[480px] xl:max-w-[540px]"
        >
          <picture className="block w-full leading-none">
            <source srcSet="/images/nixonprofile.avif" type="image/avif" />
            <Image
              src={nixonProfileWebp}
              alt="Nixon López — instructor de la masterclass"
              width={nixonProfileWebp.width}
              height={nixonProfileWebp.height}
              className="h-auto w-full object-contain object-bottom drop-shadow-[0_28px_56px_rgba(0,212,255,0.25)]"
              priority
              placeholder="blur"
              fetchPriority="high"
              sizes="(max-width: 640px) 340px, (max-width: 1024px) 420px, 540px"
            />
          </picture>
        </motion.div>

        {/* Capa 2 — pantallas por encima del perfil */}
        <div className="absolute inset-0 z-30 hidden sm:block [perspective:1200px]">
          {FLOAT_PROJECTS.map((item) => (
            <HeroProjectScreen key={item.slug} item={item} priority />
          ))}
        </div>
      </div>

      {/* Móvil — mini pantallas */}
      <div className="mt-4 grid grid-cols-3 gap-2 sm:hidden" aria-hidden>
        {FLOAT_PROJECTS.map((item, i) => (
          <motion.div
            key={item.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.08 }}
            className="overflow-hidden rounded-xl border border-white/15 bg-[#0d1117] p-0.5 shadow-[0_8px_24px_rgba(0,212,255,0.15)]"
          >
            <div className="flex gap-1 border-b border-white/10 bg-[#161b22] px-1.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400/80" />
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400/80" />
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
            </div>
            <div className="relative aspect-[16/10]">
              <Image
                src={PROJECT_HERO_PREVIEWS[item.slug]}
                alt=""
                fill
                className="object-cover object-top"
                sizes="100px"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default function Hero() {
  return (
    <section className="relative overflow-visible pb-12 pt-28 sm:pb-16 sm:pt-32 lg:pb-20 lg:pt-36">
      <GlowOrb className="left-1/4 top-0 h-96 w-96 bg-neon-blue/20" />
      <GlowOrb className="bottom-0 right-0 h-80 w-80 bg-neon-purple/15" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="container relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="pb-4 sm:pb-8 lg:pb-12">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-neon-purple/40 bg-neon-purple/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-neon-purple"
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Masterclass gratuita en vivo
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-balance text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl xl:text-[3.25rem]"
            >
              Aprende a crear páginas web profesionales con{' '}
              <span className="bg-gradient-to-r from-neon-blue via-white to-neon-purple bg-clip-text text-transparent">
                Inteligencia Artificial
              </span>{' '}
              🚀
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg"
            >
              Descubre cómo crear sitios web modernos utilizando IA, incluso si estás empezando desde cero.
            </motion.p>

            <motion.ul
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.3 } } }}
              className="mt-8 grid gap-3 sm:grid-cols-2"
            >
              {EVENT_DETAILS.map(({ icon: Icon, label }) => (
                <motion.li
                  key={label}
                  variants={fadeUp}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-200"
                >
                  <Icon className="h-4 w-4 shrink-0 text-neon-blue" aria-hidden />
                  {label}
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <MasterclassCta href="#registro">Quiero reservar mi cupo gratis</MasterclassCta>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-4 flex items-center gap-2 text-sm font-medium text-amber-400/90"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
              </span>
              {MASTERCLASS_EVENT.urgency}
            </motion.p>
          </div>

          <div className="flex w-full justify-start">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  )
}
