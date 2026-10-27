/*
 * Core types for the learning engine.
 *
 * Everything here is language-agnostic. A language pack (see src/content)
 * supplies the curriculum as plain data matching these shapes, and the engine
 * never needs to know which language it is teaching.
 */

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

/** The skills the engine tracks for every learning item. */
export type Skill = 'recognition' | 'recall' | 'listening' | 'speaking'

/** Skills that are scheduled for spaced review. Speaking is measured but not scheduled,
 *  because browser speech recognition is too inconsistent to drive review timing. */
export const SCHEDULED_SKILLS = ['recognition', 'recall', 'listening'] as const
export type ScheduledSkill = (typeof SCHEDULED_SKILLS)[number]

export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

export interface Example {
  /** Sentence in the language being learned. */
  target: string
  /** Meaning in the learner's language. */
  native: string
}

export interface LearningItem {
  /** Globally unique, e.g. "fr.u1.bonjour". */
  id: string
  kind: 'word' | 'phrase' | 'pattern'
  /** Canonical form in the language being learned. Use "(e)" for optional endings, e.g. "enchanté(e)". */
  target: string
  /** Meaning in the learner's language. */
  native: string
  /** Other forms accepted when the learner types the target. */
  accept?: string[]
  /** Other meanings accepted when the learner types a translation. */
  acceptNative?: string[]
  register?: 'formal' | 'informal'
  /** Short usage note shown when the item is introduced or answered wrongly. */
  note?: string
  /** Fresh contexts used to reintroduce the item during revision. Each must contain `target` verbatim. */
  examples?: Example[]
}

export interface GrammarNote {
  id: string
  title: string
  /** Paragraphs of plain text. `*word*` renders as emphasis on the target language. */
  body: string[]
  /** When `header` is true, the first row labels the columns. */
  table?: { caption?: string; header?: boolean; rows: string[][] }
  examples?: Example[]
}

export interface Speaker {
  name: string
  /** Which of the two configured voices reads this speaker's lines. */
  voice: 'a' | 'b'
  /** Optional pitch shift (0.5 to 2), to tell apart two speakers sharing a voice. */
  pitch?: number
}

export interface DialogueLine {
  speaker: string
  target: string
  native: string
}

export interface Dialogue {
  id: string
  title: string
  /** One sentence setting the scene, in the learner's language. */
  setting: string
  speakers: Record<string, Speaker>
  lines: DialogueLine[]
}

interface ExerciseBase {
  id: string
  /** Items this exercise practises. Results are recorded against each one. */
  itemIds: string[]
}

/** Not scored: plays the lesson dialogue. */
export interface DialogueStep extends ExerciseBase {
  type: 'dialogue'
}
/** Not scored: introduces new items as cards. */
export interface PresentStep extends ExerciseBase {
  type: 'present'
}
/** Not scored: shows a grammar note. */
export interface NoteStep extends ExerciseBase {
  type: 'note'
  noteId: string
}
/** Recognition: pick the meaning or form from options. */
export interface ChooseExercise extends ExerciseBase {
  type: 'choose'
  prompt: string
  promptLang: 'target' | 'native'
  options: string[]
  answer: string
}
/** Listening recognition: hear the target language, pick the meaning. */
export interface ListenChooseExercise extends ExerciseBase {
  type: 'listen-choose'
  audio: string
  options: string[]
  answer: string
}
/** Understanding in context: complete a line of conversation. */
export interface GapExercise extends ExerciseBase {
  type: 'gap'
  /** Optional preceding line, shown for context. */
  before?: DialogueLine
  /** Sentence with "___" marking the gap. */
  sentence: string
  translation: string
  options: string[]
  answer: string
}
/** Recall: produce the target language from a prompt. */
export interface TypeExercise extends ExerciseBase {
  type: 'type'
  prompt: string
  /** Optional context, such as a sentence with the missing part shown as "___". */
  context?: string
  answers: string[]
  hint?: string
}
/** Sentence construction from tiles. */
export interface BuildExercise extends ExerciseBase {
  type: 'build'
  prompt: string
  /** Correct sequence of tiles. */
  answer: string[]
  /** Extra tiles that do not belong. */
  distractors: string[]
}
/** Listening recall: hear and write. */
export interface DictationExercise extends ExerciseBase {
  type: 'dictation'
  audio: string
  translation: string
  answers: string[]
}
/** Speaking: say a phrase aloud. "{name}" is replaced with the learner's name. */
export interface SpeakExercise extends ExerciseBase {
  type: 'speak'
  target: string
  native: string
}
/** Production in context: respond to a situation in your own words. */
export interface RespondExercise extends ExerciseBase {
  type: 'respond'
  situation: string
  partner?: DialogueLine
  /** Model answers. "{name}" is replaced with the learner's name. Without slots, any of these is correct. */
  answers: string[]
  /** When present, a response is correct if it contains every slot, so learners can use their own words. */
  slots?: ResponseSlot[]
}

export type Exercise =
  | DialogueStep
  | PresentStep
  | NoteStep
  | ChooseExercise
  | ListenChooseExercise
  | GapExercise
  | TypeExercise
  | BuildExercise
  | DictationExercise
  | SpeakExercise
  | RespondExercise

export type ScoredExercise = Exclude<Exercise, DialogueStep | PresentStep | NoteStep>

export interface CultureNote {
  title: string
  body: string[]
}

export interface Lesson {
  id: string
  kind: 'lesson' | 'checkpoint'
  /** Title in the target language. */
  title: string
  /** What the lesson is about, in the learner's language. */
  subtitle: string
  /** Practical outcomes for this lesson, written as "I can..." statements. */
  objectives: string[]
  /** Can-do descriptors (from the level) this lesson contributes to. */
  canDo: string[]
  minutes: number
  items: LearningItem[]
  dialogue?: Dialogue
  notes: GrammarNote[]
  culture?: CultureNote
  exercises: Exercise[]
}

export interface Unit {
  id: string
  level: CefrLevel
  title: string
  subtitle: string
  lessons: Lesson[]
}

export interface CanDo {
  id: string
  skill: 'listening' | 'speaking' | 'reading' | 'writing' | 'interaction'
  text: string
}

export interface LevelDefinition {
  id: CefrLevel
  name: string
  summary: string
  canDo: CanDo[]
}

export interface ListeningQuestion {
  id: string
  question: string
  /** If options are present the question is multiple choice; otherwise it is typed. */
  options?: string[]
  answers: string[]
  /** Language the typed answer should be in. */
  answerLang?: 'target' | 'native'
}

export interface ListeningPiece {
  id: string
  unitId: string
  level: CefrLevel
  title: string
  kind: 'dialogue' | 'announcement' | 'monologue'
  setting: string
  speakers: Record<string, Speaker>
  lines: DialogueLine[]
  questions: ListeningQuestion[]
  itemIds: string[]
}

/** A slot is one thing a learner response must contain, with accepted wordings. */
export interface ResponseSlot {
  /** What this part of the answer does, e.g. "say your name". */
  label: string
  any: string[]
}

export type ConversationTurn =
  | { kind: 'partner'; target: string; native: string }
  | {
      kind: 'learner'
      /** What the learner should do, in their own language. */
      goal: string
      slots: ResponseSlot[]
      /** Model answers. "{name}" is replaced with the learner's name. */
      models: string[]
      tip?: string
    }

export interface Conversation {
  id: string
  unitId: string
  level: CefrLevel
  title: string
  setting: string
  register: 'formal' | 'informal'
  partner: Speaker
  turns: ConversationTurn[]
  itemIds: string[]
}

/** An optional pathway, such as the future faith and culture module. */
export interface Pathway {
  id: string
  title: string
  description: string
  units: Unit[]
}

export interface LanguagePack {
  id: string
  name: string
  nativeName: string
  /** BCP 47 locale used for speech, e.g. "fr-FR". */
  locale: string
  /** Voice names to prefer, in order, when several are installed. */
  preferredVoices: string[]
  /** Characters offered on the on-screen accent bar. */
  specialCharacters: string[]
  /** Articles and determiners, used to recognise article and gender mistakes. */
  articles: { groups: string[][] }
  levels: LevelDefinition[]
  units: Unit[]
  listening: ListeningPiece[]
  conversations: Conversation[]
  pathways: Pathway[]
}

/* ------------------------------------------------------------------ */
/* Progress                                                            */
/* ------------------------------------------------------------------ */

export type AnswerResult = 'correct' | 'near' | 'wrong'

export type ErrorType =
  | 'accent'
  | 'typo'
  | 'article'
  | 'gender'
  | 'word-order'
  | 'missing-word'
  | 'extra-word'
  | 'wrong-word'
  | 'meaning'

export type Grade = 'again' | 'hard' | 'good'

export interface Track {
  /** Epoch ms when this is next due. */
  due: number
  /** Current interval in days. 0 means relearning. */
  interval: number
  ease: number
  /** Successful reviews in a row on separate days. */
  reps: number
  lapses: number
  last?: number
  seen: number
  correct: number
}

export interface ItemProgress {
  firstSeen: number
  tracks: Partial<Record<Skill, Track>>
  errors: Partial<Record<ErrorType, number>>
}

export interface LessonProgress {
  attempts: number
  completedAt?: number
  bestScore: number
  lastScore: number
}

export interface ActivityProgress {
  attempts: number
  completedAt?: number
  bestScore: number
}

export interface DayLog {
  answered: number
  correct: number
  lessons: number
  reviews: number
  activeMs: number
}

export interface Attempt {
  t: number
  itemIds: string[]
  skill: Skill
  result: AnswerResult
  errorType?: ErrorType
  /** True when the item had already been seen on an earlier day: a genuine retention test. */
  retention: boolean
}

export interface ProgressState {
  languageId: string
  items: Record<string, ItemProgress>
  lessons: Record<string, LessonProgress>
  listening: Record<string, ActivityProgress>
  conversations: Record<string, ActivityProgress>
  /** Keyed by local date, YYYY-MM-DD. */
  days: Record<string, DayLog>
  /** Most recent attempts, newest last, capped. */
  recent: Attempt[]
}

export type SpeechRate = 'slow' | 'normal' | 'natural'

export interface Settings {
  learnerName: string
  /** Answered exercises per day that count as meeting the goal. */
  dailyGoal: number
  rate: SpeechRate
  speechInput: boolean
  voiceA?: string
  voiceB?: string
  /** Show translations under target-language lines by default. */
  showTranslations: boolean
}

export interface AppData {
  version: 1
  activeLanguage: string
  settings: Settings
  progress: Record<string, ProgressState>
}
