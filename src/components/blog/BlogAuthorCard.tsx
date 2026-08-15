import Image from 'next/image'
import Link from 'next/link'
import { HOME_IMAGES } from '@/lib/marketing'
import { blogSurface } from '@/components/blog/blog-ui'

type Props = {
  name: string
}

export function BlogAuthorCard({ name }: Props) {
  return (
    <aside className={`flex flex-col gap-4 ${blogSurface} p-5 sm:flex-row sm:items-center sm:p-6`}>
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-2 ring-brand/15 dark:bg-slate-800">
        <Image
          src={HOME_IMAGES.about}
          alt={name}
          fill
          className="object-cover object-top"
          sizes="64px"
        />
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
