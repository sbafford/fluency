import type { LevelDefinition } from '../../engine/types'

/*
 * Proficiency levels with practical can-do descriptors. These are written for
 * this app, guided by the publicly available CEFR global and self-assessment
 * descriptors. Only A1 is fully specified for now; later levels carry their
 * summary so the progression is visible and can be filled in as content grows.
 */

export const levels: LevelDefinition[] = [
  {
    id: 'A1',
    name: 'Beginner',
    summary:
      'Handle simple, predictable exchanges about yourself and immediate needs, when the other person speaks slowly and is willing to help.',
    canDo: [
      { id: 'a1.greet', skill: 'interaction', text: 'Greet people, introduce myself and say goodbye, choosing between tu and vous.' },
      { id: 'a1.personal', skill: 'interaction', text: 'Ask and answer simple questions about name, origin, where I live and what I do.' },
      { id: 'a1.needs', skill: 'interaction', text: 'Order, ask for things and ask prices in a café, shop or hotel.' },
      { id: 'a1.numbers', skill: 'listening', text: 'Understand numbers, prices and times when spoken slowly and clearly.' },
      { id: 'a1.familiar', skill: 'listening', text: 'Follow short, slow conversations about familiar, everyday topics.' },
      { id: 'a1.announce', skill: 'listening', text: 'Pick out the key information in a short, simple announcement.' },
      { id: 'a1.describe', skill: 'speaking', text: 'Use simple sentences to describe where I live, my work and people I know.' },
      { id: 'a1.read', skill: 'reading', text: 'Understand familiar names, words and very simple sentences on signs, menus and forms.' },
      { id: 'a1.write', skill: 'writing', text: 'Write personal details and a short, simple message such as a greeting or a thank-you note.' },
    ],
  },
  {
    id: 'A2',
    name: 'Elementary',
    summary:
      'Communicate in routine tasks needing a direct exchange of information on familiar topics; describe your background and immediate environment in simple terms.',
    canDo: [],
  },
  {
    id: 'B1',
    name: 'Intermediate',
    summary:
      'Deal with most situations while travelling; describe experiences, events, hopes and plans, and give brief reasons for opinions.',
    canDo: [],
  },
  {
    id: 'B2',
    name: 'Upper intermediate',
    summary:
      'Interact with fluency and spontaneity with native speakers; explain a viewpoint on a topical issue, giving advantages and disadvantages.',
    canDo: [],
  },
  {
    id: 'C1',
    name: 'Advanced',
    summary:
      'Use language flexibly and effectively for social, academic and professional purposes; express ideas fluently without obvious searching for words.',
    canDo: [],
  },
  {
    id: 'C2',
    name: 'Proficiency',
    summary:
      'Understand virtually everything heard or read; express yourself spontaneously and precisely, distinguishing finer shades of meaning.',
    canDo: [],
  },
]
