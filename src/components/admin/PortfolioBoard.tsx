'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  ArrowUpDown,
  Eye,
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import { adminUi } from '@/lib/admin-ui'
import {
  PORTFOLIO_CATEGORY_TONES,
  PORTFOLIO_IMAGE,
  slugifyPortfolio,
  type PortfolioCategoryTone,
  type PortfolioProjectRow,
} from '@/lib/portfolio'

const TONE_LABELS: Record<PortfolioCategoryTone, string> = {
  blue: 'Azul',
  green: 'Verde',
  purple: 'Morado',
  orange: 'Naranja',
  pink: 'Rosa',
}

type Draft = {
  id?: string
  company: string
  category: string
  category_tone: PortfolioCategoryTone
  description: string
  demo_url: string
  slug: string
  image_url: string
  image_path: string
  sort_order: number
  is_published: boolean
  show_on_home: boolean
}

const emptyDraft = (): Draft => ({
  company: '',
  category: '',
  category_tone: 'blue',
  description: '',
  demo_url: 'https://',
  slug: '',
  image_url: '',
  image_path: '',
  sort_order: 0,
  is_published: true,
  show_on_home: true,
})

function rowToDraft(row: PortfolioProjectRow): Draft {
  return {
    id: row.id,
    company: row.company,
    category: row.category,
    category_tone: row.category_tone,
    description: row.description,
    demo_url: row.demo_url,
    slug: row.slug,
    image_url: row.image_url,
    image_path: row.image_path ?? '',
    sort_order: row.sort_order,
    is_published: row.is_published,
    show_on_home: row.show_on_home,
  }
}

function CarouselPreview({ src, company }: { src: string; company: string }) {
  if (!src) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
        Sube una imagen para ver cómo se verá expandida y achicada en el carrusel.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Vista previa del carrusel
      </p>
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-[150px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover object-top" />
          </div>
          <div className="p-2.5">
            <p className="truncate text-[11px] font-bold text-slate-900">{company || 'Proyecto'}</p>
            <p className="mt-0.5 text-[10px] text-slate-500">Achicada</p>
          </div>
        </div>
        <div className="w-[300px] max-w-full overflow-hidden rounded-2xl border border-purple-200 bg-white shadow-md">
          <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              className="absolute inset-0 h-full w-full scale-105 object-cover object-top"
            />
          </div>
          <div className="p-3">
            <p className="truncate text-sm font-bold text-slate-900">{company || 'Proyecto'}</p>
            <p className="mt-0.5 text-xs text-slate-500">Expandida (activa)</p>
          </div>
        </div>
      </div>
      <p className="text-xs leading-relaxed text-slate-500">
        El sistema ajusta a <strong>{PORTFOLIO_IMAGE.aspectLabel}</strong> (
        {PORTFOLIO_IMAGE.width}×{PORTFOLIO_IMAGE.height}) con recorte superior. Coloca logo, persona o
        UI clave arriba y al centro: en la tarjeta achicada solo se ve esa franja.
      </p>
    </div>
  )
}

export function PortfolioBoard({ projects }: { projects: PortfolioProjectRow[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Draft>(emptyDraft)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadMeta, setUploadMeta] = useState<string | null>(null)
  const [localPreview, setLocalPreview] = useState<string | null>(null)

  const sorted = useMemo(
    () => [...projects].sort((a, b) => a.sort_order - b.sort_order || a.company.localeCompare(b.company)),
    [projects],
  )

  function openCreate() {
    setDraft({
      ...emptyDraft(),
      sort_order: projects.length ? Math.max(...projects.map((p) => p.sort_order)) + 1 : 0,
    })
    setLocalPreview(null)
    setUploadMeta(null)
    setError(null)
    setOpen(true)
  }

  function openEdit(row: PortfolioProjectRow) {
    setDraft(rowToDraft(row))
    setLocalPreview(null)
    setUploadMeta(null)
    setError(null)
    setOpen(true)
  }

  function closeModal() {
    setOpen(false)
    setError(null)
    setLocalPreview(null)
  }

  async function onPickFile(file: File | null) {
    if (!file) return
    setError(null)
    setUploadMeta(null)

    const objectUrl = URL.createObjectURL(file)
    setLocalPreview(objectUrl)

    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('company', draft.company || file.name)
      form.append('slug', draft.slug || slugifyPortfolio(draft.company || file.name))

      const res = await fetch('/api/admin/portfolio/upload', {
        method: 'POST',
        body: form,
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Error al subir la imagen')
        return
      }

      setDraft((d) => ({
        ...d,
        image_url: data.image_url,
        image_path: data.image_path,
      }))
      setLocalPreview(data.image_url)
      setUploadMeta(
        `Optimizada: ${data.width}×${data.height} · ${data.bytes_label} (antes ${data.original_bytes_label})`,
      )
    } catch {
      setError('No se pudo subir la imagen')
    } finally {
      setUploading(false)
    }
  }

  async function save() {
    setSaving(true)
    setError(null)
    const payload = {
      ...draft,
      slug: draft.slug || slugifyPortfolio(draft.company),
      image_path: draft.image_path || null,
    }

    try {
      const res = await fetch(
        draft.id ? `/api/admin/portfolio/${draft.id}` : '/api/admin/portfolio',
        {
          method: draft.id ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      )
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'No se pudo guardar')
        return
      }
      closeModal()
      router.refresh()
    } catch {
      setError('Error de red al guardar')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string, company: string) {
    if (!confirm(`¿Eliminar “${company}” del portafolio web?`)) return
    const res = await fetch(`/api/admin/portfolio/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      alert(data.error || 'No se pudo eliminar')
      return
    }
    router.refresh()
  }

  const previewSrc = localPreview || draft.image_url

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          {sorted.length} proyecto{sorted.length === 1 ? '' : 's'} en portafolio. Si no hay ninguno
          publicado en Home, la web usa el listado estático de respaldo.
        </p>
        <button type="button" onClick={openCreate} className={adminUi.btnPrimary}>
          <Plus className="h-4 w-4" aria-hidden />
          Agregar proyecto
        </button>
      </div>

      <div className={`${adminUi.card} overflow-hidden`}>
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className={adminUi.tableHead}>
              <tr>
                <th className="px-4 py-3">Orden</th>
                <th className="px-4 py-3">Proyecto</th>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3">Home</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p) => (
                <tr key={p.id} className={adminUi.tableRow}>
                  <td className="px-4 py-3 text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <ArrowUpDown className="h-3.5 w-3.5" aria-hidden />
                      {p.sort_order}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-20 overflow-hidden rounded-lg bg-slate-100">
                        <Image
                          src={p.image_url}
                          alt=""
                          fill
                          className="object-cover object-top"
                          sizes="80px"
                          unoptimized={p.image_url.includes('supabase')}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{p.company}</p>
                        <p className="text-xs text-slate-500 truncate">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.category}</td>
                  <td className="px-4 py-3">
                    {p.show_on_home ? (
                      <span className="text-emerald-600 text-xs font-medium">Sí</span>
                    ) : (
                      <span className="text-slate-400 text-xs">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {p.is_published ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                        <Eye className="h-3.5 w-3.5" />
                        Publicado
                      </span>
                    ) : (
                      <span className="text-xs text-amber-700">Borrador</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(p)}
                        className={adminUi.btnOutline}
                        aria-label={`Editar ${p.company}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(p.id, p.company)}
                        className="inline-flex items-center justify-center rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        aria-label={`Eliminar ${p.company}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!sorted.length && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                    Aún no hay proyectos. Agrega el primero para que aparezca en el Home.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 p-3 md:hidden">
          {sorted.map((p) => (
            <div key={p.id} className={adminUi.mobileCard}>
              <div className="flex gap-3">
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  <Image
                    src={p.image_url}
                    alt=""
                    fill
                    className="object-cover object-top"
                    sizes="96px"
                    unoptimized={p.image_url.includes('supabase')}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900">{p.company}</p>
                  <p className="text-xs text-slate-500">{p.category}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Orden {p.sort_order} · {p.is_published ? 'Publicado' : 'Borrador'}
                    {p.show_on_home ? ' · Home' : ''}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={() => openEdit(p)} className={`${adminUi.btnSecondary} flex-1`}>
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => remove(p.id, p.company)}
                  className="rounded-xl border border-red-200 px-3 py-2 text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 sm:items-center sm:p-4">
          <div
            className="max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl border border-slate-200 bg-white shadow-xl sm:rounded-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="portfolio-modal-title"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
              <h2 id="portfolio-modal-title" className="text-lg font-bold text-slate-900">
                {draft.id ? 'Editar proyecto' : 'Nuevo proyecto del portafolio'}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 px-5 py-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-1.5 sm:col-span-2">
                  <span className="text-sm font-medium text-slate-700">Nombre / empresa</span>
                  <input
                    className={adminUi.input}
                    value={draft.company}
                    onChange={(e) => {
                      const company = e.target.value
                      setDraft((d) => ({
                        ...d,
                        company,
                        slug: d.id ? d.slug : slugifyPortfolio(company),
                      }))
                    }}
                    placeholder="Aquarumbos"
                  />
                </label>

                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">Categoría</span>
                  <input
                    className={adminUi.input}
                    value={draft.category}
                    onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
                    placeholder="Plataforma educativa"
                  />
                </label>

                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">Color de categoría</span>
                  <select
                    className={adminUi.input}
                    value={draft.category_tone}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        category_tone: e.target.value as PortfolioCategoryTone,
                      }))
                    }
                  >
                    {PORTFOLIO_CATEGORY_TONES.map((tone) => (
                      <option key={tone} value={tone}>
                        {TONE_LABELS[tone]}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block space-y-1.5 sm:col-span-2">
                  <span className="text-sm font-medium text-slate-700">Descripción corta</span>
                  <textarea
                    className={`${adminUi.input} min-h-[88px]`}
                    value={draft.description}
                    onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                    placeholder="Una línea sobre el resultado del proyecto..."
                  />
                </label>

                <label className="block space-y-1.5 sm:col-span-2">
                  <span className="text-sm font-medium text-slate-700">URL del proyecto en vivo</span>
                  <input
                    className={adminUi.input}
                    value={draft.demo_url}
                    onChange={(e) => setDraft((d) => ({ ...d, demo_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </label>

                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">Slug</span>
                  <input
                    className={adminUi.input}
                    value={draft.slug}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, slug: slugifyPortfolio(e.target.value) }))
                    }
                  />
                </label>

                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">Orden en carrusel</span>
                  <input
                    type="number"
                    className={adminUi.input}
                    value={draft.sort_order}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, sort_order: Number.parseInt(e.target.value, 10) || 0 }))
                    }
                  />
                </label>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Imagen del carrusel</p>
                    <p className="text-xs text-slate-500">
                      Recomendado {PORTFOLIO_IMAGE.width}×{PORTFOLIO_IMAGE.height} (
                      {PORTFOLIO_IMAGE.aspectLabel}). Se comprime a WebP al subir.
                    </p>
                  </div>
                  <label className={`${adminUi.btnSecondary} cursor-pointer`}>
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ImagePlus className="h-4 w-4" />
                    )}
                    {uploading ? 'Optimizando…' : 'Subir imagen'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploading}
                      onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
                    />
                  </label>
                </div>
                {uploadMeta && <p className="text-xs font-medium text-emerald-700">{uploadMeta}</p>}
                <CarouselPreview src={previewSrc} company={draft.company} />
              </div>

              <div className="flex flex-wrap gap-4">
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={draft.is_published}
                    onChange={(e) => setDraft((d) => ({ ...d, is_published: e.target.checked }))}
                  />
                  Publicado
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={draft.show_on_home}
                    onChange={(e) => setDraft((d) => ({ ...d, show_on_home: e.target.checked }))}
                  />
                  Mostrar en Home
                </label>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>

            <div className="sticky bottom-0 flex justify-end gap-2 border-t border-slate-200 bg-white px-5 py-4">
              <button type="button" onClick={closeModal} className={adminUi.btnSecondary}>
                Cancelar
              </button>
              <button
                type="button"
                onClick={save}
                disabled={saving || uploading || !draft.image_url}
                className={adminUi.btnPrimary}
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {draft.id ? 'Guardar cambios' : 'Publicar en la web'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
