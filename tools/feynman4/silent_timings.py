"""Timings for a silent read-along chapter (no audio yet).

Usage (from the project root):
    python tools/feynman4/silent_timings.py content/feynman4/ch01/narration.ru.json site/feynman4/ch01/audio/ru

Writes timings.js in the same shape tts.py produces (dur, marks, cues), estimating
the time of each word from a comfortable reading pace, so [[marks]] drive the picture
exactly as they will once real narration is synthesized. When audio is added later,
run tts.py on the same narration file and remove CHAPTER.audio = false.
"""

import json
import re
import sys
from pathlib import Path

MARK = re.compile(r"\[\[(\w+)\]\]")
CPS = 13.0       # reading pace, characters per second (Russian, read along with a picture)
SENT_PAUSE = .45  # extra time after each sentence
LEAD = .3         # first word appears after this


def split_marks(raw):
    marks, clean, pos = {}, [], 0
    for i, part in enumerate(MARK.split(raw)):
        if i % 2:
            if part in marks:
                raise SystemExit(f"duplicate mark {part!r}")
            marks[part] = pos
        else:
            clean.append(part)
            pos += len(part)
    return "".join(clean), marks


def clock(clean):
    """Time at each char position: linear reading with a pause after sentence ends."""
    t, out = LEAD, []
    for i, ch in enumerate(clean):
        out.append(t)
        t += 1 / CPS
        if ch in ".?!…" and (i + 1 == len(clean) or clean[i + 1] == " "):
            t += SENT_PAUSE
    return out, t


def main(src, out_dir):
    spec = json.loads(Path(src).read_text(encoding="utf-8"))
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    res = {}
    for beat, raw in spec["beats"].items():
        clean, marks = split_marks(raw)
        at, end = clock(clean)
        def word_at(pos):
            while pos < len(clean) and clean[pos] == " ":
                pos += 1
            if pos >= len(clean):
                raise SystemExit(f"{beat}: mark at the end of the text")
            return round(at[pos], 3)
        cues, start = [], 0
        for m in list(re.finditer(r"[.?!…]\s+", clean)) + [None]:
            e = m.end() if m else len(clean)
            s = clean[start:e].strip()
            if s:
                cues.append([word_at(start + len(clean[start:e]) - len(clean[start:e].lstrip())), s])
            start = e
        res[beat] = {"dur": round(end + .2, 3), "marks": {k: word_at(p) for k, p in marks.items()}, "cues": cues}
    (out_dir / "timings.js").write_text("window.TIMINGS = " + json.dumps(res, ensure_ascii=False, indent=1) + ";\n", encoding="utf-8")
    print(f"{len(res)} beats, {sum(v['dur'] for v in res.values()):.0f} s of reading")


if __name__ == "__main__":
    main(*sys.argv[1:3])
