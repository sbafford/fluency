// Screenshots of every screen at phone and desktop sizes, light and dark.
// Usage: node e2e/screens.mjs <seed.json> <outDir> [light|dark]
import { chromium } from 'playwright'
import fs from 'node:fs'
const [seedFile, out, theme = 'light'] = process.argv.slice(2)
fs.mkdirSync(out, { recursive: true })
const seed = JSON.parse(fs.readFileSync(seedFile, 'utf8'))
seed.settings.theme = theme
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined })
const errors = []
const sizes = { desk: { width: 1280, height: 820 }, phone: { width: 390, height: 844 } }
const routes = [
  ['today', '#/'], ['learn', '#/learn'], ['practise', '#/practise'], ['progress', '#/progress'], ['settings', '#/settings'],
  ['lesson-intro', '#/lesson/fr.u2.l3'], ['review', '#/review/due'], ['listen', '#/listen/fr.u2.listen.station'], ['talk', '#/talk/fr.u2.talk.table'],
]
for (const [sizeName, viewport] of Object.entries(sizes)) {
  const ctx = await b.newContext({ viewport, deviceScaleFactor: 1, serviceWorkers: 'block', isMobile: sizeName === 'phone', hasTouch: sizeName === 'phone' })
  await ctx.addInitScript((s) => localStorage.setItem('fluency.data', s), JSON.stringify(seed))
  const page = await ctx.newPage()
  await page.clock.install({ time: new Date('2026-10-29T19:30:00') })
  page.on('pageerror', (e) => errors.push(sizeName + ' ' + e.message))
  for (const [name, hash] of routes) {
    await page.goto('http://localhost:4173/' + hash)
    await page.waitForTimeout(500)
    await page.evaluate(() => document.fonts.ready)
    await page.screenshot({ path: `${out}/${sizeName}-${name}.png`, fullPage: name !== 'review' && name !== 'talk' })
  }
  // A lesson exercise with the correct, nearly and wrong sheets.
  await page.goto('http://localhost:4173/#/lesson/fr.u2.l3')
  await page.click('button:has-text("Start Lesson")')
  await page.waitForTimeout(300)
  await page.screenshot({ path: `${out}/${sizeName}-lesson-dialogue.png` })
  for (let i = 0; i < 2; i++) { await page.click('button:has-text("Continue")'); await page.waitForTimeout(150) }
  await page.screenshot({ path: `${out}/${sizeName}-lesson-choice.png` })
  // Revision: pick an option to show the sheet.
  await page.goto('http://localhost:4173/#/review/due')
  await page.waitForTimeout(400)
  const opt = page.locator('main button.min-h-14').first()
  if (await opt.count()) { await opt.click(); await page.waitForTimeout(300); await page.screenshot({ path: `${out}/${sizeName}-review-sheet.png` }) }
  else {
    const input = page.locator('input[aria-label="Your answer"]')
    if (await input.count()) {
      await input.fill('à demain')
      await page.click('button:has-text("Check")')
      await page.waitForTimeout(300)
      await page.screenshot({ path: `${out}/${sizeName}-review-sheet.png` })
    }
  }
  await ctx.close()
}
console.log('ERRORS', errors.length ? errors : 'none')
await b.close()
