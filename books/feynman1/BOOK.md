# Фейнмановские лекции по физике, т. 1 — book plan

Read this compact current state for chapter work. The chapter map/status lives in `chapters.md`; storyboards, errata and feedback live in `chapters/chNN.md`.

## Intake
- Readers: first-year university students (derivatives, vectors and orders of magnitude are fine) · Tone: Feynman's — curious, direct, a little playful, never childish · Narration language: Russian · Guide character: default infinity guide.
- Slug: `feynman1` · Primary language code: `ru` · Asset approach: code/SVG only; explanations, examples and drawings are re-created, not copied from the scan.
- Source: `book.pdf` (scan of Р. Фейнман, Р. Лейтон, М. Сэндс, «Фейнмановские лекции по физике», вып. 1, Мир; image-only, no text layer, no bookmarks) · Page map: `sections.json` (PDF page = printed page − 1 from ch. 2 on) · 260 pages, 14 chapters in 4 units.
- Scope: all 14 chapters (user request, 2026-10-06); ch01 is the pilot.

## Conventions
- **Silent read-along (no audio yet, user decision).** `CHAPTER.audio = false`; the narration JSON is still written as speech and timed by `tools/feynman1/silent_timings.py` (13 chars/s + 0.45 s per sentence) into `audio/ru/timings.js`. Captions are on by default and carry the narration. To add sound later: run `tts.py` on the same `narration.ru.json` (voice `ru-RU-DmitryNeural`, rate `-4%`) and drop `audio: false`.
- Captions sit at the bottom of the stage: keep important drawings and labels above y ≈ 730 in lesson beats.
- Engine UI is translated to Russian in `site/feynman1/lib/engine.js`; typed answers accept a decimal comma (0,5).
- Look: the engine chalkboard. Atoms are shaded balls in fixed element colours (see `lib/atoms.js`, `EL`): O red, H chalk white, N blue, C warm grey, Na⁺ violet, Cl⁻ green. Heat / energy / speed = `COL.task` orange; right = `COL.good`, wrong/crossed-out = `COL.bad`.
- Text: Russian in `T()` (sans); formulas with Latin variables in `M()`; chemical formulas with Unicode subscripts via `chem()` (never `M()`, which italicises capitals). Numbers: decimal comma, thin space in thousands, ×10ⁿ powers; approximations with ≈.
- Narration: «вы», short sentences, Feynman's examples and jokes kept where they teach; numbers in words only where the TTS would misread them.
- Questions: 3–5 quick checks per chapter between lesson beats, then 2–3 practice screens. Prefer acting on the picture (`pickEls`), then `grid` true/false, `choice`, `blanks` for numeric estimates.

## Visual models / available helpers
- `lib/atoms.js` (ch01+): `EL`, `atom(p, el, o)`, `mol(p, kind, o)` (H2O, O2, N2, CO, CO2), `chem(p, str, o)`, `rng(seed)`, `bounce(x0, v, t, a, b)`, `motion(items, f, t0, dur)` (seekable continuous motion: positions are pure functions of beat time), `vec(p, x1, y1, x2, y2, colr)` arrow.
- Also in `lib/atoms.js` (shared by every chapter — never redeclare them in a page): `txt(p, str, x, y, t0, opts)` fading text, `head(p, str, t0)` beat heading at (96, 92), `italic(e)`, `WATER`, `waterBox(...)`, `gas(p, n, box, seed, opts)` + `gasAt(it, t, box)` bouncing particles, `touches(...)`, `kf(t, frames)` keyframes, `smooth(a, b, t)`, `clamp01`, `clipCircle`, `ru(v)` Russian number format, `subify(textEl)` real subscripts for `v_y`.
- Silent mode note: a `prog` that must see other tweens' final values (e.g. a line through moving beads) needs a second `prog` starting after them — `evalTo(Infinity)` runs tweens in start-time order on replays.
- Candidate models for later chapters: energy "blocks" bookkeeping (ch4), powers-of-ten ruler (ch5), random walk / Galton board (ch6), orbit + ellipse construction (ch7), x–t and v–t graphs with tangent and area (ch8), step-by-step numerical integration table (ch9), carts and collisions (ch10), arrows on a grid with rotating axes (ch11), force diagrams (ch12), work as area / gravitational field (ch13–14).

## Current decisions
- Units: «Картина мира» (1–3), «Большие идеи» (4–7), «Механика» (8–10), «Силы и работа» (11–14).

## Status (2026-10-09)
- All 14 chapters ready and registered (cover, contents, next-links ch01→ch14). Whole-book blank check passes; every chapter loads without console errors.
- Not yet done: narration audio (needs uv + ffmpeg; run tts.py per chapter, then drop `audio: false`). The user has not yet reviewed the chapters.
- Per-chapter workflow (for fixes): `python tools/feynman1/pairs.py chNN` → `chapters/chNN.md` → `content/feynman1/chNN/narration.ru.json` → `python tools/feynman1/silent_timings.py …` → `site/feynman1/chNN/index.html` → shot.py + check_blank.py.
- Tooling: a scratch venv with pymupdf/pillow/playwright (no uv/ffmpeg on this machine); preview config `.claude/launch.json` («book», port 8765).
