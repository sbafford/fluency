import { useApp } from '../state/app'

/*
 * Sync status: a small dot and a word. Hidden when sync isn't set up.
 * Tapping it opens Settings, where "Sync Now" and any error details live.
 */

function timeAgo(t: number, now: number): string {
  const mins = Math.round((now - t) / 60000)
  if (mins < 1) return 'Just Now'
  if (mins < 60) return `${mins} Min Ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours} H Ago`
  return new Date(t).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}

export function syncText(state: string, pending: boolean | undefined, lastSyncedAt: number | undefined, long = false) {
  if (state === 'syncing') return { label: 'Syncing', dot: 'bg-fill animate-pulse' }
  if (state === 'error') return { label: 'Not Synced', dot: 'bg-accent' }
  if (pending) return { label: long ? 'Changes Waiting to Sync' : 'Waiting', dot: 'bg-yellow' }
  if (long && lastSyncedAt) return { label: `Last Synced ${timeAgo(lastSyncedAt, Date.now())}`, dot: 'bg-sync' }
  return { label: 'Synced', dot: 'bg-sync' }
}

export function SyncBadge() {
  const { sync, settings } = useApp()
  if (sync.state === 'off') return null
  const { label, dot } = syncText(sync.state, sync.pending, settings.lastSyncedAt)
  return (
    <a
      href="#/settings"
      className="flex items-center gap-1.5 text-[13px] text-ink-2 hover:text-ink"
      aria-label={`Sync status: ${label}${sync.state === 'error' && sync.message ? `. ${sync.message}` : ''}`}
      title={sync.state === 'error' ? sync.message : undefined}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} aria-hidden="true" />
      {label}
    </a>
  )
}
