import { randomBytes } from 'node:crypto'
import nodemailer from 'nodemailer'

type MailPayload = {
  subject: string
  html: string
  replyTo?: string
  to?: string
}

let transporter: nodemailer.Transporter | null = null

function getRequiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Falta la variable de entorno requerida: ${name}`)
  }
  return value
}

function getTransporter() {
  if (transporter) return transporter

  const host = process.env.SMTP_HOST || 'smtp.hostinger.com'
  const port = Number(process.env.SMTP_PORT || '465')
  const user = getRequiredEnv('SMTP_USER')
  const pass = getRequiredEnv('SMTP_PASS')
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  })

  return transporter
}

/** Dominio del remitente para Message-ID (mejor alineación con SPF/DMARC en filtros empresariales). */
function domainFromFromHeader(from: string): string {
  const angle = from.match(/<([^>]+)>/)
  const addr = (angle ? angle[1] : from).trim()
  const at = addr.lastIndexOf('@')
  return at >= 0 ? addr.slice(at + 1) : 'nixonlopez.com'
}

export async function sendContactEmail({ subject, html, replyTo }: MailPayload) {
  const to = process.env.CONTACT_EMAIL_TO || 'info@nixonlopez.com'
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'info@nixonlopez.com'

  await getTransporter().sendMail({
    from,
    to,
    subject,
    html,
    replyTo,
  })
}

export async function sendEmail({ subject, html, replyTo, to }: MailPayload) {
  const resolvedTo = to || process.env.CONTACT_EMAIL_TO || 'info@nixonlopez.com'
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'info@nixonlopez.com'

  await getTransporter().sendMail({
    from,
    to: resolvedTo,
    subject,
    html,
    replyTo,
  })
}

type AttachmentPayload = {
  subject: string
  html: string
  /** Versión texto plano (mejor entregabilidad y accesibilidad). */
  text?: string
  to: string
  replyTo?: string
  /** Copia oculta (p. ej. correo del negocio como respaldo del envío al cliente). */
  bcc?: string
  /**
   * Prefijo estable para Message-ID (sin caracteres raros); se concatena con entropía.
   * Mejora la trazabilidad y el dominio del ID coincide con el remitente.
   */
  messageIdPrefix?: string
  attachments: { filename: string; content: Buffer }[]
}

/** Envío con PDF u otros adjuntos (p. ej. factura al cliente). */
export async function sendEmailWithAttachments({
  subject,
  html,
  text,
  to,
  replyTo,
  bcc,
  messageIdPrefix,
  attachments,
}: AttachmentPayload) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'info@nixonlopez.com'
  const domain = domainFromFromHeader(from)
  const idBase =
    messageIdPrefix?.replace(/[^a-zA-Z0-9._-]+/g, '') || 'mail'
  const messageId = `${idBase}.${randomBytes(8).toString('hex')}@${domain}`

  await getTransporter().sendMail({
    from,
    to,
    bcc: bcc || undefined,
    subject,
    html,
    text,
    replyTo,
    headers: {
      'Message-ID': `<${messageId}>`,
    },
    attachments: attachments.map((a) => ({
      filename: a.filename,
      content: a.content,
      contentType: 'application/pdf',
    })),
  })
}
