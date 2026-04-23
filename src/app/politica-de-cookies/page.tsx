import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SITE_URL } from '@/lib/site-config'

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
      <main className="min-h-screen bg-slate-950 pt-24 sm:pt-28 pb-16">
        <div className="container-padding">
          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Política de Cookies
            </h1>
            <p className="text-slate-400 text-sm mb-10">
              Última actualización: {LAST_UPDATED}
            </p>

            <div className="space-y-10 text-slate-200/90">
              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-white">1. ¿Qué son las cookies?</h2>
                <p className="text-sm leading-relaxed">
                  Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web.
                  También existen tecnologías similares (píxeles, etiquetas, almacenamiento local) con finalidades parecidas.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-white">2. ¿Para qué las usamos?</h2>
                <ul className="list-disc pl-6 text-sm space-y-2 text-slate-300">
                  <li><strong>Funcionamiento y seguridad</strong>: permitir que el sitio funcione correctamente y prevenir abuso.</li>
                  <li><strong>Medición</strong>: entender el uso del sitio para mejorar contenido y rendimiento.</li>
                  <li><strong>Publicidad/atribución</strong>: medir resultados de campañas (por ejemplo, Meta Pixel).</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-white">3. Cookies de terceros (Meta / Facebook Pixel)</h2>
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

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-white">4. ¿Cómo puedes gestionar las cookies?</h2>
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

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-white">6. Contacto</h2>
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

