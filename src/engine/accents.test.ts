import { describe, expect, it } from 'vitest'
import { accents } from '../content/fr/accents'
import { accentFor, findAccentSlip } from './accents'

describe('accent slips', () => {
  it('finds a missing accent', () => {
    expect(findAccentSlip('enchante', 'enchanté')).toEqual({ needed: 'é', wrote: 'e', word: 'enchanté' })
    expect(findAccentSlip("s'il vous plait", "s'il vous plaît")).toMatchObject({ needed: 'î', word: 'plaît' })
    expect(findAccentSlip('ca va', 'ça va')).toMatchObject({ needed: 'ç' })
  })

  it('finds the wrong accent', () => {
    expect(findAccentSlip('tres bien', 'très bien')).toMatchObject({ needed: 'è', wrote: 'e' })
    expect(findAccentSlip('cafè', 'café')).toMatchObject({ needed: 'é', wrote: 'è' })
  })

  it('ignores answers that differ in other ways, and correct ones', () => {
    expect(findAccentSlip('bonsoir', 'bonjour')).toBeUndefined()
    expect(findAccentSlip('Ça va ?', 'ça va')).toBeUndefined()
  })

  it('has a guide entry for every accented letter the course uses', () => {
    for (const ch of ['é', 'è', 'ê', 'à', 'ù', 'â', 'ô', 'î', 'û', 'ç', 'œ', 'ë'])
      expect(accentFor({ needed: ch, wrote: '', word: '' }, accents)?.letter, ch).toBe(ch)
  })
})
