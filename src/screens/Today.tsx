import { dayLog } from '../engine/progress'
import { useState } from 'react'
import { todayPlan } from '../engine/session'
import { dayKey } from '../engine/srs'
import { levelSummary } from '../engine/stats'
import { useApp } from '../state/app'
import { href } from '../state/router'
import { SettingsIcon } from '../ui/icons'
import { Bar, Button, LinkButton, SectionTitle } from '../ui/kit'

function greeting(now: Date): string {
  // A small lesson in itself: bonsoir takes over in the evening.
  return now.getHours() >= 18 ? 'bonsoir' : 'bonjour'
}

export function Today() {
  const { pack, progress, settings, updateSettings } = useApp()
  const now = Date.now()
  const plan = todayPlan(pack, progress, settings, now)
  const [name, setName] = useState('')
  const level = pack.levels[0]
  const summary = levelSummary(pack, progress, level)
  const nextListening = pack.listening.find((l) => !progress.listening[l.id]?.completedAt) ?? pack.listening[0]
  const nextTalk = pack.conversations.find((c) => !progress.conversations[c.id]?.completedAt) ?? pack.conversations[0]

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now)
    d.setDate(d.getDate() - (6 - i))
    const key = dayKey(d.getTime())
    return { key, label: d.toLocaleDateString(undefined, { weekday: 'narrow' }), active: dayLog(progress, key).answered > 0 }
  })

  const revise = plan.dueCount > 0 && (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line py-5">
      <div>
        <p className="text-[19px] font-semibold">
          {plan.dueItems} {plan.dueItems === 1 ? 'word or phrase' : 'words and phrases'} to revise
        </p>
        <p className="text-[15px] text-ink-2">Due for review now, weakest first.</p>
      </div>
      <LinkButton href={href({ name: 'review', mode: 'due' })} variant={plan.recommendation === 'revise' ? 'primary' : 'secondary'}>
        Start revision
      </LinkButton>
    </div>
  )

  return (
    <div>
      <header className="mb-10 flex items-start justify-between gap-4 pt-2 md:pt-8">
        <div>
          <h1 className="target text-[56px] leading-[0.95] md:text-[80px]">
            {greeting(new Date(now))}
            {settings.learnerName ? `, ${settings.learnerName}` : ''}
          </h1>
          <p className="mt-3 text-ink-2">
            {plan.goalMet ? "Today's goal is done. Anything more is a bonus." : `${plan.answeredToday} of ${plan.goal} answers towards today's goal.`}
          </p>
          <div className="mt-3 w-56 max-w-full">
            <Bar value={plan.answeredToday / plan.goal} tone={plan.goalMet ? 'good' : 'accent'} label="Daily goal" />
          </div>
        </div>
        <a href="#/settings" aria-label="Settings" className="mt-2 rounded-full p-2 text-ink-2 hover:text-ink md:hidden">
          <SettingsIcon size={24} />
        </a>
      </header>

      {!settings.learnerName && (
        <form
          className="mb-10 flex flex-wrap items-end gap-3 rounded-3xl bg-wash p-5"
          onSubmit={(e) => {
            e.preventDefault()
            if (name.trim()) updateSettings({ learnerName: name.trim() })
          }}
        >
          <label className="min-w-[14rem] flex-1">
            <span className="mb-1.5 block text-[15px] font-medium">What should I call you?</span>
            <span className="mb-2 block text-[14px] text-ink-2">Your name is used in speaking and conversation practice.</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="min-h-12 w-full rounded-xl border-[1.5px] border-line bg-raised px-3 text-[17px] outline-none focus:border-ink"
              placeholder="Your first name"
              autoComplete="given-name"
            />
          </label>
          <Button type="submit" disabled={!name.trim()}>
            Save
          </Button>
        </form>
      )}

      {plan.recommendation === 'revise' && revise}

      {plan.next && plan.nextUnit && (
        <section className="border-t border-line py-6">
          <p className="mb-1 text-[15px] text-ink-2">
            {plan.next.kind === 'checkpoint' ? 'Unit check' : 'Next lesson'} in <span className="target text-[17px]">{plan.nextUnit.title}</span>, {plan.nextUnit.level}
          </p>
          <h2 className="target mb-1 text-[44px] leading-[1.05]">{plan.next.title}</h2>
          <p className="mb-4 text-[17px]">
            {plan.next.subtitle}. About {plan.next.minutes} minutes.
          </p>
          <ul className="mb-6 space-y-1 text-[15px] text-ink-2">
            {plan.next.objectives.map((o) => (
              <li key={o} className="flex gap-2">
                <span aria-hidden="true" className="mt-[9px] h-1 w-3 shrink-0 bg-accent" />
                {o}
              </li>
            ))}
          </ul>
          <LinkButton href={href({ name: 'lesson', id: plan.next.id })} variant={plan.recommendation === 'lesson' ? 'primary' : 'secondary'}>
            {plan.next.kind === 'checkpoint' ? 'Start the check' : 'Start lesson'}
          </LinkButton>
        </section>
      )}

      {plan.recommendation !== 'revise' && revise}

      {!plan.next && plan.dueCount === 0 && (
        <section className="border-t border-line py-6">
          <p className="text-[19px] font-semibold">You've finished every lesson available so far.</p>
          <p className="mb-4 text-ink-2">Nothing is due. Strengthen your weakest words, or try listening and conversation practice.</p>
          <LinkButton href={href({ name: 'review', mode: 'extra' })}>Practise weak spots</LinkButton>
        </section>
      )}

      <section className="mt-6 grid gap-8 border-t border-line pt-8 md:grid-cols-2">
        <div>
          <SectionTitle aside={plan.streak > 1 ? `${plan.streak} days running` : undefined}>This week</SectionTitle>
          <ol className="flex gap-2" aria-label={`${plan.activeDaysThisWeek} of the last 7 days with practice`}>
            {days.map((d, i) => (
              <li key={d.key} className="flex flex-1 flex-col items-center gap-1.5">
                <span
                  className={`h-9 w-full max-w-9 rounded-full ${d.active ? (i === 6 ? 'bg-accent' : 'bg-ink') : 'border-[1.5px] border-line'}`}
                />
                <span className="text-[12px] text-ink-3">{d.label}</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <SectionTitle aside={<a href="#/progress" className="underline underline-offset-4">Details</a>}>
            {level.id} {level.name.toLowerCase()}
          </SectionTitle>
          <p className="mb-3 text-[15px] text-ink-2">
            {summary.demonstrated} of {level.canDo.length} abilities demonstrated. Lessons alone don't count: material has to
            stick across days.
          </p>
          <Bar value={summary.demonstrated / level.canDo.length} tone="ink" label={`${level.id} abilities demonstrated`} />
        </div>
      </section>

      <section className="mt-10 border-t border-line pt-8">
        <SectionTitle>Also good today</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          {nextListening && (
            <a href={href({ name: 'listen', id: nextListening.id })} className="group rounded-2xl border border-line p-4 hover:border-ink">
              <p className="text-[14px] text-ink-2">Listening</p>
              <p className="target text-[24px] leading-tight">{nextListening.title}</p>
            </a>
          )}
          {nextTalk && (
            <a href={href({ name: 'talk', id: nextTalk.id })} className="group rounded-2xl border border-line p-4 hover:border-ink">
              <p className="text-[14px] text-ink-2">Conversation</p>
              <p className="text-[19px] font-medium leading-tight">{nextTalk.title}</p>
            </a>
          )}
        </div>
      </section>
    </div>
  )
}
