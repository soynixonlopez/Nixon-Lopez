import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Globe,
  Play,
  Rocket,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react'
import TechLogo from '@/components/TechLogo'
import {
  HERO_TECH_STACK,
  HERO_TRUST_BADGES,
  PROJECT_HERO_PREVIEWS,
  quoteUrl,
} from '@/lib/marketing'
import nixonProfileWebp from '../../../public/images/nixonprofile.webp'

type FloatItem = {
  slug: keyof typeof PROJECT_HERO_PREVIEWS
  position: string
  width: string
  shadow: string
  zIndex: string
}

/** Pila diagonal: atrás arriba-derecha → abajo al frente → centro encima de todo */
const FLOAT_PROJECTS: FloatItem[] = [
  {
    slug: 'aserta',
    position: 'top-[2%] right-[-2%] sm:right-0 lg:right-1 [transform:rotateY(-10deg)_rotateZ(4deg)] origin-top-right',
    width: 'w-[108px] sm:w-[138px] lg:w-[154px]',
    shadow: 'shadow-[0_18px_44px_rgba(15,23,42,0.10)]',
    zIndex: 'z-10',
  },
  {
    slug: 'nutrielys',
    position: 'bottom-[26%] right-[-4%] sm:right-[-2%] lg:right-0 [transform:rotateY(-8deg)_rotateZ(2deg)] origin-bottom-right',
    width: 'w-[132px] sm:w-[172px] lg:w-[192px]',
    shadow: 'shadow-[0_22px_56px_rgba(15,23,42,0.13)]',
    zIndex: 'z-[25]',
  },
  {
    slug: 'aquarumbos',
    position: 'top-[28%] left-[6%] sm:left-[4%] lg:left-[2%] [transform:rotateY(-6deg)_rotateZ(-3deg)] origin-center',
    width: 'w-[136px] sm:w-[176px] lg:w-[196px]',
    shadow: 'shadow-[0_28px_72px_rgba(15,23,42,0.16)]',
    zIndex: 'z-[35]',
  },
]

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

function HeroProjectMockup({ item, priority = false }: { item: FloatItem; priority?: boolean }) {
  return (
    <div className={`absolute pointer-events-none ${item.zIndex} ${item.width} ${item.position}`} aria-hidden>
      <div
        className={`rounded-2xl border border-white/95 bg-white p-1.5 ring-1 ring-slate-200/60 ${item.shadow}`}
      >
        <div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-slate-100 bg-slate-50/90 rounded-t-xl">
          <span className="h-2 w-2 rounded-full bg-red-400" aria-hidden />
          <span className="h-2 w-2 rounded-full bg-amber-400" aria-hidden />
          <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
        </div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-b-xl bg-white">
          <Image
            src={PROJECT_HERO_PREVIEWS[item.slug]}
            alt=""
            fill
            className="object-cover object-top"
            sizes="196px"
            priority={priority}
          />
        </div>
      </div>
    </div>
  )
}

export function HeroSection() {
  return (
    <section id="hero" className="relative isolate overflow-hidden pt-24 sm:pt-28 pb-6 sm:pb-8">
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero_background.png')" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-white/70 via-white/40 to-white/10"
        aria-hidden
      />

      <div className="container-padding relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-8 xl:gap-12 items-center">
          <div className="max-w-xl lg:max-w-none">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 mb-5 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-brand shrink-0" aria-hidden />
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                Desarrollo web para negocios
              </span>
            </div>

            <h1 className="text-[1.85rem] sm:text-4xl lg:text-[2.65rem] font-bold tracking-tight text-slate-900 leading-[1.1]">
              Creo páginas web que convierten{' '}
              <span className="gradient-text">visitantes en clientes.</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-lg">
              Transformo tu presencia digital en{' '}
              <span className="font-semibold text-neon-purple">más oportunidades</span> de negocio con páginas
              rápidas, profesionales y listas para captar clientes por{' '}
              <span className="font-semibold text-emerald-600">WhatsApp</span>.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link
                href={quoteUrl()}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-4 min-h-[52px] text-base font-semibold text-white shadow-md transition hover:bg-brand-light active:scale-[0.98] w-full sm:w-auto"
              >
                <Rocket className="h-5 w-5 shrink-0" aria-hidden />
                Quiero mi página web
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
              </Link>
              <Link
                href="#projects"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-brand/20 bg-white/90 px-6 py-4 min-h-[52px] text-base font-semibold text-brand shadow-sm transition hover:border-brand/35 hover:bg-white active:scale-[0.98] w-full sm:w-auto"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/10">
                  <Play className="h-3.5 w-3.5 fill-brand text-brand ml-0.5" aria-hidden />
                </span>
                Ver proyectos reales
              </Link>
            </div>

            <div className="mt-8 rounded-2xl border border-white/80 bg-white/90 backdrop-blur-sm shadow-[0_8px_32px_rgba(15,23,42,0.08)] p-4 sm:p-5">
              <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {HERO_TRUST_BADGES.map((badge) => (
                  <li key={badge.title} className="flex items-start gap-2.5 min-w-0">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${TRUST_ICON_BG[badge.color]}`}
                    >
                      <TrustBadgeIcon icon={badge.icon} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 leading-tight">{badge.title}</p>
                      <p className="text-[11px] sm:text-xs text-slate-500 leading-snug">{badge.subtitle}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[min(100%,380px)] sm:max-w-[480px] lg:max-w-none lg:mx-0">
            <div className="relative min-h-[380px] sm:min-h-[460px] lg:min-h-[500px] xl:min-h-[540px]">
              <div
                className="absolute bottom-[6%] left-[42%] sm:left-[44%] w-[55%] sm:w-[52%] h-[70%] rounded-full bg-gradient-to-br from-blue-200/45 via-indigo-200/30 to-purple-200/20 blur-3xl -z-10"
                aria-hidden
              />

              <div className="hidden sm:block absolute inset-0 pointer-events-none [perspective:1200px]">
                <HeroProjectMockup item={FLOAT_PROJECTS[0]} />
              </div>

              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[380px] xl:max-w-[420px]">
                <picture className="block w-full leading-none">
                  <source srcSet="/images/nixonprofile.avif" type="image/avif" />
                  <Image
                    src={nixonProfileWebp}
                    alt="Nixon López — desarrollador web para negocios en Panamá"
                    width={nixonProfileWebp.width}
                    height={nixonProfileWebp.height}
                    className="w-full h-auto object-contain object-bottom align-bottom drop-shadow-[0_20px_40px_rgba(15,23,42,0.12)]"
                    priority
                    placeholder="blur"
                    fetchPriority="high"
                    sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 420px"
                  />
                </picture>
              </div>

              <div className="hidden sm:block absolute inset-0 pointer-events-none [perspective:1200px]">
                <HeroProjectMockup item={FLOAT_PROJECTS[1]} priority />
                <HeroProjectMockup item={FLOAT_PROJECTS[2]} priority />
              </div>

              <div className="absolute top-[20%] left-0 sm:left-1 lg:left-3 z-40 max-w-[190px] sm:max-w-[210px]">
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
            </div>

            <div className="sm:hidden grid grid-cols-3 gap-2 mt-2 pb-1" aria-hidden>
              {FLOAT_PROJECTS.map((item) => (
                <div
                  key={item.slug}
                  className="rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm overflow-hidden"
                >
                  <div className="relative aspect-[16/10] bg-white">
                    <Image
                      src={PROJECT_HERO_PREVIEWS[item.slug]}
                      alt=""
                      fill
                      className="object-cover object-top"
                      sizes="100px"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 rounded-2xl border border-slate-200/70 bg-white/75 backdrop-blur-sm px-4 py-4 sm:px-6 sm:py-5 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
            <p className="text-sm font-medium text-slate-600 shrink-0">
              Tecnologías modernas para resultados reales
            </p>
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-3">
              {HERO_TECH_STACK.map((tech) => (
                <li key={tech} className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                  <TechLogo name={tech} size={22} />
                  {tech}
                </li>
              ))}
              <li className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                <span className="flex h-[22px] w-[22px] items-center justify-center rounded-md bg-purple-100">
                  <Sparkles className="h-3.5 w-3.5 text-purple-600" aria-hidden />
                </span>
                IA y Automatizaciones
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
