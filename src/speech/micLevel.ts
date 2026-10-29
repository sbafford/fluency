/*
 * A live input level while listening, so you can see whether the microphone
 * is picking you up at all. If the bar never moves, the problem is the
 * microphone (the wrong one is selected, or the browser is blocked from it),
 * not your French.
 */

export interface LevelMeter {
  stop: () => void
  /** Highest level seen so far, 0 to 1. */
  peak: () => number
}

export async function startLevelMeter(onLevel: (level: number) => void): Promise<LevelMeter | undefined> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) return undefined
  let stream: MediaStream
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })
  } catch {
    return undefined
  }
  const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctx) {
    stream.getTracks().forEach((t) => t.stop())
    return undefined
  }
  const ctx = new Ctx()
  const source = ctx.createMediaStreamSource(stream)
  const analyser = ctx.createAnalyser()
  analyser.fftSize = 1024
  source.connect(analyser)
  const data = new Float32Array(analyser.fftSize)
  let peak = 0
  let frame = 0
  const tick = () => {
    analyser.getFloatTimeDomainData(data)
    let sum = 0
    for (const v of data) sum += v * v
    // Speech at a normal distance sits around 0.02 to 0.1 RMS; scale so it fills most of the bar.
    const level = Math.min(1, Math.sqrt(sum / data.length) * 8)
    peak = Math.max(peak, level)
    onLevel(level)
    frame = requestAnimationFrame(tick)
  }
  tick()
  return {
    peak: () => peak,
    stop: () => {
      cancelAnimationFrame(frame)
      stream.getTracks().forEach((t) => t.stop())
      void ctx.close()
    },
  }
}

/** The level below which we treat the microphone as hearing nothing. */
export const SILENT_PEAK = 0.06
