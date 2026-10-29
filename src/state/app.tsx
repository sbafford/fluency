import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { getLanguage } from '../content'
import * as P from '../engine/progress'
import { load, save } from '../engine/storage'
import type { AppData, LanguagePack, ProgressState, Settings } from '../engine/types'
import type { Manifest } from '../speech/narration'
import { Speaker } from '../speech/tts'
import { getToken, mergeData, SyncError, syncNow } from '../sync/gist'

/*
 * App state: one AppData document, persisted to localStorage on every change.
 * Screens call the actions here; the engine's pure functions do the work.
 */

export interface SyncStatus {
  state: 'off' | 'idle' | 'syncing' | 'error'
  message?: string
  /** True when there is practice on this device that hasn't been synced yet. */
  pending?: boolean
}

interface AppContextValue {
  data: AppData
  pack: LanguagePack
  progress: ProgressState
  settings: Settings
  speaker: Speaker
  /** How many recorded clips this language has (0 when none are recorded yet). */
  recordedCount: number
  saveFailed: boolean
  sync: SyncStatus
  updateProgress: (fn: (p: ProgressState) => ProgressState) => void
  updateSettings: (patch: Partial<Settings>) => void
  replaceData: (data: AppData) => void
  resetProgress: () => void
  record: (e: Omit<P.AnswerEvent, 'now'>) => void
  /** Adds study time since the last call, so idle time is not counted. */
  tick: () => void
  /** Pull, merge and push now. Resolves once finished; errors are reported through `sync`. */
  syncNow: () => Promise<void>
}

const AppContext = createContext<AppContextValue | null>(null)

/** Wait this long after the last change before syncing automatically. */
const SYNC_DEBOUNCE_MS = 20_000

export function AppProvider({ children, initial }: { children: ReactNode; initial?: AppData }) {
  const [data, setData] = useState<AppData>(() => initial ?? load())
  const [saveFailed, setSaveFailed] = useState(false)
  const [sync, setSync] = useState<SyncStatus>(() => ({ state: getToken() ? 'idle' : 'off' }))
  const lastTick = useRef(Date.now())
  const dataRef = useRef(data)
  dataRef.current = data
  // Set by the learner's own changes, not by merges from sync, so syncing never triggers itself.
  const dirty = useRef(false)
  const syncing = useRef(false)
  const [pending, setPending] = useState(false)
  const markDirty = useCallback(() => {
    dirty.current = true
    setPending(true)
  }, [])

  useEffect(() => {
    setSaveFailed(!save(data))
  }, [data])

  const pack = getLanguage(data.activeLanguage)
  const progress = data.progress[pack.id] ?? P.emptyProgress(pack.id, data.deviceId)
  const settings = data.settings

  // Recorded audio, when the pack has been recorded (see scripts/record-audio.ts).
  const [manifest, setManifest] = useState<{ pack: string; manifest: Manifest } | null>(null)
  useEffect(() => {
    if (!pack.narration) return
    let live = true
    fetch(`${import.meta.env.BASE_URL}audio/${pack.id}/manifest.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((m: Manifest | null) => live && m?.clips && setManifest({ pack: pack.id, manifest: m }))
      .catch(() => undefined)
    return () => {
      live = false
    }
  }, [pack])
  const recordings =
    pack.narration && manifest?.pack === pack.id && !settings.deviceVoiceOnly
      ? { base: `${import.meta.env.BASE_URL}audio/${pack.id}/`, manifest: manifest.manifest, narration: pack.narration }
      : undefined
  const recordedCount = manifest?.pack === pack.id ? Object.keys(manifest.manifest.clips).length : 0

  const speaker = useMemo(
    () => new Speaker(pack.locale, pack.preferredVoices, { a: settings.voiceA, b: settings.voiceB }, settings.rate, recordings),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pack, settings.voiceA, settings.voiceB, settings.rate, manifest, settings.deviceVoiceOnly],
  )

  const runSync = useCallback(async () => {
    const token = getToken()
    if (!token) {
      setSync({ state: 'off' })
      return
    }
    if (syncing.current) return
    syncing.current = true
    dirty.current = false
    setSync({ state: 'syncing' })
    // Anything recorded from here on marks the device as pending again.
    setPending(false)
    try {
      const result = await syncNow(dataRef.current, token)
      // Fold in anything answered while the request was in flight. Merging is safe to repeat.
      setData((current) => {
        const merged = mergeData(current, result.data)
        return { ...merged, settings: { ...merged.settings, syncGistId: result.gistId, lastSyncedAt: Date.now() } }
      })
      setSync({ state: 'idle' })
    } catch (err) {
      markDirty()
      setSync({ state: 'error', message: err instanceof SyncError ? err.message : 'Sync failed. Try again later.' })
    } finally {
      syncing.current = false
    }
  }, [markDirty])

  // Sync on open, when the app is hidden (switching apps, locking the phone), and shortly after changes.
  useEffect(() => {
    if (!getToken()) return
    void runSync()
    const onHide = () => {
      if (document.visibilityState === 'hidden' && dirty.current) void runSync()
      if (document.visibilityState === 'visible') void runSync()
    }
    document.addEventListener('visibilitychange', onHide)
    const timer = setInterval(() => {
      if (dirty.current && Date.now() - lastTick.current > SYNC_DEBOUNCE_MS) void runSync()
    }, 5_000)
    return () => {
      document.removeEventListener('visibilitychange', onHide)
      clearInterval(timer)
    }
  }, [runSync, sync.state === 'off'])

  const updateProgress = useCallback((fn: (p: ProgressState) => ProgressState) => {
    markDirty()
    setData((d) => {
      const current = d.progress[d.activeLanguage] ?? P.emptyProgress(d.activeLanguage, d.deviceId)
      return { ...d, progress: { ...d.progress, [d.activeLanguage]: fn(current) } }
    })
  }, [markDirty])

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setData((d) => ({ ...d, settings: { ...d.settings, ...patch } }))
  }, [])

  const tick = useCallback(() => {
    const now = Date.now()
    const elapsed = now - lastTick.current
    lastTick.current = now
    updateProgress((p) => P.addActiveTime(p, elapsed, now))
  }, [updateProgress])

  const record = useCallback(
    (e: Omit<P.AnswerEvent, 'now'>) => {
      const now = Date.now()
      const elapsed = now - lastTick.current
      lastTick.current = now
      updateProgress((p) => P.addActiveTime(P.recordAnswer(p, { ...e, now }), elapsed, now))
    },
    [updateProgress],
  )

  const value: AppContextValue = {
    data,
    pack,
    progress,
    settings,
    speaker,
    recordedCount,
    saveFailed,
    sync: { ...sync, pending: sync.state !== 'off' && (pending || sync.state === 'error') },
    updateProgress,
    updateSettings,
    replaceData: (next) => {
      markDirty()
      setData(next)
    },
    resetProgress: () =>
      setData((d) => ({
        ...d,
        progress: { ...d.progress, [d.activeLanguage]: P.emptyProgress(d.activeLanguage, d.deviceId) },
      })),
    record,
    tick,
    syncNow: runSync,
  }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
