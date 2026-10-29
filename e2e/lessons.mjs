// Plays every lesson and unit check in the given units in headless Chromium,
// checking each step renders, nothing overflows the phone width and no errors
// are logged. Run `npm run build && npx vite preview --port 4173` first.
//
//   node e2e/lessons.mjs [outDir] [firstUnit] [lastUnit]

import { chromium as pw } from 'playwright'
import fs from 'node:fs'

const out = process.argv[2] ?? 'e2e/screenshots/lessons'
const first = Number(process.argv[3] ?? 1)
const last = Number(process.argv[4] ?? 6)
fs.mkdirSync(out, { recursive: true })
const BASE = 'http://localhost:4173/'
const problems = []

// Everything before the first unit counts as finished, so its lessons are open.
const lessons = {}
for (let u = 1; u <= 6; u++) for (const l of ['l1', 'l2', 'l3', 'l4', 'l5', 'check']) lessons[`fr.u${u}.${l}`] = { attempts: 1, completedAt: 1, bestScore: 1, lastScore: 1 }
const seed = {
  version: 2,
  deviceId: 'e2e',
  activeLanguage: 'fr',
  settings: { speechInput: false, learnerName: 'Sav' },
  progress: {
    fr: { languageId: 'fr', device: 'e2e', items: {}, lessons, listening: {}, conversations: {}, days: {}, recent: [] },
  },
}

const browser = await pw.launch({ executablePath: process.env.CHROME_PATH || undefined, headless: true, args: ['--autoplay-policy=no-user-gesture-required'] })
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true, serviceWorkers: 'block' })
await ctx.addInitScript((s) => localStorage.setItem('fluency.data', s), JSON.stringify(seed))
const page = await ctx.newPage()
let current = ''
let clipsPlayed = 0
page.on('request', (r) => r.url().endsWith('.mp3') && clipsPlayed++)
page.on('pageerror', (e) => problems.push(`${current}: pageerror ${e.message}`))
page.on('console', (m) => m.type() === 'error' && problems.push(`${current}: console ${m.text()}`))

const vis = async (sel) => (await page.locator(sel).count()) > 0 && (await page.locator(sel).first().isVisible())

async function play(id) {
  current = id
  await page.goto(`${BASE}#/lesson/${id}`)
  await page.waitForSelector('button:has-text("Start Lesson"), button:has-text("Start Check"), button:has-text("Do It Again")', { timeout: 5000 })
  await page.screenshot({ path: `${out}/${id}-intro.png`, fullPage: true })
  await page.click('button:has-text("Start Lesson"), button:has-text("Start Check"), button:has-text("Do It Again")')
  let n = 0
  for (let guard = 0; guard < 160; guard++) {
    if (await page.locator('text=/Lesson Complete|Unit Check Complete/').count()) {
      await page.screenshot({ path: `${out}/${id}-done.png`, fullPage: true })
      return n
    }
    const wide = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    if (wide > 1) {
      problems.push(`${id} step ${n}: page ${wide}px wider than the phone`)
      await page.screenshot({ path: `${out}/${id}-wide-${n}.png` })
    }
    // Press every play button on screen, so each line's recording is looked up.
    for (const b of await page.locator('button[aria-label^="Play"]:visible').all()) await b.click({ timeout: 1000 }).catch(() => {})
    if (n % 4 === 0) await page.screenshot({ path: `${out}/${id}-${String(n).padStart(2, '0')}.png` })
    n++
    if (await vis('button:has-text("Continue")')) {
      await page.locator('button:has-text("Continue")').last().click()
      continue
    }
    if (await vis('button:has-text("I Said It Comfortably")')) {
      await page.click('button:has-text("I Said It Comfortably")')
      continue
    }
    if (await vis('text=Build the Sentence')) {
      await page.locator('main div.flex.flex-wrap.gap-2 > button.border:not([disabled])').first().click()
      await page.click('button:has-text("Check")')
      continue
    }
    if (await vis('input[aria-label="Your answer"]')) {
      await page.fill('input[aria-label="Your answer"]', 'bonjour')
      await page.click('button:has-text("Check")')
      continue
    }
    const opts = page.locator('div.grid.gap-2\\.5 > button:not([disabled])')
    if (await opts.count()) {
      await opts.first().click()
      continue
    }
    await page.screenshot({ path: `${out}/${id}-stuck-${n}.png` })
    problems.push(`${id}: stuck at step ${n}`)
    return n
  }
  problems.push(`${id}: did not finish`)
  return n
}

for (let u = first; u <= last; u++)
  for (const l of ['l1', 'l2', 'l3', 'l4', 'check']) {
    const id = `fr.u${u}.${l}`
    try {
      console.log(id, 'steps', await play(id))
    } catch (e) {
      problems.push(`${id}: ${e.message.split('\n')[0]}`)
    }
  }

// The new listening pieces and conversations open and render.
for (let u = first; u <= last; u++) {
  current = `practise u${u}`
  await page.goto(`${BASE}#/practise`)
  await page.waitForSelector('h1')
}
await page.screenshot({ path: `${out}/practise.png`, fullPage: true })
const links = await page.$$eval('a[href^="#/listen/"], a[href^="#/talk/"]', (as) => as.map((a) => a.getAttribute('href')))
for (const href of links) {
  current = href
  await page.goto(BASE + href)
  await page.waitForSelector('main', { timeout: 5000 }).catch(() => problems.push(`${href}: nothing rendered`))
  const wide = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  if (wide > 1) problems.push(`${href}: ${wide}px wider than the phone`)
  await page.screenshot({ path: `${out}/${href.replace(/[#/]+/g, '_')}.png`, fullPage: true })
}
console.log('practice pages', links.length)

// With recordings present, every line played should have come from a recording.
const missing = await page.evaluate(() => [...(window.__fluencyMissingClips ?? [])])
console.log('recorded clips requested', clipsPlayed, '· lines with no recording', missing.length)
if (missing.length) console.log('  ' + missing.slice(0, 40).join('\n  '))

await browser.close()
console.log(problems.length ? 'PROBLEMS\n' + problems.join('\n') : 'PROBLEMS none')
