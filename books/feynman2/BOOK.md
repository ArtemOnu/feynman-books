# Фейнмановские лекции по физике, т. 2 — book plan

Volume 2 of the same edition; follows every convention of `books/feynman1/BOOK.md` (readers: 1st-year students; Russian; silent read-along with captions; chalkboard look; code/SVG only; helpers in `lib/atoms.js`). This file lists only what differs.

## Intake
- Slug: `feynman2` · Source: `book.pdf` (scan of «Фейнмановские лекции по физике», вып. 2 «Пространство. Время. Движение», Мир 1965; image-only) · Page map: `sections.json` (PDF page = printed page − 2) · 164 pages, chapters 15–25 in 3 units.
- Chapters keep the book's numbers (15–25): folders `ch15`…`ch25`, `CHAPTER.number` 15…25; the cover counts from `FIRST = 15`.
- Engine, `atoms.js` and cover are copies of volume 1's (Russian UI, silent mode, decimal comma).

## Units
«Относительность» (15–17), «Вращение» (18–20), «Колебания» (21–25).

## Visual models
- Light clock / moving frames with x′, t′ (15), rapidity and spacetime diagrams with light cones (16–17), rotating rigid bodies, torque arms, gyroscope (18–20), phasors on the complex plane (21–23), resonance curves and damped decays (23–24), circuit analogues (23–25).

## Workflow
`python tools/feynman2/pairs.py chNN` → `chapters/chNN.md` → `content/feynman2/chNN/narration.ru.json` → `python tools/feynman2/silent_timings.py …` → `site/feynman2/chNN/index.html` → shot.py + check_blank.py (`--url http://localhost:8765/feynman2/`) → register (UNITS, previous `next`, `chapters.md`).

## Status (2026-10-16)
- All 11 chapters (15–25) ready and registered; next-links 15→25; whole-volume blank check passes; no console errors.
- Pending: narration audio (needs uv + ffmpeg), the user's review.
