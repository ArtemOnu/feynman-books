# Фейнмановские лекции по физике, т. 4 — book plan

Volume 4 of the same edition; follows every convention of `books/feynman1/BOOK.md` (readers: 1st-year students; Russian; silent read-along with captions; chalkboard look; code/SVG only; helpers in `lib/atoms.js`). This file lists only what differs.

## Intake
- Slug: `feynman4` · Source: `book.pdf` (scan of «Фейнмановские лекции по физике», вып. 4 «Кинетика. Теплота. Звук», Мир 1965; image-only, the contents pages have a broken-encoding text layer) · Page map: `sections.json` (PDF page = printed page − 1) · 257 pages, chapters 39–52 in 4 units.
- Chapters keep the book's numbers (39–52): folders `ch39`…`ch52`, `CHAPTER.number` 39…52; the cover counts from `FIRST = 39`.
- Engine and cover are copies of volume 2's (Russian UI, silent mode, decimal comma).

## Units
«Молекулы в движении» (39–43), «Теплота» (44–46), «Звук» (47–51), «Симметрия» (52).

## Helpers added in this volume (`lib/atoms.js`, never redeclare in a page)
- `eq(p, str, x, y, t0, {size, fill, anchor})` formula line (MATH font + `subify`), `axesT(p, x0, y0, w, h, t0, lab, tlab)` (symmetric ±h), `axesP(p, x0, y0, w, h, t0, lab, tlab)` (positive quadrant), `curve(fn, x0, y0, sx, sy, t1, n, ta)` path of y = fn(t) for t in [ta, t1].
- `wrapList(p, m, [[text, mark], …])` numbered takeaways; `introCard(m, D, unit, num, title, sub)` the intro beat (needs `[[sub]]`).
- Atom `He` (small yellow) and `B` (big Brownian ball) already exist in `EL`.
- Traps met in this volume: engine globals `X`, `Y`, `TW` collide with chapter constants (rename: `XV`, `XF`, `TSPAN`); `subify` subscripts only one character (write `n(пар)`, `v(др)`, not `n_пар`); `-x ** 2` is a syntax error (write `-(x ** 2)`); prompts/why texts are HTML — write `exp(−W/kT)`, not `e^{…}`.

## Visual models
- Gas in a box with a piston (`pistonBox` in ch39 — copy if needed), p–V diagrams, Boltzmann exponentials / atmosphere, random walks, Carnot cycles, ratchet, wave on a string / pressure waves, beats, standing waves and harmonics, mirror symmetry.

## Workflow
`python tools/feynman4/pairs.py chNN` → `chapters/chNN.md` → `content/feynman4/chNN/narration.ru.json` → `python tools/feynman4/silent_timings.py …` → `site/feynman4/chNN/index.html` → shot.py + check_blank.py (`--url http://localhost:8765/feynman4/`) → register (UNITS, previous `next`, `chapters.md`).

## Status (2026-10-16)
- All 14 chapters (39–52) ready and registered; next-links 39→52; whole-volume blank check passes; cover/contents load without console errors.
- Chapters 46–52 are compact (one practice screen each) to fit the session budget; earlier ones have two.
- Pending: narration audio (needs uv + ffmpeg), the user's review.
