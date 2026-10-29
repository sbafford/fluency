import { useState, type ButtonHTMLAttributes, type ReactNode, type RefObject } from 'react'
import type { SpeechRate } from '../engine/types'
import { useApp } from '../state/app'
import { PlayIcon } from './icons'

/*
 * Shared building blocks, styled from the design handoff.
 * Buttons: primary (pink), ink, outline, ghost.
 */

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */

export type Variant = 'primary' | 'ink' | 'outline' | 'ghost'

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-on-accent font-semibold px-[26px] py-[14px] hover:opacity-90',
  ink: 'bg-btn text-onbtn font-semibold px-6 py-[14px] hover:opacity-90',
  outline: 'border-[1.5px] border-ink text-ink font-semibold px-6 py-3 hover:bg-wash',
  ghost: 'text-ink-2 hover:text-ink px-[18px] py-4',
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full text-[15px] leading-tight whitespace-nowrap transition-[opacity,background-color] disabled:cursor-not-allowed disabled:opacity-40'

export function Button({
  variant = 'primary',
  className = '',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button type="button" className={`${base} ${variants[variant]} ${className}`} {...rest} />
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
    <a href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </a>
  )
}

/* ------------------------------------------------------------------ */
/* Segmented control                                                   */
/* ------------------------------------------------------------------ */

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  size = 'md',
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
  label: string
  size?: 'sm' | 'md'
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex gap-1 self-start rounded-full bg-wash p-1">
      {options.map((o) => {
        const on = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={`min-w-[52px] rounded-full text-center ${size === 'sm' ? 'px-4 py-2 text-[14px]' : 'px-4 py-2.5 text-[15px]'} ${
              on ? 'bg-btn font-semibold text-onbtn' : 'text-ink-2 hover:text-ink'
            }`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
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
  who,
  label = 'Play',
  size = 'md',
  tone = 'ink',
}: {
  text: string
  voice?: 'a' | 'b'
  pitch?: number
  rate?: SpeechRate
  /** Speaker name, for the recorded voice of a character. */
  who?: string
  label?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  tone?: 'ink' | 'wash' | 'fill'
}) {
  const { speaker } = useApp()
  const [playing, setPlaying] = useState(false)
  const play = async () => {
    setPlaying(true)
    await speaker.speak(text, { voice, pitch, rate, who })
    setPlaying(false)
  }
  const dims = { sm: 'h-10 w-10', md: 'h-11 w-11', lg: 'h-14 w-14', xl: 'h-[72px] w-[72px]' }[size]
  const icon = { sm: 18, md: 20, lg: 26, xl: 30 }[size]
  const colours = playing
    ? 'bg-fill text-feedback-on'
    : { ink: 'bg-btn text-onbtn', wash: 'bg-wash text-ink', fill: 'bg-fill text-feedback-on' }[tone]
  return (
    <button
      type="button"
      onClick={play}
      aria-label={`${label}: ${text}`}
      className={`${dims} ${colours} inline-flex shrink-0 items-center justify-center rounded-full transition-colors hover:opacity-90`}
    >
      <PlayIcon size={icon} />
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* Text                                                                */
/* ------------------------------------------------------------------ */

/** Renders *word* as French, in the serif, inside explanatory text. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*)/g)
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('*') && p.endsWith('*') ? (
          <em key={i} className="target text-[1.18em] not-italic">
            {p.slice(1, -1)}
          </em>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  )
}

export function PageTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="target m-0 text-[clamp(56px,7cqi,88px)] leading-[0.95] tracking-[-0.02em]">{children}</h1>
  )
}

export function SectionHead({ title, aside, icon }: { title: string; aside?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-line pb-3">
      <h2 className="m-0 flex items-center gap-2.5 text-[20px] font-semibold">
        {icon}
        {title}
      </h2>
      {aside !== undefined && <span className="text-[13px] text-ink-2">{aside}</span>}
    </div>
  )
}

export function Pill({ children, tone = 'wash' }: { children: ReactNode; tone?: 'wash' | 'shaky' | 'solid' | 'sealed' | 'new' }) {
  const tones = {
    wash: 'bg-wash text-ink-2 font-normal',
    new: 'bg-strength-new text-feedback-on font-bold',
    shaky: 'bg-strength-shaky text-feedback-on font-bold',
    solid: 'bg-strength-solid text-feedback-on font-bold',
    sealed: 'bg-strength-sealed text-feedback-on font-bold',
  }
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] leading-none ${tones[tone]}`}>{children}</span>
}

export function Meter({ value, color = 'var(--fill)', height = 8, label }: { value: number; color?: string; height?: number; label?: string }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100)
  return (
    <span
      className="block w-full overflow-hidden rounded-full bg-wash"
      style={{ height }}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <span className="block h-full rounded-full transition-[width] duration-300" style={{ width: `${pct}%`, background: color }} />
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Typing helpers                                                      */
/* ------------------------------------------------------------------ */

/** Buttons that insert accented characters at the cursor. */
export function AccentKeys({
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
    onChange(value.slice(0, start) + ch + value.slice(end))
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
          // Keep focus in the text field so the phone keyboard stays open.
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => insert(ch)}
          className="target grid h-11 min-w-11 select-none place-items-center rounded-xl border border-line text-[22px] hover:border-ink"
        >
          {ch}
        </button>
      ))}
    </div>
  )
}

export function pct(n: number | undefined): string {
  return n === undefined ? '–' : `${Math.round(n * 100)}%`
}

export function minutesLabel(n: number): string {
  return `${n} Min`
}
