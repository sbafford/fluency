import {
  accuracySplit,
  daysPractised,
  ERROR_SHORT,
  levelSummary,
  skillSummaries,
  STRENGTHS,
  statusCounts,
  topErrors,
} from '../engine/stats'
import type { Skill } from '../engine/types'
import { useApp } from '../state/app'
import { href } from '../state/router'
import { CheckIcon } from '../ui/icons'
import { PageTitle, pct } from '../ui/kit'

const SKILL: Record<Skill, string> = { listening: 'Listening', speaking: 'Speaking', recognition: 'Recognition', recall: 'Recall' }
const CANDO_SKILL: Record<string, string> = { listening: 'Listening', speaking: 'Speaking', reading: 'Reading', writing: 'Writing', interaction: 'Interaction' }

function Stat({ value, label, accent = false }: { value: string; label: string; accent?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5 py-[22px] pr-5">
      <span className={`stat text-[clamp(44px,5cqi,60px)] ${accent ? 'text-accent' : ''}`}>{value}</span>
      <span className="text-[14px] text-ink-2">{label}</span>
    </div>
  )
}

function Head({ title, aside }: { title: string; aside?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <h2 className="m-0 text-[20px] font-semibold">{title}</h2>
      {aside && <span className="text-[13px] text-ink-2">{aside}</span>}
    </div>
  )
}

export function Progress() {
  const { pack, progress } = useApp()
  const now = Date.now()
  const split = accuracySplit(progress, now)
  const counts = statusCounts(pack, progress)
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  const errors = topErrors(progress, now, 5)
  const maxErr = Math.max(1, ...errors.map((e) => e.count))
  const skills = skillSummaries(progress, now)

  return (
    <div className="flex flex-col gap-11">
      <PageTitle>Progress</PageTitle>

      <div className="grid border-y border-line" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,200px),1fr))' }}>
        <Stat value={pct(split.sameDay)} label="Correct on the Day" />
        <Stat value={pct(split.laterDays)} label="Correct on Later Days" accent />
        <Stat value={String(daysPractised(progress))} label="Days Practised" />
      </div>
      {split.laterDays === undefined && (
        <p className="-mt-7 mb-0 max-w-[62ch] text-[14px] text-ink-3">
          "Later days" counts only answers about words first met on an earlier day: the best sign they've stuck. It fills in after a few days of revision.
        </p>
      )}

      <div className="flex flex-wrap gap-x-16 gap-y-11">
        {pack.levels
          .filter((l) => l.canDo.length)
          .map((level) => {
            const summary = levelSummary(pack, progress, level)
            return (
              <section key={level.id} className="flex flex-[3_1_420px] flex-col">
                <div className="border-b border-line pb-3">
                  <Head title={`${level.id} ${level.name}`} aside={`${summary.demonstrated} of ${level.canDo.length} Demonstrated`} />
                </div>
                {summary.states.map(({ canDo, state }) => (
                  <div key={canDo.id} className="flex items-start gap-3.5 border-b border-line py-[13px]">
                    <span
                      className={`mt-px box-border grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full ${
                        state === 'demonstrated' ? 'bg-strength-sealed text-[#16261a]' : 'border-[1.5px] border-line'
                      }`}
                      aria-label={state === 'demonstrated' ? 'Demonstrated' : state === 'practising' ? 'Practising' : 'Not started'}
                    >
                      {state === 'demonstrated' && <CheckIcon size={13} />}
                      {state === 'practising' && <span className="h-2 w-2 rounded-full bg-fill" />}
                    </span>
                    <span className={`flex-1 text-[15px] leading-[1.45] ${state === 'demonstrated' ? 'text-ink' : 'text-ink-2'}`}>{canDo.text}</span>
                    <span className="pt-0.5 text-[12px] whitespace-nowrap text-ink-3">{CANDO_SKILL[canDo.skill]}</span>
                  </div>
                ))}
                <p className="m-0 pt-3 text-[13px] text-ink-3">
                  A pink dot means practising. Abilities count as demonstrated once their lessons are passed at 80% and the words are recalled on later days.
                </p>
              </section>
            )
          })}

        <div className="flex flex-[2_1_300px] flex-col gap-10">
          <section className="flex flex-col gap-3.5">
            <Head title="Your Words" aside={String(total)} />
            <div className="flex h-3.5 gap-[3px] overflow-hidden rounded-full" aria-hidden="true">
              {STRENGTHS.map((s) => counts[s.status] > 0 && <span key={s.status} style={{ flex: counts[s.status], background: s.color }} />)}
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {STRENGTHS.map((s) => (
                <div key={s.status} className="flex items-center gap-2 text-[14px]">
                  <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: s.color }} />
                  <span className="flex-1">{s.label}</span>
                  <span className="font-semibold tabular-nums">{counts[s.status]}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <Head title="Mistakes" aside="Last 30 Days" />
            {errors.length ? (
              errors.map((e) => (
                <div key={e.type} className="grid grid-cols-[110px_1fr_24px] items-center gap-3 text-[14px]">
                  <span>{ERROR_SHORT[e.type]}</span>
                  <span className="h-2 rounded-full bg-wash">
                    <span className="block h-full rounded-full bg-ink" style={{ width: `${(e.count / maxErr) * 100}%` }} />
                  </span>
                  <span className="text-right tabular-nums">{e.count}</span>
                </div>
              ))
            ) : (
              <p className="m-0 text-[14px] text-ink-2">Patterns in your mistakes show here once there are a few.</p>
            )}
            {errors.length > 0 && (
              <a href={href({ name: 'review', mode: 'extra' })} className="mt-1.5 self-start text-[15px] font-semibold text-accent hover:text-pink-hover">
                Practise Weak Spots →
              </a>
            )}
          </section>

          <section className="flex flex-col gap-3">
            <Head title="By Skill" aside="Last 30 Days" />
            {skills.map((s) => (
              <div key={s.skill} className="grid grid-cols-[110px_1fr_40px] items-center gap-3 text-[14px]">
                <span>{SKILL[s.skill]}</span>
                <span className="h-2 rounded-full bg-wash">
                  <span className="block h-full rounded-full bg-fill" style={{ width: `${(s.accuracy ?? 0) * 100}%` }} />
                </span>
                <span className="text-right tabular-nums">{pct(s.accuracy)}</span>
              </div>
            ))}
            <p className="m-0 text-[13px] text-ink-3">Speaking checks you were understood by speech recognition, not your accent.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
