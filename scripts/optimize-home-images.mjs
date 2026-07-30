/**
 * Optimiza imágenes del home: nixon_hero (sin fondo negro) y nixon_about.
 * Ejecutar: pnpm run optimize-home-images
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const nixonDir = path.join(root, 'public', 'images', 'nixon')

/** Convierte píxeles casi negros en transparentes para integrar en hero claro */
async function removeNearBlackBackground(inputPath, maxWidth, quality) {
  const pipeline = sharp(inputPath).ensureAlpha()
  const { data, info } = await pipeline
    .resize({ width: maxWidth, withoutEnlargement: true, fit: 'inside' })
    .raw()
    .toBuffer({ resolveWithObject: true })

  const pixels = new Uint8Array(data)
  const threshold = 28

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i]
    const g = pixels[i + 1]
    const b = pixels[i + 2]
    if (r <= threshold && g <= threshold && b <= threshold) {
      pixels[i + 3] = 0
    }
  }

  const outPath = inputPath.replace(/\.[^.]+$/, '.webp')
  await sharp(pixels, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .webp({ quality, effort: 6, alphaQuality: 90 })
    .toFile(outPath)

  const inStat = fs.statSync(inputPath)
  const outStat = fs.statSync(outPath)
  console.log(
    `${path.basename(inputPath)} → ${path.basename(outPath)} (fondo negro removido) | ${Math.round(inStat.size / 1024)} → ${Math.round(outStat.size / 1024)} KiB | ${info.width}×${info.height}`,
  )
}

async function optimizePhoto(inputPath, maxWidth, quality) {
  const outPath = inputPath.replace(/\.[^.]+$/, '.webp')
  const inStat = fs.statSync(inputPath)
  const meta = await sharp(inputPath).metadata()

  await sharp(inputPath)
    .resize({ width: maxWidth, withoutEnlargement: true, fit: 'inside' })
    .webp({ quality, effort: 6 })
    .toFile(outPath)

  const outStat = fs.statSync(outPath)
  const outMeta = await sharp(outPath).metadata()
  console.log(
    `${path.basename(inputPath)} → ${path.basename(outPath)} | ${Math.round(inStat.size / 1024)} → ${Math.round(outStat.size / 1024)} KiB | ${outMeta.width}×${outMeta.height}`,
  )
}

async function main() {
  const hero = path.join(nixonDir, 'nixon_hero.png')
  const about = path.join(nixonDir, 'nixon_about.png')

  if (!fs.existsSync(hero) || !fs.existsSync(about)) {
    console.error('Faltan nixon_hero.png o nixon_about.png en public/images/nixon/')
    process.exit(1)
  }

  await removeNearBlackBackground(hero, 1200, 82)
  await optimizePhoto(about, 960, 82)
  console.log('Listo.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
