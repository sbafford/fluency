import type { LanguagePack } from '../engine/types'
import { french } from './fr'

/*
 * Language registry. Adding a language means adding a pack folder like
 * ./fr and listing it here; the engine and screens need no changes.
 */
export const languages: Record<string, LanguagePack> = {
  [french.id]: french,
}

export function getLanguage(id: string): LanguagePack {
  return languages[id] ?? french
}
