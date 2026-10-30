import type { ReactNode } from 'react'
import { useApp } from '../state/app'
import { href, type Route } from '../state/router'
import { LearnIcon, PractiseIcon, ProgressIcon, TodayIcon } from './icons'
import { SyncBadge } from './SyncBadge'

const NAV = [
  { name: 'today', label: 'Today', icon: TodayIcon },
  { name: 'learn', label: 'Learn', icon: LearnIcon },
  { name: 'practise', label: 'Practise', icon: PractiseIcon },
  { name: 'progress', label: 'Progress', icon: ProgressIcon },
] as const

export function Logo({ size = 40 }: { size?: number }) {
  return (
    <a href="#/" className="flex flex-col items-start leading-none" aria-label="fluéncy, en français. Today">
      <span className="target tracking-[-0.02em]" style={{ fontSize: size }}>
        flu<span className="text-accent">é</span>ncy
      </span>
      <span className="pl-0.5 text-[12px] font-medium text-ink-2">en français</span>
    </a>
  )
}

function Avatar({ big = false }: { big?: boolean }) {
  const { settings } = useApp()
  const initial = settings.learnerName.trim().charAt(0).toUpperCase()
  return (
    <a
      href="#/settings"
      aria-label="Settings"
      className={`grid shrink-0 place-items-center rounded-full bg-btn font-semibold text-onbtn ${big ? 'h-11 w-11 text-[15px]' : 'h-9 w-9 text-[14px]'}`}
    >
      {initial || (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      )}
    </a>
  )
}

export function Shell({ route, children }: { route: Route; children: ReactNode }) {
  const { saveFailed } = useApp()
  // The phrasebook belongs to Learn.
  const active = route.name === 'phrasebook' ? 'learn' : route.name
  return (
    <div className="flex min-h-dvh flex-col bg-paper text-ink">
      {/* Desktop header */}
      <header className="sticky top-0 z-20 hidden items-center justify-between gap-6 border-b border-line bg-paper px-[clamp(20px,4cqi,48px)] py-5 md:flex">
        <Logo />
        <nav aria-label="Main" className="flex gap-1 rounded-full bg-wash p-1 text-[15px]">
          {NAV.map(({ name, label, icon: Icon }) => {
            const on = active === name
            return (
              <a
                key={name}
                href={href({ name } as Route)}
                aria-current={on ? 'page' : undefined}
                className={`flex items-center gap-2 rounded-full py-2 pr-[18px] pl-3.5 ${on ? 'bg-btn font-semibold text-onbtn' : 'text-ink-2 hover:text-ink'}`}
              >
                <Icon size={18} />
                {label}
              </a>
            )
          })}
        </nav>
        <div className="flex items-center gap-[18px]">
          <SyncBadge />
          <Avatar />
        </div>
      </header>

      {/* Phone header */}
      <div className="flex items-center justify-between px-5 pt-[max(16px,env(safe-area-inset-top))] md:hidden">
        <Logo size={36} />
        <div className="flex items-center gap-3.5">
          <SyncBadge />
          <Avatar big />
        </div>
      </div>

      {saveFailed && (
        <p className="mx-auto mt-4 w-full max-w-[1120px] px-[clamp(20px,5cqi,64px)] text-[14px] text-accent">
          Progress can't be saved in this browser (storage is full or blocked). Export a backup from Settings.
        </p>
      )}

      <main className="mx-auto box-border w-full max-w-[1120px] flex-[1_0_auto] px-[clamp(20px,5cqi,64px)] pt-[clamp(24px,4cqi,48px)] pb-12">
        {children}
      </main>

      {/* Phone tab bar */}
      <nav
        aria-label="Main"
        className="sticky bottom-0 z-20 grid grid-cols-4 border-t border-line bg-paper px-2 pt-2 pb-[max(14px,env(safe-area-inset-bottom))] md:hidden"
      >
        {NAV.map(({ name, label, icon: Icon }) => {
          const on = active === name
          return (
            <a
              key={name}
              href={href({ name } as Route)}
              aria-current={on ? 'page' : undefined}
              className={`flex min-h-11 flex-col items-center gap-1.5 py-2 text-[12px] ${on ? 'font-semibold text-ink' : 'text-ink-3'}`}
            >
              <Icon size={24} className={on ? 'text-accent' : 'text-ink-3'} />
              {label}
            </a>
          )
        })}
      </nav>
    </div>
  )
}
