import { useState } from 'react'
import { isUnlocked, nextLesson } from '../engine/session'
import type { CefrLevel, Lesson } from '../engine/types'
import { useApp } from '../state/app'
import { loadPosition } from '../state/resume'
import { href } from '../state/router'
import { CheckIcon, LockIcon } from '../ui/icons'
import { PageTitle } from '../ui/kit'

type RowState = 'done' | 'current' | 'open' | 'locked'

export function Learn() {
  const { pack, progress } = useApp()
  const next = nextLesson(pack, progress)
  const [levelId, setLevelId] = useState<CefrLevel>(next ? (pack.units.find((u) => u.lessons.includes(next))?.level ?? 'A1') : 'A1')
  const level = pack.levels.find((l) => l.id === levelId)!
  const units = pack.units.filter((u) => u.level === levelId)

  const rowState = (lesson: Lesson): RowState => {
    if (progress.lessons[lesson.id]?.completedAt) return 'done'
    if (next?.id === lesson.id) return 'current'
    return isUnlocked(pack, progress, lesson.id) ? 'open' : 'locked'
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-[18px]">
        <PageTitle>Learn</PageTitle>
        <div className="flex flex-wrap gap-2 text-[14px]" role="tablist" aria-label="Level">
          {pack.levels.map((l) => {
            const on = l.id === levelId
            return (
              <button
                key={l.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setLevelId(l.id)}
                className={`rounded-full px-4 py-2 ${on ? 'bg-btn font-semibold text-onbtn' : 'border border-line text-ink-3 hover:text-ink'}`}
              >
                {on ? `${l.id} ${l.name}` : l.id}
              </button>
            )
          })}
        </div>
        <p className="m-0 max-w-[60ch] text-[16px] leading-normal text-pretty text-ink-2">{level.summary}</p>
      </div>

      {units.map((unit) => {
        const n = pack.units.indexOf(unit) + 1
        const check = unit.lessons.find((l) => l.kind === 'checkpoint')
        const doneCount = unit.lessons.filter((l) => progress.lessons[l.id]?.completedAt).length
        const checkDone = check && progress.lessons[check.id]?.completedAt
        const status = checkDone
          ? `Complete · Unit Check ${Math.round(progress.lessons[check!.id].bestScore * 100)}%`
          : `${doneCount} of ${unit.lessons.length} Lessons`
        return (
          <section key={unit.id} className="flex flex-wrap gap-x-14 gap-y-5 border-t border-line pt-7">
            <div className="flex max-w-[340px] flex-[1_1_260px] flex-col gap-2">
              <span className="text-[15px] font-semibold text-accent [font-stretch:120%]">Unit {n}</span>
              <h2 className="target m-0 text-[40px] leading-none">{unit.title}</h2>
              <p className="m-0 text-[15px] leading-[1.45] text-ink-2">{unit.subtitle}</p>
              <span className="pt-1.5 text-[13px] text-ink-3">{status}</span>
            </div>
            <ol className="m-0 flex flex-[2_1_420px] list-none flex-col p-0">
              {unit.lessons.map((lesson) => {
                const st = rowState(lesson)
                const lp = progress.lessons[lesson.id]
                const dot =
                  st === 'done'
                    ? 'bg-btn text-onbtn'
                    : st === 'current'
                      ? 'bg-fill text-feedback-on'
                      : 'border-[1.5px] border-line text-ink-3'
                const meta =
                  st === 'done' ? `${Math.round((lp?.bestScore ?? 0) * 100)}%` : st === 'current' ? (loadPosition(lesson.id, new Set(lesson.exercises.map((e) => e.id))) ? 'Carry On →' : 'Start →') : `${lesson.minutes} Min`
                const row = (
                  <div className={`flex items-center gap-4 border-b border-line py-3.5 ${st === 'locked' ? 'opacity-55' : ''}`}>
                    <span className={`box-border grid h-7 w-7 shrink-0 place-items-center rounded-full ${dot}`}>
                      {st === 'done' ? <CheckIcon size={14} /> : st === 'locked' ? <LockIcon size={14} /> : null}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="target text-[24px] leading-[1.1]">{lesson.title}</div>
                      <div className="text-[13px] text-ink-2">{lesson.subtitle}</div>
                    </div>
                    <span className={`text-[14px] whitespace-nowrap ${st === 'current' ? 'font-semibold text-accent' : 'text-ink-2'}`}>{meta}</span>
                  </div>
                )
                return (
                  <li key={lesson.id}>
                    {st === 'locked' ? (
                      <div aria-label={`${lesson.title}, locked until the lessons before it are finished`}>{row}</div>
                    ) : (
                      <a href={href({ name: 'lesson', id: lesson.id })} className="block hover:bg-wash">
                        {row}
                      </a>
                    )}
                  </li>
                )
              })}
            </ol>
          </section>
        )
      })}

      <p className="m-0 max-w-[62ch] border-t border-line pt-7 text-[15px] leading-normal text-ink-2">
        {units.length === 0
          ? `Lessons for ${level.id} haven't been written yet. Finish ${pack.levels[pack.levels.indexOf(level) - 1]?.id ?? 'the level before'} first.`
          : levelId === 'A1'
            ? `Pass all ${units.length} unit checks to complete A1. A2 comes next.`
            : ''}
      </p>
    </div>
  )
}
