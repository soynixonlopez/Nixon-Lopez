import Link from 'next/link'
import { blogSurface } from '@/components/blog/blog-ui'

type Props = {
  name: string
}

export function BlogAuthorCard({ name }: Props) {
  return (
    <aside className={`flex flex-col gap-4 ${blogSurface} p-6 sm:flex-row sm:items-center`}>
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
        {name
          .split(/\s+/)
          .slice(0, 2)
          .map((p) => p[0])
          .join('')
          .toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-base font-bold text-slate-900 dark:text-white">{name}</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Desarrollador web especializado en crear páginas y soluciones digitales para negocios
          que quieren mejorar su presencia online y conseguir más clientes.
        </p>
        <Link
          href="/#about"
          className="mt-3 inline-flex text-sm font-semibold text-brand hover:underline"
        >
          Conocer más
        </Link>
      </div>
    </aside>
  )
}
