import Link from 'next/link'
import { BrandLogo } from '@/components/BrandLogo'
import { BOOTCAMP_HOTMART_URL, BOOTCAMP_PRICING } from '@/lib/bootcamp'
import { bootcampCtaCompact } from '@/lib/bootcamp-ui'

const NAV = [
  { label: 'Programa', href: '#programa' },
  { label: 'Bonos', href: '#bonos' },
  { label: 'Pagos', href: '#pagos' },
  { label: 'FAQ', href: '#faq' },
] as const

export default function BootcampHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#050810]/85 backdrop-blur-xl shadow-lg shadow-black/20">
      <div className="container flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]">
        <Link href="/bootcamp" className="relative flex shrink-0 items-center">
          <BrandLogo alt="Nixon López" className="h-7 w-auto sm:h-8" sizes="180px" priority />
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Secciones">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="text-sm font-medium text-slate-300 transition hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>

        <a href={BOOTCAMP_HOTMART_URL} target="_blank" rel="noopener noreferrer" className={bootcampCtaCompact}>
          {BOOTCAMP_PRICING.ctaShortLabel}
        </a>
      </div>
    </header>
  )
}
