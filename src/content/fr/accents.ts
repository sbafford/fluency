import type { AccentGuideEntry } from '../../engine/types'

/*
 * What each French accent does, how to guess which one a word takes, and a
 * few words to hear it in. Shown in the phrasebook, under the accent keys,
 * and after an answer with an accent slip.
 */

export const accents: AccentGuideEntry[] = [
  {
    letter: 'é',
    name: 'accent aigu',
    nameEn: 'acute accent',
    sound: 'A crisp "ay", like the start of "say" without the glide.',
    guess: 'The most common accent. Very often at the end of a word or a syllable: *café*, *été*. A past participle ending in *-é* always has it.',
    examples: [
      { target: 'café', native: 'coffee' },
      { target: 'été', native: 'summer' },
      { target: 'enchanté', native: 'nice to meet you' },
    ],
  },
  {
    letter: 'è',
    name: 'accent grave',
    nameEn: 'grave accent',
    sound: 'An open "e", like the "e" in "bed".',
    guess: 'Usually before a consonant and a silent *e* at the end: *mère*, *père*, *crème*. Also in *très* and *après*.',
    examples: [
      { target: 'mère', native: 'mother' },
      { target: 'très', native: 'very' },
      { target: 'après', native: 'after' },
    ],
  },
  {
    letter: 'ê',
    name: 'accent circonflexe',
    nameEn: 'circumflex',
    sound: 'Sounds like *è*: the open "e" in "bed".',
    guess: 'Often marks an *s* that dropped out long ago, so compare with English: *fête* (feast), *forêt* (forest). Also *être* and *tête*.',
    examples: [
      { target: 'fête', native: 'party' },
      { target: 'être', native: 'to be' },
      { target: 'forêt', native: 'forest' },
    ],
  },
  {
    letter: 'à',
    name: 'accent grave',
    nameEn: 'grave accent',
    sound: "No change: it's the same \"a\" as in *la*.",
    guess: 'Only tells two words apart: *à* (to, at, in) and *a* (has). *Il a un café* but *Je vais à Lyon*. Also *voilà* and *là* (there).',
    examples: [
      { target: 'à Lyon', native: 'in Lyon' },
      { target: 'voilà', native: 'here you are' },
      { target: 'à bientôt', native: 'see you soon' },
    ],
  },
  {
    letter: 'ù',
    name: 'accent grave',
    nameEn: 'grave accent',
    sound: 'No change in sound.',
    guess: 'Only in one word: *où* (where), to tell it from *ou* (or). *Tu viens d’où ?*',
    examples: [
      { target: 'où', native: 'where' },
      { target: "d'où", native: 'where from' },
    ],
  },
  {
    letter: 'â',
    name: 'accent circonflexe',
    nameEn: 'circumflex',
    sound: 'Mostly the same "a". Some speakers make it a little deeper.',
    guess: 'Rare at A1. Like *ê*, it can mark a lost *s*: *pâte* (paste), and *pâtes* is pasta.',
    examples: [{ target: 'pâtes', native: 'pasta' }],
  },
  {
    letter: 'ô',
    name: 'accent circonflexe',
    nameEn: 'circumflex',
    sound: 'A closed "oh", rounder than the "o" in "pot".',
    guess: 'Watch for it in *bientôt*, *hôtel*, *tôt* (early) and *côté* (side). A lost *s* again: *hôtel* (hostel).',
    examples: [
      { target: 'hôtel', native: 'hotel' },
      { target: 'bientôt', native: 'soon' },
      { target: 'à côté de', native: 'next to' },
    ],
  },
  {
    letter: 'î',
    name: 'accent circonflexe',
    nameEn: 'circumflex',
    sound: 'No change: a normal "ee".',
    guess: 'In *s’il vous plaît* and *dîner*. Spelling only, so learn it with the word.',
    examples: [
      { target: "s'il vous plaît", native: 'please' },
      { target: 'dîner', native: 'dinner' },
    ],
  },
  {
    letter: 'û',
    name: 'accent circonflexe',
    nameEn: 'circumflex',
    sound: 'No change in sound.',
    guess: 'In *coûter* (to cost), *goût* (taste), *août* (August) and *sûr* (sure). *Sur* without it means "on".',
    examples: [
      { target: 'ça coûte', native: 'it costs' },
      { target: 'août', native: 'August' },
      { target: 'sûr', native: 'sure' },
    ],
  },
  {
    letter: 'ç',
    name: 'cédille',
    nameEn: 'cedilla',
    sound: 'Makes *c* a soft "s" before *a*, *o* and *u*.',
    guess: 'Without it, *c* before *a*, *o* or *u* sounds like "k" (*café*). Add it when you hear "s": *ça*, *garçon*, *français*. Never before *e* or *i*: *merci* is already soft.',
    examples: [
      { target: 'ça va', native: "how's it going" },
      { target: 'français', native: 'French' },
      { target: 'garçon', native: 'boy' },
    ],
  },
  {
    letter: 'œ',
    name: 'e dans l’o',
    nameEn: 'o and e joined',
    sound: 'Like the "u" in "fur", said with rounded lips.',
    guess: 'In a few everyday words: *sœur* (sister), *cœur* (heart), *œuf* (egg). If your keyboard lacks it, *oe* is accepted.',
    examples: [
      { target: 'sœur', native: 'sister' },
      { target: 'œuf', native: 'egg' },
    ],
  },
  {
    letter: 'ë',
    name: 'tréma',
    nameEn: 'diaeresis',
    sound: 'Says the vowel separately from the one before it.',
    guess: 'Rare: *Noël* is "no-el", not one sound. The same mark on *i* gives *naïf* (naive).',
    examples: [{ target: 'Noël', native: 'Christmas' }],
  },
]
