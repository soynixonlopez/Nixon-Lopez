import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SITE_URL } from '@/lib/site-config'
import Link from 'next/link'
import {
  Cookie,
  Shield,
  BarChart3,
  Settings2,
  ExternalLink,
  Mail,
  Table2,
  Info,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description:
    'Política de Cookies de NL Services (Nixon López). Información sobre cookies, tecnologías similares, finalidad, terceros y cómo gestionarlas.',
  alternates: { canonical: `${SITE_URL}/politica-de-cookies` },
  robots: { index: true, follow: true },
}

const LAST_UPDATED = '23 de abril de 2026'
const CONTACT_EMAIL = 'info@nixonlopez.com'

export default function PoliticaDeCookiesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-950 pt-24 sm:pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center" />
        </div>
        <div className="container-padding">
          <div className="relative z-10 max-w-5xl">
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/15 to-purple-600/15 border border-white/10 text-slate-200 px-4 py-2 rounded-full text-sm">
                <Cookie className="w-4 h-4 text-orange-400" />
                Transparencia sobre cookies
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mt-4">
                Política de Cookies
              </h1>
              <p className="text-slate-400 text-sm mt-2">
                Última actualización: {LAST_UPDATED}
              </p>
              <p className="text-slate-300/90 text-base leading-relaxed mt-5 max-w-3xl">
                Usamos cookies y tecnologías similares para que el sitio funcione, reforzar seguridad y medir resultados.
                Aquí verás qué tipos usamos, qué terceros participan y cómo puedes gestionarlas.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <p className="text-sm font-semibold text-white">Necesarias</p>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Funcionamiento básico, seguridad y prevención de abuso.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  <p className="text-sm font-semibold text-white">Medición</p>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Entender qué funciona para mejorar rendimiento y contenido.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <ExternalLink className="w-4 h-4 text-emerald-400" />
                  <p className="text-sm font-semibold text-white">Terceros</p>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Integraciones como Meta Pixel pueden establecer sus propias cookies.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 sm:p-6 mb-12">
              <p className="text-sm text-slate-200 font-semibold mb-3">Atajos</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { href: '#que-son', label: 'Qué son' },
                  { href: '#para-que', label: 'Para qué' },
                  { href: '#tabla', label: 'Resumen' },
                  { href: '#terceros', label: 'Terceros' },
                  { href: '#gestionar', label: 'Gestionar' },
                  { href: '#contacto', label: 'Contacto' },
                ].map((a) => (
                  <a
                    key={a.href}
                    href={a.href}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 hover:text-white hover:border-white/20 transition-colors text-sm"
                  >
                    {a.label}
                  </a>
                ))}
              </div>
              <div className="mt-4 text-sm text-slate-300">
                ¿Buscas privacidad completa?{' '}
                <Link className="underline hover:text-white" href="/politica-de-privacidad">
                  Ver Política de Privacidad
                </Link>
                .
              </div>
            </div>

            <div className="space-y-10 text-slate-200/90">
              <section id="que-son" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Cookie className="w-5 h-5 text-orange-400" />
                  ¿Qué son las cookies?
                </h2>
                <p className="text-sm leading-relaxed">
                  Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web.
                  También existen tecnologías similares (píxeles, etiquetas, almacenamiento local) con finalidades parecidas.
                </p>
              </section>

              <section id="para-que" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-400" />
                  ¿Para qué las usamos?
                </h2>
                <ul className="list-disc pl-6 text-sm space-y-2 text-slate-300">
                  <li><strong>Funcionamiento y seguridad</strong>: permitir que el sitio funcione correctamente y prevenir abuso.</li>
                  <li><strong>Medición</strong>: entender el uso del sitio para mejorar contenido y rendimiento.</li>
                  <li><strong>Publicidad/atribución</strong>: medir resultados de campañas (por ejemplo, Meta Pixel).</li>
                </ul>
              </section>

              <section id="tabla" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Table2 className="w-5 h-5 text-purple-400" />
                  Resumen (orientativo)
                </h2>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-[520px] w-full text-sm">
                      <thead className="bg-white/[0.04]">
                        <tr>
                          <th className="text-left px-4 py-3 font-semibold text-white">Tipo</th>
                          <th className="text-left px-4 py-3 font-semibold text-white">Finalidad</th>
                          <th className="text-left px-4 py-3 font-semibold text-white">Ejemplos</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        <tr>
                          <td className="px-4 py-3 text-slate-200">Necesarias</td>
                          <td className="px-4 py-3 text-slate-300">Seguridad, sesión, prevención de abuso</td>
                          <td className="px-4 py-3 text-slate-300">Cookies técnicas del sitio</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-slate-200">Medición</td>
                          <td className="px-4 py-3 text-slate-300">Analizar uso para mejorar</td>
                          <td className="px-4 py-3 text-slate-300">Eventos de navegación</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-slate-200">Publicidad/atribución</td>
                          <td className="px-4 py-3 text-slate-300">Medir campañas y conversiones</td>
                          <td className="px-4 py-3 text-slate-300">
                            Meta Pixel (p. ej. <code className="text-slate-100">_fbp</code>)
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  Este cuadro es informativo y puede variar según configuración, navegador y cambios de terceros.
                </p>
              </section>

              <section id="terceros" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-semibold text-white">Cookies de terceros (Meta / Facebook Pixel)</h2>
                <p className="text-sm leading-relaxed">
                  Este sitio integra <strong>Meta (Facebook) Pixel</strong> para medir eventos como visitas de página. Meta puede
                  usar cookies o identificadores (por ejemplo, cookies como <code className="text-slate-100">_fbp</code> y otras)
                  para fines de medición y publicidad, conforme a sus políticas.
                </p>
                <p className="text-sm leading-relaxed">
                  Puedes obtener más información directamente en la documentación/políticas de Meta. Ten en cuenta que las cookies
                  de terceros se gestionan por dichos terceros.
                </p>
              </section>

              <section id="gestionar" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-emerald-400" />
                  ¿Cómo puedes gestionar las cookies?
                </h2>
                <p className="text-sm leading-relaxed">
                  Puedes configurar tu navegador para bloquear o eliminar cookies. Los pasos dependen del navegador. Ten en cuenta
                  que, si bloqueas ciertas cookies, algunas partes del sitio podrían no funcionar como se espera.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-white">5. Actualizaciones</h2>
                <p className="text-sm leading-relaxed">
                  Podemos actualizar esta política por cambios operativos, legales o técnicos. Publicaremos la versión vigente en
                  esta página.
                </p>
              </section>

              <section id="contacto" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-amber-400" />
                  Contacto
                </h2>
                <p className="text-sm leading-relaxed">
                  Si tienes dudas sobre el uso de cookies, contáctanos en{' '}
                  <a className="underline hover:text-white" href={`mailto:${CONTACT_EMAIL}`}>
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>
                <p className="text-sm leading-relaxed">
                  Sitio web: <a className="underline hover:text-white" href={SITE_URL}>{SITE_URL}</a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

