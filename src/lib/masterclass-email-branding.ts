import { INVOICE_BRANDING } from '@/lib/invoice-branding'
import type { MasterclassEventConfig } from '@/lib/masterclass'
import { SITE_URL } from '@/lib/site-config'
import { escapeHtml } from '@/lib/utils'

/**
 * Personaliza banner y marca de correos masterclass.
 * Usa JPEG optimizado (pnpm run optimize-email-banner) — ~24 KB vs ~1.8 MB del PNG.
 */
export const MASTERCLASS_EMAIL_BRANDING = {
  /** JPEG 600px generado desde email_banner.png */
  bannerPath: '/images/emails/email_banner.jpg',
  bannerWidth: 600,
  bannerHeight: 200,
  instructorName: 'Nixon López',
  instructorTitle: 'Desarrollador web & especialista en IA',
  instagramHandle: 'nixonlopez.dev',
  instagramUrl: 'https://www.instagram.com/nixonlopez.dev/',
  icons: {
    ai: '/images/emails/icon-ai@2x.png',
    rocket: '/images/emails/icon-rocket@2x.png',
    professional: '/images/emails/icon-professional@2x.png',
  },
} as const

export const MASTERCLASS_EMAIL_FONT =
  "system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"

const FONT = MASTERCLASS_EMAIL_FONT
const ACCENT = INVOICE_BRANDING.accentHex

export function masterclassEmailAssetUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

type EmailHeaderOptions = {
  badge: string
  event: MasterclassEventConfig
  /** Enlace del banner; por defecto Google Meet */
  bannerHref?: string
}

export function buildMasterclassEmailHeader({ badge, event, bannerHref }: EmailHeaderOptions) {
  const bannerUrl = escapeHtml(masterclassEmailAssetUrl(MASTERCLASS_EMAIL_BRANDING.bannerPath))
  const instructor = escapeHtml(MASTERCLASS_EMAIL_BRANDING.instructorName)
  const dateLabel = escapeHtml(event.dateLabel)
  const timeLabel = escapeHtml(event.timeLabel)
  const timezoneLabel = escapeHtml(event.timezoneLabel)
  const { bannerWidth, bannerHeight } = MASTERCLASS_EMAIL_BRANDING
  const href = escapeHtml(bannerHref ?? event.googleMeetUrl)

  return `<tr>
      <td style="padding:0;line-height:0;font-size:0;background-color:#f8fafc;">
        <a href="${href}" target="_blank" rel="noopener noreferrer" style="text-decoration:none;display:block;">
          <img
            src="${bannerUrl}"
            alt="${instructor} — Masterclass: sitios web profesionales con IA"
            width="${bannerWidth}"
            height="${bannerHeight}"
            style="display:block;width:100%;max-width:${bannerWidth}px;height:auto;border:0;outline:none;-ms-interpolation-mode:bicubic;"
          />
        </a>
      </td>
    </tr>
    <tr>
      <td style="padding:12px 16px;background-color:${ACCENT};font-family:${FONT};text-align:center;">
        <span style="display:inline-block;padding:4px 12px;border-radius:999px;background-color:#ffffff;color:${ACCENT};font-size:10px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;">${escapeHtml(badge)}</span>
        <p style="margin:8px 0 0;font-size:15px;font-weight:700;color:#ffffff;line-height:1.35;">${dateLabel} · ${timeLabel}</p>
        <p style="margin:2px 0 0;font-size:11px;color:#cbd5e1;">${timezoneLabel} · Google Meet · Cupos limitados</p>
      </td>
    </tr>`
}

function ctaButton(href: string, label: string, bgColor: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr>
      <td align="center" style="border-radius:8px;background-color:${bgColor};">
        <a href="${href}" target="_blank" rel="noopener noreferrer" style="display:block;padding:14px 20px;font-family:${FONT};font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;text-align:center;">${label}</a>
      </td>
    </tr>
  </table>`
}

function valuePropIcon(path: string, alt: string) {
  const url = escapeHtml(masterclassEmailAssetUrl(path))
  return `<img src="${url}" alt="${escapeHtml(alt)}" width="40" height="40" style="display:block;margin:0 auto;border:0;outline:none;" />`
}

export function buildMasterclassValueProps() {
  const { icons } = MASTERCLASS_EMAIL_BRANDING

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">
    <tr>
      <td style="padding:14px 16px;background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;font-family:${FONT};">
        <p style="margin:0 0 10px;font-size:10px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;">En la sesión en vivo</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="33%" align="center" style="padding:6px 4px;vertical-align:top;">
              ${valuePropIcon(icons.ai, 'Inteligencia Artificial')}
              <p style="margin:6px 0 0;font-size:12px;font-weight:700;color:#0f172a;">Sin código</p>
              <p style="margin:2px 0 0;font-size:11px;color:#64748b;line-height:1.35;">Crea con IA</p>
            </td>
            <td width="33%" align="center" style="padding:6px 4px;vertical-align:top;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
              ${valuePropIcon(icons.rocket, 'Rápido')}
              <p style="margin:6px 0 0;font-size:12px;font-weight:700;color:#0f172a;">Rápido</p>
              <p style="margin:2px 0 0;font-size:11px;color:#64748b;line-height:1.35;">Publica en menos tiempo</p>
            </td>
            <td width="33%" align="center" style="padding:6px 4px;vertical-align:top;">
              ${valuePropIcon(icons.professional, 'Profesional')}
              <p style="margin:6px 0 0;font-size:12px;font-weight:700;color:#0f172a;">Profesional</p>
              <p style="margin:2px 0 0;font-size:11px;color:#64748b;line-height:1.35;">Listo para tu negocio</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`
}

type AccessCardsVariant = 'confirmation' | 'reminder'

export function buildMasterclassAccessCards(event: MasterclassEventConfig, variant: AccessCardsVariant = 'confirmation') {
  const meetUrl = escapeHtml(event.googleMeetUrl)
  const waUrl = escapeHtml(event.whatsappCommunityUrl)
  const timeLabel = escapeHtml(event.timeLabel)
  const timezoneLabel = escapeHtml(event.timezoneLabel)
  const dateLabel = escapeHtml(event.dateLabel)

  const waCopy =
    variant === 'confirmation' ?
      'Únete ahora para recibir materiales, recordatorios y soporte antes de la sesión.'
    : '¿Aún no entraste? Aquí está el enlace al grupo — ahí enviamos avisos de último minuto.'

  const meetCopy =
    variant === 'confirmation' ?
      `Guarda este enlace para el ${dateLabel} · ${timeLabel} (${timezoneLabel}).`
    : `Mañana a las ${timeLabel} (${timezoneLabel}). Conéctate 5 minutos antes con este enlace.`

  const waCta = variant === 'confirmation' ? 'Unirme al grupo de WhatsApp' : 'Abrir grupo de WhatsApp'
  const meetCta = variant === 'confirmation' ? 'Guardar enlace de Google Meet' : 'Entrar a Google Meet mañana'

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin:0 0 16px;">
    <tr>
      <td style="padding:16px;background-color:#f0fdf4;border-bottom:1px solid #e2e8f0;font-family:${FONT};">
        <p style="margin:0 0 2px;font-size:10px;font-weight:800;color:#16a34a;text-transform:uppercase;letter-spacing:0.06em;">Paso 1</p>
        <p style="margin:0 0 6px;font-size:16px;font-weight:700;color:#0f172a;">Grupo de WhatsApp</p>
        <p style="margin:0 0 14px;font-size:13px;line-height:1.5;color:#475569;">${waCopy}</p>
        ${ctaButton(waUrl, waCta, '#25D366')}
      </td>
    </tr>
    <tr>
      <td style="padding:16px;background-color:#ffffff;font-family:${FONT};">
        <p style="margin:0 0 2px;font-size:10px;font-weight:800;color:${ACCENT};text-transform:uppercase;letter-spacing:0.06em;">Paso 2</p>
        <p style="margin:0 0 6px;font-size:16px;font-weight:700;color:#0f172a;">Google Meet en vivo</p>
        <p style="margin:0 0 14px;font-size:13px;line-height:1.5;color:#475569;">${meetCopy}</p>
        ${ctaButton(meetUrl, meetCta, ACCENT)}
        <p style="margin:10px 0 0;font-size:11px;color:#94a3b8;word-break:break-all;">${meetUrl}</p>
      </td>
    </tr>
  </table>`
}

export function buildMasterclassCalendarCta(event: MasterclassEventConfig) {
  const calendarUrl = escapeHtml(event.googleCalendarUrl)
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">
    <tr><td align="center" style="font-family:${FONT};">
      <a href="${calendarUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:11px 18px;border-radius:8px;border:1px solid #e2e8f0;background-color:#ffffff;font-size:13px;font-weight:600;color:#334155;text-decoration:none;">Agregar a Google Calendar</a>
    </td></tr>
  </table>`
}

export function buildMasterclassEventDetails(event: MasterclassEventConfig) {
  const row = (label: string, value: string, bold = false) =>
    `<tr><td style="padding:8px 12px;border-top:1px solid #e2e8f0;font-size:13px;color:#0f172a;">${label}</td><td style="padding:8px 12px;border-top:1px solid #e2e8f0;font-size:13px;color:#334155;text-align:right;${bold ? 'font-weight:700;' : ''}">${value}</td></tr>`

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin:0 0 16px;font-family:${FONT};">
    <tr><td colspan="2" style="padding:8px 12px;background-color:#f8fafc;font-size:10px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Detalles</td></tr>
    ${row('Evento', escapeHtml(event.shortName))}
    ${row('Fecha', escapeHtml(event.dateLabel), true)}
    ${row('Horario', escapeHtml(event.timeLabel))}
    ${row('Zona', escapeHtml(event.timezoneLabel))}
    ${row('Acceso', `${escapeHtml(event.modality)} · ${escapeHtml(event.cost)}`)}
  </table>`
}

/** Bloque de agradecimiento — solo correo de confirmación al registrarse */
export function buildMasterclassThankYouBlock(event: MasterclassEventConfig) {
  const dateLabel = escapeHtml(event.dateLabel)
  const timeLabel = escapeHtml(event.timeLabel)

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">
    <tr><td style="padding:14px 16px;background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;font-family:${FONT};">
      <p style="margin:0 0 4px;font-size:10px;font-weight:800;color:#16a34a;text-transform:uppercase;letter-spacing:0.06em;">Registro confirmado</p>
      <p style="margin:0 0 6px;font-size:15px;font-weight:700;color:#0f172a;">¡Gracias por confiar en esta masterclass!</p>
      <p style="margin:0;font-size:13px;line-height:1.55;color:#166534;">Tu cupo está reservado para el <strong>${dateLabel}</strong> a las <strong>${timeLabel}</strong>. Completa los 2 pasos de abajo para estar listo el día del evento.</p>
    </td></tr>
  </table>`
}

/** Alerta de mañana — solo correo de recordatorio */
export function buildMasterclassTomorrowAlert(event: MasterclassEventConfig, daysUntil: number | null) {
  const dateLabel = escapeHtml(event.dateLabel)
  const timeLabel = escapeHtml(event.timeLabel)
  const timezoneLabel = escapeHtml(event.timezoneLabel)

  const title =
    daysUntil === 0 ? '¡Hoy es el día!' : daysUntil === 1 ? '¡Mañana es el día!' : 'Recordatorio de tu masterclass'

  const copy =
    daysUntil === 0 ?
      `Tu sesión en vivo es hoy a las ${timeLabel} (${timezoneLabel}). Revisa los enlaces de abajo y conéctate 5 minutos antes.`
    : daysUntil === 1 ?
      `Mañana ${dateLabel} a las ${timeLabel} (${timezoneLabel}) nos vemos en vivo. Guarda los enlaces y entra al WhatsApp si aún no lo hiciste.`
    : `Te esperamos el ${dateLabel} a las ${timeLabel}. Aquí tienes tus enlaces de acceso por si los necesitas.`

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">
    <tr><td style="padding:14px 16px;background-color:#fff7ed;border:1px solid #fed7aa;border-radius:10px;font-family:${FONT};">
      <p style="margin:0 0 4px;font-size:10px;font-weight:800;color:#ea580c;text-transform:uppercase;letter-spacing:0.06em;">${title}</p>
      <p style="margin:0;font-size:13px;line-height:1.55;color:#9a3412;">${copy}</p>
    </td></tr>
  </table>`
}

export function buildMasterclassReminderChecklist() {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">
    <tr><td style="padding:12px 14px;background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;font-family:${FONT};">
      <p style="margin:0 0 8px;font-size:10px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;">Checklist rápido</p>
      <p style="margin:0 0 4px;font-size:13px;line-height:1.5;color:#334155;">☑ Entra al grupo de WhatsApp</p>
      <p style="margin:0 0 4px;font-size:13px;line-height:1.5;color:#334155;">☑ Guarda el enlace de Google Meet</p>
      <p style="margin:0;font-size:13px;line-height:1.5;color:#334155;">☑ Agrega el evento a tu calendario</p>
    </td></tr>
  </table>`
}

export function buildMasterclassCustomMessageBlock(message: string) {
  if (!message.trim()) return ''
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">
    <tr><td style="padding:12px 14px;background-color:#eff6ff;border-left:3px solid ${ACCENT};font-family:${FONT};">
      <p style="margin:0 0 2px;font-size:10px;font-weight:800;color:${ACCENT};text-transform:uppercase;">Mensaje de Nixon</p>
      <p style="margin:0;font-size:14px;line-height:1.5;color:#1e3a5f;white-space:pre-wrap;">${escapeHtml(message.trim())}</p>
    </td></tr>
  </table>`
}

export function buildMasterclassEmailFooter(reason: string) {
  const brand = escapeHtml(INVOICE_BRANDING.publicName)
  const site = escapeHtml(SITE_URL)
  const privacyUrl = escapeHtml(`${SITE_URL}/politica-de-privacidad`)
  const email = escapeHtml(INVOICE_BRANDING.email)
  const ig = escapeHtml(MASTERCLASS_EMAIL_BRANDING.instagramHandle)
  const igUrl = escapeHtml(MASTERCLASS_EMAIL_BRANDING.instagramUrl)
  const instructor = escapeHtml(MASTERCLASS_EMAIL_BRANDING.instructorName)

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e2e8f0;">
    <tr><td style="padding:16px 0 0;font-family:${FONT};">
      <p style="margin:0 0 10px;font-size:13px;line-height:1.5;color:#475569;">¿Problemas con un enlace? <strong>Responde a este correo.</strong></p>
      <p style="margin:0 0 6px;font-size:11px;color:#94a3b8;">${escapeHtml(reason)}</p>
      <p style="margin:0;font-size:11px;color:#94a3b8;">
        <a href="${igUrl}" style="color:${ACCENT};font-weight:600;text-decoration:none;">@${ig}</a>
        · <a href="${privacyUrl}" style="color:#64748b;text-decoration:none;">Privacidad</a>
        · <a href="${site}" style="color:#64748b;text-decoration:none;">${site}</a>
      </p>
      <p style="margin:10px 0 0;font-size:10px;color:#cbd5e1;">${instructor} · ${brand} · ${email}</p>
    </td></tr>
  </table>`
}

export function buildMasterclassEmailShell(innerRows: string, preheader: string, title: string) {
  return `<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="format-detection" content="telephone=no,date=no,address=no,email=no,url=no" />
  <title>${escapeHtml(title)}</title>
  <!--[if mso]><style>table{border-collapse:collapse;}td{font-family:Arial,sans-serif;}</style><![endif]-->
</head>
<body style="margin:0;padding:0;width:100%;background-color:#eef2f7;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(preheader)}&#847;&zwnj;&nbsp;</div>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#eef2f7;">
    <tr><td align="center" style="padding:16px 8px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:100%;max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;">
        ${innerRows}
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export function daysUntilMasterclassEvent(startDateIso: string): number | null {
  const start = new Date(startDateIso)
  if (Number.isNaN(start.getTime())) return null
  const now = new Date()
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((startDay.getTime() - today.getTime()) / 86_400_000)
}
