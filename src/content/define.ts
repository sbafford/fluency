import type { Exercise, LearningItem } from '../engine/types'

/*
 * Small helpers that keep curriculum files readable. They only assign ids;
 * all content stays plain data.
 */

type ItemDraft = Omit<LearningItem, 'id'>

/** Define items under a prefix. Keys become the last part of each id. */
export function defineItems<K extends string>(prefix: string, drafts: Record<K, ItemDraft>): Record<K, LearningItem> {
  const out = {} as Record<K, LearningItem>
  for (const key of Object.keys(drafts) as K[]) out[key] = { id: `${prefix}.${key}`, ...drafts[key] }
  return out
}

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never
export type ExerciseDraft = DistributiveOmit<Exercise, 'id' | 'itemIds'> & { items?: LearningItem[] }

/** Number exercises in order and turn item references into ids. */
export function steps(prefix: string, drafts: ExerciseDraft[]): Exercise[] {
  return drafts.map((d, i) => {
    const { items, ...rest } = d
    return { ...rest, id: `${prefix}.s${i + 1}`, itemIds: (items ?? []).map((it) => it.id) } as Exercise
  })
}
