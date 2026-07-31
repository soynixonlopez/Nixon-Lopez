import { INVOICE_BRANDING } from '@/lib/invoice-branding'
import type { MasterclassEventConfig } from '@/lib/masterclass'
import { SITE_URL } from '@/lib/site-config'
import { escapeHtml } from '@/lib/utils'

/** Imágenes y marca para correos de masterclass — edita aquí. */
export const MASTERCLASS_EMAIL_BRANDING = {
  bannerPath: '/images/emails/email_banner.png',
  instructorName: 'Nixon López',
  instructorTitle: 'Desarrollador web & especialista en IA',
  instagramHandle: 'nixonlopez.dev',
  instagramUrl: 'https://www.instagram.com/nixonlopez.dev/',
} as const

const FONT =
  "system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"
const ACCENT = INVOICE_BRANDING.accentHex
const PURPLE = '#8B5CF6'

export function masterclassEmailAssetUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

type EmailHeaderOptions = {
  badge: string
  event: MasterclassEventConfig
}

/** Banner profesional + franja de urgencia con fecha/hora. */
export function buildMasterclassEmailHeader({ badge, event }: EmailHeaderOptions) {
  const bannerUrl = escapeHtml(masterclassEmailAssetUrl(MASTERCLASS_EMAIL_BRANDING.bannerPath))
  const instructor = escapeHtml(MASTERCLASS_EMAIL_BRANDING.instructorName)
  const dateLabel = escapeHtml(event.dateLabel)
  const timeLabel = escapeHtml(event.timeLabel)
  const timezoneLabel = escapeHtml(event.timezoneLabel)

  return `<tr>
      <td style="padding:0;line-height:0;font-size:0;">
        <a href="${escapeHtml(event.googleMeetUrl)}" target="_blank" rel="noopener noreferrer" style="text-decoration:none;">
          <img src="${bannerUrl}" alt="${instructor} — Masterclass: sitios web profesionales con IA" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;outline:none;" />
        </a>
      </td>
    </tr>
    <tr>
      <td style="padding:14px 20px;background:linear-gradient(90deg, ${ACCENT} 0%, #0f172a 60%, ${PURPLE} 100%);font-family:${FONT};text-align:center;">
        <span style="display:inline-block;padding:5px 14px;border-radius:999px;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.22);font-size:11px;font-weight:800;color:#ffffff;letter-spacing:0.08em;text-transform:uppercase;">${escapeHtml(badge)}</span>
        <p style="margin:10px 0 0;font-size:15px;font-weight:700;color:#ffffff;line-height:1.4;">${dateLabel} · ${timeLabel}</p>
        <p style="margin:4px 0 0;font-size:12px;color:rgba(255,255,255,0.78);">${timezoneLabel} · Google Meet · Cupos limitados</p>
      </td>
    </tr>`
}

/** Tres pilares de valor (remarketing). */
export function buildMasterclassValueProps() {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
    <tr>
      <td style="padding:16px 18px;background:linear-gradient(135deg,#f8fafc 0%,#eff6ff 100%);border:1px solid #e2e8f0;border-radius:12px;font-family:${FONT};">
        <p style="margin:0 0 12px;font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;">En la sesión en vivo aprenderás</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="33%" style="padding:8px 6px;text-align:center;vertical-align:top;">
              <p style="margin:0 0 4px;font-size:22px;line-height:1;">💻</p>
              <p style="margin:0;font-size:12px;font-weight:700;color:#0f172a;">Sin código</p>
              <p style="margin:4px 0 0;font-size:11px;color:#64748b;line-height:1.4;">Crea con IA, sin ser programador</p>
            </td>
            <td width="33%" style="padding:8px 6px;text-align:center;vertical-align:top;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
              <p style="margin:0 0 4px;font-size:22px;line-height:1;">🚀</p>
              <p style="margin:0;font-size:12px;font-weight:700;color:#0f172a;">Rápido</p>
              <p style="margin:4px 0 0;font-size:11px;color:#64748b;line-height:1.4;">Sitios modernos en menos tiempo</p>
            </td>
            <td width="33%" style="padding:8px 6px;text-align:center;vertical-align:top;">
              <p style="margin:0 0 4px;font-size:22px;line-height:1;">🌐</p>
              <p style="margin:0;font-size:12px;font-weight:700;color:#0f172a;">Profesional</p>
              <p style="margin:4px 0 0;font-size:11px;color:#64748b;line-height:1.4;">Resultados listos para tu negocio</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`
}

function ctaButton(href: string, label: string, bg: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
    <tr>
      <td style="border-radius:10px;background:${bg};box-shadow:0 4px 14px rgba(15,23,42,0.15);">
        <a href="${href}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:14px 28px;font-family:${FONT};font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.02em;">${label}</a>
      </td>
    </tr>
  </table>`
}

/** Tarjetas de acceso WhatsApp + Meet (conversión). */
export function buildMasterclassAccessCards(event: MasterclassEventConfig) {
  const meetUrl = escapeHtml(event.googleMeetUrl)
  const waUrl = escapeHtml(event.whatsappCommunityUrl)
  const waName = escapeHtml(event.whatsappCommunityName)
  const timeLabel = escapeHtml(event.timeLabel)
  const timezoneLabel = escapeHtml(event.timezoneLabel)

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin:0 0 20px;">
    <tr>
      <td style="padding:18px 20px;background:#f0fdf4;border-bottom:1px solid #e2e8f0;font-family:${FONT};">
        <p style="margin:0 0 4px;font-size:10px;font-weight:800;color:#16a34a;text-transform:uppercase;letter-spacing:0.08em;">Paso 1 · No lo dejes pasar</p>
        <p style="margin:0 0 8px;font-size:16px;font-weight:700;color:#0f172a;">Únete al grupo de WhatsApp</p>
        <p style="margin:0 0 16px;font-size:13px;line-height:1.55;color:#475569;">Recordatorios de último minuto, materiales exclusivos y soporte antes de la clase. <strong>Si no entraste, hazlo ahora.</strong></p>
        ${ctaButton(waUrl, 'Entrar al grupo de WhatsApp →', '#25D366')}
        <p style="margin:12px 0 0;font-size:11px;color:#94a3b8;">${waName}</p>
      </td>
    </tr>
    <tr>
      <td style="padding:18px 20px;background:#ffffff;font-family:${FONT};">
        <p style="margin:0 0 4px;font-size:10px;font-weight:800;color:${ACCENT};text-transform:uppercase;letter-spacing:0.08em;">Paso 2 · Guarda este enlace</p>
        <p style="margin:0 0 8px;font-size:16px;font-weight:700;color:#0f172a;">Acceso a Google Meet</p>
        <p style="margin:0 0 16px;font-size:13px;line-height:1.55;color:#475569;">Conéctate <strong>5 minutos antes</strong> de las ${timeLabel} (${timezoneLabel}). Prueba cámara y audio con anticipación.</p>
        ${ctaButton(meetUrl, 'Entrar a Google Meet →', `linear-gradient(135deg, ${ACCENT} 0%, #2a4a73 100%)`)}
        <p style="margin:12px 0 0;font-size:11px;color:#94a3b8;word-break:break-all;">${meetUrl}</p>
      </td>
    </tr>
  </table>`
}

export function buildMasterclassCalendarCta(event: MasterclassEventConfig) {
  const calendarUrl = escapeHtml(event.googleCalendarUrl)
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
    <tr><td align="center" style="font-family:${FONT};">
      <a href="${calendarUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:12px 22px;border-radius:10px;border:2px solid #e2e8f0;background:#ffffff;font-size:13px;font-weight:600;color:#334155;text-decoration:none;">Agregar a Google Calendar</a>
    </td></tr>
  </table>`
}

export function buildMasterclassEventDetails(event: MasterclassEventConfig) {
  const eventName = escapeHtml(event.shortName)
  const dateLabel = escapeHtml(event.dateLabel)
  const timeLabel = escapeHtml(event.timeLabel)
  const timezoneLabel = escapeHtml(event.timezoneLabel)
  const modality = escapeHtml(event.modality)
  const cost = escapeHtml(event.cost)

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin:0 0 20px;font-family:${FONT};">
    <tr><td colspan="2" style="padding:10px 14px;background:#f8fafc;font-size:10px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;">Detalles del evento</td></tr>
    <tr><td style="padding:10px 14px;border-top:1px solid #e2e8f0;font-size:13px;color:#0f172a;">Evento</td><td style="padding:10px 14px;border-top:1px solid #e2e8f0;font-size:13px;color:#334155;text-align:right;">${eventName}</td></tr>
    <tr><td style="padding:10px 14px;border-top:1px solid #e2e8f0;font-size:13px;color:#0f172a;">Fecha</td><td style="padding:10px 14px;border-top:1px solid #e2e8f0;font-size:13px;color:#334155;text-align:right;font-weight:700;">${dateLabel}</td></tr>
    <tr><td style="padding:10px 14px;border-top:1px solid #e2e8f0;font-size:13px;color:#0f172a;">Horario</td><td style="padding:10px 14px;border-top:1px solid #e2e8f0;font-size:13px;color:#334155;text-align:right;">${timeLabel}</td></tr>
    <tr><td style="padding:10px 14px;border-top:1px solid #e2e8f0;font-size:13px;color:#0f172a;">Zona horaria</td><td style="padding:10px 14px;border-top:1px solid #e2e8f0;font-size:13px;color:#334155;text-align:right;">${timezoneLabel}</td></tr>
    <tr><td style="padding:10px 14px;border-top:1px solid #e2e8f0;font-size:13px;color:#0f172a;">Acceso</td><td style="padding:10px 14px;border-top:1px solid #e2e8f0;font-size:13px;color:#334155;text-align:right;">${modality} · ${cost}</td></tr>
  </table>`
}

export function buildMasterclassUrgencyTip(daysUntil: number | null) {
  const copy =
    daysUntil === 1 ?
      'Mañana es el día. Agrega el evento a tu calendario, entra al WhatsApp y guarda el enlace de Meet — tu cupo ya está reservado.'
    : daysUntil === 0 ?
      'Hoy es el día. Conéctate 5 minutos antes y revisa que tengas el enlace de Meet a mano.'
    : 'No dejes pasar esta sesión gratuita. Completa los 2 pasos de abajo para no perderte nada.'

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
    <tr><td style="padding:14px 16px;background:#fffbeb;border:1px solid #fde68a;border-radius:10px;font-family:${FONT};">
      <p style="margin:0;font-size:14px;line-height:1.55;color:#92400e;"><strong>Importante:</strong> ${escapeHtml(copy)}</p>
    </td></tr>
  </table>`
}

export function buildMasterclassCustomMessageBlock(message: string) {
  if (!message.trim()) return ''
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
    <tr><td style="padding:14px 16px;background:#eff6ff;border-left:4px solid ${ACCENT};border-radius:0 10px 10px 0;font-family:${FONT};">
      <p style="margin:0 0 4px;font-size:10px;font-weight:800;color:${ACCENT};text-transform:uppercase;letter-spacing:0.06em;">Mensaje de Nixon</p>
      <p style="margin:0;font-size:14px;line-height:1.55;color:#1e3a5f;white-space:pre-wrap;">${escapeHtml(message.trim())}</p>
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

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e2e8f0;margin-top:8px;">
    <tr><td style="padding:20px 0 0;font-family:${FONT};">
      <p style="margin:0 0 12px;font-size:14px;line-height:1.55;color:#334155;">¿Algún enlace no funciona? <strong>Responde a este correo</strong> y te ayudo personalmente.</p>
      <p style="margin:0 0 8px;font-size:12px;color:#94a3b8;">${escapeHtml(reason)}</p>
      <p style="margin:0 0 8px;font-size:12px;color:#94a3b8;">
        <a href="${igUrl}" style="color:${ACCENT};font-weight:600;text-decoration:none;">@${ig}</a>
        · <a href="${privacyUrl}" style="color:#64748b;">Privacidad</a>
        · <a href="${site}" style="color:#64748b;">${site}</a>
      </p>
      <p style="margin:0;font-size:11px;color:#cbd5e1;">— ${instructor} · ${brand} · ${email}</p>
    </td></tr>
  </table>`
}

export function buildMasterclassEmailShell(innerRows: string, preheader: string, title: string) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#eef2f7;-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:transparent;">${escapeHtml(preheader)}</div>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#eef2f7;padding:20px 10px;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 12px 40px rgba(15,23,42,0.12);">
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
