import { describe, expect, it } from 'vitest'
import { recordAnswer } from './progress'
import { defaultData, exportData, importData, load, migrate, save, STORAGE_KEY } from './storage'

function memoryStorage(): Storage {
  const m = new Map<string, string>()
  return {
    get length() {
      return m.size
    },
    clear: () => m.clear(),
    getItem: (k) => m.get(k) ?? null,
    key: (i) => [...m.keys()][i] ?? null,
    removeItem: (k) => void m.delete(k),
    setItem: (k, v) => void m.set(k, String(v)),
  }
}

describe('storage', () => {
  it('returns defaults when nothing is stored', () => {
    expect(load(memoryStorage())).toEqual(defaultData())
  })

  it('round-trips through save and load', () => {
    const s = memoryStorage()
    const data = defaultData()
    data.progress.fr = recordAnswer(data.progress.fr, { itemIds: ['x'], skill: 'recall', result: 'correct', now: 1 })
    data.settings.learnerName = 'Sav'
    save(data, s)
    expect(load(s)).toEqual(data)
  })

  it('round-trips through export and import', () => {
    const data = defaultData()
    data.settings.dailyGoal = 35
    expect(importData(exportData(data))).toEqual(data)
  })

  it('keeps an unreadable copy instead of overwriting it', () => {
    const s = memoryStorage()
    s.setItem(STORAGE_KEY, '{not json')
    expect(load(s)).toEqual(defaultData())
    expect(s.length).toBe(2)
  })

  it('rejects files that are not backups', () => {
    expect(() => importData('hello')).toThrow(/could not be read/)
    expect(() => importData('{"foo":1}')).toThrow(/not a progress backup/)
  })

  it('rejects backups from a newer version', () => {
    expect(() => migrate({ version: 99, progress: {} })).toThrow(/newer version/)
  })

  it('fills in missing settings and progress fields', () => {
    const data = migrate({ version: 1, activeLanguage: 'fr', settings: { learnerName: 'Sav' }, progress: { fr: {} } })
    expect(data.settings.dailyGoal).toBe(20)
    expect(data.settings.learnerName).toBe('Sav')
    expect(data.progress.fr.items).toEqual({})
  })
})
