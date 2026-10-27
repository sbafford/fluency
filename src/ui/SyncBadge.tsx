import { useApp } from '../state/app'

/*
 * A small sync indicator. Hidden when sync isn't set up. Tapping it opens
 * Settings, where "Sync now" and any error details live.
 */

function timeAgo(t: number, now: number): string {
  const mins = Math.round((now - t) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours} h ago`
  return new Date(t).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}

export function SyncBadge({ tone = 'paper' }: { tone?: 'paper' | 'rail' }) {
  const { sync, settings } = useApp()
  if (sync.state === 'off') return null

  let label: string
  let dot: string
  if (sync.state === 'syncing') {
    label = 'Syncing…'
    dot = 'bg-accent animate-pulse'
  } else if (sync.state === 'error') {
    label = 'Not synced'
    dot = 'bg-bad'
  } else if (sync.pending) {
    label = 'Changes waiting to sync'
    dot = 'bg-near'
  } else {
    label = settings.lastSyncedAt ? `Synced ${timeAgo(settings.lastSyncedAt, Date.now())}` : 'Synced'
    dot = 'bg-good'
  }

  const text = tone === 'rail' ? 'text-on-rail-dim hover:text-on-rail' : 'text-ink-2 hover:text-ink'
  return (
    <a
      href="#/settings"
      className={`inline-flex items-center gap-2 text-[13px] ${text}`}
      aria-label={`Sync status: ${label}${sync.state === 'error' && sync.message ? `. ${sync.message}` : ''}`}
      title={sync.state === 'error' ? sync.message : undefined}
    >
      <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} aria-hidden="true" />
      {label}
    </a>
  )
}
