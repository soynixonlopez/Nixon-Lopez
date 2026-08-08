import type { Locale } from '../types'
import { es } from './es'
import { en } from './en'
import type { Messages } from './types'

export function getMessages(locale: Locale): Messages {
  return locale === 'en' ? en : es
}

export { es, en }
export type { Messages }
