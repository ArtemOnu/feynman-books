"""Screenshot problems of the problem book and report page errors.

    python tools/chertov/shot.py s01 1-6 1-11 [--sol] [--out DIR]
"""
import asyncio, sys
from pathlib import Path
from playwright.async_api import async_playwright

args = [a for a in sys.argv[1:] if not a.startswith('--')]
sec, ids = args[0], args[1:]
out = Path(next((a.split('=', 1)[1] for a in sys.argv if a.startswith('--out=')), 'shots'))
sol = '--sol' in sys.argv
out.mkdir(parents=True, exist_ok=True)

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': 1280, 'height': 1000})
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto(f'http://localhost:8765/chertov/{sec}/')
        await pg.wait_for_timeout(1200)
        if not ids:
            ids.extend(await pg.evaluate('PROBLEMS.map(p => p.id)'))
        for i in ids:
            await pg.evaluate(f'render(PROBLEMS.findIndex(p => p.id === {i!r}))')
            if sol:
                await pg.evaluate("document.getElementById('sol').classList.add('show'); document.getElementById('answer').classList.add('show')")
            await pg.wait_for_timeout(300)
            await pg.screenshot(path=str(out / f'{i.replace(" ", "_")}.png'), full_page=True)
        print('errors:', errs or 'none')
        await b.close()

asyncio.run(main())

# Contact sheet of figures:  python tools/chertov/shot.py s01 --figs --out=DIR
