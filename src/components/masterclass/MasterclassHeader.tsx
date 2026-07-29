'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { MasterclassCta } from './shared'

export default function MasterclassHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/10 bg-[#050810]/90 backdrop-blur-xl shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
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
        <MasterclassCta href="#registro" className="!w-auto !px-5 !py-2.5 !text-xs sm:!px-6 sm:!text-sm">
          Reservar cupo
        </MasterclassCta>
      </div>
    </header>
  )
}
