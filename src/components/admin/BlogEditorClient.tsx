'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Eye, Loader2, Save, Upload } from 'lucide-react'
import { adminUi } from '@/lib/admin-ui'
import {
  BLOG_CATEGORIES,
  type BlogPostRow,
  type BlogStatus,
  slugifyBlog,
} from '@/lib/blog'
import { BlogRichTextEditor } from '@/components/admin/BlogRichTextEditor'

type Props = {
  post?: BlogPostRow | null
}

export function BlogEditorClient({ post }: Props) {
  const router = useRouter()
  const isEdit = Boolean(post?.id)

  const [title, setTitle] = useState(post?.title ?? '')
  const [slug, setSlug] = useState(post?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug))
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '')
  const [content, setContent] = useState(post?.content ?? '')
  const [category, setCategory] = useState(post?.category ?? BLOG_CATEGORIES[0])
  const [tagsInput, setTagsInput] = useState((post?.tags ?? []).join(', '))
  const [authorName, setAuthorName] = useState(post?.author_name ?? 'Nixon López')
  const [status, setStatus] = useState<BlogStatus>(post?.status ?? 'draft')
  const [featuredUrl, setFeaturedUrl] = useState(post?.featured_image_url ?? '')
  const [featuredPath, setFeaturedPath] = useState(post?.featured_image_path ?? '')
  const [featuredAlt, setFeaturedAlt] = useState(post?.featured_image_alt ?? '')
  const [seoTitle, setSeoTitle] = useState(post?.seo_title ?? '')
  const [seoDescription, setSeoDescription] = useState(post?.seo_description ?? '')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const canPublish = useMemo(() => {
    return Boolean(
      title.trim() &&
        slug.trim() &&
        excerpt.trim() &&
        content.trim() &&
        featuredUrl &&
        featuredAlt.trim(),
    )
  }, [title, slug, excerpt, content, featuredUrl, featuredAlt])

  function onTitleChange(value: string) {
    setTitle(value)
    if (!slugTouched) setSlug(slugifyBlog(value))
  }

  async function uploadFeatured(file: File) {
    setUploading(true)
    setError('')
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('kind', 'featured')
      form.append('slug', slug || title || 'post')
      form.append('alt', featuredAlt)
      const res = await fetch('/api/admin/blog/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al subir')
      setFeaturedUrl(data.image_url)
      setFeaturedPath(data.image_path)
      setMessage('Imagen destacada subida')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo subir la imagen')
    } finally {
      setUploading(false)
    }
  }

  async function save(nextStatus?: BlogStatus) {
    setSaving(true)
    setError('')
    setMessage('')

    const cleanSlug = slugifyBlog(slug || title)
    if (!title.trim()) {
      setError('El título es obligatorio')
      setSaving(false)
      return
    }
    if (!cleanSlug) {
      setError('El slug no es válido')
      setSaving(false)
      return
    }

    const targetStatus = nextStatus ?? status
    if (targetStatus === 'published') {
      if (!featuredAlt.trim()) {
        setError('La imagen destacada necesita un texto alternativo (alt) descriptivo.')
        setSaving(false)
        return
      }
      if (!featuredUrl) {
        setError('Agrega una imagen destacada antes de publicar.')
        setSaving(false)
        return
      }
      if (!excerpt.trim()) {
        setError('El extracto es obligatorio para publicar.')
        setSaving(false)
        return
      }
    }

    const payload = {
      title: title.trim(),
      slug: cleanSlug,
      excerpt: excerpt.trim(),
      content,
      featured_image_url: featuredUrl || null,
      featured_image_path: featuredPath || null,
      featured_image_alt: featuredAlt.trim(),
      status: targetStatus,
      author_name: authorName.trim() || 'Nixon López',
      category,
      tags: tagsInput,
      seo_title: seoTitle.trim() || null,
      seo_description: seoDescription.trim() || null,
    }

    try {
      if (isEdit && post?.id) {
        const res = await fetch(`/api/admin/blog/${post.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || 'No se pudo guardar')
        setStatus(targetStatus)
        setSlug(cleanSlug)
        setMessage(targetStatus === 'published' ? 'Artículo publicado' : 'Cambios guardados')
        router.refresh()
      } else {
        const res = await fetch('/api/admin/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || 'No se pudo crear')
        setMessage('Artículo creado')
        router.replace(`/admin/blog/${data.id}/editar`)
        router.refresh()
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className={adminUi.pageTitle}>{isEdit ? 'Editar artículo' : 'Nuevo artículo'}</h1>
          <p className={adminUi.pageSubtitle}>
            Borradores no son públicos. Publicar actualiza el sitio y el sitemap.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isEdit && post?.id ? (
            <Link
              href={`/admin/blog/${post.id}/preview`}
              className={adminUi.btnSecondary}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Eye className="h-4 w-4" aria-hidden />
              Vista previa
            </Link>
          ) : null}
          <button
            type="button"
            className={adminUi.btnSecondary}
            disabled={saving}
            onClick={() => void save('draft')}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Guardar borrador
          </button>
          <button
            type="button"
            className={adminUi.btnPrimary}
            disabled={saving || !canPublish}
            onClick={() => void save('published')}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Publicar
          </button>
        </div>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}
      {message ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700">Título</span>
            <input
              className={adminUi.input}
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="¿Cuánto cuesta una página web en Panamá en 2026?"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700">Slug</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">/blog/</span>
              <input
                className={adminUi.input}
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true)
                  setSlug(slugifyBlog(e.target.value))
                }}
              />
            </div>
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700">Extracto</span>
            <textarea
              className={`${adminUi.input} min-h-[88px]`}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              maxLength={320}
              placeholder="Resumen corto para listados y meta description de respaldo."
            />
          </label>

          <div className="space-y-1.5">
            <span className="text-sm font-medium text-slate-700">Contenido</span>
            <BlogRichTextEditor
              value={content}
              onChange={setContent}
              slugHint={slug || title || 'post'}
              disabled={saving}
            />
          </div>
        </div>

        <aside className="space-y-4">
          <div className={`${adminUi.panel} space-y-3`}>
            <p className="text-sm font-semibold text-slate-900">Publicación</p>
            <p className="text-xs text-slate-500">
              Estado actual:{' '}
              <span className="font-semibold text-slate-800">
                {status === 'published' ? 'Publicado' : 'Borrador'}
              </span>
            </p>
            {status === 'published' ? (
              <button
                type="button"
                className={adminUi.btnOutline}
                disabled={saving}
                onClick={() => void save('draft')}
              >
                Despublicar
              </button>
            ) : null}
          </div>

          <div className={`${adminUi.panel} space-y-3`}>
            <p className="text-sm font-semibold text-slate-900">Imagen destacada</p>
            {featuredUrl ? (
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-100">
                <Image src={featuredUrl} alt={featuredAlt || title || 'Destacada'} fill className="object-cover" sizes="320px" />
              </div>
            ) : (
              <div className="flex aspect-[16/10] items-center justify-center rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
                Sin imagen
              </div>
            )}
            <label className="block space-y-1">
              <span className="text-xs font-medium text-slate-600">Alt text (requerido para publicar)</span>
              <input
                className={adminUi.input}
                value={featuredAlt}
                onChange={(e) => setFeaturedAlt(e.target.value)}
                placeholder="Describe la imagen de forma natural"
              />
            </label>
            <label className={`${adminUi.btnSecondary} cursor-pointer`}>
              <Upload className="h-4 w-4" />
              {uploading ? 'Subiendo…' : 'Subir imagen'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) void uploadFeatured(file)
                  e.target.value = ''
                }}
              />
            </label>
          </div>

          <div className={`${adminUi.panel} space-y-3`}>
            <label className="block space-y-1">
              <span className="text-xs font-medium text-slate-600">Categoría</span>
              <select className={adminUi.input} value={category} onChange={(e) => setCategory(e.target.value)}>
                {BLOG_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-medium text-slate-600">Tags (separados por coma)</span>
              <input
                className={adminUi.input}
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Panamá, Next.js, SEO"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-medium text-slate-600">Autor</span>
              <input className={adminUi.input} value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
            </label>
          </div>

          <div className={`${adminUi.panel} space-y-3`}>
            <p className="text-sm font-semibold text-slate-900">SEO</p>
            <label className="block space-y-1">
              <span className="text-xs font-medium text-slate-600">SEO title</span>
              <input
                className={adminUi.input}
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Si vacío: título + marca"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-medium text-slate-600">SEO description</span>
              <textarea
                className={`${adminUi.input} min-h-[80px]`}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Si vacío: usa el extracto"
              />
            </label>
          </div>
        </aside>
      </div>
    </div>
  )
}
