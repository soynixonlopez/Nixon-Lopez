/**
 * Publica los 3 artículos oficiales en blog_posts + Storage bucket `blog`.
 * Uso: node scripts/seed-official-blog-posts.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'
import sanitizeHtml from 'sanitize-html'
import { ARTICLES_META, article1, article2, article3 } from './blog-seed/articles.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

function loadEnv(filePath) {
  const map = {}
  if (!fs.existsSync(filePath)) return map
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    if (!line || line.startsWith('#')) continue
    const i = line.indexOf('=')
    if (i < 0) continue
    let v = line.slice(i + 1).trim()
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1)
    }
    map[line.slice(0, i).trim()] = v
  }
  return map
}

function isAllowedBlogImageSrc(src) {
  if (!src || src.includes('..') || src.includes('\\')) return false
  if (src.startsWith('/images/')) return true
  try {
    const url = new URL(src)
    if (url.protocol !== 'https:') return false
    if (url.hostname === 'www.nixonlopez.com' || url.hostname === 'nixonlopez.com') {
      return (
        url.pathname.startsWith('/images/') ||
        url.pathname.includes('/storage/v1/object/public/blog/')
      )
    }
    if (url.hostname.endsWith('.supabase.co')) {
      return url.pathname.includes('/storage/v1/object/public/blog/')
    }
    return false
  } catch {
    return false
  }
}

function sanitizeBlogHtml(dirty) {
  return sanitizeHtml(dirty || '', {
    allowedTags: [
      'p',
      'br',
      'strong',
      'em',
      'b',
      'i',
      'u',
      's',
      'blockquote',
      'ul',
      'ol',
      'li',
      'h2',
      'h3',
      'a',
      'img',
      'hr',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
    ],
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      table: ['class'],
      th: ['scope'],
      td: ['colspan', 'rowspan'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: {
      img: ['https'],
      a: ['http', 'https', 'mailto'],
    },
    transformTags: {
      h1: 'h2',
      a: (_tagName, attribs) => {
        const href = (attribs.href || '').trim()
        const lower = href.toLowerCase()
        if (!href || lower.startsWith('javascript:') || lower.startsWith('data:')) {
          return { tagName: 'span', attribs: {} }
        }
        return {
          tagName: 'a',
          attribs: {
            href,
            rel: 'noopener noreferrer',
            ...(attribs.target === '_blank' ? { target: '_blank' } : {}),
          },
        }
      },
      img: (_tagName, attribs) => {
        const src = (attribs.src || '').trim()
        if (!isAllowedBlogImageSrc(src)) {
          return { tagName: 'span', attribs: {} }
        }
        return {
          tagName: 'img',
          attribs: {
            src,
            alt: attribs.alt?.trim() || 'Imagen del artículo',
            loading: 'lazy',
          },
        }
      },
    },
  })
}

async function download(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'nixonlopez-blog-seed/1.0' },
  })
  if (!res.ok) throw new Error(`Download failed ${res.status}: ${url}`)
  return Buffer.from(await res.arrayBuffer())
}

async function optimize(buffer, slugHint) {
  const out = await sharp(buffer, { failOn: 'none' })
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true, fit: 'inside' })
    .webp({ quality: 82, effort: 5 })
    .toBuffer()
  const stamp = Date.now().toString(36)
  const safe = slugHint
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
  return { buffer: out, filename: `${safe || 'post'}-${stamp}.webp` }
}

async function uploadImage(sb, baseUrl, slug, role, sourceUrl) {
  const raw = await download(sourceUrl)
  const { buffer, filename } = await optimize(raw, `${slug}-${role}`)
  const storagePath = `official/${slug}/${role}-${filename}`
  const { error } = await sb.storage.from('blog').upload(storagePath, buffer, {
    contentType: 'image/webp',
    upsert: true,
  })
  if (error) throw new Error(`Upload ${storagePath}: ${error.message}`)
  const publicUrl = `${baseUrl}/storage/v1/object/public/blog/${storagePath}`
  return { path: storagePath, url: publicUrl }
}

function countWords(html) {
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return text.split(' ').filter(Boolean).length
}

function buildContent(meta, urls) {
  if (meta.key === 'a1') {
    return article1({
      featuredInline: urls.inline1,
      workspaceInline: urls.inline2,
    })
  }
  if (meta.key === 'a2') {
    return article2({
      meetingInline: urls.inline1,
      checklistInline: urls.inline2,
    })
  }
  return article3({
    codeInline: urls.inline1,
    compareInline: urls.inline2,
  })
}

async function main() {
  const env = { ...loadEnv(path.join(ROOT, '.env.local')), ...process.env }
  const url = env.NEXT_PUBLIC_SUPABASE_URL
  const key = env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  const sb = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const report = []

  for (const meta of ARTICLES_META) {
    console.log(`\n→ ${meta.slug}`)
    const featured = await uploadImage(sb, url, meta.slug, 'featured', meta.images.featured)
    const inline1 = await uploadImage(sb, url, meta.slug, 'inline1', meta.images.inline1)
    const inline2 = await uploadImage(sb, url, meta.slug, 'inline2', meta.images.inline2)

    const rawHtml = buildContent(meta, {
      inline1: inline1.url,
      inline2: inline2.url,
    })
    const content = sanitizeBlogHtml(rawHtml)
    const words = countWords(content)
    console.log(`  words≈${words}`)

    const row = {
      title: meta.title,
      slug: meta.slug,
      previous_slugs: [],
      excerpt: meta.excerpt,
      content,
      featured_image_url: featured.url,
      featured_image_path: featured.path,
      featured_image_alt: meta.featured_alt,
      status: 'published',
      published_at: meta.published_at,
      author_name: meta.author_name,
      category: meta.category,
      tags: meta.tags,
      seo_title: meta.seo_title,
      seo_description: meta.seo_description,
    }

    const { data: existing } = await sb
      .from('blog_posts')
      .select('id')
      .eq('slug', meta.slug)
      .maybeSingle()

    let id
    if (existing?.id) {
      const { data, error } = await sb
        .from('blog_posts')
        .update(row)
        .eq('id', existing.id)
        .select('id, slug, status, published_at')
        .single()
      if (error) throw new Error(error.message)
      id = data.id
      console.log(`  updated ${id}`)
    } else {
      const { data, error } = await sb
        .from('blog_posts')
        .insert(row)
        .select('id, slug, status, published_at')
        .single()
      if (error) throw new Error(error.message)
      id = data.id
      console.log(`  inserted ${id}`)
    }

    report.push({
      id,
      slug: meta.slug,
      title: meta.title,
      status: 'published',
      words,
      url: `https://www.nixonlopez.com/blog/${meta.slug}`,
      seo_title: meta.seo_title,
      seo_description: meta.seo_description,
      featured_image_url: featured.url,
      featured_image_path: featured.path,
      imageOrigins: meta.imageOrigins,
    })
  }

  const { data: published, error: listErr } = await sb
    .from('blog_posts')
    .select('slug, status, published_at, title')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (listErr) throw new Error(listErr.message)

  const outPath = path.join(ROOT, 'scripts/blog-seed/last-seed-report.json')
  fs.writeFileSync(outPath, JSON.stringify({ report, published }, null, 2))
  console.log('\n✓ Publicados:')
  for (const p of published) {
    console.log(`  - [${p.status}] ${p.published_at} ${p.slug}`)
  }
  console.log(`\nReporte: ${outPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
