import { NextResponse } from 'next/server'
import sharp from 'sharp'
import { requireAdminApi } from '@/lib/admin-auth-api'
import { BLOG_IMAGE, slugifyBlog } from '@/lib/blog'
import { formatBytes, optimizeBlogImage } from '@/lib/blog-image'
import { createServiceRoleClient } from '@/lib/supabase/service'

export const runtime = 'nodejs'

const ALLOWED = new Set<string>(BLOG_IMAGE.allowedMime)

export async function POST(request: Request) {
  const auth = await requireAdminApi()
  if (!auth.ok) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const form = await request.formData().catch(() => null)
  if (!form) {
    return NextResponse.json({ error: 'Formulario inválido' }, { status: 400 })
  }

  const file = form.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Archivo de imagen requerido' }, { status: 400 })
  }

  if (file.size <= 0 || file.size > BLOG_IMAGE.maxUploadBytes) {
    return NextResponse.json(
      { error: `La imagen debe pesar entre 1 byte y ${formatBytes(BLOG_IMAGE.maxUploadBytes)}` },
      { status: 400 },
    )
  }

  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: 'Formato no permitido. Usa JPG, PNG, WebP, AVIF o GIF.' },
      { status: 400 },
    )
  }

  const slugHint =
    typeof form.get('slug') === 'string'
      ? slugifyBlog(form.get('slug') as string)
      : typeof form.get('title') === 'string'
        ? slugifyBlog(form.get('title') as string)
        : 'post'

  const kind = form.get('kind') === 'inline' ? 'inline' : 'featured'
  const alt =
    typeof form.get('alt') === 'string' ? (form.get('alt') as string).trim().slice(0, 200) : ''

  const input = Buffer.from(await file.arrayBuffer())
  try {
    const meta = await sharp(input, { failOn: 'none' }).metadata()
    if (!meta.format || !['jpeg', 'png', 'webp', 'avif', 'gif'].includes(meta.format)) {
      return NextResponse.json({ error: 'El archivo no es una imagen válida.' }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: 'El archivo no es una imagen válida.' }, { status: 400 })
  }

  let optimized
  try {
    optimized = await optimizeBlogImage(input, { slugHint })
  } catch (e) {
    console.error('blog image optimize', e)
    return NextResponse.json(
      { error: 'No se pudo procesar la imagen. Prueba con JPG o PNG.' },
      { status: 400 },
    )
  }

  const service = createServiceRoleClient()
  const uploader = service ?? auth.supabase
  const path = `${kind}/${slugHint || 'post'}/${optimized.filename}`

  const { error: uploadError } = await uploader.storage
    .from(BLOG_IMAGE.bucket)
    .upload(path, optimized.buffer, {
      contentType: optimized.contentType,
      upsert: false,
      cacheControl: '31536000',
    })

  if (uploadError) {
    return NextResponse.json(
      {
        error:
          uploadError.message.includes('Bucket not found') ||
          uploadError.message.includes('not found')
            ? 'Bucket "blog" no existe. Ejecuta la migración SQL en Supabase.'
            : uploadError.message,
      },
      { status: 500 },
    )
  }

  const {
    data: { publicUrl },
  } = uploader.storage.from(BLOG_IMAGE.bucket).getPublicUrl(path)

  return NextResponse.json({
    ok: true,
    image_url: publicUrl,
    image_path: path,
    width: optimized.width,
    height: optimized.height,
    alt,
    bytes: optimized.bytes,
    bytes_label: formatBytes(optimized.bytes),
  })
}
