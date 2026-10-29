import type { SpeechRate } from '../engine/types'

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

  constructor(locale: string, preferred: string[], choice: VoiceChoice = {}, rate: SpeechRate = 'normal') {
    this.locale = locale
    this.preferred = preferred
    this.choice = choice
    this.defaultRate = rate
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

  speak(text: string, opts: SpeakOptions = {}): Promise<void> {
    const s = synth()
    if (!s) return Promise.resolve()
    s.cancel()
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
    synth()?.cancel()
  }
}
