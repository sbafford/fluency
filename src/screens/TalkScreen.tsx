import { useEffect, useRef, useState } from 'react'
import { expandVariants, normalise } from '../engine/answers'
import { completeConversation } from '../engine/progress'
import type { ConversationTurn } from '../engine/types'
import { recognitionSupported } from '../speech/recognition'
import { useApp } from '../state/app'
import { fillName, scriptedTutor, type TutorFeedback } from '../tutor/provider'
import { Bubble, MicButton } from '../ui/exercises'
import { ActionButton, Actions, FocusFrame } from '../ui/Focus'
import { AccentKeys, LinkButton, Segmented } from '../ui/kit'

type LearnerTurn = Extract<ConversationTurn, { kind: 'learner' }>

interface Message {
  from: 'partner' | 'you'
  target: string
  native?: string
  feedback?: TutorFeedback
  modelUsed?: boolean
  /** What the reply achieved, shown as ticks under it. */
  slots?: string[]
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
  const [showNative, setShowNative] = useState<'on' | 'off'>(settings.showTranslations ? 'on' : 'off')
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
      <FocusFrame kind="Conversation" title="Not Found" closeHref="#/practise">
        <p className="m-0 text-[17px]">This conversation doesn't exist.</p>
        <div>
          <LinkButton href="#/practise">Back to Practise</LinkButton>
        </div>
      </FocusFrame>
    )
  }

  const turn = convo.turns[turnIndex] as LearnerTurn | undefined
  const learnerTurn = turn?.kind === 'learner' ? turn : undefined

  const advance = (text: string, fb: TutorFeedback | undefined, modelUsed: boolean) => {
    const slots = learnerTurn && !modelUsed ? learnerTurn.slots.map((sl) => sl.label) : undefined
    setMessages((m) => [...m, { from: 'you', target: text, feedback: fb, modelUsed, slots }])
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

  const turnsDone = messages.filter((m) => m.from === 'you').length

  return (
    <FocusFrame
      kind="Conversation"
      title={convo.title}
      count={`${Math.min(turnsDone + 1, learnerTurns)}/${learnerTurns}`}
      progress={done ? 1 : turnsDone / learnerTurns}
      closeHref="#/practise"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="m-0 max-w-[52ch] text-[15px] leading-normal text-ink-2">
          {convo.setting} {convo.register === 'formal' ? 'Formal' : 'Informal'}: use{' '}
          <em className="target text-[18px]">{convo.register === 'formal' ? 'vous' : 'tu'}</em>.
        </p>
        <Segmented
          label="Translations"
          size="sm"
          value={showNative}
          onChange={setShowNative}
          options={[
            { value: 'off', label: 'French' },
            { value: 'on', label: '+ English' },
          ]}
        />
      </div>

      <ol className="m-0 flex list-none flex-col gap-3.5 p-0" aria-live="polite">
        {messages.map((m, i) => (
          <li key={i} className={`flex flex-col gap-1.5 ${m.from === 'you' ? 'items-end' : 'items-start'}`}>
            {m.from === 'partner' ? (
              <Bubble who={convo.partner.name} fr={m.target} en={showNative === 'on' ? m.native : undefined} audio />
            ) : (
              <Bubble who="You" fr={m.target} mine />
            )}
            {m.slots && m.slots.length > 0 && (
              <div className="flex flex-wrap justify-end gap-1.5">
                {m.slots.map((sl) => (
                  <span key={sl} className="rounded-full bg-wash px-[9px] py-[3px] text-[12px] text-ink-2">
                    ✓ {sl}
                  </span>
                ))}
              </div>
            )}
            {m.feedback?.register && <span className="text-[13px] text-accent">{m.feedback.register}</span>}
            {m.feedback?.ok && normalise(m.target) !== normalise(m.feedback.model) && (
              <span className="max-w-[88%] text-right text-[13px] text-ink-2">
                Also natural: <span className="target text-[16px] text-ink">{m.feedback.model}</span>
              </span>
            )}
            {m.modelUsed && <span className="text-[12px] text-ink-3">Model Answer</span>}
          </li>
        ))}
      </ol>

      {learnerTurn && (
        <div className="mt-2 flex flex-col gap-1 rounded-[18px] border-[1.5px] border-dashed border-line px-[18px] py-4">
          <span className="text-[12px] font-semibold tracking-[0.06em] text-accent uppercase">Your Turn</span>
          <span className="text-[17px] font-medium">{learnerTurn.goal}</span>
          {feedback && <span className="text-[15px] font-semibold text-accent">{feedback.message}</span>}
          {feedback?.register && <span className="text-[14px] text-ink-2">{feedback.register}</span>}
          {(feedback || hint) && learnerTurn.tip && <span className="text-[14px] text-ink-2">{learnerTurn.tip}</span>}
          {hint && (
            <span className="text-[14px] text-ink-2">
              Try using{' '}
              {learnerTurn.slots.map((sl, i) => (
                <span key={sl.label}>
                  {i > 0 && ', '}
                  <span className="target text-[18px] text-ink">{expandVariants(sl.any[0])[0]}</span>
                </span>
              ))}
            </span>
          )}
          <div className="flex flex-wrap gap-4 pt-1.5 text-[14px] font-semibold text-accent">
            {!hint && (
              <button type="button" onClick={() => setHint(true)}>
                Hint
              </button>
            )}
            {attempt >= 1 && (
              <button type="button" onClick={useModel}>
                Show a Model Answer
              </button>
            )}
          </div>
          <div className="pt-2">
            <AccentKeys inputRef={inputRef} value={value} onChange={setValue} />
          </div>
        </div>
      )}

      {done && (
        <div className="mt-2 flex flex-col gap-1 rounded-[18px] border-[1.5px] border-dashed border-line px-[18px] py-4">
          <span className="text-[12px] font-semibold tracking-[0.06em] text-accent uppercase">Conversation Complete</span>
          <span className="text-[17px] font-medium">
            {firstTry} of {learnerTurns} replies landed first time.
          </span>
          <span className="text-[14px] text-ink-2">Saved to your progress. Try it again tomorrow without the hints, and vary what you say.</span>
        </div>
      )}
      <div ref={endRef} />

      <Actions>
        {learnerTurn ? (
          <>
            {canListen && (
              <MicButton
                onResult={(t) => {
                  usedMic.current = true
                  setValue(t[0])
                }}
                onInterim={setValue}
              />
            )}
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  void submit()
                }
              }}
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
              lang={pack.locale}
              placeholder="Reply in French"
              aria-label="Your reply"
              className="target min-h-[52px] min-w-0 flex-1 rounded-full border-[1.5px] border-line bg-raised px-5 text-[21px] outline-none placeholder:text-ink-3 focus:border-ink"
            />
            <ActionButton grow={false} onClick={() => void submit()} disabled={!value.trim()}>
              Send
            </ActionButton>
          </>
        ) : done ? (
          <>
            <button type="button" onClick={restart} className="px-[18px] py-4 text-[15px] whitespace-nowrap text-ink-2 hover:text-ink">
              Start Again
            </button>
            <ActionButton onClick={() => (window.location.hash = '#/practise')}>Finish</ActionButton>
          </>
        ) : null}
      </Actions>
    </FocusFrame>
  )
}
