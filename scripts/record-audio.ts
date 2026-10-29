/*
 * Records every French line in the course with Google Cloud Text-to-Speech
 * and saves the clips in public/audio/<language>/, with a manifest the app
 * reads. Run it on your own computer; the API key never leaves it.
 *
 *   npm run audio:samples   one sentence in every Chirp 3 HD voice, to choose from
 *   npm run audio:check     what would be recorded, and how many characters (no API calls)
 *   npm run audio           record anything not yet recorded
 *
 * The key is read from GOOGLE_TTS_KEY, or from .env.local in the project
 * folder (git ignores *.local files, so it is never pushed).
 * Re-running only records what is new or changed, so it costs nothing extra.
 */

import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { languages } from '../src/content/index'
import { clipKey, narrationPlan, type Manifest } from '../src/speech/narration'

const ROOT = new URL('..', import.meta.url).pathname
const ENDPOINT = process.env.TTS_ENDPOINT ?? 'https://texttospeech.googleapis.com'
const mode = process.argv.includes('--samples') ? 'samples' : process.argv.includes('--check') ? 'check' : 'record'
const SAMPLE = "Bonjour ! Je m'appelle Sarah. Je voudrais un café, s'il vous plaît. Il fait beau à Lyon aujourd'hui, non ?"

function apiKey(): string {
  if (process.env.GOOGLE_TTS_KEY) return process.env.GOOGLE_TTS_KEY.trim()
  const file = join(ROOT, '.env.local')
  if (existsSync(file)) {
    const lines = readFileSync(file, 'utf8').split('\n').map((l) => l.trim())
    const line = lines.find((l) => l.startsWith('GOOGLE_TTS_KEY='))
    if (line) return line.slice('GOOGLE_TTS_KEY='.length).trim().replace(/^["']|["']$/g, '')
    // A bare Google key on its own line also works.
    const bare = lines.find((l) => /^AIza[\w-]{30,}$/.test(l))
    if (bare) return bare
  }
  console.error('No API key found. Put GOOGLE_TTS_KEY=your-key in .env.local in the project folder.')
  process.exit(1)
}

async function call(path: string, key: string, body?: unknown): Promise<any> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`${ENDPOINT}${path}${path.includes('?') ? '&' : '?'}key=${encodeURIComponent(key)}`, {
      method: body ? 'POST' : 'GET',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
    if (res.ok) return res.json()
    const text = await res.text()
    if ((res.status === 429 || res.status >= 500) && attempt < 5) {
      await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt))
      continue
    }
    let message = text
    try {
      message = JSON.parse(text).error?.message ?? text
    } catch {
      // Not JSON; show it as it is.
    }
    throw new Error(`Google said (${res.status}): ${message}`)
  }
}

async function synthesise(key: string, voice: string, text: string): Promise<Buffer> {
  const languageCode = voice.split('-').slice(0, 2).join('-')
  const json = await call('/v1/text:synthesize', key, {
    input: { text },
    voice: { languageCode, name: voice },
    audioConfig: { audioEncoding: 'MP3' },
  })
  return Buffer.from(json.audioContent, 'base64')
}

const fileFor = (voice: string, text: string) => createHash('sha1').update(`${voice}|${text}`).digest('hex').slice(0, 16) + '.mp3'

async function inBatches<T>(items: T[], size: number, work: (item: T, i: number) => Promise<void>) {
  let next = 0
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (next < items.length) {
        const i = next++
        await work(items[i], i)
      }
    }),
  )
}

async function samples() {
  const key = apiKey()
  const out = join(ROOT, 'audio-samples')
  mkdirSync(out, { recursive: true })
  const { voices } = await call('/v1/voices?languageCode=fr-FR', key)
  const chirp = (voices as { name: string; ssmlGender: string }[]).filter((v) => v.name.includes('Chirp3-HD')).sort((a, b) => a.ssmlGender.localeCompare(b.ssmlGender) || a.name.localeCompare(b.name))
  console.log(`Recording a sample in ${chirp.length} voices (${SAMPLE.length * chirp.length} characters)…`)
  await inBatches(chirp, 4, async (v) => {
    const name = `${v.ssmlGender === 'FEMALE' ? 'female' : 'male'} - ${v.name.split('-').pop()}.mp3`
    writeFileSync(join(out, name), await synthesise(key, v.name, SAMPLE))
    console.log('  ', name)
  })
  console.log(`\nDone. Open the audio-samples folder and listen. To change voices, edit src/content/fr/narration.ts.`)
}

async function record(dryRun: boolean) {
  const key = dryRun ? '' : apiKey()
  let total = 0
  for (const pack of Object.values(languages)) {
    if (!pack.narration) continue
    const dir = join(ROOT, 'public', 'audio', pack.id)
    mkdirSync(dir, { recursive: true })
    const plan = narrationPlan(pack).map((l) => ({ ...l, voice: pack.narration!.voices[l.role] }))
    const todo = plan.filter((l) => !existsSync(join(dir, fileFor(l.voice, l.text))))
    const chars = todo.reduce((n, l) => n + l.text.length, 0)
    total += chars
    console.log(`${pack.name}: ${plan.length} lines, ${plan.length - todo.length} already recorded, ${todo.length} to record (${chars.toLocaleString()} characters).`)
    if (dryRun) continue

    if (todo.length) {
      const { voices } = await call(`/v1/voices?languageCode=${pack.locale}`, key)
      const available = new Set((voices as { name: string }[]).map((v) => v.name))
      const missing = [...new Set(plan.map((l) => l.voice))].filter((v) => !available.has(v))
      if (missing.length) throw new Error(`These voices don't exist for ${pack.locale}: ${missing.join(', ')}. Run npm run audio:samples to see the choices.`)
    }

    let done = 0
    const failed: string[] = []
    await inBatches(todo, 4, async (l) => {
      try {
        writeFileSync(join(dir, fileFor(l.voice, l.text)), await synthesise(key, l.voice, l.text))
      } catch (e) {
        failed.push(`${l.text}: ${(e as Error).message}`)
        if (/API key|PERMISSION_DENIED|has not been used|disabled|billing/i.test((e as Error).message)) throw e
      }
      if (++done % 50 === 0) console.log(`  ${done} of ${todo.length}`)
    })

    // The manifest lists only clips that exist; old clips no longer in the course are removed.
    const manifest: Manifest = { voices: pack.narration.voices, clips: {} }
    const keep = new Set<string>()
    for (const l of plan) {
      const file = fileFor(l.voice, l.text)
      if (existsSync(join(dir, file))) {
        manifest.clips[clipKey(l.role, l.text)] = file
        keep.add(file)
      }
    }
    for (const f of readdirSync(dir)) if (f.endsWith('.mp3') && !keep.has(f)) unlinkSync(join(dir, f))
    writeFileSync(join(dir, 'manifest.json'), JSON.stringify(manifest, null, 1))
    console.log(`  Saved ${Object.keys(manifest.clips).length} clips and the manifest.`)
    if (failed.length) console.log(`  ${failed.length} lines failed; run again to retry:\n   ` + failed.slice(0, 10).join('\n   '))
  }
  if (dryRun) console.log(`\nTotal to record: ${total.toLocaleString()} characters. Google's free allowance for Chirp 3 HD voices is 1,000,000 a month.`)
}

const run = mode === 'samples' ? samples() : record(mode === 'check')
run.catch((e) => {
  console.error('\n' + (e as Error).message)
  process.exit(1)
})
