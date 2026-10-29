import { afterEach, describe, expect, it, vi } from 'vitest'
import { voicesFor } from './tts'

const voice = (name: string, lang: string) => ({ name, lang }) as SpeechSynthesisVoice

function withVoices(list: SpeechSynthesisVoice[]) {
  vi.stubGlobal('speechSynthesis', { getVoices: () => list })
}

afterEach(() => vi.unstubAllGlobals())

describe('voice choice', () => {
  it('prefers a France-French voice over a Canadian one, and premium over compact', () => {
    withVoices([
      voice('Amélie', 'fr-CA'),
      voice('Thomas', 'fr-FR'),
      voice('Audrey (Premium)', 'fr-FR'),
      voice('Grandma (French (France))', 'fr-FR'),
      voice('Samantha', 'en-US'),
    ])
    const names = voicesFor('fr-FR', ['Audrey', 'Thomas']).map((v) => v.name)
    expect(names[0]).toBe('Audrey (Premium)')
    expect(names[1]).toBe('Thomas')
    expect(names.indexOf('Amélie')).toBeGreaterThan(names.indexOf('Thomas'))
    expect(names.at(-1)).toBe('Grandma (French (France))')
    expect(names).not.toContain('Samantha')
  })
})
