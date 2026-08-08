import { NextResponse } from 'next/server'

const DEFAULT_MAX_JSON_BYTES = 64 * 1024 // 64 KB para formularios públicos

export function jsonTooLargeResponse() {
  return NextResponse.json(
    { error: 'La solicitud es demasiado grande.' },
    { status: 413 },
  )
}

/** Rechaza cuerpos JSON excesivos antes de parsear (mitiga DoS por payload). */
export async function readJsonBody<T = Record<string, unknown>>(
  request: Request,
  maxBytes = DEFAULT_MAX_JSON_BYTES,
): Promise<{ ok: true; body: T } | { ok: false; response: NextResponse }> {
  const contentLength = request.headers.get('content-length')
  if (contentLength) {
    const len = Number(contentLength)
    if (Number.isFinite(len) && len > maxBytes) {
      return { ok: false, response: jsonTooLargeResponse() }
    }
  }

  const raw = await request.text()
  if (raw.length > maxBytes) {
    return { ok: false, response: jsonTooLargeResponse() }
  }

  try {
    const body = JSON.parse(raw || '{}') as T
    return { ok: true, body }
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: 'JSON inválido.' }, { status: 400 }),
    }
  }
}

export function methodNotAllowed() {
  return NextResponse.json({ error: 'Método no permitido.' }, { status: 405 })
}
