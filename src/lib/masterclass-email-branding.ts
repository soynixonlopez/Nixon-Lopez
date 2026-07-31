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
} as const

export const MASTERCLASS_EMAIL_FONT =
  "system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"

const FONT = MASTERCLASS_EMAIL_FONT
const ACCENT = INVOICE_BRANDING.accentHex
const ACCENT_DARK = '#2a4a73'

export function masterclassEmailAssetUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

type EmailHeaderOptions = {
  badge: string
  event: MasterclassEventConfig
}

export function buildMasterclassEmailHeader({ badge, event }: EmailHeaderOptions) {
  const bannerUrl = escapeHtml(masterclassEmailAssetUrl(MASTERCLASS_EMAIL_BRANDING.bannerPath))
  const instructor = escapeHtml(MASTERCLASS_EMAIL_BRANDING.instructorName)
  const dateLabel = escapeHtml(event.dateLabel)
  const timeLabel = escapeHtml(event.timeLabel)
  const timezoneLabel = escapeHtml(event.timezoneLabel)
  const { bannerWidth, bannerHeight } = MASTERCLASS_EMAIL_BRANDING

  return `<tr>
      <td style="padding:0;line-height:0;font-size:0;background-color:#f8fafc;">
        <a href="${escapeHtml(event.googleMeetUrl)}" target="_blank" rel="noopener noreferrer" style="text-decoration:none;display:block;">
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

export function buildMasterclassValueProps() {
  const pill = (letter: string, bg: string) =>
    `<span style="display:inline-block;width:28px;height:28px;line-height:28px;border-radius:50%;background-color:${bg};color:#ffffff;font-size:13px;font-weight:800;text-align:center;">${letter}</span>`

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">
    <tr>
      <td style="padding:14px 16px;background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;font-family:${FONT};">
        <p style="margin:0 0 10px;font-size:10px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;">En la sesión en vivo</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="33%" align="center" style="padding:6px 4px;vertical-align:top;">
              ${pill('IA', ACCENT)}
              <p style="margin:6px 0 0;font-size:12px;font-weight:700;color:#0f172a;">Sin código</p>
              <p style="margin:2px 0 0;font-size:11px;color:#64748b;line-height:1.35;">Crea con IA</p>
            </td>
            <td width="33%" align="center" style="padding:6px 4px;vertical-align:top;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
              ${pill('R', ACCENT_DARK)}
              <p style="margin:6px 0 0;font-size:12px;font-weight:700;color:#0f172a;">Rápido</p>
              <p style="margin:2px 0 0;font-size:11px;color:#64748b;line-height:1.35;">Publica en menos tiempo</p>
            </td>
            <td width="33%" align="center" style="padding:6px 4px;vertical-align:top;">
              ${pill('Pro', ACCENT)}
              <p style="margin:6px 0 0;font-size:12px;font-weight:700;color:#0f172a;">Profesional</p>
              <p style="margin:2px 0 0;font-size:11px;color:#64748b;line-height:1.35;">Listo para tu negocio</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`
}

export function buildMasterclassAccessCards(event: MasterclassEventConfig) {
  const meetUrl = escapeHtml(event.googleMeetUrl)
  const waUrl = escapeHtml(event.whatsappCommunityUrl)
  const timeLabel = escapeHtml(event.timeLabel)
  const timezoneLabel = escapeHtml(event.timezoneLabel)

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin:0 0 16px;">
    <tr>
      <td style="padding:16px;background-color:#f0fdf4;border-bottom:1px solid #e2e8f0;font-family:${FONT};">
        <p style="margin:0 0 2px;font-size:10px;font-weight:800;color:#16a34a;text-transform:uppercase;letter-spacing:0.06em;">Paso 1</p>
        <p style="margin:0 0 6px;font-size:16px;font-weight:700;color:#0f172a;">Grupo de WhatsApp</p>
        <p style="margin:0 0 14px;font-size:13px;line-height:1.5;color:#475569;">Recordatorios, materiales y soporte antes de la clase.</p>
        ${ctaButton(waUrl, 'Entrar al grupo de WhatsApp', '#25D366')}
      </td>
    </tr>
    <tr>
      <td style="padding:16px;background-color:#ffffff;font-family:${FONT};">
        <p style="margin:0 0 2px;font-size:10px;font-weight:800;color:${ACCENT};text-transform:uppercase;letter-spacing:0.06em;">Paso 2</p>
        <p style="margin:0 0 6px;font-size:16px;font-weight:700;color:#0f172a;">Google Meet en vivo</p>
        <p style="margin:0 0 14px;font-size:13px;line-height:1.5;color:#475569;">Conéctate 5 min antes · ${timeLabel} (${timezoneLabel})</p>
        ${ctaButton(meetUrl, 'Entrar a Google Meet', ACCENT)}
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

export function buildMasterclassUrgencyTip(daysUntil: number | null) {
  const copy =
    daysUntil === 1 ?
      'Mañana es el día. Entra al WhatsApp y guarda el enlace de Meet — tu cupo ya está reservado.'
    : daysUntil === 0 ?
      'Hoy es el día. Conéctate 5 minutos antes con el enlace de Meet.'
    : 'Completa los 2 pasos de abajo para no perderte la sesión gratuita.'

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">
    <tr><td style="padding:12px 14px;background-color:#fffbeb;border:1px solid #fde68a;border-radius:8px;font-family:${FONT};">
      <p style="margin:0;font-size:13px;line-height:1.5;color:#92400e;"><strong>Importante:</strong> ${escapeHtml(copy)}</p>
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
