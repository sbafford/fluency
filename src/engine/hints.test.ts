import { describe, expect, it } from 'vitest'
import { matchedLength, nextLetter, wordShape } from './hints'

describe('word shape', () => {
  it('shows the first letter of each word and a blank for every other letter', () => {
    expect(wordShape("s'il vous plaît")).toEqual(["s'i _", 'v _ _ _', 'p _ _ _ _'])
    expect(wordShape('Bonjour !')).toEqual(['B _ _ _ _ _ _', '!'])
  })

  it('drops optional endings', () => {
    expect(wordShape('enchanté(e)')).toEqual(['e _ _ _ _ _ _ _'])
  })
})

describe('next letter', () => {
  it('starts from nothing', () => {
    expect(nextLetter('', 'merci')).toBe('m')
    expect(nextLetter('m', 'merci')).toBe('me')
  })

  it('keeps what is right, ignoring case and accents, and corrects the rest', () => {
    expect(matchedLength('S IL', "s'il vous plaît")).toBe(1)
    expect(nextLetter("s'il et p", "s'il vous plaît")).toBe("s'il v")
    expect(nextLetter('tres', 'très bien')).toBe('très b')
  })

  it('skips over apostrophes and spaces to the next letter', () => {
    expect(nextLetter('s', "s'il vous plaît")).toBe("s'i")
  })

  it('stops at the end of the answer', () => {
    expect(nextLetter('merci', 'merci')).toBe('merci')
  })
})
