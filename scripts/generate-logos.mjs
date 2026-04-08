/**
 * Genera SVG en public/logos desde simple-icons (colores oficiales).
 * Ejecutar: pnpm run generate-logos
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import * as SimpleIcons from 'simple-icons'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Igual que simple-icons SDK: slug → siReact, siNextdotjs, … */
function slugToVariableName(slug) {
  return `si${slug[0].toUpperCase()}${slug.slice(1)}`
}
const outDir = path.join(__dirname, '..', 'public', 'logos')

/** [nombreArchivo, slug en simple-icons] */
const entries = [
  ['react.svg', 'react'],
  ['nextdotjs.svg', 'nextdotjs'],
  ['typescript.svg', 'typescript'],
  ['nodedotjs.svg', 'nodedotjs'],
  ['python.svg', 'python'],
  ['javascript.svg', 'javascript'],
  ['tailwindcss.svg', 'tailwindcss'],
  ['html5.svg', 'html5'],
  ['css.svg', 'css'],
  ['bootstrap.svg', 'bootstrap'],
  ['docker.svg', 'docker'],
  ['supabase.svg', 'supabase'],
  ['mongodb.svg', 'mongodb'],
  ['postgresql.svg', 'postgresql'],
  ['firebase.svg', 'firebase'],
  ['flutter.svg', 'flutter'],
  ['androidstudio.svg', 'androidstudio'],
  ['kotlin.svg', 'kotlin'],
  ['swift.svg', 'swift'],
  ['xcode.svg', 'xcode'],
  ['n8n.svg', 'n8n'],
  ['zapier.svg', 'zapier'],
  ['huggingface.svg', 'huggingface'],
  ['instagram.svg', 'instagram'],
  ['facebook.svg', 'facebook'],
  ['tiktok.svg', 'tiktok'],
  ['youtube.svg', 'youtube'],
  ['whatsapp.svg', 'whatsapp'],
  ['github.svg', 'github'],
  ['framer.svg', 'framer'],
  ['git.svg', 'git'],
  ['figma.svg', 'figma'],
  ['vercel.svg', 'vercel'],
  ['langchain.svg', 'langchain'],
  ['prisma.svg', 'prisma'],
  ['graphql.svg', 'graphql'],
  ['stripe.svg', 'stripe'],
]

function writeSvg(file, slug) {
  const varName = slugToVariableName(slug)
  const icon = SimpleIcons[varName]
  if (!icon) {
    console.error('No encontrado:', slug, '→', varName)
    return false
  }
  const title = icon.title.replace(/&/g, '&amp;')
  const fill =
    slug === 'github'
      ? '#ffffff'
      : `#${icon.hex}`
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-hidden="true"><title>${title}</title><path fill="${fill}" d="${icon.path}"/></svg>
`
  fs.writeFileSync(path.join(outDir, file), svg, 'utf8')
  return true
}

fs.mkdirSync(outDir, { recursive: true })

let ok = 0
for (const [file, slug] of entries) {
  if (writeSvg(file, slug)) ok++
}
console.log(`Listo: ${ok}/${entries.length} logos en ${outDir}`)
