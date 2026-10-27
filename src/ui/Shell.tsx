import type { ReactNode } from 'react'
import { useApp } from '../state/app'
import { href, type Route } from '../state/router'
import { LearnIcon, PractiseIcon, ProgressIcon, SettingsIcon, TodayIcon } from './icons'

const NAV = [
  { name: 'today', label: 'Today', icon: TodayIcon },
  { name: 'learn', label: 'Learn', icon: LearnIcon },
  { name: 'practise', label: 'Practise', icon: PractiseIcon },
  { name: 'progress', label: 'Progress', icon: ProgressIcon },
] as const

export function Shell({ route, children }: { route: Route; children: ReactNode }) {
  const { pack, saveFailed } = useApp()
  const active = route.name
  return (
    <div className="min-h-dvh md:grid md:grid-cols-[232px_1fr]">
      {/* Desktop rail */}
      <nav aria-label="Main" className="sticky top-0 hidden h-dvh flex-col bg-rail px-4 py-7 text-on-rail md:flex">
        <a href="#/" className="mb-10 px-3">
          <span className="target block text-[30px] leading-none">{pack.nativeName.toLowerCase()}</span>
        </a>
        <ul className="space-y-1">
          {NAV.map(({ name, label, icon: Icon }) => (
            <li key={name}>
              <a
                href={href({ name } as Route)}
                aria-current={active === name ? 'page' : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors ${
                  active === name ? 'bg-on-rail/10 text-on-rail' : 'text-on-rail-dim hover:text-on-rail'
                }`}
              >
                <Icon size={20} className={active === name ? 'text-accent' : ''} />
                {label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#/settings"
          aria-current={active === 'settings' ? 'page' : undefined}
          className={`mt-auto flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium ${
            active === 'settings' ? 'text-on-rail' : 'text-on-rail-dim hover:text-on-rail'
          }`}
        >
          <SettingsIcon size={20} />
          Settings
        </a>
      </nav>

      <div className="min-w-0">
        {saveFailed && (
          <p className="bg-bad-wash px-5 py-2 text-[14px] text-bad">
            Progress can't be saved in this browser (storage is full or blocked). Export a backup from Settings.
          </p>
        )}
        <main className="mx-auto w-full max-w-[880px] px-5 pt-4 pb-32 md:px-10 md:pb-16">{children}</main>
      </div>

      {/* Mobile tab bar */}
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-30 bg-rail pb-[env(safe-area-inset-bottom)] text-on-rail md:hidden"
      >
        <ul className="mx-auto grid max-w-md grid-cols-4">
          {NAV.map(({ name, label, icon: Icon }) => (
            <li key={name}>
              <a
                href={href({ name } as Route)}
                aria-current={active === name ? 'page' : undefined}
                className={`flex flex-col items-center gap-1 pt-2.5 pb-2 text-[11.5px] font-medium ${
                  active === name ? 'text-on-rail' : 'text-on-rail-dim'
                }`}
              >
                <Icon size={22} className={active === name ? 'text-accent' : ''} />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
