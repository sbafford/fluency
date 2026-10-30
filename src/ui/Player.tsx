import { useCallback, useEffect, useMemo, useState } from 'react'
import { accentFor, findAccentSlip } from '../engine/accents'
import { normalise } from '../engine/answers'
import { recordAnswer } from '../engine/progress'
import { indexPack, isScored, shuffle } from '../engine/session'
import { itemStatus } from '../engine/srs'
import { strengthLabel } from '../engine/stats'
import type { ErrorType, Exercise, Lesson } from '../engine/types'
import { useApp } from '../state/app'
import { flagAudio } from '../state/flags'
import { clearPosition, loadPosition, savePosition } from '../state/resume'
import {
  Build,
  Choose,
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
import { FeedbackSheet, FocusFrame, type SheetTone } from './Focus'
import { Pill, Rich } from './kit'

/*
 * Runs a sequence of exercises: lessons, revision and unit checks all use it.
 * Wrong answers come back once at the end of the session, while they are
 * fresh; only the first attempt counts towards the score.
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

/** How to describe the learner's own answer, by exercise type. Speaking is described by the exercise itself. */
const YOUR_ANSWER: Partial<Record<Exercise['type'], string>> = {
  type: 'You wrote',
  dictation: 'You wrote',
  respond: 'You wrote',
  choose: 'You chose',
  'listen-choose': 'You chose',
  gap: 'You chose',
  build: 'You built',
}

const WRONG_LABEL: Partial<Record<ErrorType, string>> = {
  article: 'Check the Article',
  gender: 'Masculine or Feminine',
  'word-order': 'Word Order',
  'missing-word': 'A Word Is Missing',
  'extra-word': 'One Word Too Many',
  meaning: 'Different Meaning',
}

export function Player({
  exercises,
  lesson,
  review = false,
  kind,
  title,
  closeHref,
  onFinish,
  resumeKey,
}: {
  exercises: Exercise[]
  /** When set, the position is saved as you go so the session can be resumed. */
  resumeKey?: string
  lesson?: Lesson
  review?: boolean
  kind: string
  title: string
  closeHref: string
  onFinish: (summary: SessionSummary) => void
}) {
  const { record, tick, progress, pack, speaker } = useApp()
  const [saved] = useState(() => (resumeKey ? loadPosition(resumeKey, new Set(exercises.map((e) => e.id))) : undefined))
  const [queue, setQueue] = useState<QueueEntry[]>(() => {
    if (!saved) return exercises.map((exercise) => ({ exercise, retry: false }))
    const byId = new Map(exercises.map((e) => [e.id, e]))
    return saved.queue.map((q) => ({ exercise: q.retry ? withShuffledOptions(byId.get(q.id)!) : byId.get(q.id)!, retry: q.retry }))
  })
  const [pos, setPos] = useState(saved?.pos ?? 0)
  const [verdict, setVerdict] = useState<Verdict>()
  /** Fixing a wrong answer straight away: practice only, not scored or scheduled. */
  const [fixing, setFixing] = useState<{ attempt: number; correct?: string } | null>(null)
  const [change, setChange] = useState<{ from: string; to: string; days: number }>()
  const [results, setResults] = useState<Record<string, Verdict>>(() =>
    Object.fromEntries(Object.entries(saved?.results ?? {}).map(([id, result]) => [id, { result, skill: 'recall' } as Verdict])),
  )

  // Save the position whenever it moves, so leaving mid-lesson isn't a restart.
  useEffect(() => {
    if (!resumeKey) return
    if (pos === 0) return
    savePosition(resumeKey, {
      queue: queue.map((q) => ({ id: q.exercise.id, retry: q.retry })),
      pos,
      results: Object.fromEntries(Object.entries(results).map(([id, v]) => [id, v.result])),
      savedAt: Date.now(),
    })
  }, [resumeKey, queue, pos, results])

  const entry = queue[pos]

  const finish = useCallback(() => {
    const firsts = exercises.filter(isScored).map((e) => results[e.id]).filter((v): v is Verdict => !!v)
    const missed = exercises.filter((e) => results[e.id]?.result === 'wrong').flatMap((e) => e.itemIds)
    if (resumeKey) clearPosition(resumeKey)
    onFinish({ scored: firsts.length, correct: firsts.filter((v) => v.result !== 'wrong').length, missed: [...new Set(missed)] })
  }, [exercises, results, onFinish, resumeKey])

  const next = useCallback(() => {
    setVerdict(undefined)
    setChange(undefined)
    setFixing(null)
    if (pos + 1 >= queue.length) finish()
    else setPos(pos + 1)
  }, [pos, queue.length, finish])

  const unscoredDone = useCallback(() => {
    tick()
    next()
  }, [tick, next])

  // In revision, show the item's strength and what it was last time.
  const reviewInfo = useMemo(() => {
    if (!review || !entry) return undefined
    const id = entry.exercise.itemIds[0]
    const ip = progress.items[id]
    const status = itemStatus(ip)
    const missedLast = progress.recent.findLast((a) => a.itemIds.includes(id))?.result === 'wrong'
    return { status, context: missedLast ? 'Missed Last Time' : 'Due for Review' }
    // Computed once per exercise, before this answer changes it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [review, pos])

  const onAnswer = (v: Verdict) => {
    if (!entry || verdict) return
    const e = entry.exercise
    // A correction attempt is practice: it is shown but not recorded, so it can't inflate how well the word is known.
    if (fixing) {
      setVerdict(v)
      return
    }
    if (review && e.itemIds.length) {
      const id = e.itemIds[0]
      const now = Date.now()
      const after = recordAnswer(progress, { itemIds: [id], skill: v.skill, result: v.result, hinted: v.hinted, now })
      const from = strengthLabel(itemStatus(progress.items[id]))
      const to = strengthLabel(itemStatus(after.items[id]))
      const track = after.items[id]?.tracks[v.skill]
      const days = track ? Math.max(0, Math.round((track.due - now) / 86_400_000)) : 0
      setChange({ from, to, days })
    }
    setVerdict(v)
    record({ itemIds: e.itemIds, skill: v.skill, result: v.result, errorType: v.errorType, hinted: v.hinted, review })
    if (!entry.retry) setResults((r) => ({ ...r, [e.id]: v }))
    if (v.result === 'wrong' && !entry.retry) setQueue((q) => [...q, { exercise: withShuffledOptions(e), retry: true }])
  }

  // Item notes explain the commonest mistakes, so show one when the answer wasn't right.
  const itemNote = useMemo(() => {
    if (!entry || !verdict || verdict.result === 'correct') return undefined
    const { items } = indexPack(pack)
    return entry.exercise.itemIds.map((id) => items.get(id)?.note).find((n): n is string => !!n)
  }, [entry, verdict, pack])

  if (!entry) return null
  const e = entry.exercise
  const key = `${e.id}-${pos}-${fixing?.attempt ?? 0}`
  const props = { onAnswer, verdict }

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
      body = <Choose key={key} exercise={e} {...props} />
      break
    case 'listen-choose':
      body = <ListenChoose key={key} exercise={e} {...props} />
      break
    case 'gap':
      body = <Gap key={key} exercise={e} {...props} />
      break
    case 'type':
      body = <TypeIt key={key} exercise={e} {...props} />
      break
    case 'dictation':
      body = <Dictation key={key} exercise={e} {...props} />
      break
    case 'build':
      body = <Build key={key} exercise={e} {...props} />
      break
    case 'speak':
      body = <Speak key={key} exercise={e} {...props} />
      break
    case 'respond':
      body = <Respond key={key} exercise={e} {...props} />
      break
  }

  // After a wrong answer, have another go straight away while the right answer is fresh.
  const canFix = (v: Verdict) => v.result === 'wrong' && !v.selfAssessed && e.type !== 'speak'
  const fixNow = () => {
    // Remind of the answer you have to give: the option to pick, or the French to write.
    const correct = 'answer' in e && typeof e.answer === 'string' ? e.answer : verdict?.expected
    setFixing((f) => ({ attempt: (f?.attempt ?? 0) + 1, correct: f?.correct ?? correct }))
    setVerdict(undefined)
    setChange(undefined)
  }

  let sheet: React.ReactNode
  if (verdict && SKILL_OF[e.type] && fixing) {
    const fixed = verdict.result !== 'wrong'
    sheet = (
      <FeedbackSheet
        tone={fixed ? 'correct' : 'wrong'}
        title={fixed ? 'Voilà !' : 'Pas encore'}
        label={fixed ? 'Fixed · Still Comes Back Later' : undefined}
        answer={verdict.expected}
        answerIsFrench={verdict.expectedIsFrench}
        onPlay={verdict.expected && verdict.expectedIsFrench ? () => speaker.speak(verdict.expected!) : undefined}
        onContinue={next}
        continueLabel="Continue"
        secondary={!fixed && fixing.attempt < 2 ? { label: 'Try Again', onClick: fixNow } : undefined}
      >
        {!fixed && <p className="m-0">Read it once more, out loud if you can. It comes back at the end of the session.</p>}
      </FeedbackSheet>
    )
  } else if (verdict && SKILL_OF[e.type]) {
    const v = verdict
    const tone: SheetTone = v.result === 'correct' ? 'correct' : v.result === 'near' ? 'nearly' : 'wrong'
    let title = { correct: review ? 'Oui !' : 'Très bien !', nearly: 'Presque !', wrong: 'Pas tout à fait' }[tone]
    let label = ''
    if (tone === 'nearly') label = v.errorType === 'accent' ? 'Counts as Correct · Watch the Accent' : v.errorType === 'typo' ? 'Counts as Correct · Small Slip' : 'Partly Right'
    if (tone === 'wrong' && v.errorType) label = WRONG_LABEL[v.errorType] ?? ''
    if (v.selfAssessed) {
      title = v.result === 'correct' ? 'Très bien !' : 'Continuez !'
      label = 'Keep Saying It Aloud'
    }
    if (change && tone !== 'wrong' && change.from !== change.to) label = `${change.from} → ${change.to}`
    if (tone !== 'wrong' && v.hinted) label = 'With a Hint · Comes Back Sooner'

    const notes: string[] = []
    if (v.detail) notes.push(v.detail)
    // Say what you actually did: typed, picked or built. Repeating a correct pick adds nothing.
    const verb = YOUR_ANSWER[e.type]
    const differs = !!v.given && (!v.expected || normalise(v.given) !== normalise(v.expected))
    // Why: what your choice actually means, then why the answer is right. Falls back to the word's general note.
    const explain = pack.explanations?.[e.id]
    const whyGiven = tone === 'wrong' && v.given ? explain?.why?.[v.given] : undefined
    if (verb && v.given && (verb === 'You wrote' ? tone !== 'correct' || differs : tone === 'wrong'))
      notes.push(whyGiven ? `${verb}: ${v.given}. ${whyGiven}` : `${verb}: ${v.given}`)
    if (tone !== 'correct' && explain?.because) notes.push(explain.because)
    // An accent slip: say what the accent does and how to tell when a word needs it.
    const slip = tone !== 'correct' && v.given && v.expected && v.expectedIsFrench ? findAccentSlip(v.given, v.expected) : undefined
    const guide = slip && pack.accents ? accentFor(slip, pack.accents) : undefined
    if (slip && guide) notes.push(`*${guide.letter}* (*${guide.name}*) in *${slip.word}*: ${guide.sound} ${guide.guess}`)
    else if (itemNote && !whyGiven) notes.push(itemNote)
    if (change && tone !== 'wrong' && change.days > 0) notes.push(`Next review in ${change.days} ${change.days === 1 ? 'day' : 'days'}.`)
    if (tone === 'wrong') notes.push('Fix it now while it’s fresh. It comes back later too, to check it stuck.')

    sheet = (
      <FeedbackSheet
        tone={tone}
        title={title}
        label={label || undefined}
        answer={v.expected}
        answerIsFrench={v.expectedIsFrench}
        onPlay={v.expected && v.expectedIsFrench ? () => speaker.speak(v.expected!) : undefined}
        onFlag={v.expected ? () => flagAudio(v.expected!) : undefined}
        onContinue={canFix(v) ? fixNow : next}
        continueLabel={canFix(v) ? 'Fix It Now' : 'Continue'}
        secondary={canFix(v) ? { label: 'Skip', onClick: next } : undefined}
      >
        {notes.length > 0 && notes.map((n) => (<p key={n} className="m-0"><Rich text={n} /></p>))}
      </FeedbackSheet>
    )
  }

  return (
    <FocusFrame kind={kind} title={title} count={`${pos + 1}/${queue.length}`} progress={pos / queue.length} closeHref={closeHref} bottom={sheet}>
      {fixing && !verdict && (
        <div className="flex flex-col gap-1 rounded-2xl bg-wash px-4 py-3">
          <span className="text-[14px] font-semibold text-accent">Your Turn to Fix It</span>
          {fixing.correct && (
            <span className="text-[14px] text-ink-2">
              The answer was{' '}
              <span className={e.type === 'choose' && e.promptLang === 'target' || e.type === 'listen-choose' ? 'font-semibold text-ink' : 'target text-[18px] text-ink'}>
                {e.type === 'choose' && e.promptLang === 'target' || e.type === 'listen-choose' ? fixing.correct.charAt(0).toUpperCase() + fixing.correct.slice(1) : fixing.correct}
              </span>
              . Now give it yourself.
            </span>
          )}
        </div>
      )}
      {entry.retry && !fixing && <div className="text-[14px] font-semibold text-accent">Back Again: Check It Stuck</div>}
      {reviewInfo && (
        <div className="flex items-center gap-2.5">
          <Pill tone={reviewInfo.status === 'struggling' ? 'shaky' : reviewInfo.status === 'mastered' ? 'sealed' : reviewInfo.status === 'learning' ? 'solid' : 'new'}>
            {strengthLabel(reviewInfo.status)}
          </Pill>
          <span className="text-[14px] text-ink-2">{reviewInfo.context}</span>
        </div>
      )}
      {body}
    </FocusFrame>
  )
}
