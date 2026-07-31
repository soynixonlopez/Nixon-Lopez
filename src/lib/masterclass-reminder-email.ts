import { INVOICE_BRANDING } from '@/lib/invoice-branding'
import type { MasterclassEventConfig } from '@/lib/masterclass'
import { SITE_URL } from '@/lib/site-config'
import { escapeHtml } from '@/lib/utils'

export type MasterclassReminderEmailPayload = {
  nombre: string
  event: MasterclassEventConfig
  customMessage?: string
}

function daysUntilEvent(startDateIso: string): number | null {
  const start = new Date(startDateIso)
  if (Number.isNaN(start.getTime())) return null
  const now = new Date()
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((startDay.getTime() - today.getTime()) / 86_400_000)
}

function urgencyHeadline(event: MasterclassEventConfig): { badge: string; lead: string } {
  const days = daysUntilEvent(event.startDateIso)
  const dateLabel = escapeHtml(event.dateLabel)
  const timeLabel = escapeHtml(event.timeLabel)
  const timezoneLabel = escapeHtml(event.timezoneLabel)

  if (days === 0) {
    return {
      badge: '¡Es hoy!',
      lead: `Tu masterclass es <strong>hoy</strong> — ${dateLabel} a las ${timeLabel}.`,
    }
  }
  if (days === 1) {
    return {
      badge: '¡Es mañana!',
      lead: `Tu masterclass es <strong>mañana</strong> — ${dateLabel} a las ${timeLabel}.`,
    }
  }
  if (days !== null && days > 1 && days <= 7) {
    return {
      badge: `Faltan ${days} días`,
      lead: `Te esperamos el <strong>${dateLabel}</strong> a las ${timeLabel}.`,
    }
  }
  return {
    badge: 'Recordatorio',
    lead: `Tu masterclass es el <strong>${dateLabel}</strong> a las ${timeLabel} (${timezoneLabel}).`,
  }
}

export function buildMasterclassReminderContent({
  nombre,
  event,
  customMessage,
}: MasterclassReminderEmailPayload) {
  const first = escapeHtml(nombre.trim())
  const brand = escapeHtml(INVOICE_BRANDING.publicName)
  const site = escapeHtml(SITE_URL)
  const privacyUrl = `${SITE_URL}/politica-de-privacidad`
  const logoUrl = escapeHtml(`${SITE_URL}${INVOICE_BRANDING.logoPath}`)

  const eventName = escapeHtml(event.shortName)
  const dateLabel = escapeHtml(event.dateLabel)
  const timeLabel = escapeHtml(event.timeLabel)
  const timezoneLabel = escapeHtml(event.timezoneLabel)
  const modality = escapeHtml(event.modality)
  const cost = escapeHtml(event.cost)
  const meetUrl = escapeHtml(event.googleMeetUrl)
  const waUrl = escapeHtml(event.whatsappCommunityUrl)
  const calendarUrl = escapeHtml(event.googleCalendarUrl)
  const waName = escapeHtml(event.whatsappCommunityName)
  const accent = INVOICE_BRANDING.accentHex
  const purple = '#8B5CF6'

  const { badge, lead } = urgencyHeadline(event)

  const preheader = `Tu masterclass es ${event.dateLabel} — guarda el enlace de Meet y únete al grupo de WhatsApp si aún no lo hiciste.`

  const extra =
    customMessage?.trim() ?
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
        <tr><td style="padding:14px 16px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;">
          <p style="margin:0;font-size:14px;line-height:1.55;color:#1e3a5f;white-space:pre-wrap;">${escapeHtml(customMessage.trim())}</p>
        </td></tr>
      </table>`
    : ''

  const subjectDays = daysUntilEvent(event.startDateIso)
  const subject =
    subjectDays === 1 ?
      `⏰ Mañana: masterclass de IA (${event.dateLabel}) — tus enlaces aquí`
    : subjectDays === 0 ?
      `🔴 Hoy: tu masterclass empieza pronto — enlaces de Meet y WhatsApp`
    : `⏰ Recordatorio — ${event.shortName} (${event.dateLabel})`

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Recordatorio — ${eventName}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:transparent;">${escapeHtml(preheader)}</div>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f1f5f9;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 8px 32px rgba(15,23,42,0.1);">
          <tr>
            <td style="background:linear-gradient(135deg, ${accent} 0%, #0f172a 55%, ${purple} 120%);padding:28px 24px 24px;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:16px;">
                    <img src="${logoUrl}" alt="${escapeHtml(INVOICE_BRANDING.logoAlt)}" width="200" height="30" style="display:block;max-width:200px;width:200px;height:auto;border:0;outline:none;" />
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <span style="display:inline-block;padding:6px 14px;border-radius:999px;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.25);font-size:12px;font-weight:700;color:#ffffff;letter-spacing:0.06em;text-transform:uppercase;">${escapeHtml(badge)}</span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:14px;">
                    <p style="margin:0;font-size:18px;font-weight:700;color:#ffffff;line-height:1.35;">No te pierdas la masterclass gratuita</p>
                    <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.88);">${eventName}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 24px 8px;font-family:system-ui,-apple-system,sans-serif;">
              <p style="margin:0 0 14px;font-size:16px;line-height:1.55;color:#0f172a;">Hola <strong>${first}</strong>,</p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155;">${lead}</p>
              <p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:#334155;">Reservaste tu cupo para aprender a <strong>crear páginas web profesionales con Inteligencia Artificial</strong>. Si perdiste los enlaces o aún no entraste al grupo, aquí tienes todo de nuevo:</p>
            </td>
          </tr>
          ${extra}
          <tr>
            <td style="padding:0 24px 20px;font-family:system-ui,-apple-system,sans-serif;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#f8fafc 0%,#eff6ff 100%);border:1px solid #e2e8f0;border-radius:10px;">
                <tr>
                  <td style="padding:16px 18px;">
                    <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Lo que verás en vivo</p>
                    <p style="margin:0 0 6px;font-size:14px;line-height:1.5;color:#334155;">✓ Cómo usar IA para diseñar y publicar tu web más rápido</p>
                    <p style="margin:0 0 6px;font-size:14px;line-height:1.5;color:#334155;">✓ Herramientas prácticas que puedes aplicar el mismo día</p>
                    <p style="margin:0;font-size:14px;line-height:1.5;color:#334155;">✓ Sesión en vivo con espacio para preguntas · ${modality} · ${cost}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 20px;font-family:system-ui,-apple-system,sans-serif;">
              <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Tus accesos — guárdalos ahora</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;">
                <tr>
                  <td style="padding:16px 18px;background:#f0fdf4;border-bottom:1px solid #e2e8f0;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#16a34a;text-transform:uppercase;letter-spacing:0.05em;">1 · Comunidad WhatsApp</p>
                    <p style="margin:0 0 10px;font-size:15px;font-weight:600;color:#0f172a;">Únete si aún no entraste</p>
                    <p style="margin:0 0 14px;font-size:13px;line-height:1.5;color:#475569;">Ahí enviamos recordatorios de último minuto, materiales y respondemos dudas antes de la clase.</p>
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="border-radius:8px;background-color:#25D366;">
                          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:13px 22px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">Entrar al grupo de WhatsApp</a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:10px 0 0;font-size:11px;line-height:1.45;color:#94a3b8;word-break:break-all;">${waName}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 18px;background:#f8fafc;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:${accent};text-transform:uppercase;letter-spacing:0.05em;">2 · Clase en vivo (Google Meet)</p>
                    <p style="margin:0 0 10px;font-size:15px;font-weight:600;color:#0f172a;">Este es tu enlace de acceso</p>
                    <p style="margin:0 0 14px;font-size:13px;line-height:1.5;color:#475569;">Conéctate <strong>5 minutos antes</strong> de las ${timeLabel} (${timezoneLabel}) para probar audio y cámara.</p>
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="border-radius:8px;background:linear-gradient(135deg, ${accent} 0%, #2a4a73 100%);">
                          <a href="${meetUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:13px 24px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">Entrar a Google Meet</a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:10px 0 0;font-size:11px;line-height:1.45;color:#94a3b8;word-break:break-all;">${meetUrl}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 20px;font-family:system-ui,-apple-system,sans-serif;" align="center">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="border-radius:8px;border:1px solid #cbd5e1;background:#ffffff;">
                    <a href="${calendarUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:12px 20px;font-size:13px;font-weight:600;color:#334155;text-decoration:none;">Agregar a Google Calendar</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 20px;font-family:system-ui,-apple-system,sans-serif;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
                <tr><td colspan="2" style="padding:10px 14px;background:#f8fafc;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.04em;">Detalles del evento</td></tr>
                <tr><td style="padding:10px 14px;border-top:1px solid #e2e8f0;font-size:14px;color:#0f172a;">Fecha</td><td style="padding:10px 14px;border-top:1px solid #e2e8f0;font-size:14px;color:#334155;text-align:right;font-weight:600;">${dateLabel}</td></tr>
                <tr><td style="padding:10px 14px;border-top:1px solid #e2e8f0;font-size:14px;color:#0f172a;">Horario</td><td style="padding:10px 14px;border-top:1px solid #e2e8f0;font-size:14px;color:#334155;text-align:right;">${timeLabel}</td></tr>
                <tr><td style="padding:10px 14px;border-top:1px solid #e2e8f0;font-size:14px;color:#0f172a;">Zona horaria</td><td style="padding:10px 14px;border-top:1px solid #e2e8f0;font-size:14px;color:#334155;text-align:right;">${timezoneLabel}</td></tr>
                <tr><td style="padding:10px 14px;border-top:1px solid #e2e8f0;font-size:14px;color:#0f172a;">Modalidad</td><td style="padding:10px 14px;border-top:1px solid #e2e8f0;font-size:14px;color:#334155;text-align:right;">${modality}</td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 28px;font-family:system-ui,-apple-system,sans-serif;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;">
                <tr>
                  <td style="padding:14px 16px;">
                    <p style="margin:0;font-size:14px;line-height:1.55;color:#92400e;"><strong>Tip:</strong> Agrega el evento a tu calendario y entra al WhatsApp ahora — así no se te pasa.</p>
                  </td>
                </tr>
              </table>
              <p style="margin:20px 0 12px;font-size:14px;line-height:1.55;color:#334155;">¿Problemas con algún enlace? Responde a este correo y te ayudamos al instante.</p>
              <p style="margin:0;font-size:12px;line-height:1.5;color:#94a3b8;">Recibes este recordatorio porque te registraste en la masterclass en ${site}.</p>
              <p style="margin:12px 0 0;font-size:12px;line-height:1.5;color:#94a3b8;"><a href="${escapeHtml(privacyUrl)}" style="color:#64748b;">Política de privacidad</a> · <a href="${site}" style="color:#64748b;">${site}</a></p>
              <p style="margin:16px 0 0;font-size:11px;line-height:1.45;color:#94a3b8;">— Nixon López · ${brand} · ${escapeHtml(INVOICE_BRANDING.email)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  const text = [
    `${INVOICE_BRANDING.publicName} — Recordatorio Masterclass`,
    '',
    `Hola ${nombre.trim()},`,
    '',
    subjectDays === 1 ?
      `Tu masterclass es MAÑANA — ${event.dateLabel} a las ${event.timeLabel} (${event.timezoneLabel}).`
    : `Tu masterclass: ${event.dateLabel} a las ${event.timeLabel} (${event.timezoneLabel}).`,
    '',
    customMessage?.trim() ?? '',
    '',
    'Lo que verás en vivo:',
    '- Crear páginas web profesionales con IA',
    '- Herramientas prácticas para aplicar el mismo día',
    `- ${event.modality} · ${event.cost}`,
    '',
    '1) Grupo de WhatsApp (recordatorios y materiales):',
    event.whatsappCommunityUrl,
    '',
    '2) Google Meet (clase en vivo):',
    event.googleMeetUrl,
    '',
    'Google Calendar:',
    event.googleCalendarUrl,
    '',
    `¿Problemas? Responde a ${INVOICE_BRANDING.email}`,
    `${INVOICE_BRANDING.publicName} · ${SITE_URL}`,
  ]
    .filter((line) => line !== '')
    .join('\n')

  return { html, text, subject }
}
