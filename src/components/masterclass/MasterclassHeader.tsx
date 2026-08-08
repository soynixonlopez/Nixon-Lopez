import Link from 'next/link'
import { BrandLogo } from '@/components/BrandLogo'
import { masterclassCtaCompact } from '@/lib/masterclass-ui'

export default function MasterclassHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#050810]/85 backdrop-blur-xl shadow-lg shadow-black/20">
      <div className="container flex h-16 items-center justify-between sm:h-[4.5rem]">
        <Link href="/" className="relative flex items-center gap-2">
          <BrandLogo alt="Nixon López" className="h-7 w-auto sm:h-8" sizes="180px" priority />
        </Link>
        <a href="#registro" className={masterclassCtaCompact}>
          Reservar cupo
        </a>
      </div>
    </header>
  )
}
