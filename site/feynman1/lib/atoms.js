// Atoms and molecules for the Feynman book: shaded balls in fixed element colours,
// chemical formulas, and seekable continuous motion (positions are pure functions of beat time).
'use strict';
const EL = {
  O: { fill: '#f07a6a', r: 22 },
  H: { fill: '#f2efe6', r: 13 },
  N: { fill: '#7fbfe6', r: 21 },
  C: { fill: '#b5ada0', r: 21 },
  Na: { fill: '#bba8ee', r: 16 },
  Cl: { fill: '#8fd6b0', r: 27 },
  He: { fill: '#f3c95c', r: 14 },
  B: { fill: '#f0b45a', r: 60 },      // the big "ball" of Brownian motion
};
(function atomDefs() {
  const defs = document.querySelector('#stage defs');
  const shade = (c, k) => '#' + [1, 3, 5].map(i => Math.max(0, Math.min(255, Math.round(parseInt(c.slice(i, i + 2), 16) * k)))
    .toString(16).padStart(2, '0')).join('');
  for (const k in EL) {
    const g = mk('radialGradient', { id: 'ball-' + k, cx: .36, cy: .32, r: .72 }, defs);
    mk('stop', { offset: 0, 'stop-color': shade(EL[k].fill, 1.18) }, g);
    mk('stop', { offset: .55, 'stop-color': EL[k].fill }, g);
    mk('stop', { offset: 1, 'stop-color': shade(EL[k].fill, .55) }, g);
  }
})();

// One atom centred on its own origin. charge: '+' | '−' draws the ion sign.
function atom(p, el, { x = 0, y = 0, r, o = 1, s = 1, charge } = {}) {
  const g = G(p, { x, y, o, s });
  const rr = r ?? EL[el].r;
  mk('circle', { r: rr, fill: `url(#ball-${el})`, stroke: 'rgba(0,0,0,.35)', 'stroke-width': 1.5 }, g);
  if (charge) T(g, charge, { y: rr * .36, size: rr * 1.05, fill: '#1d2b27', weight: 700, anchor: 'middle' });
  g._el = el;
  return g;
}
// Molecules, drawn around their centre. Coordinates in pixels at the book's usual scale (O radius 22).
const MOL = {
  H2O: [['O', 0, -6], ['H', -21.4, 10.4], ['H', 21.4, 10.4]],     // 0,957 Å at 28 px/Å, H–O–H ≈ 105°
  O2: [['O', -14, 0], ['O', 14, 0]],
  N2: [['N', -13, 0], ['N', 13, 0]],
  CO: [['C', -13, 0], ['O', 15, 0]],
  CO2: [['O', -30, 0], ['C', 0, 0], ['O', 30, 0]],
};
function mol(p, kind, { x = 0, y = 0, r = 0, o = 1, s = 1 } = {}) {
  const g = G(p, { x, y, r, o, s });
  for (const [el, dx, dy] of MOL[kind]) atom(g, el, { x: dx, y: dy });
  g._kind = kind;
  return g;
}
// Chemical formula as text: digits after a letter become subscripts (H2O → H₂O); ^+ / ^- become ⁺ / ⁻.
const SUB = '₀₁₂₃₄₅₆₇₈₉';
const chemStr = str => str.replace(/([A-Za-z)])(\d+)/g, (_, a, d) => a + [...d].map(c => SUB[c]).join('')).replace(/\^\+/g, '⁺').replace(/\^-/g, '⁻');
function chem(p, str, { x = 0, y = 0, size = 34, fill = COL.chalk, anchor = 'middle', o = 1, weight = 500 } = {}) {
  return T(p, chemStr(str), { x, y, size, fill, anchor, o, weight, font: MATH });
}

// Deterministic random numbers (mulberry32).
function rng(seed) {
  return () => {
    seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
// A point moving at speed v from x0, reflecting between walls a and b.
function bounce(x0, v, t, a, b) {
  const L = b - a, u = (((x0 - a + v * t) % (2 * L)) + 2 * L) % (2 * L);
  return a + (u <= L ? u : 2 * L - u);
}
// Continuous motion for a beat: f(item, t) returns state for item.el at beat-relative time t (seconds).
// Runs from t0 for dur seconds on the beat clock, so seeking and replays give the same picture.
function motion(items, f, t0, dur) {
  prog(q => { const t = q * dur; for (const it of items) put(it.el, f(it, t)); }, t0, dur, lin);
}
// A small thermal wobble around (x0, y0): two incommensurate sines per axis.
function wobble(it, t, amp) {
  const { ph = 0, w = 7 } = it;
  return {
    x: it.x0 + amp * (Math.sin(w * t + ph) + .45 * Math.sin(1.73 * w * t + 2.1 * ph)),
    y: it.y0 + amp * (Math.cos(1.21 * w * t + 1.3 * ph) + .45 * Math.sin(2.07 * w * t + ph)),
  };
}
// An arrow from (x1, y1) to (x2, y2).
function vec(p, x1, y1, x2, y2, colr = COL.task, { w = 4, head = 16, o = 1 } = {}) {
  const g = G(p, { o });
  const a = Math.atan2(y2 - y1, x2 - x1), c = Math.cos(a), s = Math.sin(a);
  const bx = x2 - c * head * .8, by = y2 - s * head * .8;
  path(g, `M${x1} ${y1}L${bx} ${by}`, { stroke: colr, 'stroke-width': w });
  mk('path', { d: `M${x2} ${y2}L${x2 - c * head - s * head * .5} ${y2 - s * head + c * head * .5}L${x2 - c * head + s * head * .5} ${y2 - s * head - c * head * .5}Z`, fill: colr }, g);
  return g;
}
// Russian-style number: decimal comma, thin space in thousands.
const ru = (v, digits) => {
  const s = digits === undefined ? String(v) : v.toFixed(digits);
  const [i, f] = s.replace('-', '−').split('.');
  return i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (f ? ',' + f : '');
};
// Keyframed position: frames [[t, x, y], ...] in time order; eased between frames, held outside them.
function kf(t, frames) {
  if (t <= frames[0][0]) return { x: frames[0][1], y: frames[0][2] };
  for (let i = 1; i < frames.length; i++) if (t < frames[i][0]) {
    const [t0, x0, y0] = frames[i - 1], [t1, x1, y1] = frames[i], q = io((t - t0) / (t1 - t0));
    return { x: x0 + (x1 - x0) * q, y: y0 + (y1 - y0) * q };
  }
  const l = frames[frames.length - 1];
  return { x: l[1], y: l[2] };
}
const clamp01 = v => Math.max(0, Math.min(1, v));
const smooth = (a, b, t) => io(clamp01((t - a) / (b - a)));   // 0 before a, 1 after b, eased between
let clipN = 0;
// A circular clip inside parent; returns the group whose content is clipped.
function clipCircle(p, cx, cy, r) {
  const id = 'clip' + (++clipN);
  const c = mk('clipPath', { id }, p);
  mk('circle', { cx, cy, r }, c);
  const g = G(p);
  g.setAttribute('clip-path', `url(#${id})`);
  return g;
}

// Shared lesson helpers (moved from ch01): text that fades in, a beat heading, water and gas particles.
const txt = (p, str, x, y, t0, { size = 30, fill = COL.chalk, anchor = 'start', weight = 500, font = UI } = {}) => {
  const e = T(p, str, { x, y, size, fill, anchor, weight, font, o: 0 }); show(e, t0); return e;
};
const head = (p, str, t0) => txt(p, str, 96, 92, t0, { size: 30, fill: COL.dim, weight: 600 });
const italic = e => { e.setAttribute('font-style', 'italic'); return e; };
const WATER = '#86c9e8';
// Water molecules on a jittered grid inside a box; returns motion items { el, x0, y0, r0, ph, w }.
function waterBox(p, x1, y1, x2, y2, step, seed, s = .8) {
  const R = rng(seed), items = [];
  for (let y = y1 + step / 2; y < y2; y += step * .87)
    for (let x = x1 + step / 2 + ((y / step | 0) % 2) * step / 2; x < x2 - step / 3; x += step) {
      const x0 = x + (R() - .5) * step * .3, y0 = y + (R() - .5) * step * .3, r0 = R() * 360;
      items.push({ el: mol(p, 'H2O', { x: x0, y: y0, r: r0, s }), x0, y0, r0, ph: R() * 6.28, w: 5 + R() * 4 });
    }
  return items;
}
// Free gas particles bouncing inside a box.
function gas(p, n, box, seed, { el = 'N', s = 1, speed = [160, 320], kinds } = {}) {
  const R = rng(seed), [x1, y1, x2, y2] = box;
  return Array.from({ length: n }, (_, i) => {
    const a = R() * 6.283, v = speed[0] + R() * (speed[1] - speed[0]);
    const kind = kinds ? kinds[i % kinds.length] : null;
    const e = kind ? mol(p, kind, { s, r: R() * 360 }) : atom(p, el, { s });
    return { el: e, x0: x1 + R() * (x2 - x1), y0: y1 + R() * (y2 - y1), vx: Math.cos(a) * v, vy: Math.sin(a) * v, r0: R() * 360, vr: (R() - .5) * 200 };
  });
}
const gasAt = (it, t, [x1, y1, x2, y2]) => ({ x: bounce(it.x0, it.vx, t, x1, x2), y: bounce(it.y0, it.vy, t, y1, y2), r: it.r0 + it.vr * t });
// Number of times a bouncing particle has touched wall a (low end) of [a, b] by time t.
const touches = (x0, v, t, a, b) => { const L2 = 2 * (b - a), s0 = x0 - a, s1 = s0 + v * t; return Math.abs(Math.floor(s1 / L2) - Math.floor(s0 / L2)); };

// "v_y" in a text element becomes v with a real subscript y (Unicode has no subscript y or z).
function subify(e) {
  const s = e.textContent;
  if (!/_[a-zA-Zа-я0-9]/.test(s)) return e;
  e.textContent = '';
  s.split(/(_[a-zA-Zа-я0-9])/).forEach(part => {
    const t = mk('tspan', {}, e);
    if (part.startsWith('_')) { t.textContent = part[1]; t.setAttribute('baseline-shift', 'sub'); t.setAttribute('font-size', '70%'); }
    else t.textContent = part;
  });
  return e;
}
