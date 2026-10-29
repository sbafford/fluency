# fluency

A personal language-learning app. French first, built so other languages can be added as content rather than code.

It runs entirely in the browser: no account, no database, no paid services. Progress is saved in the browser and can be exported and imported as a JSON backup.

## Run it

You need [Node.js](https://nodejs.org) 20 or later.

```bash
npm install
npm run dev
```

Open the URL it prints (usually http://localhost:5173). To use it on your phone on the same Wi-Fi, open the "Network" URL it prints instead.

Other commands:

| Command | What it does |
| --- | --- |
| `npm test` | Runs the unit and content tests |
| `npm run typecheck` | Checks types |
| `npm run build` | Builds a static site into `dist/` |
| `npm run preview` | Serves the built site at http://localhost:4173 |
| `npm run e2e` | Walks through a full lesson, revision, listening and conversation in headless Chromium (run `npm run preview` first; the first time, run `npx playwright install chromium`) |

## Using it on several devices

**Sync.** In Settings, under *Sync between devices*, paste a GitHub fine-grained token with the Gists permission (read and write) on each device. Progress is merged through a secret gist on your account: no server, no cost. It syncs when the app opens, when you switch away from it, and shortly after you practise. The token stays in that browser; it isn't exported or synced. Secret gists are unlisted rather than private (anyone with the exact link could read it), and the file holds only learning progress and your name.

**Hosting.** To open the app on your phone, it needs to be online. Pushing to `main` runs `.github/workflows/deploy.yml`, which tests, builds and publishes to GitHub Pages. One-time setup on GitHub: *Settings > Pages > Source: GitHub Actions*. Pages is free for public repositories; for a private repository it needs a paid GitHub plan. Nothing secret is in the code, so a public repository is fine.

**Install.** Once hosted, open it in Safari on iPhone and choose *Share > Add to Home Screen* (or *Install app* in Chrome). It then opens full screen and works offline; sync catches up when you're back online.

**Without sync**, use *Settings > Export backup* on one device and *Import backup* on the other.

## How it's organised

```
src/
  engine/      Language-agnostic learning logic: answer checking, spaced repetition,
               sessions, progress, statistics, storage. Pure functions, fully tested.
  content/     Language packs. content/fr/ is the French course; content/index.ts lists packs.
  speech/      Browser text-to-speech and speech recognition.
  sync/        Sync through a GitHub gist; merging lives in engine/merge.ts.
  tutor/       The tutor interface and the scripted tutor used now.
  state/       App state (one saved document) and a small hash router.
  ui/          Shared components and one component per exercise type.
  screens/     Today, Learn, Practise, Progress, Settings, and the lesson, revision,
               listening and conversation screens.
```

### Adding a language

1. Copy `src/content/fr/` to a new folder, such as `src/content/es/`.
2. Change the pack settings in its `index.ts`: id, names, locale (e.g. `es-ES`), preferred voices, accented characters and article groups.
3. Write the units, listening pieces and conversations.
4. List the pack in `src/content/index.ts`.

The content tests in `src/content/content.test.ts` run against every pack and catch broken references, missing answer options, model answers the checker would reject, and items that are taught but never practised.

### Changing the look

Colours are the design tokens from the Fluency design handoff, at the top of `src/index.css` (paper, ink, a rose accent, and fixed pink, yellow and strength colours). Light and dark follow the device, or the Appearance choice in Settings. Lessons, revision, listening and conversations open in a focused full-screen layout with a sticky action bar and a feedback sheet. `node e2e/screens.mjs` screenshots every screen on desktop and phone. Typefaces: Archivo (variable, with its width axis) for the interface, Instrument Serif for the language being learned (bundled locally, so they work offline).

## How learning works

- **Lessons** move from recognising a phrase, to understanding it in a conversation, to recalling it, building sentences, hearing it at natural speed and saying it. Lessons open in order.
- **Spaced repetition** schedules every word and phrase separately for recognition, recall and listening, so knowing a word when you see it doesn't count as being able to produce it. Intervals grow only once per day, however often an item is drilled.
- **Wrong answers** come back once at the end of the session, and first in revision. Mistakes are classified (accents, gender, word order, missing words and so on) and shown on the Progress screen.
- **Progress** separates accuracy from retention: "on later days" counts only answers about material first met on an earlier day. A level ability counts as demonstrated only when its lessons are passed at 80% and their words are recalled on later days.

See `DECISIONS.md` for the reasoning behind these choices and the known limitations.
