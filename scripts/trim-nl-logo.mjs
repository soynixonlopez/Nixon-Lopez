/**
 * Recorta márgenes uniformes (p. ej. fondo negro) de logonlservices.png
 * para que el logo ocupe mejor el encabezado. Ejecutar tras cambiar el PNG fuente.
 */
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const input = path.join(root, 'public', 'images', 'logonlservices.png')
const backup = path.join(root, 'public', 'images', 'logonlservices.fullcanvas.png')

async function main() {
  if (!fs.existsSync(input)) {
    console.error('No existe:', input)
    process.exit(1)
  }

  const meta = await sharp(input).metadata()
  console.log('Original:', meta.width, 'x', meta.height, meta.format)

  if (!fs.existsSync(backup)) {
    fs.copyFileSync(input, backup)
    console.log('Copia de seguridad:', backup)
  }

  // trim() elimina píxeles del borde iguales al de la esquina superior izquierda
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
