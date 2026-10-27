import { dayLog } from './progress'
import { DAY, dayKey, itemStatus, type ItemStatus } from './srs'
import { indexPack } from './session'
import type { CanDo, ErrorType, LanguagePack, LevelDefinition, ProgressState, Skill } from './types'

/*
 * Progress measures. These deliberately favour evidence of retention
 * (correct answers on later days) over activity counts like streaks.
 */

export interface SkillSummary {
  skill: Skill
  attempts: number
  /** Accuracy over the last 30 days, or undefined if fewer than 5 attempts. */
  accuracy?: number
  /** Accuracy on retention tests: answers about items first met on an earlier day. */
  retention?: number
}

export function skillSummaries(p: ProgressState, now: number): SkillSummary[] {
  const since = now - 30 * DAY
  const recent = p.recent.filter((a) => a.t >= since)
  return (['listening', 'speaking', 'recognition', 'recall'] as Skill[]).map((skill) => {
    const mine = recent.filter((a) => a.skill === skill)
    const ret = mine.filter((a) => a.retention)
    const rate = (list: typeof mine) =>
      list.length >= 5 ? list.filter((a) => a.result !== 'wrong').length / list.length : undefined
    return { skill, attempts: mine.length, accuracy: rate(mine), retention: rate(ret) }
  })
}

export function statusCounts(pack: LanguagePack, p: ProgressState): Record<ItemStatus, number> {
  const counts: Record<ItemStatus, number> = { new: 0, learning: 0, struggling: 0, mastered: 0 }
  for (const id of indexPack(pack).items.keys()) counts[itemStatus(p.items[id])]++
  return counts
}

export const ERROR_LABELS: Record<ErrorType, string> = {
  accent: 'Missing or wrong accents',
  typo: 'Small spelling slips',
  article: 'Wrong article',
  gender: 'Masculine or feminine form',
  'word-order': 'Word order',
  'missing-word': 'Missing a word',
  'extra-word': 'An extra word',
  'wrong-word': 'Wrong word',
  meaning: 'Meaning misunderstood',
}

export function topErrors(p: ProgressState, now: number, limit = 4): { type: ErrorType; count: number }[] {
  const since = now - 30 * DAY
  const counts = new Map<ErrorType, number>()
  for (const a of p.recent) if (a.t >= since && a.errorType) counts.set(a.errorType, (counts.get(a.errorType) ?? 0) + 1)
  return [...counts.entries()]
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

/** Items answered wrongly most often, for targeted revision. */
export function troubleItems(pack: LanguagePack, p: ProgressState, limit = 6) {
  const { items } = indexPack(pack)
  return Object.entries(p.items)
    .filter(([id]) => items.has(id))
    .map(([id, ip]) => {
      const tracks = Object.values(ip.tracks)
      const seen = tracks.reduce((n, t) => n + (t?.seen ?? 0), 0)
      const misses = seen - tracks.reduce((n, t) => n + (t?.correct ?? 0), 0)
      return { item: items.get(id)!, misses, seen, status: itemStatus(ip) }
    })
    .filter((x) => x.misses > 0)
    .sort((a, b) => b.misses - a.misses || a.seen - b.seen)
    .slice(0, limit)
}

export type CanDoState = 'not-started' | 'practising' | 'demonstrated'

/**
 * A can-do statement is demonstrated when every lesson teaching it has been
 * completed with at least 80%, and the items from those lessons have been
 * recalled correctly on a later day. Completing lessons alone is not enough.
 */
export function canDoStatus(pack: LanguagePack, p: ProgressState, canDo: CanDo): CanDoState {
  const lessons = indexPack(pack).lessons.filter((l) => l.canDo.includes(canDo.id))
  if (!lessons.length) return 'not-started'
  const touched = lessons.some((l) => p.lessons[l.id]?.completedAt)
  if (!touched) return 'not-started'
  const allPassed = lessons.every((l) => (p.lessons[l.id]?.bestScore ?? 0) >= 0.8)
  const items = lessons.flatMap((l) => l.items)
  const retained = items.filter((i) => (p.items[i.id]?.tracks.recall?.reps ?? 0) >= 2).length
  return allPassed && items.length > 0 && retained / items.length >= 0.8 ? 'demonstrated' : 'practising'
}

export function levelSummary(pack: LanguagePack, p: ProgressState, level: LevelDefinition) {
  const states = level.canDo.map((c) => ({ canDo: c, state: canDoStatus(pack, p, c) }))
  return {
    states,
    demonstrated: states.filter((s) => s.state === 'demonstrated').length,
    covered: states.filter((s) => indexPack(pack).lessons.some((l) => l.canDo.includes(s.canDo.id))).length,
  }
}

/** Daily answered counts for the last n days, oldest first. */
export function recentDays(p: ProgressState, now: number, n = 14) {
  const out: { key: string; answered: number; correct: number }[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = dayKey(d.getTime())
    const log = dayLog(p, key)
    out.push({ key, answered: log?.answered ?? 0, correct: log?.correct ?? 0 })
  }
  return out
}
