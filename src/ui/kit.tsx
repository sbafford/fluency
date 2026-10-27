import { useState, type ButtonHTMLAttributes, type ReactNode, type RefObject } from 'react'
import type { SpeechRate } from '../engine/types'
import { useApp } from '../state/app'
import { PlayIcon, SlowIcon } from './icons'

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */

type Variant = 'primary' | 'secondary' | 'quiet'

const variants: Record<Variant, string> = {
  primary: 'bg-ink text-paper hover:opacity-85 disabled:opacity-30',
  secondary: 'border border-ink text-ink hover:bg-wash disabled:opacity-30',
  quiet: 'text-ink-2 hover:text-ink hover:bg-wash disabled:opacity-30',
}

export function Button({
  variant = 'primary',
  className = '',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold transition-[opacity,background-color] disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...rest}
    />
  )
}

export function LinkButton({
  href,
  variant = 'primary',
  className = '',
  children,
}: {
  href: string
  variant?: Variant
  className?: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold transition-[opacity,background-color] ${variants[variant]} ${className}`}
    >
      {children}
    </a>
  )
}

/* ------------------------------------------------------------------ */
/* Audio                                                               */
/* ------------------------------------------------------------------ */

export function AudioButton({
  text,
  voice,
  pitch,
  rate,
  label = 'Play',
  size = 'md',
  withSlow = false,
}: {
  text: string
  voice?: 'a' | 'b'
  pitch?: number
  rate?: SpeechRate
  label?: string
  size?: 'sm' | 'md' | 'lg'
  withSlow?: boolean
}) {
  const { speaker } = useApp()
  const [playing, setPlaying] = useState<'normal' | 'slow' | null>(null)
  const play = async (which: 'normal' | 'slow') => {
    setPlaying(which)
    await speaker.speak(text, { voice, pitch, rate: which === 'slow' ? 'slow' : rate })
    setPlaying(null)
  }
  const dims = { sm: 'h-9 w-9', md: 'h-11 w-11', lg: 'h-16 w-16' }[size]
  const icon = { sm: 18, md: 20, lg: 28 }[size]
  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={() => play('normal')}
        aria-label={`${label}: ${text}`}
        className={`${dims} inline-flex shrink-0 items-center justify-center rounded-full transition-colors ${
          playing === 'normal' ? 'bg-accent text-on-accent' : 'bg-ink text-paper hover:opacity-85'
        }`}
      >
        <PlayIcon size={icon} />
      </button>
      {withSlow && (
        <button
          type="button"
          onClick={() => play('slow')}
          aria-label={`Play slowly: ${text}`}
          className={`${dims} inline-flex shrink-0 items-center justify-center rounded-full border transition-colors ${
            playing === 'slow' ? 'border-accent bg-accent text-on-accent' : 'border-line text-ink hover:border-ink'
          }`}
        >
          <SlowIcon size={icon} />
        </button>
      )}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Text                                                                */
/* ------------------------------------------------------------------ */

/** Renders *word* as target-language emphasis inside explanatory text. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*)/g)
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('*') && p.endsWith('*') ? (
          <em key={i} className="target text-[1.12em] not-italic font-medium">
            {p.slice(1, -1)}
          </em>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  )
}

export function PageHeader({ title, aside, children }: { title: string; aside?: ReactNode; children?: ReactNode }) {
  return (
    <header className="mb-8 pt-2 md:pt-8">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-[40px] leading-[1.05] font-semibold tracking-[-0.03em] md:text-[56px]">{title}</h1>
        {aside}
      </div>
      {children && <div className="mt-3 max-w-[60ch] text-ink-2">{children}</div>}
    </header>
  )
}

export function SectionTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-4">
      <h2 className="text-[19px] font-semibold tracking-[-0.01em]">{children}</h2>
      {aside && <div className="text-sm text-ink-2">{aside}</div>}
    </div>
  )
}

export function Bar({ value, tone = 'accent', label }: { value: number; tone?: 'accent' | 'ink' | 'good'; label?: string }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100)
  const fill = { accent: 'bg-accent', ink: 'bg-ink', good: 'bg-good' }[tone]
  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-full bg-line"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className={`h-full rounded-full ${fill} transition-[width] duration-300`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export function Tag({ children, tone = 'plain' }: { children: ReactNode; tone?: 'plain' | 'accent' | 'good' | 'bad' }) {
  const tones = {
    plain: 'bg-wash text-ink-2',
    accent: 'bg-accent-wash text-accent',
    good: 'bg-good-wash text-good',
    bad: 'bg-bad-wash text-bad',
  }
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[12.5px] font-medium ${tones[tone]}`}>{children}</span>
}

/* ------------------------------------------------------------------ */
/* Typing helpers                                                      */
/* ------------------------------------------------------------------ */

/** Buttons that insert accented characters at the cursor. */
export function AccentBar({
  inputRef,
  value,
  onChange,
}: {
  inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement | null>
  value: string
  onChange: (v: string) => void
}) {
  const { pack } = useApp()
  const insert = (ch: string) => {
    const el = inputRef.current
    const start = el?.selectionStart ?? value.length
    const end = el?.selectionEnd ?? value.length
    const next = value.slice(0, start) + ch + value.slice(end)
    onChange(next)
    requestAnimationFrame(() => {
      el?.focus()
      el?.setSelectionRange(start + ch.length, start + ch.length)
    })
  }
  return (
    <div className="flex flex-wrap gap-1.5" aria-label="Accented letters">
      {pack.specialCharacters.map((ch) => (
        <button
          key={ch}
          type="button"
          // Keep focus in the text field so the mobile keyboard stays open.
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => insert(ch)}
          className="target h-9 min-w-9 rounded-lg border border-line px-2 text-[19px] leading-none hover:border-ink"
        >
          {ch}
        </button>
      ))}
    </div>
  )
}

export function pct(n: number | undefined): string {
  return n === undefined ? 'n/a' : `${Math.round(n * 100)}%`
}
