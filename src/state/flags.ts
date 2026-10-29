/*
 * Lines whose audio sounded wrong, flagged from the feedback sheet so they can
 * be fixed or re-recorded. Kept on this device; copy them from Settings.
 */

const KEY = 'fluency.flaggedAudio'

export function flaggedAudio(): string[] {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(list) ? list.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

export function flagAudio(text: string): void {
  try {
    const list = flaggedAudio()
    if (!list.includes(text)) localStorage.setItem(KEY, JSON.stringify([...list, text]))
  } catch {
    // Storage blocked: nothing to keep.
  }
}

export function clearFlaggedAudio(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // Nothing to do.
  }
}
