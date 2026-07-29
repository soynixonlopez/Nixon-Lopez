import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, ArrowLeft, ArrowRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CtaButtons } from '@/components/marketing/CtaButtons'
import { MORE_PROJECTS, WHATSAPP_MESSAGES, quoteUrl } from '@/lib/marketing'
import { isLivePreviewImage } from '@/lib/case-studies'
import { SITE_URL } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Más proyectos realizados | Nixon Lopez Services',
  description:
    'Portafolio extendido de Nixon López: tiendas online, webs corporativas, marketing digital y más proyectos entregados en Panamá.',
  alternates: { canonical: `${SITE_URL}/proyectos` },
}

export default function ProyectosPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-24 sm:pt-28 pb-16">
        <div className="container-padding max-w-6xl mx-auto px-4 sm:px-6">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 min-h-[44px]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Volver a casos de éxito
          </Link>

          <header className="mt-4 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand mb-3">Portafolio extendido</p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
              Más proyectos realizados
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Proyectos adicionales que complementan nuestros casos de éxito principales. Cada uno refleja experiencia
              real con negocios en Panamá.
            </p>
          </header>

          <div className="mt-10 sm:mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {MORE_PROJECTS.map((project) => (
              <article
                key={project.slug}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-brand/20 transition"
              >
                <div className="relative aspect-[16/10] bg-slate-100">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={`Proyecto ${project.company}`}
                      fill
                      className="object-contain object-top bg-slate-50"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      unoptimized={isLivePreviewImage(project.image)}
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-brand/10 via-slate-50 to-brand/5 p-6 text-center">
                      <p className="text-xs font-semibold uppercase tracking-wider text-brand">Campaña digital</p>
                      <p className="mt-2 text-sm font-medium text-slate-700">{project.company}</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-1 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand">{project.category}</p>
                  <h2 className="mt-2 text-lg font-bold text-slate-900">{project.company}</h2>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed flex-1">{project.summary}</p>
                  {project.demoUrl ? (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 hover:border-slate-300 min-h-[48px] transition"
                    >
                      Ver proyecto
                      <ExternalLink className="h-4 w-4" aria-hidden />
                    </a>
                  ) : (
                    <p className="mt-5 text-xs text-slate-500 italic">Proyecto de marketing y campañas digitales</p>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-14 sm:mt-16 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-10 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">¿Quieres resultados como estos?</h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
              Cuéntame sobre tu negocio y te propongo la mejor solución — web, tienda online o sistema a medida.
            </p>
            <CtaButtons
              className="mt-6 justify-center"
              quoteHref={quoteUrl()}
              quoteLabel="Obtener cotización"
              whatsappMessage={WHATSAPP_MESSAGES.cases}
              whatsappLabel="Hablemos por WhatsApp"
            />
            <Link
              href="/"
              className="mt-4 inline-flex items-center justify-center gap-2 text-sm font-semibold text-brand hover:underline min-h-[44px]"
            >
              Volver al inicio
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
