import { describe, expect, it } from 'vitest'
import { checkAnswer, checkSlots, compareSpoken, expandVariants, normalise } from './answers'

const fr = { articleGroups: [['le', 'la', 'les', "l'"], ['un', 'une', 'des']] }

describe('normalise', () => {
  it('ignores case, punctuation, curly apostrophes and French spacing', () => {
    expect(normalise('  Comment  vous appelez-vous ?')).toBe('comment vous appelez vous')
    expect(normalise('Je m’appelle Claire.')).toBe("je m'appelle claire")
  })
})

describe('expandVariants', () => {
  it('expands optional endings', () => {
    expect(expandVariants('enchanté(e)')).toEqual(['enchanté', 'enchantée'])
    expect(expandVariants('je suis australien(ne)')).toEqual(['je suis australien', 'je suis australienne'])
  })
})

describe('checkAnswer', () => {
  it('accepts exact answers regardless of case and punctuation', () => {
    expect(checkAnswer('bonjour!', ['Bonjour']).result).toBe('correct')
    expect(checkAnswer("Je m'appelle", ['je m’appelle']).result).toBe('correct')
  })

  it('accepts either form of an optional ending', () => {
    expect(checkAnswer('enchantée', ['enchanté(e)']).result).toBe('correct')
    expect(checkAnswer('enchanté', ['enchanté(e)']).result).toBe('correct')
  })

  it('flags missing accents as near, not wrong', () => {
    const r = checkAnswer('tres bien', ['très bien'])
    expect(r).toMatchObject({ result: 'near', errorType: 'accent', expected: 'très bien' })
  })

  it('treats a one-letter slip in a longer answer as a typo', () => {
    expect(checkAnswer('au revior', ['au revoir'])).toMatchObject({ result: 'near', errorType: 'typo' })
  })

  it('does not allow typos in very short answers', () => {
    expect(checkAnswer('ca', ['ça'])).toMatchObject({ result: 'near', errorType: 'accent' })
    expect(checkAnswer('le', ['la']).result).toBe('wrong')
  })

  it('recognises gender mistakes in articles', () => {
    expect(checkAnswer('le France', ['la France'], fr)).toMatchObject({ result: 'wrong', errorType: 'gender' })
    expect(checkAnswer('un ville', ['une ville'], fr)).toMatchObject({ result: 'wrong', errorType: 'gender' })
  })

  it('recognises article confusion across groups', () => {
    expect(checkAnswer('un hôtel', ["l'hôtel"], fr)).toMatchObject({ result: 'wrong', errorType: 'article' })
  })

  it('recognises word order mistakes', () => {
    expect(checkAnswer('vous comment appelez', ['comment vous appelez'])).toMatchObject({
      result: 'wrong',
      errorType: 'word-order',
    })
  })

  it('recognises a missing word', () => {
    expect(checkAnswer("je appelle Claire", ["je m'appelle Claire"]).result).toBe('wrong')
    expect(checkAnswer('je suis', ['je suis anglais']).errorType).toBe('missing-word')
  })

  it('picks the closest accepted answer for the correction', () => {
    const r = checkAnswer('ca va bien', ['ça va bien', 'très bien'])
    expect(r.expected).toBe('ça va bien')
  })

  it('is lenient with translations into the learner language', () => {
    expect(checkAnswer('good morning', ['Good morning'], { lang: 'native' }).result).toBe('correct')
    expect(checkAnswer('see you son', ['see you soon'], { lang: 'native' }).result).toBe('correct')
    expect(checkAnswer('to thank', ['thank'], { lang: 'native' }).result).toBe('correct')
  })

  it('treats an empty answer as wrong', () => {
    expect(checkAnswer('  ', ['bonjour']).result).toBe('wrong')
  })
})

describe('compareSpoken', () => {
  it('scores word overlap in order, ignoring accents and case', () => {
    expect(compareSpoken('Je m appelle Claire', "Je m'appelle Claire").score).toBe(1)
    const partial = compareSpoken('je appelle', "je m'appelle Claire")
    expect(partial.score).toBeCloseTo(0.5)
    expect(partial.missing).toContain('claire')
  })
})

describe('checkSlots', () => {
  const slots = [
    { label: 'greet', any: ['bonjour', 'salut'] },
    { label: 'say your name', any: ["je m'appelle", 'moi c’est'] },
  ]
  it('passes when every slot is present in any order', () => {
    expect(checkSlots("Salut ! Je m'appelle Sav.", slots).ok).toBe(true)
    expect(checkSlots('Moi c’est Sav, bonjour', slots).ok).toBe(true)
  })
  it('reports missing slots and near spellings', () => {
    const r = checkSlots('Bonjour, je mapelle Sav', slots)
    expect(r.ok).toBe(false)
    expect(r.missing).toEqual(['say your name'])
    expect(r.nearMisses).toEqual(['say your name'])
  })
})
