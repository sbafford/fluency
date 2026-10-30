# Where fluency is up to

Paused on 30 Oct 2026. Pick up here.

## Done
- A1: Units 1–6.
- A2: Units 7–12.
  - Each unit was written, reviewed by a French reviewer, and played through in a browser.
  - All 107 tests pass.
- Features built:
  - Recorded Google voices, with the learner's name in recorded lines
  - Phrasebook
  - Fix It Now
  - Explanations for every wrong option
  - Accents guide
  - Hints
  - Carry On, for resuming lessons
  - Microphone test

## Still to run (on the Mac)
```
cd ~/Documents/fluency
npm run audio
git add -A
git commit -m "A2: Units 7 to 12"
git push
```
After the push, reload the app. Check that:
- the version line in Settings has changed
- A2 appears under Learn

## Decision: B1 waits
B1 (Units 13 onwards) won't be started until A1 and A2 have been worked through in the app. That keeps costs down: no new writing, reviewing or recorded audio until then. Feedback from working through A1 and A2 shapes what B1 needs.

## When resuming
1. Ask what felt too hard, too easy or unclear in A1 and A2, and fix that first.
2. Check the Audio You Flagged list in Settings, and re-record any lines that sound wrong.
3. Then plan B1:
   - can-do list in `src/content/fr/levels.ts`
   - units 13 onwards, using the same pattern: write, review in French, play through
4. Other ideas waiting:
   - an AI tutor (needs a backend and API credit)
   - a faith and culture pathway
   - a full wording pass
   - Test Microphone showing which mic is in use
