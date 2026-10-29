/*
 * Where you got to in an unfinished lesson, so leaving (closing the tab,
 * switching apps, the phone locking) doesn't send you back to the start.
 * Answers are already saved to your progress as you go; this only keeps the
 * position. Kept on this device only, and dropped after a week.
 */

export interface SavedPosition {
  /** Exercise ids in play order, with whether each is a retry. */
  queue: { id: string; retry: boolean }[]
  pos: number
  /** First-attempt results by exercise id. */
  results: Record<string, 'correct' | 'near' | 'wrong'>
  savedAt: number
}

const PREFIX = 'fluency.resume.'
const WEEK = 7 * 86_400_000

function store(): Storage | undefined {
  try {
    return globalThis.localStorage
  } catch {
    return undefined
  }
}

export function loadPosition(key: string, validIds: Set<string>, now = Date.now()): SavedPosition | undefined {
  try {
    const raw = store()?.getItem(PREFIX + key)
    if (!raw) return undefined
    const saved = JSON.parse(raw) as SavedPosition
    const usable =
      Array.isArray(saved.queue) &&
      saved.queue.every((q) => validIds.has(q.id)) &&
      saved.pos > 0 &&
      saved.pos < saved.queue.length &&
      now - saved.savedAt < WEEK
    if (!usable) {
      clearPosition(key)
      return undefined
    }
    return saved
  } catch {
    return undefined
  }
}

export function savePosition(key: string, position: SavedPosition): void {
  try {
    store()?.setItem(PREFIX + key, JSON.stringify(position))
  } catch {
    // Storage full or blocked: resuming is a convenience, so carry on without it.
  }
}

export function clearPosition(key: string): void {
  try {
    store()?.removeItem(PREFIX + key)
  } catch {
    // Nothing to do.
  }
}
