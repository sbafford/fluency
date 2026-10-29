import { dueTracks } from '../engine/session'
import { useApp } from '../state/app'
import { href } from '../state/router'
import { ChatIcon, CheckIcon, PlayIcon, PractiseIcon } from '../ui/icons'
import { LinkButton, PageTitle, Pill, SectionHead } from '../ui/kit'

const KIND: Record<string, string> = { dialogue: 'Dialogue', announcement: 'Announcement', monologue: 'Monologue' }

export function Practise() {
  const { pack, progress } = useApp()
  const due = dueTracks(pack, progress, Date.now())
  const dueItems = new Set(due.map((d) => d.itemId)).size
  const known = Object.keys(progress.items).length
  const nextListen = pack.listening.find((l) => !progress.listening[l.id]?.completedAt)
  const heard = pack.listening.filter((l) => progress.listening[l.id]?.completedAt).length
  const talked = pack.conversations.filter((c) => progress.conversations[c.id]?.completedAt).length

  return (
    <div className="flex flex-col gap-10">
      <PageTitle>Practise</PageTitle>

      <section className="flex flex-wrap items-center justify-between gap-x-10 gap-y-5 rounded-3xl border border-line bg-raised p-7">
        <div className="flex flex-[1_1_260px] flex-col gap-1.5">
          <span className="flex items-center gap-2 text-[14px] text-ink-2">
            <PractiseIcon size={18} />
            Revision
          </span>
          <span className="text-[clamp(28px,3.4cqi,36px)] leading-[1.1] font-semibold tracking-[-0.02em] [font-stretch:110%]">
            {dueItems ? `${dueItems} Due Now` : known ? 'Nothing Due' : 'Nothing Yet'}
          </span>
          <span className="text-[15px] text-ink-2">
            {dueItems
              ? "Weakest first. Yesterday's mistakes come back at the start."
              : known
                ? 'Everything is scheduled for later. You can still work on your weakest words.'
                : 'Finish your first lesson and its words start appearing here.'}
          </span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {dueItems > 0 && <LinkButton href={href({ name: 'review', mode: 'due' })}>Start Revision</LinkButton>}
          {known > 0 && (
            <LinkButton href={href({ name: 'review', mode: 'extra' })} variant={dueItems ? 'outline' : 'primary'}>
              Weak Spots
            </LinkButton>
          )}
        </div>
      </section>

      <div className="flex flex-wrap gap-x-14 gap-y-10">
        <section className="flex flex-[1_1_340px] flex-col">
          <SectionHead title="Listening" icon={<PlayIcon size={22} />} aside={`${heard} of ${pack.listening.length} Heard`} />
          {pack.listening.map((l) => {
            const done = !!progress.listening[l.id]?.completedAt
            const isNext = l.id === nextListen?.id
            const unitNo = pack.units.findIndex((u) => u.id === l.unitId) + 1
            return (
              <a key={l.id} href={href({ name: 'listen', id: l.id })} className="flex items-center gap-3.5 border-b border-line py-3.5 hover:bg-wash">
                <span
                  className={`box-border grid h-9 w-9 shrink-0 place-items-center rounded-full ${
                    done ? 'bg-btn text-onbtn' : isNext ? 'bg-fill text-feedback-on' : 'border-[1.5px] border-line text-ink-3'
                  }`}
                >
                  {done ? <CheckIcon size={16} /> : <PlayIcon size={16} />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="target text-[24px] leading-[1.1]">{l.title}</div>
                  <div className="text-[13px] text-ink-2">
                    {KIND[l.kind]} · Unit {unitNo}
                    {isNext && ' · Next'}
                    {done && ` · Best ${Math.round(progress.listening[l.id].bestScore * 100)}%`}
                  </div>
                </div>
              </a>
            )
          })}
        </section>

        <section className="flex flex-[1_1_340px] flex-col">
          <SectionHead title="Conversation" icon={<ChatIcon size={22} />} aside={`${talked} of ${pack.conversations.length} Done`} />
          {pack.conversations.map((c) => {
            const done = !!progress.conversations[c.id]?.completedAt
            return (
              <a key={c.id} href={href({ name: 'talk', id: c.id })} className="flex items-center gap-3.5 border-b border-line py-3.5 hover:bg-wash">
                <div className="min-w-0 flex-1">
                  <div className="text-[18px] leading-[1.25] font-medium">{c.title}</div>
                  <div className="text-[13px] text-ink-2">{c.place ?? c.setting}</div>
                </div>
                <Pill>{c.register === 'formal' ? 'Formal' : 'Informal'}</Pill>
                <span className="w-4 text-[13px] text-accent" aria-label={done ? 'Done' : 'Not done yet'}>
                  {done ? '✓' : '→'}
                </span>
              </a>
            )
          })}
        </section>
      </div>
    </div>
  )
}
