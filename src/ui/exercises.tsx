import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { checkAnswer, checkSlots, compareSpoken, expandVariants } from '../engine/answers'
import { nextLetter, wordShape } from '../engine/hints'
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
import { SILENT_PEAK, startLevelMeter } from '../speech/micLevel'
import { listenOnce, recognitionSupported, RecognitionError } from '../speech/recognition'
import { useApp } from '../state/app'
import { fillName } from '../tutor/provider'
import { ActionButton, Actions } from './Focus'
import { MicIcon } from './icons'
import { AccentKeys, AudioButton, Button, Pill, Rich, Segmented } from './kit'

/*
 * One component per exercise type. Each judges its own answer and reports a
 * Verdict; the Player records it and shows the feedback sheet.
 */

export interface Verdict {
  result: AnswerResult
  skill: Skill
  errorType?: ErrorType
  /** The correct answer, to show on the sheet. */
  expected?: string
  /** Whether `expected` is French (shown in the serif, with audio). */
  expectedIsFrench?: boolean
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
  /** Set once answered. */
  verdict?: Verdict
}

/* ------------------------------------------------------------------ */
/* Prompt pieces                                                       */
/* ------------------------------------------------------------------ */

function Kicker({ children }: { children: ReactNode }) {
  return <div className="text-[14px] text-ink-2">{children}</div>
}

function EnglishPrompt({ children }: { children: ReactNode }) {
  return <div className="text-[clamp(28px,3.6cqi,36px)] leading-[1.15] font-medium tracking-[-0.015em] text-pretty">{children}</div>
}

function FrenchPrompt({ text, audio = true }: { text: string; audio?: boolean }) {
  return (
    <div className="flex items-center gap-[18px] pt-2 pb-1">
      {audio && <AudioButton text={text} size="lg" />}
      <span className="target text-[clamp(44px,6cqi,64px)] leading-none">{text}</span>
    </div>
  )
}

function useCheckOptions() {
  const { pack } = useApp()
  return { articleGroups: pack.articles.groups }
}

/* ------------------------------------------------------------------ */
/* Option grid                                                         */
/* ------------------------------------------------------------------ */

function Options({
  options,
  answer,
  picked,
  onPick,
  locked,
  french,
  compact = false,
}: {
  options: string[]
  answer: string
  picked?: string
  onPick: (o: string) => void
  locked: boolean
  french: boolean
  compact?: boolean
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
    <div
      className="grid gap-2.5"
      style={{ gridTemplateColumns: compact ? 'repeat(auto-fit,minmax(min(100%,120px),1fr))' : 'repeat(auto-fit,minmax(min(100%,240px),1fr))' }}
    >
      {options.map((o) => {
        const right = locked && o === answer
        const wrongPick = locked && o === picked && o !== answer
        const style = right
          ? 'bg-pink border-pink text-feedback-on'
          : wrongPick
            ? 'bg-wash border-ink'
            : locked
              ? 'bg-raised border-line opacity-60'
              : 'bg-raised border-line hover:border-ink'
        return (
          <button
            key={o}
            type="button"
            disabled={locked}
            onClick={() => onPick(o)}
            className={`flex min-h-14 items-center rounded-2xl border-[1.5px] px-[18px] py-2.5 text-left transition-colors ${compact ? 'justify-center text-[18px] font-semibold [font-stretch:110%]' : ''} ${style}`}
          >
            <span className={french ? 'target text-[22px] leading-tight' : compact ? '' : 'text-[17px]'}>{french ? o : cap(o)}</span>
          </button>
        )
      })}
    </div>
  )
}

const isShort = (opts: string[]) => opts.every((o) => o.length <= 6)

/** English shown as a prompt or option starts with a capital, like a sentence. */
export const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)

/* ------------------------------------------------------------------ */
/* Recognition                                                         */
/* ------------------------------------------------------------------ */

export function Choose({ exercise: e, onAnswer, verdict }: Props<ChooseExercise>) {
  const [picked, setPicked] = useState<string>()
  const fromFrench = e.promptLang === 'target'
  const pick = (o: string) => {
    if (verdict) return
    setPicked(o)
    onAnswer({
      result: o === e.answer ? 'correct' : 'wrong',
      skill: 'recognition',
      expected: fromFrench ? e.prompt : e.answer,
      expectedIsFrench: true,
      detail: fromFrench ? `${cap(e.answer).replace(/[.?!]$/, '')}.` : undefined,
      given: o,
      errorType: o === e.answer ? undefined : 'meaning',
    })
  }
  return (
    <>
      {fromFrench ? (
        <>
          <FrenchPrompt text={e.prompt} />
          <Kicker>What Does It Mean?</Kicker>
        </>
      ) : (
        <>
          <Kicker>Choose the French</Kicker>
          <EnglishPrompt>{cap(e.prompt)}</EnglishPrompt>
        </>
      )}
      <Options options={e.options} answer={e.answer} picked={picked} onPick={pick} locked={!!verdict} french={!fromFrench} compact={fromFrench && isShort(e.options)} />
    </>
  )
}

export function ListenChoose({ exercise: e, onAnswer, verdict }: Props<ListenChooseExercise>) {
  const { speaker } = useApp()
  const [picked, setPicked] = useState<string>()
  useEffect(() => {
    void speaker.speak(e.audio)
    return () => speaker.cancel()
  }, [e.audio, speaker])
  const pick = (o: string) => {
    if (verdict) return
    setPicked(o)
    onAnswer({ result: o === e.answer ? 'correct' : 'wrong', skill: 'listening', expected: e.audio, expectedIsFrench: true, detail: `It means: ${e.answer}`, given: o, errorType: o === e.answer ? undefined : 'meaning' })
  }
  return (
    <>
      <Kicker>Listen. What Did You Hear?</Kicker>
      <div className="flex items-center gap-3 py-2">
        <AudioButton text={e.audio} size="xl" tone="fill" />
        <AudioButton text={e.audio} size="md" tone="wash" rate="slow" label="Play slowly" />
        <span className="text-[13px] text-ink-2">Slower</span>
      </div>
      <Options options={e.options} answer={e.answer} picked={picked} onPick={pick} locked={!!verdict} french={false} compact={isShort(e.options)} />
    </>
  )
}

export function Gap({ exercise: e, onAnswer, verdict }: Props<GapExercise>) {
  const [picked, setPicked] = useState<string>()
  const pick = (o: string) => {
    if (verdict) return
    setPicked(o)
    onAnswer({
      result: o === e.answer ? 'correct' : 'wrong',
      skill: 'recognition',
      expected: e.sentence.replace('___', e.answer),
      expectedIsFrench: true,
      given: o,
      errorType: o === e.answer ? undefined : 'wrong-word',
    })
  }
  const [before, after] = e.sentence.split('___')
  const filled = verdict ? e.answer : picked
  return (
    <>
      <Kicker>Complete the Sentence</Kicker>
      {e.before && <Bubble who={e.before.speaker} fr={e.before.target} audio />}
      <p className="target m-0 text-[clamp(32px,4.4cqi,44px)] leading-[1.15]">
        {before}
        <span className={`mx-1 inline-block min-w-[3.5ch] border-b-2 px-1 text-center ${verdict ? 'border-pink' : 'border-ink'}`}>{filled ?? ' '}</span>
        {after}
      </p>
      <p className="m-0 text-[15px] text-ink-2">{e.translation}</p>
      <Options options={e.options} answer={e.answer} picked={picked} onPick={pick} locked={!!verdict} french />
    </>
  )
}

/** A line of conversation, as in the conversation screen. */
export function Bubble({ who, fr, en, audio = false, mine = false }: { who?: string; fr: string; en?: string; audio?: boolean; mine?: boolean }) {
  return (
    <div className={`flex flex-col gap-1.5 ${mine ? 'items-end' : 'items-start'}`}>
      {who && <span className="text-[12px] text-ink-3">{who}</span>}
      <div className={`flex max-w-[min(88%,480px)] items-start gap-3 rounded-[22px] px-[18px] py-3.5 ${mine ? 'bg-fill text-feedback-on' : 'border border-line bg-raised'}`}>
        {audio && <AudioButton text={fr} size="sm" voice="b" who={who} />}
        <div>
          <div className="target text-[22px] leading-[1.25]">{fr}</div>
          {en && <div className="pt-0.5 text-[13px] opacity-75">{en}</div>}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Typed answers                                                       */
/* ------------------------------------------------------------------ */

export function FrenchInput({
  value,
  onChange,
  inputRef,
  locked,
  tone,
  placeholder = 'Type in French',
  id,
}: {
  value: string
  onChange: (v: string) => void
  inputRef: React.RefObject<HTMLInputElement | null>
  locked: boolean
  tone?: AnswerResult
  placeholder?: string
  id?: string
}) {
  const { pack } = useApp()
  useEffect(() => {
    // Desktop only: on phones, opening the keyboard straight away hides the prompt.
    if (window.matchMedia('(pointer: fine)').matches) inputRef.current?.focus()
  }, [inputRef])
  const border = !locked ? 'border-ink' : tone === 'correct' ? 'border-pink' : tone === 'near' ? 'border-yellow' : 'border-line'
  return (
    <input
      id={id}
      ref={inputRef}
      value={value}
      onChange={(ev) => onChange(ev.target.value)}
      readOnly={locked}
      lang={pack.locale}
      autoCapitalize="off"
      autoCorrect="off"
      autoComplete="off"
      spellCheck={false}
      placeholder={placeholder}
      aria-label="Your answer"
      className={`target mt-3.5 box-border w-full rounded-[18px] border-[1.5px] bg-raised px-[18px] py-4 text-[30px] leading-[1.2] outline-none placeholder:text-ink-3 ${border}`}
    />
  )
}

/** Progressive help for typed answers: the shape of the answer, then one letter at a time. */
function HintBar({ answer, value, onChange, onUse }: { answer: string; value: string; onChange: (v: string) => void; onUse: () => void }) {
  const [shown, setShown] = useState(false)
  const shape = wordShape(answer)
  return (
    <div className="flex flex-col gap-2.5">
      {shown && (
        <div className="target flex flex-wrap gap-x-5 gap-y-1 text-[24px] leading-[1.3] text-ink-2" aria-label="The shape of the answer">
          {shape.map((w, i) => (
            <span key={i} className="whitespace-pre">
              {w}
            </span>
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-x-5 gap-y-1">
        {!shown ? (
          <button
            type="button"
            onClick={() => {
              setShown(true)
              onUse()
            }}
            className="py-1.5 text-[14px] font-semibold text-accent"
          >
            Show a Hint
          </button>
        ) : (
          <button
            type="button"
            onMouseDown={(ev) => ev.preventDefault()}
            onClick={() => {
              onChange(nextLetter(value, answer))
              onUse()
            }}
            className="py-1.5 text-[14px] font-semibold text-accent"
          >
            Next Letter
          </button>
        )}
      </div>
    </div>
  )
}

function TypedAnswer({
  onSubmit,
  verdict,
  onSkip,
  hintAnswer,
}: {
  onSubmit: (text: string, hinted: boolean) => void
  verdict?: Verdict
  onSkip?: () => void
  /** When set, offers a hint built from this answer. */
  hintAnswer?: string
}) {
  const [value, setValue] = useState('')
  const [hinted, setHinted] = useState(false)
  const ref = useRef<HTMLInputElement>(null)
  const formId = useId()
  return (
    <>
      <form
        id={formId}
        onSubmit={(ev) => {
          ev.preventDefault()
          if (!verdict && value.trim()) onSubmit(value, hinted)
        }}
        className="flex flex-col gap-4"
      >
        <FrenchInput value={value} onChange={setValue} inputRef={ref} locked={!!verdict} tone={verdict?.result} />
        {!verdict && <AccentKeys inputRef={ref} value={value} onChange={setValue} />}
        {!verdict && hintAnswer && <HintBar answer={hintAnswer} value={value} onChange={setValue} onUse={() => setHinted(true)} />}
      </form>
      {!verdict && (
        <Actions>
          {onSkip && (
            <button type="button" onClick={onSkip} className="px-[18px] py-4 text-[15px] whitespace-nowrap text-ink-2 hover:text-ink">
              I Don't Know
            </button>
          )}
          <ActionButton type="submit" form={formId} disabled={!value.trim()}>
            Check
          </ActionButton>
        </Actions>
      )}
    </>
  )
}

export function TypeIt({ exercise: e, onAnswer, verdict }: Props<TypeExercise>) {
  const opts = useCheckOptions()
  const [hinted, setHinted] = useState(false)
  return (
    <>
      <Kicker>{e.context ? 'Fill the Gap in French' : 'Say It in French'}</Kicker>
      <EnglishPrompt>{cap(e.prompt)}</EnglishPrompt>
      {e.context && <p className="target m-0 text-[30px] leading-[1.2] text-ink-2">{e.context}</p>}
      {e.hint && !verdict && (
        <div>
          {hinted ? (
            <p className="m-0 text-[15px] text-ink-2">{e.hint}</p>
          ) : (
            <button type="button" onClick={() => setHinted(true)} className="text-[14px] font-semibold text-accent">
              Show a Clue
            </button>
          )}
        </div>
      )}
      <TypedAnswer
        verdict={verdict}
        hintAnswer={e.answers[0]}
        onSubmit={(text, usedHint) => {
          const r = checkAnswer(text, e.answers, opts)
          onAnswer({ ...r, expectedIsFrench: true, skill: 'recall', given: text, hinted: hinted || usedHint })
        }}
        onSkip={() => onAnswer({ result: 'wrong', skill: 'recall', expected: e.answers[0], expectedIsFrench: true, given: '' })}
      />
    </>
  )
}

export function Dictation({ exercise: e, onAnswer, verdict }: Props<DictationExercise>) {
  const { speaker } = useApp()
  const opts = useCheckOptions()
  useEffect(() => {
    void speaker.speak(e.audio)
    return () => speaker.cancel()
  }, [e.audio, speaker])
  return (
    <>
      <Kicker>Listen and Write What You Hear</Kicker>
      <div className="flex items-center gap-3 py-2">
        <AudioButton text={e.audio} size="xl" tone="fill" />
        <AudioButton text={e.audio} size="md" tone="wash" rate="slow" label="Play slowly" />
        <span className="text-[13px] text-ink-2">Slower</span>
      </div>
      <TypedAnswer
        verdict={verdict}
        hintAnswer={e.audio}
        onSubmit={(text, usedHint) => {
          const r = checkAnswer(text, e.answers, opts)
          onAnswer({ ...r, expected: e.audio, expectedIsFrench: true, detail: e.translation, skill: 'listening', given: text, hinted: usedHint })
        }}
        onSkip={() => onAnswer({ result: 'wrong', skill: 'listening', expected: e.audio, expectedIsFrench: true, detail: e.translation, given: '' })}
      />
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Sentence building                                                   */
/* ------------------------------------------------------------------ */

export function Build({ exercise: e, onAnswer, verdict }: Props<BuildExercise>) {
  const tiles = useMemo(() => shuffle([...e.answer, ...e.distractors].map((text, i) => ({ text, key: i }))), [e])
  const [chosen, setChosen] = useState<number[]>([])
  const used = new Set(chosen)
  const locked = !!verdict
  const check = () => {
    const words = chosen.map((k) => tiles.find((t) => t.key === k)!.text)
    const correct = words.length === e.answer.length && words.every((w, i) => w === e.answer[i])
    let errorType: ErrorType | undefined
    if (!correct) {
      const same = [...words].sort().join('|') === [...e.answer].sort().join('|')
      errorType = same ? 'word-order' : words.length < e.answer.length ? 'missing-word' : 'wrong-word'
    }
    onAnswer({ result: correct ? 'correct' : 'wrong', skill: 'recall', expected: e.answer.join(' '), expectedIsFrench: true, given: words.join(' '), errorType })
  }
  return (
    <>
      <Kicker>Build the Sentence</Kicker>
      <EnglishPrompt>{e.prompt}</EnglishPrompt>
      <div className="mt-2 flex min-h-[72px] flex-wrap content-start gap-2 border-b-[1.5px] border-ink pb-3" aria-label="Your sentence">
        {chosen.map((k) => (
          <button
            key={k}
            type="button"
            disabled={locked}
            onClick={() => setChosen(chosen.filter((c) => c !== k))}
            className="target h-12 rounded-xl bg-btn px-3.5 text-[22px] text-onbtn"
          >
            {tiles.find((x) => x.key === k)!.text}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {tiles.map((t) => (
          <button
            key={t.key}
            type="button"
            disabled={locked || used.has(t.key)}
            onClick={() => setChosen([...chosen, t.key])}
            className={`target h-12 rounded-xl border px-3.5 text-[22px] ${used.has(t.key) ? 'border-dashed border-line text-transparent' : 'border-line bg-raised hover:border-ink'}`}
          >
            {t.text}
          </button>
        ))}
      </div>
      {!locked && (
        <Actions>
          {chosen.length > 0 && (
            <button type="button" onClick={() => setChosen([])} className="px-[18px] py-4 text-[15px] text-ink-2 hover:text-ink">
              Clear
            </button>
          )}
          <ActionButton onClick={check} disabled={!chosen.length}>
            Check
          </ActionButton>
        </Actions>
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
  onError,
  disabled,
  size = 'md',
}: {
  onResult: (transcripts: string[]) => void
  onInterim?: (text: string) => void
  /** Called when listening fails, so the exercise can offer another way on. */
  onError?: (code: string) => void
  disabled?: boolean
  size?: 'md' | 'xl'
}) {
  const { pack, speaker } = useApp()
  const [active, setActive] = useState(false)
  const [error, setError] = useState<string>()
  const [level, setLevel] = useState(0)
  const stopRef = useRef<() => void>(undefined)
  const start = async () => {
    if (active) {
      stopRef.current?.()
      return
    }
    speaker.cancel()
    setError(undefined)
    setActive(true)
    // The level bar shows whether any sound is reaching the browser at all.
    const meter = await startLevelMeter(setLevel)
    const { result, stop } = listenOnce(pack.locale, onInterim)
    stopRef.current = stop
    try {
      onResult((await result).transcripts)
    } catch (err) {
      const code = err instanceof RecognitionError ? err.code : 'unknown'
      let message = err instanceof RecognitionError ? err.message : 'Speech recognition failed.'
      if (code === 'no-speech' && meter)
        message =
          meter.peak() < SILENT_PEAK
            ? "Your microphone isn't picking up any sound. Check the right microphone is selected for this browser (see Settings, Test Microphone), then try again."
            : "I heard sound but couldn't make out the words. Start speaking straight after tapping, a little closer to the microphone."
      setError(message)
      onError?.(code)
    } finally {
      meter?.stop()
      setLevel(0)
      setActive(false)
    }
  }
  const dims = size === 'xl' ? 'h-[72px] w-[72px]' : 'h-[52px] w-[52px]'
  return (
    <span className="relative inline-flex flex-col items-start">
      <button
        type="button"
        onClick={start}
        disabled={disabled}
        aria-label={active ? 'Stop listening' : 'Speak'}
        aria-pressed={active}
        className={`${dims} inline-flex shrink-0 items-center justify-center rounded-full transition-colors disabled:opacity-30 ${
          active ? 'listening-pulse bg-fill text-feedback-on' : size === 'xl' ? 'bg-btn text-onbtn' : 'border-[1.5px] border-line hover:border-ink'
        }`}
      >
        <MicIcon size={size === 'xl' ? 30 : 22} />
      </button>
      {active && (
        <span className="mt-2 block h-1.5 w-[72px] overflow-hidden rounded-full bg-wash" role="meter" aria-label="Microphone level" aria-valuenow={Math.round(level * 100)}>
          <span className="block h-full rounded-full bg-fill transition-[width] duration-75" style={{ width: `${Math.round(level * 100)}%` }} />
        </span>
      )}
      {error && <span className="mt-2 max-w-[40ch] text-[14px] text-accent">{error}</span>}
    </span>
  )
}

export function Speak({ exercise: e, onAnswer, verdict }: Props<SpeakExercise>) {
  const { settings } = useApp()
  const target = fillName(e.target, settings.learnerName)
  const native = fillName(e.native, settings.learnerName)
  const canListen = recognitionSupported() && settings.speechInput
  const [heard, setHeard] = useState<{ text: string; score: number; missing: string[] }>()
  const [interim, setInterim] = useState('')
  const [tries, setTries] = useState(0)
  const [micFailed, setMicFailed] = useState(false)
  const best = useRef(0)

  const finish = (score: number) =>
    onAnswer({
      result: score >= 0.8 ? 'correct' : score >= 0.5 ? 'near' : 'wrong',
      skill: 'speaking',
      expected: target,
      expectedIsFrench: true,
      detail: score < 0.8 ? 'Recognition is strict with short phrases. Listen again and keep practising aloud.' : undefined,
    })

  const onResult = (transcripts: string[]) => {
    setInterim('')
    const top = transcripts.map((t) => ({ text: t, ...compareSpoken(t, target) })).sort((a, b) => b.score - a.score)[0]
    best.current = Math.max(best.current, top.score)
    setHeard(top)
    setTries((n) => n + 1)
    if (top.score >= 0.8) finish(top.score)
  }

  return (
    <>
      <Kicker>Say It Aloud</Kicker>
      <div className="flex items-start gap-[18px] pt-2">
        <AudioButton text={target} size="lg" />
        <div>
          <div className="target text-[clamp(34px,4.4cqi,44px)] leading-[1.1]">{target}</div>
          <div className="pt-1 text-[15px] text-ink-2">{native}</div>
        </div>
      </div>
      {canListen ? (
        <div className="flex flex-col gap-4 pt-4">
          <div className="flex items-center gap-4">
            <MicButton onResult={onResult} onInterim={setInterim} onError={() => setMicFailed(true)} disabled={!!verdict} size="xl" />
            <span className="text-[15px] text-ink-2">
              {interim ? <span className="target text-[22px] text-ink">{interim}</span> : tries ? 'Tap to try again.' : 'Tap the microphone, then speak.'}
            </span>
          </div>
          {heard && !verdict && (
            <div className="rounded-3xl border border-line bg-raised p-5">
              <div className="text-[13px] text-ink-2">I Heard</div>
              <div className="target text-[24px]">{heard.text}</div>
              {heard.missing.length > 0 && (
                <div className="pt-2 text-[14px] text-ink-2">
                  Listen for <span className="target text-[18px] text-ink">{heard.missing.join(', ')}</span>
                </div>
              )}
            </div>
          )}
          {tries > 0 && !verdict && (
            <Actions>
              <ActionButton onClick={() => finish(best.current)}>Move On</ActionButton>
            </Actions>
          )}
          {tries === 0 && micFailed && !verdict && (
            <Actions>
              <Button variant="outline" className="py-[15px]" onClick={() => onAnswer({ result: 'near', skill: 'speaking', selfAssessed: true, expected: target, expectedIsFrench: true })}>
                I Stumbled
              </Button>
              <ActionButton onClick={() => onAnswer({ result: 'correct', skill: 'speaking', selfAssessed: true, expected: target, expectedIsFrench: true })}>
                I Said It Comfortably
              </ActionButton>
            </Actions>
          )}
        </div>
      ) : (
        !verdict && (
          <>
            <p className="m-0 max-w-[56ch] text-[15px] text-ink-2">
              {recognitionSupported() ? 'Speech input is off in Settings.' : "This browser can't check speech."} Listen, say it aloud a few times, then rate
              yourself honestly.
            </p>
            <Actions>
              <Button variant="outline" className="py-[15px]" onClick={() => onAnswer({ result: 'near', skill: 'speaking', selfAssessed: true, expected: target, expectedIsFrench: true })}>
                I Stumbled
              </Button>
              <ActionButton onClick={() => onAnswer({ result: 'correct', skill: 'speaking', selfAssessed: true, expected: target, expectedIsFrench: true })}>
                I Said It Comfortably
              </ActionButton>
            </Actions>
          </>
        )
      )}
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Free response                                                       */
/* ------------------------------------------------------------------ */

export function Respond({ exercise: e, onAnswer, verdict }: Props<RespondExercise>) {
  const { settings } = useApp()
  const opts = useCheckOptions()
  const [value, setValue] = useState('')
  const ref = useRef<HTMLInputElement>(null)
  const formId = useId()
  const canListen = recognitionSupported() && settings.speechInput
  const models = e.answers.map((a) => fillName(a, settings.learnerName))
  const [hinted, setHinted] = useState(false)

  const submit = () => {
    if (verdict || !value.trim()) return
    if (e.slots) {
      const r = checkSlots(value, e.slots)
      const near = r.nearMisses.length === r.missing.length && r.missing.length > 0
      onAnswer({
        result: r.ok ? 'correct' : near ? 'near' : 'wrong',
        skill: 'recall',
        expected: models[0],
        expectedIsFrench: true,
        given: value,
        errorType: r.ok ? undefined : near ? 'typo' : 'missing-word',
        detail: r.ok ? undefined : `Your answer needed to ${r.missing.join(' and ')}.`,
        hinted,
      })
    } else {
      const r = checkAnswer(value, models, opts)
      onAnswer({ ...r, expectedIsFrench: true, skill: 'recall', given: value, hinted })
    }
  }

  return (
    <>
      <Kicker>Respond in French</Kicker>
      <div className="text-[clamp(22px,2.8cqi,28px)] leading-[1.25] font-medium tracking-[-0.01em] text-pretty">{e.situation}</div>
      {e.partner && <Bubble who={e.partner.speaker} fr={e.partner.target} en={e.partner.native} audio />}
      <form
        id={formId}
        className="flex flex-col gap-4"
        onSubmit={(ev) => {
          ev.preventDefault()
          submit()
        }}
      >
        <FrenchInput value={value} onChange={setValue} inputRef={ref} locked={!!verdict} tone={verdict?.result} placeholder={canListen ? 'Type or speak' : 'Type in French'} />
        {!verdict && <AccentKeys inputRef={ref} value={value} onChange={setValue} />}
        {!verdict && models[0] && <HintBar answer={models[0]} value={value} onChange={setValue} onUse={() => setHinted(true)} />}
      </form>
      {!verdict && (
        <Actions>
          {canListen && <MicButton onResult={(t) => setValue(t[0])} onInterim={setValue} />}
          <ActionButton type="submit" form={formId} disabled={!value.trim()}>
            Check
          </ActionButton>
        </Actions>
      )}
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Unscored steps                                                      */
/* ------------------------------------------------------------------ */

function ContinueAction({ onClick }: { onClick: () => void }) {
  return (
    <Actions>
      <ActionButton onClick={onClick}>Continue</ActionButton>
    </Actions>
  )
}

export function DialogueView({ lesson, onDone }: { lesson: Lesson; onDone: () => void }) {
  const { speaker, settings } = useApp()
  const d = lesson.dialogue!
  const [showAll, setShowAll] = useState<'on' | 'off'>(settings.showTranslations ? 'on' : 'off')
  const [current, setCurrent] = useState<number | null>(null)
  const playing = useRef(false)
  const first = Object.keys(d.speakers)[0]

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
      const sp = d.speakers[d.lines[i].speaker]
      setCurrent(i)
      await speaker.speak(d.lines[i].target, { voice: sp.voice, pitch: sp.pitch, rate, who: sp.name })
      await new Promise((r) => setTimeout(r, 350))
    }
    playing.current = false
    setCurrent(null)
  }

  return (
    <>
      <Kicker>Listen First</Kicker>
      <h2 className="target m-0 text-[clamp(40px,5cqi,52px)] leading-none">{d.title}</h2>
      <p className="m-0 max-w-[60ch] text-[16px] leading-normal text-ink-2">{d.setting}</p>
      <div className="flex flex-wrap items-center gap-2.5">
        <Button variant="ink" onClick={() => playAll()}>
          {current !== null ? 'Stop' : 'Play Conversation'}
        </Button>
        <Button variant="outline" onClick={() => playAll('slow')} disabled={current !== null}>
          Slower
        </Button>
        <Segmented
          label="Translations"
          size="sm"
          value={showAll}
          onChange={setShowAll}
          options={[
            { value: 'off', label: 'French Only' },
            { value: 'on', label: 'With English' },
          ]}
        />
      </div>
      <ol className="m-0 flex list-none flex-col gap-3.5 p-0 pt-2">
        {d.lines.map((line, i) => {
          const sp = d.speakers[line.speaker]
          const mine = line.speaker !== first
          return (
            <li key={i} className={`flex flex-col gap-1.5 ${mine ? 'items-end' : 'items-start'}`}>
              <span className="text-[12px] text-ink-3">{sp.name}</span>
              <button
                type="button"
                onClick={() => speaker.speak(line.target, { voice: sp.voice, pitch: sp.pitch, who: sp.name })}
                className={`max-w-[min(88%,480px)] rounded-[22px] px-[18px] py-3.5 text-left transition-colors ${
                  current === i ? 'bg-fill text-feedback-on' : 'border border-line bg-raised hover:border-ink'
                }`}
              >
                <span className="target block text-[22px] leading-[1.25]">{line.target}</span>
                {showAll === 'on' && <span className="block pt-0.5 text-[13px] opacity-75">{line.native}</span>}
              </button>
            </li>
          )
        })}
      </ol>
      <p className="m-0 text-[13px] text-ink-3">Tap a line to hear it again.</p>
      <ContinueAction onClick={onDone} />
    </>
  )
}

export function PresentView({ itemIds, onDone }: { itemIds: string[]; onDone: () => void }) {
  const { pack } = useApp()
  const { items } = indexPack(pack)
  const list = itemIds.map((id) => items.get(id)).filter((i): i is LearningItem => !!i)
  return (
    <>
      <Kicker>New Words and Phrases</Kicker>
      <ul className="m-0 flex list-none flex-col border-t border-line p-0">
        {list.map((item) => (
          <li key={item.id} className="flex items-start gap-4 border-b border-line py-4">
            <AudioButton text={expandVariants(item.target)[0]} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="target text-[30px] leading-[1.1]">{item.target}</span>
                {item.register && <Pill>{item.register === 'formal' ? 'Formal' : 'Informal'}</Pill>}
              </div>
              <div className="text-[17px]">{item.native}</div>
              {item.note && <div className="max-w-[60ch] pt-1 text-[14px] leading-normal text-ink-2">{item.note}</div>}
            </div>
          </li>
        ))}
      </ul>
      <ContinueAction onClick={onDone} />
    </>
  )
}

export function NoteView({ lesson, noteId, onDone }: { lesson: Lesson; noteId: string; onDone: () => void }) {
  const note = lesson.notes.find((n) => n.id === noteId)
  if (!note) return <ContinueAction onClick={onDone} />
  return (
    <>
      <Kicker>How It Works</Kicker>
      <h2 className="m-0 text-[clamp(28px,3.6cqi,36px)] leading-[1.15] font-semibold tracking-[-0.015em]">{note.title}</h2>
      <div className="flex max-w-[64ch] flex-col gap-3 text-[17px] leading-relaxed">
        {note.body.map((p, i) => (
          <p key={i} className="m-0">
            <Rich text={p} />
          </p>
        ))}
      </div>
      {note.table && (
        <table className="w-full border-collapse text-left">
          {note.table.caption && <caption className="pb-2 text-left text-[13px] text-ink-2">{note.table.caption}</caption>}
          <tbody>
            {note.table.rows.map((row, i) => (
              <tr key={i} className="border-b border-line">
                {row.map((cell, j) => (
                  <td key={j} className={`py-2.5 pr-4 ${i === 0 && note.table!.header ? 'text-[13px] font-semibold text-ink-2' : 'target text-[22px]'}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <ContinueAction onClick={onDone} />
    </>
  )
}
