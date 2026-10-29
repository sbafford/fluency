# fluency

A personal language-learning app. French first, built so other languages can be added as content rather than code.

The French course covers the whole of A1 in six units (24 lessons and 6 unit checks), with 12 listening pieces and 12 conversations.

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
| `node e2e/lessons.mjs out 3 6` | Plays every lesson and unit check in units 3 to 6, and opens every listening piece and conversation, checking for errors and phone-width overflow (needs the preview running) |
| `npm run e2e` | Walks through a full lesson, revision, listening and conversation in headless Chromium (run `npm run preview` first; the first time, run `npx playwright install chromium`) |

## Using it on several devices

**Sync.** In Settings, under *Sync between devices*, paste a GitHub fine-grained token with the Gists permission (read and write) on each device. Progress is merged through a secret gist on your account: no server, no cost. It syncs when the app opens, when you switch away from it, and shortly after you practise. The token stays in that browser; it isn't exported or synced. Secret gists are unlisted rather than private (anyone with the exact link could read it), and the file holds only learning progress and your name.

**Hosting.** To open the app on your phone, it needs to be online. Pushing to `main` runs `.github/workflows/deploy.yml`, which tests, builds and publishes to GitHub Pages. One-time setup on GitHub: *Settings > Pages > Source: GitHub Actions*. Pages is free for public repositories; for a private repository it needs a paid GitHub plan. Nothing secret is in the code, so a public repository is fine.

**Install.** Once hosted, open it in Safari on iPhone and choose *Share > Add to Home Screen* (or *Install app* in Chrome). It then opens full screen and works offline; sync catches up when you're back online.

**Without sync**, use *Settings > Export backup* on one device and *Import backup* on the other.

## Recorded audio

French lines are recorded once with Google Cloud Text-to-Speech (Chirp 3 HD voices) and served from `public/audio/fr/`, so every device hears the same natural voices. Lines without a recording (anything with your name in it, or anything new) use the device voice.

1. In Google Cloud, create a project, enable billing and the *Cloud Text-to-Speech API*, and create an API key restricted to that API. Set a small budget alert.
2. Put the key in `.env.local` in the project folder: `GOOGLE_TTS_KEY=...`. Files ending in `.local` are never committed.
3. `npm run audio:samples` records one sentence in every voice into `audio-samples/` so you can choose. Voices are set in `src/content/fr/narration.ts`.
4. `npm run audio:check` shows what would be recorded and how many characters, without calling Google.
5. `npm run audio` records anything not yet recorded, then commit `public/audio/`. Re-running only records new or changed lines; changing a voice re-records that voice's lines.

All of A1 is about 37,000 characters, well inside the free monthly allowance (1 million characters for Chirp 3 HD voices at the time of writing). In the app, *Sounds Wrong?* on the feedback sheet flags a line; flagged lines are listed in Settings to copy.

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

The content tests (`src/content/packChecks.ts`, run by `content.test.ts`) run against every pack and catch broken references, missing answer options, model answers the checker would reject, and items that are taught but never practised.

### Changing the look

Colours are the design tokens from the Fluency design handoff, at the top of `src/index.css` (paper, ink, a rose accent, and fixed pink, yellow and strength colours). Light and dark follow the device, or the Appearance choice in Settings. Lessons, revision, listening and conversations open in a focused full-screen layout with a sticky action bar and a feedback sheet. `node e2e/screens.mjs` screenshots every screen on desktop and phone. Typefaces: Archivo (variable, with its width axis) for the interface, Instrument Serif for the language being learned (bundled locally, so they work offline).

## How learning works

- **Lessons** move from recognising a phrase, to understanding it in a conversation, to recalling it, building sentences, hearing it at natural speed and saying it. Lessons open in order.
- **Spaced repetition** schedules every word and phrase separately for recognition, recall and listening, so knowing a word when you see it doesn't count as being able to produce it. Intervals grow only once per day, however often an item is drilled.
- **Wrong answers** come back once at the end of the session, and first in revision. Mistakes are classified (accents, gender, word order, missing words and so on) and shown on the Progress screen.
- **Progress** separates accuracy from retention: "on later days" counts only answers about material first met on an earlier day. A level ability counts as demonstrated only when its lessons are passed at 80% and their words are recalled on later days.

See `DECISIONS.md` for the reasoning behind these choices and the known limitations.
