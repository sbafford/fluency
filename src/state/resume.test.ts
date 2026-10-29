import { beforeEach, describe, expect, it } from 'vitest'
import { clearPosition, loadPosition, savePosition } from './resume'

const ids = new Set(['s1', 's2', 's3'])
const position = { queue: [{ id: 's1', retry: false }, { id: 's2', retry: false }, { id: 's3', retry: false }], pos: 2, results: { s2: 'wrong' as const }, savedAt: 1000 }

describe('resuming a lesson', () => {
  beforeEach(() => localStorage.clear())

  it('saves and restores the position', () => {
    savePosition('fr.u1.l1', position)
    expect(loadPosition('fr.u1.l1', ids, 2000)).toEqual(position)
    clearPosition('fr.u1.l1')
    expect(loadPosition('fr.u1.l1', ids, 2000)).toBeUndefined()
  })

  it('ignores a position from a lesson whose exercises have since changed', () => {
    savePosition('fr.u1.l1', position)
    expect(loadPosition('fr.u1.l1', new Set(['s1', 's2']), 2000)).toBeUndefined()
  })

  it('forgets positions older than a week, and ones at the very start', () => {
    savePosition('a', position)
    expect(loadPosition('a', ids, 1000 + 8 * 86_400_000)).toBeUndefined()
    savePosition('b', { ...position, pos: 0 })
    expect(loadPosition('b', ids, 2000)).toBeUndefined()
  })
})
