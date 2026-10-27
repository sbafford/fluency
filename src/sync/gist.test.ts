import { describe, expect, it } from 'vitest'
import { dayLog, recordAnswer } from '../engine/progress'
import { dayKey } from '../engine/srs'
import { defaultData } from '../engine/storage'
import { FILE_NAME, serialise, syncNow, SyncError } from './gist'

const T0 = new Date(2026, 9, 27, 10, 0).getTime()

/** A tiny in-memory stand-in for the GitHub gists API. */
function fakeGitHub(opts: { token?: string } = {}) {
  const gists = new Map<string, { id: string; description: string; files: Record<string, { filename: string; content: string }> }>()
  const calls: string[] = []
  let n = 0
  const fetchFn = (async (url: string, init: RequestInit = {}) => {
    const method = init.method ?? 'GET'
    const path = url.replace('https://api.github.com', '')
    calls.push(`${method} ${path.split('?')[0]}`)
    const auth = (init.headers as Record<string, string>)?.Authorization
    if (auth !== `Bearer ${opts.token ?? 'good'}`) return new Response('{}', { status: 401 })
    const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status })
    if (method === 'GET' && path.startsWith('/gists?')) return json([...gists.values()])
    const one = path.match(/^\/gists\/(\w+)$/)
    if (method === 'GET' && one) return gists.has(one[1]) ? json(gists.get(one[1])) : json({}, 404)
    if (method === 'POST' && path === '/gists') {
      const body = JSON.parse(String(init.body))
      const id = `g${++n}`
      const files = Object.fromEntries(
        Object.entries(body.files as Record<string, { content: string }>).map(([k, v]) => [k, { filename: k, content: v.content }]),
      )
      gists.set(id, { id, description: body.description, files })
      return json(gists.get(id), 201)
    }
    if (method === 'PATCH' && one) {
      const body = JSON.parse(String(init.body))
      const g = gists.get(one[1])!
      for (const [k, v] of Object.entries(body.files as Record<string, { content: string }>)) g.files[k] = { filename: k, content: v.content }
      return json(g)
    }
    return json({}, 404)
  }) as typeof fetch
  return { fetchFn, gists, calls }
}

describe('gist sync', () => {
  it('creates a gist on first sync and finds it from another device', async () => {
    const gh = fakeGitHub()
    const phone = defaultData('fr', 'phone')
    phone.settings.learnerName = 'Sav'
    phone.progress.fr = recordAnswer(phone.progress.fr, { itemIds: ['x'], skill: 'recall', result: 'correct', now: T0 })
    const first = await syncNow(phone, 'good', gh.fetchFn)
    expect(first.created).toBe(true)
    expect(gh.gists.size).toBe(1)

    // A new device with no gist id finds the same gist rather than making another.
    const laptop = defaultData('fr', 'laptop')
    laptop.progress.fr = recordAnswer(laptop.progress.fr, { itemIds: ['y'], skill: 'recall', result: 'correct', now: T0 + 1000 })
    const second = await syncNow(laptop, 'good', gh.fetchFn)
    expect(second.created).toBe(false)
    expect(second.gistId).toBe(first.gistId)
    expect(gh.gists.size).toBe(1)
    expect(second.data.deviceId).toBe('laptop')
    expect(second.data.settings.learnerName).toBe('Sav')
    expect(Object.keys(second.data.progress.fr.items).sort()).toEqual(['x', 'y'])
    expect(dayLog(second.data.progress.fr, dayKey(T0)).answered).toBe(2)

    // The phone picks up the laptop's work on its next sync.
    const third = await syncNow(first.data, 'good', gh.fetchFn)
    expect(Object.keys(third.data.progress.fr.items).sort()).toEqual(['x', 'y'])
    expect(third.data.deviceId).toBe('phone')
  })

  it('never puts the token or device settings in the synced file', () => {
    const data = defaultData('fr', 'phone')
    data.settings.voiceA = 'Amélie'
    const text = serialise(data)
    expect(text).not.toContain('Amélie')
    expect(text).not.toContain('token')
  })

  it('reports a rejected token clearly', async () => {
    const gh = fakeGitHub({ token: 'good' })
    await expect(syncNow(defaultData(), 'bad', gh.fetchFn)).rejects.toMatchObject({ kind: 'auth' })
  })

  it('leaves data untouched when the synced file is damaged', async () => {
    const gh = fakeGitHub()
    gh.gists.set('g9', { id: 'g9', description: '', files: { [FILE_NAME]: { filename: FILE_NAME, content: '{oops' } } })
    const err = await syncNow(defaultData(), 'good', gh.fetchFn).catch((e) => e)
    expect(err).toBeInstanceOf(SyncError)
    expect(err.kind).toBe('invalid')
    expect(gh.calls.some((c) => c.startsWith('PATCH'))).toBe(false)
  })

  it('reports network failure without losing anything', async () => {
    const offline = (async () => {
      throw new TypeError('Failed to fetch')
    }) as typeof fetch
    await expect(syncNow(defaultData(), 'good', offline)).rejects.toMatchObject({ kind: 'network' })
  })
})
