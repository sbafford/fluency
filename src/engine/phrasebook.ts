import { normalise, stripAccents } from './answers'
import { isUnlocked } from './session'
import { itemStatus, type ItemStatus } from './srs'
import type { CultureNote, GrammarNote, LanguagePack, LearningItem, ProgressState } from './types'

/*
 * The phrasebook: everything taught in the course, unit by unit and lesson by
 * lesson, with how well each word is known. Read-only; it never changes progress.
 */

export type PhrasebookScope = 'met' | 'shaky' | 'all'

export interface PhrasebookEntry {
  item: LearningItem
  status: ItemStatus
  /** Met at least once in a lesson or revision. */
  met: boolean
}

export interface PhrasebookLesson {
  id: string
  title: string
  subtitle: string
  /** Open to start (all earlier lessons finished), so nothing in it is a spoiler. */
  open: boolean
  entries: PhrasebookEntry[]
  notes: GrammarNote[]
  culture?: CultureNote
}

export interface PhrasebookUnit {
  id: string
  number: number
  title: string
  subtitle: string
  lessons: PhrasebookLesson[]
}

export interface PhrasebookCounts {
  met: number
  shaky: number
  all: number
}

/** Lower case, no accents, apostrophes or punctuation: "S'il vous plaît" and "sil vous plait" match. */
const fold = (s: string) => stripAccents(normalise(s)).replace(/'/g, '')

/** The word itself, in either language. */
function directMatch(item: LearningItem, q: string): boolean {
  return [item.target, item.native, ...(item.accept ?? []), ...(item.acceptNative ?? [])].some((text) => fold(text).includes(q))
}

/** The word, or its note or example sentences. */
function broadMatch(item: LearningItem, q: string): boolean {
  return directMatch(item, q) || [item.note ?? '', ...(item.examples ?? []).flatMap((e) => [e.target, e.native])].some((text) => fold(text).includes(q))
}

function noteMatches(note: GrammarNote, q: string): boolean {
  return [note.title, ...note.body, ...(note.table?.rows.flat() ?? [])].some((text) => fold(text).includes(q))
}

export function phrasebookCounts(pack: LanguagePack, progress: ProgressState): PhrasebookCounts {
  let met = 0
  let shaky = 0
  let all = 0
  for (const unit of pack.units)
    for (const lesson of unit.lessons)
      for (const item of lesson.items) {
        all++
        if (progress.items[item.id]) met++
        if (itemStatus(progress.items[item.id]) === 'struggling') shaky++
      }
  return { met, shaky, all }
}

/**
 * The phrasebook for a scope and an optional search. Lessons and units with
 * nothing to show are left out. Grammar and culture notes appear for lessons
 * you have reached ("met" and "all") and, when searching, wherever they match.
 */
export function buildPhrasebook(pack: LanguagePack, progress: ProgressState, scope: PhrasebookScope, query = ''): PhrasebookUnit[] {
  const q = fold(query.trim())
  // Searching "merci" should find merci, not every example sentence that says merci.
  // Notes and examples are searched only when no word matches directly.
  const anyDirect = !!q && pack.units.some((u) => u.lessons.some((l) => l.items.some((i) => directMatch(i, q))))
  const itemMatches = anyDirect ? directMatch : broadMatch
  const units: PhrasebookUnit[] = []
  pack.units.forEach((unit, u) => {
    const lessons: PhrasebookLesson[] = []
    for (const lesson of unit.lessons) {
      if (lesson.kind === 'checkpoint') continue
      const open = isUnlocked(pack, progress, lesson.id)
      const entries = lesson.items
        .map((item) => ({ item, status: itemStatus(progress.items[item.id]), met: !!progress.items[item.id] }))
        .filter((e) => (scope === 'met' ? e.met : scope === 'shaky' ? e.status === 'struggling' : true))
        .filter((e) => !q || itemMatches(e.item, q))
      const showNotes = scope === 'all' || (scope === 'met' && (open || lesson.items.some((i) => progress.items[i.id])))
      const notes = showNotes ? lesson.notes.filter((n) => !q || (anyDirect ? fold(n.title).includes(q) : noteMatches(n, q))) : []
      const cultureHit = (t: string[]) => t.some((x) => fold(x).includes(q))
      const culture =
        showNotes && lesson.culture && (!q || cultureHit(anyDirect ? [lesson.culture.title] : [lesson.culture.title, ...lesson.culture.body])) ? lesson.culture : undefined
      if (!entries.length && !notes.length && !culture) continue
      lessons.push({ id: lesson.id, title: lesson.title, subtitle: lesson.subtitle, open, entries, notes, culture })
    }
    if (lessons.length) units.push({ id: unit.id, number: u + 1, title: unit.title, subtitle: unit.subtitle, lessons })
  })
  return units
}
