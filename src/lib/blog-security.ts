import { BLOG_IMAGE } from '@/lib/blog-constants'

export function isAllowedBlogImageSrc(src: string): boolean {
  if (!src || src.includes('..') || src.includes('\\')) return false
  if (src.startsWith('/images/')) return true
  try {
    const url = new URL(src)
    if (url.protocol !== 'https:') return false
    if (url.hostname === 'www.nixonlopez.com' || url.hostname === 'nixonlopez.com') {
      return (
        url.pathname.startsWith('/images/') ||
        url.pathname.includes(`/storage/v1/object/public/${BLOG_IMAGE.bucket}/`)
      )
    }
    if (url.hostname.endsWith('.supabase.co')) {
      return url.pathname.includes(`/storage/v1/object/public/${BLOG_IMAGE.bucket}/`)
    }
    return false
  } catch {
    return false
  }
}

export function sanitizeBlogStoragePath(path: string): string | null {
  const clean = path.replace(/^\/+/, '').trim()
  if (!clean || clean.includes('..') || clean.includes('\\') || clean.includes('\0')) return null
  if (!/^[a-zA-Z0-9/_.,\-]+$/.test(clean)) return null
  return clean
}

export const BLOG_POST_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function isBlogPostId(id: string) {
  return BLOG_POST_ID_RE.test(id)
}
