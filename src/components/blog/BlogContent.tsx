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

/** Renderiza HTML sanitizado; imágenes → next/image. */
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
              className="relative mx-auto block w-full max-w-3xl overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900"
              style={{ aspectRatio: `${width} / ${height}` }}
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 768px"
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
            {...(isExternal
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
          >
            {domToReact(domNode.children as DOMNode[], options)}
          </a>
        )
      }

      return undefined
    },
  }

  return (
    <div
      className={`blog-prose prose prose-slate max-w-none dark:prose-invert prose-headings:scroll-mt-28 prose-headings:font-semibold prose-h2:mt-10 prose-h2:text-2xl prose-h3:mt-8 prose-h3:text-xl prose-p:leading-relaxed prose-li:my-1 prose-blockquote:border-brand/40 prose-blockquote:text-slate-600 dark:prose-blockquote:text-slate-300 ${className}`}
    >
      {parse(clean, options)}
    </div>
  )
}
