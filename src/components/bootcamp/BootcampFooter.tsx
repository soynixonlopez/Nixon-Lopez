import Link from 'next/link'
import { BOOTCAMP_FOOTER } from '@/lib/bootcamp'

export default function BootcampFooter() {
  return (
    <footer className="border-t border-white/10 py-10 text-center text-sm text-slate-500">
      <div className="container flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
        {BOOTCAMP_FOOTER.social.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-slate-300"
          >
            {link.label}
          </a>
        ))}
        <a href={`mailto:${BOOTCAMP_FOOTER.email}`} className="transition hover:text-slate-300">
          {BOOTCAMP_FOOTER.email}
        </a>
        <Link href="/politica-de-privacidad" className="transition hover:text-slate-300">
          Privacidad
        </Link>
      </div>
      <p className="mt-6">© {new Date().getFullYear()} Nixon López</p>
    </footer>
  )
}
