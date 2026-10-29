import { useEffect, useRef, useState } from 'react'
import { checkAnswer } from '../engine/answers'
import { completeListening } from '../engine/progress'
import { useApp } from '../state/app'
import { ActionButton, Actions, FocusFrame } from '../ui/Focus'
import { LinkButton, Segmented } from '../ui/kit'

type Speed = 'slow' | 'normal'

export function ListeningScreen({ id }: { id: string }) {
  const { pack, speaker, record, updateProgress, progress } = useApp()
  const piece = pack.listening.find((l) => l.id === id)
  const [rate, setRate] = useState<Speed>('normal')
  const [current, setCurrent] = useState<number | null>(null)
  const [heardTo, setHeardTo] = useState(0)
  const [transcript, setTranscript] = useState(false)
  const [q, setQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, { given: string; ok: boolean }>>({})
  const [typed, setTyped] = useState('')
  const [finished, setFinished] = useState(false)
  const playing = useRef(false)

  useEffect(() => () => speaker.cancel(), [speaker])

  if (!piece) {
    return (
      <FocusFrame kind="Listening" title="Not Found" closeHref="#/practise">
        <p className="m-0 text-[17px]">This listening exercise doesn't exist.</p>
        <div>
          <LinkButton href="#/practise">Back to Practise</LinkButton>
        </div>
      </FocusFrame>
    )
  }

  const total = piece.lines.length
  const play = async () => {
    if (playing.current) {
      playing.current = false
      speaker.cancel()
      setCurrent(null)
      return
    }
    playing.current = true
    for (let i = 0; i < total && playing.current; i++) {
      const line = piece.lines[i]
      const sp = piece.speakers[line.speaker]
      setCurrent(i)
      setHeardTo((h) => Math.max(h, i + 1))
      await speaker.speak(line.target, { voice: sp.voice, pitch: sp.pitch, rate })
      await new Promise((r) => setTimeout(r, rate === 'normal' ? 250 : 450))
    }
    playing.current = false
    setCurrent(null)
  }

  const question = piece.questions[q]
  const answered = question ? answers[question.id] : undefined
  const answeredCount = Object.keys(answers).length
  const isLast = q === piece.questions.length - 1

  const answer = (given: string) => {
    if (!question || answered) return
    const ok = question.options
      ? question.answers.includes(given)
      : checkAnswer(given, question.answers, { lang: question.answerLang }).result !== 'wrong'
    setAnswers((a) => ({ ...a, [question.id]: { given, ok } }))
    record({ itemIds: [], skill: 'listening', result: ok ? 'correct' : 'wrong', errorType: ok ? undefined : 'meaning' })
  }

  const finish = () => {
    const score = Object.values(answers).filter((a) => a.ok).length / piece.questions.length
    updateProgress((p) => completeListening(p, piece.id, score, Date.now()))
    setFinished(true)
  }

  const short = question?.options?.every((o) => o.length <= 6)
  const right = Object.values(answers).filter((a) => a.ok).length
  const best = progress.listening[piece.id]?.bestScore

  return (
    <FocusFrame
      kind="Listening"
      title={piece.title}
      count={finished ? '' : `${Math.min(q + 1, piece.questions.length)}/${piece.questions.length}`}
      progress={finished ? 1 : answeredCount / piece.questions.length}
      closeHref="#/practise"
    >
      <p className="m-0 text-[16px] leading-normal text-ink-2">
        {piece.setting}
        {best !== undefined && ` Best so far: ${Math.round(best * 100)}%.`}
      </p>

      <div className="flex flex-col gap-[18px] rounded-[28px] border border-line bg-raised p-6">
        <div className="flex items-center gap-[18px]">
          <button
            type="button"
            onClick={play}
            aria-label={current !== null ? 'Pause' : 'Play'}
            className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-full bg-fill text-feedback-on hover:opacity-90"
          >
            {current !== null ? (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
              </svg>
            )}
          </button>
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-1.5 rounded-[9px] bg-wash">
              <div className="h-full rounded-[9px] bg-ink transition-[width] duration-300" style={{ width: `${((current !== null ? current + 1 : heardTo) / total) * 100}%` }} />
            </div>
            <div className="flex justify-between text-[13px] text-ink-2">
              <span>{current !== null ? `Line ${current + 1}` : heardTo ? 'Play Again' : 'Ready'}</span>
              <span>{total} Lines</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <Segmented
            label="Speed"
            size="sm"
            value={rate}
            onChange={setRate}
            options={[
              { value: 'slow', label: '0.75×' },
              { value: 'normal', label: '1×' },
            ]}
          />
          <button type="button" onClick={() => setTranscript(!transcript)} aria-expanded={transcript} className="py-2.5 text-[14px] font-semibold text-accent">
            {transcript ? 'Hide Transcript' : 'Show Transcript'}
          </button>
        </div>
        {transcript && (
          <div className="flex flex-col gap-3 border-t border-line pt-4">
            {piece.lines.map((ln, i) => (
              <div key={i} className={`rounded-xl ${current === i ? 'bg-wash' : ''}`}>
                <div className="text-[12px] text-ink-3">{piece.speakers[ln.speaker].name}</div>
                <div className="target text-[22px] leading-[1.25]">{ln.target}</div>
                <div className="text-[14px] text-ink-2">{ln.native}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!finished && question && (
        <div className="flex flex-col gap-3">
          <div className="text-[13px] text-ink-2">
            Question {q + 1} of {piece.questions.length}
          </div>
          <div className="text-[22px] font-medium">{question.question}</div>
          {question.options ? (
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: short ? `repeat(${Math.min(4, question.options.length)},minmax(0,1fr))` : 'repeat(auto-fit,minmax(min(100%,200px),1fr))' }}
            >
              {question.options.map((o) => {
                const isRight = !!answered && question.answers.includes(o)
                const picked = answered?.given === o
                const style = isRight
                  ? 'bg-pink border-pink text-feedback-on'
                  : picked
                    ? 'bg-btn border-btn text-onbtn'
                    : answered
                      ? 'bg-raised border-line opacity-60'
                      : 'bg-raised border-line hover:border-ink'
                return (
                  <button
                    key={o}
                    type="button"
                    disabled={!!answered}
                    onClick={() => answer(o)}
                    className={`grid min-h-14 place-items-center rounded-2xl border-[1.5px] px-3 text-[18px] ${short ? 'font-semibold [font-stretch:110%]' : 'font-medium'} ${style}`}
                  >
                    {o}
                  </button>
                )
              })}
            </div>
          ) : (
            <input
              value={answered ? answered.given : typed}
              onChange={(e) => setTyped(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && typed.trim() && answer(typed)}
              readOnly={!!answered}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              aria-label={question.question}
              placeholder={question.answerLang === 'target' ? 'Type in French' : 'Type your answer'}
              className={`min-h-14 w-full max-w-sm rounded-2xl border-[1.5px] bg-raised px-[18px] outline-none ${
                question.answerLang === 'target' ? 'target text-[26px]' : 'text-[18px]'
              } ${answered ? (answered.ok ? 'border-pink' : 'border-line') : 'border-ink'}`}
            />
          )}
          <div className="min-h-[22px] text-[15px] text-ink-2">
            {answered && (answered.ok ? 'Yes.' : `Not quite. The answer is ${question.answers[0]}. Listen again for it.`)}
          </div>
        </div>
      )}

      {finished && (
        <div className="flex flex-col gap-2 pt-2">
          <div className="text-[14px] text-ink-2">Listening Complete</div>
          <div className="stat text-[clamp(64px,10cqi,96px)]">
            {right}
            <span className="text-ink-3">/{piece.questions.length}</span>
          </div>
          <p className="m-0 text-[17px] text-ink-2">
            {right === piece.questions.length ? 'Every question right.' : 'Open the transcript and listen once more for the ones you missed.'}
          </p>
        </div>
      )}

      <Actions>
        {finished ? (
          <>
            <button
              type="button"
              onClick={() => {
                setAnswers({})
                setQ(0)
                setTyped('')
                setFinished(false)
              }}
              className="px-[18px] py-4 text-[15px] whitespace-nowrap text-ink-2 hover:text-ink"
            >
              Try Again
            </button>
            <ActionButton onClick={() => (window.location.hash = '#/practise')}>Done</ActionButton>
          </>
        ) : !answered ? (
          question?.options ? (
            <span className="flex-1 py-4 text-center text-[15px] text-ink-2">Listen, then choose an answer.</span>
          ) : (
            <ActionButton onClick={() => answer(typed)} disabled={!typed.trim()}>
              Check
            </ActionButton>
          )
        ) : (
          <ActionButton
            onClick={() => {
              if (isLast) finish()
              else {
                setQ(q + 1)
                setTyped('')
              }
            }}
          >
            {isLast ? 'Finish' : 'Next Question'}
          </ActionButton>
        )}
      </Actions>
    </FocusFrame>
  )
}
