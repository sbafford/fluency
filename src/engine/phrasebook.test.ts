import { describe, expect, it } from 'vitest'
import { french } from '../content/fr'
import { fixturePack } from '../test/fixture'
import { buildPhrasebook, phrasebookCounts } from './phrasebook'
import { completeLesson, emptyProgress, recordAnswer } from './progress'

const T0 = new Date(2026, 9, 27, 10, 0).getTime()

describe('phrasebook', () => {
  it('shows only what you have met, lesson by lesson', () => {
    let p = emptyProgress('xx')
    expect(buildPhrasebook(fixturePack, p, 'met')).toEqual([])
    p = completeLesson(p, 'l1', ['a', 'b', 'c'], 1, T0)
    const book = buildPhrasebook(fixturePack, p, 'met')
    expect(book).toHaveLength(1)
    expect(book[0].lessons.map((l) => l.id)).toEqual(['l1'])
    expect(book[0].lessons[0].entries.map((e) => e.item.target)).toEqual(['bonjour', 'merci', 'au revoir'])
  })

  it('shows the whole course when asked, marking what is not yet met', () => {
    const book = buildPhrasebook(fixturePack, emptyProgress('xx'), 'all')
    expect(book[0].lessons.flatMap((l) => l.entries)).toHaveLength(6)
    expect(book[0].lessons.flatMap((l) => l.entries).every((e) => !e.met)).toBe(true)
  })

  it('finds words by French or English, ignoring accents and case', () => {
    const p = completeLesson(emptyProgress('xx'), 'l1', ['a', 'b', 'c'], 1, T0)
    const hit = (q: string) => buildPhrasebook(fixturePack, p, 'all', q).flatMap((u) => u.lessons.flatMap((l) => l.entries.map((e) => e.item.id)))
    expect(hit('MERCI')).toEqual(['b'])
    expect(hit('thank')).toEqual(['b'])
    expect(hit('sil vous plait')).toEqual(['f'])
    // No word is "Claire", so example sentences are searched too.
    expect(hit('claire')).toEqual(['a'])
    expect(hit('zzz')).toEqual([])
  })

  it('lists shaky words: the ones you keep missing', () => {
    let p = completeLesson(emptyProgress('xx'), 'l1', ['a', 'b', 'c'], 1, T0)
    for (let i = 0; i < 4; i++) p = recordAnswer(p, { itemIds: ['b'], skill: 'recall', result: 'wrong', now: T0 + (i + 1) * 86_400_000 })
    const shaky = buildPhrasebook(fixturePack, p, 'shaky').flatMap((u) => u.lessons.flatMap((l) => l.entries.map((e) => e.item.id)))
    expect(shaky).toEqual(['b'])
    expect(phrasebookCounts(fixturePack, p)).toEqual({ met: 3, shaky: 1, all: 6 })
  })

  it('covers the real French course, with grammar notes once a lesson is reached', () => {
    const p = emptyProgress('fr')
    const all = buildPhrasebook(french, p, 'all')
    expect(all).toHaveLength(french.units.length)
    const met = buildPhrasebook(french, p, 'met')
    // Nothing met yet, but the first lesson is open, so its notes are there to read.
    expect(met.flatMap((u) => u.lessons.flatMap((l) => l.entries))).toHaveLength(0)
    expect(met[0]?.lessons[0]?.notes.length).toBeGreaterThan(0)
    expect(buildPhrasebook(french, p, 'all', 'tu or vous').flatMap((u) => u.lessons.flatMap((l) => l.notes.map((n) => n.title)))).toContain('Tu or vous?')
  })
})
