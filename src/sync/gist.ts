import { mergeProgress } from '../engine/merge'
import { emptyProgress } from '../engine/progress'
import { migrate } from '../engine/storage'
import type { AppData } from '../engine/types'

/*
 * Sync through a private (secret) GitHub gist.
 *
 * Each device pulls the gist, merges it with its own progress, and pushes the
 * result back. No server is needed and it costs nothing. The access token is
 * kept in this browser only: it is not part of exports or the synced file.
 *
 * Secret gists are unlisted rather than private: anyone with the exact URL can
 * read them. The file holds learning progress and the name you set, nothing else.
 */

export const TOKEN_KEY = 'fluency.syncToken'
export const FILE_NAME = 'fluency-progress.json'
const DESCRIPTION = 'fluency: language learning progress (synced by the app)'
const API = 'https://api.github.com'

export function getToken(storage: Storage | undefined = globalThis.localStorage): string | undefined {
  try {
    return storage?.getItem(TOKEN_KEY) || undefined
  } catch {
    return undefined
  }
}

export function setToken(token: string | undefined, storage: Storage | undefined = globalThis.localStorage) {
  try {
    if (token) storage?.setItem(TOKEN_KEY, token)
    else storage?.removeItem(TOKEN_KEY)
  } catch {
    /* storage unavailable */
  }
}

export class SyncError extends Error {
  kind: 'auth' | 'network' | 'not-found' | 'invalid' | 'other'
  constructor(kind: SyncError['kind'], message: string) {
    super(message)
    this.kind = kind
  }
}

type Fetch = typeof fetch

async function api(fetchFn: Fetch, token: string, path: string, init: RequestInit = {}) {
  let res: Response
  try {
    res = await fetchFn(`${API}${path}`, {
      ...init,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      },
    })
  } catch {
    throw new SyncError('network', "Couldn't reach GitHub. Check your connection; progress is still saved on this device.")
  }
  if (res.status === 401 || res.status === 403)
    throw new SyncError('auth', 'GitHub rejected the token. It may have expired, or it needs the Gists permission.')
  if (res.status === 404) throw new SyncError('not-found', 'The sync gist was not found.')
  if (!res.ok) throw new SyncError('other', `GitHub returned an error (${res.status}). Try again later.`)
  return res.json()
}

interface GistFile {
  filename: string
  content?: string
  truncated?: boolean
  raw_url?: string
}
interface Gist {
  id: string
  description: string | null
  files: Record<string, GistFile>
}

async function readFile(fetchFn: Fetch, gist: Gist): Promise<string | undefined> {
  const file = gist.files[FILE_NAME]
  if (!file) return undefined
  if (!file.truncated && file.content !== undefined) return file.content
  // Large files are truncated in the API response; fetch the raw file instead.
  const res = await fetchFn(file.raw_url!)
  if (!res.ok) throw new SyncError('other', 'Could not download the synced progress.')
  return res.text()
}

/** Find the app's gist among the user's gists. */
async function findGist(fetchFn: Fetch, token: string): Promise<Gist | undefined> {
  for (let page = 1; page <= 5; page++) {
    const list = (await api(fetchFn, token, `/gists?per_page=100&page=${page}`)) as Gist[]
    const hit = list.find((g) => g.files[FILE_NAME])
    if (hit) return (await api(fetchFn, token, `/gists/${hit.id}`)) as Gist
    if (list.length < 100) return undefined
  }
  return undefined
}

/** Combine two app documents. Settings stay this device's own, except a name set elsewhere fills an empty one. */
export function mergeData(local: AppData, remoteRaw: unknown): AppData {
  const remote = migrate(remoteRaw, local.deviceId)
  const progress: AppData['progress'] = { ...local.progress }
  for (const [lang, rp] of Object.entries(remote.progress)) {
    progress[lang] = mergeProgress(local.progress[lang] ?? emptyProgress(lang, local.deviceId), rp)
  }
  const settings = { ...local.settings }
  if (!settings.learnerName && remote.settings.learnerName) settings.learnerName = remote.settings.learnerName
  return { ...local, settings, progress }
}

/** What gets stored in the gist: progress and the learner's name, without device-specific settings. */
export function serialise(data: AppData): string {
  const shared = {
    app: 'fluency',
    data: {
      version: data.version,
      deviceId: data.deviceId,
      activeLanguage: data.activeLanguage,
      settings: { learnerName: data.settings.learnerName },
      progress: data.progress,
    },
  }
  return JSON.stringify(shared)
}

export interface SyncResult {
  data: AppData
  gistId: string
  created: boolean
}

/**
 * Pull, merge and push. Returns the merged document, which the caller saves.
 * Pass the latest local data; the caller should merge any answers made while
 * the request was in flight (merging is safe to repeat).
 */
export async function syncNow(local: AppData, token: string, fetchFn: Fetch = fetch.bind(globalThis)): Promise<SyncResult> {
  let gist: Gist | undefined
  if (local.settings.syncGistId) {
    try {
      gist = (await api(fetchFn, token, `/gists/${local.settings.syncGistId}`)) as Gist
    } catch (err) {
      if (!(err instanceof SyncError && err.kind === 'not-found')) throw err
    }
  }
  if (!gist) gist = await findGist(fetchFn, token)

  let merged = local
  if (gist) {
    const text = await readFile(fetchFn, gist)
    if (text) {
      try {
        merged = mergeData(local, JSON.parse(text))
      } catch {
        throw new SyncError('invalid', 'The synced file is damaged, so nothing was changed. Export a backup, then reset sync.')
      }
    }
  }

  const body = JSON.stringify({ files: { [FILE_NAME]: { content: serialise(merged) } } })
  let created = false
  if (gist) {
    await api(fetchFn, token, `/gists/${gist.id}`, { method: 'PATCH', body })
  } else {
    gist = (await api(fetchFn, token, '/gists', {
      method: 'POST',
      body: JSON.stringify({ description: DESCRIPTION, public: false, files: { [FILE_NAME]: { content: serialise(merged) } } }),
    })) as Gist
    created = true
  }
  return {
    data: { ...merged, settings: { ...merged.settings, syncGistId: gist.id, lastSyncedAt: Date.now() } },
    gistId: gist.id,
    created,
  }
}
