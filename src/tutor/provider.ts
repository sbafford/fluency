import { checkSlots } from '../engine/answers'
import type { Conversation, ConversationTurn } from '../engine/types'

/*
 * The tutor is behind a small interface so the scripted version used now can
 * later be swapped for an AI tutor (for example, one calling the Claude API
 * through a backend) without changing the conversation screen.
 */

export interface TutorRequest {
  conversation: Conversation
  turn: Extract<ConversationTurn, { kind: 'learner' }>
  response: string
  learnerName: string
  attempt: number
}

export interface TutorFeedback {
  ok: boolean
  /** Short feedback for the learner. */
  message: string
  /** What the response still needs, in the learner's language. */
  missing: string[]
  /** Parts that look nearly right, probably a spelling slip. */
  nearly: string[]
  /** A natural model answer. */
  model: string
  /** A note about tu/vous if the response used the less suitable form. */
  register?: string
}

export interface TutorProvider {
  id: string
  label: string
  evaluate(req: TutorRequest): Promise<TutorFeedback>
}

const TU = /(^|\s)(tu|toi|te|ton|ta|tes|t')(\s|$|\p{L})/u
const VOUS = /(^|\s)(vous|votre|vos)(\s|$)/u

export function fillName(text: string, name: string): string {
  return text.replaceAll('{name}', name.trim() || 'Sarah')
}

export const scriptedTutor: TutorProvider = {
  id: 'scripted',
  label: 'Scripted feedback',
  async evaluate({ conversation, turn, response, learnerName }) {
    const result = checkSlots(response, turn.slots)
    const model = fillName(turn.models[0], learnerName)
    const lower = ' ' + response.toLowerCase().replace(/[’']/g, "' ") + ' '
    let register: string | undefined
    if (conversation.register === 'formal' && TU.test(lower))
      register = 'In this situation, vous is more natural than tu.'
    if (conversation.register === 'informal' && VOUS.test(lower))
      register = 'Among friends, tu and toi sound more natural than vous.'

    if (result.ok) {
      return { ok: true, message: register ? 'Understood.' : 'Good.', missing: [], nearly: [], model, register }
    }
    const message =
      result.nearMisses.length === result.missing.length
        ? 'Nearly. Check the spelling.'
        : `Your answer still needs to ${result.missing.join(' and ')}.`
    return { ok: false, message, missing: result.missing, nearly: result.nearMisses, model, register }
  },
}
