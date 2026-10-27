import { useEffect, useRef, useState } from 'react'
import { checkAnswer } from '../engine/answers'
import { completeListening } from '../engine/progress'
import type { SpeechRate } from '../engine/types'
import { useApp } from '../state/app'
import { BackIcon, CheckIcon, CrossIcon } from '../ui/icons'
import { Button, LinkButton } from '../ui/kit'

const RATE_LABELS: Record<SpeechRate, string> = { slow: 'Slow', normal: 'Normal', natural: 'Natural' }

export function ListeningScreen({ id }: { id: string }) {
  const { pack, speaker, record, updateProgress, progress } = useApp()
  const piece = pack.listening.find((l) => l.id === id)
  const [rate, setRate] = useState<SpeechRate>('normal')
  const [current, setCurrent] = useState<number | null>(null)
  const [transcript, setTranscript] = useState(false)
  const [translations, setTranslations] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState<Record<string, boolean> | null>(null)
  const [plays, setPlays] = useState(0)
  const playing = useRef(false)

  useEffect(() => () => speaker.cancel(), [speaker])

  if (!piece) {
    return (
      <div className="mx-auto max-w-[720px] px-5 py-16">
        <p className="mb-4">This listening exercise doesn't exist.</p>
        <LinkButton href="#/practise">Back to practice</LinkButton>
      </div>
    )
  }

  const play = async (from = 0) => {
    if (playing.current) {
      playing.current = false
      speaker.cancel()
      setCurrent(null)
      return
    }
    playing.current = true
    setPlays((n) => n + 1)
    for (let i = from; i < piece.lines.length && playing.current; i++) {
      const line = piece.lines[i]
      const sp = piece.speakers[line.speaker]
      setCurrent(i)
      await speaker.speak(line.target, { voice: sp.voice, pitch: sp.pitch, rate })
      await new Promise((r) => setTimeout(r, rate === 'natural' ? 150 : 400))
    }
    playing.current = false
    setCurrent(null)
  }

  const check = () => {
    const result: Record<string, boolean> = {}
    for (const q of piece.questions) {
      const given = answers[q.id] ?? ''
      const ok = q.options ? q.answers.includes(given) : checkAnswer(given, q.answers, { lang: q.answerLang }).result !== 'wrong'
      result[q.id] = ok
      record({ itemIds: [], skill: 'listening', result: ok ? 'correct' : 'wrong', errorType: ok ? undefined : 'meaning' })
    }
    setChecked(result)
    const score = Object.values(result).filter(Boolean).length / piece.questions.length
    updateProgress((p) => completeListening(p, piece.id, score, Date.now()))
  }

  const score = checked ? Object.values(checked).filter(Boolean).length : 0
  const best = progress.listening[piece.id]?.bestScore

  return (
    <div className="mx-auto max-w-[720px] px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-20">
      <a href="#/practise" className="-ml-2 mb-6 inline-flex items-center gap-2 rounded-full p-2 text-[15px] text-ink-2 hover:text-ink">
        <BackIcon size={20} /> Practise
      </a>
      <p className="mb-1 text-[15px] text-ink-2">
        Listening, {piece.level}
        {best !== undefined && `. Best so far ${Math.round(best * 100)}%`}
      </p>
      <h1 className="target mb-2 text-[44px] leading-[1.05]">{piece.title}</h1>
      <p className="mb-6 text-ink-2">{piece.setting}</p>

      <div className="mb-3 flex flex-wrap items-center gap-3">
        <Button onClick={() => play()}>{current !== null ? 'Stop' : plays ? 'Play again' : 'Play'}</Button>
        <div className="inline-flex rounded-full border border-line p-1" role="radiogroup" aria-label="Speed">
          {(Object.keys(RATE_LABELS) as SpeechRate[]).map((r) => (
            <button
              key={r}
              type="button"
              role="radio"
              aria-checked={rate === r}
              onClick={() => setRate(r)}
              className={`rounded-full px-3.5 py-1.5 text-[14px] font-medium ${rate === r ? 'bg-ink text-paper' : 'text-ink-2'}`}
            >
              {RATE_LABELS[r]}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-8 text-[14px] text-ink-3">Try answering from listening alone before you open the transcript.</p>

      <section className="mb-10">
        <button
          type="button"
          onClick={() => setTranscript(!transcript)}
          aria-expanded={transcript}
          className="text-[15px] font-semibold underline underline-offset-4"
        >
          {transcript ? 'Hide transcript' : 'Show transcript'}
        </button>
        {transcript && (
          <div className="mt-4">
            <label className="mb-3 inline-flex items-center gap-2 text-[15px] text-ink-2">
              <input type="checkbox" checked={translations} onChange={(e) => setTranslations(e.target.checked)} className="h-4 w-4 accent-[var(--accent)]" />
              Show translations
            </label>
            <ol className="space-y-1">
              {piece.lines.map((line, i) => (
                <li key={i} className={`rounded-xl px-3 py-2 ${current === i ? 'bg-accent-wash' : ''}`}>
                  <p className="text-[13px] font-medium text-ink-3">{piece.speakers[line.speaker].name}</p>
                  <p className="target text-[21px] leading-snug">{line.target}</p>
                  {translations && <p className="text-[15px] text-ink-2">{line.native}</p>}
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-[19px] font-semibold">Questions</h2>
        <ol className="space-y-7">
          {piece.questions.map((q, n) => {
            const ok = checked?.[q.id]
            return (
              <li key={q.id}>
                <p className="mb-2.5 flex items-start gap-2 text-[17px] font-medium">
                  <span className="text-ink-3">{n + 1}.</span>
                  <span className="flex-1">{q.question}</span>
                  {checked && (ok ? <CheckIcon className="text-good" /> : <CrossIcon className="text-bad" />)}
                </p>
                {q.options ? (
                  <div className="flex flex-wrap gap-2">
                    {q.options.map((o) => {
                      const selected = answers[q.id] === o
                      const right = checked && q.answers.includes(o)
                      return (
                        <button
                          key={o}
                          type="button"
                          disabled={!!checked}
                          aria-pressed={selected}
                          onClick={() => setAnswers({ ...answers, [q.id]: o })}
                          className={`rounded-full border-[1.5px] px-4 py-2 text-[15px] ${
                            right
                              ? 'border-good bg-good-wash'
                              : selected
                                ? checked
                                  ? 'border-bad bg-bad-wash'
                                  : 'border-ink bg-ink text-paper'
                                : 'border-line hover:border-ink'
                          }`}
                        >
                          {o}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div>
                    <input
                      value={answers[q.id] ?? ''}
                      onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                      disabled={!!checked}
                      autoCapitalize="off"
                      autoCorrect="off"
                      spellCheck={false}
                      aria-label={q.question}
                      className={`${q.answerLang === 'target' ? 'target text-[20px]' : 'text-[17px]'} min-h-12 w-full max-w-sm rounded-xl border-[1.5px] border-line bg-raised px-3 outline-none focus:border-ink`}
                    />
                    {checked && !ok && <p className="mt-1.5 text-[15px] text-ink-2">Answer: {q.answers[0]}</p>}
                  </div>
                )}
              </li>
            )
          })}
        </ol>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          {!checked ? (
            <Button onClick={check} disabled={piece.questions.some((q) => !(answers[q.id] ?? '').trim())}>
              Check answers
            </Button>
          ) : (
            <>
              <p className="text-[19px] font-semibold">
                {score} of {piece.questions.length} right
              </p>
              <Button
                variant="secondary"
                onClick={() => {
                  setChecked(null)
                  setAnswers({})
                }}
              >
                Try again
              </Button>
              <LinkButton href="#/practise" variant="quiet">
                Done
              </LinkButton>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
