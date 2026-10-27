import { dueTracks } from '../engine/session'
import { useApp } from '../state/app'
import { href } from '../state/router'
import { CheckIcon } from '../ui/icons'
import { LinkButton, PageHeader, SectionTitle } from '../ui/kit'

export function Practise() {
  const { pack, progress } = useApp()
  const due = dueTracks(pack, progress, Date.now())
  const dueItems = new Set(due.map((d) => d.itemId)).size
  const known = Object.keys(progress.items).length

  return (
    <div>
      <PageHeader title="practise">Revision keeps what you've learned; listening and conversation put it to work.</PageHeader>

      <section className="mb-12">
        <SectionTitle>Revision</SectionTitle>
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-wash p-5">
          <div>
            <p className="text-[19px] font-semibold">
              {due.length ? `${dueItems} ${dueItems === 1 ? 'word or phrase' : 'words and phrases'} due` : known ? 'Nothing due right now' : 'Nothing to revise yet'}
            </p>
            <p className="max-w-[48ch] text-[15px] text-ink-2">
              {due.length
                ? 'Struggling items come first, then the most overdue. Each comes back in a new form.'
                : known
                  ? 'You can still work on the words you have found hardest.'
                  : 'Finish your first lesson and its words will start appearing here.'}
            </p>
          </div>
          {due.length > 0 ? (
            <LinkButton href={href({ name: 'review', mode: 'due' })}>Start revision</LinkButton>
          ) : known > 0 ? (
            <LinkButton href={href({ name: 'review', mode: 'extra' })} variant="secondary">
              Practise weak spots
            </LinkButton>
          ) : null}
        </div>
      </section>

      <section className="mb-12">
        <SectionTitle>Listening</SectionTitle>
        <ul className="divide-y divide-line border-y border-line">
          {pack.listening.map((l) => {
            const lp = progress.listening[l.id]
            return (
              <li key={l.id}>
                <a href={href({ name: 'listen', id: l.id })} className="flex items-center gap-4 py-4 hover:bg-wash md:-mx-3 md:rounded-xl md:px-3">
                  <div className="min-w-0 flex-1">
                    <p className="target text-[24px] leading-tight">{l.title}</p>
                    <p className="text-[15px] text-ink-2">{l.setting}</p>
                  </div>
                  <span className="shrink-0 text-[14px] tabular-nums text-ink-2">
                    {lp ? `Best ${Math.round(lp.bestScore * 100)}%` : `${l.level}, ${l.kind}`}
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="mb-12">
        <SectionTitle>Conversation</SectionTitle>
        <p className="mb-4 max-w-[60ch] text-[15px] text-ink-2">
          Role-plays where you answer in your own words, typed or spoken. You'll get feedback on what your answer needs, and a
          natural model answer.
        </p>
        <ul className="divide-y divide-line border-y border-line">
          {pack.conversations.map((c) => {
            const cp = progress.conversations[c.id]
            return (
              <li key={c.id}>
                <a href={href({ name: 'talk', id: c.id })} className="flex items-center gap-4 py-4 hover:bg-wash md:-mx-3 md:rounded-xl md:px-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[19px] font-medium leading-tight">{c.title}</p>
                    <p className="text-[15px] text-ink-2">
                      {c.setting} Uses <span className="target text-[17px]">{c.register === 'formal' ? 'vous' : 'tu'}</span>.
                    </p>
                  </div>
                  {cp?.completedAt && (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-paper" aria-label="Completed">
                      <CheckIcon size={16} />
                    </span>
                  )}
                </a>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
