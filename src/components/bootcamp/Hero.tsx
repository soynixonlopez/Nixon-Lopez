import Image from 'next/image'
import { Clock, Sparkles, Zap } from 'lucide-react'
import { MASTERCLASS_HERO_FLOATS } from '@/lib/case-studies'
import { BOOTCAMP_HERO, BOOTCAMP_HOTMART_URL } from '@/lib/bootcamp'
import { bootcampCtaOutline, bootcampCtaPrimary } from '@/lib/bootcamp-ui'

const HERO_WIDTH = 1086
const HERO_HEIGHT = 1448

const FLOAT_PROJECTS = [
  { image: MASTERCLASS_HERO_FLOATS[0], position: 'top-[36%] left-[4%] sm:left-[6%]', delay: 'mc-delay-1' },
  { image: MASTERCLASS_HERO_FLOATS[1], position: 'top-[42%] right-[4%] sm:right-[6%]', delay: 'mc-delay-2' },
  { image: MASTERCLASS_HERO_FLOATS[2], position: 'bottom-[6%] left-[2%] sm:left-[4%]', delay: 'mc-delay-3' },
  { image: MASTERCLASS_HERO_FLOATS[3], position: 'bottom-[20%] right-[2%] sm:right-[4%]', delay: 'mc-delay-4' },
] as const

const QUICK_WINS = [
  { icon: Sparkles, label: 'Sin código previo' },
  { icon: Zap, label: 'Publica en semanas' },
  { icon: Clock, label: '6 semanas en vivo' },
] as const

export default function Hero() {
  return (
    <section className="relative overflow-visible pb-0 pt-24 sm:pt-28 lg:pt-[7.5rem]">      <div aria-hidden className="pointer-events-none absolute left-1/4 top-0 h-96 w-96 rounded-full bg-neon-blue/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-neon-purple/15 blur-3xl" />
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
        <div className="grid items-end gap-6 lg:grid-cols-2 lg:gap-10 xl:gap-14">
          <div className="relative z-20 pb-8 sm:pb-10 lg:pb-12">
            <span className="mc-fade-up mb-5 inline-flex items-center rounded-full border border-neon-purple/40 bg-neon-purple/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-neon-purple">
              {BOOTCAMP_HERO.badge}
            </span>

            <h1 className="mc-fade-up mc-delay-1 text-balance text-3xl font-extrabold leading-[1.12] tracking-tight sm:text-4xl lg:text-5xl xl:text-[3.1rem]">
              {BOOTCAMP_HERO.title}{' '}
              <span className="bg-gradient-to-r from-neon-blue via-white to-neon-purple bg-clip-text text-transparent">
                {BOOTCAMP_HERO.titleAccent}
              </span>
            </h1>

            <p className="mc-fade-up mc-delay-2 mt-5 max-w-lg text-base leading-relaxed text-slate-300 sm:text-lg">
              {BOOTCAMP_HERO.subtitle}
            </p>

            <ul className="mc-fade-up mc-delay-3 mt-7 flex flex-wrap gap-2">
              {QUICK_WINS.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-slate-200 sm:text-sm"
                >
                  <Icon className="h-3.5 w-3.5 text-neon-blue" aria-hidden />
                  {label}
                </li>
              ))}
            </ul>

            <div className="mc-fade-up mc-delay-4 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={BOOTCAMP_HOTMART_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={bootcampCtaPrimary}
              >
                {BOOTCAMP_HERO.primaryCta}
              </a>
              <a href="#programa" className={bootcampCtaOutline}>
                {BOOTCAMP_HERO.secondaryCta}
              </a>
            </div>

            <p className="mc-fade-up mc-delay-5 mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-amber-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
              </span>
              {BOOTCAMP_HERO.urgency}
            </p>
            <p className="mc-fade-up mc-delay-6 mt-3 text-sm text-slate-400">
              ¿Sin tarjeta?{' '}
              <a href="#pagos" className="font-semibold text-neon-blue underline-offset-2 hover:underline">
                Paga con Yappy o transferencia
              </a>
            </p>
          </div>

          <div className="relative z-0 mc-fade-up mc-delay-2 flex w-full items-end justify-center lg:justify-end">
            <div className="relative w-full max-w-[400px] sm:max-w-[480px] md:max-w-[540px] lg:max-w-[600px] xl:max-w-[680px]">
              <div className="pointer-events-none absolute -inset-x-[6%] bottom-0 top-0 z-20 hidden sm:block [perspective:1200px]">
                {FLOAT_PROJECTS.map((item) => (
                  <div
                    key={item.image}
                    className={`mc-float-card ${item.delay} absolute w-[132px] sm:w-[164px] lg:w-[188px] xl:w-[204px] ${item.position} pointer-events-none [transform:rotateY(-9deg)_rotateZ(6deg)]`}
                    aria-hidden
                  >
                    <div className="relative overflow-hidden rounded-xl ring-1 ring-white/35 shadow-[0_20px_48px_rgba(0,0,0,0.55),0_0_28px_rgba(0,212,255,0.22)]">
                      <div className="relative aspect-[16/10]">
                        <Image src={item.image} alt="" fill className="object-cover object-top" sizes="260px" loading="lazy" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div
                aria-hidden
                className="pointer-events-none absolute bottom-[10%] left-1/2 h-[72%] w-[88%] -translate-x-1/2 rounded-full bg-gradient-to-t from-neon-blue/35 via-neon-purple/18 to-transparent blur-3xl"
              />

              <Image
                src="/images/nixon/masterclass_hero.webp"
                alt="Nixon López — instructor del Bootcamp"
                width={HERO_WIDTH}
                height={HERO_HEIGHT}
                className="relative z-10 block h-auto w-full object-contain object-bottom drop-shadow-[0_28px_56px_rgba(0,212,255,0.22)]"
                priority
                fetchPriority="high"
                quality={75}
                sizes="(max-width: 640px) 360px, (max-width: 1024px) 480px, 600px"
              />

              <div className="mt-4 grid grid-cols-4 gap-1.5 sm:hidden" aria-hidden>
                {FLOAT_PROJECTS.map((item) => (
                  <div
                    key={item.image}
                    className="relative overflow-hidden rounded-lg ring-1 ring-white/25 shadow-[0_8px_24px_rgba(0,212,255,0.18)]"
                  >
                    <div className="relative aspect-[16/10]">
                      <Image src={item.image} alt="" fill className="object-cover object-top" sizes="100px" loading="lazy" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
