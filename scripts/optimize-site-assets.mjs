/**
 * Optimiza fondos del home y assets pesados a WebP.
 * Ejecutar: node scripts/optimize-site-assets.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const imagesDir = path.join(__dirname, '..', 'public', 'images')

const JOBS = [
  { file: 'hero_background_dark.png', maxWidth: 1920, quality: 78 },
  { file: 'eleccion_background_dark.png', maxWidth: 1920, quality: 78 },
  { file: 'hero_background.png', maxWidth: 1920, quality: 78 },
  { file: 'eleccion_background.png', maxWidth: 1920, quality: 78 },
  { file: 'cotizador.png', maxWidth: 1080, quality: 80 },
  { file: 'logooficial.png', maxWidth: 900, quality: 88 },
]

async function optimizeOne({ file, maxWidth, quality }) {
  const inputPath = path.join(imagesDir, file)
  if (!fs.existsSync(inputPath)) {
    console.warn(`Skip (no existe): ${file}`)
    return null
  }

  const outPath = inputPath.replace(/\.[^.]+$/, '.webp')
  const inStat = fs.statSync(inputPath)

  await sharp(inputPath)
    .resize({ width: maxWidth, withoutEnlargement: true, fit: 'inside' })
    .webp({ quality, effort: 6 })
    .toFile(outPath)

  const outStat = fs.statSync(outPath)
  const meta = await sharp(outPath).metadata()
  console.log(
    `${file} → ${path.basename(outPath)} | ${Math.round(inStat.size / 1024)} → ${Math.round(outStat.size / 1024)} KiB | ${meta.width}×${meta.height}`,
  )
  return {
    file,
    out: path.basename(outPath),
    beforeKb: Math.round(inStat.size / 1024),
    afterKb: Math.round(outStat.size / 1024),
  }
}

async function main() {
  const results = []
  for (const job of JOBS) {
    const r = await optimizeOne(job)
    if (r) results.push(r)
  }
  const saved = results.reduce((sum, r) => sum + (r.beforeKb - r.afterKb), 0)
  console.log(`Listo. Ahorro aprox. ${saved} KiB`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
