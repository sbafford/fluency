import type { AnswerResult, Grade, ItemProgress, ScheduledSkill, Track } from './types'
import { SCHEDULED_SKILLS } from './types'

/*
 * Spaced repetition.
 *
 * A simplified SM-2 scheduler, applied separately to each skill of each item,
 * so "I recognise bonjour" and "I can produce bonjour" are scheduled
 * independently. The scheduler only advances an interval once per day: drilling
 * the same item five times in one lesson does not push it a month away.
 */

export const DAY = 24 * 60 * 60 * 1000
const MIN_EASE = 1.3
const MAX_EASE = 3.0
const START_EASE = 2.3

export function startOfDay(t: number): number {
  const d = new Date(t)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

/** Add whole calendar days, landing at the start of that day (robust to daylight saving changes). */
export function addDays(t: number, days: number): number {
  const d = new Date(startOfDay(t))
  d.setDate(d.getDate() + days)
  return d.getTime()
}

export function dayKey(t: number): string {
  const d = new Date(t)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export function isSameDay(a: number, b: number): boolean {
  return startOfDay(a) === startOfDay(b)
}

export function gradeFor(result: AnswerResult, hinted = false): Grade {
  if (result === 'wrong') return 'again'
  if (result === 'near' || hinted) return 'hard'
  return 'good'
}

export function newTrack(now: number): Track {
  return { due: now, interval: 0, ease: START_EASE, reps: 0, lapses: 0, seen: 0, correct: 0 }
}

/** Apply one graded answer to a track and return the updated track. */
export function review(track: Track | undefined, grade: Grade, now: number): Track {
  const t: Track = { ...(track ?? newTrack(now)) }
  const reviewedToday = t.last !== undefined && isSameDay(t.last, now)
  t.seen += 1
  if (grade !== 'again') t.correct += 1

  if (grade === 'again') {
    // One lapse per day at most; repeated misses in a session are already captured in `seen`.
    // interval 0 with a review today means the previous answer today was also a miss.
    const alreadyMissedToday = reviewedToday && t.interval === 0
    if (!alreadyMissedToday) {
      // A lapse means forgetting something that had been learned.
      if (t.reps > 0) t.lapses += 1
      t.ease = Math.max(MIN_EASE, t.ease - 0.2)
    }
    t.reps = 0
    t.interval = 0
    t.due = now // due again straight away, so it returns in this session or today's revision
    t.last = now
    return t
  }

  if (reviewedToday && t.interval > 0) {
    // Already advanced today: count the practice, keep the schedule.
    t.last = now
    return t
  }

  if (grade === 'hard') {
    t.ease = Math.max(MIN_EASE, t.ease - 0.15)
    t.interval = t.reps === 0 ? 1 : Math.max(1, Math.round(t.interval * 1.2))
  } else {
    if (t.reps === 0) t.interval = 1
    else if (t.reps === 1) t.interval = 3
    else t.interval = Math.round(t.interval * t.ease)
    t.ease = Math.min(MAX_EASE, t.ease + 0.05)
  }
  t.reps += 1
  t.due = addDays(now, t.interval)
  t.last = now
  return t
}

export function isDue(track: Track | undefined, now: number): boolean {
  return !!track && track.due <= now
}

export type ItemStatus = 'new' | 'learning' | 'struggling' | 'mastered'

/**
 * Where an item stands overall.
 * - mastered: recalled correctly on separate days with an interval of three weeks or more
 * - struggling: repeated lapses, or under 60% accuracy once it has been tried a few times
 * - learning: seen but not yet mastered
 */
export function itemStatus(item: ItemProgress | undefined): ItemStatus {
  if (!item) return 'new'
  const tracks = SCHEDULED_SKILLS.map((s) => item.tracks[s]).filter((t): t is Track => !!t)
  if (!tracks.length) return 'new'
  const seen = tracks.reduce((n, t) => n + t.seen, 0)
  const correct = tracks.reduce((n, t) => n + t.correct, 0)
  const lapses = tracks.reduce((n, t) => n + t.lapses, 0)
  const recall = item.tracks.recall
  if (recall && recall.interval >= 21 && recall.reps >= 3) return 'mastered'
  if (lapses >= 3 || (seen >= 4 && correct / seen < 0.6)) return 'struggling'
  return 'learning'
}

/** How strongly an item is known for one skill, 0 to 1, for display only. */
export function strength(track: Track | undefined): number {
  if (!track || track.reps === 0) return 0
  return Math.min(1, Math.log2(1 + track.interval) / Math.log2(1 + 30))
}

export function scheduledSkills(): readonly ScheduledSkill[] {
  return SCHEDULED_SKILLS
}
