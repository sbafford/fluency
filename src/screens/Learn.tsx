import { isUnlocked, nextLesson } from '../engine/session'
import { useApp } from '../state/app'
import { href } from '../state/router'
import { CheckIcon, LockIcon } from '../ui/icons'
import { PageHeader, Tag } from '../ui/kit'

export function Learn() {
  const { pack, progress } = useApp()
  const next = nextLesson(pack, progress)

  return (
    <div>
      <PageHeader title="learn">
        The {pack.name} course, built around what you can do at each level. Lessons open in order, so each one builds on the
        last.
      </PageHeader>

      {pack.levels.map((level) => {
        const units = pack.units.filter((u) => u.level === level.id)
        return (
          <section key={level.id} className="mb-14">
            <div className="mb-5 flex items-baseline gap-3 border-b-[1.5px] border-ink pb-3">
              <h2 className="text-[28px] font-semibold tracking-[-0.02em]">{level.id}</h2>
              <p className="text-[17px] text-ink-2">{level.name}</p>
            </div>
            <p className="mb-6 max-w-[62ch] text-[15px] text-ink-2">{level.summary}</p>

            {units.length === 0 && <p className="text-[15px] text-ink-3">Lessons for this level haven't been written yet.</p>}

            {units.map((unit) => (
              <div key={unit.id} className="mb-8">
                <h3 className="target text-[34px] leading-tight">{unit.title}</h3>
                <p className="mb-4 text-ink-2">{unit.subtitle}</p>
                <ol className="divide-y divide-line border-y border-line">
                  {unit.lessons.map((lesson) => {
                    const lp = progress.lessons[lesson.id]
                    const unlocked = isUnlocked(pack, progress, lesson.id)
                    const isNext = next?.id === lesson.id
                    const content = (
                      <div className="flex items-center gap-4 py-4">
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                            lp?.completedAt
                              ? 'bg-ink text-paper'
                              : isNext
                                ? 'bg-accent text-on-accent'
                                : 'border-[1.5px] border-line text-ink-3'
                          }`}
                        >
                          {lp?.completedAt ? <CheckIcon size={18} /> : unlocked ? null : <LockIcon size={16} />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="target text-[24px] leading-tight">{lesson.title}</p>
                          <p className="text-[15px] text-ink-2">
                            {lesson.subtitle}
                            {lesson.kind === 'checkpoint' && (
                              <>
                                {' '}
                                <Tag tone="accent">unit check</Tag>
                              </>
                            )}
                          </p>
                        </div>
                        <span className="shrink-0 text-right text-[14px] tabular-nums text-ink-2">
                          {lp?.completedAt ? `Best ${Math.round(lp.bestScore * 100)}%` : `${lesson.minutes} min`}
                        </span>
                      </div>
                    )
                    return (
                      <li key={lesson.id}>
                        {unlocked ? (
                          <a href={href({ name: 'lesson', id: lesson.id })} className="block hover:bg-wash md:-mx-3 md:px-3 md:rounded-xl">
                            {content}
                          </a>
                        ) : (
                          <div className="opacity-50" aria-label={`${lesson.title}, locked until earlier lessons are finished`}>
                            {content}
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ol>
              </div>
            ))}
          </section>
        )
      })}

      {pack.pathways.length > 0 && (
        <section className="mb-14">
          <h2 className="mb-4 text-[28px] font-semibold tracking-[-0.02em]">Optional pathways</h2>
          {pack.pathways.map((p) => (
            <div key={p.id} className="mb-4">
              <p className="text-[19px] font-semibold">{p.title}</p>
              <p className="text-ink-2">{p.description}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
