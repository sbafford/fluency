import { Mp3Encoder } from '@breezystack/lamejs'

/*
 * Clips are requested from Google as raw audio (LINEAR16 WAV), checked for
 * speech, trimmed of long silences and encoded to MP3 here. Google
 * occasionally returns silence for a very short line (it happened with
 * "merci" and "un"); checking the raw audio catches that before it is kept.
 */

export interface Pcm {
  sampleRate: number
  samples: Int16Array
}

/** Reads a 16-bit mono WAV, as Google returns for LINEAR16. */
export function parseWav(buf: Uint8Array): Pcm {
  const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength)
  const tag = (o: number) => String.fromCharCode(buf[o], buf[o + 1], buf[o + 2], buf[o + 3])
  if (tag(0) !== 'RIFF' || tag(8) !== 'WAVE') throw new Error('Not a WAV file')
  let sampleRate = 24000
  let o = 12
  while (o + 8 <= buf.length) {
    const id = tag(o)
    const size = view.getUint32(o + 4, true)
    if (id === 'fmt ') sampleRate = view.getUint32(o + 12, true)
    if (id === 'data') {
      const end = Math.min(buf.length, o + 8 + size)
      const samples = new Int16Array((end - o - 8) >> 1)
      for (let i = 0; i < samples.length; i++) samples[i] = view.getInt16(o + 8 + i * 2, true)
      return { sampleRate, samples }
    }
    o += 8 + size + (size & 1)
  }
  throw new Error('WAV has no audio data')
}

const SPEECH = Math.round(32768 * 10 ** (-30 / 20)) // -30 dBFS

export interface ClipCheck {
  ok: boolean
  /** Loudest sample in dBFS (0 is full scale). */
  peakDb: number
  /** Seconds between the first and last loud sample. */
  speechSeconds: number
}

export function checkPcm({ samples, sampleRate }: Pcm): ClipCheck {
  let peak = 0
  let first = -1
  let last = -1
  for (let i = 0; i < samples.length; i++) {
    const a = Math.abs(samples[i])
    if (a > peak) peak = a
    if (a > SPEECH) {
      if (first < 0) first = i
      last = i
    }
  }
  const speechSeconds = first < 0 ? 0 : (last - first) / sampleRate
  const peakDb = peak ? 20 * Math.log10(peak / 32768) : -120
  return { ok: speechSeconds >= 0.12, peakDb, speechSeconds }
}

/** Keeps a short, even pause before and after the speech, so playback starts promptly. */
export function trim(pcm: Pcm, padSeconds = 0.15): Pcm {
  const quiet = Math.round(32768 * 10 ** (-45 / 20))
  const { samples, sampleRate } = pcm
  let start = 0
  while (start < samples.length && Math.abs(samples[start]) <= quiet) start++
  let end = samples.length - 1
  while (end > start && Math.abs(samples[end]) <= quiet) end--
  const pad = Math.round(padSeconds * sampleRate)
  return { sampleRate, samples: samples.slice(Math.max(0, start - pad), Math.min(samples.length, end + pad)) }
}

export function encodeMp3({ samples, sampleRate }: Pcm, kbps = 48): Buffer {
  const enc = new Mp3Encoder(1, sampleRate, kbps)
  const parts: Uint8Array[] = []
  for (let i = 0; i < samples.length; i += 1152 * 8) parts.push(enc.encodeBuffer(samples.subarray(i, i + 1152 * 8)))
  parts.push(enc.flush())
  return Buffer.concat(parts.map((p) => Buffer.from(p.buffer, p.byteOffset, p.length)))
}
