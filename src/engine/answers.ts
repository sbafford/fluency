import type { AnswerResult, ErrorType } from './types'

/*
 * Answer checking.
 *
 * Typed answers are judged generously on surface details (case, punctuation,
 * apostrophe style, spacing) and precisely on things that change meaning
 * (wrong words, word order, articles). Missing accents and one-letter typos are
 * accepted as "near": counted as correct, but flagged so the learner sees the fix
 * and the error pattern is recorded.
 */

export interface CheckOptions {
  /** Groups of interchangeable articles, e.g. [["le","la","les","l'"],["un","une","des"]]. */
  articleGroups?: string[][]
  /** Translations into the learner's language are judged more leniently. */
  lang?: 'target' | 'native'
}

export interface CheckResult {
  result: AnswerResult
  errorType?: ErrorType
  /** The accepted answer closest to what was typed, for showing the correction. */
  expected: string
}

const PUNCTUATION = /[.,!?;:¡¿«»"“”()…]/g

/** Lower-case and strip formatting differences that never change meaning. */
export function normalise(input: string): string {
  return input
    .normalize('NFC')
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/-/g, ' ')
    .replace(PUNCTUATION, ' ')
    .replace(/'\s+/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

/** Remove diacritics and expand ligatures. */
export function stripAccents(input: string): string {
  return input
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
}

/**
 * Expand authored variants. "enchanté(e)" becomes ["enchanté", "enchantée"].
 * Only short parenthesised endings (up to 3 letters) are treated as optional.
 */
export function expandVariants(answer: string): string[] {
  const match = answer.match(/^(.*?)\((\p{L}{1,3})\)(.*)$/u)
  if (!match) return [answer]
  const [, before, optional, after] = match
  return [...expandVariants(before + after), ...expandVariants(before + optional + after)]
}

/** Edit distance where swapping two adjacent letters counts as one edit. */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
  for (let j = 0; j <= b.length; j++) d[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1)
    }
  }
  return d[a.length][b.length]
}

function tokens(s: string): string[] {
  // Keep elided articles as their own token: "l'hôtel" -> ["l'", "hôtel"].
  return s.split(' ').flatMap((t) => {
    const m = t.match(/^(\p{L}{1,2}')(.+)$/u)
    return m ? [m[1], m[2]] : [t]
  })
}

function sameMultiset(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false
  const x = [...a].sort()
  const y = [...b].sort()
  return x.every((v, i) => v === y[i])
}

function typoAllowance(length: number): number {
  if (length >= 12) return 2
  if (length >= 5) return 1
  return 0
}

const NATIVE_FILLER = new Set(['a', 'an', 'the', 'to'])

function classifyWrong(input: string, expected: string, opts: CheckOptions): ErrorType {
  const a = tokens(stripAccents(input))
  const b = tokens(stripAccents(expected))
  if (sameMultiset(a, b)) return 'word-order'

  const groups = (opts.articleGroups ?? []).map((g) => g.map((w) => stripAccents(normalise(w))))
  const groupOf = (w: string) => groups.findIndex((g) => g.includes(w))
  if (a.length === b.length && groups.length) {
    const diffs = a.map((w, i) => [w, b[i]] as const).filter(([x, y]) => x !== y)
    if (diffs.length > 0 && diffs.every(([x, y]) => groupOf(x) >= 0 && groupOf(y) >= 0)) {
      return diffs.every(([x, y]) => groupOf(x) === groupOf(y)) ? 'gender' : 'article'
    }
  }

  const remaining = [...b]
  const unmatched: string[] = []
  for (const w of a) {
    const i = remaining.indexOf(w)
    if (i >= 0) remaining.splice(i, 1)
    else unmatched.push(w)
  }
  if (unmatched.length === 0 && remaining.length >= 1 && remaining.length <= 2) return 'missing-word'
  if (remaining.length === 0 && unmatched.length >= 1 && unmatched.length <= 2) return 'extra-word'
  return opts.lang === 'native' ? 'meaning' : 'wrong-word'
}

/** Judge a typed answer against every accepted answer and return the best verdict. */
export function checkAnswer(input: string, accepted: string[], opts: CheckOptions = {}): CheckResult {
  const candidates = accepted.flatMap(expandVariants)
  const given = normalise(input)
  if (!given) return { result: 'wrong', errorType: 'wrong-word', expected: candidates[0] ?? '' }

  const native = opts.lang === 'native'
  const prep = (s: string) => {
    const n = normalise(s)
    return native ? n.split(' ').filter((w) => !NATIVE_FILLER.has(w)).join(' ') : n
  }
  const g = prep(input)

  for (const c of candidates) if (prep(c) === g) return { result: 'correct', expected: c }

  for (const c of candidates) {
    if (stripAccents(prep(c)) === stripAccents(g)) {
      return native ? { result: 'correct', expected: c } : { result: 'near', errorType: 'accent', expected: c }
    }
  }

  let best = { c: candidates[0] ?? '', d: Infinity }
  for (const c of candidates) {
    const d = levenshtein(stripAccents(prep(c)), stripAccents(g))
    if (d < best.d) best = { c, d }
  }
  const allowance = typoAllowance(stripAccents(prep(best.c)).length) + (native ? 1 : 0)
  // A typo stays inside words: a missing or extra word is never a typo.
  const sameShape = tokens(stripAccents(prep(best.c))).length === tokens(stripAccents(g)).length
  if (best.d <= allowance && sameShape) {
    // A one-letter difference that lands on another article is a real mistake, not a typo.
    const kind = classifyWrong(g, prep(best.c), opts)
    if (kind !== 'gender' && kind !== 'article') {
      return native ? { result: 'correct', expected: best.c } : { result: 'near', errorType: 'typo', expected: best.c }
    }
  }

  return { result: 'wrong', errorType: classifyWrong(g, prep(best.c), opts), expected: best.c }
}

/**
 * Compare a speech recognition transcript with the phrase the learner meant to say.
 * Returns the share of target words heard in order (longest common subsequence),
 * ignoring accents, because recognisers spell inconsistently.
 */
export function compareSpoken(transcript: string, target: string): { score: number; missing: string[] } {
  const heard = tokens(stripAccents(normalise(transcript))).map((t) => t.replace(/'$/, ''))
  const want = tokens(stripAccents(normalise(target))).map((t) => t.replace(/'$/, ''))
  if (!want.length) return { score: 0, missing: [] }
  const dp: number[][] = Array.from({ length: heard.length + 1 }, () => Array(want.length + 1).fill(0))
  for (let i = 1; i <= heard.length; i++)
    for (let j = 1; j <= want.length; j++)
      dp[i][j] = heard[i - 1] === want[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1])
  // Walk back to find which target words were matched.
  const matched = new Set<number>()
  let i = heard.length
  let j = want.length
  while (i > 0 && j > 0) {
    if (heard[i - 1] === want[j - 1]) {
      matched.add(j - 1)
      i--
      j--
    } else if (dp[i - 1][j] >= dp[i][j - 1]) i--
    else j--
  }
  const original = tokens(normalise(target))
  return {
    score: dp[heard.length][want.length] / want.length,
    missing: original.filter((_, k) => !matched.has(k)),
  }
}

/** Check a free response against slots: every slot needs one of its phrases. */
export function checkSlots(input: string, slots: { label: string; any: string[] }[]): {
  ok: boolean
  missing: string[]
  nearMisses: string[]
} {
  const g = ' ' + stripAccents(normalise(input)) + ' '
  const missing: string[] = []
  const nearMisses: string[] = []
  for (const slot of slots) {
    const phrases = slot.any.flatMap(expandVariants).map((p) => stripAccents(normalise(p)))
    // A phrase ending in an apostrophe (je viens d') runs straight into the next word.
    if (phrases.some((p) => g.includes(' ' + p + (p.endsWith("'") ? '' : ' ')))) continue
    missing.push(slot.label)
    // Look for a near spelling of any phrase as a contiguous run of words.
    const words = g.trim().split(' ')
    const near = phrases.find((p) => {
      const n = p.split(' ').length
      for (let k = 0; k + n <= words.length; k++) {
        const chunk = words.slice(k, k + n).join(' ')
        if (levenshtein(chunk, p) <= Math.max(1, typoAllowance(p.length))) return true
      }
      return false
    })
    if (near) nearMisses.push(slot.label)
  }
  return { ok: missing.length === 0, missing, nearMisses }
}
