import type { LanguagePack } from '../../engine/types'
import { conversations } from './conversations'
import { levels } from './levels'
import { listening } from './listening'
import { narration } from './narration'
import { unit1 } from './unit1'
import { unit2 } from './unit2'
import { unit3 } from './unit3'
import { conversations3, listening3 } from './unit3.practice'
import { unit4 } from './unit4'
import { conversations4, listening4 } from './unit4.practice'
import { unit5 } from './unit5'
import { conversations5, listening5 } from './unit5.practice'
import { unit6 } from './unit6'
import { conversations6, listening6 } from './unit6.practice'

export const french: LanguagePack = {
  id: 'fr',
  name: 'French',
  nativeName: 'Français',
  locale: 'fr-FR',
  // Higher-quality France-French voices commonly installed on Apple, Google and Microsoft systems.
  preferredVoices: ['Audrey', 'Aurélie', 'Thomas', 'Marie', 'Google français', 'Microsoft Denise', 'Microsoft Henri', 'Microsoft Vivienne', 'Microsoft Remy'],
  specialCharacters: ['é', 'è', 'ê', 'à', 'â', 'ç', 'ô', 'œ'],
  articles: { groups: [['le', 'la', 'les', "l'"], ['un', 'une', 'des'], ['du', 'de la', "de l'"]] },
  levels,
  units: [unit1, unit2, unit3, unit4, unit5, unit6].filter((u) => u.lessons.length > 0),
  listening: [...listening, ...listening3, ...listening4, ...listening5, ...listening6],
  conversations: [...conversations, ...conversations3, ...conversations4, ...conversations5, ...conversations6],
  // Optional pathways (such as faith and culture) plug in here without changing the core course.
  pathways: [],
  narration,
}
