/**
 * Recorta márgenes uniformes (p. ej. fondo negro) de un PNG en /public/images.
 *
 * Uso:
 *   node scripts/trim-logo-png.mjs public/images/logoweb.png
 *
 * Guarda copia en *.fullcanvas.png la primera vez y sobrescribe el PNG con trim().
 */
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

const arg = process.argv[2]
const rel = arg && !arg.startsWith('-') ? arg : 'public/images/logoweb.png'
const input = path.isAbsolute(rel) ? rel : path.join(root, rel)

async function main() {
  if (!fs.existsSync(input)) {
    console.error('No existe:', input)
    process.exit(1)
  }

  const dir = path.dirname(input)
  const base = path.basename(input, path.extname(input))
  const backup = path.join(dir, `${base}.fullcanvas.png`)

  const meta = await sharp(input).metadata()
  console.log('Original:', meta.width, 'x', meta.height, meta.format)

  if (!fs.existsSync(backup)) {
    fs.copyFileSync(input, backup)
    console.log('Copia de seguridad:', backup)
  }

  const trimmed = await sharp(input).trim({ threshold: 12 }).png({ compressionLevel: 9 }).toBuffer()
  const tmeta = await sharp(trimmed).metadata()
  console.log('Tras recorte:', tmeta.width, 'x', tmeta.height)

  fs.writeFileSync(input, trimmed)
  console.log('Actualizado:', input)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
