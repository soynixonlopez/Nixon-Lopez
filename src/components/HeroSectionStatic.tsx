import Image from 'next/image'
import Link from 'next/link'
import TechLogo from './TechLogo'
import nixonProfileWebp from '../../public/images/nixonprofile.webp'

const WHATSAPP_HREF =
  'https://wa.me/50768252312?text=' +
  encodeURIComponent('Hola, estoy interesado en solicitar una cotización')

const HERO_IMG_SIZES = '(max-width: 768px) 92vw, 50vw'

export default function HeroSectionStatic() {
  return (
    <section
      id="hero"
      className="relative w-full max-w-full min-w-0 min-h-screen h-auto md:h-screen flex items-center justify-center overflow-x-hidden overflow-y-visible md:overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8 md:py-0 pb-0"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <div className="relative z-10 container-padding h-full pt-[calc(3.5rem+env(safe-area-inset-top,0px))] sm:pt-[calc(4rem+env(safe-area-inset-top,0px))] md:pt-20 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center md:items-stretch h-full w-full min-w-0">
          <div className="min-w-0 text-center md:text-left flex flex-col justify-center h-full max-md:motion-safe:animate-soft-rise">
            <div className="mb-6">
              <span className="text-blue-400 font-mono text-2xl tracking-wider">
                ¿Tu Negocio Necesita Más Clientes?
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="gradient-text">Hola, Soy Nixon</span>
            </h1>

            <div className="mb-4 sm:mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-2">
                Especialista en{' '}
                <span className="text-blue-400 font-semibold">
                  desarrollo web, IA y automatizaciones
                </span>
              </h2>
              <p className="pt-3 sm:pt-4 md:pt-5 text-gray-400 max-w-2xl mx-auto lg:mx-0 text-lg">
                Creamos páginas web profesionales para negocios de servicios. Conecta con más clientes,
                integra WhatsApp y convierte visitantes en ventas.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-4 sm:mt-6 md:mt-8">
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold transition-all duration-300 inline-flex items-center justify-center gap-2 sm:gap-3 shadow-lg hover:shadow-green-500/50 whitespace-nowrap text-xs min-[400px]:text-sm sm:text-base md:text-lg px-3 min-[400px]:px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 w-full sm:w-auto min-h-[48px] max-sm:leading-none"
              >
                <TechLogo name="WhatsApp" size={22} className="shrink-0" light />
                Contactar por WhatsApp
              </a>

              <Link
                href="#projects"
                className="bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold hover:bg-white/20 transition-all duration-300 inline-flex items-center justify-center gap-2 border border-white/20 whitespace-nowrap text-xs min-[400px]:text-sm sm:text-base md:text-lg px-3 min-[400px]:px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 w-full sm:w-auto min-h-[48px] max-sm:leading-none"
              >
                Ver Proyectos
              </Link>
            </div>
          </div>

          <div className="flex min-w-0 justify-center md:justify-end h-full relative overflow-hidden max-md:motion-safe:animate-soft-rise max-md:motion-safe:[animation-delay:120ms]">
            <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl h-[500px] sm:h-[600px] md:h-full overflow-hidden">
              <picture className="block h-full w-full">
                <source srcSet="/images/nixonprofile.avif" type="image/avif" sizes={HERO_IMG_SIZES} />
                <Image
                  src={nixonProfileWebp}
                  alt="Páginas Web Profesionales para Negocios de Servicios"
                  width={nixonProfileWebp.width}
                  height={nixonProfileWebp.height}
                  className="h-full w-full object-contain object-bottom"
                  priority
                  quality={75}
                  sizes={HERO_IMG_SIZES}
                  placeholder="blur"
                  fetchPriority="high"
                />
              </picture>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

