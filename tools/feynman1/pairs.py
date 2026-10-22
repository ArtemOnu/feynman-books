"""Render a chapter's scanned pages side by side in pairs, for reading (the scan has no text layer).

    python tools/feynman1/pairs.py ch02      ->  books/feynman1/pages/ch02/pair_NNNN.png
"""
import json, sys
from pathlib import Path
import pymupdf
from PIL import Image

ch = sys.argv[1]
root = Path(__file__).resolve().parents[2] / "books/feynman1"
sec = next(s for s in json.loads((root / "sections.json").read_text(encoding="utf-8")) if s["folder"] == ch)
out = root / "pages" / ch
out.mkdir(parents=True, exist_ok=True)
doc = pymupdf.open(root / "book.pdf")
ims = []
for n in range(sec["start"], sec["end"] + 1):
    pm = doc[n - 1].get_pixmap(dpi=110)
    im = Image.frombytes("RGB", (pm.width, pm.height), pm.samples)
    if im.convert("L").getextrema()[0] < 200:   # skip blank pages
        ims.append((n, im))
for k in range(0, len(ims), 2):
    part = ims[k:k + 2]
    W, H = sum(i.width for _, i in part), max(i.height for _, i in part)
    S = Image.new("RGB", (W, H), "white"); x = 0
    for _, i in part:
        S.paste(i, (x, 0)); x += i.width
    S.save(out / f"pair_{part[0][0]:04d}.png")
print(sec["title"], [n for n, _ in ims][::2])
