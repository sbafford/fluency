import { describe, expect, it } from 'vitest'
import { french } from '../content/fr'
import { clipKey, clipText, narrationPlan, roleFor } from './narration'

describe('recorded narration', () => {
  it('looks lines up in a tidy form', () => {
    expect(clipText('  Enchanté(e),   Marc ’ ')).toBe("Enchanté, Marc '")
    expect(clipKey('f1', 'Ça va ?')).toBe('f1|Ça va ?')
  })

  it('gives characters their own voice and falls back by voice slot', () => {
    const n = french.narration!
    expect(roleFor(n, { who: 'Hugo' })).toBe('m1')
    expect(roleFor(n, { who: 'Sarah', voice: 'b' })).toBe('f1')
    expect(roleFor(n, { voice: 'b' })).toBe(n.second)
    expect(roleFor(n)).toBe(n.narrator)
  })

  it('plans every dialogue line in its speaker voice, and skips lines with the learner name', () => {
    const plan = narrationPlan(french)
    const keys = new Set(plan.map((l) => clipKey(l.role, l.text)))
    const first = french.units[0].lessons[0].dialogue!
    for (const line of first.lines) expect(keys.has(clipKey(roleFor(french.narration!, { who: first.speakers[line.speaker].name }), line.target))).toBe(true)
    expect(plan.some((l) => l.text.includes('{name}'))).toBe(false)
    // With a name, the lines that say it are planned too, filled in.
    const named = narrationPlan(french, ['Sav'])
    expect(named.length).toBeGreaterThan(plan.length)
    expect(named.some((l) => l.text.includes("m'appelle Sav"))).toBe(true)
    expect(new Set(plan.map((l) => l.role))).toEqual(new Set(Object.keys(french.narration!.voices)))
  })
})
