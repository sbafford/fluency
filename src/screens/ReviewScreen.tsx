import { useState } from 'react'
import { buildExtraPractice, buildReview, indexPack } from '../engine/session'
import { useApp } from '../state/app'
import { ActionButton, Actions, FocusFrame } from '../ui/Focus'
import { LinkButton } from '../ui/kit'
import { Player, type SessionSummary } from '../ui/Player'
import { SessionResult } from '../ui/Summary'

const SESSION_SIZE = 20

export function ReviewScreen({ mode }: { mode: 'due' | 'extra' }) {
  const { pack, progress } = useApp()
  // Build once per visit so the queue doesn't reshuffle as answers are saved.
  const [exercises] = useState(() =>
    mode === 'due' ? buildReview(pack, progress, Date.now(), SESSION_SIZE) : buildExtraPractice(pack, progress, 12),
  )
  const [summary, setSummary] = useState<SessionSummary>()
  const due = new Set(exercises.flatMap((e) => e.itemIds)).size
  const kind = mode === 'due' ? 'Revision' : 'Practice'
  const title = mode === 'due' ? `${due} Due Now` : 'Weak Spots'

  if (summary) {
    const index = indexPack(pack)
    const missed = summary.missed.map((id) => index.items.get(id)).filter((x) => !!x)
    return (
      <FocusFrame kind={kind} title={title} closeHref="#/practise" progress={1}>
        <SessionResult
          kicker={mode === 'due' ? 'Revision Complete' : 'Practice Complete'}
          score={summary.scored ? summary.correct / summary.scored : 1}
          missed={missed}
          line={`${summary.correct} of ${summary.scored} remembered. What you knew is now scheduled further out; anything you missed comes back soon.`}
        />
        <Actions>
          <ActionButton onClick={() => (window.location.hash = '#/')}>Done</ActionButton>
        </Actions>
      </FocusFrame>
    )
  }

  if (!exercises.length) {
    return (
      <FocusFrame kind={kind} title="Nothing Due" closeHref="#/practise">
        <h1 className="target m-0 text-[clamp(48px,7cqi,72px)] leading-none">Rien pour l'instant.</h1>
        <p className="m-0 max-w-[56ch] text-[17px] text-ink-2">
          {Object.keys(progress.items).length
            ? 'Nothing to revise right now. Everything you have learned is scheduled for later. Come back tomorrow, or take the next lesson.'
            : 'Nothing to revise yet. Finish your first lesson and its words start appearing here.'}
        </p>
        <div>
          <LinkButton href="#/">Back to Today</LinkButton>
        </div>
      </FocusFrame>
    )
  }

  return <Player exercises={exercises} review={mode === 'due'} kind={kind} title={title} closeHref="#/practise" onFinish={setSummary} />
}
