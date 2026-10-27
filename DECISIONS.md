# Decisions

A running record of significant choices, so they can be revisited deliberately.

## Milestone 1 (October 2026)

**Stack: React, TypeScript, Vite, Tailwind, Vitest.** As briefed. No router library: a 60-line hash router is enough and keeps static hosting simple.

**Everything stored as one versioned JSON document in localStorage.** Simple, offline, no account. Export and import use the same document. `migrate()` in `src/engine/storage.ts` is where future schema changes go. If stored data can't be read, it is copied aside rather than overwritten.

**Navigation: four tabs, not six.** The brief proposed Today, Learn, Conversation, Listening, Revision and Progress. Six tabs don't fit a phone. Revision, Listening and Conversation are grouped under Practise; Today also surfaces due revision and the next listening and conversation pieces.

**Lessons unlock in order.** Keeps the curriculum's intended progression. Revision adapts to weaknesses within what has been taught.

**Scheduler: simplified SM-2, per item and per skill.** Recognition, recall and listening are scheduled separately. An interval advances at most once per day. Speaking is measured but not scheduled, because browser speech recognition is too inconsistent to drive timing. When a lesson ends, skills it didn't test are enrolled staggered over three days so one lesson doesn't create a single heavy review day. This is deliberately simple and well tested; a model such as FSRS could replace `review()` in `src/engine/srs.ts` later without touching anything else.

**Answer checking is generous on surface, strict on meaning.** Case, punctuation, apostrophe style and spacing are ignored. Missing accents and one-letter slips count as correct but are flagged. Wrong articles, gender, word order and missing words are wrong, and classified.

**Free responses use slots.** Conversation and some lesson replies are accepted when they contain each required part (e.g. a greeting and your name), so you can phrase things your own way. This is the main limitation of scripted feedback; an AI tutor would handle open answers properly.

**Speech uses the browser.** Text-to-speech quality depends on installed voices (good on Apple devices and in Chrome). Speech recognition works in Chrome, Edge and Safari, not Firefox; in Chrome it sends audio to Google and needs a connection. It checks you were understood, not your accent. Without it, speaking exercises fall back to honest self-rating, and every audio exercise has a transcript.

**Faith and culture pathway: slot reserved, not built.** `LanguagePack.pathways` takes optional units without touching the core course. Nothing in the core lessons depends on it.

**AI tutor: interface only.** `src/tutor/provider.ts` defines `TutorProvider`; the scripted tutor implements it. A Claude-backed tutor would need a small backend so the API key never reaches the browser. Claude subscriptions, including Max, don't include API usage: the API is billed separately per token, so check current pricing before building it.

**Content is original.** Dialogues, exercises and descriptors were written for this app. Level descriptors are guided by the public CEFR descriptors, not copied from any course.

## Milestone 2 (October 2026)

**Sync through a GitHub gist.** Free, no server to run, and uses an account already in use. Each device pulls, merges and pushes. Alternatives considered: a hosted database (needs an account and a backend), iCloud or Drive files (no browser API). The token lives only in the browser's storage, outside the exported and synced document.

**Merging is safe to repeat and order-independent.** Each skill of each item keeps the most recently reviewed copy; lessons keep the best score and earliest completion; recent answers are combined without duplicates. Two devices reviewing the same item between syncs: the later review wins, rather than combining histories.

**Daily logs are per device (data version 2).** Otherwise the same day practised on two devices would be undercounted or double counted. Version 1 data upgrades automatically, and its logs are attributed to the device it was on.

**Installable and offline.** A web app manifest and service worker (vite-plugin-pwa) make it installable from the browser and usable without a connection.

**Unit 2: Les chiffres et le temps.** Numbers 11 to 100, age with avoir, telling the time (including the 24-hour clock), days of the week and making plans, plus a unit check, two listening pieces (a station announcement and a phone booking) and two conversations.

## Known limitations

- A1 has two units so far. Not yet covered: describing people and places, likes and dislikes, shopping beyond the café, directions, and writing short messages.
- Sync needs a GitHub token on each device. If two devices review the same item between syncs, only the later review's scheduling is kept.
- Dates (months, "le 3 mars") are not taught yet.
- Lessons 3 and 4 are on the long side (20+ steps); worth splitting once more content exists.
- The accent colour is a placeholder until the personal palette is supplied.
