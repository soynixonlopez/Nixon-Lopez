'use client'

import { useEffect, useState } from 'react'
import type { BlogTocItem } from '@/lib/blog-toc'
import { blogSurface } from '@/components/blog/blog-ui'

type Props = {
  items: BlogTocItem[]
  collapsible?: boolean
}

export function BlogToc({ items, collapsible = false }: Props) {
  const [open, setOpen] = useState(!collapsible)
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null)

  useEffect(() => {
    if (!items.length) return

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (!headings.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id)
          return
        }

        // Si ninguna está visible, usa la más cercana por encima del viewport
        const above = headings
          .filter((el) => el.getBoundingClientRect().top <= 120)
          .at(-1)
        if (above) setActiveId(above.id)
      },
      {
        rootMargin: '-20% 0px -65% 0px',
        threshold: [0, 0.25, 0.5, 1],
      }
    )

    headings.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [items])

  if (!items.length) return null

  return (
    <nav aria-label="En este artículo" className={`${blogSurface} overflow-hidden p-5`}>
      {collapsible ? (
        <button
          type="button"
          className="flex w-full items-center justify-between text-left text-xs font-bold uppercase tracking-[0.14em] text-brand"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          En este artículo
          <span aria-hidden className="text-slate-400">
            {open ? '−' : '+'}
          </span>
        </button>
      ) : (
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">
          En este artículo
        </p>
      )}

      {open ? (
        <ol className="relative mt-4 space-y-0.5 border-l border-slate-200 pl-3 dark:border-slate-700">
          {items.map((item) => {
            const active = activeId === item.id
            return (
              <li key={item.id} className={item.level === 3 ? 'ml-2' : undefined}>
                <a
                  href={`#${item.id}`}
                  aria-current={active ? 'true' : undefined}
                  className={`relative block rounded-r-lg py-1.5 pl-3 text-sm leading-snug transition ${
                    active
                      ? 'bg-brand/10 font-semibold text-brand before:absolute before:left-[-13px] before:top-1/2 before:h-5 before:w-[3px] before:-translate-y-1/2 before:rounded-full before:bg-brand'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-brand dark:text-slate-300 dark:hover:bg-slate-900/60'
                  }`}
                >
                  {item.text}
                </a>
              </li>
            )
          })}
        </ol>
      ) : null}
    </nav>
  )
}
