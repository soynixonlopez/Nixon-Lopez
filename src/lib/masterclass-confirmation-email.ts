import { INVOICE_BRANDING } from '@/lib/invoice-branding'
import { MASTERCLASS_EVENT } from '@/lib/masterclass'
import { SITE_URL } from '@/lib/site-config'
import { escapeHtml } from '@/lib/utils'

export type MasterclassConfirmationEmailPayload = {
  nombre: string
}

export function buildMasterclassConfirmationContent({ nombre }: MasterclassConfirmationEmailPayload) {
  const first = escapeHtml(nombre.trim())
  const brand = escapeHtml(INVOICE_BRANDING.publicName)
  const site = escapeHtml(SITE_URL)
  const privacyUrl = `${SITE_URL}/politica-de-privacidad`

  const eventName = escapeHtml(MASTERCLASS_EVENT.shortName)
  const dateLabel = escapeHtml(MASTERCLASS_EVENT.dateLabel)
  const timeLabel = escapeHtml(MASTERCLASS_EVENT.timeLabel)
  const timezoneLabel = escapeHtml(MASTERCLASS_EVENT.timezoneLabel)
  const modality = escapeHtml(MASTERCLASS_EVENT.modality)
  const waUrl = escapeHtml(MASTERCLASS_EVENT.whatsappCommunityUrl)
  const meetUrl = escapeHtml(MASTERCLASS_EVENT.googleMeetUrl)
  const calendarUrl = escapeHtml(MASTERCLASS_EVENT.googleCalendarUrl)
  const waName = escapeHtml(MASTERCLASS_EVENT.whatsappCommunityName)

  const preheader =
    'Tu cupo está reservado. Únete al grupo de WhatsApp y guarda el enlace de Google Meet para el sábado 1 de agosto.'

  const accent = INVOICE_BRANDING.accentHex

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Confirmación — ${eventName}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:transparent;">${escapeHtml(preheader)}</div>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f1f5f9;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg, ${accent} 0%, #0f172a 100%);padding:28px 24px;">
              <p style="margin:0;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:20px;font-weight:700;color:#ffffff;">${brand}</p>
              <p style="margin:8px 0 0;font-family:system-ui,-apple-system,sans-serif;font-size:13px;color:rgba(255,255,255,0.88);">Masterclass gratuita · Cupo confirmado</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 24px 8px;font-family:system-ui,-apple-system,sans-serif;">
              <p style="margin:0 0 16px;font-size:16px;line-height:1.55;color:#0f172a;">Hola <strong>${first}</strong>,</p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.55;color:#334155;">¡Tu registro fue exitoso! Para no perderte nada, completa estos <strong>2 pasos ahora</strong> (toma menos de 1 minuto):</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 20px;font-family:system-ui,-apple-system,sans-serif;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;">
                <tr>
                  <td style="padding:16px 18px;background:#f8fafc;border-bottom:1px solid #e2e8f0;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Paso 1 · Recomendado ahora</p>
                    <p style="margin:0 0 10px;font-size:15px;font-weight:600;color:#0f172a;">Únete a la comunidad de WhatsApp</p>
                    <p style="margin:0 0 14px;font-size:13px;line-height:1.5;color:#475569;">Ahí compartiremos recordatorios, materiales de apoyo y podrás resolver dudas antes y después de la clase.</p>
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="border-radius:8px;background-color:#25D366;">
                          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:13px 22px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">Unirme al grupo de WhatsApp</a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:10px 0 0;font-size:11px;line-height:1.45;color:#94a3b8;word-break:break-all;">${waName}<br />${waUrl}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 18px;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Paso 2 · Guarda este enlace</p>
                    <p style="margin:0 0 10px;font-size:15px;font-weight:600;color:#0f172a;">Acceso a Google Meet (clase en vivo)</p>
                    <p style="margin:0 0 14px;font-size:13px;line-height:1.5;color:#475569;">Conéctate desde este enlace el día del evento. Te recomendamos probarlo unos minutos antes de las 10:00 AM.</p>
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="border-radius:8px;background-color:${accent};">
                          <a href="${meetUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:13px 22px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">Entrar a Google Meet</a>
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
                    <a href="${calendarUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:11px 18px;font-size:13px;font-weight:600;color:#334155;text-decoration:none;">📅 Agregar a Google Calendar</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 24px;font-family:system-ui,-apple-system,sans-serif;">
              <p style="margin:0 0 12px;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.04em;">Detalles del evento</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
                <tr><td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;">Evento</td><td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#334155;text-align:right;">${eventName}</td></tr>
                <tr><td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;">Fecha</td><td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#334155;text-align:right;">${dateLabel}</td></tr>
                <tr><td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;">Horario</td><td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#334155;text-align:right;">${timeLabel}</td></tr>
                <tr><td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;">Zona horaria</td><td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#334155;text-align:right;">${timezoneLabel}</td></tr>
                <tr><td style="padding:10px 14px;font-size:14px;color:#0f172a;">Modalidad</td><td style="padding:10px 14px;font-size:14px;color:#334155;text-align:right;">${modality}</td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 28px;font-family:system-ui,-apple-system,sans-serif;">
              <p style="margin:0 0 12px;font-size:14px;line-height:1.55;color:#334155;">Nos vemos en vivo. Si tienes algún inconveniente con los enlaces, responde a este correo y te ayudamos.</p>
              <p style="margin:0;font-size:12px;line-height:1.5;color:#94a3b8;">Recibes este mensaje porque te registraste en la masterclass en ${site}. Es un correo transaccional (no newsletters).</p>
              <p style="margin:16px 0 0;font-size:12px;line-height:1.5;color:#94a3b8;"><a href="${escapeHtml(privacyUrl)}" style="color:#64748b;">Política de privacidad</a> · <a href="${site}" style="color:#64748b;">${site}</a></p>
              <p style="margin:16px 0 0;font-size:11px;line-height:1.45;color:#94a3b8;">— Nixon López · ${brand}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  const text = [
    `${INVOICE_BRANDING.publicName} — Confirmación Masterclass`,
    '',
    `Hola ${nombre.trim()},`,
    '',
    '¡Tu registro fue exitoso! Completa estos 2 pasos:',
    '',
    '1) Únete a la comunidad de WhatsApp (recordatorios y materiales):',
    MASTERCLASS_EVENT.whatsappCommunityUrl,
    '',
    '2) Guarda el enlace de Google Meet para la clase en vivo:',
    MASTERCLASS_EVENT.googleMeetUrl,
    '',
    'Agregar a Google Calendar:',
    MASTERCLASS_EVENT.googleCalendarUrl,
    '',
    'Detalles del evento:',
    `- ${MASTERCLASS_EVENT.shortName}`,
    `- ${MASTERCLASS_EVENT.dateLabel}`,
    `- ${MASTERCLASS_EVENT.timeLabel} (${MASTERCLASS_EVENT.timezoneLabel})`,
    `- ${MASTERCLASS_EVENT.modality}`,
    '',
    `Política de privacidad: ${privacyUrl}`,
    `${INVOICE_BRANDING.publicName} · ${INVOICE_BRANDING.email}`,
  ].join('\n')

  const subject = `✅ Cupo confirmado — ${MASTERCLASS_EVENT.shortName}`

  return { html, text, subject }
}
