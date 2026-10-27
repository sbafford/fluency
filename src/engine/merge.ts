import type { ActivityProgress, Attempt, ItemProgress, LessonProgress, ProgressState, Track } from './types'
import { RECENT_LIMIT } from './progress'

/*
 * Merging progress from two devices.
 *
 * The rules are chosen so merging is safe to repeat (merging the same data
 * twice changes nothing) and order doesn't matter:
 * - Each skill of each item keeps the copy reviewed most recently.
 * - Lessons and activities keep the best score, the most attempts and the earliest completion.
 * - Daily logs are stored per device, so each device's own log is kept whole.
 * - Recent answers are combined, without duplicates.
 * The result always belongs to the local device.
 */

function newerTrack(a: Track | undefined, b: Track | undefined): Track | undefined {
  if (!a) return b
  if (!b) return a
  const la = a.last ?? -1
  const lb = b.last ?? -1
  if (la !== lb) return la > lb ? a : b
  // Same moment (or never reviewed): prefer the one with more history, then the earlier due date.
  if (a.seen !== b.seen) return a.seen > b.seen ? a : b
  return a.due <= b.due ? a : b
}

function mergeItem(a: ItemProgress | undefined, b: ItemProgress | undefined): ItemProgress {
  if (!a) return b!
  if (!b) return a
  const tracks: ItemProgress['tracks'] = {}
  for (const skill of new Set([...Object.keys(a.tracks), ...Object.keys(b.tracks)]) as Set<keyof ItemProgress['tracks']>) {
    const t = newerTrack(a.tracks[skill], b.tracks[skill])
    if (t) tracks[skill] = t
  }
  // Error counts can't be split by device after the fact, so keep the larger count of each kind.
  const errors: ItemProgress['errors'] = { ...a.errors }
  for (const [k, v] of Object.entries(b.errors) as [keyof ItemProgress['errors'], number][]) errors[k] = Math.max(errors[k] ?? 0, v)
  return { firstSeen: Math.min(a.firstSeen, b.firstSeen), tracks, errors }
}

function minDefined(a?: number, b?: number): number | undefined {
  if (a === undefined) return b
  if (b === undefined) return a
  return Math.min(a, b)
}

function mergeLesson(a: LessonProgress | undefined, b: LessonProgress | undefined): LessonProgress {
  if (!a) return b!
  if (!b) return a
  // The copy with more attempts is the later one; on a tie, pick deterministically so merge order doesn't matter.
  const latest = a.attempts !== b.attempts ? (a.attempts > b.attempts ? a : b) : a.lastScore >= b.lastScore ? a : b
  return {
    attempts: Math.max(a.attempts, b.attempts),
    completedAt: minDefined(a.completedAt, b.completedAt),
    bestScore: Math.max(a.bestScore, b.bestScore),
    lastScore: latest.lastScore,
  }
}

function mergeActivity(a: ActivityProgress | undefined, b: ActivityProgress | undefined): ActivityProgress {
  if (!a) return b!
  if (!b) return a
  return {
    attempts: Math.max(a.attempts, b.attempts),
    completedAt: minDefined(a.completedAt, b.completedAt),
    bestScore: Math.max(a.bestScore, b.bestScore),
  }
}

function mergeMap<T>(a: Record<string, T>, b: Record<string, T>, fn: (x: T | undefined, y: T | undefined) => T) {
  const out: Record<string, T> = {}
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) out[k] = fn(a[k], b[k])
  return out
}

const attemptKey = (x: Attempt) => `${x.t}|${x.skill}|${x.result}|${x.itemIds.join(',')}`

export function mergeProgress(local: ProgressState, remote: ProgressState): ProgressState {
  // Daily logs: each device owns its own entries. For our own device, keep whichever copy has more activity.
  const days: ProgressState['days'] = { ...remote.days, ...local.days }
  for (const device of Object.keys(remote.days)) {
    if (!local.days[device]) continue
    days[device] = mergeMap(local.days[device], remote.days[device], (x, y) =>
      !x ? y! : !y ? x : x.answered + x.activeMs >= y.answered + y.activeMs ? x : y,
    )
  }

  const seen = new Set<string>()
  const recent = [...local.recent, ...remote.recent]
    .filter((x) => {
      const k = attemptKey(x)
      if (seen.has(k)) return false
      seen.add(k)
      return true
    })
    .sort((x, y) => x.t - y.t)
    .slice(-RECENT_LIMIT)

  return {
    languageId: local.languageId,
    device: local.device,
    items: mergeMap(local.items, remote.items, mergeItem),
    lessons: mergeMap(local.lessons, remote.lessons, mergeLesson),
    listening: mergeMap(local.listening, remote.listening, mergeActivity),
    conversations: mergeMap(local.conversations, remote.conversations, mergeActivity),
    days,
    recent,
  }
}
