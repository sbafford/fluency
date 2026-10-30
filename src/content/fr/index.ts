import type { LanguagePack } from '../../engine/types'
import { accents } from './accents'
import { conversations } from './conversations'
import { levels } from './levels'
import { listening } from './listening'
import { explain1 } from './explain/unit1'
import { explain2 } from './explain/unit2'
import { explain3 } from './explain/unit3'
import { explain4 } from './explain/unit4'
import { explain5 } from './explain/unit5'
import { explain6 } from './explain/unit6'
import { explain7 } from './explain/unit7'
import { explain8 } from './explain/unit8'
import { explain9 } from './explain/unit9'
import { explain10 } from './explain/unit10'
import { explain11 } from './explain/unit11'
import { explain12 } from './explain/unit12'
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
import { unit7 } from './unit7'
import { conversations7, listening7 } from './unit7.practice'
import { unit8 } from './unit8'
import { conversations8, listening8 } from './unit8.practice'
import { unit9 } from './unit9'
import { conversations9, listening9 } from './unit9.practice'
import { unit10 } from './unit10'
import { conversations10, listening10 } from './unit10.practice'
import { unit11 } from './unit11'
import { conversations11, listening11 } from './unit11.practice'
import { unit12 } from './unit12'
import { conversations12, listening12 } from './unit12.practice'

export const french: LanguagePack = {
  id: 'fr',
  name: 'French',
  nativeName: 'Français',
  locale: 'fr-FR',
  // Higher-quality France-French voices commonly installed on Apple, Google and Microsoft systems.
  preferredVoices: ['Audrey', 'Aurélie', 'Thomas', 'Marie', 'Google français', 'Microsoft Denise', 'Microsoft Henri', 'Microsoft Vivienne', 'Microsoft Remy'],
  specialCharacters: ['é', 'è', 'ê', 'à', 'ç', 'ô', 'î', 'û', 'ù', 'œ', 'â'],
  articles: { groups: [['le', 'la', 'les', "l'"], ['un', 'une', 'des'], ['du', 'de la', "de l'"]] },
  levels,
  units: [unit1, unit2, unit3, unit4, unit5, unit6, unit7, unit8, unit9, unit10, unit11, unit12].filter((u) => u.lessons.length > 0),
  listening: [...listening, ...listening3, ...listening4, ...listening5, ...listening6, ...listening7, ...listening8, ...listening9, ...listening10, ...listening11, ...listening12],
  conversations: [...conversations, ...conversations3, ...conversations4, ...conversations5, ...conversations6, ...conversations7, ...conversations8, ...conversations9, ...conversations10, ...conversations11, ...conversations12],
  // Optional pathways (such as faith and culture) plug in here without changing the core course.
  pathways: [],
  narration,
  accents,
  explanations: { ...explain1, ...explain2, ...explain3, ...explain4, ...explain5, ...explain6, ...explain7, ...explain8, ...explain9, ...explain10, ...explain11, ...explain12 },
}
