'use client'

import Link from 'next/link'
import Image from 'next/image'
import TechLogo from './TechLogo'
import { buildWhatsAppUrl, CONTACT_EMAIL, FOOTER_SERVICES, HOME_NAV, WHATSAPP_MESSAGES } from '@/lib/marketing'
import { WHATSAPP_E164 } from '@/lib/site-contact'

const Footer = () => {
  const scrollToSection = (href: string) => {
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const element = document.querySelector(href)
    if (element) element.scrollIntoView({ behavior: 'smooth' })
    else window.location.href = `/${href}`
  }

  const socialLinks = [
    { name: 'Instagram', href: 'https://www.instagram.com/nixondev.ai/' },
    { name: 'Facebook', href: 'https://facebook.com/soynixonlopez' },
    { name: 'TikTok', href: 'https://tiktok.com/@soynixonlopez' },
    { name: 'YouTube', href: 'https://www.youtube.com/@soynixonlopez' },
  ] as const

  const footerNav = [{ name: 'Inicio', href: '#' }, ...HOME_NAV]

  return (
    <footer className="bg-white border-t border-slate-200 text-left">
      <div className="container-padding max-w-6xl mx-auto py-14 sm:py-16 px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Image
              src="/images/logoweb.png"
              alt="Nixon Lopez"
              className="h-8 w-auto object-contain object-left"
              width={1306}
              height={199}
              sizes="200px"
            />
            <p className="mt-4 text-sm text-slate-600 leading-relaxed max-w-xs">
              Creo páginas web y soluciones digitales que ayudan a negocios a mejorar su presencia online y conseguir
              más clientes.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-900 mb-4">Navegación</h3>
            <ul className="space-y-2.5">
              {footerNav.map((link) => (
                <li key={link.name}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(link.href)}
                    className="text-sm text-slate-600 hover:text-brand transition"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-900 mb-4">Servicios</h3>
            <ul className="space-y-2.5">
              {FOOTER_SERVICES.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-slate-600 hover:text-brand transition">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-900 mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={buildWhatsAppUrl(WHATSAPP_MESSAGES.default)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-brand transition"
                >
                  <TechLogo name="WhatsApp" size={18} />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-sm text-slate-600 hover:text-brand transition break-all"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <div className="flex flex-wrap gap-2 pt-1">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:text-brand hover:border-slate-300 transition"
                      aria-label={social.name}
                    >
                      <TechLogo name={social.name} size={18} />
                    </a>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Nixon Lopez Services. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap gap-5">
            <Link href="/politica-de-privacidad" className="text-sm text-slate-500 hover:text-slate-900 transition">
              Privacidad
            </Link>
            <Link href="/politica-de-cookies" className="text-sm text-slate-500 hover:text-slate-900 transition">
              Cookies
            </Link>
            <span className="text-sm text-slate-400 hidden sm:inline">·</span>
            <a
              href={`https://wa.me/${WHATSAPP_E164}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-500 hover:text-slate-900 transition sm:hidden"
            >
              +{WHATSAPP_E164}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
