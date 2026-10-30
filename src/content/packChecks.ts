import { describe, expect, it } from 'vitest'
import { checkAnswer, checkSlots, expandVariants } from '../engine/answers'
import { indexPack, isScored } from '../engine/session'
import type { LanguagePack } from '../engine/types'
import { narrationPlan, roleFor } from '../speech/narration'

/*
 * Content integrity checks. Every language pack must pass these, so authoring
 * mistakes (a missing answer option, a broken reference) fail the build rather
 * than surfacing mid-lesson.
 */

/** Registers the integrity tests for one pack. Reused to check a unit on its own while it is being written. */
export function describePack(pack: LanguagePack) {
  describe(`${pack.name} content`, () => {
    const index = indexPack(pack)
    const opts = { articleGroups: pack.articles.groups }
    const fill = (s: string) => s.replace('{name}', 'Sav')

    it('references only existing items', () => {
      for (const lesson of index.lessons)
        for (const ex of lesson.exercises)
          for (const id of ex.itemIds) expect(index.items.has(id), `${ex.id} -> ${id}`).toBe(true)
      for (const l of pack.listening) for (const id of l.itemIds) expect(index.items.has(id), `${l.id} -> ${id}`).toBe(true)
      for (const c of pack.conversations) for (const id of c.itemIds) expect(index.items.has(id), `${c.id} -> ${id}`).toBe(true)
    })

    it('has unique item, listening and conversation ids', () => {
      const items = index.lessons.flatMap((l) => l.items.map((i) => i.id))
      expect(items.length - new Set(items).size, 'duplicate item ids').toBe(0)
      const other = [...pack.listening.map((l) => l.id), ...pack.conversations.map((c) => c.id)]
      expect(other.length - new Set(other).size, 'duplicate listening or conversation ids').toBe(0)
    })

    it('has unique exercise ids', () => {
      const ids = index.lessons.flatMap((l) => l.exercises.map((e) => e.id))
      expect(new Set(ids).size).toBe(ids.length)
    })

    it('practises every taught item in at least one scored exercise', () => {
      for (const lesson of index.lessons) {
        const practised = new Set(lesson.exercises.filter(isScored).flatMap((e) => e.itemIds))
        for (const item of lesson.items) expect(practised.has(item.id), `${lesson.id}: ${item.id}`).toBe(true)
      }
    })

    it('introduces items before testing them', () => {
      for (const lesson of index.lessons) {
        if (lesson.kind === 'checkpoint') continue
        const own = new Set(lesson.items.map((i) => i.id))
        const presented = new Set<string>()
        for (const ex of lesson.exercises) {
          if (ex.type === 'present') ex.itemIds.forEach((id) => presented.add(id))
          if (isScored(ex) && ex.type !== 'listen-choose' && ex.type !== 'dictation')
            for (const id of ex.itemIds) if (own.has(id)) expect(presented.has(id), `${ex.id} tests ${id} before presenting it`).toBe(true)
        }
      }
    })

    it('has well-formed exercises whose own answers are accepted', () => {
      for (const lesson of index.lessons) {
        for (const ex of lesson.exercises) {
          switch (ex.type) {
            case 'note':
              expect(lesson.notes.some((n) => n.id === ex.noteId), ex.id).toBe(true)
              break
            case 'dialogue':
              expect(lesson.dialogue, ex.id).toBeDefined()
              break
            case 'choose':
            case 'listen-choose':
            case 'gap':
              expect(ex.options, ex.id).toContain(ex.answer)
              expect(new Set(ex.options).size, ex.id).toBe(ex.options.length)
              if (ex.type === 'gap') expect(ex.sentence, ex.id).toContain('___')
              break
            case 'type':
            case 'dictation':
              for (const a of ex.answers) expect(checkAnswer(a, ex.answers, opts).result, `${ex.id}: ${a}`).toBe('correct')
              break
            case 'build':
              expect(ex.answer.length, ex.id).toBeGreaterThan(1)
              for (const d of ex.distractors) expect(ex.answer, ex.id).not.toContain(d)
              break
            case 'respond':
              for (const a of ex.answers) {
                if (ex.slots) expect(checkSlots(fill(a), ex.slots).ok, `${ex.id}: ${a}`).toBe(true)
                else expect(checkAnswer(a, ex.answers, opts).result, `${ex.id}: ${a}`).toBe('correct')
              }
              break
          }
        }
      }
    })

    it('gives every dialogue line a known speaker', () => {
      for (const lesson of index.lessons)
        for (const line of lesson.dialogue?.lines ?? [])
          expect(lesson.dialogue!.speakers[line.speaker], `${lesson.id}: ${line.speaker}`).toBeDefined()
      for (const l of pack.listening) for (const line of l.lines) expect(l.speakers[line.speaker], l.id).toBeDefined()
    })

    it('uses each example to show its item in context', () => {
      for (const item of index.items.values())
        for (const ex of item.examples ?? []) {
          const variants = [item.target, ...(item.accept ?? [])].flatMap(expandVariants).map((v) => v.toLowerCase().replace(/ \?$/, ''))
          expect(variants.some((v) => ex.target.toLowerCase().replace(/’/g, "'").includes(v)), `${item.id}: ${ex.target}`).toBe(true)
        }
    })

    it('has answerable listening questions', () => {
      for (const l of pack.listening)
        for (const q of l.questions) {
          expect(q.answers.length, `${l.id}.${q.id}`).toBeGreaterThan(0)
          if (q.options) for (const a of q.answers) expect(q.options, `${l.id}.${q.id}`).toContain(a)
        }
    })

    it('accepts the model answers in every conversation', () => {
      for (const c of pack.conversations)
        for (const t of c.turns)
          if (t.kind === 'learner')
            for (const m of t.models) expect(checkSlots(fill(m), t.slots).ok, `${c.id}: ${m}`).toBe(true)
    })

    it('gives every named speaker a recorded voice, and different voices within a scene', () => {
      const n = pack.narration
      if (!n) return
      for (const role of Object.values(n.speakers)) expect(n.voices[role], role).toBeDefined()
      const scenes: { id: string; names: string[] }[] = [
        ...index.lessons.filter((l) => l.dialogue).map((l) => ({ id: l.id, names: Object.values(l.dialogue!.speakers).map((s) => s.name) })),
        ...pack.listening.map((l) => ({ id: l.id, names: Object.values(l.speakers).map((s) => s.name) })),
      ]
      for (const scene of scenes) {
        for (const name of scene.names) expect(n.speakers[name], `${scene.id}: ${name} has no voice`).toBeDefined()
        const roles = scene.names.map((name) => roleFor(n, { who: name }))
        expect(new Set(roles).size, `${scene.id}: two speakers share a voice (${scene.names.join(', ')})`).toBe(roles.length)
      }
      for (const c of pack.conversations) expect(n.speakers[c.partner.name], `${c.id}: ${c.partner.name}`).toBeDefined()
      for (const l of index.lessons)
        for (const e of l.exercises) {
          const who = e.type === 'respond' ? e.partner?.speaker : e.type === 'gap' ? e.before?.speaker : undefined
          if (who) expect(n.speakers[who], `${e.id}: ${who}`).toBeDefined()
        }
      expect(narrationPlan(pack).length).toBeGreaterThan(0)
    })

    it('has explanations that match real exercises and options', () => {
      const byId = new Map(index.lessons.flatMap((l) => l.exercises.map((e) => [e.id, e] as const)))
      for (const [id, ex] of Object.entries(pack.explanations ?? {})) {
        const e = byId.get(id)
        expect(e, `explanation for unknown exercise ${id}`).toBeDefined()
        const texts = [ex.because ?? '', ...Object.values(ex.why ?? {})]
        for (const t of texts) {
          expect(t, `${id}: no em or en dashes`).not.toMatch(/[—–]/)
          expect(t.length, `${id}: keep it short`).toBeLessThanOrEqual(220)
        }
        if (ex.why) {
          const options = e && 'options' in e ? e.options : []
          const answer = e && 'answer' in e && typeof e.answer === 'string' ? e.answer : undefined
          for (const opt of Object.keys(ex.why)) {
            expect(options, `${id}: "${opt}" is not an option`).toContain(opt)
            expect(opt, `${id}: the right answer needs no "why"`).not.toBe(answer)
          }
        }
      }
    })

    it('explains every wrong option in multiple-choice questions', () => {
      if (!pack.explanations) return
      const missing: string[] = []
      for (const l of index.lessons)
        for (const e of l.exercises)
          if (e.type === 'choose' || e.type === 'gap' || e.type === 'listen-choose')
            for (const o of e.options) if (o !== e.answer && !pack.explanations[e.id]?.why?.[o]) missing.push(`${e.id}: ${o}`)
      expect(missing.length, `wrong options with no explanation, e.g. ${missing.slice(0, 5).join(' | ')}`).toBe(0)
    })

    it('links every lesson to can-do statements defined for its level', () => {
      for (const unit of pack.units) {
        const level = pack.levels.find((l) => l.id === unit.level)!
        for (const lesson of unit.lessons)
          for (const id of lesson.canDo) expect(level.canDo.some((c) => c.id === id), `${lesson.id}: ${id}`).toBe(true)
      }
    })
  })
}
