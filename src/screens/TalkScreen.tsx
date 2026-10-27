import { useEffect, useRef, useState } from 'react'
import { expandVariants, normalise } from '../engine/answers'
import { completeConversation } from '../engine/progress'
import type { ConversationTurn } from '../engine/types'
import { recognitionSupported } from '../speech/recognition'
import { useApp } from '../state/app'
import { fillName, scriptedTutor, type TutorFeedback } from '../tutor/provider'
import { MicButton } from '../ui/exercises'
import { BackIcon, SendIcon } from '../ui/icons'
import { AccentBar, AudioButton, Button, LinkButton } from '../ui/kit'

type LearnerTurn = Extract<ConversationTurn, { kind: 'learner' }>

interface Message {
  from: 'partner' | 'you'
  target: string
  native?: string
  feedback?: TutorFeedback
  modelUsed?: boolean
}

export function TalkScreen({ id }: { id: string }) {
  const { pack, settings, speaker, record, updateProgress } = useApp()
  const convo = pack.conversations.find((c) => c.id === id)
  const tutor = scriptedTutor
  const [messages, setMessages] = useState<Message[]>([])
  const [turnIndex, setTurnIndex] = useState(0)
  const [value, setValue] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [feedback, setFeedback] = useState<TutorFeedback>()
  const [hint, setHint] = useState(false)
  const [firstTry, setFirstTry] = useState(0)
  const [done, setDone] = useState(false)
  const [showNative, setShowNative] = useState(settings.showTranslations)
  const usedMic = useRef(false)
  // Guards against processing the same partner turn twice (React may re-run effects in development).
  const processed = useRef(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const canListen = recognitionSupported() && settings.speechInput

  // Play partner turns automatically until it's the learner's turn.
  useEffect(() => {
    if (!convo || processed.current === turnIndex) return
    processed.current = turnIndex
    const turn = convo.turns[turnIndex]
    if (!turn) {
      if (!done) {
        const learnerTurns = convo.turns.filter((t) => t.kind === 'learner').length
        updateProgress((p) => completeConversation(p, convo.id, firstTry / learnerTurns, Date.now()))
        setDone(true)
      }
      return
    }
    if (turn.kind === 'partner') {
      setMessages((m) => [...m, { from: 'partner', target: turn.target, native: turn.native }])
      void speaker.speak(turn.target, { voice: convo.partner.voice, pitch: convo.partner.pitch })
      setTurnIndex((i) => i + 1)
    }
  }, [turnIndex, convo, speaker, done, firstTry, updateProgress])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, feedback, done])

  useEffect(() => () => speaker.cancel(), [speaker])

  if (!convo) {
    return (
      <div className="mx-auto max-w-[720px] px-5 py-16">
        <p className="mb-4">This conversation doesn't exist.</p>
        <LinkButton href="#/practise">Back to practice</LinkButton>
      </div>
    )
  }

  const turn = convo.turns[turnIndex] as LearnerTurn | undefined
  const learnerTurn = turn?.kind === 'learner' ? turn : undefined

  const advance = (text: string, fb: TutorFeedback | undefined, modelUsed: boolean) => {
    setMessages((m) => [...m, { from: 'you', target: text, feedback: fb, modelUsed }])
    setFeedback(undefined)
    setValue('')
    setAttempt(0)
    setHint(false)
    usedMic.current = false
    setTurnIndex((i) => i + 1)
  }

  const submit = async () => {
    if (!learnerTurn || !value.trim()) return
    const fb = await tutor.evaluate({ conversation: convo, turn: learnerTurn, response: value, learnerName: settings.learnerName, attempt })
    record({
      itemIds: [],
      skill: usedMic.current ? 'speaking' : 'recall',
      result: fb.ok ? 'correct' : 'wrong',
      errorType: fb.ok ? undefined : fb.nearly.length ? 'typo' : 'missing-word',
    })
    if (fb.ok) {
      if (attempt === 0) setFirstTry((n) => n + 1)
      advance(value.trim(), fb, false)
    } else {
      setFeedback(fb)
      setAttempt((a) => a + 1)
    }
  }

  const useModel = () => {
    if (!learnerTurn) return
    advance(fillName(learnerTurn.models[0], settings.learnerName), undefined, true)
  }

  const learnerTurns = convo.turns.filter((t) => t.kind === 'learner').length

  const restart = () => {
    processed.current = -1
    setMessages([])
    setFeedback(undefined)
    setValue('')
    setAttempt(0)
    setHint(false)
    setFirstTry(0)
    setDone(false)
    setTurnIndex(0)
    window.scrollTo(0, 0)
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-[720px] flex-col px-5 pt-[max(1rem,env(safe-area-inset-top))]">
      <a href="#/practise" className="-ml-2 mb-4 inline-flex items-center gap-2 self-start rounded-full p-2 text-[15px] text-ink-2 hover:text-ink">
        <BackIcon size={20} /> Practise
      </a>
      <h1 className="mb-1 text-[30px] font-semibold leading-tight tracking-[-0.02em]">{convo.title}</h1>
      <p className="mb-1 text-ink-2">{convo.setting}</p>
      <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] text-ink-2">
        <span>
          You're talking with {convo.partner.name}. Use <span className="target text-[16px] text-ink">{convo.register === 'formal' ? 'vous' : 'tu'}</span>.
        </span>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={showNative} onChange={(e) => setShowNative(e.target.checked)} className="h-4 w-4 accent-[var(--accent)]" />
          Translations
        </label>
      </div>

      <ol className="flex-1 space-y-4 pb-6" aria-live="polite">
        {messages.map((m, i) => (
          <li key={i} className={`flex ${m.from === 'you' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${m.from === 'you' ? 'text-right' : ''}`}>
              <div
                className={`inline-flex items-start gap-3 rounded-3xl px-4 py-3 text-left ${
                  m.from === 'you' ? 'rounded-br-lg bg-ink text-paper' : 'rounded-bl-lg bg-wash'
                }`}
              >
                {m.from === 'partner' && <AudioButton text={m.target} voice={convo.partner.voice} pitch={convo.partner.pitch} size="sm" />}
                <div>
                  <p className="target text-[21px] leading-snug">{m.target}</p>
                  {m.from === 'partner' && showNative && <p className="text-[14px] text-ink-2">{m.native}</p>}
                </div>
              </div>
              {m.feedback?.register && <p className="mt-1 text-[13.5px] text-near">{m.feedback.register}</p>}
              {m.feedback?.ok && normalise(m.target) !== normalise(m.feedback.model) && (
                <p className="mt-1 text-[13.5px] text-ink-2">
                  Also natural: <span className="target text-[15.5px]">{m.feedback.model}</span>
                </p>
              )}
              {m.modelUsed && <p className="mt-1 text-[13.5px] text-ink-3">Model answer</p>}
            </div>
          </li>
        ))}
      </ol>

      {learnerTurn && (
        <div className="sticky bottom-0 -mx-5 border-t border-line bg-paper px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <p className="mb-1 text-[13px] text-ink-3">Your turn</p>
          <p className="mb-3 text-[18px] font-medium leading-snug">{learnerTurn.goal}</p>
          {feedback && (
            <div className="mb-3 rounded-2xl bg-bad-wash p-3 text-[15px]">
              <p className="font-medium text-bad">{feedback.message}</p>
              {feedback.register && <p className="mt-1 text-ink-2">{feedback.register}</p>}
              {learnerTurn.tip && <p className="mt-1 text-ink-2">{learnerTurn.tip}</p>}
            </div>
          )}
          {hint && (
            <p className="mb-3 text-[15px] text-ink-2">
              Try using:{' '}
              {learnerTurn.slots.map((s, i) => (
                <span key={s.label}>
                  {i > 0 && ', '}
                  <span className="target text-[18px] text-ink">{expandVariants(s.any[0])[0]}</span>
                </span>
              ))}
            </p>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void submit()
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
              placeholder={canListen ? 'Type or speak' : 'Type in French'}
              aria-label="Your reply"
              className="target min-h-14 w-full rounded-2xl border-[1.5px] border-line bg-raised px-4 text-[21px] outline-none placeholder:font-sans placeholder:text-[16px] placeholder:text-ink-3 focus:border-ink"
            />
            {canListen && (
              <MicButton
                onResult={(t) => {
                  usedMic.current = true
                  setValue(t[0])
                }}
                onInterim={setValue}
              />
            )}
            <button
              type="submit"
              disabled={!value.trim()}
              aria-label="Send"
              className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ink text-paper disabled:opacity-30"
            >
              <SendIcon size={22} />
            </button>
          </form>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <AccentBar inputRef={inputRef} value={value} onChange={setValue} />
            <div className="flex gap-1">
              {!hint && (
                <Button variant="quiet" className="min-h-10 px-3" onClick={() => setHint(true)}>
                  Hint
                </Button>
              )}
              {attempt >= 1 && (
                <Button variant="quiet" className="min-h-10 px-3" onClick={useModel}>
                  Show a model answer
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {done && (
        <div className="border-t border-line py-6">
          <p className="text-[19px] font-semibold">
            Conversation complete. {firstTry} of {learnerTurns} replies landed first time.
          </p>
          <p className="mb-4 text-ink-2">Try it again later and vary what you say. Changing the details is good practice.</p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={restart}>Start again</Button>
            <LinkButton href="#/practise" variant="secondary">
              Done
            </LinkButton>
          </div>
        </div>
      )}
      <div ref={endRef} />
    </div>
  )
}
