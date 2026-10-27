import type { LanguagePack, LearningItem, Lesson } from '../engine/types'

const item = (id: string, target: string, native: string, extra: Partial<LearningItem> = {}): LearningItem => ({
  id,
  kind: 'phrase',
  target,
  native,
  ...extra,
})

const lesson = (id: string, items: LearningItem[]): Lesson => ({
  id,
  kind: 'lesson',
  title: id,
  subtitle: id,
  objectives: [],
  canDo: ['greet'],
  minutes: 5,
  items,
  notes: [],
  exercises: [
    { id: `${id}.present`, type: 'present', itemIds: items.map((i) => i.id) },
    {
      id: `${id}.type`,
      type: 'type',
      itemIds: [items[0].id],
      prompt: items[0].native,
      answers: [items[0].target],
    },
  ],
})

export const fixturePack: LanguagePack = {
  id: 'xx',
  name: 'Test',
  nativeName: 'Test',
  locale: 'fr-FR',
  preferredVoices: [],
  specialCharacters: [],
  articles: { groups: [] },
  levels: [{ id: 'A1', name: 'Beginner', summary: '', canDo: [{ id: 'greet', skill: 'interaction', text: 'Greet' }] }],
  units: [
    {
      id: 'u1',
      level: 'A1',
      title: 'Unit',
      subtitle: '',
      lessons: [
        lesson('l1', [
          item('a', 'bonjour', 'hello', { examples: [{ target: 'Bonjour Claire !', native: 'Hello Claire!' }] }),
          item('b', 'merci', 'thank you', { examples: [{ target: 'Merci beaucoup.', native: 'Thank you very much.' }] }),
          item('c', 'au revoir', 'goodbye', { examples: [{ target: 'Au revoir, Paul.', native: 'Goodbye, Paul.' }] }),
        ]),
        lesson('l2', [
          item('d', 'oui', 'yes', { examples: [{ target: 'Oui, merci.', native: 'Yes, thanks.' }] }),
          item('e', 'non', 'no'),
          item('f', "s'il vous plaît", 'please'),
        ]),
      ],
    },
  ],
  listening: [],
  conversations: [],
  pathways: [],
}
