'use client'

import Link from 'next/link'
import { BrandLogo } from '@/components/BrandLogo'
import TechLogo from './TechLogo'
import { useMessages } from '@/i18n/LocaleProvider'
import { buildWhatsAppUrl, CONTACT_EMAIL } from '@/lib/marketing'
import { WHATSAPP_E164 } from '@/lib/site-contact'

const Footer = () => {
  const messages = useMessages()

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

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-left">
      <div className="container-padding max-w-6xl mx-auto py-14 sm:py-16 px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <BrandLogo alt="Nixon Lopez" sizes="48px" />
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs">
              {messages.footer.tagline}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-900 dark:text-slate-100 mb-4">
              {messages.footer.navTitle}
            </h3>
            <ul className="space-y-2.5">
              {messages.nav.map((link) => (
                <li key={link.href + link.name}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(link.href)}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand transition"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-900 dark:text-slate-100 mb-4">
              {messages.footer.servicesTitle}
            </h3>
            <ul className="space-y-2.5">
              {messages.footerServices.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand transition">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-900 dark:text-slate-100 mb-4">
              {messages.footer.contactTitle}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={buildWhatsAppUrl(messages.whatsappMessages.default)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-brand transition"
                >
                  <TechLogo name="WhatsApp" size={18} />
                  {messages.common.whatsapp}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand transition break-all"
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
                      className="rounded-lg border border-slate-200 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400 hover:text-brand hover:border-slate-300 dark:hover:border-slate-600 transition"
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

        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Nixon Lopez Services. {messages.footer.rights}
          </p>
          <div className="flex flex-wrap gap-5">
            <Link
              href="/politica-de-privacidad"
              className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition"
            >
              {messages.footer.privacy}
            </Link>
            <Link
              href="/politica-de-cookies"
              className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition"
            >
              {messages.footer.cookies}
            </Link>
            <span className="text-sm text-slate-400 hidden sm:inline">·</span>
            <a
              href={`https://wa.me/${WHATSAPP_E164}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition sm:hidden"
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
