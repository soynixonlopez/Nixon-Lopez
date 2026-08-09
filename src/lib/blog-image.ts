import sharp from 'sharp'
import { BLOG_IMAGE } from '@/lib/blog-constants'

export type OptimizedBlogImage = {
  buffer: Buffer
  width: number
  height: number
  bytes: number
  contentType: 'image/webp'
  filename: string
}

/** Optimiza imagen de blog (featured o inline) a WebP sin forzar crop. */
export async function optimizeBlogImage(
  input: Buffer,
  opts?: { slugHint?: string },
): Promise<OptimizedBlogImage> {
  const pipeline = sharp(input, { failOn: 'none' })
    .rotate()
    .resize({
      width: BLOG_IMAGE.maxWidth,
      withoutEnlargement: true,
      fit: 'inside',
    })
    .webp({ quality: BLOG_IMAGE.webpQuality, effort: 5 })

  const buffer = await pipeline.toBuffer()
  const meta = await sharp(buffer).metadata()
  const stamp = Date.now().toString(36)
  const safe = (opts?.slugHint || 'post')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)

  return {
    buffer,
    width: meta.width ?? BLOG_IMAGE.maxWidth,
    height: meta.height ?? Math.round(BLOG_IMAGE.maxWidth * 0.6),
    bytes: buffer.byteLength,
    contentType: 'image/webp',
    filename: `${safe || 'post'}-${stamp}.webp`,
  }
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
