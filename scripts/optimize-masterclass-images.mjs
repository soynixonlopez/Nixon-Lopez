/**
 * Comprime imágenes de la landing /masterclass a WebP.
 * Ejecutar: pnpm run optimize-masterclass-images
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

/** @type {{ input: string; maxWidth: number; quality: number }[]} */
const jobs = [
  { input: 'public/images/nixon/masterclass_hero.png', maxWidth: 1360, quality: 82 },
  { input: 'public/images/nixon/masterclass_about.png', maxWidth: 1120, quality: 82 },
  { input: 'public/images/projects/hero_image1.png', maxWidth: 800, quality: 80 },
  { input: 'public/images/projects/hero_image2.png', maxWidth: 800, quality: 80 },
  { input: 'public/images/projects/hero_image3.png', maxWidth: 800, quality: 80 },
  { input: 'public/images/projects/hero_image4.png', maxWidth: 800, quality: 80 },
  { input: 'public/images/projects/spl_preview.png', maxWidth: 1200, quality: 80 },
  { input: 'public/images/projects/aquarumbos_preview.png', maxWidth: 1200, quality: 80 },
  { input: 'public/images/projects/aserta_preview.png', maxWidth: 1200, quality: 80 },
  { input: 'public/images/projects/sara_preview.png', maxWidth: 1200, quality: 80 },
]

async function optimizeOne({ input, maxWidth, quality }) {
  const inputPath = path.join(root, input)
  if (!fs.existsSync(inputPath)) {
    console.warn('Omitido (no existe):', input)
    return
  }

  const outPath = inputPath.replace(/\.[^.]+$/, '.webp')
  const meta = await sharp(inputPath).metadata()
  const inStat = fs.statSync(inputPath)

  await sharp(inputPath)
    .resize({ width: maxWidth, withoutEnlargement: true, fit: 'inside' })
    .webp({ quality, effort: 6 })
    .toFile(outPath)

  const outStat = fs.statSync(outPath)
  const outMeta = await sharp(outPath).metadata()
  const saved = Math.round((1 - outStat.size / inStat.size) * 100)

  console.log(
    `${path.basename(input)} → ${path.basename(outPath)} | ${Math.round(inStat.size / 1024)} KiB → ${Math.round(outStat.size / 1024)} KiB (−${saved}%) | ${outMeta.width}×${outMeta.height}`,
  )
}

async function main() {
  for (const job of jobs) {
    await optimizeOne(job)
  }
  console.log('Listo.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
