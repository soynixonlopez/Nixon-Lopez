import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SITE_URL } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description:
    'Política de Privacidad de NL Services (Nixon López). Información sobre tratamiento de datos, finalidades, bases legales, derechos y contacto.',
  alternates: { canonical: `${SITE_URL}/politica-de-privacidad` },
  robots: { index: true, follow: true },
}

const LAST_UPDATED = '23 de abril de 2026'
const CONTACT_EMAIL = 'info@nixonlopez.com'

export default function PoliticaDePrivacidadPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-950 pt-24 sm:pt-28 pb-16">
        <div className="container-padding">
          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Política de Privacidad
            </h1>
            <p className="text-slate-400 text-sm mb-10">
              Última actualización: {LAST_UPDATED}
            </p>

            <div className="space-y-10 text-slate-200/90">
              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-white">1. Responsable</h2>
                <p className="text-sm leading-relaxed">
                  Este sitio web es operado por <strong>NL Services</strong> (Nixon López). Para consultas relacionadas con
                  privacidad puedes escribir a{' '}
                  <a className="underline hover:text-white" href={`mailto:${CONTACT_EMAIL}`}>
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>
                <p className="text-sm leading-relaxed">
                  Sitio web: <a className="underline hover:text-white" href={SITE_URL}>{SITE_URL}</a>
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-white">2. Datos que recopilamos</h2>
                <p className="text-sm leading-relaxed">
                  Recopilamos datos que nos proporcionas directamente cuando:
                </p>
                <ul className="list-disc pl-6 text-sm space-y-2 text-slate-300">
                  <li>Nos contactas mediante el formulario de contacto (nombre, apellido, correo y descripción).</li>
                  <li>Solicitas una cotización online (datos de contacto y detalles del servicio).</li>
                  <li>Te suscribes al newsletter (correo electrónico).</li>
                </ul>
                <p className="text-sm leading-relaxed">
                  También podemos recopilar datos técnicos (por ejemplo, dirección IP aproximada, navegador/dispositivo,
                  páginas visitadas) para seguridad, prevención de abuso y medición.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-white">3. Finalidades del tratamiento</h2>
                <ul className="list-disc pl-6 text-sm space-y-2 text-slate-300">
                  <li>Responder consultas y dar seguimiento comercial a solicitudes.</li>
                  <li>Preparar y enviar cotizaciones y propuestas.</li>
                  <li>Enviar comunicaciones del newsletter (si te suscribes).</li>
                  <li>Seguridad del sitio, prevención de fraude/spam y limitación de solicitudes.</li>
                  <li>Medición y mejora del rendimiento del sitio y campañas (por ejemplo, mediante Meta Pixel).</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-white">4. Base legal</h2>
                <p className="text-sm leading-relaxed">
                  Tratamos tus datos cuando es necesario para atender tu solicitud (por ejemplo, contacto/cotización), para
                  cumplir obligaciones aplicables, y/o con base en nuestro interés legítimo (seguridad, prevención de abuso,
                  mejora del servicio). En casos que lo requieran, solicitaremos tu consentimiento (por ejemplo, para ciertas
                  cookies o comunicaciones).
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-white">5. Compartición con terceros</h2>
                <p className="text-sm leading-relaxed">
                  No vendemos tu información personal. Podemos compartir datos con proveedores que nos ayudan a operar el sitio y
                  prestar servicios (por ejemplo, proveedores de correo/SMTP para enviar mensajes y plataformas de analítica o
                  publicidad). Estos proveedores tratan datos por cuenta nuestra y bajo sus propias políticas.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-white">6. Retención</h2>
                <p className="text-sm leading-relaxed">
                  Conservamos los datos el tiempo necesario para cumplir las finalidades descritas, atender solicitudes,
                  cumplir obligaciones y resolver disputas. Los plazos pueden variar según el tipo de dato y el contexto.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-white">7. Derechos</h2>
                <p className="text-sm leading-relaxed">
                  Puedes solicitar acceso, rectificación, actualización o eliminación de tus datos, así como oponerte o limitar
                  ciertos tratamientos cuando corresponda. Para ejercer tus derechos, contáctanos a{' '}
                  <a className="underline hover:text-white" href={`mailto:${CONTACT_EMAIL}`}>
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-white">8. Cookies y tecnologías similares</h2>
                <p className="text-sm leading-relaxed">
                  Usamos cookies/tecnologías similares para el funcionamiento del sitio y para medición/publicidad. Puedes ver
                  detalles en la{' '}
                  <a className="underline hover:text-white" href="/politica-de-cookies">
                    Política de Cookies
                  </a>
                  .
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-white">9. Cambios en esta política</h2>
                <p className="text-sm leading-relaxed">
                  Podemos actualizar esta política para reflejar cambios operativos, legales o regulatorios. Publicaremos la
                  versión vigente en esta página.
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

