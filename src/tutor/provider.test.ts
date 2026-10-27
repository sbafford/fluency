import { describe, expect, it } from 'vitest'
import { french } from '../content/fr'
import { scriptedTutor } from './provider'

const formal = french.conversations.find((c) => c.register === 'formal')!
const informal = french.conversations.find((c) => c.register === 'informal')!
const firstTurn = (c: typeof formal) => c.turns.find((t) => t.kind === 'learner')! as Extract<(typeof c.turns)[number], { kind: 'learner' }>

describe('scripted tutor', () => {
  it('accepts a response containing every required part', async () => {
    const fb = await scriptedTutor.evaluate({ conversation: formal, turn: firstTurn(formal), response: "Bonjour ! Je m'appelle Sav.", learnerName: 'Sav', attempt: 0 })
    expect(fb.ok).toBe(true)
    expect(fb.register).toBeUndefined()
  })

  it('says what is missing', async () => {
    const fb = await scriptedTutor.evaluate({ conversation: formal, turn: firstTurn(formal), response: 'Bonjour !', learnerName: 'Sav', attempt: 0 })
    expect(fb.ok).toBe(false)
    expect(fb.message).toContain('say your name')
    expect(fb.model).toContain('Sav')
  })

  it('treats a spelling slip as nearly right', async () => {
    const fb = await scriptedTutor.evaluate({ conversation: formal, turn: firstTurn(formal), response: 'Bonjour, je mapelle Sav', learnerName: 'Sav', attempt: 0 })
    expect(fb.ok).toBe(false)
    expect(fb.message).toMatch(/spelling/)
  })

  it('flags tu in a formal conversation and vous in an informal one', async () => {
    const a = await scriptedTutor.evaluate({ conversation: formal, turn: firstTurn(formal), response: "Bonjour, je m'appelle Sav, et toi ?", learnerName: 'Sav', attempt: 0 })
    expect(a.register).toMatch(/vous/)
    const b = await scriptedTutor.evaluate({ conversation: informal, turn: firstTurn(informal), response: 'Salut ! Ça va bien, et toi ? Et vous ?', learnerName: 'Sav', attempt: 0 })
    expect(b.register).toMatch(/tu/)
  })
})
