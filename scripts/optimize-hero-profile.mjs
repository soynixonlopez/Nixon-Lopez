/**
 * Genera nixonprofile.webp y nixonprofile.avif desde el PNG (redimensionado para hero).
 * Ejecutar: pnpm run optimize-hero-profile
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const inputPath = path.join(root, 'public', 'images', 'nixonprofile.png')
const outWebp = path.join(root, 'public', 'images', 'nixonprofile.webp')
const outAvif = path.join(root, 'public', 'images', 'nixonprofile.avif')

/** Ancho máximo en CSS (~768px columna × 2 retina); evita decodificar píxeles de más */
const MAX_WIDTH = 1200

async function main() {
  if (!fs.existsSync(inputPath)) {
    console.error('No existe:', inputPath)
    process.exit(1)
  }

  const meta = await sharp(inputPath).metadata()
  const w = meta.width ?? 0
  if (!w) {
    console.error('No se pudo leer dimensiones del PNG')
    process.exit(1)
  }

  const pipeline = sharp(inputPath).resize({
    width: MAX_WIDTH,
    withoutEnlargement: true,
    fit: 'inside',
  })

  await pipeline.clone().webp({ quality: 82, effort: 6 }).toFile(outWebp)
  await pipeline.clone().avif({ quality: 62, effort: 7 }).toFile(outAvif)

  const inStat = fs.statSync(inputPath)
  const webpStat = fs.statSync(outWebp)
  const avifStat = fs.statSync(outAvif)
  const webpMeta = await sharp(outWebp).metadata()
  const avifMeta = await sharp(outAvif).metadata()

  console.log('Entrada PNG:', Math.round(inStat.size / 1024), 'KiB', `(${meta.width}×${meta.height})`)
  console.log('Salida WebP:', Math.round(webpStat.size / 1024), 'KiB', `(${webpMeta.width}×${webpMeta.height})`)
  console.log('Salida AVIF:', Math.round(avifStat.size / 1024), 'KiB', `(${avifMeta.width}×${avifMeta.height})`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
