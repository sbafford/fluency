import { dayLog } from './progress'
import { expandVariants } from './answers'
import { dayKey, isDue, itemStatus } from './srs'
import type {
  Exercise,
  LanguagePack,
  LearningItem,
  Lesson,
  ProgressState,
  ScheduledSkill,
  ScoredExercise,
  Settings,
  Unit,
} from './types'
import { SCHEDULED_SKILLS } from './types'

/* ------------------------------------------------------------------ */
/* Pack index                                                          */
/* ------------------------------------------------------------------ */

export interface PackIndex {
  pack: LanguagePack
  items: Map<string, LearningItem>
  lessonOfItem: Map<string, Lesson>
  unitOfLesson: Map<string, Unit>
  lessons: Lesson[]
}

const indexCache = new WeakMap<LanguagePack, PackIndex>()

export function indexPack(pack: LanguagePack): PackIndex {
  const cached = indexCache.get(pack)
  if (cached) return cached
  const items = new Map<string, LearningItem>()
  const lessonOfItem = new Map<string, Lesson>()
  const unitOfLesson = new Map<string, Unit>()
  const lessons: Lesson[] = []
  for (const unit of pack.units) {
    for (const lesson of unit.lessons) {
      lessons.push(lesson)
      unitOfLesson.set(lesson.id, unit)
      for (const item of lesson.items) {
        if (items.has(item.id)) throw new Error(`Duplicate item id ${item.id}`)
        items.set(item.id, item)
        lessonOfItem.set(item.id, lesson)
      }
    }
  }
  const index = { pack, items, lessonOfItem, unitOfLesson, lessons }
  indexCache.set(pack, index)
  return index
}

/* ------------------------------------------------------------------ */
/* Random helpers (seedable for tests)                                 */
/* ------------------------------------------------------------------ */

export type Rng = () => number

export function seededRng(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function shuffle<T>(list: readonly T[], rng: Rng = Math.random): T[] {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/* ------------------------------------------------------------------ */
/* Curriculum position                                                 */
/* ------------------------------------------------------------------ */

export function isScored(e: Exercise): e is ScoredExercise {
  return e.type !== 'dialogue' && e.type !== 'present' && e.type !== 'note'
}

/** The first lesson not yet completed, in curriculum order. */
export function nextLesson(pack: LanguagePack, progress: ProgressState): Lesson | undefined {
  return indexPack(pack).lessons.find((l) => !progress.lessons[l.id]?.completedAt)
}

/** Lessons are unlocked in order, so the curriculum's intended progression is kept. */
export function isUnlocked(pack: LanguagePack, progress: ProgressState, lessonId: string): boolean {
  const { lessons } = indexPack(pack)
  const i = lessons.findIndex((l) => l.id === lessonId)
  if (i <= 0) return i === 0
  return lessons.slice(0, i).every((l) => !!progress.lessons[l.id]?.completedAt)
}

/** A unit is reached once its first lesson is open, so its listening and conversations make sense. */
export function unitReached(pack: LanguagePack, progress: ProgressState, unitId: string): boolean {
  const unit = pack.units.find((u) => u.id === unitId)
  return !!unit?.lessons[0] && isUnlocked(pack, progress, unit.lessons[0].id)
}

/* ------------------------------------------------------------------ */
/* Revision queue                                                      */
/* ------------------------------------------------------------------ */

export interface DueTrack {
  itemId: string
  skill: ScheduledSkill
  overdueMs: number
  struggling: boolean
}

export function dueTracks(pack: LanguagePack, progress: ProgressState, now: number): DueTrack[] {
  const { items } = indexPack(pack)
  const due: DueTrack[] = []
  for (const [itemId, ip] of Object.entries(progress.items)) {
    if (!items.has(itemId)) continue // content removed since progress was saved
    const struggling = itemStatus(ip) === 'struggling'
    for (const skill of SCHEDULED_SKILLS) {
      const t = ip.tracks[skill]
      if (isDue(t, now)) due.push({ itemId, skill, overdueMs: now - t!.due, struggling })
    }
  }
  return due.sort((a, b) => Number(b.struggling) - Number(a.struggling) || b.overdueMs - a.overdueMs)
}

/** Core meanings of an item, ignoring notes like "(formal)", so near-synonyms are never offered as wrong answers. */
function meanings(item: LearningItem): Set<string> {
  return new Set(
    [item.native, ...(item.acceptNative ?? [])].map((m) =>
      m.toLowerCase().replace(/\(.*?\)/g, '').replace(/[^\p{L}\p{N}' ]/gu, '').replace(/\s+/g, ' ').trim(),
    ),
  )
}

function pickDistractors(
  index: PackIndex,
  progress: ProgressState,
  item: LearningItem,
  field: 'target' | 'native',
  rng: Rng,
  count = 3,
): string[] {
  const mine = meanings(item)
  const all = [...index.items.values()].filter(
    (o) => o.id !== item.id && o[field] !== item[field] && ![...meanings(o)].some((m) => mine.has(m)),
  )
  const known = all.filter((o) => progress.items[o.id])
  const sameKind = (list: LearningItem[]) => list.filter((o) => o.kind === item.kind)
  const ordered = [
    ...shuffle(sameKind(known), rng),
    ...shuffle(known, rng),
    ...shuffle(sameKind(all), rng),
    ...shuffle(all, rng),
  ]
  const picked: string[] = []
  for (const o of ordered) {
    if (picked.length >= count) break
    if (!picked.includes(o[field])) picked.push(o[field])
  }
  return picked
}

function exampleWithGap(item: LearningItem, rng: Rng): { context: string; prompt: string } | undefined {
  // Longest first, so "australienne" is matched before "australien".
  const variants = [item.target, ...(item.accept ?? [])].flatMap(expandVariants).sort((a, b) => b.length - a.length)
  const usable = (item.examples ?? [])
    .map((ex) => {
      const lower = ex.target.toLowerCase()
      const v = variants.find((x) => lower.includes(x.toLowerCase()))
      if (!v) return undefined
      const i = lower.indexOf(v.toLowerCase())
      return { context: ex.target.slice(0, i) + '___' + ex.target.slice(i + v.length), prompt: ex.native }
    })
    .filter((x): x is { context: string; prompt: string } => !!x)
  if (!usable.length) return undefined
  return usable[Math.floor(rng() * usable.length)]
}

/** Create a fresh exercise for one item and skill, varying direction and context. */
export function generateExercise(
  pack: LanguagePack,
  progress: ProgressState,
  itemId: string,
  skill: ScheduledSkill,
  rng: Rng = Math.random,
): ScoredExercise {
  const index = indexPack(pack)
  const item = index.items.get(itemId)
  if (!item) throw new Error(`Unknown item ${itemId}`)
  const id = `review.${itemId}.${skill}.${Math.floor(rng() * 1e9)}`
  const answers = [item.target, ...(item.accept ?? [])]
  const reps = progress.items[itemId]?.tracks[skill]?.reps ?? 0

  if (skill === 'recognition') {
    const fromTarget = rng() < 0.5
    const field = fromTarget ? 'native' : 'target'
    const answer = item[field]
    return {
      id,
      type: 'choose',
      itemIds: [itemId],
      prompt: fromTarget ? item.target : item.native,
      promptLang: fromTarget ? 'target' : 'native',
      answer,
      options: shuffle([answer, ...pickDistractors(index, progress, item, field, rng)], rng),
    }
  }

  if (skill === 'recall') {
    // Once an item has been recalled before, prefer a new sentence context over the bare prompt.
    const gap = reps >= 1 && rng() < 0.7 ? exampleWithGap(item, rng) : undefined
    if (gap) return { id, type: 'type', itemIds: [itemId], prompt: gap.prompt, context: gap.context, answers }
    return { id, type: 'type', itemIds: [itemId], prompt: item.native, answers, hint: item.note }
  }

  // Listening
  const example = item.examples?.length && reps >= 1 && rng() < 0.5 ? item.examples[Math.floor(rng() * item.examples.length)] : undefined
  if (example) {
    const others = [...index.items.values()].flatMap((o) => (o.id === itemId ? [] : (o.examples ?? [])))
    const distractors = shuffle(others, rng)
      .map((o) => o.native)
      .filter((n, i, a) => n !== example.native && a.indexOf(n) === i)
      .slice(0, 3)
    if (distractors.length === 3)
      return {
        id,
        type: 'listen-choose',
        itemIds: [itemId],
        audio: example.target,
        answer: example.native,
        options: shuffle([example.native, ...distractors], rng),
      }
  }
  if (item.target.split(' ').length <= 5)
    return { id, type: 'dictation', itemIds: [itemId], audio: expandVariants(item.target)[0], translation: item.native, answers }
  return {
    id,
    type: 'listen-choose',
    itemIds: [itemId],
    audio: expandVariants(item.target)[0],
    answer: item.native,
    options: shuffle([item.native, ...pickDistractors(index, progress, item, 'native', rng)], rng),
  }
}

/**
 * Build a revision session from due material. Struggling items come first,
 * then the most overdue. The same item never appears twice in a row.
 */
export function buildReview(
  pack: LanguagePack,
  progress: ProgressState,
  now: number,
  limit = 20,
  rng: Rng = Math.random,
): ScoredExercise[] {
  const due = dueTracks(pack, progress, now).slice(0, limit)
  // Group by item (keeping priority order), then interleave so the same item
  // is never asked twice in a row while another item is available.
  const groups = new Map<string, DueTrack[]>()
  for (const d of due) groups.set(d.itemId, [...(groups.get(d.itemId) ?? []), d])
  const order = [...groups.keys()]
  const ordered: DueTrack[] = []
  while (ordered.length < due.length) {
    const last = ordered[ordered.length - 1]?.itemId
    const candidates = order.filter((id) => groups.get(id)!.length > 0)
    const options = candidates.filter((id) => id !== last)
    const pool = options.length ? options : candidates
    const pick = pool.reduce((a, b) => (groups.get(b)!.length > groups.get(a)!.length ? b : a))
    ordered.push(groups.get(pick)!.shift()!)
  }
  return ordered.map((d) => generateExercise(pack, progress, d.itemId, d.skill, rng))
}

/**
 * Extra practice when nothing is due: the weakest items the learner has met,
 * on their weakest skill.
 */
export function buildExtraPractice(
  pack: LanguagePack,
  progress: ProgressState,
  limit = 10,
  rng: Rng = Math.random,
): ScoredExercise[] {
  const { items } = indexPack(pack)
  const scored = Object.entries(progress.items)
    .filter(([id]) => items.has(id))
    .flatMap(([itemId, ip]) =>
      SCHEDULED_SKILLS.filter((s) => ip.tracks[s]).map((skill) => {
        const t = ip.tracks[skill]!
        // Unpractised skills are not evidence of weakness, so they rank behind actual misses.
        const accuracy = t.seen ? t.correct / t.seen : 0.75
        return { itemId, skill, weight: accuracy + t.interval / 60 + rng() * 0.1 }
      }),
    )
    .sort((a, b) => a.weight - b.weight)
  const chosen: typeof scored = []
  for (const s of scored) {
    if (chosen.length >= limit) break
    if (!chosen.some((c) => c.itemId === s.itemId)) chosen.push(s)
  }
  return chosen.map((c) => generateExercise(pack, progress, c.itemId, c.skill, rng))
}

/* ------------------------------------------------------------------ */
/* Today                                                               */
/* ------------------------------------------------------------------ */

export interface TodayPlan {
  /** Due reviews (an item can have several skills due). */
  dueCount: number
  /** Distinct words and phrases with something due. */
  dueItems: number
  next?: Lesson
  nextUnit?: Unit
  answeredToday: number
  goal: number
  goalMet: boolean
  /** Days with any practice in the last seven, including today. */
  activeDaysThisWeek: number
  /** Consecutive days with practice, ending today or yesterday. */
  streak: number
  recommendation: 'revise' | 'lesson' | 'practise'
}

export function todayPlan(pack: LanguagePack, progress: ProgressState, settings: Settings, now: number): TodayPlan {
  const due = dueTracks(pack, progress, now)
  const dueCount = due.length
  const dueItems = new Set(due.map((d) => d.itemId)).size
  const next = nextLesson(pack, progress)
  const answeredToday = dayLog(progress, dayKey(now)).answered

  const active = (offset: number) => {
    const d = new Date(now)
    d.setDate(d.getDate() - offset)
    return dayLog(progress, dayKey(d.getTime())).answered > 0
  }
  let activeDaysThisWeek = 0
  for (let i = 0; i < 7; i++) if (active(i)) activeDaysThisWeek++
  let streak = 0
  for (let i = active(0) ? 0 : 1; active(i); i++) streak++

  // Revise first when a backlog builds up, so new material does not crowd out retention.
  const recommendation: TodayPlan['recommendation'] =
    dueCount >= 12 ? 'revise' : next ? 'lesson' : dueCount > 0 ? 'revise' : 'practise'

  return {
    dueCount,
    dueItems,
    next,
    nextUnit: next ? indexPack(pack).unitOfLesson.get(next.id) : undefined,
    answeredToday,
    goal: settings.dailyGoal,
    goalMet: answeredToday >= settings.dailyGoal,
    activeDaysThisWeek,
    streak,
    recommendation,
  }
}
