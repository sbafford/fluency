import type { LanguagePack } from '../../engine/types'
import { conversations } from './conversations'
import { levels } from './levels'
import { listening } from './listening'
import { unit1 } from './unit1'

export const french: LanguagePack = {
  id: 'fr',
  name: 'French',
  nativeName: 'Français',
  locale: 'fr-FR',
  // Higher-quality voices commonly installed on Apple, Google and Microsoft systems.
  preferredVoices: ['Amélie', 'Audrey', 'Thomas', 'Marie', 'Google français', 'Microsoft Denise', 'Microsoft Henri', 'Daniel'],
  specialCharacters: ['é', 'è', 'ê', 'à', 'â', 'ç', 'ô', 'î', 'ï', 'ù', 'û', 'ë', 'œ'],
  articles: { groups: [['le', 'la', 'les', "l'"], ['un', 'une', 'des'], ['du', 'de la', "de l'"]] },
  levels,
  units: [unit1],
  listening,
  conversations,
  // Optional pathways (such as faith and culture) plug in here without changing the core course.
  pathways: [],
}
