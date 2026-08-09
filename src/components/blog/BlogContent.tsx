import Image from 'next/image'
import parse, {
  domToReact,
  type DOMNode,
  Element,
  type HTMLReactParserOptions,
} from 'html-react-parser'
import { isAllowedBlogImageSrc } from '@/lib/blog-security'
import { sanitizeBlogHtml } from '@/lib/blog-sanitize'

type Props = {
  html: string
  className?: string
}

function isElement(node: DOMNode): node is Element {
  return (node as Element).type === 'tag' && typeof (node as Element).name === 'string'
}

function toInt(value: string | undefined, fallback: number) {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? Math.round(n) : fallback
}

function hasClass(attribs: Record<string, string> | undefined, name: string) {
  return (attribs?.class || '')
    .split(/\s+/)
    .filter(Boolean)
    .includes(name)
}

/** Renderiza HTML sanitizado; imágenes → next/image; callouts/tablas editoriales. */
export function BlogContent({ html, className = '' }: Props) {
  const clean = sanitizeBlogHtml(html)

  const options: HTMLReactParserOptions = {
    replace(domNode) {
      if (!isElement(domNode)) return

      if (domNode.name === 'img') {
        const src = domNode.attribs.src
        if (!src) return <></>
        const alt = domNode.attribs.alt?.trim() || 'Imagen del artículo'
        const width = toInt(domNode.attribs.width, 1200)
        const height = toInt(domNode.attribs.height, 675)
        if (!isAllowedBlogImageSrc(src)) return <></>

        return (
          <figure className="my-8">
            <span
              className="relative mx-auto block w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900"
              style={{ aspectRatio: `${width} / ${height}` }}
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 720px"
              />
            </span>
            {alt && alt !== 'Imagen del artículo' ? (
              <figcaption className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
                {alt}
              </figcaption>
            ) : null}
          </figure>
        )
      }

      if (domNode.name === 'a') {
        const href = domNode.attribs.href || '#'
        const isExternal = /^https?:\/\//i.test(href) && !href.includes('nixonlopez.com')
        return (
          <a
            href={href}
            className="font-medium text-brand underline-offset-2 hover:underline"
            {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {domToReact(domNode.children as DOMNode[], options)}
          </a>
        )
      }

      if (
        (domNode.name === 'aside' || domNode.name === 'div') &&
        hasClass(domNode.attribs, 'blog-callout')
      ) {
        return (
          <aside className="my-8 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-5 dark:border-slate-700 dark:bg-slate-900/60">
            <div className="text-[0.95rem] leading-relaxed text-slate-700 dark:text-slate-300 [&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_strong]:text-slate-900 dark:[&_strong]:text-white">
              {domToReact(domNode.children as DOMNode[], options)}
            </div>
          </aside>
        )
      }

      if (
        (domNode.name === 'aside' || domNode.name === 'div') &&
        hasClass(domNode.attribs, 'blog-cta')
      ) {
        return (
          <aside className="my-10 rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-6 sm:px-7 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="[&_a]:inline-flex [&_a]:min-h-[44px] [&_a]:items-center [&_a]:rounded-xl [&_a]:bg-brand [&_a]:px-5 [&_a]:py-2 [&_a]:font-semibold [&_a]:text-white [&_a]:no-underline [&_p]:my-2 [&_p:first-child]:mt-0">
              {domToReact(domNode.children as DOMNode[], options)}
            </div>
          </aside>
        )
      }

      if (domNode.name === 'table') {
        return (
          <div className="my-8 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="min-w-full border-collapse text-left text-sm">
              {domToReact(domNode.children as DOMNode[], options)}
            </table>
          </div>
        )
      }

      if (domNode.name === 'thead') {
        return (
          <thead className="bg-slate-50 dark:bg-slate-900">
            {domToReact(domNode.children as DOMNode[], options)}
          </thead>
        )
      }

      if (domNode.name === 'th') {
        return (
          <th
            scope={domNode.attribs.scope || 'col'}
            className="border-b border-slate-200 px-3 py-3 font-semibold text-slate-900 dark:border-slate-700 dark:text-white"
          >
            {domToReact(domNode.children as DOMNode[], options)}
          </th>
        )
      }

      if (domNode.name === 'td') {
        return (
          <td className="border-b border-slate-100 px-3 py-3 align-top text-slate-600 dark:border-slate-800 dark:text-slate-300">
            {domToReact(domNode.children as DOMNode[], options)}
          </td>
        )
      }

      if (domNode.name === 'h2' && domNode.attribs.id) {
        return (
          <h2
            id={domNode.attribs.id}
            className="mt-12 scroll-mt-28 text-[1.65rem] font-bold tracking-tight text-slate-900 first:mt-0 dark:text-white"
          >
            {domToReact(domNode.children as DOMNode[], options)}
          </h2>
        )
      }

      if (domNode.name === 'h3' && domNode.attribs.id) {
        return (
          <h3
            id={domNode.attribs.id}
            className="mt-8 scroll-mt-28 text-xl font-semibold tracking-tight text-slate-900 dark:text-white"
          >
            {domToReact(domNode.children as DOMNode[], options)}
          </h3>
        )
      }

      return undefined
    },
  }

  return (
    <div
      className={`blog-prose prose prose-slate max-w-none dark:prose-invert prose-p:text-[1.05rem] prose-p:leading-[1.8] prose-li:my-1.5 prose-li:leading-relaxed prose-ul:marker:text-brand prose-ol:marker:text-brand prose-blockquote:border-brand/40 prose-blockquote:text-slate-600 dark:prose-blockquote:text-slate-300 ${className}`}
    >
      {parse(clean, options)}
    </div>
  )
}
