import { emptyProgress } from './progress'
import type { AppData, ProgressState, Settings } from './types'

/*
 * Persistence. Everything lives in one versioned JSON document in
 * localStorage. Export and import use the same document, so a backup can be
 * restored on another device or browser.
 */

export const STORAGE_KEY = 'fluency.data'
export const CURRENT_VERSION = 1 as const

export const DEFAULT_SETTINGS: Settings = {
  learnerName: '',
  dailyGoal: 20,
  rate: 'normal',
  speechInput: true,
  showTranslations: false,
}

export function defaultData(languageId = 'fr'): AppData {
  return {
    version: CURRENT_VERSION,
    activeLanguage: languageId,
    settings: { ...DEFAULT_SETTINGS },
    progress: { [languageId]: emptyProgress(languageId) },
  }
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function sanitiseProgress(id: string, raw: unknown): ProgressState {
  const base = emptyProgress(id)
  if (!isObject(raw)) return base
  return {
    languageId: id,
    items: isObject(raw.items) ? (raw.items as ProgressState['items']) : base.items,
    lessons: isObject(raw.lessons) ? (raw.lessons as ProgressState['lessons']) : base.lessons,
    listening: isObject(raw.listening) ? (raw.listening as ProgressState['listening']) : base.listening,
    conversations: isObject(raw.conversations)
      ? (raw.conversations as ProgressState['conversations'])
      : base.conversations,
    days: isObject(raw.days) ? (raw.days as ProgressState['days']) : base.days,
    recent: Array.isArray(raw.recent) ? (raw.recent as ProgressState['recent']) : base.recent,
  }
}

/**
 * Turn any stored or imported document into current-version AppData.
 * Throws if the document is not recognisable as this app's data.
 * Future schema changes add a step here, keyed on `version`.
 */
export function migrate(raw: unknown): AppData {
  if (!isObject(raw)) throw new Error('This file is not a progress backup.')
  const data = isObject(raw.data) && raw.app === 'fluency' ? raw.data : raw
  if (!isObject(data) || typeof data.version !== 'number' || !isObject(data.progress)) {
    throw new Error('This file is not a progress backup.')
  }
  if (data.version > CURRENT_VERSION) {
    throw new Error('This backup was made by a newer version of the app. Update the app, then import again.')
  }
  const activeLanguage = typeof data.activeLanguage === 'string' ? data.activeLanguage : 'fr'
  const progress: AppData['progress'] = {}
  for (const [id, p] of Object.entries(data.progress)) progress[id] = sanitiseProgress(id, p)
  if (!progress[activeLanguage]) progress[activeLanguage] = emptyProgress(activeLanguage)
  return {
    version: CURRENT_VERSION,
    activeLanguage,
    settings: { ...DEFAULT_SETTINGS, ...(isObject(data.settings) ? (data.settings as Partial<Settings>) : {}) },
    progress,
  }
}

export function load(storage: Storage | undefined = globalThis.localStorage): AppData {
  try {
    const text = storage?.getItem(STORAGE_KEY)
    if (!text) return defaultData()
    return migrate(JSON.parse(text))
  } catch {
    // Keep the unreadable copy rather than silently overwriting it.
    try {
      const text = storage?.getItem(STORAGE_KEY)
      if (text) storage?.setItem(`${STORAGE_KEY}.unreadable.${Date.now()}`, text)
    } catch {
      /* storage unavailable */
    }
    return defaultData()
  }
}

export function save(data: AppData, storage: Storage | undefined = globalThis.localStorage): boolean {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

export function exportData(data: AppData, now = Date.now()): string {
  return JSON.stringify({ app: 'fluency', exportedAt: new Date(now).toISOString(), data }, null, 2)
}

export function importData(text: string): AppData {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('This file could not be read. Choose a .json backup exported from this app.')
  }
  return migrate(parsed)
}
