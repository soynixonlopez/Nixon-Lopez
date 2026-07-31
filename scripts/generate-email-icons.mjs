/**
 * Genera iconos PNG para correos masterclass desde Lucide (misma librería del sitio).
 * Ejecutar: pnpm run generate-email-icons
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { BriefcaseBusiness, Rocket, Sparkles } from 'lucide-react'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '../public/images/emails')

const BRAND = '#1e3a5f'
const ICON_WHITE = '#ffffff'
const SIZE = 48
const ICON_SIZE = 22

/** @param {import('lucide-react').LucideIcon} Icon */
function lucideChildren(Icon) {
  const markup = renderToStaticMarkup(
    React.createElement(Icon, {
      size: ICON_SIZE,
      color: ICON_WHITE,
      strokeWidth: 2.25,
    }),
  )
  return markup.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
}

/** @param {import('lucide-react').LucideIcon} Icon */
function badgeSvg(Icon) {
  const offset = (SIZE - ICON_SIZE) / 2
  const inner = lucideChildren(Icon)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <circle cx="24" cy="24" r="24" fill="${BRAND}"/>
  <g transform="translate(${offset}, ${offset})" fill="none" stroke="${ICON_WHITE}" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round">${inner}</g>
</svg>`
}

const icons = [
  { name: 'icon-ai', Icon: Sparkles, alt: 'Inteligencia Artificial' },
  { name: 'icon-rocket', Icon: Rocket, alt: 'Rápido' },
  { name: 'icon-professional', Icon: BriefcaseBusiness, alt: 'Profesional' },
]

fs.mkdirSync(outDir, { recursive: true })

for (const { name, Icon } of icons) {
  const svg = badgeSvg(Icon)
  const svgPath = path.join(outDir, `${name}.svg`)
  const pngPath = path.join(outDir, `${name}.png`)
  const png2xPath = path.join(outDir, `${name}@2x.png`)

  fs.writeFileSync(svgPath, svg)

  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer()
  const png2x = await sharp(Buffer.from(svg))
    .resize(96, 96)
    .png({ compressionLevel: 9 })
    .toBuffer()

  fs.writeFileSync(pngPath, png)
  fs.writeFileSync(png2xPath, png2x)

  console.log(`${name}.png  ${png.length} bytes`)
  console.log(`${name}@2x.png ${png2x.length} bytes`)
}

console.log('Iconos Lucide generados en public/images/emails/')
