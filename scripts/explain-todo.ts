/*
 * Lists one unit's multiple-choice questions and which wrong options still
 * need an explanation.  npx tsx scripts/explain-todo.ts 3   (add --json for raw data)
 */
import { french } from '../src/content/fr/index'

const n = Number(process.argv[2])
const unit = french.units[n - 1]
if (!unit) {
  console.error('Usage: npx tsx scripts/explain-todo.ts <unit number>')
  process.exit(1)
}
const ex = french.explanations ?? {}
const rows = []
let missing = 0
for (const lesson of unit.lessons)
  for (const e of lesson.exercises) {
    if (e.type !== 'choose' && e.type !== 'gap' && e.type !== 'listen-choose') continue
    const wrong = e.options.filter((o) => o !== e.answer)
    const todo = wrong.filter((o) => !ex[e.id]?.why?.[o])
    missing += todo.length
    rows.push({
      id: e.id,
      lesson: lesson.title,
      type: e.type,
      question:
        e.type === 'choose'
          ? `${e.promptLang === 'target' ? 'What does this French mean?' : 'Choose the French for:'} ${e.prompt}`
          : e.type === 'gap'
            ? `${e.before ? `${e.before.speaker}: ${e.before.target} / ` : ''}${e.sentence} (${e.translation})`
            : `Listen to: "${e.audio}" and pick what was heard or meant`,
      answer: e.answer,
      wrongOptions: wrong,
      stillToExplain: todo,
      hasBecause: !!ex[e.id]?.because,
    })
  }
if (process.argv.includes('--json')) console.log(JSON.stringify(rows, null, 1))
else {
  for (const r of rows) console.log(`${r.id} [${r.type}] ${r.question}\n   answer: ${r.answer}\n   wrong: ${r.wrongOptions.join(' | ')}${r.stillToExplain.length ? `\n   TODO: ${r.stillToExplain.join(' | ')}` : ''}${r.hasBecause ? '' : '\n   TODO: because'}`)
  console.log(`\nUnit ${n}: ${rows.length} questions, ${missing} wrong options still to explain, ${rows.filter((r) => !r.hasBecause).length} without "because".`)
}
