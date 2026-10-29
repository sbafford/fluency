import { describe, expect, it } from 'vitest'
import { fixturePack } from '../test/fixture'
import { completeLesson, emptyProgress, recordAnswer } from './progress'
import {
  buildExtraPractice,
  buildReview,
  dueTracks,
  generateExercise,
  isUnlocked,
  nextLesson,
  seededRng,
  todayPlan,
  unitReached,
} from './session'
import { addDays, DAY } from './srs'
import { canDoStatus, skillSummaries, topErrors } from './stats'
import { DEFAULT_SETTINGS } from './storage'

const T0 = new Date(2026, 9, 27, 10, 0).getTime()

describe('curriculum progression', () => {
  it('starts at the first lesson and unlocks in order', () => {
    let p = emptyProgress('xx')
    expect(nextLesson(fixturePack, p)?.id).toBe('l1')
    expect(isUnlocked(fixturePack, p, 'l1')).toBe(true)
    expect(isUnlocked(fixturePack, p, 'l2')).toBe(false)
    p = completeLesson(p, 'l1', ['a', 'b', 'c'], 0.9, T0)
    expect(nextLesson(fixturePack, p)?.id).toBe('l2')
    expect(isUnlocked(fixturePack, p, 'l2')).toBe(true)
  })

  it('treats a unit as reached once its first lesson is open', () => {
    const p = emptyProgress('xx')
    expect(unitReached(fixturePack, p, 'u1')).toBe(true)
    expect(unitReached(fixturePack, p, 'missing')).toBe(false)
    const later = { ...fixturePack, units: [...fixturePack.units, { ...fixturePack.units[0], id: 'u2', lessons: [{ ...fixturePack.units[0].lessons[0], id: 'l9', items: [], exercises: [] }] }] }
    expect(unitReached(later, p, 'u2')).toBe(false)
  })

  it('records lesson scores and attempts', () => {
    let p = completeLesson(emptyProgress('xx'), 'l1', ['a'], 0.6, T0)
    p = completeLesson(p, 'l1', ['a'], 0.9, T0 + DAY)
    expect(p.lessons.l1).toMatchObject({ attempts: 2, bestScore: 0.9, lastScore: 0.9, completedAt: T0 })
  })
})

describe('revision scheduling', () => {
  it('enrols lesson items for review, staggered by skill', () => {
    const p = completeLesson(emptyProgress('xx'), 'l1', ['a', 'b', 'c'], 1, T0)
    expect(dueTracks(fixturePack, p, T0)).toHaveLength(0)
    const day1 = dueTracks(fixturePack, p, addDays(T0, 1) + 1000)
    expect(day1).toHaveLength(3)
    expect(day1.every((d) => d.skill === 'recall')).toBe(true)
    expect(dueTracks(fixturePack, p, addDays(T0, 2) + 1000)).toHaveLength(6)
    expect(dueTracks(fixturePack, p, addDays(T0, 3) + 1000)).toHaveLength(9) // three items × three skills
  })

  it('puts a wrong answer back in the queue immediately', () => {
    let p = completeLesson(emptyProgress('xx'), 'l1', ['a', 'b', 'c'], 1, T0)
    p = recordAnswer(p, { itemIds: ['a'], skill: 'recall', result: 'wrong', errorType: 'wrong-word', now: T0 + 1000 })
    const due = dueTracks(fixturePack, p, T0 + 2000)
    expect(due).toEqual([expect.objectContaining({ itemId: 'a', skill: 'recall' })])
  })

  it('prioritises struggling items', () => {
    let p = completeLesson(emptyProgress('xx'), 'l1', ['a', 'b', 'c'], 1, T0)
    for (let i = 0; i < 4; i++)
      p = recordAnswer(p, { itemIds: ['c'], skill: 'recognition', result: 'wrong', now: T0 + i * 1000 })
    const due = dueTracks(fixturePack, p, addDays(T0, 3) + 1000)
    expect(due[0].itemId).toBe('c')
  })

  it('separates recognition from recall', () => {
    let p = emptyProgress('xx')
    p = recordAnswer(p, { itemIds: ['a'], skill: 'recognition', result: 'correct', now: T0 })
    expect(p.items.a.tracks.recognition?.interval).toBe(1)
    expect(p.items.a.tracks.recall).toBeUndefined()
  })

  it('builds a review session without the same item twice in a row', () => {
    const p = completeLesson(emptyProgress('xx'), 'l1', ['a', 'b', 'c'], 1, T0)
    const session = buildReview(fixturePack, p, addDays(T0, 3) + 1000, 20, seededRng(1))
    expect(session).toHaveLength(9)
    for (let i = 1; i < session.length; i++) expect(session[i].itemIds[0]).not.toBe(session[i - 1].itemIds[0])
  })

  it('respects the session limit', () => {
    const p = completeLesson(emptyProgress('xx'), 'l1', ['a', 'b', 'c'], 1, T0)
    expect(buildReview(fixturePack, p, addDays(T0, 3) + 1000, 4, seededRng(2))).toHaveLength(4)
  })

  it('offers extra practice on weak items when nothing is due', () => {
    let p = completeLesson(emptyProgress('xx'), 'l1', ['a', 'b', 'c'], 1, T0)
    p = recordAnswer(p, { itemIds: ['b'], skill: 'recall', result: 'wrong', now: T0 })
    p = recordAnswer(p, { itemIds: ['b'], skill: 'recall', result: 'correct', now: T0 + 1 })
    const extra = buildExtraPractice(fixturePack, p, 2, seededRng(3))
    expect(extra[0].itemIds).toEqual(['b'])
  })
})

describe('generated exercises', () => {
  const p = completeLesson(emptyProgress('xx'), 'l1', ['a', 'b', 'c'], 1, T0)

  it('creates recognition questions with the answer among distinct options', () => {
    for (let seed = 0; seed < 20; seed++) {
      const e = generateExercise(fixturePack, p, 'a', 'recognition', seededRng(seed))
      if (e.type !== 'choose') throw new Error('expected choose')
      expect(e.options).toContain(e.answer)
      expect(new Set(e.options).size).toBe(e.options.length)
      expect(e.options.length).toBe(4)
    }
  })

  it('reintroduces a recalled item in a new sentence context', () => {
    let q = p
    q = recordAnswer(q, { itemIds: ['a'], skill: 'recall', result: 'correct', now: T0 })
    const contexts = new Set<string | undefined>()
    for (let seed = 0; seed < 30; seed++) {
      const e = generateExercise(fixturePack, q, 'a', 'recall', seededRng(seed))
      if (e.type !== 'type') throw new Error('expected type')
      expect(e.answers).toContain('bonjour')
      contexts.add(e.context)
    }
    expect(contexts).toContain('___ Claire !')
  })

  it('never offers a near-synonym as a wrong option', () => {
    const pack = structuredClone(fixturePack)
    pack.units[0].lessons[0].items.push({ id: 'g', kind: 'phrase', target: 'salut', native: 'hi', acceptNative: ['hello'] })
    pack.units[0].lessons[0].items[0].acceptNative = ['hi']
    for (let seed = 0; seed < 30; seed++) {
      const e = generateExercise(pack, p, 'a', 'recognition', seededRng(seed))
      if (e.type !== 'choose') throw new Error('expected choose')
      expect(e.options).not.toContain('hi')
      expect(e.options).not.toContain('salut')
    }
  })

  it('uses dictation for short items when testing listening', () => {
    const e = generateExercise(fixturePack, p, 'c', 'listening', seededRng(4))
    expect(['dictation', 'listen-choose']).toContain(e.type)
  })
})

describe('today plan', () => {
  it('recommends a lesson for a new learner', () => {
    const plan = todayPlan(fixturePack, emptyProgress('xx'), DEFAULT_SETTINGS, T0)
    expect(plan).toMatchObject({ recommendation: 'lesson', dueCount: 0, streak: 0, answeredToday: 0 })
    expect(plan.next?.id).toBe('l1')
  })

  it('counts streaks and weekly consistency from activity', () => {
    let p = emptyProgress('xx')
    for (const d of [0, 1, 2, 4]) p = recordAnswer(p, { itemIds: ['a'], skill: 'recognition', result: 'correct', now: T0 - d * DAY })
    const plan = todayPlan(fixturePack, p, DEFAULT_SETTINGS, T0)
    expect(plan.streak).toBe(3)
    expect(plan.activeDaysThisWeek).toBe(4)
    expect(plan.answeredToday).toBe(1)
  })

  it('keeps a streak alive until the end of the day', () => {
    let p = emptyProgress('xx')
    p = recordAnswer(p, { itemIds: ['a'], skill: 'recognition', result: 'correct', now: T0 - DAY })
    expect(todayPlan(fixturePack, p, DEFAULT_SETTINGS, T0).streak).toBe(1)
  })
})

describe('stats', () => {
  it('only counts retention when an item is tested on a later day', () => {
    let p = emptyProgress('xx')
    const ids = ['a', 'b', 'c', 'd', 'e']
    for (const id of ids) p = recordAnswer(p, { itemIds: [id], skill: 'recall', result: 'correct', now: T0 })
    // Repeats on the same day are practice, not retention.
    for (const id of ids) p = recordAnswer(p, { itemIds: [id], skill: 'recall', result: 'correct', now: T0 + 1 })
    let recall = skillSummaries(p, T0 + DAY).find((s) => s.skill === 'recall')!
    expect(recall.accuracy).toBe(1)
    expect(recall.retention).toBeUndefined()
    ids.forEach((id, i) => {
      p = recordAnswer(p, { itemIds: [id], skill: 'recall', result: i < 4 ? 'correct' : 'wrong', now: T0 + 2 * DAY })
    })
    recall = skillSummaries(p, T0 + 2 * DAY + 10).find((s) => s.skill === 'recall')!
    expect(recall.retention).toBeCloseTo(0.8)
  })

  it('ranks recurring error types', () => {
    let p = emptyProgress('xx')
    for (const e of ['accent', 'accent', 'gender'] as const)
      p = recordAnswer(p, { itemIds: ['a'], skill: 'recall', result: 'near', errorType: e, now: T0 })
    expect(topErrors(p, T0)[0]).toEqual({ type: 'accent', count: 2 })
  })

  it('does not treat lesson completion alone as demonstrating a can-do', () => {
    const canDo = fixturePack.levels[0].canDo[0]
    let p = completeLesson(emptyProgress('xx'), 'l1', ['a', 'b', 'c'], 1, T0)
    p = completeLesson(p, 'l2', ['d', 'e', 'f'], 1, T0)
    expect(canDoStatus(fixturePack, p, canDo)).toBe('practising')
    for (const id of ['a', 'b', 'c', 'd', 'e', 'f'])
      for (let d = 0; d < 2; d++)
        p = recordAnswer(p, { itemIds: [id], skill: 'recall', result: 'correct', now: T0 + (d * 3 + 1) * DAY })
    expect(canDoStatus(fixturePack, p, canDo)).toBe('demonstrated')
  })
})
