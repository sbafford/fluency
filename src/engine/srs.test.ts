import { describe, expect, it } from 'vitest'
import { addDays, DAY, itemStatus, review, startOfDay } from './srs'

const T0 = new Date(2026, 9, 27, 10, 0).getTime()

describe('review', () => {
  it('grows the interval over successive correct reviews on separate days', () => {
    let t = review(undefined, 'good', T0)
    expect(t.interval).toBe(1)
    expect(t.due).toBe(addDays(T0, 1))
    t = review(t, 'good', t.due + 1000)
    expect(t.interval).toBe(3)
    t = review(t, 'good', t.due + 1000)
    expect(t.interval).toBeGreaterThanOrEqual(6)
    expect(t.reps).toBe(3)
  })

  it('does not advance more than once on the same day', () => {
    let t = review(undefined, 'good', T0)
    t = review(t, 'good', T0 + 60_000)
    t = review(t, 'good', T0 + 120_000)
    expect(t.interval).toBe(1)
    expect(t.reps).toBe(1)
    expect(t.seen).toBe(3)
    expect(t.correct).toBe(3)
  })

  it('makes a forgotten item due immediately and counts one lapse', () => {
    let t = review(undefined, 'good', T0)
    t = review(t, 'good', t.due + 1000)
    const when = t.due + 1000
    t = review(t, 'again', when)
    expect(t.interval).toBe(0)
    expect(t.due).toBe(when)
    expect(t.lapses).toBe(1)
    t = review(t, 'again', when + 1000)
    expect(t.lapses).toBe(1)
  })

  it('does not count a first-time miss as a lapse', () => {
    const t = review(undefined, 'again', T0)
    expect(t.lapses).toBe(0)
    expect(t.seen).toBe(1)
    expect(t.correct).toBe(0)
  })

  it('relearns after a miss on the same day', () => {
    let t = review(undefined, 'again', T0)
    t = review(t, 'good', T0 + 60_000)
    expect(t.interval).toBe(1)
    expect(t.due).toBe(addDays(T0, 1))
  })

  it('lowers ease and shortens growth for hard answers', () => {
    const good = review(review(undefined, 'good', T0), 'good', addDays(T0, 1) + 1000)
    const hard = review(review(undefined, 'good', T0), 'hard', addDays(T0, 1) + 1000)
    expect(hard.interval).toBeLessThan(good.interval)
    expect(hard.ease).toBeLessThan(good.ease)
  })

  it('lands due dates at the start of a day', () => {
    const t = review(undefined, 'good', T0)
    expect(t.due).toBe(startOfDay(t.due))
    expect(t.due - startOfDay(T0)).toBeGreaterThanOrEqual(DAY - 2 * 3600_000)
  })
})

describe('itemStatus', () => {
  it('is new without tracks', () => {
    expect(itemStatus(undefined)).toBe('new')
  })
  it('is struggling with low accuracy', () => {
    const track = { due: T0, interval: 0, ease: 1.5, reps: 0, lapses: 1, seen: 5, correct: 2 }
    expect(itemStatus({ firstSeen: T0, tracks: { recall: track }, errors: {} })).toBe('struggling')
  })
  it('is mastered only with a long, repeated recall interval', () => {
    const recall = { due: T0, interval: 25, ease: 2.5, reps: 4, lapses: 0, seen: 4, correct: 4 }
    const recognition = { ...recall, interval: 60 }
    expect(itemStatus({ firstSeen: T0, tracks: { recall, recognition }, errors: {} })).toBe('mastered')
    expect(itemStatus({ firstSeen: T0, tracks: { recognition }, errors: {} })).toBe('learning')
  })
})
