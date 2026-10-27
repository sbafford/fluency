import { indexPack } from '../engine/session'
import { ERROR_LABELS, levelSummary, recentDays, skillSummaries, statusCounts, topErrors, troubleItems } from '../engine/stats'
import type { Skill } from '../engine/types'
import { useApp } from '../state/app'
import { CheckIcon } from '../ui/icons'
import { Bar, PageHeader, SectionTitle, pct } from '../ui/kit'

const SKILL_LABELS: Record<Skill, { name: string; what: string }> = {
  listening: { name: 'Listening', what: 'Understanding French you hear' },
  speaking: { name: 'Speaking', what: 'Being understood when you speak' },
  recognition: { name: 'Recognition', what: 'Knowing a word when you see it' },
  recall: { name: 'Recall', what: 'Producing French yourself' },
}

export function Progress() {
  const { pack, progress } = useApp()
  const now = Date.now()
  const skills = skillSummaries(progress, now)
  const counts = statusCounts(pack, progress)
  const errors = topErrors(progress, now)
  const trouble = troubleItems(pack, progress)
  const days = recentDays(progress, now, 14)
  const maxDay = Math.max(1, ...days.map((d) => d.answered))
  const totalItems = indexPack(pack).items.size
  const lessonsDone = Object.values(progress.lessons).filter((l) => l.completedAt).length
  const minutes = Math.round(Object.values(progress.days).reduce((n, d) => n + d.activeMs, 0) / 60000)

  return (
    <div>
      <PageHeader title="progress">
        Measured by what you can still do days later, not by how many lessons you've clicked through.
      </PageHeader>

      <section className="mb-12">
        <SectionTitle aside="Last 30 days">Skills</SectionTitle>
        <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
          {skills.map((s) => (
            <div key={s.skill}>
              <div className="mb-1 flex items-baseline justify-between gap-3">
                <p className="text-[17px] font-semibold">{SKILL_LABELS[s.skill].name}</p>
                <p className="text-[15px] tabular-nums">{s.accuracy === undefined ? 'Not enough yet' : pct(s.accuracy)}</p>
              </div>
              <Bar value={s.accuracy ?? 0} tone="ink" label={`${SKILL_LABELS[s.skill].name} accuracy`} />
              <p className="mt-1.5 text-[14px] text-ink-2">
                {SKILL_LABELS[s.skill].what}. {s.attempts} answers
                {s.retention !== undefined && `, ${pct(s.retention)} on later days`}.
              </p>
            </div>
          ))}
        </div>
        <p className="mt-5 max-w-[62ch] text-[14px] text-ink-3">
          "On later days" counts only answers about material you first met on an earlier day: the best sign it has stuck.
          Speaking is measured by browser speech recognition, which checks you were understood, not your accent.
        </p>
      </section>

      <section className="mb-12">
        <SectionTitle aside={`${totalItems} in the course so far`}>Words and phrases</SectionTitle>
        <div className="mb-3 flex h-3 w-full overflow-hidden rounded-full bg-line" aria-hidden="true">
          <div className="bg-ink" style={{ width: `${(counts.mastered / totalItems) * 100}%` }} />
          <div className="bg-accent" style={{ width: `${(counts.learning / totalItems) * 100}%` }} />
          <div className="bg-bad" style={{ width: `${(counts.struggling / totalItems) * 100}%` }} />
        </div>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(
            [
              ['mastered', 'Mastered', 'bg-ink', 'Recalled across three weeks or more'],
              ['learning', 'Learning', 'bg-accent', 'In regular revision'],
              ['struggling', 'Struggling', 'bg-bad', 'Often missed; revised first'],
              ['new', 'Not started', 'bg-line', 'Not met yet'],
            ] as const
          ).map(([key, label, swatch, what]) => (
            <div key={key}>
              <dt className="flex items-center gap-2 text-[14px] text-ink-2">
                <span className={`h-2.5 w-2.5 rounded-full ${swatch}`} aria-hidden="true" />
                {label}
              </dt>
              <dd className="text-[28px] font-semibold tabular-nums">{counts[key]}</dd>
              <dd className="text-[13px] text-ink-3">{what}</dd>
            </div>
          ))}
        </dl>
      </section>

      {pack.levels
        .filter((l) => l.canDo.length)
        .map((level) => {
          const summary = levelSummary(pack, progress, level)
          return (
            <section key={level.id} className="mb-12">
              <SectionTitle aside={`${summary.demonstrated} of ${level.canDo.length} demonstrated`}>
                {level.id} {level.name.toLowerCase()}: what you can do
              </SectionTitle>
              <ul className="divide-y divide-line border-y border-line">
                {summary.states.map(({ canDo, state }) => {
                  const covered = indexPack(pack).lessons.some((l) => l.canDo.includes(canDo.id))
                  return (
                    <li key={canDo.id} className="flex items-start gap-3 py-3">
                      <span
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                          state === 'demonstrated' ? 'bg-ink text-paper' : state === 'practising' ? 'bg-accent-wash text-accent' : 'border-[1.5px] border-line'
                        }`}
                        aria-hidden="true"
                      >
                        {state === 'demonstrated' && <CheckIcon size={14} />}
                        {state === 'practising' && <span className="h-2 w-2 rounded-full bg-accent" />}
                      </span>
                      <div className="flex-1">
                        <p className={`text-[16px] ${state === 'not-started' ? 'text-ink-2' : ''}`}>{canDo.text}</p>
                        <p className="text-[13px] text-ink-3">
                          {state === 'demonstrated'
                            ? 'Demonstrated'
                            : state === 'practising'
                              ? 'Practising: pass the lessons with 80% and keep recalling the words on later days'
                              : covered
                                ? 'Not started'
                                : 'Coming in later units'}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}

      <div className="mb-12 grid gap-10 md:grid-cols-2">
        <section>
          <SectionTitle aside="Last 30 days">Recurring mistakes</SectionTitle>
          {errors.length ? (
            <ul className="space-y-2">
              {errors.map((e) => (
                <li key={e.type} className="flex items-baseline justify-between gap-3 border-b border-line pb-2">
                  <span>{ERROR_LABELS[e.type]}</span>
                  <span className="tabular-nums text-ink-2">{e.count}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[15px] text-ink-2">Patterns in your mistakes will show here once there are a few.</p>
          )}
        </section>
        <section>
          <SectionTitle>Hardest so far</SectionTitle>
          {trouble.length ? (
            <ul className="space-y-2">
              {trouble.map(({ item, misses }) => (
                <li key={item.id} className="flex items-baseline justify-between gap-3 border-b border-line pb-2">
                  <span>
                    <span className="target text-[20px]">{item.target}</span>{' '}
                    <span className="text-[14px] text-ink-2">{item.native}</span>
                  </span>
                  <span className="shrink-0 text-[14px] tabular-nums text-ink-2">{misses} missed</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[15px] text-ink-2">Nothing yet.</p>
          )}
        </section>
      </div>

      <section className="mb-12">
        <SectionTitle aside={`${lessonsDone} lessons finished, ${minutes} minutes studied`}>Last two weeks</SectionTitle>
        <div className="flex h-28 items-end gap-1.5" role="img" aria-label="Answers per day over the last 14 days">
          {days.map((d, i) => (
            <div key={d.key} className="flex h-full flex-1 flex-col justify-end" title={`${d.key}: ${d.answered} answers`}>
              <div
                className={`w-full rounded-t-md ${i === days.length - 1 ? 'bg-accent' : 'bg-ink'}`}
                style={{ height: d.answered ? `${Math.max(6, (d.answered / maxDay) * 100)}%` : '2px', opacity: d.answered ? 1 : 0.15 }}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
