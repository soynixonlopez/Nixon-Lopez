import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Globe,
  Play,
  Rocket,
  Shield,
  TrendingUp,
  Users,
  Repeat2,
} from 'lucide-react'
import TechLogo from '@/components/TechLogo'
import { MASTERCLASS_HERO_FLOATS } from '@/lib/case-studies'
import {
  HERO_TECH_STACK,
  HERO_TRUST_BADGES,
  HOME_IMAGES,
  quoteUrl,
} from '@/lib/marketing'

/** 4 mockups hero_image — pegados al retrato (misma lógica que /masterclass) */
const FLOAT_PROJECTS = [
  {
    image: MASTERCLASS_HERO_FLOATS[0],
    position: 'top-[34%] left-[4%] sm:left-[6%]',
    width: 'w-[120px] sm:w-[148px] lg:w-[172px] xl:w-[188px]',
    zIndex: 'z-[48]',
    transform: '[transform:rotateY(-10deg)_rotateZ(-6deg)]',
  },
  {
    image: MASTERCLASS_HERO_FLOATS[1],
    position: 'top-[40%] right-[4%] sm:right-[6%]',
    width: 'w-[120px] sm:w-[148px] lg:w-[172px] xl:w-[188px]',
    zIndex: 'z-[49]',
    transform: '[transform:rotateY(-8deg)_rotateZ(5deg)]',
  },
  {
    image: MASTERCLASS_HERO_FLOATS[2],
    position: 'bottom-[8%] left-[2%] sm:left-[4%]',
    width: 'w-[120px] sm:w-[148px] lg:w-[172px] xl:w-[188px]',
    zIndex: 'z-[50]',
    transform: '[transform:rotateY(-8deg)_rotateZ(-4deg)] origin-bottom-left',
  },
  {
    image: MASTERCLASS_HERO_FLOATS[3],
    position: 'bottom-[22%] right-[2%] sm:right-[4%]',
    width: 'w-[120px] sm:w-[148px] lg:w-[172px] xl:w-[188px]',
    zIndex: 'z-[52]',
    transform: '[transform:rotateY(-9deg)_rotateZ(7deg)]',
  },
] as const

const TRUST_ICON_BG: Record<(typeof HERO_TRUST_BADGES)[number]['color'], string> = {
  violet: 'bg-violet-100 text-violet-600',
  green: 'bg-emerald-100 text-emerald-600',
  blue: 'bg-blue-100 text-blue-600',
  purple: 'bg-purple-100 text-purple-600',
}

function TrustBadgeIcon({ icon }: { icon: (typeof HERO_TRUST_BADGES)[number]['icon'] }) {
  const className = 'h-5 w-5'
  switch (icon) {
    case 'whatsapp':
      return <TechLogo name="WhatsApp" size={20} />
    case 'shield':
      return <Shield className={className} aria-hidden />
    case 'globe':
      return <Globe className={className} aria-hidden />
    default:
      return <Users className={className} aria-hidden />
  }
}

function HeroFloatCard({ item }: { item: (typeof FLOAT_PROJECTS)[number] }) {
  return (
    <div
      className={`absolute pointer-events-none ${item.zIndex} ${item.width} ${item.position} ${item.transform}`}
      aria-hidden
    >
      <div
        className="absolute -inset-1.5 rounded-2xl bg-gradient-to-br from-brand/25 via-transparent to-indigo-300/25 blur-sm opacity-80"
        aria-hidden
      />
      <div className="relative overflow-hidden rounded-xl bg-white ring-1 ring-slate-200/80 shadow-[0_18px_44px_rgba(15,23,42,0.14)]">
        <div className="relative aspect-[16/10]">
          <Image
            src={item.image}
            alt=""
            fill
            className="object-cover object-top"
            sizes="188px"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  )
}

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[100dvh] flex-col overflow-x-clip pt-[calc(4.5rem+env(safe-area-inset-top,0px))] sm:pt-[calc(5rem+env(safe-area-inset-top,0px))] lg:pt-[calc(5.25rem+env(safe-area-inset-top,0px))] pb-0"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero_background.webp')" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-white/70 via-white/40 to-white/10"
        aria-hidden
      />

      <div className="container-padding relative z-10 mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col px-4 sm:px-6 pb-4 sm:pb-5 lg:pb-6">
        <div className="grid min-h-0 flex-1 gap-7 sm:gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:gap-8 xl:gap-10">
          <div className="flex w-full max-w-xl flex-col justify-center lg:max-w-none">
            <p className="mb-4 flex items-center gap-2.5 text-sm font-medium text-brand sm:mb-5">
              <span className="h-px w-5 shrink-0 bg-brand/50" aria-hidden />
              Desarrollo web para negocios
            </p>

            <h1 className="text-[1.65rem] font-bold leading-[1.12] tracking-tight text-slate-900 min-[380px]:text-[1.85rem] sm:text-4xl lg:text-[2.5rem] xl:text-[2.65rem]">
              Creo páginas web que convierten{' '}
              <span className="text-brand">visitantes en clientes.</span>
            </h1>

            <p className="mt-3 max-w-lg text-[0.9375rem] leading-relaxed text-slate-600 sm:mt-4 sm:text-base md:text-lg">
              Transformo tu presencia digital en{' '}
              <span className="font-semibold text-neon-purple">más oportunidades</span> de negocio con páginas
              rápidas, profesionales y listas para captar clientes por{' '}
              <span className="font-semibold text-emerald-600">WhatsApp</span>.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:mt-7 sm:flex-row">
              <Link
                href={quoteUrl()}
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3.5 text-[0.9375rem] font-semibold text-white shadow-md transition hover:bg-brand-light active:scale-[0.98] sm:min-h-[52px] sm:w-auto sm:px-6 sm:py-4 sm:text-base"
              >
                <Rocket className="h-5 w-5 shrink-0" aria-hidden />
                Quiero mi página web
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
              </Link>
              <Link
                href="#projects"
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border-2 border-brand/20 bg-white/90 px-5 py-3.5 text-[0.9375rem] font-semibold text-brand shadow-sm transition hover:border-brand/35 hover:bg-white active:scale-[0.98] sm:min-h-[52px] sm:w-auto sm:px-6 sm:py-4 sm:text-base"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/10">
                  <Play className="h-3.5 w-3.5 fill-brand text-brand ml-0.5" aria-hidden />
                </span>
                Ver proyectos reales
              </Link>
            </div>

            <div className="mt-6 rounded-2xl border border-white/80 bg-white/90 p-3.5 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:mt-8 sm:p-5">
              <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
                {HERO_TRUST_BADGES.map((badge) => (
                  <li key={badge.title} className="flex min-w-0 items-start gap-2 sm:gap-2.5">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-10 sm:w-10 ${TRUST_ICON_BG[badge.color]}`}
                    >
                      <TrustBadgeIcon icon={badge.icon} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold leading-tight text-slate-900 sm:text-sm">{badge.title}</p>
                      <p className="text-[10px] leading-snug text-slate-500 sm:text-[11px] md:text-xs">{badge.subtitle}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex min-h-0 w-full flex-1 flex-col justify-end lg:justify-end">
            <div className="relative mx-auto flex h-full min-h-0 w-full max-w-[300px] flex-col justify-end min-[380px]:max-w-[340px] sm:max-w-[400px] md:max-w-[460px] lg:mx-0 lg:ml-auto lg:max-w-[500px] xl:max-w-[580px] 2xl:max-w-[620px] leading-none">
              <div
                aria-hidden
                className="pointer-events-none absolute bottom-[10%] left-1/2 h-[72%] w-[88%] -translate-x-1/2 rounded-full bg-gradient-to-t from-blue-200/45 via-indigo-100/30 to-transparent blur-3xl"
              />

              <div className="pointer-events-none absolute -inset-x-[8%] inset-y-0 z-20 hidden sm:block [perspective:1200px]">
                {FLOAT_PROJECTS.map((item) => (
                  <HeroFloatCard key={item.image} item={item} />
                ))}
              </div>

              <div className="absolute top-[6%] left-0 z-40 hidden max-w-[170px] sm:block sm:max-w-[210px]">
                <div className="rounded-2xl border border-white/90 bg-white/95 backdrop-blur-sm px-3.5 py-3 shadow-lg">
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                      <TrendingUp className="h-5 w-5 text-emerald-600" aria-hidden />
                    </div>
                    <p className="text-[11px] sm:text-xs font-medium text-slate-700 leading-snug">
                      Webs que trabajan 24/7 para hacer crecer tu negocio
                    </p>
                  </div>
                </div>
              </div>

              <Image
                src={HOME_IMAGES.hero}
                alt="Nixon López — desarrollador web para negocios en Panamá"
                width={HOME_IMAGES.heroWidth}
                height={HOME_IMAGES.heroHeight}
                className="relative z-10 block h-auto w-full max-h-[min(40vh,340px)] object-contain object-bottom drop-shadow-[0_28px_56px_rgba(15,23,42,0.12)] min-[380px]:max-h-[min(44vh,380px)] sm:max-h-[min(48vh,440px)] md:max-h-[min(52vh,500px)] lg:max-h-full"
                priority
                fetchPriority="high"
                quality={75}
                sizes="(max-width: 380px) 300px, (max-width: 640px) 340px, (max-width: 1024px) 460px, 620px"
              />
            </div>

            <div className="mt-3 grid grid-cols-4 gap-1.5 sm:hidden" aria-hidden>
              {FLOAT_PROJECTS.map((item) => (
                <div
                  key={item.image}
                  className="relative overflow-hidden rounded-lg ring-1 ring-slate-200/80 shadow-sm"
                >
                  <div className="relative aspect-[16/10] bg-white">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      className="object-cover object-top"
                      sizes="80px"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-20 mt-5 min-h-[3.75rem] shrink-0 rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-4 shadow-sm backdrop-blur-sm sm:mt-4 sm:min-h-[4.25rem] sm:px-6 sm:py-5 lg:mt-auto">
          <div className="flex h-full flex-col items-start justify-center gap-3.5 sm:gap-4 lg:flex-row lg:items-center lg:gap-8">
            <p className="shrink-0 text-sm font-medium text-slate-600">
              Tecnologías modernas para resultados reales
            </p>
            <ul className="flex flex-wrap items-center gap-x-4 gap-y-2.5 sm:gap-x-5 sm:gap-y-3">
              {HERO_TECH_STACK.map((tech) => (
                <li key={tech} className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                  <TechLogo name={tech} size={24} />
                  <span className="hidden sm:inline">{tech}</span>
                </li>
              ))}
              <li className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-neon-purple/12 sm:h-7 sm:w-7">
                  <Repeat2 className="h-3.5 w-3.5 text-neon-purple sm:h-4 sm:w-4" aria-hidden />
                </span>
                <span className="hidden min-[420px]:inline">Automatizaciones</span>
                <span className="min-[420px]:hidden">Auto</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
