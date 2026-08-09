import Link from 'next/link'

type Props = {
  name: string
}

/** Bloque de autor con copy real del sitio (About). */
export function BlogAuthorCard({ name }: Props) {
  return (
    <aside className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-6 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900/50">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
        {name
          .split(/\s+/)
          .slice(0, 2)
          .map((p) => p[0])
          .join('')
          .toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-base font-semibold text-slate-900 dark:text-white">{name}</p>
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
