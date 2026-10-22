// SVG drawing helpers for problem figures. Every function returns an SVG string; F.svg wraps the body.
'use strict';
const C = { chalk: '#ece8dc', dim: '#9aaba3', faint: '#5d7068', task: '#f0b45a', good: '#8fd6b0', bad: '#f07a6a', blue: '#86c9e8', violet: '#bba8ee', grid: '#2c3f38' };
const F = {
  svg: (body, w = 600, h = 300) => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial, sans-serif">${body}</svg>`,
  line: (x1, y1, x2, y2, { c = C.chalk, w = 2.5, dash } = {}) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`,
  path: (d, { c = C.chalk, w = 2.5, fill = 'none', dash, op = 1 } = {}) =>
    `<path d="${d}" stroke="${c}" stroke-width="${w}" fill="${fill}" stroke-linecap="round" stroke-linejoin="round" opacity="${op}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`,
  // Arrow with an optional label near its tip.
  arrow(x1, y1, x2, y2, { c = C.task, w = 3, head = 11, label, lx = 0, ly = -10, size = 18 } = {}) {
    const a = Math.atan2(y2 - y1, x2 - x1), ca = Math.cos(a), sa = Math.sin(a);
    const bx = x2 - ca * head * .8, by = y2 - sa * head * .8;
    let s = F.line(x1, y1, bx, by, { c, w });
    s += `<path d="M${x2} ${y2}L${x2 - ca * head - sa * head * .45} ${y2 - sa * head + ca * head * .45}L${x2 - ca * head + sa * head * .45} ${y2 - sa * head - ca * head * .45}Z" fill="${c}"/>`;
    if (label) s += F.text(x2 + lx, y2 + ly, label, { c, size, it: true, anchor: 'middle' });
    return s;
  },
  // Text; "_x" after a letter becomes a subscript, it: true makes it italic (variables).
  text(x, y, s, { c = C.chalk, size = 17, anchor = 'start', it = false, weight = 400 } = {}) {
    const body = String(s).replace(/_\{([^}]*)\}|_(\S)/g, (_, a, b) => `<tspan baseline-shift="sub" font-size="72%">${a ?? b}</tspan>`)
      .replace(/\^\{([^}]*)\}|\^(\S)/g, (_, a, b) => `<tspan baseline-shift="super" font-size="72%">${a ?? b}</tspan>`);
    return `<text x="${x}" y="${y}" fill="${c}" font-size="${size}" text-anchor="${anchor}" font-weight="${weight}"${it ? ' font-style="italic" font-family="Georgia, serif"' : ''}>${body}</text>`;
  },
  circle: (cx, cy, r, { c = C.chalk, w = 2.5, fill = 'none', dash } = {}) =>
    `<circle cx="${cx}" cy="${cy}" r="${r}" stroke="${c}" stroke-width="${w}" fill="${fill}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`,
  dot: (x, y, { c = C.task, r = 6 } = {}) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`,
  // A dot that runs along a path forever (dur in seconds).
  runner: (d, { c = C.task, r = 7, dur = 4 } = {}) =>
    `<circle r="${r}" fill="${c}"><animateMotion path="${d}" dur="${dur}s" repeatCount="indefinite"/></circle>`,
  // Arc mark for an angle at (cx, cy) from a1 to a2 (degrees, math orientation: counter-clockwise, y up).
  angle(cx, cy, r, a1, a2, { c = C.dim, label, size = 16, lr = 1.45 } = {}) {
    const p = a => [cx + r * Math.cos(a * Math.PI / 180), cy - r * Math.sin(a * Math.PI / 180)];
    const [x1, y1] = p(a1), [x2, y2] = p(a2), big = Math.abs(a2 - a1) > 180 ? 1 : 0;
    let s = F.path(`M${x1} ${y1}A${r} ${r} 0 ${big} 0 ${x2} ${y2}`, { c, w: 2 });
    if (label) { const m = (a1 + a2) / 2 * Math.PI / 180; s += F.text(cx + r * lr * Math.cos(m), cy - r * lr * Math.sin(m) + 6, label, { c, size, it: true, anchor: 'middle' }); }
    return s;
  },
  ground: (x1, x2, y, { c = C.dim } = {}) => {
    let s = F.line(x1, y, x2, y, { c, w: 3 });
    for (let x = x1 + 6; x < x2; x += 16) s += F.line(x, y, x - 10, y + 10, { c, w: 1.5 });
    return s;
  },
  wall: (x, y1, y2, { c = C.dim, side = -1 } = {}) => {
    let s = F.line(x, y1, x, y2, { c, w: 3 });
    for (let y = y1 + 6; y < y2; y += 14) s += F.line(x, y, x + side * 10, y + 10, { c, w: 1.5 });
    return s;
  },
  ceiling: (x1, x2, y, { c = C.dim } = {}) => {
    let s = F.line(x1, y, x2, y, { c, w: 3 });
    for (let x = x1 + 6; x < x2; x += 16) s += F.line(x, y, x + 10, y - 10, { c, w: 1.5 });
    return s;
  },
  car(x, y, { c = C.task, dir = 1, s = 1 } = {}) {
    const k = s;
    return `<g transform="translate(${x} ${y}) scale(${dir * k} ${k})">` +
      `<path d="M-30 -8H28V-20L18 -20L10 -32H-14L-22 -20H-30Z" fill="${c}" opacity=".9"/>` +
      `<rect x="-9" y="-29" width="8" height="8" fill="#1a2723"/><rect x="2" y="-29" width="8" height="8" fill="#1a2723"/>` +
      `<circle cx="-17" cy="-6" r="7" fill="#1a2723" stroke="${C.chalk}" stroke-width="2"/><circle cx="16" cy="-6" r="7" fill="#1a2723" stroke="${C.chalk}" stroke-width="2"/></g>`;
  },
  ball: (x, y, r = 10, c = C.task) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="#00000055" stroke-width="1.5"/>`,
  person(x, y, { c = C.chalk } = {}) {
    return F.circle(x, y - 46, 7, { c }) + F.line(x, y - 39, x, y - 18, { c }) + F.line(x, y - 18, x - 8, y, { c }) + F.line(x, y - 18, x + 8, y, { c }) +
      F.line(x, y - 32, x - 9, y - 22, { c }) + F.line(x, y - 32, x + 9, y - 22, { c });
  },
  tower(x, y, h, w = 36, { c = C.dim } = {}) {
    let s = F.path(`M${x - w / 2} ${y}V${y - h}H${x + w / 2}V${y}`, { c, w: 2.5 });
    for (let yy = y - h + 18; yy < y; yy += 22) s += F.line(x - w / 2, yy, x + w / 2, yy, { c, w: 1 });
    return s;
  },
  // Horizontal x-axis with origin mark, ticks optional.
  xaxis(x1, x2, y, { label = 'x', o, olabel = 'O', c = C.dim } = {}) {
    let s = F.arrow(x1, y, x2, y, { c, w: 2, head: 10 }) + F.text(x2 - 4, y + 22, label, { c, it: true, size: 17 });
    if (o !== undefined) s += F.line(o, y - 6, o, y + 6, { c, w: 2 }) + F.text(o, y + 22, olabel, { c, size: 15, anchor: 'middle' });
    return s;
  },
  // A graph with grid. opts: x0, y0 (pixel origin of the box's bottom-left), w, h, xr [min,max], yr [min,max], xt, yt ticks, xl, yl labels.
  graph(o) {
    const { x = 70, y = 260, w = 480, h = 220, xr, yr, xt = [], yt = [], xl = 't, c', yl = '', series = [], marks = '' } = o;
    const X = v => x + (v - xr[0]) / (xr[1] - xr[0]) * w, Y = v => y - (v - yr[0]) / (yr[1] - yr[0]) * h;
    let s = '';
    for (const t of xt) s += F.line(X(t), y, X(t), y - h, { c: C.grid, w: 1 }) + F.text(X(t), Y(Math.max(yr[0], Math.min(yr[1], 0))) + 18, t, { c: C.dim, size: 13, anchor: 'middle' });
    for (const t of yt) s += F.line(x, Y(t), x + w, Y(t), { c: C.grid, w: 1 }) + F.text(X(xr[0]) - 8, Y(t) + 5, t, { c: C.dim, size: 13, anchor: 'end' });
    const y0 = Y(Math.max(yr[0], Math.min(yr[1], 0)));
    s += F.arrow(x, y0, x + w + 16, y0, { c: C.dim, w: 2, head: 9 }) + F.arrow(X(Math.max(xr[0], 0)), y, X(Math.max(xr[0], 0)), y - h - 16, { c: C.dim, w: 2, head: 9 });
    s += F.text(x + w + 18, y0 + 20, xl, { c: C.dim, size: 15, it: true, anchor: 'end' }) + F.text(X(Math.max(xr[0], 0)) + 8, y - h - 6, yl, { c: C.dim, size: 15, it: true });
    for (const se of series) {
      let pts = se.pts;
      if (se.f) { pts = []; const [a, b] = se.r || xr; for (let i = 0; i <= 200; i++) { const t = a + (b - a) * i / 200; pts.push([t, se.f(t)]); } }
      const d = pts.map(([u, v], i) => (i ? 'L' : 'M') + X(u).toFixed(1) + ' ' + Y(v).toFixed(1)).join('');
      s += F.path(d, { c: se.c || C.task, w: se.w || 3, dash: se.dash });
      if (se.label) { const [u, v] = se.lp || pts[pts.length - 1]; s += F.text(X(u) + 6, Y(v) - 6, se.label, { c: se.c || C.task, size: 15 }); }
    }
    return s + (typeof marks === 'function' ? marks(X, Y) : marks);
  },
};
