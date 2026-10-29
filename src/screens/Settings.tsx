import { useEffect, useRef, useState, type ReactNode } from 'react'
import { exportData, importData } from '../engine/storage'
import { recognitionSupported } from '../speech/recognition'
import { ttsSupported, voicesFor, voicesReady } from '../speech/tts'
import { useApp } from '../state/app'
import { getToken, setToken } from '../sync/gist'
import { Button, PageTitle, Segmented } from '../ui/kit'
import { syncText } from '../ui/SyncBadge'

const field = 'min-h-12 rounded-[14px] border-[1.5px] border-line bg-raised px-3.5 outline-none focus:border-ink'

function Setting({ label, help, children }: { label: string; help?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[15px] font-semibold">{label}</span>
      {help && <span className="text-[14px] text-ink-2">{help}</span>}
      {children}
    </div>
  )
}

function Section({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3.5 border-t border-line pt-7">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="m-0 text-[20px] font-semibold">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  )
}

function useResolvedTheme(choice: 'light' | 'dark' | undefined): 'light' | 'dark' {
  const [system, setSystem] = useState(() => (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!mq) return
    const on = () => setSystem(mq.matches ? 'dark' : 'light')
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return choice ?? (system as 'light' | 'dark')
}

export function Settings() {
  const { data, pack, settings, updateSettings, replaceData, resetProgress, speaker, sync, syncNow } = useApp()
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [message, setMessage] = useState<{ ok: boolean; text: string }>()
  const fileRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState(settings.learnerName)
  const [token, setTokenValue] = useState('')
  const theme = useResolvedTheme(settings.theme)
  const connected = sync.state !== 'off' && !!getToken()

  useEffect(() => {
    void voicesReady().then(() => setVoices(voicesFor(pack.locale, pack.preferredVoices)))
  }, [pack])

  const saveName = () => {
    if (name.trim() !== settings.learnerName) updateSettings({ learnerName: name.trim() })
  }

  const download = () => {
    const blob = new Blob([exportData(data)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fluency-progress-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMessage({ ok: true, text: 'Backup downloaded.' })
  }

  const upload = async (file: File) => {
    try {
      const next = importData(await file.text(), data.deviceId)
      if (!window.confirm('Replace your current progress and settings with this backup?')) return
      replaceData(next)
      setMessage({ ok: true, text: 'Backup imported.' })
    } catch (err) {
      setMessage({ ok: false, text: err instanceof Error ? err.message : 'That file could not be imported.' })
    }
  }

  const status = syncText(sync.state, sync.pending, settings.lastSyncedAt, true)

  return (
    <div className="flex max-w-[720px] flex-col gap-10">
      <PageTitle>Settings</PageTitle>

      <section className="flex flex-col gap-[22px]">
        <label className="flex flex-col gap-2">
          <span className="text-[15px] font-semibold">Your Name</span>
          <span className="text-[14px] text-ink-2">Used in speaking and conversation practice.</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={saveName}
            onKeyDown={(e) => e.key === 'Enter' && saveName()}
            autoComplete="given-name"
            className={`${field} text-[17px]`}
          />
        </label>
        <Setting label="Daily Goal" help="Answers per Day">
          <Segmented
            label="Daily goal"
            value={String(settings.dailyGoal)}
            onChange={(v) => updateSettings({ dailyGoal: Number(v) })}
            options={['10', '20', '30', '50'].map((v) => ({ value: v, label: v }))}
          />
        </Setting>
        <Setting label="Speech Speed">
          <Segmented
            label="Speech speed"
            value={settings.rate === 'slow' ? 'slow' : 'normal'}
            onChange={(v) => updateSettings({ rate: v })}
            options={[
              { value: 'slow', label: 'Slower' },
              { value: 'normal', label: 'Natural' },
            ]}
          />
        </Setting>
        <Setting label="Appearance">
          <Segmented
            label="Appearance"
            value={theme}
            onChange={(v) => updateSettings({ theme: v })}
            options={[
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
            ]}
          />
        </Setting>
        <Setting label="Translations" help="Show English under French in dialogues and conversations from the start.">
          <Segmented
            label="Translations"
            value={settings.showTranslations ? 'on' : 'off'}
            onChange={(v) => updateSettings({ showTranslations: v === 'on' })}
            options={[
              { value: 'off', label: 'French Only' },
              { value: 'on', label: 'With English' },
            ]}
          />
        </Setting>
      </section>

      <Section title="Voices and Speaking">
        {!ttsSupported() && <p className="m-0 text-[15px] text-accent">This browser has no text-to-speech, so audio won't play.</p>}
        {(['voiceA', 'voiceB'] as const).map((key, i) => (
          <Setting
            key={key}
            label={i === 0 ? 'Main Voice' : 'Second Voice'}
            help={
              voices.length
                ? i === 0
                  ? 'Reads most audio.'
                  : 'Reads the second speaker in dialogues.'
                : `No ${pack.name} voices found. On a Mac or iPhone, add one in system settings under Spoken Content.`
            }
          >
            <div className="flex flex-wrap gap-2.5">
              <select
                value={settings[key] ?? ''}
                onChange={(e) => updateSettings({ [key]: e.target.value || undefined })}
                className={`${field} min-w-0 flex-[1_1_240px] text-[15px]`}
                disabled={!voices.length}
                aria-label={i === 0 ? 'Main voice' : 'Second voice'}
              >
                <option value="">Automatic</option>
                {voices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
              <Button variant="outline" onClick={() => speaker.speak('Bonjour, je suis votre voix.', { voice: i === 0 ? 'a' : 'b' })}>
                Test
              </Button>
            </div>
          </Setting>
        ))}
        <Setting
          label="Speech Input"
          help={
            recognitionSupported()
              ? 'Speak your answers. In Chrome, audio goes to Google for recognition and needs a connection.'
              : "Not supported in this browser (it works in Chrome, Edge and Safari). You'll rate your own speaking instead."
          }
        >
          <Segmented
            label="Speech input"
            value={settings.speechInput && recognitionSupported() ? 'on' : 'off'}
            onChange={(v) => recognitionSupported() && updateSettings({ speechInput: v === 'on' })}
            options={[
              { value: 'on', label: 'On' },
              { value: 'off', label: 'Off' },
            ]}
          />
        </Setting>
      </Section>

      <Section
        title="Sync Between Devices"
        aside={
          connected && (
            <span className="flex items-center gap-1.5 text-[13px] text-ink-2">
              <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          )
        }
      >
        <p className="m-0 max-w-[60ch] text-[15px] leading-normal text-ink-2">
          Progress merges through a secret gist on your GitHub account. The token stays in this browser.
          {connected && ' It syncs when you open the app, when you switch away, and shortly after you practise.'}
        </p>
        {sync.state === 'error' && <p className="m-0 max-w-[60ch] text-[15px] text-accent">{sync.message}</p>}
        {connected ? (
          <div className="flex flex-wrap gap-2.5">
            <Button variant="outline" onClick={() => void syncNow()} disabled={sync.state === 'syncing'}>
              Sync Now
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setToken(undefined)
                updateSettings({ lastSyncedAt: undefined })
                void syncNow()
              }}
            >
              Disconnect This Device
            </Button>
          </div>
        ) : (
          <>
            <ol className="m-0 flex flex-col gap-1 pl-5 text-[15px] text-ink-2">
              <li>
                On GitHub, create a{' '}
                <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noreferrer" className="font-semibold text-accent">
                  fine-grained token
                </a>
                . Under Account permissions, set Gists to Read and write. Nothing else is needed.
              </li>
              <li>Paste it here on each device you use.</li>
            </ol>
            <form
              className="flex flex-wrap gap-2.5"
              onSubmit={(e) => {
                e.preventDefault()
                if (!token.trim()) return
                setToken(token.trim())
                setTokenValue('')
                void syncNow()
              }}
            >
              <input
                type="password"
                value={token}
                onChange={(e) => setTokenValue(e.target.value)}
                placeholder="github_pat_…"
                autoComplete="off"
                aria-label="GitHub token"
                className={`${field} min-w-0 flex-[1_1_240px] text-[15px]`}
              />
              <Button type="submit" variant="outline" disabled={!token.trim()}>
                Connect
              </Button>
            </form>
          </>
        )}
      </Section>

      <Section title="Backup">
        <p className="m-0 text-[15px] leading-normal text-ink-2">A JSON file of your progress. Import it on another device to carry on there.</p>
        <div className="flex flex-wrap gap-2.5">
          <Button variant="ink" onClick={download}>
            Export Backup
          </Button>
          <Button variant="outline" onClick={() => fileRef.current?.click()}>
            Import Backup
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
        {message && <p className={`m-0 text-[15px] ${message.ok ? 'text-ink-2' : 'text-accent'}`}>{message.text}</p>}
      </Section>

      <Section title="Start Over">
        <p className="m-0 max-w-[60ch] text-[15px] leading-normal text-ink-2">
          {connected
            ? `Clears ${pack.name} progress on this device. Sync is on, so your synced progress comes back on the next sync. Disconnect first to start over everywhere.`
            : `Clears all ${pack.name} progress on this device. Settings are kept. This can't be undone.`}
        </p>
        <div>
          <Button
            variant="outline"
            onClick={() => {
              if (window.confirm(`Delete all ${pack.name} progress on this device? Export a backup first if you might want it.`)) {
                resetProgress()
                setMessage({ ok: true, text: 'Progress reset.' })
              }
            }}
          >
            Reset Progress
          </Button>
        </div>
      </Section>
    </div>
  )
}
