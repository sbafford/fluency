import { useState } from 'react'
import { buildExtraPractice, buildReview, indexPack } from '../engine/session'
import { useApp } from '../state/app'
import { LinkButton } from '../ui/kit'
import { Player, type SessionSummary } from '../ui/Player'

const SESSION_SIZE = 20

export function ReviewScreen({ mode }: { mode: 'due' | 'extra' }) {
  const { pack, progress } = useApp()
  // Build once per visit so the queue doesn't reshuffle as answers are saved.
  const [exercises] = useState(() =>
    mode === 'due' ? buildReview(pack, progress, Date.now(), SESSION_SIZE) : buildExtraPractice(pack, progress, 12),
  )
  const [summary, setSummary] = useState<SessionSummary>()

  if (summary) {
    const index = indexPack(pack)
    const pct = summary.scored ? Math.round((summary.correct / summary.scored) * 100) : 100
    return (
      <div className="mx-auto max-w-[720px] px-5 pt-10 pb-16">
        <p className="mb-2 text-[15px] text-ink-2">{mode === 'due' ? 'Revision complete' : 'Practice complete'}</p>
        <p className="mb-2 text-[88px] leading-none font-semibold tracking-[-0.04em] tabular-nums">{pct}%</p>
        <p className="mb-8 max-w-[56ch] text-ink-2">
          {summary.correct} of {summary.scored} remembered. Items you knew are now scheduled further out; anything you missed
          comes back soon.
        </p>
        {summary.missed.length > 0 && (
          <ul className="mb-8 divide-y divide-line border-y border-line">
            {summary.missed.map((id) => {
              const item = index.items.get(id)
              return item ? (
                <li key={id} className="flex flex-wrap items-baseline justify-between gap-x-4 py-3">
                  <span className="target text-[22px]">{item.target}</span>
                  <span className="text-ink-2">{item.native}</span>
                </li>
              ) : null
            })}
          </ul>
        )}
        <LinkButton href="#/">Back to today</LinkButton>
      </div>
    )
  }

  if (!exercises.length) {
    return (
      <div className="mx-auto max-w-[720px] px-5 pt-16">
        <p className="mb-2 text-[22px] font-semibold">Nothing to revise right now</p>
        <p className="mb-6 text-ink-2">
          {Object.keys(progress.items).length
            ? 'Everything you have learned is scheduled for later. Come back tomorrow, or take the next lesson.'
            : 'Finish your first lesson and its words will appear here.'}
        </p>
        <LinkButton href="#/">Back to today</LinkButton>
      </div>
    )
  }

  return <Player exercises={exercises} review closeHref="#/practise" onFinish={setSummary} />
}
