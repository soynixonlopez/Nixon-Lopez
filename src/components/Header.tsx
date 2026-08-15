'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ArrowRight } from 'lucide-react'
import { BrandLogo } from '@/components/BrandLogo'
import { CtaButtons } from '@/components/marketing/CtaButtons'
import { SiteControls } from '@/components/SiteControls'
import { useMessages } from '@/i18n/LocaleProvider'
import { quoteUrl } from '@/lib/marketing'

const Header = () => {
  const messages = useMessages()
  const mainNav = messages.nav.filter((item) => item.href !== '#')
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      if (pathname !== '/') {
        window.location.href = `/${href}`
        setIsMenuOpen(false)
        return
      }
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
        setIsMenuOpen(false)
        return
      }
      window.location.hash = href.slice(1)
      setIsMenuOpen(false)
    } else {
      window.location.href = href
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 safe-area-header ${
        isScrolled || isMenuOpen
          ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm'
          : 'bg-white/70 dark:bg-slate-950/70 backdrop-blur-sm'
      }`}
    >
      <div className="container-padding max-w-6xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-16 md:h-[4.5rem] min-h-[64px] gap-3">
          <Link href="/" className="flex items-center shrink-0 min-w-0 max-w-[14rem] sm:max-w-[18rem] md:max-w-none">
            <BrandLogo alt="Nixon Lopez Services" sizes="48px" priority />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {mainNav.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => scrollToSection(item.href)}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                {item.name}
              </button>
            ))}
          </nav>

          <div className="flex items-center shrink-0 gap-1 sm:gap-2">
            <SiteControls compact />
            <div className="hidden md:block">
              <CtaButtons
                size="sm"
                quoteHref={quoteUrl()}
                quoteLabel={messages.common.getQuote}
                whatsappLabel={messages.common.whatsapp}
              />
            </div>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-slate-700 dark:text-slate-200 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label={isMenuOpen ? messages.common.closeMenu : messages.common.openMenu}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen ? (
        <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]"
            aria-label={messages.common.closeMenu}
            onClick={() => setIsMenuOpen(false)}
          />
          <nav className="absolute inset-y-0 right-0 flex w-[min(22rem,100%)] flex-col bg-white shadow-2xl dark:bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                  {messages.common.menu}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-white">
                  Nixon Lopez
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                aria-label={messages.common.close}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="space-y-1">
                {mainNav.map((item) => (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => scrollToSection(item.href)}
                    className="flex w-full items-center justify-between rounded-xl px-3.5 py-3.5 text-left text-base font-semibold text-slate-800 transition hover:bg-brand/10 hover:text-brand dark:text-slate-100"
                  >
                    {item.name}
                    <ArrowRight className="h-4 w-4 opacity-40" aria-hidden />
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-900/60">
              <CtaButtons
                layout="column"
                quoteHref={quoteUrl()}
                quoteLabel={messages.common.getQuote}
                whatsappLabel={messages.common.whatsappLong}
              />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  )
}

export default Header
