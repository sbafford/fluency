import { expandVariants } from '../engine/answers'
import type { LanguagePack, Narration } from '../engine/types'

/*
 * Recorded audio. Every French line the app can say is listed by
 * narrationPlan, recorded once (scripts/record-audio.ts) and played from
 * public/audio/<pack>/. Anything missing falls back to the device voice.
 */

export interface Manifest {
  /** Role to voice name, as recorded. */
  voices: Record<string, string>
  /** clipKey(role, text) to file name. */
  clips: Record<string, string>
}

export interface Line {
  role: string
  text: string
}

/** The exact form audio is looked up by: optional endings like "(e)" dropped, tidy spacing, straight apostrophes. */
export function clipText(text: string): string {
  return text
    .replace(/\((\p{L}{1,3})\)/gu, '')
    .normalize('NFC').replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim()
}

export function clipKey(role: string, text: string): string {
  return `${role}|${clipText(text)}`
}

/** Which recorded voice reads a line: the speaker's own, or the narrator or second voice. */
export function roleFor(narration: Narration, opts: { who?: string; voice?: 'a' | 'b' } = {}): string {
  if (opts.who && narration.speakers[opts.who]) return narration.speakers[opts.who]
  return opts.voice === 'b' ? narration.second : narration.narrator
}

/** Every line the app can play, with the voice that reads it. */
export function narrationPlan(pack: LanguagePack): Line[] {
  const n = pack.narration
  if (!n) return []
  const lines = new Map<string, Line>()
  const add = (text: string | undefined, opts: { who?: string; voice?: 'a' | 'b' } = {}) => {
    if (!text || text.includes('{name}')) return
    const role = roleFor(n, opts)
    lines.set(clipKey(role, text), { role, text: clipText(text) })
  }
  const narrate = (text?: string) => add(text)

  for (const unit of pack.units)
    for (const lesson of unit.lessons) {
      for (const item of lesson.items) {
        for (const v of [item.target, ...(item.accept ?? [])].flatMap(expandVariants)) narrate(v)
        for (const ex of item.examples ?? []) narrate(ex.target)
      }
      const d = lesson.dialogue
      for (const line of d?.lines ?? []) add(line.target, { who: d!.speakers[line.speaker]?.name, voice: d!.speakers[line.speaker]?.voice })
      for (const ex of lesson.exercises) {
        switch (ex.type) {
          case 'listen-choose':
            narrate(ex.audio)
            break
          case 'dictation':
            narrate(ex.audio)
            // The feedback plays back whichever accepted answer was closest to what you typed.
            ex.answers.forEach(narrate)
            break
          case 'speak':
            narrate(ex.target)
            break
          case 'choose':
            narrate(ex.promptLang === 'target' ? ex.prompt : ex.answer)
            break
          case 'gap':
            narrate(ex.sentence.replace('___', ex.answer))
            if (ex.before) add(ex.before.target, { who: ex.before.speaker, voice: 'b' })
            break
          case 'type':
            ex.answers.flatMap(expandVariants).forEach(narrate)
            break
          case 'build':
            narrate(ex.answer.join(' '))
            break
          case 'respond':
            if (ex.partner) add(ex.partner.target, { who: ex.partner.speaker, voice: 'b' })
            ex.answers.forEach(narrate)
            break
        }
      }
    }

  for (const piece of pack.listening)
    for (const line of piece.lines) add(line.target, { who: piece.speakers[line.speaker]?.name, voice: piece.speakers[line.speaker]?.voice })

  for (const c of pack.conversations)
    for (const t of c.turns) {
      if (t.kind === 'partner') add(t.target, { who: c.partner.name, voice: c.partner.voice })
      else narrate(t.models[0])
    }

  return [...lines.values()]
}
