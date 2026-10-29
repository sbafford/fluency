import { useState } from 'react'
import { completeLesson } from '../engine/progress'
import { indexPack, isUnlocked } from '../engine/session'
import { useApp } from '../state/app'
import { clearPosition, loadPosition } from '../state/resume'
import { href } from '../state/router'
import { ActionButton, Actions, FocusFrame } from '../ui/Focus'
import { Button, LinkButton, Rich } from '../ui/kit'
import { Player, type SessionSummary } from '../ui/Player'
import { SessionResult } from '../ui/Summary'

export function LessonScreen({ id }: { id: string }) {
  const { pack, progress, updateProgress } = useApp()
  const index = indexPack(pack)
  const lesson = index.lessons.find((l) => l.id === id)
  const [stage, setStage] = useState<'intro' | 'play' | 'done'>('intro')
  const [run, setRun] = useState(0)
  const [summary, setSummary] = useState<SessionSummary>()

  if (!lesson || !isUnlocked(pack, progress, lesson.id)) {
    return (
      <FocusFrame kind="Lesson" title="Not Available" closeHref="#/learn">
        <p className="m-0 text-[17px]">
          {lesson ? 'Finish the lessons before this one first. It builds on them.' : "This lesson doesn't exist. It may have been renamed."}
        </p>
        <div>
          <LinkButton href="#/learn">Go to Learn</LinkButton>
        </div>
      </FocusFrame>
    )
  }

  const unit = index.unitOfLesson.get(lesson.id)!
  const unitNo = pack.units.indexOf(unit) + 1
  const lessonNo = unit.lessons.indexOf(lesson) + 1
  const kind = lesson.kind === 'checkpoint' ? `Unit Check · Unit ${unitNo}` : `Lesson ${lessonNo} · Unit ${unitNo}`
  const best = progress.lessons[lesson.id]?.bestScore
  const resume = stage === 'intro' ? loadPosition(lesson.id, new Set(lesson.exercises.map((e) => e.id))) : undefined

  if (stage === 'play') {
    return (
      <Player
        key={run}
        resumeKey={lesson.id}
        exercises={lesson.exercises}
        lesson={lesson}
        kind={kind}
        title={lesson.title}
        closeHref="#/learn"
        onFinish={(s) => {
          const score = s.scored ? s.correct / s.scored : 1
          updateProgress((p) => completeLesson(p, lesson.id, lesson.items.map((i) => i.id), score, Date.now()))
          setSummary(s)
          setStage('done')
        }}
      />
    )
  }

  if (stage === 'done' && summary) {
    const score = summary.scored ? summary.correct / summary.scored : 1
    const missed = summary.missed.map((i) => index.items.get(i)).filter((x) => !!x)
    const next = index.lessons[index.lessons.indexOf(lesson) + 1]
    const passed = score >= 0.8
    return (
      <FocusFrame kind={kind} title={lesson.title} closeHref="#/" progress={1}>
        <SessionResult
          kicker={lesson.kind === 'checkpoint' ? 'Unit Check Complete' : 'Lesson Complete'}
          score={score}
          missed={missed}
          line={
            <>
              {summary.correct} of {summary.scored} right first time.{' '}
              {passed
                ? 'Everything you met is now in revision, timed to come back just before you would forget it.'
                : 'Worth repeating after some revision: aim for 80% or more. Everything you met is already in revision.'}
            </>
          }
        >
          {lesson.culture && (
            <section className="mt-4 flex flex-col gap-3 rounded-3xl border border-line bg-raised p-7">
              <span className="text-[14px] text-ink-2">Culture</span>
              <h2 className="m-0 text-[22px] font-semibold">{lesson.culture.title}</h2>
              {lesson.culture.body.map((p, i) => (
                <p key={i} className="m-0 text-[16px] leading-relaxed">
                  <Rich text={p} />
                </p>
              ))}
            </section>
          )}
        </SessionResult>
        <Actions>
          {!passed ? (
            <Button
              variant="outline"
              className="py-[15px]"
              onClick={() => {
                clearPosition(lesson.id)
                setRun((r) => r + 1)
                setStage('play')
              }}
            >
              Repeat
            </Button>
          ) : (
            <a href="#/" className="px-[18px] py-4 text-[15px] whitespace-nowrap text-ink-2 hover:text-ink">
              Back to Today
            </a>
          )}
          {next && isUnlocked(pack, progress, next.id) ? (
            <ActionButton onClick={() => (window.location.hash = href({ name: 'lesson', id: next.id }))}>Next: {next.title}</ActionButton>
          ) : (
            <ActionButton onClick={() => (window.location.hash = '#/')}>Done</ActionButton>
          )}
        </Actions>
      </FocusFrame>
    )
  }

  return (
    <FocusFrame kind={kind} title={unit.title} closeHref="#/learn">
      <div className="text-[14px] text-ink-2">
        {lesson.minutes} Min{lesson.items.length > 0 && ` · ${lesson.items.length} New Words and Phrases`}
        {best !== undefined && ` · Best ${Math.round(best * 100)}%`}
      </div>
      <h1 className="target m-0 text-[clamp(56px,9cqi,96px)] leading-[0.95] tracking-[-0.02em]">{lesson.title}</h1>
      <p className="m-0 text-[20px] font-medium">{lesson.subtitle}</p>
      <section className="flex flex-col pt-4">
        <h2 className="m-0 border-b border-line pb-3 text-[20px] font-semibold">By the End, You Can</h2>
        {lesson.objectives.map((o) => (
          <div key={o} className="flex items-start gap-3.5 border-b border-line py-3.5 text-[17px] leading-[1.45]">
            <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-fill" />
            {o}
          </div>
        ))}
      </section>
      <Actions>
        {resume ? (
          <>
            <button
              type="button"
              onClick={() => {
                clearPosition(lesson.id)
                setRun((r) => r + 1)
                setStage('play')
              }}
              className="px-[18px] py-4 text-[15px] whitespace-nowrap text-ink-2 hover:text-ink"
            >
              Start Over
            </button>
            <ActionButton onClick={() => setStage('play')}>
              Carry On · {resume.pos + 1}/{resume.queue.length}
            </ActionButton>
          </>
        ) : (
          <ActionButton onClick={() => setStage('play')}>
            {best !== undefined ? 'Do It Again' : lesson.kind === 'checkpoint' ? 'Start Unit Check' : 'Start Lesson'}
          </ActionButton>
        )}
      </Actions>
    </FocusFrame>
  )
}
