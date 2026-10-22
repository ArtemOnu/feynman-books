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
    // 1 Относительность: a light cone with a world line inside it
    reset(P('M250 170L410 10', 'a') + P('M570 170L410 10', 'a') + P('M310 170L410 10L510 170', 'faint') + P('M400 170Q420 100 412 10') +
      `<circle class="t hop" r="7" fill="currentColor" stroke="none" style="--k:${k++};offset-path:path('M400 170Q420 100 412 10')"/>` +
      Tx(580, 40, 'ct', 22, 'a', 'end') + Tx(580, 160, 'x', 22, 'a', 'end')),
    // 2 Вращение: a wheel spinning on its axle with an angular-momentum arrow
    reset(P('M300 95H560', 'a') + `<g class="spin">` + C(320, 95, 60) + P('M320 35V155M260 95H380', 'faint') + `</g>` +
      P('M400 95H540') + P('M528 87L544 95L528 103') + Tx(560, 80, 'L = Iω', 22, 'a', 'end')),
    // 3 Колебания: a damped oscillation under its envelope
    reset(P('M230 95H580', 'a') + P('M240 30Q330 60 420 85T580 93', 'faint') + P('M240 160Q330 130 420 105T580 97', 'faint') +
      P('M240 30C260 30 270 160 290 156C310 152 320 50 340 54C360 58 370 135 390 132C410 129 420 70 440 72C460 74 470 118 490 116C510 114 520 85 540 86C555 87 565 104 580 102') +
      Tx(575, 30, 'e⁻ᵞᵗᐟ²', 20, 'a', 'end')),
  ];
})();
