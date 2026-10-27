/*
 * Speech recognition through the browser's Web Speech API, where available
 * (Chrome, Edge and Safari; not Firefox). In Chrome, audio is sent to Google's
 * servers for recognition, so it needs a connection. Recognition checks that
 * you were understood; it is not a pronunciation score.
 */

interface RecognitionAlternative {
  transcript: string
  confidence: number
}
interface RecognitionResult {
  isFinal: boolean
  length: number
  [index: number]: RecognitionAlternative
}
interface RecognitionEvent {
  results: { length: number; [index: number]: RecognitionResult }
}
interface RecognitionErrorEvent {
  error: string
}
interface Recognition {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  continuous: boolean
  onresult: ((e: RecognitionEvent) => void) | null
  onerror: ((e: RecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
  abort(): void
}
type RecognitionCtor = new () => Recognition

function ctor(): RecognitionCtor | undefined {
  if (typeof window === 'undefined') return undefined
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}

export function recognitionSupported(): boolean {
  return !!ctor()
}

export interface ListenResult {
  transcripts: string[]
}

export class RecognitionError extends Error {
  code: string
  constructor(code: string) {
    super(messageFor(code))
    this.code = code
  }
}

function messageFor(code: string): string {
  switch (code) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'Microphone access is blocked. Allow it in your browser settings, or type your answer instead.'
    case 'no-speech':
      return "I didn't hear anything. Tap the microphone and try again."
    case 'network':
      return 'Speech recognition needs an internet connection in this browser. Type your answer instead.'
    case 'audio-capture':
      return 'No microphone was found.'
    default:
      return 'Speech recognition stopped unexpectedly. Try again, or type your answer.'
  }
}

/** Listen for one utterance. Call stop() to finish early. */
export function listenOnce(
  locale: string,
  onInterim?: (text: string) => void,
): { result: Promise<ListenResult>; stop: () => void } {
  const C = ctor()
  if (!C) return { result: Promise.reject(new RecognitionError('unsupported')), stop: () => {} }
  const r = new C()
  r.lang = locale
  r.interimResults = true
  r.maxAlternatives = 3
  r.continuous = false
  let finals: string[] = []
  let latest = ''
  const result = new Promise<ListenResult>((resolve, reject) => {
    let failed = false
    r.onresult = (e) => {
      const all: string[] = []
      for (let i = 0; i < e.results.length; i++) {
        const res = e.results[i]
        if (res.isFinal) {
          const alts: string[] = []
          for (let j = 0; j < res.length; j++) alts.push(res[j].transcript.trim())
          all.push(...alts)
        } else {
          latest = res[0].transcript.trim()
          onInterim?.(latest)
        }
      }
      if (all.length) finals = all
    }
    r.onerror = (e) => {
      if (e.error === 'aborted') return
      failed = true
      reject(new RecognitionError(e.error))
    }
    r.onend = () => {
      if (failed) return
      const transcripts = finals.length ? finals : latest ? [latest] : []
      if (!transcripts.length) reject(new RecognitionError('no-speech'))
      else resolve({ transcripts })
    }
  })
  try {
    r.start()
  } catch {
    return { result: Promise.reject(new RecognitionError('busy')), stop: () => {} }
  }
  return { result, stop: () => r.stop() }
}
