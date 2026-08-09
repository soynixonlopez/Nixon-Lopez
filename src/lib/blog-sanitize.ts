import sanitizeHtml from 'sanitize-html'
import { isAllowedBlogImageSrc } from '@/lib/blog-security'

/** Sanitiza HTML del artículo: sin scripts/iframes/H1 ni src arbitrarios. */
export function sanitizeBlogHtml(dirty: string): string {
  return sanitizeHtml(dirty || '', {
    allowedTags: [
      'p',
      'br',
      'strong',
      'em',
      'b',
      'i',
      'u',
      's',
      'blockquote',
      'ul',
      'ol',
      'li',
      'h2',
      'h3',
      'a',
      'img',
      'hr',
    ],
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: {
      img: ['https'],
      a: ['http', 'https', 'mailto'],
    },
    transformTags: {
      h1: 'h2',
      a: (_tagName, attribs) => {
        const href = (attribs.href || '').trim()
        const lower = href.toLowerCase()
        if (!href || lower.startsWith('javascript:') || lower.startsWith('data:')) {
          return { tagName: 'span', attribs: {} }
        }
        return {
          tagName: 'a',
          attribs: {
            href,
            rel: 'noopener noreferrer',
            ...(attribs.target === '_blank' ? { target: '_blank' } : {}),
          },
        }
      },
      img: (_tagName, attribs) => {
        const src = (attribs.src || '').trim()
        if (!isAllowedBlogImageSrc(src)) {
          return { tagName: 'span', attribs: {} }
        }
        return {
          tagName: 'img',
          attribs: {
            src,
            alt: attribs.alt?.trim() || 'Imagen del artículo',
            loading: 'lazy',
            ...(attribs.width ? { width: attribs.width } : {}),
            ...(attribs.height ? { height: attribs.height } : {}),
            ...(attribs.title ? { title: attribs.title } : {}),
          },
        }
      },
    },
    exclusiveFilter(frame) {
      if (frame.tag === 'a' && frame.attribs?.href) {
        const href = frame.attribs.href.trim().toLowerCase()
        if (href.startsWith('javascript:') || href.startsWith('data:')) return true
      }
      if (frame.tag === 'img' && frame.attribs?.src) {
        if (!isAllowedBlogImageSrc(frame.attribs.src)) return true
      }
      return false
    },
  })
}
