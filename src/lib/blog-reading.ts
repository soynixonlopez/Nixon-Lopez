/** Utilidades de lectura editorial (sin persistir en DB). */

export function stripHtmlToText(html: string): string {
  return (html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

export function countWords(htmlOrText: string): number {
  const text = htmlOrText.includes('<') ? stripHtmlToText(htmlOrText) : htmlOrText.trim()
  if (!text) return 0
  return text.split(/\s+/).filter(Boolean).length
}

/** ~200 palabras/minuto en español. */
export function estimateReadingMinutes(htmlOrText: string, wpm = 200): number {
  const words = countWords(htmlOrText)
  return Math.max(1, Math.ceil(words / wpm))
}

export function formatReadingTime(minutes: number): string {
  return `${minutes} min de lectura`
}
