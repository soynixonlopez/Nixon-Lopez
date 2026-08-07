import sharp from 'sharp'
import { PORTFOLIO_IMAGE } from '@/lib/portfolio'

export type OptimizedPortfolioImage = {
  buffer: Buffer
  width: number
  height: number
  bytes: number
  contentType: 'image/webp'
  filename: string
}

/** Recorta/ajusta a 16:10 (1600×1000) y comprime a WebP para el carrusel. */
export async function optimizePortfolioImage(
  input: Buffer,
  opts?: { slugHint?: string },
): Promise<OptimizedPortfolioImage> {
  const { width, height, webpQuality } = PORTFOLIO_IMAGE

  const pipeline = sharp(input, { failOn: 'none' })
    .rotate()
    .resize(width, height, {
      fit: 'cover',
      position: 'top',
      withoutEnlargement: false,
    })
    .webp({ quality: webpQuality, effort: 5 })

  const buffer = await pipeline.toBuffer()
  const meta = await sharp(buffer).metadata()
  const stamp = Date.now().toString(36)
  const safe = (opts?.slugHint || 'proyecto')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)

  return {
    buffer,
    width: meta.width ?? width,
    height: meta.height ?? height,
    bytes: buffer.byteLength,
    contentType: 'image/webp',
    filename: `${safe || 'proyecto'}-${stamp}.webp`,
  }
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
