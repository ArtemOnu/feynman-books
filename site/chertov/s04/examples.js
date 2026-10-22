// § 4. Примеры решения задач и общие рисунки параграфа.
'use strict';
const R = String.raw;
const blk = (x, y, w, h, lab = '', c = C.task) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${c}" fill-opacity=".25" stroke="${c}" stroke-width="2.5"/>` +
  (lab ? F.text(x + w / 2, y + h / 2 + 6, lab, { c, anchor: 'middle', it: true }) : '');
const planet = (cx, cy, r, { c = C.blue, lab = '' } = {}) => F.circle(cx, cy, r, { c, fill: '#1f3640' }) + (lab ? F.text(cx, cy + 6, lab, { c, anchor: 'middle' }) : '');
const sun = (cx, cy, r = 22) => F.circle(cx, cy, r, { c: C.task, fill: C.task }) + [0, 45, 90, 135, 180, 225, 270, 315].map(a => { const t = a * Math.PI / 180; return F.line(cx + (r + 5) * Math.cos(t), cy + (r + 5) * Math.sin(t), cx + (r + 13) * Math.cos(t), cy + (r + 13) * Math.sin(t), { c: C.task, w: 2 }); }).join('');
// Zig-zag spring from (x, y1) down to (x, y2).
const spring = (x, y1, y2, { n = 8, w = 14, c = C.chalk } = {}) => { const h = (y2 - y1) / (n * 2); let d = `M${x} ${y1}`; for (let i = 0; i < n * 2; i++) d += `L${x + (i % 2 ? -w : w)} ${y1 + h * (i + .5)}`; return F.path(d + `L${x} ${y2}`, { c, w: 2 }); };
const hspring = (x1, x2, y, { n = 8, w = 12, c = C.chalk } = {}) => { const h = (x2 - x1) / (n * 2); let d = `M${x1} ${y}`; for (let i = 0; i < n * 2; i++) d += `L${x1 + h * (i + .5)} ${y + (i % 2 ? -w : w)}`; return F.path(d + `L${x2} ${y}`, { c, w: 2 }); };
const wire = (len = 200, extra = '') => F.ceiling(240, 360, 30) + F.line(300, 30, 300, 30 + len, { c: C.chalk, w: 3 }) + extra;

P('Пример 1', { example: true, topic: 'Тяготение',
  fig: () => planet(150, 160, 70, { lab: 'Земля' }) + F.ball(222, 160, 7) + F.arrow(232, 160, 330, 160, { c: C.good, label: 'v₂', ly: -10 }) + F.path('M222 160Q400 120 580 40', { c: C.task, w: 2, dash: '6 6' }) + F.text(460, 200, 'до ∞', { c: C.dim }),
  text: R`<p>Определите вторую космическую скорость $v_2$ ракеты, запущенной с поверхности Земли. (Вторая космическая скорость — минимальная скорость, которую нужно сообщить телу, чтобы оно удалилось с поверхности Земли в бесконечность.)</p>`,
  ans: [{ l: R`$v_2$`, v: 11.2, u: 'км/с' }],
  hints: [R`В бесконечности кинетическая и потенциальная энергии равны нулю: $\dfrac{mv_2^2}{2} - G\dfrac{mM}{R} = 0$.`],
  sol: [R`$v_2 = \sqrt{2GM/R} = \sqrt{2gR}$, так как $GM/R^2 = g$.`, R`$v_2 = \sqrt{2\cdot 9{,}81\cdot 6{,}37\cdot 10^6} \approx 11{,}2$ км/с.`] });

P('Пример 2', { example: true, topic: 'Тяготение',
  fig: () => planet(150, 160, 70, { lab: 'Земля' }) + F.line(220, 160, 290, 160, { c: C.dim, w: 1.5, dash: '5 5' }) + F.text(255, 150, 'R', { c: C.dim, it: true, anchor: 'middle' }) + F.ball(222, 160, 7) + F.ball(290, 160, 7, C.faint) + F.arrow(232, 130, 300, 130, { c: C.good, label: 'v₁', ly: -8 }),
  text: R`<p>Ракета установлена на поверхности Земли для запуска в вертикальном направлении. При какой минимальной скорости $v_1$, сообщённой ракете при запуске, она удалится от поверхности на расстояние, равное радиусу Земли ($R = 6{,}37\cdot 10^6$ м)? Силами, кроме силы гравитационного взаимодействия ракеты и Земли, пренебречь.</p>`,
  ans: [{ l: R`$v_1$`, v: 7.9, u: 'км/с' }], hints: [R`$\dfrac{mv_1^2}{2} - G\dfrac{mM}{R} = -G\dfrac{mM}{2R}$.`],
  traps: [{ i: 0, v: 11.2, m: 'Это вторая космическая скорость — для удаления в бесконечность. Здесь нужно подняться лишь на высоту $R$.' }],
  sol: [R`$v_1^2 = GM/R$, т. е. $v_1 = \sqrt{gR}$ — совпадает с первой космической скоростью.`, R`$v_1 = \sqrt{9{,}81\cdot 6{,}37\cdot 10^6} \approx 7{,}9$ км/с.`] });

P('Пример 3', { example: true, topic: 'Тяготение',
  fig: () => F.graph({ x: 70, y: 280, w: 460, h: 240, xr: [0, 6], yr: [-1.1, 0.1], xt: [1, 2, 4], yt: [-1], xl: 'r/R', yl: 'Π, отн. ед.', series: [{ f: r => -1 / r, r: [1, 6], c: C.task, label: 'Π = −GmM/r', lp: [2.5, -.55] }] }),
  text: R`<p>Найдите выражение для потенциальной энергии $\Pi$ гравитационного взаимодействия Земли и тела массой $m$, находящегося на расстоянии $r$ от центра Земли за пределами её поверхности. Постройте график $\Pi(r)$.</p>`,
  self: { html: R`<p>$\Pi(r) = -G\dfrac{mM}{r}$, если нуль потенциальной энергии — в бесконечности. Если же принять $\Pi = 0$ на поверхности Земли, то $\Pi(h) = G\dfrac{mM}{(R + h)R}h$, а при $h \ll R$ получаем привычное $\Pi = mgh$.</p>` },
  hints: [R`$F = -\dfrac{d\Pi}{dr}$, а $F = -G\dfrac{mM}{r^2}$. Проинтегрируйте.`],
  sol: [R`$d\Pi = G\dfrac{mM}{r^2}dr$ ⇒ $\Pi = -G\dfrac{mM}{r} + C$.`, R`С нулём на бесконечности $C = 0$; график — ветвь гиперболы, стремящаяся к нулю снизу.`] });

P('Пример 4', { example: true, topic: 'Тяготение',
  fig: () => planet(150, 150, 60, { lab: 'O' }) + F.line(150, 150, 510, 150, { c: C.dim, w: 1.5, dash: '5 5' }) + F.ball(330, 150, 7, C.faint) + F.ball(510, 150, 7) + F.arrow(500, 120, 345, 120, { c: C.good, label: '1 → 2', ly: -8, size: 15 }) +
    F.text(330, 180, '2 (2R)', { c: C.dim, anchor: 'middle', size: 15 }) + F.text(510, 180, '1 (3R)', { c: C.dim, anchor: 'middle', size: 15 }),
  text: R`<p>Вычислите работу $A_{12}$ сил гравитационного поля Земли при перемещении тела массой $m = 10$ кг из точки 1 ($r_1 = 3R$) в точку 2 ($r_2 = 2R$). Радиус $R$ Земли и ускорение $g$ свободного падения вблизи поверхности Земли считать известными.</p>`,
  ans: [{ l: R`$A_{12}$`, v: 104, u: 'МДж' }], hints: [R`$A_{12} = \Pi_1 - \Pi_2$, $\Pi = -GmM/r$, $GM = gR^2$.`],
  sol: [R`$A_{12} = -\dfrac{GmM}{3R} + \dfrac{GmM}{2R} = \dfrac16\dfrac{GmM}{R} = \dfrac16mgR$.`, R`$A_{12} = \dfrac{10\cdot 9{,}81\cdot 6{,}37\cdot 10^6}{6} \approx 104$ МДж.`] });

P('Пример 5', { example: true, topic: 'Упругие силы',
  fig: () => wire(180, blk(270, 210, 60, 50, 'm')) + F.text(320, 120, 'l = 5 м, S = 4 см²', { c: C.dim }) + F.arrow(240, 260, 240, 290, { c: C.bad, label: 'x', lx: -12, ly: 0, head: 8 }),
  text: R`<p>Верхний конец стального стержня длиной $l = 5$ м с площадью поперечного сечения $S = 4$ см² закреплён неподвижно, к нижнему подвешен груз массой $m = 2\cdot 10^3$ кг. Определите: 1) нормальное напряжение $\sigma$ материала стержня; 2) абсолютное $x$ и относительное $\varepsilon$ удлинения стержня; 3) потенциальную энергию $\Pi$ растянутого стержня. Модуль Юнга стали $E = 200$ ГПа.</p>`,
  ans: [{ l: R`$\sigma$`, v: 49, u: 'МПа' }, { l: R`$x$`, v: 1.23, u: 'мм' }, { l: R`$\varepsilon$`, v: 2.45e-4 }, { l: R`$\Pi$`, v: 12.1, u: 'Дж' }],
  hints: [R`$\sigma = mg/S$, $\varepsilon = \sigma/E$, $x = \varepsilon l$, $\Pi = \tfrac12\varepsilon\sigma Sl$.`],
  sol: [R`$\sigma = \dfrac{2000\cdot 9{,}81}{4\cdot 10^{-4}} \approx 49$ МПа.`, R`$\varepsilon = \sigma/E \approx 2{,}45\cdot 10^{-4}$, $x = \varepsilon l \approx 1{,}23$ мм.`, R`$\Pi = \tfrac12\varepsilon\sigma\,Sl = 0{,}5\cdot 2{,}45\cdot 10^{-4}\cdot 4{,}9\cdot 10^7\cdot 2\cdot 10^{-3} \approx 12{,}1$ Дж.`] });

P('Пример 6', { example: true, topic: 'Упругие силы',
  fig: () => F.ground(160, 440, 270) + spring(300, 270, 200, { n: 5 }) + F.ball(300, 190, 8) + F.path('M300 180V40', { c: C.task, w: 2, dash: '6 6' }) + F.ball(300, 40, 8, C.faint) + F.text(320, 110, 'h = ?', { c: C.task }),
  text: R`<p>Из пружинного пистолета был произведён выстрел вертикально вверх. Определите высоту $h$, на которую поднимается пуля массой $m = 20$ г, если пружина жёсткостью $k = 196$ Н/м была сжата перед выстрелом на $x = 10$ см. Массой пружины пренебречь.</p>`,
  ans: [{ l: R`$h$`, v: 5, u: 'м' }], hints: [R`$\dfrac{kx^2}{2} = mgh$.`], sol: [R`$h = \dfrac{kx^2}{2mg} = \dfrac{196\cdot 0{,}01}{2\cdot 0{,}02\cdot 9{,}81} \approx 5$ м.`] });
