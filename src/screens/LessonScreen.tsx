import { useState } from 'react'
import { completeLesson } from '../engine/progress'
import { indexPack, isUnlocked } from '../engine/session'
import { useApp } from '../state/app'
import { href } from '../state/router'
import { BackIcon } from '../ui/icons'
import { Button, LinkButton, Rich } from '../ui/kit'
import { Player, type SessionSummary } from '../ui/Player'

export function LessonScreen({ id }: { id: string }) {
  const { pack, progress, updateProgress } = useApp()
  const index = indexPack(pack)
  const lesson = index.lessons.find((l) => l.id === id)
  const [stage, setStage] = useState<'intro' | 'play' | 'done'>('intro')
  const [summary, setSummary] = useState<SessionSummary>()
  const exercises = lesson?.exercises ?? []

  if (!lesson) {
    return (
      <div className="mx-auto max-w-[720px] px-5 py-16">
        <p className="mb-4">This lesson doesn't exist. It may have been renamed.</p>
        <LinkButton href="#/learn">Go to the course</LinkButton>
      </div>
    )
  }
  if (!isUnlocked(pack, progress, lesson.id)) {
    return (
      <div className="mx-auto max-w-[720px] px-5 py-16">
        <p className="mb-4">Finish the earlier lessons first. This one builds on them.</p>
        <LinkButton href="#/learn">Go to the course</LinkButton>
      </div>
    )
  }

  const unit = index.unitOfLesson.get(lesson.id)!
  const best = progress.lessons[lesson.id]?.bestScore

  if (stage === 'play') {
    return (
      <Player
        exercises={exercises}
        lesson={lesson}
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
    const missedItems = summary.missed.map((i) => index.items.get(i)).filter((x) => !!x)
    const next = index.lessons[index.lessons.indexOf(lesson) + 1]
    const passed = score >= 0.8
    return (
      <div className="mx-auto max-w-[720px] px-5 pt-10 pb-16">
        <p className="mb-2 text-[15px] text-ink-2">{lesson.kind === 'checkpoint' ? 'Unit check complete' : 'Lesson complete'}</p>
        <p className="mb-2 text-[88px] leading-none font-semibold tracking-[-0.04em] tabular-nums">{Math.round(score * 100)}%</p>
        <p className="mb-8 max-w-[56ch] text-ink-2">
          {summary.correct} of {summary.scored} right first time.{' '}
          {passed
            ? 'Everything you met is now in revision, scheduled to come back just before you are likely to forget it.'
            : 'Worth repeating once you have revised: aim for 80% or more. Everything you met is already in revision.'}
        </p>

        {missedItems.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-[19px] font-semibold">Coming back in revision first</h2>
            <ul className="divide-y divide-line border-y border-line">
              {missedItems.map((item) => (
                <li key={item!.id} className="flex flex-wrap items-baseline justify-between gap-x-4 py-3">
                  <span className="target text-[22px]">{item!.target}</span>
                  <span className="text-ink-2">{item!.native}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {lesson.culture && (
          <section className="mb-10 rounded-3xl bg-wash p-6">
            <p className="mb-1 text-[14px] text-ink-2">Culture</p>
            <h2 className="mb-3 text-[22px] font-semibold tracking-[-0.01em]">{lesson.culture.title}</h2>
            <div className="space-y-3 text-[16px] leading-relaxed">
              {lesson.culture.body.map((p, i) => (
                <p key={i}>
                  <Rich text={p} />
                </p>
              ))}
            </div>
          </section>
        )}

        <div className="flex flex-wrap gap-3">
          {next && <LinkButton href={href({ name: 'lesson', id: next.id })}>Next: {next.title}</LinkButton>}
          <LinkButton href="#/" variant={next ? 'secondary' : 'primary'}>
            Back to today
          </LinkButton>
          {!passed && (
            <Button variant="quiet" onClick={() => setStage('play')}>
              Repeat lesson
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[720px] px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-16">
      <a href="#/learn" className="-ml-2 mb-8 inline-flex items-center gap-2 rounded-full p-2 text-[15px] text-ink-2 hover:text-ink">
        <BackIcon size={20} /> Course
      </a>
      <p className="mb-2 text-[15px] text-ink-2">
        <span className="target text-[17px]">{unit.title}</span>, {unit.level}
      </p>
      <h1 className="target mb-2 text-[56px] leading-[1] md:text-[72px]">{lesson.title}</h1>
      <p className="mb-8 text-[19px]">{lesson.subtitle}</p>

      <h2 className="mb-3 text-[15px] font-semibold">By the end, you can</h2>
      <ul className="mb-8 space-y-2">
        {lesson.objectives.map((o) => (
          <li key={o} className="flex gap-3 text-[17px]">
            <span aria-hidden="true" className="mt-[11px] h-1 w-3 shrink-0 bg-accent" />
            {o}
          </li>
        ))}
      </ul>
      <p className="mb-8 text-[15px] text-ink-2">
        About {lesson.minutes} minutes. {lesson.items.length > 0 && `${lesson.items.length} new words and phrases. `}
        {best !== undefined && `Your best so far: ${Math.round(best * 100)}%.`}
      </p>
      <Button onClick={() => setStage('play')} className="w-full sm:w-auto sm:min-w-56">
        {best !== undefined ? 'Do it again' : lesson.kind === 'checkpoint' ? 'Start the check' : 'Start lesson'}
      </Button>
    </div>
  )
}
