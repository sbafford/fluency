import { emptyProgress } from './progress'
import type { AppData, DayLog, ProgressState, Settings } from './types'

/*
 * Persistence. Everything lives in one versioned JSON document in
 * localStorage. Export, import and sync all use the same document.
 *
 * Version history
 * 1: first release
 * 2: adds a device id; daily logs are kept per device so sync can merge them exactly
 */

export const STORAGE_KEY = 'fluency.data'
export const CURRENT_VERSION = 2 as const

export const DEFAULT_SETTINGS: Settings = {
  learnerName: '',
  dailyGoal: 20,
  rate: 'normal',
  speechInput: true,
  showTranslations: false,
}

export function newDeviceId(): string {
  const c = globalThis.crypto
  if (c && 'randomUUID' in c) return c.randomUUID().slice(0, 8)
  return Math.random().toString(36).slice(2, 10)
}

export function defaultData(languageId = 'fr', deviceId = newDeviceId()): AppData {
  return {
    version: CURRENT_VERSION,
    deviceId,
    activeLanguage: languageId,
    settings: { ...DEFAULT_SETTINGS },
    progress: { [languageId]: emptyProgress(languageId, deviceId) },
  }
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function sanitiseDays(raw: unknown, version: number, device: string): ProgressState['days'] {
  if (!isObject(raw)) return {}
  // Version 1 kept a single flat map of dates; attribute it to this device.
  if (version < 2) return { [device]: raw as Record<string, DayLog> }
  return raw as ProgressState['days']
}

function sanitiseProgress(id: string, raw: unknown, version: number, device: string): ProgressState {
  const base = emptyProgress(id, device)
  if (!isObject(raw)) return base
  return {
    languageId: id,
    device,
    items: isObject(raw.items) ? (raw.items as ProgressState['items']) : base.items,
    lessons: isObject(raw.lessons) ? (raw.lessons as ProgressState['lessons']) : base.lessons,
    listening: isObject(raw.listening) ? (raw.listening as ProgressState['listening']) : base.listening,
    conversations: isObject(raw.conversations)
      ? (raw.conversations as ProgressState['conversations'])
      : base.conversations,
    days: sanitiseDays(raw.days, version, device),
    recent: Array.isArray(raw.recent) ? (raw.recent as ProgressState['recent']) : base.recent,
  }
}

/**
 * Turn any stored, imported or synced document into current-version AppData.
 * Throws if the document is not recognisable as this app's data.
 *
 * `deviceId` forces the result to belong to this device (used for imports and
 * sync, so another device's id is never adopted).
 */
export function migrate(raw: unknown, deviceId?: string): AppData {
  if (!isObject(raw)) throw new Error('This file is not a progress backup.')
  const data = isObject(raw.data) && raw.app === 'fluency' ? raw.data : raw
  if (!isObject(data) || typeof data.version !== 'number' || !isObject(data.progress)) {
    throw new Error('This file is not a progress backup.')
  }
  if (data.version > CURRENT_VERSION) {
    throw new Error('This backup was made by a newer version of the app. Update the app, then import again.')
  }
  const device = deviceId ?? (typeof data.deviceId === 'string' && data.deviceId ? data.deviceId : newDeviceId())
  // When re-homing a version 1 document onto this device, its flat logs came from wherever it was made.
  const legacyDevice = typeof data.deviceId === 'string' && data.deviceId ? data.deviceId : device
  const activeLanguage = typeof data.activeLanguage === 'string' ? data.activeLanguage : 'fr'
  const progress: AppData['progress'] = {}
  for (const [id, p] of Object.entries(data.progress)) {
    const migrated = sanitiseProgress(id, p, data.version, legacyDevice)
    progress[id] = { ...migrated, device }
  }
  if (!progress[activeLanguage]) progress[activeLanguage] = emptyProgress(activeLanguage, device)
  return {
    version: CURRENT_VERSION,
    deviceId: device,
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

/** Parse a backup for this device. Its progress replaces this device's; the device id stays this device's. */
export function importData(text: string, deviceId?: string): AppData {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('This file could not be read. Choose a .json backup exported from this app.')
  }
  return migrate(parsed, deviceId)
}
