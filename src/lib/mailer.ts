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
