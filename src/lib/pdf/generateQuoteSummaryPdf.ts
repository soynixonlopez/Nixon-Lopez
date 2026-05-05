import fs from 'fs'
import path from 'path'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { INVOICE_BRANDING } from '@/lib/invoice-branding'

const PAGE_W = 595.28
const PAGE_H = 841.89
const M = 48

function hexToRgb01(hex: string) {
  const h = hex.replace('#', '')
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
  }
}

function wrapText(text: string, maxWidth: number, font: { widthOfTextAtSize: (t: string, s: number) => number }, size: number) {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (font.widthOfTextAtSize(test, size) <= maxWidth) {
      line = test
    } else {
      if (line) lines.push(line)
      line = word
    }
  }
  if (line) lines.push(line)
  return lines
}

function yTop(page: { getHeight: () => number }, fromTop: number) {
  return page.getHeight() - fromTop
}

export type QuoteSummaryLine = { label: string; amount: number }

export type QuoteSummaryPdfInput = {
  quoteId: string
  clientFirstName: string
  clientLastName: string
  clientEmail: string
  serviceLabel: string
  createdAtIso: string
  lines: QuoteSummaryLine[]
  total: number
  monthly?: boolean
}

function fmtMoney(n: number) {
  return new Intl.NumberFormat('es-PA', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(n)
}

export async function generateQuoteSummaryPdfBuffer(input: QuoteSummaryPdfInput): Promise<Uint8Array> {
  const pdf = await PDFDocument.create()
  const page = pdf.addPage([PAGE_W, PAGE_H])
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const ac = hexToRgb01(INVOICE_BRANDING.accentHex)
  const accent = rgb(ac.r, ac.g, ac.b)
  const textColor = rgb(0.15, 0.18, 0.22)
  const muted = rgb(0.38, 0.42, 0.48)

  let cursorY = 52
  const logoPath = path.join(process.cwd(), 'public', INVOICE_BRANDING.logoPath.replace(/^\//, ''))
  try {
    const logoBytes = fs.readFileSync(logoPath)
    const img = await pdf.embedPng(logoBytes)
    const maxW = 180
    const scale = maxW / img.width
    const h = img.height * scale
    page.drawImage(img, { x: M, y: yTop(page, cursorY + h), width: maxW, height: h })
    cursorY += h + 10
  } catch {
    cursorY += 4
  }

  const ref = input.quoteId.slice(0, 8).toUpperCase()
  const title = 'COTIZACIÓN'
  page.drawText(title, {
    x: PAGE_W - M - fontBold.widthOfTextAtSize(title, 20),
    y: yTop(page, 50),
    size: 20,
    font: fontBold,
    color: accent,
  })

  const d = new Date(input.createdAtIso)
  const dateStr = Number.isNaN(d.getTime())
    ? input.createdAtIso
    : d.toLocaleDateString('es-PA', { day: '2-digit', month: 'long', year: 'numeric' })

  page.drawText(INVOICE_BRANDING.businessName, {
    x: M,
    y: yTop(page, cursorY),
    size: 12,
    font: fontBold,
    color: accent,
  })
  cursorY += 16

  page.drawText(`Ref. ${ref} · ${dateStr}`, {
    x: M,
    y: yTop(page, cursorY),
    size: 9,
    font,
    color: muted,
  })
  cursorY += 28

  const maxW = PAGE_W - M * 2
  const drawP = (t: string, size = 10, bold = false, gap = 12) => {
    const f = bold ? fontBold : font
    for (const line of wrapText(t, maxW, f, size)) {
      page.drawText(line, { x: M, y: yTop(page, cursorY), size, font: f, color: textColor })
      cursorY += gap
    }
  }

  drawP('Cliente', 9, true, 10)
  drawP(`${input.clientFirstName} ${input.clientLastName}`, 11, false, 14)
  drawP(input.clientEmail, 9, false, 18)
  drawP('Servicio', 9, true, 10)
  drawP(input.serviceLabel, 10, false, 20)

  page.drawText('Detalle', { x: M, y: yTop(page, cursorY), size: 10, font: fontBold, color: accent })
  cursorY += 16

  const rows = input.lines.length
    ? input.lines
    : [{ label: input.serviceLabel || 'Servicio', amount: input.total }]

  for (const row of rows) {
    const label = row.label.trim() || 'Ítem'
    const left = wrapText(label, maxW - 120, font, 9)
    const amt = fmtMoney(row.amount)
    for (let i = 0; i < left.length; i++) {
      page.drawText(left[i], { x: M, y: yTop(page, cursorY), size: 9, font, color: textColor })
      if (i === 0) {
        page.drawText(amt, {
          x: PAGE_W - M - font.widthOfTextAtSize(amt, 9),
          y: yTop(page, cursorY),
          size: 9,
          font,
          color: textColor,
        })
      }
      cursorY += 11
    }
    cursorY += 4
  }

  cursorY += 8
  page.drawLine({
    start: { x: M, y: yTop(page, cursorY) },
    end: { x: PAGE_W - M, y: yTop(page, cursorY) },
    thickness: 0.5,
    color: accent,
  })
  cursorY += 14

  const totalLabel = input.monthly ? 'Total estimado (mensual)' : 'Total estimado'
  const totalStr = `${fmtMoney(input.total)}${input.monthly ? '/mes' : ''}`
  page.drawText(totalLabel, { x: M, y: yTop(page, cursorY), size: 11, font: fontBold, color: textColor })
  page.drawText(totalStr, {
    x: PAGE_W - M - fontBold.widthOfTextAtSize(totalStr, 12),
    y: yTop(page, cursorY - 1),
    size: 12,
    font: fontBold,
    color: accent,
  })
  cursorY += 36

  const foot =
    '* Montos referenciales según lo indicado en el formulario. No constituye factura. Conserve este documento.'
  for (const line of wrapText(foot, maxW, font, 8)) {
    page.drawText(line, { x: M, y: yTop(page, cursorY), size: 8, font, color: muted })
    cursorY += 10
  }

  return pdf.save()
}
