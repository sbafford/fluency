import { stripAccents } from './answers'
import type { AccentGuideEntry } from './types'

/*
 * Spotting accent slips: where your answer and the expected one are the same
 * letters but a different accent. Used to show what that accent does.
 */

export interface AccentSlip {
  /** The letter the answer needed, e.g. "é". */
  needed: string
  /** What you wrote there instead, e.g. "e" or "è". */
  wrote: string
  /** The word it happened in, from the expected answer. */
  word: string
}

const words = (s: string) =>
  s
    .normalize('NFC')
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .split(/[\s'.,!?;:«»"()-]+/)
    .filter(Boolean)

/** The first accent difference between what you wrote and the answer, if the words otherwise match. */
export function findAccentSlip(given: string, expected: string): AccentSlip | undefined {
  const g = words(given)
  const e = words(expected)
  for (const ew of e) {
    const base = stripAccents(ew)
    const gw = g.find((w) => w !== ew && stripAccents(w) === base && w.length === ew.length)
    if (!gw) continue
    for (let i = 0; i < ew.length; i++)
      if (gw[i] !== ew[i]) return { needed: ew[i] === 'o' && ew[i + 1] === 'e' ? 'œ' : ew[i], wrote: gw[i], word: ew }
  }
  return undefined
}

/** The guide entry to show for a slip: the accent you needed, or the one you added by mistake. */
export function accentFor(slip: AccentSlip, guide: AccentGuideEntry[]): AccentGuideEntry | undefined {
  return guide.find((a) => a.letter === slip.needed) ?? guide.find((a) => a.letter === slip.wrote)
}
