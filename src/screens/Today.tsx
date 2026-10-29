import { useState, type ReactNode } from 'react'
import { dayLog } from '../engine/progress'
import { todayPlan } from '../engine/session'
import { dayKey } from '../engine/srs'
import { levelSummary, STRENGTHS, statusCounts } from '../engine/stats'
import { useApp } from '../state/app'
import { href } from '../state/router'
import { ChatIcon, LearnIcon, PlayIcon, PractiseIcon } from '../ui/icons'
import { Button, LinkButton } from '../ui/kit'

function greeting(now: Date): string {
  // A small lesson in itself: bonsoir takes over in the evening.
  return now.getHours() >= 18 ? 'Bonsoir' : 'Bonjour'
}

interface PlanItem {
  key: string
  meta: string
  title: string
  french: boolean
  icon: ReactNode
  action: string
  href: string
  primary?: boolean
}

export function Today() {
  const { pack, progress, settings, updateSettings } = useApp()
  const now = Date.now()
  const plan = todayPlan(pack, progress, settings, now)
  const [name, setName] = useState('')
  const level = pack.levels[0]
  const summary = levelSummary(pack, progress, level)
  const counts = statusCounts(pack, progress)
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  const maxCount = Math.max(1, ...Object.values(counts))

  const nextListening = pack.listening.find((l) => !progress.listening[l.id]?.completedAt)
  const nextTalk = pack.conversations.find((c) => !progress.conversations[c.id]?.completedAt)

  const items: PlanItem[] = []
  if (plan.next && plan.nextUnit) {
    const unitNo = pack.units.indexOf(plan.nextUnit) + 1
    items.push({
      key: 'lesson',
      meta: `${plan.next.kind === 'checkpoint' ? 'Unit Check' : 'Lesson'} · Unit ${unitNo} · ${plan.next.minutes} Min`,
      title: plan.next.title,
      french: true,
      icon: <LearnIcon size={24} />,
      action: plan.next.kind === 'checkpoint' ? 'Start Check' : 'Start Lesson',
      href: href({ name: 'lesson', id: plan.next.id }),
      primary: plan.recommendation === 'lesson',
    })
  }
  if (plan.dueCount > 0) {
    const n = plan.dueItems
    items[plan.recommendation === 'revise' ? 'unshift' : 'push']({
      key: 'revise',
      meta: 'Revision · Weakest First',
      title: `${n} ${n === 1 ? 'Word or Phrase' : 'Words and Phrases'}`,
      french: false,
      icon: <PractiseIcon size={24} />,
      action: 'Revise',
      href: href({ name: 'review', mode: 'due' }),
      primary: plan.recommendation === 'revise',
    })
  } else if (!plan.next && Object.keys(progress.items).length) {
    items.push({
      key: 'extra',
      meta: 'Practice · Weak Spots',
      title: 'Strengthen Your Weakest Words',
      french: false,
      icon: <PractiseIcon size={24} />,
      action: 'Practise',
      href: href({ name: 'review', mode: 'extra' }),
      primary: true,
    })
  }
  if (nextListening) {
    const unitNo = pack.units.findIndex((u) => u.id === nextListening.unitId) + 1
    items.push({
      key: 'listen',
      meta: `Listening · Unit ${unitNo}`,
      title: nextListening.title,
      french: true,
      icon: <PlayIcon size={24} />,
      action: 'Listen',
      href: href({ name: 'listen', id: nextListening.id }),
    })
  }
  if (nextTalk) {
    items.push({
      key: 'talk',
      meta: `Conversation · ${nextTalk.register === 'formal' ? 'Formal' : 'Informal'}`,
      title: nextTalk.title,
      french: false,
      icon: <ChatIcon size={24} />,
      action: 'Talk',
      href: href({ name: 'talk', id: nextTalk.id }),
    })
  }
  if (!items.some((i) => i.primary) && items[0]) items[0].primary = true

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now)
    d.setDate(d.getDate() - (6 - i))
    const key = dayKey(d.getTime())
    return { key, label: d.toLocaleDateString('en-GB', { weekday: 'narrow' }), active: dayLog(progress, key).answered > 0, today: i === 6 }
  })

  const firstName = settings.learnerName.split(' ')[0]

  return (
    <div className="flex flex-wrap gap-x-16 gap-y-12">
      <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-[30px]">
        <div>
          <h1 className="target m-0 text-[clamp(60px,9cqi,116px)] leading-[0.9] tracking-[-0.02em]">
            {greeting(new Date(now))}
            {firstName && `, ${firstName}`}
            <span className="text-accent">.</span>
          </h1>
          <p className="mt-4 mb-0 text-[18px] text-ink-2">
            {plan.goalMet ? "Today's goal is done. Anything more is a bonus." : `${plan.answeredToday} of ${plan.goal} answers towards today's goal.`}
          </p>
        </div>

        {!settings.learnerName && (
          <form
            className="flex flex-wrap items-end gap-3 rounded-3xl border border-line bg-raised p-6"
            onSubmit={(e) => {
              e.preventDefault()
              if (name.trim()) updateSettings({ learnerName: name.trim() })
            }}
          >
            <label className="flex min-w-[14rem] flex-1 flex-col gap-2">
              <span className="text-[15px] font-semibold">What Should I Call You?</span>
              <span className="text-[14px] text-ink-2">Used in speaking and conversation practice.</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="min-h-12 rounded-[14px] border-[1.5px] border-line bg-paper px-3.5 text-[17px] outline-none focus:border-ink"
                placeholder="Your first name"
                autoComplete="given-name"
              />
            </label>
            <Button type="submit" variant="ink" disabled={!name.trim()}>
              Save
            </Button>
          </form>
        )}

        <ol className="m-0 flex list-none flex-col border-t border-line p-0">
          {items.map((item, i) => (
            <li key={item.key} className={`flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-line ${item.primary ? 'py-6' : 'py-5'}`}>
              <span className={`grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full ${item.primary ? 'bg-fill text-feedback-on' : 'bg-wash text-ink'}`}>{item.icon}</span>
              <div className="min-w-0 flex-[1_1_220px]">
                <div className="text-[14px] text-ink-2">
                  {String(i + 1).padStart(2, '0')} · {item.meta}
                </div>
                {item.french ? (
                  <div className={`target leading-[1.05] ${item.primary ? 'text-[clamp(34px,4cqi,42px)]' : 'text-[30px]'}`}>{item.title}</div>
                ) : (
                  <div className="text-[22px] font-medium">{item.title}</div>
                )}
              </div>
              <LinkButton href={item.href} variant={item.primary ? 'primary' : 'outline'}>
                {item.action}
              </LinkButton>
            </li>
          ))}
        </ol>
        {items.length === 0 && <p className="m-0 text-[15px] text-ink-2">Everything is done for now. New lessons are on the way.</p>}
      </div>

      <aside className="flex max-w-[420px] flex-[1_1_280px] flex-col gap-9 pt-3">
        <section className="flex flex-col gap-3" aria-label="This week">
          <div className="flex justify-between text-[15px]">
            <span className="font-semibold">This Week</span>
            <span className="text-ink-2">{plan.streak > 1 ? `${plan.streak} Days Running` : `${plan.activeDaysThisWeek} of 7 Days`}</span>
          </div>
          <ol className="m-0 grid list-none grid-cols-7 gap-1.5 p-0 text-center text-[12px] text-ink-2">
            {days.map((d) => (
              <li key={d.key} className="flex flex-col items-center gap-1.5">
                <span
                  className={`box-border h-11 w-full rounded-[10px] ${d.active ? (d.today ? 'bg-fill' : 'bg-btn') : 'border-[1.5px] border-dashed border-line'}`}
                  aria-label={d.active ? 'Practised' : 'No practice'}
                />
                {d.label}
              </li>
            ))}
          </ol>
        </section>

        <section className="flex flex-col gap-3" aria-label="Your words">
          <div className="flex justify-between text-[15px]">
            <span className="font-semibold">Your Words</span>
            <span className="text-ink-2">{total} Total</span>
          </div>
          <div className="flex flex-col gap-[9px] text-[14px]">
            {STRENGTHS.map((s) => (
              <div key={s.status} className="grid grid-cols-[64px_1fr_24px] items-center gap-2.5">
                <span>{s.label}</span>
                <span className="h-2 rounded-full bg-wash">
                  <span className="block h-full rounded-full" style={{ width: `${(counts[s.status] / maxCount) * 100}%`, background: s.color }} />
                </span>
                <span className="text-right tabular-nums">{counts[s.status]}</span>
              </div>
            ))}
          </div>
        </section>

        <a href="#/progress" className="flex flex-col gap-2.5 border-t border-line pt-6 hover:text-ink">
          <span className="text-[15px] font-semibold">
            {level.id} {level.name}
          </span>
          <span className="text-[14px] leading-normal text-ink-2">
            {summary.demonstrated} of {level.canDo.length} abilities demonstrated. They count once words stick across days.
          </span>
        </a>
      </aside>
    </div>
  )
}
