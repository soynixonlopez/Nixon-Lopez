'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ExternalLink, Plus, Save, Trash2, Upload } from 'lucide-react'
import {
  emptyLandingContent,
  emptyLandingPayment,
  normalizeLandingContent,
  normalizeLandingPayment,
  slugifyLanding,
  type LandingContent,
  type LandingPageRow,
  type LandingPayment,
  type LandingPaymentMethod,
} from '@/lib/landing-pages'
import { createClient } from '@/lib/supabase/client'

type Props = {
  landing?: LandingPageRow | null
}

const METHODS: Array<{ id: LandingPaymentMethod; label: string }> = [
  { id: 'hotmart', label: 'Hotmart' },
  { id: 'paguelo_facil', label: 'Paguelo Fácil' },
  { id: 'cubo', label: 'Cubo' },
  { id: 'yappy', label: 'Yappy' },
  { id: 'bank_transfer', label: 'Transferencia bancaria' },
  { id: 'custom', label: 'Instrucciones personalizadas' },
]

export function LandingEditorClient({ landing }: Props) {
  const router = useRouter()
  const isNew = !landing
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<'hero' | 'about' | null>(null)
  const [title, setTitle] = useState(landing?.title ?? 'Nueva landing')
  const [slug, setSlug] = useState(landing?.slug ?? '')
  const [isPublished, setIsPublished] = useState(landing?.is_published ?? false)
  const [priceAmount, setPriceAmount] = useState(String(landing?.price_amount ?? 90))
  const [priceLabel, setPriceLabel] = useState(landing?.price_label ?? 'Inversión')
  const [priceNote, setPriceNote] = useState(landing?.price_note ?? '')
  const [seoTitle, setSeoTitle] = useState(landing?.seo_title ?? '')
  const [seoDescription, setSeoDescription] = useState(landing?.seo_description ?? '')
  const [content, setContent] = useState<LandingContent>(
    landing ? normalizeLandingContent(landing.content) : emptyLandingContent()
  )
  const [payment, setPayment] = useState<LandingPayment>(
    landing ? normalizeLandingPayment(landing.payment) : emptyLandingPayment()
  )

  function patchContent<K extends keyof LandingContent>(key: K, value: LandingContent[K]) {
    setContent((current) => ({ ...current, [key]: value }))
  }

  function patchPayment<K extends keyof LandingPayment>(key: K, value: LandingPayment[K]) {
    setPayment((current) => ({ ...current, [key]: value }))
  }

  async function uploadImage(kind: 'hero' | 'about', file: File) {
    setUploading(kind)
    const form = new FormData()
    form.set('file', file)
    form.set('slug', slug || slugifyLanding(title) || 'landing')
    const res = await fetch('/api/admin/landings/upload', { method: 'POST', body: form })
    const data = await res.json().catch(() => ({}))
    setUploading(null)
    if (!res.ok) {
      alert(data.error || 'No se pudo subir la imagen')
      return
    }
    if (kind === 'hero') {
      patchContent('hero_image_url', data.image_url)
      patchContent('hero_image_path', data.image_path)
    } else {
      patchContent('about_image_url', data.image_url)
      patchContent('about_image_path', data.image_path)
    }
  }

  async function save() {
    const nextSlug = slugifyLanding(slug || title)
    if (!nextSlug) {
      alert('Define un slug válido')
      return
    }
    setSaving(true)
    const supabase = createClient()
    const payload = {
      title: title.trim() || 'Landing',
      slug: nextSlug,
      is_published: isPublished,
      price_amount: Number.parseFloat(priceAmount) || 0,
      price_label: priceLabel.trim() || 'Inversión',
      price_note: priceNote.trim() || null,
      content,
      payment,
      seo_title: seoTitle.trim() || null,
      seo_description: seoDescription.trim() || null,
    }

    if (isNew) {
      const { data, error } = await supabase.from('landing_pages').insert(payload).select('id').single()
      setSaving(false)
      if (error || !data) {
        alert(error?.message ?? 'No se pudo crear')
        return
      }
      router.push(`/admin/landings/${(data as { id: string }).id}`)
      router.refresh()
      return
    }

    const { error } = await supabase.from('landing_pages').update(payload).eq('id', landing!.id)
    setSaving(false)
    if (error) {
      alert(error.message)
      return
    }
    setSlug(nextSlug)
    router.refresh()
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isNew ? 'Nueva landing' : 'Editar landing'}
          </h1>
          <p className="text-sm text-slate-500">
            La estructura se genera sola. Solo edita textos, imágenes, precio y pagos.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!isNew && isPublished ? (
            <Link
              href={`/l/${slug || landing!.slug}`}
              target="_blank"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
            >
              <ExternalLink className="h-4 w-4" />
              Ver pública
            </Link>
          ) : null}
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </div>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">General</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="text-xs text-slate-400">Título interno</span>
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (isNew && !slug) setSlug(slugifyLanding(e.target.value))
              }}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>
          <label>
            <span className="text-xs text-slate-400">Slug URL (/l/...)</span>
            <input
              value={slug}
              onChange={(e) => setSlug(slugifyLanding(e.target.value))}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono text-sm"
            />
          </label>
          <label className="flex items-end gap-2 pb-2">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            <span className="text-sm font-medium text-slate-800">Publicada</span>
          </label>
          <label>
            <span className="text-xs text-slate-400">Precio (USD)</span>
            <input
              type="number"
              min={0}
              step="0.01"
              value={priceAmount}
              onChange={(e) => setPriceAmount(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>
          <label>
            <span className="text-xs text-slate-400">Etiqueta del precio</span>
            <input
              value={priceLabel}
              onChange={(e) => setPriceLabel(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>
          <label className="sm:col-span-2">
            <span className="text-xs text-slate-400">Nota bajo el precio</span>
            <input
              value={priceNote}
              onChange={(e) => setPriceNote(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Hero</h2>
        <label className="block">
          <span className="text-xs text-slate-400">Eyebrow</span>
          <input
            value={content.eyebrow}
            onChange={(e) => patchContent('eyebrow', e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-xs text-slate-400">Headline</span>
          <input
            value={content.headline}
            onChange={(e) => patchContent('headline', e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-xs text-slate-400">Subtítulo</span>
          <textarea
            value={content.subheadline}
            onChange={(e) => patchContent('subheadline', e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label>
            <span className="text-xs text-slate-400">CTA principal</span>
            <input
              value={content.cta_primary}
              onChange={(e) => patchContent('cta_primary', e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>
          <label>
            <span className="text-xs text-slate-400">CTA secundario</span>
            <input
              value={content.cta_secondary}
              onChange={(e) => patchContent('cta_secondary', e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>
        </div>
        <ImageField
          label="Imagen hero"
          url={content.hero_image_url}
          uploading={uploading === 'hero'}
          onUpload={(file) => uploadImage('hero', file)}
          onClear={() => {
            patchContent('hero_image_url', '')
            patchContent('hero_image_path', '')
          }}
        />
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Beneficios</h2>
          <button
            type="button"
            onClick={() =>
              patchContent('benefits', [
                ...content.benefits,
                {
                  id: crypto.randomUUID(),
                  title: 'Nuevo beneficio',
                  description: '',
                },
              ])
            }
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand"
          >
            <Plus className="h-4 w-4" />
            Agregar
          </button>
        </div>
        <label className="block">
          <span className="text-xs text-slate-400">Título de sección</span>
          <input
            value={content.benefits_title}
            onChange={(e) => patchContent('benefits_title', e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </label>
        <div className="space-y-3">
          {content.benefits.map((benefit, index) => (
            <div key={benefit.id} className="rounded-xl border border-slate-200 p-3">
              <div className="mb-2 flex justify-between gap-2">
                <p className="text-xs font-semibold text-slate-500">Beneficio {index + 1}</p>
                <button
                  type="button"
                  onClick={() =>
                    patchContent(
                      'benefits',
                      content.benefits.filter((item) => item.id !== benefit.id)
                    )
                  }
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <input
                value={benefit.title}
                onChange={(e) =>
                  patchContent(
                    'benefits',
                    content.benefits.map((item) =>
                      item.id === benefit.id ? { ...item, title: e.target.value } : item
                    )
                  )
                }
                className="mb-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                placeholder="Título"
              />
              <textarea
                value={benefit.description}
                onChange={(e) =>
                  patchContent(
                    'benefits',
                    content.benefits.map((item) =>
                      item.id === benefit.id ? { ...item, description: e.target.value } : item
                    )
                  )
                }
                rows={2}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                placeholder="Descripción"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Sobre / oferta</h2>
        <label className="block">
          <span className="text-xs text-slate-400">Título</span>
          <input
            value={content.about_title}
            onChange={(e) => patchContent('about_title', e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-xs text-slate-400">Texto</span>
          <textarea
            value={content.about_body}
            onChange={(e) => patchContent('about_body', e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </label>
        <ImageField
          label="Imagen secundaria"
          url={content.about_image_url}
          uploading={uploading === 'about'}
          onUpload={(file) => uploadImage('about', file)}
          onClear={() => {
            patchContent('about_image_url', '')
            patchContent('about_image_path', '')
          }}
        />
        <label className="block">
          <span className="text-xs text-slate-400">Título oferta</span>
          <input
            value={content.offer_title}
            onChange={(e) => patchContent('offer_title', e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-xs text-slate-400">Texto oferta</span>
          <textarea
            value={content.offer_body}
            onChange={(e) => patchContent('offer_body', e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-xs text-slate-400">Garantía / nota</span>
          <input
            value={content.guarantee_text}
            onChange={(e) => patchContent('guarantee_text', e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </label>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Pagos / checkout</h2>
        <label className="block">
          <span className="text-xs text-slate-400">Método principal</span>
          <select
            value={payment.primary_method}
            onChange={(e) => patchPayment('primary_method', e.target.value as LandingPaymentMethod)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
          >
            {METHODS.map((method) => (
              <option key={method.id} value={method.id}>
                {method.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs text-slate-400">Texto botón de compra</span>
          <input
            value={payment.cta_label}
            onChange={(e) => patchPayment('cta_label', e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-xs text-slate-400">URL checkout genérica (prioridad)</span>
          <input
            value={payment.checkout_url}
            onChange={(e) => patchPayment('checkout_url', e.target.value)}
            placeholder="https://..."
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label>
            <span className="text-xs text-slate-400">Hotmart checkout</span>
            <input
              value={payment.hotmart_url}
              onChange={(e) => patchPayment('hotmart_url', e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>
          <label>
            <span className="text-xs text-slate-400">Paguelo Fácil</span>
            <input
              value={payment.paguelo_facil_url}
              onChange={(e) => patchPayment('paguelo_facil_url', e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>
          <label>
            <span className="text-xs text-slate-400">Cubo</span>
            <input
              value={payment.cubo_url}
              onChange={(e) => patchPayment('cubo_url', e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>
          <label>
            <span className="text-xs text-slate-400">Yappy (número)</span>
            <input
              value={payment.yappy_number}
              onChange={(e) => patchPayment('yappy_number', e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>
          <label>
            <span className="text-xs text-slate-400">Yappy (nombre)</span>
            <input
              value={payment.yappy_name}
              onChange={(e) => patchPayment('yappy_name', e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>
          <label>
            <span className="text-xs text-slate-400">Banco</span>
            <input
              value={payment.bank_name}
              onChange={(e) => patchPayment('bank_name', e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>
          <label>
            <span className="text-xs text-slate-400">Tipo cuenta</span>
            <input
              value={payment.bank_type}
              onChange={(e) => patchPayment('bank_type', e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>
          <label>
            <span className="text-xs text-slate-400">Número de cuenta</span>
            <input
              value={payment.bank_account}
              onChange={(e) => patchPayment('bank_account', e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>
          <label className="sm:col-span-2">
            <span className="text-xs text-slate-400">Titular</span>
            <input
              value={payment.bank_holder}
              onChange={(e) => patchPayment('bank_holder', e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>
          <label>
            <span className="text-xs text-slate-400">Etiqueta pago custom</span>
            <input
              value={payment.custom_label}
              onChange={(e) => patchPayment('custom_label', e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>
          <label className="sm:col-span-2">
            <span className="text-xs text-slate-400">Instrucciones custom</span>
            <textarea
              value={payment.custom_instructions}
              onChange={(e) => patchPayment('custom_instructions', e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">SEO</h2>
        <label className="block">
          <span className="text-xs text-slate-400">SEO title</span>
          <input
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-xs text-slate-400">SEO description</span>
          <textarea
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-xs text-slate-400">Nota pie</span>
          <input
            value={content.footer_note}
            onChange={(e) => patchContent('footer_note', e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </label>
      </section>
    </div>
  )
}

function ImageField({
  label,
  url,
  uploading,
  onUpload,
  onClear,
}: {
  label: string
  url: string
  uploading: boolean
  onUpload: (file: File) => void
  onClear: () => void
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 p-3">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="mt-2 max-h-48 w-full rounded-lg object-cover" />
      ) : (
        <p className="mt-2 text-sm text-slate-400">Sin imagen</p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white">
          <Upload className="h-4 w-4" />
          {uploading ? 'Subiendo…' : 'Subir'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) onUpload(file)
              e.currentTarget.value = ''
            }}
          />
        </label>
        {url ? (
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
          >
            Quitar
          </button>
        ) : null}
      </div>
    </div>
  )
}
