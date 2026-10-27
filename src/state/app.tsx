import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { getLanguage } from '../content'
import * as P from '../engine/progress'
import { load, save } from '../engine/storage'
import type { AppData, LanguagePack, ProgressState, Settings } from '../engine/types'
import { Speaker } from '../speech/tts'

/*
 * App state: one AppData document, persisted to localStorage on every change.
 * Screens call the actions here; the engine's pure functions do the work.
 */

interface AppContextValue {
  data: AppData
  pack: LanguagePack
  progress: ProgressState
  settings: Settings
  speaker: Speaker
  saveFailed: boolean
  updateProgress: (fn: (p: ProgressState) => ProgressState) => void
  updateSettings: (patch: Partial<Settings>) => void
  replaceData: (data: AppData) => void
  resetProgress: () => void
  record: (e: Omit<P.AnswerEvent, 'now'>) => void
  /** Adds study time since the last call, so idle time is not counted. */
  tick: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children, initial }: { children: ReactNode; initial?: AppData }) {
  const [data, setData] = useState<AppData>(() => initial ?? load())
  const [saveFailed, setSaveFailed] = useState(false)
  const lastTick = useRef(Date.now())

  useEffect(() => {
    setSaveFailed(!save(data))
  }, [data])

  const pack = getLanguage(data.activeLanguage)
  const progress = data.progress[pack.id] ?? P.emptyProgress(pack.id)
  const settings = data.settings

  const speaker = useMemo(
    () => new Speaker(pack.locale, pack.preferredVoices, { a: settings.voiceA, b: settings.voiceB }, settings.rate),
    [pack, settings.voiceA, settings.voiceB, settings.rate],
  )

  const updateProgress = useCallback((fn: (p: ProgressState) => ProgressState) => {
    setData((d) => {
      const current = d.progress[d.activeLanguage] ?? P.emptyProgress(d.activeLanguage)
      return { ...d, progress: { ...d.progress, [d.activeLanguage]: fn(current) } }
    })
  }, [])

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
    saveFailed,
    updateProgress,
    updateSettings,
    replaceData: setData,
    resetProgress: () =>
      setData((d) => ({ ...d, progress: { ...d.progress, [d.activeLanguage]: P.emptyProgress(d.activeLanguage) } })),
    record,
    tick,
  }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
