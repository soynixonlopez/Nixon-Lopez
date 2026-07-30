import Image from 'next/image'
import Link from 'next/link'
import { masterclassCtaCompact } from '@/lib/masterclass-ui'

export default function MasterclassHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#050810]/85 backdrop-blur-xl shadow-lg shadow-black/20">
      <div className="container flex h-16 items-center justify-between sm:h-[4.5rem]">
        <Link href="/" className="relative flex items-center gap-2">
          <Image
            src="/images/logoweb.png"
            alt="Nixon López"
            width={160}
            height={32}
            className="h-7 w-auto brightness-0 invert sm:h-8"
            priority
          />
        </Link>
        <a href="#registro" className={masterclassCtaCompact}>
          Reservar cupo
        </a>
      </div>
    </header>
  )
}
