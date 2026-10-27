// End-to-end walkthrough in headless Chromium: a full lesson, next-day revision,
// listening, conversation, progress and settings, on phone and desktop sizes.
// Run `npm run build && npm run preview` in one terminal, then `npm run e2e`.

import { chromium as pw } from 'playwright'

const out = process.argv[2] ?? 'e2e/screenshots'
await import('node:fs').then((fs) => fs.mkdirSync(out, { recursive: true }))
const BASE = 'http://localhost:4173/'
const errors = []

const browser = await pw.launch({ executablePath: process.env.CHROME_PATH || undefined, headless: true })
const phone = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, serviceWorkers: 'block' }
const ctx = await browser.newContext(phone)

// A stand-in for the GitHub gists API, shared by both simulated devices.
const gists = new Map()
async function fakeGitHub(route) {
  const req = route.request()
  const url = new URL(req.url())
  const method = req.method()
  if (req.headers()['authorization'] !== 'Bearer test-token') return route.fulfill({ status: 401, body: '{}' })
  const json = (body, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) })
  const one = url.pathname.match(/^\/gists\/(\w+)$/)
  if (method === 'GET' && url.pathname === '/gists') return json([...gists.values()])
  if (method === 'GET' && one) return gists.has(one[1]) ? json(gists.get(one[1])) : json({}, 404)
  const body = req.postData() ? JSON.parse(req.postData()) : {}
  const files = Object.fromEntries(Object.entries(body.files ?? {}).map(([k, v]) => [k, { filename: k, content: v.content }]))
  if (method === 'POST') {
    const id = 'gist' + (gists.size + 1)
    gists.set(id, { id, description: body.description, files })
    return json(gists.get(id), 201)
  }
  if (method === 'PATCH' && one) {
    Object.assign(gists.get(one[1]).files, files)
    return json(gists.get(one[1]))
  }
  return json({}, 404)
}
await ctx.route('https://api.github.com/**', fakeGitHub)
const page = await ctx.newPage()
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
page.on('console', (m) => m.type() === 'error' && errors.push('console: ' + m.text()))

const start = new Date('2026-10-27T09:00:00')
await page.clock.install({ time: start })
// Speech input off, so speaking falls back to self-assessment in headless mode.
await page.addInitScript(() => {
  if (!localStorage.getItem('fluency.data'))
    localStorage.setItem(
      'fluency.data',
      JSON.stringify({ version: 1, activeLanguage: 'fr', settings: { speechInput: false }, progress: { fr: {} } }),
    )
})
await page.goto(BASE)
await page.waitForSelector('h1')
await page.screenshot({ path: `${out}/01-today-empty.png`, fullPage: true })

// Set a name through the Today prompt.
await page.fill('input[placeholder="Your first name"]', 'Sav')
await page.click('button:has-text("Save")')
await page.screenshot({ path: `${out}/02-today-named.png` })

await page.locator('nav a:visible', { hasText: 'Learn' }).click()
await page.waitForSelector('text=Premiers pas')
await page.screenshot({ path: `${out}/03-learn.png`, fullPage: true })

async function runLesson(lessonTitle, shots, { smart = true } = {}) {
  let n = 0
  for (let guard = 0; guard < 120; guard++) {
    if (await page.locator('text=/Lesson complete|Unit check complete|Revision complete|Practice complete/').count()) return n
    const vis = async (sel) => (await page.locator(sel).count()) > 0 && (await page.locator(sel).first().isVisible())
    if (shots.has(n)) await page.screenshot({ path: `${out}/${lessonTitle}-${String(n).padStart(2, '0')}.png` })
    n++
    // Feedback sheet or unscored step.
    if (await vis('button:has-text("Continue")')) {
      await page.locator('button:has-text("Continue")').last().click()
      continue
    }
    if (await vis('button:has-text("I said it comfortably")')) {
      await page.click('button:has-text("I said it comfortably")')
      continue
    }
    if (await vis('text=Build the sentence in French')) {
      const tiles = page.locator('div.mb-6.flex.flex-wrap button:not([disabled])')
      await tiles.first().click()
      await page.click('button:has-text("Check")')
      continue
    }
    if (await vis('input[aria-label="Your answer"]')) {
      await page.fill('input[aria-label="Your answer"]', smart ? 'bonjour' : 'xx')
      await page.click('button:has-text("Check")')
      continue
    }
    const opts = page.locator('div.grid.gap-2\\.5 > button:not([disabled])')
    if (await opts.count()) {
      await opts.first().click()
      continue
    }
    await page.screenshot({ path: `${out}/stuck-${lessonTitle}-${n}.png` })
    throw new Error(`Stuck in ${lessonTitle} at step ${n}`)
  }
  throw new Error('Lesson did not finish')
}

await page.click('text=Bonjour !')
await page.waitForSelector('text=By the end, you can')
await page.screenshot({ path: `${out}/04-lesson-intro.png` })
await page.click('button:has-text("Start lesson")')
const steps = await runLesson('l1', new Set([0, 1, 2, 3, 5, 6, 9, 12, 14, 16, 18]))
await page.screenshot({ path: `${out}/05-lesson-done.png`, fullPage: true })
console.log('lesson 1 steps:', steps)

// Today after the lesson.
await page.click('text=Back to today')
await page.waitForSelector('h1')
await page.screenshot({ path: `${out}/06-today-after.png`, fullPage: true })

// Next day: revision should be due.
await page.clock.setFixedTime(new Date('2026-10-28T08:30:00'))
await page.reload()
await page.waitForSelector('h1')
await page.screenshot({ path: `${out}/07-today-nextday.png`, fullPage: true })
const due = await page.locator('text=/to revise/').first().textContent()
console.log('due next day:', due)
await page.click('text=Start revision')
await runLesson('review', new Set([0, 3, 6]))
await page.screenshot({ path: `${out}/08-review-done.png`, fullPage: true })

// Listening
await page.goto(BASE + '#/listen/fr.u1.listen.hotel')
await page.waitForSelector('text=Questions')
await page.click('text=Show transcript')
await page.screenshot({ path: `${out}/09-listening.png`, fullPage: true })
for (const t of ['Evening', 'Zurich', 'Swiss']) await page.click(`button:has-text("${t}")`)
await page.fill('input[aria-label="What is her room number? Type the number."]', '10')
await page.click('text=Check answers')
await page.screenshot({ path: `${out}/10-listening-checked.png`, fullPage: true })
console.log('listening:', await page.locator('text=/of 4 right/').textContent())

// Conversation
await page.goto(BASE + '#/talk/fr.u1.talk.arrival')
await page.waitForSelector('text=Your turn')
await page.fill('input[aria-label="Your reply"]', 'Bonjour, je mapelle Sav')
await page.click('button[aria-label="Send"]')
await page.screenshot({ path: `${out}/11-talk-feedback.png` })
await page.fill('input[aria-label="Your reply"]', "Bonjour, je m'appelle Sav")
await page.click('button[aria-label="Send"]')
await page.fill('input[aria-label="Your reply"]', "Je viens d'Australie")
await page.click('button[aria-label="Send"]')
await page.fill('input[aria-label="Your reply"]', "Tu habites à Perth ? J'habite à Perth.")
await page.click('button[aria-label="Send"]')
await page.fill('input[aria-label="Your reply"]', 'Merci, au revoir !')
await page.click('button[aria-label="Send"]')
await page.waitForSelector('text=Conversation complete')
await page.screenshot({ path: `${out}/12-talk-done.png`, fullPage: true })

await page.goto(BASE + '#/progress')
await page.waitForSelector('text=Skills')
await page.screenshot({ path: `${out}/13-progress.png`, fullPage: true })
await page.goto(BASE + '#/settings')
await page.screenshot({ path: `${out}/14-settings.png`, fullPage: true })
await page.goto(BASE + '#/practise')
await page.screenshot({ path: `${out}/15-practise.png`, fullPage: true })

// Desktop layout
await page.setViewportSize({ width: 1280, height: 860 })
await page.goto(BASE)
await page.waitForSelector('h1')
await page.screenshot({ path: `${out}/16-desktop-today.png`, fullPage: true })
await page.goto(BASE + '#/lesson/fr.u1.l2')
await page.click('button:has-text("Start lesson")')
await page.click('button:has-text("Continue")')
await page.click('button:has-text("Continue")')
await page.screenshot({ path: `${out}/17-desktop-exercise.png` })

// Persistence: data survives a reload, and export produces a backup.
const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('fluency.data')))
console.log('saved lessons:', Object.keys(saved.progress.fr.lessons), 'items:', Object.keys(saved.progress.fr.items).length)

// Sync: connect this device, then a second device picks up the progress.
await page.setViewportSize({ width: 390, height: 844 })
await page.goto(BASE + '#/settings')
await page.fill('input[aria-label="GitHub token"]', 'test-token')
await page.click('button:has-text("Connect")')
await page.locator('p', { hasText: /^Synced / }).waitFor()
await page.screenshot({ path: `${out}/18-sync-connected.png`, fullPage: true })
console.log('gists after first sync:', gists.size)

const ctx2 = await browser.newContext(phone)
await ctx2.route('https://api.github.com/**', fakeGitHub)
const page2 = await ctx2.newPage()
page2.on('pageerror', (e) => errors.push('device 2 pageerror: ' + e.message))
await page2.clock.install({ time: new Date('2026-10-28T10:00:00') })
await page2.addInitScript(() => {
  if (!localStorage.getItem('fluency.data'))
    localStorage.setItem('fluency.data', JSON.stringify({ version: 2, deviceId: 'tablet', activeLanguage: 'fr', settings: { speechInput: false }, progress: { fr: {} } }))
})
await page2.goto(BASE + '#/settings')
await page2.fill('input[aria-label="GitHub token"]', 'test-token')
await page2.click('button:has-text("Connect")')
await page2.locator('p', { hasText: /^Synced / }).waitFor()
await page2.goto(BASE + '#/learn')
await page2.waitForSelector('text=Premiers pas')
const done2 = await page2.locator('text=/Best \\d+%/').count()
console.log('device 2 sees completed lessons:', done2, 'gists:', gists.size)
await page2.goto(BASE)
await page2.waitForSelector('h1')
console.log('device 2 greeting:', (await page2.locator('h1').first().textContent()).trim())
console.log('device 2 sync badge:', await page2.locator('a[aria-label^="Sync status"]:visible').first().textContent())
await page2.screenshot({ path: `${out}/19-device2-today.png`, fullPage: true })

// Unit 2: unlock it on device 2 by marking Unit 1 complete, then take the time lesson.
await page2.evaluate(() => {
  const d = JSON.parse(localStorage.getItem('fluency.data'))
  for (const id of ['fr.u1.l1', 'fr.u1.l2', 'fr.u1.l3', 'fr.u1.l4', 'fr.u1.check', 'fr.u2.l1', 'fr.u2.l2'])
    d.progress.fr.lessons[id] = { attempts: 1, completedAt: Date.now(), bestScore: 1, lastScore: 1 }
  localStorage.setItem('fluency.data', JSON.stringify(d))
})
await page2.goto(BASE + '#/lesson/fr.u2.l3')
await page2.reload()
await page2.waitForSelector('text=By the end, you can')
await page2.screenshot({ path: `${out}/20-u2-intro.png` })
await page2.click('button:has-text("Start lesson")')
const runner = async () => {
  for (let guard = 0; guard < 150; guard++) {
    if (await page2.locator('text=/Lesson complete/').count()) return guard
    const vis = async (sel) => (await page2.locator(sel).count()) > 0 && (await page2.locator(sel).first().isVisible())
    if (guard === 7 || guard === 12) await page2.screenshot({ path: `${out}/21-u2-step-${guard}.png` })
    if (await vis('button:has-text("Continue")')) { await page2.locator('button:has-text("Continue")').last().click(); continue }
    if (await vis('button:has-text("I said it comfortably")')) { await page2.click('button:has-text("I said it comfortably")'); continue }
    if (await vis('text=Build the sentence in French')) {
      await page2.locator('div.mb-6.flex.flex-wrap button:not([disabled])').first().click()
      await page2.click('button:has-text("Check")')
      continue
    }
    if (await vis('input[aria-label="Your answer"]')) {
      await page2.fill('input[aria-label="Your answer"]', 'il est midi')
      await page2.click('button:has-text("Check")')
      continue
    }
    const opts = page2.locator('div.grid.gap-2\\.5 > button:not([disabled])')
    if (await opts.count()) { await opts.first().click(); continue }
    throw new Error('Stuck in unit 2 lesson at ' + guard)
  }
}
console.log('unit 2 lesson steps:', await runner())
await page2.screenshot({ path: `${out}/22-u2-done.png`, fullPage: true })

console.log('ERRORS:', errors.length ? errors.join('\n') : 'none')
await browser.close()
