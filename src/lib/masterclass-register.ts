const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const WHATSAPP_RE = /^[\d\s+\-().]{7,40}$/

export type MasterclassRegisterInput = {
  nombre: string
  email: string
  whatsapp: string
}

export type MasterclassRegisterParseResult =
  | { ok: true; data: MasterclassRegisterInput }
  | { ok: false; error: string; status: number }

/** Normaliza y valida el payload del formulario de registro. */
export function parseMasterclassRegisterBody(body: unknown): MasterclassRegisterParseResult {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Solicitud inválida.', status: 400 }
  }

  const record = body as Record<string, unknown>

  // Honeypot — bots suelen rellenar campos ocultos
  const honeypot = String(record._hp ?? '').trim()
  if (honeypot) {
    return { ok: false, error: 'Solicitud inválida.', status: 400 }
  }

  const nombre = String(record.nombre ?? '').trim()
  const email = String(record.email ?? '').trim().toLowerCase()
  const whatsapp = String(record.whatsapp ?? '').trim()

  if (!nombre || !email || !whatsapp) {
    return { ok: false, error: 'Todos los campos son requeridos.', status: 400 }
  }

  if (nombre.length > 200 || whatsapp.length > 40 || email.length > 254) {
    return { ok: false, error: 'Uno o más campos exceden la longitud permitida.', status: 400 }
  }

  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: 'Correo inválido.', status: 400 }
  }

  if (!WHATSAPP_RE.test(whatsapp)) {
    return { ok: false, error: 'WhatsApp inválido.', status: 400 }
  }

  return { ok: true, data: { nombre, email, whatsapp } }
}

/** Rechaza solicitudes con Content-Type incorrecto (reduce abuso de la API). */
export function isJsonRequest(request: Request): boolean {
  const ct = request.headers.get('content-type') ?? ''
  return ct.includes('application/json')
}
