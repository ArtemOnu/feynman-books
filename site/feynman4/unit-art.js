// Chalk sketches for the unit headers on the contents page, one per unit, drawn in the unit's colour.
// Each entry is the inside of an SVG with viewBox 0 0 600 180; keep the left ~200 px light (the unit title sits there
// on narrow screens). Classes, styled in book.html:
//   d  a stroke that draws itself in when the unit scrolls into view (--k orders the strokes)
//   t  text or a filled shape that fades in
//   a  faint chalk white instead of the unit colour;  faint  even fainter
// A sketch may add one looping motion after it is drawn: give an element a class and add a .seen .unit-art .NAME
// rule with its keyframes in book.html (see the examples there: swap-a, hop, spin, tilt, breathe, ...).
'use strict';
(() => {
  let k = 0;
  const P = (d, cls = '', extra = '') => `<path class="d ${cls}" pathLength="1" style="--k:${k++}" d="${d}" ${extra}/>`;
  const Tx = (x, y, s, size = 24, cls = '', anchor = 'start') => `<text class="t ${cls}" style="--k:${k++}" x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}">${s}</text>`;
  const C = (cx, cy, r, cls = '') => `<circle class="d ${cls}" pathLength="1" style="--k:${k++}" cx="${cx}" cy="${cy}" r="${r}"/>`;
  const reset = s => { k = 0; return s; };

  window.UNIT_ART = [
    // 1 Молекулы в движении: a box of gas, the molecules jiggling, one striking the piston
    reset(P('M250 30H560V160H250Z', 'a') + P('M520 30V160') + P('M520 95H590', 'faint') +
      [[290, 60], [340, 120], [380, 70], [430, 135], [470, 55], [310, 140], [455, 100], [395, 115]].map(([x, y]) =>
        `<circle class="t jig" cx="${x}" cy="${y}" r="7" fill="currentColor" stroke="none" style="--k:${k++}"/>`).join('') +
      Tx(580, 22, 'PV = NkT', 20, 'a', 'end')),
    // 2 Теплота: a Carnot cycle on the p–V plane
    reset(P('M250 20V165H580', 'a') + P('M290 40C330 55 370 70 420 80C450 100 480 125 530 140C470 135 420 128 380 118C350 95 320 65 290 40', 'diag') +
      Tx(262, 30, 'p', 22, 'a') + Tx(578, 160, 'V', 22, 'a', 'end') + Tx(470, 75, 'T₁', 20) + Tx(330, 120, 'T₂', 20)),
    // 3 Звук: a standing wave breathing between its nodes
    reset(P('M230 140H580', 'a') + `<g class="breathe">` + P('M240 140Q283 40 327 140T413 140T500 140T580 140') + `</g>` +
      P('M240 140Q283 240 327 140T413 140T500 140T580 140', 'faint') + Tx(575, 30, 'f, 2f, 3f…', 20, 'a', 'end')),
    // 4 Симметрия: a hand and its mirror image across the mirror line
    reset(P('M410 15V170', 'a') + `<g class="swap-a">` + P('M330 60L370 60L370 130L340 130Z') + `</g>` +
      `<g class="swap-b">` + P('M490 60L450 60L450 130L480 130Z', 'faint') + `</g>` + Tx(580, 30, 'P', 22, 'a', 'end')),
  ];
})();
