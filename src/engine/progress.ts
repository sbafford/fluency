import { addDays, dayKey, gradeFor, isSameDay, newTrack, review } from './srs'
import type {
  ActivityProgress,
  AnswerResult,
  DayLog,
  ErrorType,
  ItemProgress,
  ProgressState,
  Skill,
} from './types'

/*
 * Pure functions that update learner progress. The UI never mutates progress
 * directly; it calls these and stores the result.
 */

export const RECENT_LIMIT = 1000

export function emptyProgress(languageId: string, device = 'local'): ProgressState {
  return { languageId, device, items: {}, lessons: {}, listening: {}, conversations: {}, days: {}, recent: [] }
}

export function emptyDay(): DayLog {
  return { answered: 0, correct: 0, lessons: 0, reviews: 0, activeMs: 0 }
}

function withDay(p: ProgressState, now: number, update: (d: DayLog) => DayLog): ProgressState {
  const key = dayKey(now)
  const mine = p.days[p.device] ?? {}
  return { ...p, days: { ...p.days, [p.device]: { ...mine, [key]: update(mine[key] ?? emptyDay()) } } }
}

/** Activity for one date, summed across every device that has synced. */
export function dayLog(p: ProgressState, key: string): DayLog {
  const total = emptyDay()
  for (const perDevice of Object.values(p.days)) {
    const d = perDevice[key]
    if (!d) continue
    total.answered += d.answered
    total.correct += d.correct
    total.lessons += d.lessons
    total.reviews += d.reviews
    total.activeMs += d.activeMs
  }
  return total
}

export function totalActiveMs(p: ProgressState): number {
  let ms = 0
  for (const perDevice of Object.values(p.days)) for (const d of Object.values(perDevice)) ms += d.activeMs
  return ms
}

export interface AnswerEvent {
  itemIds: string[]
  skill: Skill
  result: AnswerResult
  errorType?: ErrorType
  hinted?: boolean
  /** Whether this answer came from a revision session rather than a lesson. */
  review?: boolean
  now: number
}

export function recordAnswer(p: ProgressState, e: AnswerEvent): ProgressState {
  const grade = gradeFor(e.result, e.hinted)
  const items = { ...p.items }
  let retention = false
  for (const id of e.itemIds) {
    const prev: ItemProgress = items[id] ?? { firstSeen: e.now, tracks: {}, errors: {} }
    const prevTrack = prev.tracks[e.skill]
    if (prevTrack?.last !== undefined && !isSameDay(prevTrack.last, e.now)) retention = true
    const errors = { ...prev.errors }
    if (e.errorType) errors[e.errorType] = (errors[e.errorType] ?? 0) + 1
    items[id] = { ...prev, tracks: { ...prev.tracks, [e.skill]: review(prevTrack, grade, e.now) }, errors }
  }
  const recent = [
    ...p.recent,
    { t: e.now, itemIds: e.itemIds, skill: e.skill, result: e.result, errorType: e.errorType, retention },
  ].slice(-RECENT_LIMIT)
  return withDay({ ...p, items, recent }, e.now, (d) => ({
    ...d,
    answered: d.answered + 1,
    correct: d.correct + (e.result === 'wrong' ? 0 : 1),
    reviews: d.reviews + (e.review ? 1 : 0),
  }))
}

/**
 * Make sure every item taught in a lesson is in the revision system, even if a
 * particular skill was not tested in the lesson itself. Untested skills become
 * due the next day.
 */
export function enrolItems(p: ProgressState, itemIds: string[], now: number): ProgressState {
  const items = { ...p.items }
  // Staggered so a lesson's material doesn't all fall due on the same day:
  // recall first (hardest), then listening, then recognition (easiest).
  const offsets = { recall: 1, listening: 2, recognition: 3 } as const
  for (const id of itemIds) {
    const prev: ItemProgress = items[id] ?? { firstSeen: now, tracks: {}, errors: {} }
    const tracks = { ...prev.tracks }
    for (const s of ['recognition', 'recall', 'listening'] as const)
      if (!tracks[s]) tracks[s] = { ...newTrack(now), due: addDays(now, offsets[s]) }
    items[id] = { ...prev, tracks }
  }
  return { ...p, items }
}

export function completeLesson(
  p: ProgressState,
  lessonId: string,
  itemIds: string[],
  score: number,
  now: number,
): ProgressState {
  const prev = p.lessons[lessonId] ?? { attempts: 0, bestScore: 0, lastScore: 0 }
  const lessons = {
    ...p.lessons,
    [lessonId]: {
      attempts: prev.attempts + 1,
      completedAt: prev.completedAt ?? now,
      bestScore: Math.max(prev.bestScore, score),
      lastScore: score,
    },
  }
  const enrolled = enrolItems({ ...p, lessons }, itemIds, now)
  return withDay(enrolled, now, (d) => ({ ...d, lessons: d.lessons + 1 }))
}

function completeActivity(
  map: Record<string, ActivityProgress>,
  id: string,
  score: number,
  now: number,
): Record<string, ActivityProgress> {
  const prev = map[id] ?? { attempts: 0, bestScore: 0 }
  return {
    ...map,
    [id]: { attempts: prev.attempts + 1, completedAt: prev.completedAt ?? now, bestScore: Math.max(prev.bestScore, score) },
  }
}

export function completeListening(p: ProgressState, id: string, score: number, now: number): ProgressState {
  return { ...p, listening: completeActivity(p.listening, id, score, now) }
}

export function completeConversation(p: ProgressState, id: string, score: number, now: number): ProgressState {
  return { ...p, conversations: completeActivity(p.conversations, id, score, now) }
}

/** Add active study time, capped per call so an idle tab does not inflate it. */
export function addActiveTime(p: ProgressState, ms: number, now: number): ProgressState {
  const capped = Math.max(0, Math.min(ms, 2 * 60 * 1000))
  if (!capped) return p
  return withDay(p, now, (d) => ({ ...d, activeMs: d.activeMs + capped }))
}
