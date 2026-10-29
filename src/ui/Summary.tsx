import type { ReactNode } from 'react'
import type { LearningItem } from '../engine/types'
import { AudioButton } from './kit'

/** The end-of-session result: a wide stat, a line of context, and what comes back first. */
export function SessionResult({
  kicker,
  score,
  line,
  missed,
  children,
}: {
  kicker: string
  score: number
  line: ReactNode
  missed: LearningItem[]
  children?: ReactNode
}) {
  return (
    <>
      <div className="text-[14px] text-ink-2">{kicker}</div>
      <div className="stat text-[clamp(88px,14cqi,140px)] text-ink">
        {Math.round(score * 100)}
        <span className="text-accent">%</span>
      </div>
      <p className="m-0 max-w-[56ch] text-[17px] leading-normal text-ink-2">{line}</p>
      {missed.length > 0 && (
        <section className="flex flex-col pt-4">
          <h2 className="m-0 border-b border-line pb-3 text-[20px] font-semibold">Coming Back First</h2>
          {missed.map((item) => (
            <div key={item.id} className="flex items-center gap-3.5 border-b border-line py-3">
              <AudioButton text={item.target.replace(/\(.*?\)/g, '')} size="sm" tone="wash" />
              <span className="target flex-1 text-[24px] leading-[1.1]">{item.target}</span>
              <span className="text-right text-[14px] text-ink-2">{item.native}</span>
            </div>
          ))}
        </section>
      )}
      {children}
    </>
  )
}
