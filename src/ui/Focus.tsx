import { createContext, useContext, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { CrossIcon } from './icons'

/*
 * Full-screen layout for focused work (lessons, revision, listening,
 * conversation): a slim header with progress, a 720px content column, and a
 * sticky bar at the bottom. Exercises put their buttons in that bar with
 * <Actions>, so the primary action is always in the same place.
 */

const ActionsTarget = createContext<HTMLElement | null>(null)

export function FocusFrame({
  kind,
  title,
  count,
  progress,
  closeHref,
  children,
  bottom,
}: {
  kind: string
  title: string
  count?: string
  /** 0 to 1. Omit to hide the bar. */
  progress?: number
  closeHref: string
  children: ReactNode
  /** Replaces the action bar, for example with a feedback sheet. */
  bottom?: ReactNode
}) {
  const [target, setTarget] = useState<HTMLElement | null>(null)
  return (
    <ActionsTarget.Provider value={target}>
      <div className="flex min-h-dvh flex-col bg-paper text-ink">
        <header className="mx-auto box-border flex w-full max-w-[720px] flex-col gap-3 px-[clamp(16px,3cqi,24px)] pt-[max(14px,env(safe-area-inset-top))]">
          <div className="flex items-center gap-3">
            <a href={closeHref} aria-label="Close. Your answers so far are saved" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-wash hover:text-ink">
              <CrossIcon size={20} />
            </a>
            <div className="min-w-0 flex-1 text-center">
              <div className="text-[12px] tracking-[0.06em] text-ink-2 uppercase">{kind}</div>
              <div className="target truncate text-[21px] italic">{title}</div>
            </div>
            <span className="w-11 shrink-0 text-right text-[13px] text-ink-2 tabular-nums">{count}</span>
          </div>
          {progress !== undefined && (
            <div className="h-1 rounded-[9px] bg-wash" role="progressbar" aria-label="Progress" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full rounded-[9px] bg-fill transition-[width] duration-300" style={{ width: `${Math.round(Math.min(1, progress) * 100)}%` }} />
            </div>
          )}
        </header>

        <main className="mx-auto box-border flex w-full max-w-[720px] flex-[1_0_auto] flex-col gap-5 px-[clamp(20px,3cqi,28px)] pt-[clamp(28px,5cqi,56px)] pb-6">
          {children}
        </main>

        {bottom ?? <div ref={setTarget} className="sticky bottom-0 z-10 empty:hidden" />}
      </div>
    </ActionsTarget.Provider>
  )
}

/** The sticky action bar at the bottom of a FocusFrame. */
export function Actions({ children }: { children: ReactNode }) {
  const target = useContext(ActionsTarget)
  if (!target) return null
  return createPortal(
    <div className="border-t border-line bg-paper">
      <div className="mx-auto box-border flex max-w-[720px] items-center gap-2.5 px-[clamp(20px,3cqi,28px)] pt-4 pb-[max(20px,env(safe-area-inset-bottom))]">
        {children}
      </div>
    </div>,
    target,
  )
}

/** The big primary button in the action bar. */
export function ActionButton({
  children,
  onClick,
  disabled,
  grow = true,
  type = 'button',
  form,
}: {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  grow?: boolean
  type?: 'button' | 'submit'
  form?: string
}) {
  return (
    <button
      type={type}
      form={form}
      onClick={onClick}
      disabled={disabled}
      className={`${grow ? 'flex-1' : ''} rounded-full bg-accent px-[26px] py-[17px] text-center text-[17px] font-bold text-on-accent transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {children}
    </button>
  )
}

export type SheetTone = 'correct' | 'nearly' | 'wrong'

/**
 * The feedback sheet: pink when correct, yellow when nearly, and the inverted
 * theme when wrong.
 */
export function FeedbackSheet({
  tone,
  title,
  label,
  answer,
  answerIsFrench = true,
  onPlay,
  onFlag,
  children,
  onContinue,
  continueLabel = 'Continue',
  secondary,
}: {
  tone: SheetTone
  title: string
  label?: string
  answer?: string
  answerIsFrench?: boolean
  onPlay?: () => void
  /** Offered with audio: report that the pronunciation sounded wrong. */
  onFlag?: () => void
  children?: ReactNode
  onContinue: () => void
  /** Text of the main button. */
  continueLabel?: string
  /** A quieter second choice beside the main button, such as skipping a retry. */
  secondary?: { label: string; onClick: () => void }
}) {
  const [flagged, setFlagged] = useState(false)
  const colours = {
    correct: 'bg-pink text-feedback-on',
    nearly: 'bg-yellow text-feedback-on',
    wrong: 'bg-ink text-paper',
  }[tone]
  const button = {
    correct: 'bg-feedback-on text-pink',
    nearly: 'bg-feedback-on text-yellow',
    wrong: 'bg-paper text-ink',
  }[tone]
  return (
    <div className={`sheet-rise sticky bottom-0 z-10 rounded-t-[32px] ${colours}`} role="status" aria-live="polite">
      <div className="mx-auto box-border flex max-w-[720px] flex-col gap-3 px-[clamp(20px,3cqi,28px)] pt-7 pb-[max(28px,env(safe-area-inset-bottom))]">
        <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-2">
          <span className="target text-[44px] leading-none">{title}</span>
          {label && <span className="text-[14px] font-semibold opacity-80">{label}</span>}
        </div>
        {answer && (
          <div className="flex items-center gap-3">
            {onPlay && (
              <button type="button" onClick={onPlay} aria-label={`Play: ${answer}`} className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${button}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M11 5 6 9H3v6h3l5 4V5ZM15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
                </svg>
              </button>
            )}
            <span className={answerIsFrench ? 'target text-[25px] leading-[1.2]' : 'text-[18px] font-medium'}>{answer}</span>
            {onPlay && onFlag && (
              <button
                type="button"
                disabled={flagged}
                onClick={() => {
                  onFlag()
                  setFlagged(true)
                }}
                className="ml-auto shrink-0 py-1 text-[12px] font-semibold whitespace-nowrap opacity-70 hover:opacity-100"
              >
                {flagged ? 'Flagged' : 'Sounds Wrong?'}
              </button>
            )}
          </div>
        )}
        {children && <div className="max-w-[56ch] text-[15px] leading-[1.45]">{children}</div>}
        <div className="mt-1.5 flex items-center gap-2">
          {secondary && (
            <button type="button" onClick={secondary.onClick} className="shrink-0 px-[18px] py-4 text-[15px] whitespace-nowrap opacity-80 hover:opacity-100">
              {secondary.label}
            </button>
          )}
          <button type="button" onClick={onContinue} autoFocus className={`flex-1 rounded-full p-[18px] text-center text-[17px] font-bold ${button}`}>
            {continueLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
