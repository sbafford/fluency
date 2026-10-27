import { useEffect, useRef, useState } from 'react'
import { exportData, importData } from '../engine/storage'
import type { SpeechRate } from '../engine/types'
import { recognitionSupported } from '../speech/recognition'
import { ttsSupported, voicesFor, voicesReady } from '../speech/tts'
import { useApp } from '../state/app'
import { Button, PageHeader, SectionTitle } from '../ui/kit'

function Row({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line py-4">
      <div className="min-w-[14rem] flex-1">
        <p className="text-[16px] font-medium">{label}</p>
        {help && <p className="max-w-[52ch] text-[14px] text-ink-2">{help}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

const selectCls = 'min-h-11 rounded-xl border-[1.5px] border-line bg-raised px-3 text-[15px] outline-none focus:border-ink max-w-[15rem]'

export function Settings() {
  const { data, pack, settings, updateSettings, replaceData, resetProgress, speaker } = useApp()
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [message, setMessage] = useState<{ tone: 'good' | 'bad'; text: string }>()
  const fileRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState(settings.learnerName)

  useEffect(() => {
    void voicesReady().then(() => setVoices(voicesFor(pack.locale, pack.preferredVoices)))
  }, [pack])

  const download = () => {
    const blob = new Blob([exportData(data)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fluency-progress-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMessage({ tone: 'good', text: 'Backup downloaded.' })
  }

  const upload = async (file: File) => {
    try {
      const next = importData(await file.text())
      if (!window.confirm('Replace your current progress and settings with this backup?')) return
      replaceData(next)
      setMessage({ tone: 'good', text: 'Backup imported.' })
    } catch (err) {
      setMessage({ tone: 'bad', text: err instanceof Error ? err.message : 'That file could not be imported.' })
    }
  }

  return (
    <div>
      <PageHeader title="settings" />

      <section className="mb-10">
        <SectionTitle>You</SectionTitle>
        <Row label="Name" help="Used in speaking and conversation practice.">
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              updateSettings({ learnerName: name.trim() })
            }}
          >
            <input value={name} onChange={(e) => setName(e.target.value)} className={selectCls} aria-label="Name" />
            <Button type="submit" variant="secondary" className="min-h-11 px-4" disabled={name.trim() === settings.learnerName}>
              Save
            </Button>
          </form>
        </Row>
        <Row label="Daily goal" help="Answers per day. A steady small goal beats an ambitious one you skip.">
          <select value={settings.dailyGoal} onChange={(e) => updateSettings({ dailyGoal: Number(e.target.value) })} className={selectCls}>
            {[10, 20, 30, 50].map((n) => (
              <option key={n} value={n}>
                {n} answers (about {Math.round(n / 2.5)} min)
              </option>
            ))}
          </select>
        </Row>
        <Row label="Translations" help="Show English under French lines by default in dialogues and conversations.">
          <input
            type="checkbox"
            checked={settings.showTranslations}
            onChange={(e) => updateSettings({ showTranslations: e.target.checked })}
            className="h-5 w-5 accent-[var(--accent)]"
            aria-label="Show translations by default"
          />
        </Row>
      </section>

      <section className="mb-10">
        <SectionTitle>Audio and speech</SectionTitle>
        {!ttsSupported() && <p className="mb-3 text-[15px] text-bad">This browser has no text-to-speech, so audio won't play.</p>}
        <Row label="Speaking speed" help="Default speed for audio. Every play button also has a slow option.">
          <select value={settings.rate} onChange={(e) => updateSettings({ rate: e.target.value as SpeechRate })} className={selectCls}>
            <option value="slow">Slow</option>
            <option value="normal">Normal</option>
            <option value="natural">Natural pace</option>
          </select>
        </Row>
        {(['voiceA', 'voiceB'] as const).map((key, i) => (
          <Row
            key={key}
            label={i === 0 ? 'Main voice' : 'Second voice'}
            help={
              voices.length
                ? i === 0
                  ? 'Reads most audio.'
                  : 'Reads the second speaker in dialogues.'
                : `No ${pack.name} voices found. On a Mac or iPhone, add one in system settings under Spoken Content.`
            }
          >
            <div className="flex gap-2">
              <select
                value={settings[key] ?? ''}
                onChange={(e) => updateSettings({ [key]: e.target.value || undefined })}
                className={selectCls}
                disabled={!voices.length}
              >
                <option value="">Automatic</option>
                {voices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
              <Button
                variant="secondary"
                className="min-h-11 px-4"
                onClick={() => speaker.speak('Bonjour, je suis votre voix.', { voice: i === 0 ? 'a' : 'b' })}
              >
                Test
              </Button>
            </div>
          </Row>
        ))}
        <Row
          label="Speech input"
          help={
            recognitionSupported()
              ? 'Speak your answers. In Chrome, audio is sent to Google for recognition and needs a connection.'
              : "Not supported in this browser (it works in Chrome, Edge and Safari). You'll rate your own speaking instead."
          }
        >
          <input
            type="checkbox"
            checked={settings.speechInput && recognitionSupported()}
            disabled={!recognitionSupported()}
            onChange={(e) => updateSettings({ speechInput: e.target.checked })}
            className="h-5 w-5 accent-[var(--accent)]"
            aria-label="Use speech input"
          />
        </Row>
      </section>

      <section className="mb-10">
        <SectionTitle>Your data</SectionTitle>
        <p className="mb-2 max-w-[62ch] text-[15px] text-ink-2">
          Progress is stored in this browser only. Export a backup to move it to another device or browser, or to keep it safe
          before clearing browser data.
        </p>
        <div className="flex flex-wrap gap-2 py-3">
          <Button variant="secondary" onClick={download}>
            Export backup
          </Button>
          <Button variant="secondary" onClick={() => fileRef.current?.click()}>
            Import backup
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) void upload(f)
              e.target.value = ''
            }}
          />
        </div>
        {message && <p className={`text-[15px] ${message.tone === 'good' ? 'text-good' : 'text-bad'}`}>{message.text}</p>}
        <Row label="Reset progress" help={`Clears all ${pack.name} progress on this device. Settings are kept. This can't be undone.`}>
          <Button
            variant="quiet"
            className="text-bad hover:text-bad"
            onClick={() => {
              if (window.confirm(`Delete all ${pack.name} progress on this device? Export a backup first if you might want it.`)) {
                resetProgress()
                setMessage({ tone: 'good', text: 'Progress reset.' })
              }
            }}
          >
            Reset progress
          </Button>
        </Row>
      </section>
    </div>
  )
}
