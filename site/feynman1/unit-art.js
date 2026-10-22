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
    // 1 Картина мира: a water molecule and atoms that never stop jiggling
    reset(C(330, 92, 30) + C(296, 122, 17, 'a') + C(364, 122, 17, 'a') +
      [[440, 60, 14], [480, 110, 11], [520, 70, 16], [560, 125, 12], [250, 50, 10], [420, 140, 9]]
        .map(([x, y, r]) => `<circle class="t jig" style="--k:${k++}" cx="${x}" cy="${y}" r="${r}" fill="currentColor" fill-opacity=".55"/>`).join('') +
      Tx(330, 170, 'H₂O', 22, 'a', 'middle')),
    // 2 Большие идеи: an orbit seen at a slant, a planet circling the Sun
    reset(P('M250 95a170 62 0 1 0 340 0a170 62 0 1 0 -340 0') + C(420, 95, 13) +
      `<circle class="t hop" r="9" fill="currentColor" stroke="none" style="--k:${k++};offset-path:path('M250 95a170 62 0 1 0 340 0a170 62 0 1 0 -340 0')"/>` +
      Tx(560, 30, 'F = GmM/r²', 22, 'a', 'end')),
    // 3 Механика: a thrown ball along its parabola, with axes
    reset(P('M230 160H580', 'a') + P('M240 170V20', 'a') + P('M250 150Q390 -40 560 150', 'faint') +
      `<circle class="t hop" r="10" fill="currentColor" stroke="none" style="--k:${k++};offset-path:path('M250 150Q390 -40 560 150')"/>` +
      Tx(575, 40, 'F = ma', 24, 'a', 'end')),
    // 4 Силы и работа: a block on a ramp, the ramp tilting a little, force arrows
    reset(`<g class="tilt">` + P('M240 150H560L560 60Z', 'a') + P('M420 112l38 -22l14 24l-38 22Z') + P('M444 113l-60 35', '', 'marker-end=""') +
      P('M446 112v52') + `</g>` + Tx(560, 175, 'A = ∫F·ds', 22, 'a', 'end')),
  ];
})();
