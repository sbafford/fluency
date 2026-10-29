import type { Narration, SpeechRate } from '../engine/types'
import { clipKey, roleFor, type Manifest } from './narration'

/*
 * Text to speech using the browser's built-in voices. Quality depends on the
 * device: Apple devices and Chrome ship good French voices; some Linux and
 * Android setups have only robotic ones or none. Everything that uses audio
 * also works without it (transcripts are always available).
 */

export const RATES: Record<SpeechRate, number> = { slow: 0.7, normal: 0.92, natural: 1.08 }

export interface VoiceChoice {
  a?: string
  b?: string
}

export interface SpeakOptions {
  rate?: SpeechRate
  voice?: 'a' | 'b'
  pitch?: number
  /** Speaker name, so a recorded character keeps their own voice. */
  who?: string
}

/** Playback speeds for recorded audio, which is recorded at a natural pace. */
export const RECORDED_RATES: Record<SpeechRate, number> = { slow: 0.75, normal: 0.95, natural: 1 }

export interface Recordings {
  /** Folder the clips are served from, ending in "/". */
  base: string
  manifest: Manifest
  narration: Narration
}

const synth = (): SpeechSynthesis | undefined =>
  typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : undefined

export function ttsSupported(): boolean {
  return !!synth()
}

/** Voices for a locale, best match first. */
export function voicesFor(locale: string, preferred: string[] = []): SpeechSynthesisVoice[] {
  const s = synth()
  if (!s) return []
  const lang = locale.split('-')[0].toLowerCase()
  const all = s.getVoices().filter((v) => v.lang.replace('_', '-').toLowerCase().startsWith(lang))
  const score = (v: SpeechSynthesisVoice) => {
    let n = 0
    // The exact accent matters most: a Canadian or Belgian voice teaches a different pronunciation.
    if (v.lang.replace('_', '-').toLowerCase() === locale.toLowerCase()) n += 100
    if (/enhanced|premium|natural|neural|amélioré|améliorée/i.test(v.name)) n += 40
    const p = preferred.findIndex((name) => v.name.includes(name))
    if (p >= 0) n += 20 - p
    // Apple's novelty and low-fidelity voices mispronounce too much to learn from.
    if (/^(Eddy|Flo|Grandma|Grandpa|Grand-mère|Grand-père|Reed|Rocko|Sandy|Shelley|Jacques|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Wobble|Zarvox|Trinoids|Whisper|Superstar|Organ|Junior|Ralph|Kathy|Fred|Albert)\b/i.test(v.name)) n -= 200
    return n
  }
  return [...all].sort((x, y) => score(y) - score(x))
}

/** Resolves once the browser has loaded its voice list (or after a short wait). */
export function voicesReady(): Promise<void> {
  const s = synth()
  if (!s || s.getVoices().length) return Promise.resolve()
  return new Promise((resolve) => {
    const done = () => {
      s.removeEventListener('voiceschanged', done)
      resolve()
    }
    s.addEventListener('voiceschanged', done)
    setTimeout(done, 1500)
  })
}

export class Speaker {
  private locale: string
  private preferred: string[]
  private choice: VoiceChoice
  private defaultRate: SpeechRate
  private recordings?: Recordings
  private audio?: HTMLAudioElement
  private stopAudio?: () => void

  constructor(locale: string, preferred: string[], choice: VoiceChoice = {}, rate: SpeechRate = 'normal', recordings?: Recordings) {
    this.locale = locale
    this.preferred = preferred
    this.choice = choice
    this.defaultRate = rate
    this.recordings = recordings
  }

  /** The recorded clip for a line, if there is one. */
  clipFor(text: string, opts: SpeakOptions = {}): string | undefined {
    const r = this.recordings
    if (!r) return undefined
    const file = r.manifest.clips[clipKey(roleFor(r.narration, opts), text)]
    if (!file && typeof window !== 'undefined') {
      // Lets the end-to-end tests find lines that were never recorded.
      const w = window as unknown as { __fluencyMissingClips?: Set<string> }
      ;(w.__fluencyMissingClips ??= new Set()).add(clipKey(roleFor(r.narration, opts), text))
    }
    return file ? r.base + file : undefined
  }

  private playClip(url: string, rate: SpeechRate): Promise<boolean> {
    return new Promise((resolve) => {
      const audio = this.audio ?? (this.audio = new Audio())
      let settled = false
      const done = (played: boolean) => {
        if (settled) return
        settled = true
        audio.onended = audio.onerror = null
        this.stopAudio = undefined
        resolve(played)
      }
      this.stopAudio = () => done(true)
      audio.onended = () => done(true)
      audio.onerror = () => done(false)
      audio.src = url
      audio.preservesPitch = true
      audio.defaultPlaybackRate = audio.playbackRate = RECORDED_RATES[rate]
      audio.play().catch(() => done(false))
    })
  }

  private resolveVoice(which: 'a' | 'b'): { voice?: SpeechSynthesisVoice; pitch: number } {
    const voices = voicesFor(this.locale, this.preferred)
    const named = (name?: string) => (name ? voices.find((v) => v.name === name) : undefined)
    const a = named(this.choice.a) ?? voices[0]
    if (which === 'a') return { voice: a, pitch: 1 }
    const b = named(this.choice.b) ?? voices.find((v) => v !== a)
    // With only one voice installed, a pitch shift keeps two speakers distinguishable.
    return b ? { voice: b, pitch: 1 } : { voice: a, pitch: 0.82 }
  }

  async speak(text: string, opts: SpeakOptions = {}): Promise<void> {
    this.cancel()
    const clip = this.clipFor(text, opts)
    if (clip && (await this.playClip(clip, opts.rate ?? this.defaultRate))) return
    return this.speakWithDevice(text, opts)
  }

  private speakWithDevice(raw: string, opts: SpeakOptions): Promise<void> {
    const s = synth()
    if (!s) return Promise.resolve()
    s.cancel()
    // "enchanté(e)" is written for reading; say it without the optional ending.
    const text = raw.replace(/\((\p{L}{1,3})\)/gu, '')
    const { voice, pitch } = this.resolveVoice(opts.voice ?? 'a')
    const u = new SpeechSynthesisUtterance(text)
    u.lang = voice?.lang ?? this.locale
    if (voice) u.voice = voice
    u.rate = RATES[opts.rate ?? this.defaultRate]
    u.pitch = Math.min(2, Math.max(0.5, (opts.pitch ?? 1) * pitch))
    return new Promise((resolve) => {
      let settled = false
      const finish = () => {
        if (settled) return
        settled = true
        resolve()
      }
      u.onend = finish
      u.onerror = finish
      // Some browsers never fire onend; fall back to an estimate of the duration.
      const estimate = 1200 + (text.length * 90) / u.rate
      setTimeout(finish, estimate + 4000)
      s.speak(u)
    })
  }

  cancel() {
    if (this.audio && !this.audio.paused) this.audio.pause()
    this.stopAudio?.()
    synth()?.cancel()
  }
}
