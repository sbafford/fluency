/*
 * Hints for typed answers. Two levels: the shape of the answer (first letter
 * of each word, the rest as blanks), then one letter at a time. Using either
 * marks the answer as hinted, which schedules the item sooner.
 */

const isLetter = (ch: string) => /\p{L}/u.test(ch)

/** Lower case, accents and apostrophe style removed: for comparing what was typed. */
const plain = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[’‘]/g, "'")
    .toLowerCase()

/** Removes "(e)" style optional endings and trailing sentence punctuation spacing. */
export function hintSource(answer: string): string {
  return answer.replace(/\((\p{L}+)\)/gu, '').replace(/\s+/g, ' ').trim()
}

/** "s'il vous plaît" → ["s'i _", "v _ _ _", "p _ _ _ _"]: first letter of each word, a blank for every other letter. */
export function wordShape(answer: string): string[] {
  return hintSource(answer)
    .split(' ')
    .map((word) => {
      let out = ''
      let startOfWord = true
      for (const ch of word) {
        if (isLetter(ch)) {
          out += startOfWord ? ch : ' _'
          startOfWord = false
        } else {
          out += ch
          startOfWord = true
        }
      }
      return out
    })
}

/** How many characters of the answer the typed text already matches, ignoring case and accents. */
export function matchedLength(typed: string, answer: string): number {
  const a = plain(hintSource(answer))
  const t = plain(typed)
  let i = 0
  while (i < t.length && i < a.length && t[i] === a[i]) i++
  return i
}

/** The typed text, corrected up to where it went wrong, plus the next letter of the answer. */
export function nextLetter(typed: string, answer: string): string {
  const src = hintSource(answer)
  let n = matchedLength(typed, answer)
  // Carry on through spaces and punctuation so each press reveals a real letter.
  do n++
  while (n < src.length && !isLetter(src[n - 1]))
  return src.slice(0, Math.min(n, src.length))
}
