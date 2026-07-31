/**
 * Optimiza el banner de correos masterclass (600px JPEG para clientes de email).
 * Ejecutar: pnpm run optimize-email-banner
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const src = path.join(root, 'public/images/emails/email_banner.png')

if (!fs.existsSync(src)) {
  console.error('No existe:', src)
  process.exit(1)
}

const meta = await sharp(src).metadata()
const aspect = (meta.height ?? 724) / (meta.width ?? 2172)
const width = 600
const height = Math.round(width * aspect)

const jpgPath = path.join(root, 'public/images/emails/email_banner.jpg')
const jpg2xPath = path.join(root, 'public/images/emails/email_banner@2x.jpg')

const jpg = await sharp(src)
  .resize({ width, withoutEnlargement: true })
  .jpeg({ quality: 82, mozjpeg: true })
  .toBuffer()

const jpg2x = await sharp(src)
  .resize({ width: 1200, withoutEnlargement: true })
  .jpeg({ quality: 78, mozjpeg: true })
  .toBuffer()

fs.writeFileSync(jpgPath, jpg)
fs.writeFileSync(jpg2xPath, jpg2x)

const pngSize = fs.statSync(src).size
console.log(`email_banner.png  ${(pngSize / 1024).toFixed(0)} KB (origen)`)
console.log(`email_banner.jpg  ${(jpg.length / 1024).toFixed(0)} KB (${width}×${height})`)
console.log(`email_banner@2x.jpg ${(jpg2x.length / 1024).toFixed(0)} KB`)
