'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link2,
  ImagePlus,
  Undo2,
  Redo2,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { adminUi } from '@/lib/admin-ui'
import { clsx } from 'clsx'

type Props = {
  value: string
  onChange: (html: string) => void
  slugHint?: string
  disabled?: boolean
}

export function BlogRichTextEditor({ value, onChange, slugHint = 'post', disabled }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [linkOpen, setLinkOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('https://')
  const [imgAlt, setImgAlt] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer' },
      }),
      Image.configure({
        HTMLAttributes: { class: 'rounded-xl max-w-full h-auto' },
      }),
      Placeholder.configure({
        placeholder: 'Escribe el artículo… Usa H2/H3 para subtítulos (sin H1).',
      }),
    ],
    content: value || '',
    editable: !disabled,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'min-h-[320px] px-4 py-3 text-sm text-slate-800 outline-none prose prose-sm max-w-none focus:outline-none',
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML())
    },
  })

  useEffect(() => {
    if (!editor) return
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || '', { emitUpdate: false })
    }
  }, [value, editor])

  async function uploadInline(file: File) {
    if (!editor) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('kind', 'inline')
      form.append('slug', slugHint)
      form.append('alt', imgAlt.trim())
      const res = await fetch('/api/admin/blog/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al subir')
      editor
        .chain()
        .focus()
        .setImage({
          src: data.image_url,
          alt: imgAlt.trim() || 'Imagen del artículo',
          title: imgAlt.trim() || undefined,
        })
        .run()
      // width/height como atributos HTML para CLS
      const html = editor.getHTML().replace(
        `src="${data.image_url}"`,
        `src="${data.image_url}" width="${data.width}" height="${data.height}"`,
      )
      editor.commands.setContent(html)
      onChange(editor.getHTML())
      setImgAlt('')
    } catch (e) {
      alert(e instanceof Error ? e.message : 'No se pudo subir la imagen')
    } finally {
      setUploading(false)
    }
  }

  function applyLink() {
    if (!editor) return
    const url = linkUrl.trim()
    if (!url) {
      editor.chain().focus().unsetLink().run()
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
    setLinkOpen(false)
  }

  if (!editor) {
    return <div className={`${adminUi.card} p-4 text-sm text-slate-500`}>Cargando editor…</div>
  }

  const btn = (active: boolean) =>
    clsx(
      'inline-flex h-8 w-8 items-center justify-center rounded-lg border text-slate-600 transition',
      active
        ? 'border-brand/30 bg-brand/10 text-brand'
        : 'border-transparent hover:border-slate-200 hover:bg-slate-50',
    )

  return (
    <div className={`${adminUi.card} overflow-hidden`}>
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 py-2">
        <button type="button" className={btn(editor.isActive('bold'))} onClick={() => editor.chain().focus().toggleBold().run()} title="Negrita" aria-label="Negrita">
          <Bold className="h-4 w-4" aria-hidden />
        </button>
        <button type="button" className={btn(editor.isActive('italic'))} onClick={() => editor.chain().focus().toggleItalic().run()} title="Cursiva" aria-label="Cursiva">
          <Italic className="h-4 w-4" aria-hidden />
        </button>
        <button type="button" className={btn(editor.isActive('heading', { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="H2" aria-label="Título H2">
          <Heading2 className="h-4 w-4" aria-hidden />
        </button>
        <button type="button" className={btn(editor.isActive('heading', { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="H3" aria-label="Título H3">
          <Heading3 className="h-4 w-4" aria-hidden />
        </button>
        <button type="button" className={btn(editor.isActive('bulletList'))} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Lista" aria-label="Lista">
          <List className="h-4 w-4" aria-hidden />
        </button>
        <button type="button" className={btn(editor.isActive('orderedList'))} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Lista numerada" aria-label="Lista numerada">
          <ListOrdered className="h-4 w-4" aria-hidden />
        </button>
        <button type="button" className={btn(editor.isActive('blockquote'))} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Cita" aria-label="Cita">
          <Quote className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          className={btn(editor.isActive('link') || linkOpen)}
          onClick={() => {
            setLinkUrl(editor.getAttributes('link').href || 'https://www.nixonlopez.com/')
            setLinkOpen((v) => !v)
          }}
          title="Enlace"
        >
          <Link2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={btn(false)}
          disabled={uploading || disabled}
          onClick={() => fileRef.current?.click()}
          title="Imagen"
        >
          <ImagePlus className="h-4 w-4" />
        </button>
        <button type="button" className={btn(false)} onClick={() => editor.chain().focus().undo().run()} title="Deshacer">
          <Undo2 className="h-4 w-4" />
        </button>
        <button type="button" className={btn(false)} onClick={() => editor.chain().focus().redo().run()} title="Rehacer">
          <Redo2 className="h-4 w-4" />
        </button>
      </div>

      {linkOpen ? (
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-3 py-2">
          <input
            className={`${adminUi.input} max-w-md`}
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://www.nixonlopez.com/cotizacion"
          />
          <button type="button" className={adminUi.btnPrimary} onClick={applyLink}>
            Aplicar
          </button>
          <button type="button" className={adminUi.btnSecondary} onClick={() => editor.chain().focus().unsetLink().run()}>
            Quitar
          </button>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-3 py-2 text-xs text-slate-500">
        <label className="font-medium text-slate-600">Alt imagen (próxima subida):</label>
        <input
          className={`${adminUi.input} max-w-sm py-1.5 text-xs`}
          value={imgAlt}
          onChange={(e) => setImgAlt(e.target.value)}
          placeholder="Describe la imagen (recomendado)"
        />
        {uploading ? <span>Subiendo…</span> : null}
      </div>

      <EditorContent editor={editor} />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void uploadInline(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}
