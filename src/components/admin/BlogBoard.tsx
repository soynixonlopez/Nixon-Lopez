'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import { adminUi } from '@/lib/admin-ui'
import { type BlogPostRow, formatBlogDate } from '@/lib/blog'

type Props = {
  posts: BlogPostRow[]
}

export function BlogBoard({ posts: initial }: Props) {
  const router = useRouter()
  const [posts, setPosts] = useState(initial)
  const [busyId, setBusyId] = useState<string | null>(null)

  async function setStatus(post: BlogPostRow, status: 'draft' | 'published') {
    if (status === 'published') {
      if (!post.featured_image_url || !post.featured_image_alt.trim()) {
        alert('Para publicar necesitas imagen destacada y alt text. Ábrelo en Editar.')
        return
      }
      if (!post.excerpt.trim() || !post.content.trim()) {
        alert('Para publicar necesitas extracto y contenido.')
        return
      }
    }
    setBusyId(post.id)
    const res = await fetch(`/api/admin/blog/${post.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    const data = await res.json().catch(() => ({}))
    setBusyId(null)
    if (!res.ok) {
      alert(data.error || 'No se pudo actualizar el estado')
      return
    }
    setPosts((list) =>
      list.map((p) =>
        p.id === post.id
          ? {
              ...p,
              status,
              published_at:
                status === 'published'
                  ? data.post?.published_at || p.published_at || new Date().toISOString()
                  : p.published_at,
            }
          : p,
      ),
    )
    router.refresh()
  }

  async function remove(post: BlogPostRow) {
    const label = post.status === 'published' ? 'publicado' : 'borrador'
    const ok = window.confirm(
      `¿Eliminar definitivamente el artículo ${label} "${post.title}"?\n\nTambién se borrarán sus imágenes del storage.`,
    )
    if (!ok) return

    setBusyId(post.id)
    const res = await fetch(`/api/admin/blog/${post.id}`, { method: 'DELETE' })
    const data = await res.json().catch(() => ({}))
    setBusyId(null)
    if (!res.ok) {
      alert(data.error || 'No se pudo eliminar')
      return
    }
    setPosts((list) => list.filter((p) => p.id !== post.id))
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className={adminUi.pageTitle}>Blog</h1>
          <p className={adminUi.pageSubtitle}>Crea, edita y publica artículos del sitio.</p>
        </div>
        <Link href="/admin/blog/nuevo" className={adminUi.btnPrimary}>
          <Plus className="h-4 w-4" />
          Nuevo artículo
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className={`${adminUi.panel} text-sm text-slate-600`}>
          Aún no hay artículos. Crea el primero para que aparezca en /blog.
        </div>
      ) : (
        <div className={adminUi.tableWrap}>
          <table className="min-w-full text-sm">
            <thead className={adminUi.tableHead}>
              <tr>
                <th className="px-4 py-3">Imagen</th>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className={adminUi.tableRow}>
                  <td className="px-4 py-3">
                    <div className="relative h-12 w-16 overflow-hidden rounded-lg bg-slate-100">
                      {post.featured_image_url ? (
                        <Image
                          src={post.featured_image_url}
                          alt={post.featured_image_alt || post.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">{post.title}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        post.status === 'published'
                          ? 'rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700'
                          : 'rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700'
                      }
                    >
                      {post.status === 'published' ? 'Publicado' : 'Borrador'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatBlogDate(post.published_at || post.updated_at)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{post.category}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <Link
                        href={`/admin/blog/${post.id}/editar`}
                        className={adminUi.btnOutline}
                        title="Editar"
                        aria-label={`Editar ${post.title}`}
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden />
                      </Link>
                      <Link
                        href={`/admin/blog/${post.id}/preview`}
                        className={adminUi.btnOutline}
                        title="Vista previa"
                        aria-label={`Vista previa de ${post.title}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Eye className="h-3.5 w-3.5" aria-hidden />
                      </Link>
                      {post.status === 'published' ? (
                        <button
                          type="button"
                          className={adminUi.btnSecondary}
                          disabled={busyId === post.id}
                          onClick={() => void setStatus(post, 'draft')}
                        >
                          Despublicar
                        </button>
                      ) : (
                        <button
                          type="button"
                          className={adminUi.btnPrimary}
                          disabled={busyId === post.id}
                          onClick={() => void setStatus(post, 'published')}
                        >
                          Publicar
                        </button>
                      )}
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        disabled={busyId === post.id}
                        onClick={() => void remove(post)}
                        title="Eliminar"
                        aria-label={`Eliminar ${post.title}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
