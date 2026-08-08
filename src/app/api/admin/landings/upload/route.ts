import { NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/admin-auth-api'
import { LANDING_IMAGE, slugifyLanding } from '@/lib/landing-pages'
import { formatBytes, optimizePortfolioImage } from '@/lib/portfolio-image'
import { createServiceRoleClient } from '@/lib/supabase/service'

export const runtime = 'nodejs'

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

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Solo se permiten imágenes' }, { status: 400 })
  }

  if (file.size > LANDING_IMAGE.maxUploadBytes) {
    return NextResponse.json(
      { error: `La imagen supera ${formatBytes(LANDING_IMAGE.maxUploadBytes)}` },
      { status: 400 }
    )
  }

  const slugHint =
    typeof form.get('slug') === 'string' ? slugifyLanding(form.get('slug') as string) : 'landing'

  const input = Buffer.from(await file.arrayBuffer())
  let optimized
  try {
    optimized = await optimizePortfolioImage(input, { slugHint })
  } catch (e) {
    console.error('landing image optimize', e)
    return NextResponse.json(
      { error: 'No se pudo procesar la imagen. Prueba con JPG o PNG.' },
      { status: 400 }
    )
  }

  const service = createServiceRoleClient()
  const uploader = service ?? auth.supabase
  const path = `${slugHint || 'landing'}/${optimized.filename}`

  const { error: uploadError } = await uploader.storage
    .from(LANDING_IMAGE.bucket)
    .upload(path, optimized.buffer, {
      contentType: optimized.contentType,
      upsert: false,
      cacheControl: '31536000',
    })

  if (uploadError) {
    return NextResponse.json(
      {
        error:
          uploadError.message.includes('Bucket not found') || uploadError.message.includes('not found')
            ? 'Bucket "landings" no existe. Ejecuta la migración SQL en Supabase.'
            : uploadError.message,
      },
      { status: 500 }
    )
  }

  const {
    data: { publicUrl },
  } = uploader.storage.from(LANDING_IMAGE.bucket).getPublicUrl(path)

  return NextResponse.json({
    ok: true,
    image_url: publicUrl,
    image_path: path,
    width: optimized.width,
    height: optimized.height,
    bytes: optimized.bytes,
  })
}
