import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SITE_URL } from '@/lib/site-config'
import Link from 'next/link'
import {
  Shield,
  Mail,
  Database,
  FileText,
  Scale,
  Clock,
  Users,
  Cookie,
  ArrowRight,
} from 'lucide-react'

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
      <main className="min-h-screen bg-slate-950 pt-24 sm:pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center" />
        </div>
        <div className="container-padding">
          <div className="relative z-10 max-w-5xl">
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/15 to-purple-600/15 border border-white/10 text-slate-200 px-4 py-2 rounded-full text-sm">
                <Shield className="w-4 h-4 text-blue-400" />
                Tu privacidad, en claro
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mt-4">
                Política de Privacidad
              </h1>
              <p className="text-slate-400 text-sm mt-2">
                Última actualización: {LAST_UPDATED}
              </p>
              <p className="text-slate-300/90 text-base leading-relaxed mt-5 max-w-3xl">
                En NL Services usamos tus datos solo para <strong>responderte</strong>, <strong>cotizar</strong> y <strong>dar seguimiento</strong> a tus solicitudes,
                proteger el sitio contra abuso y medir resultados de campañas. Aquí te explicamos qué recopilamos, para qué y cómo ejercer tus derechos.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center gap-2 text-blue-300 mb-2">
                  <Database className="w-4 h-4" />
                  <p className="text-sm font-semibold text-white">Qué datos</p>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Contacto, cotización y newsletter + datos técnicos básicos para seguridad/medición.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center gap-2 text-purple-300 mb-2">
                  <FileText className="w-4 h-4" />
                  <p className="text-sm font-semibold text-white">Para qué</p>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Responder, preparar propuestas y mejorar el sitio/campañas.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center gap-2 text-emerald-300 mb-2">
                  <Users className="w-4 h-4" />
                  <p className="text-sm font-semibold text-white">Con quién</p>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Proveedores operativos (correo/hosting/analítica). No vendemos tu información.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center gap-2 text-amber-300 mb-2">
                  <Mail className="w-4 h-4" />
                  <p className="text-sm font-semibold text-white">Contacto</p>
                </div>
                <a
                  className="text-sm text-slate-300 underline hover:text-white"
                  href={`mailto:${CONTACT_EMAIL}`}
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 sm:p-6 mb-12">
              <p className="text-sm text-slate-200 font-semibold mb-3">Índice rápido</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { href: '#responsable', label: 'Responsable', icon: Shield },
                  { href: '#datos', label: 'Datos', icon: Database },
                  { href: '#finalidades', label: 'Finalidades', icon: FileText },
                  { href: '#base-legal', label: 'Base legal', icon: Scale },
                  { href: '#terceros', label: 'Terceros', icon: Users },
                  { href: '#retencion', label: 'Retención', icon: Clock },
                  { href: '#derechos', label: 'Tus derechos', icon: ArrowRight },
                  { href: '#cookies', label: 'Cookies', icon: Cookie },
                ].map(({ href, label, icon: Icon }) => (
                  <a
                    key={href}
                    href={href}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 hover:text-white hover:border-white/20 transition-colors text-sm"
                  >
                    <Icon className="w-4 h-4 text-slate-400" />
                    {label}
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-10 text-slate-200/90">
              <section id="responsable" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  Responsable
                </h2>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-sm leading-relaxed">
                    Este sitio web es operado por <strong>NL Services</strong> (Nixon López). Para consultas relacionadas con
                    privacidad puedes escribir a{' '}
                    <a className="underline hover:text-white" href={`mailto:${CONTACT_EMAIL}`}>
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </p>
                  <p className="text-sm leading-relaxed mt-2">
                    Sitio web:{' '}
                    <a className="underline hover:text-white" href={SITE_URL}>
                      {SITE_URL}
                    </a>
                  </p>
                </div>
              </section>

              <section id="datos" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-purple-400" />
                  Datos que recopilamos
                </h2>
                <p className="text-sm leading-relaxed">
                  Recopilamos datos que nos proporcionas directamente cuando:
                </p>
                <ul className="list-disc pl-6 text-sm space-y-2 text-slate-300">
                  <li>Nos contactas mediante el formulario de contacto (nombre, apellido, correo y descripción).</li>
                  <li>Solicitas una cotización online (datos de contacto y detalles del servicio).</li>
                  <li>Te suscribes al newsletter (correo electrónico).</li>
                </ul>
                <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
                  <p className="text-sm leading-relaxed text-slate-200">
                  También podemos recopilar datos técnicos (por ejemplo, dirección IP aproximada, navegador/dispositivo,
                  páginas visitadas) para seguridad, prevención de abuso y medición.
                  </p>
                </div>
              </section>

              <section id="finalidades" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  Finalidades del tratamiento
                </h2>
                <ul className="list-disc pl-6 text-sm space-y-2 text-slate-300">
                  <li>Responder consultas y dar seguimiento comercial a solicitudes.</li>
                  <li>Preparar y enviar cotizaciones y propuestas.</li>
                  <li>Enviar comunicaciones del newsletter (si te suscribes).</li>
                  <li>Seguridad del sitio, prevención de fraude/spam y limitación de solicitudes.</li>
                  <li>Medición y mejora del rendimiento del sitio y campañas (por ejemplo, mediante Meta Pixel).</li>
                </ul>
              </section>

              <section id="base-legal" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Scale className="w-5 h-5 text-amber-400" />
                  Base legal
                </h2>
                <p className="text-sm leading-relaxed">
                  Tratamos tus datos cuando es necesario para atender tu solicitud (por ejemplo, contacto/cotización), para
                  cumplir obligaciones aplicables, y/o con base en nuestro interés legítimo (seguridad, prevención de abuso,
                  mejora del servicio). En casos que lo requieran, solicitaremos tu consentimiento (por ejemplo, para ciertas
                  cookies o comunicaciones).
                </p>
              </section>

              <section id="terceros" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-sky-400" />
                  Compartición con terceros
                </h2>
                <p className="text-sm leading-relaxed">
                  No vendemos tu información personal. Podemos compartir datos con proveedores que nos ayudan a operar el sitio y
                  prestar servicios (por ejemplo, proveedores de correo/SMTP para enviar mensajes y plataformas de analítica o
                  publicidad). Estos proveedores tratan datos por cuenta nuestra y bajo sus propias políticas.
                </p>
              </section>

              <section id="retencion" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-violet-400" />
                  Retención
                </h2>
                <p className="text-sm leading-relaxed">
                  Conservamos los datos el tiempo necesario para cumplir las finalidades descritas, atender solicitudes,
                  cumplir obligaciones y resolver disputas. Los plazos pueden variar según el tipo de dato y el contexto.
                </p>
              </section>

              <section id="derechos" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-green-400" />
                  Tus derechos
                </h2>
                <p className="text-sm leading-relaxed">
                  Puedes solicitar acceso, rectificación, actualización o eliminación de tus datos, así como oponerte o limitar
                  ciertos tratamientos cuando corresponda. Para ejercer tus derechos, contáctanos a{' '}
                  <a className="underline hover:text-white" href={`mailto:${CONTACT_EMAIL}`}>
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>
              </section>

              <section id="cookies" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Cookie className="w-5 h-5 text-orange-400" />
                  Cookies y tecnologías similares
                </h2>
                <p className="text-sm leading-relaxed">
                  Usamos cookies/tecnologías similares para el funcionamiento del sitio y para medición/publicidad. Puedes ver
                  detalles en la{' '}
                  <Link className="underline hover:text-white" href="/politica-de-cookies">
                    Política de Cookies
                  </Link>
                  .
                </p>
              </section>

              <section id="cambios" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-semibold text-white">Cambios en esta política</h2>
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

