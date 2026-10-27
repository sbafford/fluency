import { describe, expect, it } from 'vitest'
import { mergeProgress } from './merge'
import { completeLesson, dayLog, emptyProgress, recordAnswer } from './progress'
import { todayPlan } from './session'
import { dayKey, DAY } from './srs'
import { DEFAULT_SETTINGS } from './storage'
import { fixturePack } from '../test/fixture'

const T0 = new Date(2026, 9, 27, 10, 0).getTime()

function phone() {
  let p = emptyProgress('xx', 'phone')
  p = completeLesson(p, 'l1', ['a', 'b', 'c'], 0.8, T0)
  p = recordAnswer(p, { itemIds: ['a'], skill: 'recall', result: 'correct', now: T0 })
  return p
}

function laptop() {
  let p = emptyProgress('xx', 'laptop')
  p = recordAnswer(p, { itemIds: ['a'], skill: 'recall', result: 'wrong', now: T0 + DAY })
  p = recordAnswer(p, { itemIds: ['b'], skill: 'recognition', result: 'correct', now: T0 + DAY })
  p = completeLesson(p, 'l1', ['a', 'b', 'c'], 1, T0 + DAY)
  return p
}

describe('mergeProgress', () => {
  it('keeps the most recently reviewed copy of each skill', () => {
    const m = mergeProgress(phone(), laptop())
    expect(m.items.a.tracks.recall?.last).toBe(T0 + DAY)
    expect(m.items.a.tracks.recall?.interval).toBe(0) // the later miss wins
    expect(m.items.b.tracks.recognition?.last).toBe(T0 + DAY)
  })

  it('keeps the best score, most attempts and earliest completion', () => {
    const m = mergeProgress(phone(), laptop())
    expect(m.lessons.l1).toMatchObject({ bestScore: 1, attempts: 1, completedAt: T0 })
  })

  it('adds up daily activity across devices without double counting', () => {
    const a = phone()
    const b = laptop()
    const m = mergeProgress(a, b)
    expect(dayLog(m, dayKey(T0)).answered).toBe(1)
    expect(dayLog(m, dayKey(T0 + DAY)).answered).toBe(2)
    // Merging again, in either direction, changes nothing.
    const again = mergeProgress(mergeProgress(m, b), a)
    expect(dayLog(again, dayKey(T0 + DAY)).answered).toBe(2)
    expect(again.recent).toHaveLength(m.recent.length)
  })

  it('counts the same day on two devices once each', () => {
    let a = emptyProgress('xx', 'phone')
    let b = emptyProgress('xx', 'laptop')
    a = recordAnswer(a, { itemIds: ['a'], skill: 'recall', result: 'correct', now: T0 })
    b = recordAnswer(b, { itemIds: ['b'], skill: 'recall', result: 'correct', now: T0 + 1000 })
    const m = mergeProgress(a, b)
    expect(dayLog(m, dayKey(T0)).answered).toBe(2)
    expect(todayPlan(fixturePack, m, DEFAULT_SETTINGS, T0 + 2000).answeredToday).toBe(2)
  })

  it('belongs to the local device and is order independent for items', () => {
    const ab = mergeProgress(phone(), laptop())
    const ba = mergeProgress(laptop(), phone())
    expect(ab.device).toBe('phone')
    expect(ba.device).toBe('laptop')
    expect(ab.items).toEqual(ba.items)
    expect(ab.lessons).toEqual(ba.lessons)
  })

  it('keeps the newer log when the same device appears on both sides', () => {
    let older = emptyProgress('xx', 'phone')
    older = recordAnswer(older, { itemIds: ['a'], skill: 'recall', result: 'correct', now: T0 })
    const newer = recordAnswer(older, { itemIds: ['b'], skill: 'recall', result: 'correct', now: T0 + 1000 })
    expect(dayLog(mergeProgress(older, newer), dayKey(T0)).answered).toBe(2)
    expect(dayLog(mergeProgress(newer, older), dayKey(T0)).answered).toBe(2)
  })
})
