import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { checkAnswer, checkSlots, compareSpoken, expandVariants } from '../engine/answers'
import { indexPack, shuffle } from '../engine/session'
import type {
  AnswerResult,
  BuildExercise,
  ChooseExercise,
  DictationExercise,
  ErrorType,
  Exercise,
  GapExercise,
  LearningItem,
  Lesson,
  ListenChooseExercise,
  RespondExercise,
  Skill,
  SpeakExercise,
  TypeExercise,
} from '../engine/types'
import { listenOnce, recognitionSupported, RecognitionError } from '../speech/recognition'
import { useApp } from '../state/app'
import { fillName } from '../tutor/provider'
import { MicIcon } from './icons'
import { AccentBar, AudioButton, Button, Rich, Tag } from './kit'

/*
 * One component per exercise type. Each one judges its own answer and reports
 * a Verdict; the player around it records the result and shows feedback.
 */

export interface Verdict {
  result: AnswerResult
  skill: Skill
  errorType?: ErrorType
  /** Correct answer to show, when the learner's differs. */
  expected?: string
  given?: string
  hinted?: boolean
  /** Extra explanation, such as missing parts of a response. */
  detail?: string
  selfAssessed?: boolean
}

export const SKILL_OF: Record<Exercise['type'], Skill | null> = {
  dialogue: null,
  present: null,
  note: null,
  choose: 'recognition',
  gap: 'recognition',
  'listen-choose': 'listening',
  dictation: 'listening',
  type: 'recall',
  build: 'recall',
  respond: 'recall',
  speak: 'speaking',
}

interface Props<E> {
  exercise: E
  onAnswer: (v: Verdict) => void
  locked: boolean
}

function Prompt({ kicker, children }: { kicker: string; children: ReactNode }) {
  return (
    <div className="mb-7">
      <p className="mb-3 text-[15px] text-ink-2">{kicker}</p>
      {children}
    </div>
  )
}

function useCheckOptions() {
  const { pack } = useApp()
  return { articleGroups: pack.articles.groups }
}

/* ------------------------------------------------------------------ */
/* Option lists                                                        */
/* ------------------------------------------------------------------ */

function Options({
  options,
  answer,
  picked,
  onPick,
  locked,
  target,
}: {
  options: string[]
  answer: string
  picked?: string
  onPick: (o: string) => void
  locked: boolean
  target: boolean
}) {
  useEffect(() => {
    if (locked) return
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key)
      if (n >= 1 && n <= options.length && !(e.target instanceof HTMLInputElement)) onPick(options[n - 1])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [locked, options, onPick])

  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {options.map((o, i) => {
        const state = !locked ? 'idle' : o === answer ? 'right' : o === picked ? 'wrong' : 'dim'
        const style = {
          idle: 'border-line hover:border-ink',
          right: 'border-good bg-good-wash',
          wrong: 'border-bad bg-bad-wash',
          dim: 'border-line opacity-45',
        }[state]
        return (
          <button
            key={o}
            type="button"
            disabled={locked}
            onClick={() => onPick(o)}
            className={`flex min-h-14 items-center gap-3 rounded-2xl border-[1.5px] px-4 py-3 text-left transition-colors ${style}`}
          >
            <span className="hidden w-4 text-sm text-ink-3 sm:inline">{i + 1}</span>
            <span className={target ? 'target text-[21px] leading-tight' : 'text-[16px]'}>{o}</span>
          </button>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Recognition                                                         */
/* ------------------------------------------------------------------ */

export function Choose({ exercise: e, onAnswer, locked }: Props<ChooseExercise>) {
  const [picked, setPicked] = useState<string>()
  const pick = (o: string) => {
    if (locked) return
    setPicked(o)
    onAnswer({ result: o === e.answer ? 'correct' : 'wrong', skill: 'recognition', expected: e.answer, given: o, errorType: o === e.answer ? undefined : 'meaning' })
  }
  const fromTarget = e.promptLang === 'target'
  return (
    <>
      <Prompt kicker={fromTarget ? 'What does this mean?' : 'Choose the French'}>
        {fromTarget ? (
          <div className="flex items-center gap-4">
            <AudioButton text={e.prompt} />
            <p className="target text-[34px] leading-tight">{e.prompt}</p>
          </div>
        ) : (
          <p className="text-[26px] font-medium leading-snug tracking-[-0.01em]">{e.prompt}</p>
        )}
      </Prompt>
      <Options options={e.options} answer={e.answer} picked={picked} onPick={pick} locked={locked} target={!fromTarget} />
    </>
  )
}

export function ListenChoose({ exercise: e, onAnswer, locked }: Props<ListenChooseExercise>) {
  const { speaker } = useApp()
  const [picked, setPicked] = useState<string>()
  useEffect(() => {
    void speaker.speak(e.audio)
    return () => speaker.cancel()
  }, [e.audio, speaker])
  const pick = (o: string) => {
    if (locked) return
    setPicked(o)
    onAnswer({ result: o === e.answer ? 'correct' : 'wrong', skill: 'listening', expected: e.answer, given: o, errorType: o === e.answer ? undefined : 'meaning' })
  }
  return (
    <>
      <Prompt kicker="Listen. What did you hear?">
        <div className="flex items-center gap-4">
          <AudioButton text={e.audio} size="lg" withSlow />
          {locked && <p className="target text-[26px]">{e.audio}</p>}
        </div>
      </Prompt>
      <Options options={e.options} answer={e.answer} picked={picked} onPick={pick} locked={locked} target={false} />
    </>
  )
}

export function Gap({ exercise: e, onAnswer, locked }: Props<GapExercise>) {
  const [picked, setPicked] = useState<string>()
  const pick = (o: string) => {
    if (locked) return
    setPicked(o)
    onAnswer({
      result: o === e.answer ? 'correct' : 'wrong',
      skill: 'recognition',
      expected: e.sentence.replace('___', e.answer),
      given: o,
      errorType: o === e.answer ? undefined : 'wrong-word',
    })
  }
  const [before, after] = e.sentence.split('___')
  const filled = locked ? e.answer : picked
  return (
    <>
      <Prompt kicker="Complete the sentence">
        {e.before && (
          <div className="mb-4 flex items-start gap-3">
            <AudioButton text={e.before.target} size="sm" voice="b" />
            <div>
              <p className="text-[13px] font-medium text-ink-3">{e.before.speaker}</p>
              <p className="target text-[22px] leading-snug">{e.before.target}</p>
            </div>
          </div>
        )}
        <p className="target text-[32px] leading-snug">
          {before}
          <span
            className={`mx-1 inline-block min-w-[3.5ch] border-b-2 px-1 text-center ${
              locked ? 'border-good text-good' : 'border-ink'
            }`}
          >
            {filled ?? ' '}
          </span>
          {after}
        </p>
        <p className="mt-2 text-ink-2">{e.translation}</p>
      </Prompt>
      <Options options={e.options} answer={e.answer} picked={picked} onPick={pick} locked={locked} target />
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Typed answers                                                       */
/* ------------------------------------------------------------------ */

function TextAnswer({
  onSubmit,
  locked,
  placeholder = 'Type in French',
  extra,
}: {
  onSubmit: (text: string) => void
  locked: boolean
  placeholder?: string
  extra?: ReactNode
}) {
  const { pack } = useApp()
  const [value, setValue] = useState('')
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    // Desktop only: on phones, opening the keyboard immediately hides the prompt.
    if (window.matchMedia('(pointer: fine)').matches) ref.current?.focus()
  }, [])
  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault()
        if (!locked && value.trim()) onSubmit(value)
      }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          value={value}
          onChange={(ev) => setValue(ev.target.value)}
          disabled={locked}
          lang={pack.locale}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          placeholder={placeholder}
          aria-label="Your answer"
          className="target min-h-14 w-full rounded-2xl border-[1.5px] border-line bg-raised px-4 text-[22px] outline-none placeholder:font-sans placeholder:text-[16px] placeholder:text-ink-3 focus:border-ink disabled:opacity-70"
        />
        {extra}
      </div>
      {!locked && (
        <>
          <AccentBar inputRef={ref} value={value} onChange={setValue} />
          <Button type="submit" className="w-full sm:w-auto" disabled={!value.trim()}>
            Check
          </Button>
        </>
      )}
    </form>
  )
}

export function TypeIt({ exercise: e, onAnswer, locked }: Props<TypeExercise>) {
  const opts = useCheckOptions()
  const [hinted, setHinted] = useState(false)
  return (
    <>
      <Prompt kicker={e.context ? 'Fill the gap in French' : 'Write this in French'}>
        <p className="text-[26px] font-medium leading-snug tracking-[-0.01em]">{e.prompt}</p>
        {e.context && <p className="target mt-3 text-[26px] text-ink-2">{e.context}</p>}
        {e.hint && !locked && (
          <div className="mt-3">
            {hinted ? (
              <p className="text-[15px] text-ink-2">{e.hint}</p>
            ) : (
              <button type="button" onClick={() => setHinted(true)} className="text-[15px] font-medium text-accent underline underline-offset-4">
                Show a hint
              </button>
            )}
          </div>
        )}
      </Prompt>
      <TextAnswer
        locked={locked}
        onSubmit={(text) => {
          const r = checkAnswer(text, e.answers, opts)
          onAnswer({ ...r, skill: 'recall', given: text, hinted })
        }}
      />
      {!locked && (
        <button
          type="button"
          onClick={() => onAnswer({ result: 'wrong', skill: 'recall', expected: e.answers[0], given: '' })}
          className="mt-4 text-[15px] text-ink-2 underline underline-offset-4"
        >
          I don't know yet
        </button>
      )}
    </>
  )
}

export function Dictation({ exercise: e, onAnswer, locked }: Props<DictationExercise>) {
  const { speaker } = useApp()
  const opts = useCheckOptions()
  useEffect(() => {
    void speaker.speak(e.audio)
    return () => speaker.cancel()
  }, [e.audio, speaker])
  return (
    <>
      <Prompt kicker="Listen and write what you hear">
        <div className="flex items-center gap-4">
          <AudioButton text={e.audio} size="lg" withSlow />
          {locked && <p className="text-ink-2">{e.translation}</p>}
        </div>
      </Prompt>
      <TextAnswer
        locked={locked}
        onSubmit={(text) => {
          const r = checkAnswer(text, e.answers, opts)
          onAnswer({ ...r, expected: e.audio, skill: 'listening', given: text })
        }}
      />
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Sentence building                                                   */
/* ------------------------------------------------------------------ */

export function Build({ exercise: e, onAnswer, locked }: Props<BuildExercise>) {
  const tiles = useMemo(
    () => shuffle([...e.answer, ...e.distractors].map((text, i) => ({ text, key: i }))),
    [e],
  )
  const [chosen, setChosen] = useState<number[]>([])
  const used = new Set(chosen)
  const check = () => {
    const words = chosen.map((k) => tiles.find((t) => t.key === k)!.text)
    const correct = words.length === e.answer.length && words.every((w, i) => w === e.answer[i])
    let errorType: ErrorType | undefined
    if (!correct) {
      const same = [...words].sort().join('|') === [...e.answer].sort().join('|')
      errorType = same ? 'word-order' : words.length < e.answer.length ? 'missing-word' : 'wrong-word'
    }
    onAnswer({ result: correct ? 'correct' : 'wrong', skill: 'recall', expected: e.answer.join(' '), given: words.join(' '), errorType })
  }
  return (
    <>
      <Prompt kicker="Build the sentence in French">
        <p className="text-[26px] font-medium leading-snug tracking-[-0.01em]">{e.prompt}</p>
      </Prompt>
      <div
        className="mb-5 flex min-h-[72px] flex-wrap content-start gap-2 border-b-[1.5px] border-ink pb-3"
        aria-label="Your sentence"
      >
        {chosen.map((k) => {
          const t = tiles.find((x) => x.key === k)!
          return (
            <button
              key={k}
              type="button"
              disabled={locked}
              onClick={() => setChosen(chosen.filter((c) => c !== k))}
              className="target rounded-xl bg-ink px-3.5 py-2 text-[20px] text-paper"
            >
              {t.text}
            </button>
          )
        })}
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        {tiles.map((t) => (
          <button
            key={t.key}
            type="button"
            disabled={locked || used.has(t.key)}
            onClick={() => setChosen([...chosen, t.key])}
            className={`target rounded-xl border-[1.5px] px-3.5 py-2 text-[20px] transition-opacity ${
              used.has(t.key) ? 'border-dashed border-line text-transparent' : 'border-line hover:border-ink'
            }`}
          >
            {t.text}
          </button>
        ))}
      </div>
      {!locked && (
        <Button onClick={check} disabled={!chosen.length} className="w-full sm:w-auto">
          Check
        </Button>
      )}
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Speaking                                                            */
/* ------------------------------------------------------------------ */

/** A microphone button that captures one utterance. */
export function MicButton({
  onResult,
  onInterim,
  disabled,
}: {
  onResult: (transcripts: string[]) => void
  onInterim?: (text: string) => void
  disabled?: boolean
}) {
  const { pack, speaker } = useApp()
  const [active, setActive] = useState(false)
  const [error, setError] = useState<string>()
  const stopRef = useRef<() => void>(undefined)
  const start = async () => {
    if (active) {
      stopRef.current?.()
      return
    }
    speaker.cancel()
    setError(undefined)
    setActive(true)
    const { result, stop } = listenOnce(pack.locale, onInterim)
    stopRef.current = stop
    try {
      const r = await result
      onResult(r.transcripts)
    } catch (err) {
      setError(err instanceof RecognitionError ? err.message : 'Speech recognition failed.')
    } finally {
      setActive(false)
    }
  }
  return (
    <span className="inline-flex flex-col items-start">
      <button
        type="button"
        onClick={start}
        disabled={disabled}
        aria-label={active ? 'Stop listening' : 'Speak'}
        aria-pressed={active}
        className={`inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition-colors disabled:opacity-30 ${
          active ? 'listening-pulse bg-accent text-on-accent' : 'border-[1.5px] border-ink text-ink hover:bg-wash'
        }`}
      >
        <MicIcon size={24} />
      </button>
      {error && <span className="mt-2 max-w-[36ch] text-[14px] text-bad">{error}</span>}
    </span>
  )
}

export function Speak({ exercise: e, onAnswer, locked }: Props<SpeakExercise>) {
  const { settings } = useApp()
  const target = fillName(e.target, settings.learnerName)
  const native = fillName(e.native, settings.learnerName)
  const canListen = recognitionSupported() && settings.speechInput
  const [heard, setHeard] = useState<{ text: string; score: number; missing: string[] }>()
  const [interim, setInterim] = useState('')
  const [tries, setTries] = useState(0)
  const best = useRef(0)

  const finish = (score: number) =>
    onAnswer({
      result: score >= 0.8 ? 'correct' : score >= 0.5 ? 'near' : 'wrong',
      skill: 'speaking',
      expected: target,
      detail: score < 0.8 ? 'Recognition is strict with short phrases. Listen again and keep practising aloud.' : undefined,
    })

  const onResult = (transcripts: string[]) => {
    setInterim('')
    const scored = transcripts.map((t) => ({ text: t, ...compareSpoken(t, target) }))
    const top = scored.sort((a, b) => b.score - a.score)[0]
    best.current = Math.max(best.current, top.score)
    setHeard(top)
    setTries((n) => n + 1)
    if (top.score >= 0.8) finish(top.score)
  }

  return (
    <>
      <Prompt kicker="Say it aloud">
        <div className="flex items-start gap-4">
          <AudioButton text={target} withSlow />
          <div>
            <p className="target text-[32px] leading-tight">{target}</p>
            <p className="mt-1 text-ink-2">{native}</p>
          </div>
        </div>
      </Prompt>
      {canListen ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <MicButton onResult={onResult} onInterim={setInterim} disabled={locked} />
            <p className="text-[15px] text-ink-2">
              {interim ? <span className="target text-[20px] text-ink">{interim}</span> : tries ? 'Tap to try again.' : 'Tap the microphone, then speak.'}
            </p>
          </div>
          {heard && !locked && (
            <div className="rounded-2xl bg-wash p-4">
              <p className="text-[14px] text-ink-2">I heard</p>
              <p className="target text-[22px]">{heard.text}</p>
              {heard.missing.length > 0 && (
                <p className="mt-2 text-[15px] text-ink-2">
                  Listen for: <span className="target text-[18px] text-ink">{heard.missing.join(', ')}</span>
                </p>
              )}
            </div>
          )}
          {tries > 0 && !locked && (
            <Button variant="quiet" onClick={() => finish(best.current)}>
              Move on
            </Button>
          )}
        </div>
      ) : (
        !locked && (
          <div className="space-y-4">
            <p className="max-w-[56ch] text-[15px] text-ink-2">
              {recognitionSupported()
                ? 'Speech input is turned off in settings.'
                : "This browser can't check speech."}{' '}
              Listen, say it aloud a few times, then rate yourself honestly.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => onAnswer({ result: 'correct', skill: 'speaking', selfAssessed: true })}>I said it comfortably</Button>
              <Button variant="secondary" onClick={() => onAnswer({ result: 'near', skill: 'speaking', selfAssessed: true })}>
                I stumbled
              </Button>
            </div>
          </div>
        )
      )}
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Free response                                                       */
/* ------------------------------------------------------------------ */

export function Respond({ exercise: e, onAnswer, locked }: Props<RespondExercise>) {
  const { settings } = useApp()
  const opts = useCheckOptions()
  const [value, setValue] = useState('')
  const ref = useRef<HTMLInputElement>(null)
  const canListen = recognitionSupported() && settings.speechInput
  const models = e.answers.map((a) => fillName(a, settings.learnerName))

  const submit = () => {
    if (locked || !value.trim()) return
    if (e.slots) {
      const r = checkSlots(value, e.slots)
      const near = r.nearMisses.length === r.missing.length && r.missing.length > 0
      onAnswer({
        result: r.ok ? 'correct' : near ? 'near' : 'wrong',
        skill: 'recall',
        expected: models[0],
        given: value,
        errorType: r.ok ? undefined : near ? 'typo' : 'missing-word',
        detail: r.ok ? undefined : `Your answer needed to ${r.missing.join(' and ')}.`,
      })
    } else {
      const r = checkAnswer(value, models, opts)
      onAnswer({ ...r, skill: 'recall', given: value })
    }
  }

  return (
    <>
      <Prompt kicker="Respond in French">
        <p className="text-[22px] font-medium leading-snug tracking-[-0.01em]">{e.situation}</p>
        {e.partner && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl bg-wash p-4">
            <AudioButton text={e.partner.target} size="sm" voice="b" />
            <div>
              <p className="text-[13px] font-medium text-ink-3">{e.partner.speaker}</p>
              <p className="target text-[22px] leading-snug">{e.partner.target}</p>
              <p className="text-[14px] text-ink-2">{e.partner.native}</p>
            </div>
          </div>
        )}
      </Prompt>
      <form
        className="space-y-3"
        onSubmit={(ev) => {
          ev.preventDefault()
          submit()
        }}
      >
        <div className="flex items-center gap-2">
          <input
            ref={ref}
            value={value}
            onChange={(ev) => setValue(ev.target.value)}
            disabled={locked}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            placeholder={canListen ? 'Type or speak your answer' : 'Type your answer'}
            aria-label="Your answer"
            className="target min-h-14 w-full rounded-2xl border-[1.5px] border-line bg-raised px-4 text-[22px] outline-none placeholder:font-sans placeholder:text-[16px] placeholder:text-ink-3 focus:border-ink"
          />
          {canListen && !locked && <MicButton onResult={(t) => setValue(t[0])} onInterim={setValue} />}
        </div>
        {!locked && (
          <>
            <AccentBar inputRef={ref} value={value} onChange={setValue} />
            <Button type="submit" disabled={!value.trim()} className="w-full sm:w-auto">
              Check
            </Button>
          </>
        )}
      </form>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Unscored steps                                                      */
/* ------------------------------------------------------------------ */

export function DialogueView({ lesson, onDone }: { lesson: Lesson; onDone: () => void }) {
  const { speaker, settings } = useApp()
  const d = lesson.dialogue!
  const [showAll, setShowAll] = useState(settings.showTranslations)
  const [shown, setShown] = useState<Set<number>>(new Set())
  const [current, setCurrent] = useState<number | null>(null)
  const playing = useRef(false)

  useEffect(() => () => speaker.cancel(), [speaker])

  const playAll = async (rate?: 'slow') => {
    if (playing.current) {
      playing.current = false
      speaker.cancel()
      setCurrent(null)
      return
    }
    playing.current = true
    for (let i = 0; i < d.lines.length && playing.current; i++) {
      const line = d.lines[i]
      const sp = d.speakers[line.speaker]
      setCurrent(i)
      await speaker.speak(line.target, { voice: sp.voice, pitch: sp.pitch, rate })
      await new Promise((r) => setTimeout(r, 350))
    }
    playing.current = false
    setCurrent(null)
  }

  return (
    <div>
      <p className="mb-1 text-[15px] text-ink-2">Listen first</p>
      <h2 className="target mb-2 text-[34px] leading-tight">{d.title}</h2>
      <p className="mb-6 max-w-[60ch] text-ink-2">{d.setting}</p>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Button onClick={() => playAll()}>{current !== null ? 'Stop' : 'Play conversation'}</Button>
        <Button variant="secondary" onClick={() => playAll('slow')} disabled={current !== null}>
          Slowly
        </Button>
        <label className="ml-1 inline-flex items-center gap-2 text-[15px] text-ink-2">
          <input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} className="h-4 w-4 accent-[var(--accent)]" />
          Show translations
        </label>
      </div>
      <ol className="space-y-1">
        {d.lines.map((line, i) => {
          const sp = d.speakers[line.speaker]
          const open = showAll || shown.has(i)
          return (
            <li
              key={i}
              className={`grid grid-cols-[auto_1fr] gap-x-3 rounded-2xl px-3 py-3 transition-colors ${current === i ? 'bg-accent-wash' : ''}`}
            >
              <AudioButton text={line.target} voice={sp.voice} pitch={sp.pitch} size="sm" />
              <div>
                <p className="text-[13px] font-medium text-ink-3">{sp.name}</p>
                <button
                  type="button"
                  className="target text-left text-[23px] leading-snug"
                  onClick={() => setShown(new Set(shown).add(i))}
                  aria-label={`${line.target}. Show translation`}
                >
                  {line.target}
                </button>
                {open && <p className="text-[15px] text-ink-2">{line.native}</p>}
              </div>
            </li>
          )
        })}
      </ol>
      <p className="mt-3 text-[14px] text-ink-3">Tap a line to see its meaning.</p>
      <ContinueBar onClick={onDone} />
    </div>
  )
}

export function PresentView({ itemIds, onDone }: { itemIds: string[]; onDone: () => void }) {
  const { pack } = useApp()
  const { items } = indexPack(pack)
  const list = itemIds.map((id) => items.get(id)).filter((i): i is LearningItem => !!i)
  return (
    <div>
      <p className="mb-5 text-[15px] text-ink-2">New words and phrases</p>
      <ul className="divide-y divide-line border-y border-line">
        {list.map((item) => (
          <li key={item.id} className="grid grid-cols-[auto_1fr] gap-x-4 py-4">
            <AudioButton text={expandVariants(item.target)[0]} withSlow={false} />
            <div>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <p className="target text-[28px] leading-tight">{item.target}</p>
                {item.register && <Tag tone={item.register === 'formal' ? 'plain' : 'accent'}>{item.register}</Tag>}
              </div>
              <p className="text-[17px]">{item.native}</p>
              {item.note && <p className="mt-1 max-w-[60ch] text-[15px] text-ink-2">{item.note}</p>}
            </div>
          </li>
        ))}
      </ul>
      <ContinueBar onClick={onDone} />
    </div>
  )
}

export function NoteView({ lesson, noteId, onDone }: { lesson: Lesson; noteId: string; onDone: () => void }) {
  const note = lesson.notes.find((n) => n.id === noteId)
  if (!note) return <ContinueBar onClick={onDone} />
  return (
    <div className="max-w-[64ch]">
      <p className="mb-1 text-[15px] text-ink-2">How it works</p>
      <h2 className="mb-4 text-[30px] font-semibold leading-tight tracking-[-0.02em]">{note.title}</h2>
      <div className="space-y-3 text-[17px] leading-relaxed">
        {note.body.map((p, i) => (
          <p key={i}>
            <Rich text={p} />
          </p>
        ))}
      </div>
      {note.table && (
        <table className="mt-6 w-full border-collapse text-left">
          {note.table.caption && <caption className="mb-2 text-left text-[14px] text-ink-2">{note.table.caption}</caption>}
          <tbody>
            {note.table.rows.map((row, i) => (
              <tr key={i} className="border-b border-line">
                {row.map((cell, j) => (
                  <td key={j} className={`py-2.5 pr-4 ${i === 0 && note.table!.header ? 'text-[14px] font-semibold text-ink-2' : 'target text-[20px]'}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <ContinueBar onClick={onDone} />
    </div>
  )
}

export function ContinueBar({ onClick, label = 'Continue' }: { onClick: () => void; label?: string }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !(e.target instanceof HTMLButtonElement) && !(e.target instanceof HTMLInputElement)) onClick()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClick])
  return (
    <div className="sticky bottom-0 -mx-5 mt-8 bg-gradient-to-t from-paper from-70% to-transparent px-5 pt-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:static md:mx-0 md:bg-none md:px-0">
      <Button onClick={onClick} className="w-full md:w-auto md:min-w-48">
        {label}
      </Button>
    </div>
  )
}
