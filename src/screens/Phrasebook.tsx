import { useEffect, useMemo, useState } from 'react'
import { expandVariants } from '../engine/answers'
import { buildPhrasebook, phrasebookCounts, type PhrasebookEntry, type PhrasebookScope } from '../engine/phrasebook'
import { strengthLabel } from '../engine/stats'
import type { GrammarNote } from '../engine/types'
import { useApp } from '../state/app'
import { href } from '../state/router'
import { AudioButton, PageTitle, Pill, Rich, Segmented } from '../ui/kit'

/*
 * Everything you have met, unit by unit: words with audio and how well you
 * know them, plus each lesson's grammar and culture notes. For looking over
 * before a lesson, after one, or whenever something won't stick.
 */

const SCOPE_KEY = 'fluency.phrasebook.scope'

function savedScope(): PhrasebookScope {
  try {
    const s = localStorage.getItem(SCOPE_KEY)
    return s === 'shaky' || s === 'all' ? s : 'met'
  } catch {
    return 'met'
  }
}

const TONE = { new: 'new', struggling: 'shaky', learning: 'solid', mastered: 'sealed' } as const

function Entry({ entry }: { entry: PhrasebookEntry }) {
  const { item, status, met } = entry
  const say = expandVariants(item.target)[0]
  return (
    <li className={`flex items-start gap-3.5 border-b border-line py-3.5 ${met ? '' : 'opacity-60'}`}>
      <AudioButton text={say} size="sm" tone="wash" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <span className="target text-[24px] leading-[1.15]">{item.target}</span>
          {item.register && <span className="text-[12px] text-ink-3">{item.register === 'formal' ? 'Formal' : 'Informal'}</span>}
        </div>
        <div className="text-[15px] text-ink-2">{item.native}</div>
        {item.note && <div className="pt-1 text-[13px] leading-snug text-ink-3">{item.note}</div>}
        {item.examples?.[0] && (
          <div className="pt-1.5 text-[14px] leading-snug">
            <span className="target text-[18px]">{item.examples[0].target}</span>
            <span className="text-ink-3"> · {item.examples[0].native}</span>
          </div>
        )}
      </div>
      <span className="shrink-0 pt-1">{met ? <Pill tone={TONE[status]}>{strengthLabel(status)}</Pill> : <Pill>Not Yet</Pill>}</span>
    </li>
  )
}

function Note({ note }: { note: GrammarNote }) {
  return (
    <details className="group rounded-2xl border border-line bg-raised px-5 py-4 open:pb-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[16px] font-semibold">
        <span>
          <span className="text-[12px] font-normal text-ink-3">How It Works · </span>
          {note.title}
        </span>
        <span aria-hidden="true" className="text-ink-3 transition-transform group-open:rotate-90">
          ›
        </span>
      </summary>
      <div className="flex flex-col gap-2.5 pt-3 text-[15px] leading-relaxed">
        {note.body.map((p, i) => (
          <p key={i} className="m-0">
            <Rich text={p} />
          </p>
        ))}
        {note.table && (
          <table className="w-full border-collapse text-left">
            <tbody>
              {note.table.rows.map((row, i) => (
                <tr key={i} className="border-b border-line">
                  {row.map((cell, j) => (
                    <td key={j} className={`py-2 pr-4 ${i === 0 && note.table!.header ? 'text-[12px] font-semibold text-ink-2' : 'target text-[19px]'}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </details>
  )
}

export function Phrasebook({ unit: focusUnit }: { unit?: string }) {
  const { pack, progress } = useApp()
  const [scope, setScope] = useState<PhrasebookScope>(savedScope)
  const [query, setQuery] = useState('')
  const counts = useMemo(() => phrasebookCounts(pack, progress), [pack, progress])
  const units = useMemo(() => buildPhrasebook(pack, progress, scope, query), [pack, progress, scope, query])

  useEffect(() => {
    try {
      localStorage.setItem(SCOPE_KEY, scope)
    } catch {
      // Remembering the tab is only a convenience.
    }
  }, [scope])

  // Opened from a unit on Learn (or #/phrasebook/accents): jump there.
  useEffect(() => {
    if (focusUnit) document.getElementById(`pb-${focusUnit}`)?.scrollIntoView({ block: 'start' })
  }, [focusUnit])

  const empty =
    query.trim() !== ''
      ? `Nothing matches « ${query.trim()} ». Try the English, or switch to Everything.`
      : scope === 'shaky'
        ? 'No shaky words. Words you keep missing will gather here, so you know what to look over.'
        : 'Nothing here yet. Words appear as you meet them in lessons.'

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-[18px]">
        <a href={href({ name: 'learn' })} className="text-[14px] text-ink-2 hover:text-ink">
          ← Learn
        </a>
        <PageTitle>Phrasebook</PageTitle>
        <p className="m-0 max-w-[60ch] text-[16px] leading-normal text-ink-2">
          Every word, phrase and grammar note from your lessons, with audio. Read through before a lesson, or come back when something won't stick.
        </p>
        <div className="flex flex-col gap-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search in French or English"
            aria-label="Search the phrasebook"
            className="box-border w-full max-w-[480px] rounded-full border border-line bg-raised px-5 py-3 text-[16px] outline-none focus:border-ink"
          />
          <Segmented
            label="Show"
            value={scope}
            onChange={setScope}
            options={[
              { value: 'met', label: `Met · ${counts.met}` },
              { value: 'shaky', label: `Shaky · ${counts.shaky}` },
              { value: 'all', label: 'Everything' },
            ]}
          />
        </div>
      </div>

      {pack.accents && !query.trim() && scope !== 'shaky' && (
        <details id="pb-accents" className="group scroll-mt-24 rounded-3xl border border-line bg-raised px-5 py-4 open:pb-6" open={focusUnit === 'accents'}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
            <span className="flex flex-col gap-0.5">
              <span className="text-[18px] font-semibold">Accents and Special Letters</span>
              <span className="text-[14px] text-ink-2">What each one does to the sound, and how to tell when a word needs it.</span>
            </span>
            <span aria-hidden="true" className="text-ink-3 transition-transform group-open:rotate-90">
              ›
            </span>
          </summary>
          <div className="flex flex-col pt-3">
            {pack.accents.map((a) => (
              <div key={a.letter} className="flex flex-col gap-2 border-b border-line py-4 last:border-b-0">
                <div className="flex items-baseline gap-3">
                  <span className="target text-[40px] leading-none">{a.letter}</span>
                  <span className="target text-[20px] text-ink-2">{a.name}</span>
                  <span className="text-[13px] text-ink-3">{a.nameEn}</span>
                </div>
                <p className="m-0 text-[15px] leading-relaxed">
                  <span className="font-semibold">Sound: </span>
                  <Rich text={a.sound} />
                </p>
                <p className="m-0 text-[15px] leading-relaxed text-ink-2">
                  <span className="font-semibold text-ink">When: </span>
                  <Rich text={a.guess} />
                </p>
                <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1">
                  {a.examples.map((ex) => (
                    <span key={ex.target} className="flex items-center gap-2">
                      <AudioButton text={ex.target} size="sm" tone="wash" />
                      <span className="target text-[20px]">{ex.target}</span>
                      <span className="text-[13px] text-ink-3">{ex.native}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <p className="m-0 pt-3 text-[13px] text-ink-3">
              Typing: on a Mac or iPhone, hold down a letter key (such as e) to pick its accent. In the app, the accent keys under each answer box do the same.
            </p>
          </div>
        </details>
      )}

      {scope === 'shaky' && counts.shaky > 0 && !query.trim() && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-line bg-raised p-5">
          <span className="max-w-[46ch] text-[15px] text-ink-2">Read them through, then practise: your weakest words come first.</span>
          <a href={href({ name: 'review', mode: 'extra' })} className="rounded-full bg-btn px-5 py-3 text-[15px] font-semibold text-onbtn">
            Practise These
          </a>
        </div>
      )}

      {units.length === 0 && <p className="m-0 max-w-[56ch] text-[16px] text-ink-2">{empty}</p>}

      {units.map((unit) => (
        <section key={unit.id} id={`pb-${unit.id}`} className="flex scroll-mt-24 flex-col gap-6 border-t border-line pt-7">
          <div className="flex flex-col gap-1">
            <span className="text-[15px] font-semibold text-accent [font-stretch:120%]">Unit {unit.number}</span>
            <h2 className="target m-0 text-[36px] leading-none">{unit.title}</h2>
            <p className="m-0 text-[14px] text-ink-2">{unit.subtitle}</p>
          </div>
          {unit.lessons.map((lesson) => (
            <div key={lesson.id} className="flex flex-col gap-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="target m-0 text-[26px] leading-tight">{lesson.title}</h3>
                <span className="text-[13px] text-ink-3">{lesson.subtitle}</span>
              </div>
              {lesson.entries.length > 0 && (
                <ul className="m-0 list-none border-t border-line p-0">
                  {lesson.entries.map((e) => (
                    <Entry key={e.item.id} entry={e} />
                  ))}
                </ul>
              )}
              {lesson.notes.map((n) => (
                <Note key={n.id} note={n} />
              ))}
              {lesson.culture && (
                <details className="group rounded-2xl border border-line px-5 py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[16px] font-semibold">
                    <span>
                      <span className="text-[12px] font-normal text-ink-3">Culture · </span>
                      {lesson.culture.title}
                    </span>
                    <span aria-hidden="true" className="text-ink-3 transition-transform group-open:rotate-90">
                      ›
                    </span>
                  </summary>
                  <div className="flex flex-col gap-2.5 pt-3 text-[15px] leading-relaxed">
                    {lesson.culture.body.map((p, i) => (
                      <p key={i} className="m-0">
                        <Rich text={p} />
                      </p>
                    ))}
                  </div>
                </details>
              )}
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}
