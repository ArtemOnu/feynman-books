"""Contact sheets of all figures of a section (for review): python tools/chertov/figs.py s01 OUTDIR"""
import asyncio, sys, io
from pathlib import Path
from PIL import Image
from playwright.async_api import async_playwright

sec, out = sys.argv[1], Path(sys.argv[2]); out.mkdir(parents=True, exist_ok=True)

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 1280, 'height': 1000}); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto(f'http://localhost:8765/chertov/{sec}/'); await pg.wait_for_timeout(1200)
        ids = await pg.evaluate('PROBLEMS.map(p => p.id)'); tiles = []
        for i in ids:
            await pg.evaluate(f'render(PROBLEMS.findIndex(p => p.id === {i!r}))'); await pg.wait_for_timeout(150)
            el = await pg.query_selector('.fig')
            im = Image.open(io.BytesIO(await el.screenshot())).convert('RGB') if el else Image.new('RGB', (600, 300), 'black')
            im.thumbnail((620, 330)); tiles.append((i, im))
        for k in range(0, len(tiles), 12):
            part = tiles[k:k + 12]; S = Image.new('RGB', (3 * 620, 4 * 340), (15, 22, 19))
            from PIL import ImageDraw
            d = ImageDraw.Draw(S)
            for j, (i, im) in enumerate(part):
                x, y = (j % 3) * 620, (j // 3) * 340; S.paste(im, (x, y + 10)); d.text((x + 6, y), i, fill=(240, 180, 90))
            S.save(out / f'figs_{k // 12}.png')
        print('errors:', errs or 'none', len(ids), 'problems'); await b.close()

asyncio.run(main())
