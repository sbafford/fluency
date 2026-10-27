import { useCallback, useMemo, useState } from 'react'
import { normalise } from '../engine/answers'
import { indexPack, isScored, shuffle } from '../engine/session'
import { ERROR_LABELS } from '../engine/stats'
import type { Exercise, Lesson } from '../engine/types'
import { useApp } from '../state/app'
import {
  Build,
  Choose,
  ContinueBar,
  DialogueView,
  Dictation,
  Gap,
  ListenChoose,
  NoteView,
  PresentView,
  Respond,
  SKILL_OF,
  Speak,
  TypeIt,
  type Verdict,
} from './exercises'
import { CheckIcon, CrossIcon } from './icons'
import { AudioButton, Bar, Button } from './kit'

/*
 * Runs a sequence of exercises: lessons, revision sessions and checkpoints all
 * use it. Wrong answers come back once at the end of the session so the item is
 * practised again while it is fresh; only the first attempt counts towards the
 * session score.
 */

export interface SessionSummary {
  scored: number
  correct: number
  /** Item ids answered wrongly on the first attempt. */
  missed: string[]
}

interface QueueEntry {
  exercise: Exercise
  retry: boolean
}

function withShuffledOptions(e: Exercise): Exercise {
  if (e.type === 'choose' || e.type === 'listen-choose' || e.type === 'gap') return { ...e, options: shuffle(e.options) }
  return e
}

export function Player({
  exercises,
  lesson,
  review = false,
  closeHref,
  onFinish,
}: {
  exercises: Exercise[]
  lesson?: Lesson
  review?: boolean
  closeHref: string
  onFinish: (summary: SessionSummary) => void
}) {
  const { record, tick } = useApp()
  const [queue, setQueue] = useState<QueueEntry[]>(() => exercises.map((exercise) => ({ exercise, retry: false })))
  const [pos, setPos] = useState(0)
  const [verdict, setVerdict] = useState<Verdict>()
  const [results, setResults] = useState<Record<string, Verdict>>({})

  const entry = queue[pos]

  const finish = useCallback(() => {
    const scoredIds = exercises.filter(isScored).map((e) => e.id)
    const firsts = scoredIds.map((id) => results[id]).filter((v): v is Verdict => !!v)
    const missed = exercises
      .filter((e) => results[e.id]?.result === 'wrong')
      .flatMap((e) => e.itemIds)
    onFinish({
      scored: firsts.length,
      correct: firsts.filter((v) => v.result !== 'wrong').length,
      missed: [...new Set(missed)],
    })
  }, [exercises, results, onFinish])

  const next = useCallback(() => {
    setVerdict(undefined)
    if (pos + 1 >= queue.length) finish()
    else setPos(pos + 1)
  }, [pos, queue.length, finish])

  const unscoredDone = useCallback(() => {
    tick()
    next()
  }, [tick, next])

  const onAnswer = (v: Verdict) => {
    if (!entry || verdict) return
    setVerdict(v)
    const e = entry.exercise
    record({ itemIds: e.itemIds, skill: v.skill, result: v.result, errorType: v.errorType, hinted: v.hinted, review })
    if (!entry.retry) setResults((r) => ({ ...r, [e.id]: v }))
    if (v.result === 'wrong' && !entry.retry) {
      setQueue((q) => [...q, { exercise: withShuffledOptions(e), retry: true }])
    }
  }

  // Leaving mid-session keeps everything already answered; nothing to save here.
  if (!entry) return null
  const e = entry.exercise
  const locked = !!verdict
  const scoredTotal = queue.length
  const key = `${e.id}-${pos}`

  let body: React.ReactNode
  switch (e.type) {
    case 'dialogue':
      body = lesson?.dialogue ? <DialogueView key={key} lesson={lesson} onDone={unscoredDone} /> : null
      break
    case 'present':
      body = <PresentView key={key} itemIds={e.itemIds} onDone={unscoredDone} />
      break
    case 'note':
      body = lesson ? <NoteView key={key} lesson={lesson} noteId={e.noteId} onDone={unscoredDone} /> : null
      break
    case 'choose':
      body = <Choose key={key} exercise={e} onAnswer={onAnswer} locked={locked} />
      break
    case 'listen-choose':
      body = <ListenChoose key={key} exercise={e} onAnswer={onAnswer} locked={locked} />
      break
    case 'gap':
      body = <Gap key={key} exercise={e} onAnswer={onAnswer} locked={locked} />
      break
    case 'type':
      body = <TypeIt key={key} exercise={e} onAnswer={onAnswer} locked={locked} />
      break
    case 'dictation':
      body = <Dictation key={key} exercise={e} onAnswer={onAnswer} locked={locked} />
      break
    case 'build':
      body = <Build key={key} exercise={e} onAnswer={onAnswer} locked={locked} />
      break
    case 'speak':
      body = <Speak key={key} exercise={e} onAnswer={onAnswer} locked={locked} />
      break
    case 'respond':
      body = <Respond key={key} exercise={e} onAnswer={onAnswer} locked={locked} />
      break
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[720px] flex-col px-5">
      <div className="sticky top-0 z-10 flex items-center gap-4 bg-paper pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
        <a href={closeHref} aria-label="Close and save" className="-ml-2 rounded-full p-2 text-ink-2 hover:text-ink">
          <CrossIcon size={24} />
        </a>
        <Bar value={pos / scoredTotal} label="Session progress" />
        <span className="w-12 shrink-0 text-right text-[13px] tabular-nums text-ink-3">
          {pos + 1}/{scoredTotal}
        </span>
      </div>
      {entry.retry && <p className="mb-2 text-[14px] font-medium text-accent">Once more, while it's fresh</p>}
      <main className={`flex-1 pt-4 ${verdict ? 'pb-72' : 'pb-10'}`}>{body}</main>
      {verdict && SKILL_OF[e.type] && <Feedback verdict={verdict} exercise={e} onContinue={next} />}
    </div>
  )
}

function expectedIsTarget(e: Exercise): boolean {
  if (e.type === 'choose') return e.promptLang === 'native'
  return e.type !== 'listen-choose'
}

function Feedback({ verdict: v, exercise: e, onContinue }: { verdict: Verdict; exercise: Exercise; onContinue: () => void }) {
  const { pack } = useApp()
  const notes = useMemo(() => {
    if (v.result === 'correct') return []
    const { items } = indexPack(pack)
    return e.itemIds.map((id) => items.get(id)?.note).filter((n): n is string => !!n).slice(0, 1)
  }, [v.result, e.itemIds, pack])

  // The Continue button takes focus, so Enter moves on without a global key handler.
  const tone = { correct: 'bg-good-wash', near: 'bg-near-wash', wrong: 'bg-bad-wash' }[v.result]
  const ink = { correct: 'text-good', near: 'text-near', wrong: 'text-bad' }[v.result]
  let heading = { correct: 'Correct', near: 'Nearly there', wrong: 'Not quite' }[v.result]
  if (v.result === 'near' && v.errorType === 'accent') heading = 'Correct, but check the accents'
  if (v.result === 'near' && v.errorType === 'typo') heading = 'Correct, with a small slip'
  if (v.selfAssessed) heading = v.result === 'correct' ? 'Good. Keep saying it aloud' : 'Keep at it. It gets easier'
  if (v.skill === 'speaking' && !v.selfAssessed && v.result === 'near') heading = 'Partly understood'

  const showExpected = v.expected && v.result !== 'correct'
  return (
    <div className={`sheet-rise fixed inset-x-0 bottom-0 z-20 ${tone}`} role="status" aria-live="polite">
      <div className="mx-auto max-w-[720px] px-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <p className={`flex items-center gap-2 text-[19px] font-semibold ${ink}`}>
          {v.result === 'wrong' ? <CrossIcon size={22} /> : <CheckIcon size={22} />}
          {heading}
        </p>
        {showExpected && (
          <div className="mt-2 flex items-center gap-3">
            {expectedIsTarget(e) && <AudioButton text={v.expected!} size="sm" />}
            <p className={expectedIsTarget(e) ? 'target text-[24px] leading-snug' : 'text-[17px]'}>{v.expected}</p>
          </div>
        )}
        {v.result === 'correct' && v.expected && (e.type === 'type' || e.type === 'dictation' || e.type === 'respond') && v.given && normalise(v.given) !== normalise(v.expected) && (
          <p className="mt-1 text-[15px] text-ink-2">
            Also: <span className="target text-[18px] text-ink">{v.expected}</span>
          </p>
        )}
        {v.detail && <p className="mt-2 max-w-[60ch] text-[15px] text-ink-2">{v.detail}</p>}
        {v.errorType && v.result !== 'correct' && v.errorType !== 'meaning' && v.errorType !== 'wrong-word' && (
          <p className="mt-1 text-[14px] text-ink-2">Pattern: {ERROR_LABELS[v.errorType]}</p>
        )}
        {notes.map((n) => (
          <p key={n} className="mt-1 max-w-[60ch] text-[15px] text-ink-2">
            {n}
          </p>
        ))}
        <Button onClick={onContinue} className="mt-4 w-full md:w-auto md:min-w-48" autoFocus>
          Continue
        </Button>
      </div>
    </div>
  )
}

export { ContinueBar }
