import { slugifyBlog } from '@/lib/blog'

export type BlogTocItem = {
  id: string
  text: string
  level: 2 | 3
}

const HEADING_RE = /<h([23])(\s[^>]*)?>([\s\S]*?)<\/h\1>/gi

function plainFromInner(inner: string) {
  return inner
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Extrae TOC e inyecta ids estables en H2/H3 del HTML. */
export function enrichBlogHeadings(html: string): { html: string; toc: BlogTocItem[] } {
  const used = new Map<string, number>()
  const toc: BlogTocItem[] = []

  const nextId = (base: string) => {
    const n = used.get(base) ?? 0
    used.set(base, n + 1)
    return n === 0 ? base : `${base}-${n + 1}`
  }

  const enriched = (html || '').replace(HEADING_RE, (_full, levelStr, attrs = '', inner) => {
    const level = Number(levelStr) as 2 | 3
    const text = plainFromInner(inner)
    if (!text) return `<h${level}${attrs || ''}>${inner}</h${level}>`

    const existing = /id=["']([^"']+)["']/i.exec(attrs || '')
    const id = existing?.[1] || nextId(slugifyBlog(text) || `seccion-${toc.length + 1}`)
    const attrsWithoutId = (attrs || '').replace(/\s*id=["'][^"']*["']/i, '')
    toc.push({ id, text, level })
    return `<h${level}${attrsWithoutId} id="${id}">${inner}</h${level}>`
  })

  return { html: enriched, toc }
}

export function shouldShowToc(toc: BlogTocItem[], minItems = 3) {
  return toc.filter((item) => item.level === 2).length >= minItems || toc.length >= minItems
}
