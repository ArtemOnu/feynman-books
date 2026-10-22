// § 6. Примеры решения задач и общие рисунки параграфа.
'use strict';
const R = String.raw;
const blk = (x, y, w, h, lab = '', c = C.task) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${c}" fill-opacity=".25" stroke="${c}" stroke-width="2.5"/>` +
  (lab ? F.text(x + w / 2, y + h / 2 + 6, lab, { c, anchor: 'middle', it: true }) : '');
const spring = (x, y1, y2, { n = 8, w = 14, c = C.chalk } = {}) => { const h = (y2 - y1) / (n * 2); let d = `M${x} ${y1}`; for (let i = 0; i < n * 2; i++) d += `L${x + (i % 2 ? -w : w)} ${y1 + h * (i + .5)}`; return F.path(d + `L${x} ${y2}`, { c, w: 2 }); };
// Parametric trajectory x(t), y(t), t in [0, 2π], drawn in a square box with half-size lim (cm).
const traj = (fx, fy, lim = 3, { c = C.task, n = 240, marks = '' } = {}) => {
  const pts = []; for (let i = 0; i <= n; i++) { const t = 2 * Math.PI * i / n; pts.push([fx(t), fy(t)]); }
  const st = lim > 3 ? lim / 2 : 1, tk = []; for (let v = -lim; v <= lim; v += st) if (v) tk.push(v);
  return F.graph({ x: 300 - 120, y: 270, w: 240, h: 240, xr: [-lim, lim], yr: [-lim, lim], xt: tk, yt: tk, xl: 'x', yl: 'y', series: [{ pts, c }], marks });
};
// Rotating-vector diagram: list of [amplitude px, angle deg, label, colour].
const phasor = (list, extra = '') => F.arrow(140, 150, 460, 150, { c: C.dim, w: 2, label: 'x', ly: 20 }) + F.arrow(300, 280, 300, 20, { c: C.dim, w: 2, label: 'y', lx: 14 }) +
  list.map(([a, deg, lab, c = C.task]) => { const t = deg * Math.PI / 180; return F.arrow(300, 150, 300 + a * Math.cos(t), 150 - a * Math.sin(t), { c, label: lab, lx: 12 * Math.cos(t), ly: -12 * Math.sin(t) + 4 }); }).join('') + extra;
const rodP = (x, y1, y2, yo, balls = []) => F.line(x, y1, x, y2, { c: C.chalk, w: 6 }) + balls.map(([y, r, lab, c = C.task]) => F.ball(x, y, r, c) + F.text(x + 16, y + 5, lab, { c, it: true, size: 15 })).join('') +
  F.circle(x, yo, 5, { c: C.good, fill: '#1a2723', w: 2 }) + F.text(x - 10, yo + 5, 'O', { c: C.good, anchor: 'end', size: 14 });

P('Пример 1', { example: true, topic: 'Кинематика колебаний', fig: () => phasor([[120, 150, 'A']], F.circle(300, 150, 120, { c: C.faint, dash: '4 6' }) + F.angle(300, 150, 34, 0, 150, { label: '5π/6', size: 14 }) + F.dot(196, 150, { c: C.bad })),
  text: R`<p>Точка совершает колебания по закону $x(t) = A\cos(\omega t + \varphi)$, где $A = 2$ см. Определите начальную фазу $\varphi$, если $x(0) = -\sqrt3$ см и $\dot x(0) < 0$. Постройте векторную диаграмму для момента $t = 0$.</p>`,
  ans: [{ l: R`$\varphi$`, v: 150, u: '°' }], hints: [R`$\cos\varphi = x(0)/A$ даёт два угла; выберите тот, при котором $\dot x(0) = -A\omega\sin\varphi < 0$.`],
  traps: [{ i: 0, v: 210, m: 'При $\\varphi = 7\\pi/6$ скорость $\\dot x(0) > 0$ — не подходит.' }],
  sol: [R`$\cos\varphi = -\sqrt3/2$ ⇒ $\varphi = 5\pi/6$ или $7\pi/6$.`, R`$\dot x(0) = -A\omega\sin\varphi < 0$ требует $\sin\varphi > 0$ ⇒ $\varphi = 5\pi/6 = 150°$.`] });

P('Пример 2', { example: true, topic: 'Динамика колебаний', fig: () => F.line(80, 150, 520, 150, { c: C.grid, w: 2 }) + F.line(210, 140, 210, 160, { c: C.dim }) + F.line(390, 140, 390, 160, { c: C.dim }) + F.text(300, 185, '2A = 6 см', { c: C.dim, anchor: 'middle' }) +
    `<circle r="10" fill="${C.task}"><animate attributeName="cx" values="210;390;210" dur="2s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/><animate attributeName="cy" values="150;150" dur="2s" repeatCount="indefinite"/></circle>`,
  text: R`<p>Материальная точка массой $m = 5$ г совершает гармонические колебания с частотой $\nu = 0{,}5$ Гц. Амплитуда колебаний $A = 3$ см. Определите: 1) скорость $v$ точки в момент времени, когда смещение $x = 1{,}5$ см; 2) максимальную силу $F_\max$, действующую на точку; 3) полную энергию $E$ колеблющейся точки.</p>`,
  ans: [{ l: R`$|v|$`, v: 8.16, u: 'см/с' }, { l: R`$F_\max$`, v: 1.48, u: 'мН' }, { l: R`$E$`, v: 22.2, u: 'мкДж' }],
  hints: [R`$v = \pm 2\pi\nu\sqrt{A^2 - x^2}$, $F_\max = 4\pi^2\nu^2mA$, $E = 2\pi^2m\nu^2A^2$.`],
  sol: [R`$v = \pi\sqrt{9 - 2{,}25} \approx 8{,}2$ см/с.`, R`$F_\max = 4\pi^2\cdot 0{,}25\cdot 0{,}005\cdot 0{,}03 \approx 1{,}48$ мН.`, R`$E = 2\pi^2\cdot 0{,}005\cdot 0{,}25\cdot 9\cdot 10^{-4} \approx 22{,}2$ мкДж.`] });

P('Пример 3', { example: true, topic: 'Маятники', fig: () => rodP(300, 40, 260, 150, [[40, 9, 'm₁'], [260, 12, 'm₂']]) + F.text(330, 100, 'm₃, l = 1 м', { c: C.dim, size: 15 }),
  text: R`<p>На концах тонкого стержня длиной $l = 1$ м и массой $m_3 = 400$ г укреплены шарики малых размеров массами $m_1 = 200$ г и $m_2 = 300$ г. Стержень колеблется около горизонтальной оси, перпендикулярной стержню и проходящей через его середину (точка $O$). Определите период $T$ колебаний, совершаемых стержнем.</p>`,
  ans: [{ l: R`$T$`, v: 3.57, u: 'с' }],
  hints: [R`$T = 2\pi\sqrt{J/(mgl_C)}$; $J = \tfrac1{12}l^2(3m_1 + 3m_2 + m_3)$, $l_C = \dfrac{(m_2 - m_1)l}{2m}$.`],
  note: 'В задачнике ответ T = 11,2 с: при подстановке пропущено g. С g = 9,81 м/с² получается T ≈ 3,57 с.',
  sol: [R`$J = \dfrac{1}{12}(0{,}6 + 0{,}9 + 0{,}4) \approx 0{,}158$ кг·м², $m = 0{,}9$ кг.`, R`$l_C = \dfrac{0{,}1\cdot 1}{1{,}8} \approx 5{,}55$ см.`, R`$T = 2\pi\sqrt{\dfrac{0{,}158}{0{,}9\cdot 9{,}81\cdot 0{,}0555}} \approx 3{,}57$ с.`] });

P('Пример 4', { example: true, topic: 'Маятники', fig: () => F.line(300, 30, 300, 230, { c: C.chalk, w: 6 }) + F.circle(300, 230, 50, { c: C.task, w: 4 }) + F.circle(300, 130, 5, { c: C.good, fill: '#1a2723', w: 2 }) + F.text(286, 135, 'O', { c: C.good, anchor: 'end' }) + F.text(320, 90, '3m₁', { c: C.chalk, it: true }) + F.text(360, 260, 'm₁', { c: C.task, it: true }),
  text: R`<p>Физический маятник представляет собой стержень длиной $l = 1$ м и массой $3m_1$ с прикреплённым к одному из его концов обручем диаметром $d = \tfrac12l$ и массой $m_1$. Горизонтальная ось $Oz$ маятника проходит через середину стержня перпендикулярно ему. Определите период $T$ колебаний такого маятника.</p>`,
  ans: [{ l: R`$T$`, v: 2.17, u: 'с' }],
  hints: [R`$J = \tfrac14m_1l^2 + m_1\left(\tfrac l4\right)^2 + m_1\left(\tfrac34l\right)^2 = \tfrac78m_1l^2$; центр масс на $l_C = \tfrac3{16}l$ от оси.`],
  sol: [R`$J = \tfrac78m_1l^2$, $m = 4m_1$, $l_C = \dfrac{m_1\cdot 3l/4}{4m_1} = \dfrac{3l}{16}$.`, R`$T = 2\pi\sqrt{\dfrac{7l}{6g}} \approx 2{,}17$ с.`] });

P('Пример 5', { example: true, topic: 'Сложение колебаний', fig: () => phasor([[60, 30, 'A₁', C.blue], [120, 90, 'A₂', C.violet], [159, 70.9, 'A']]),
  text: R`<p>Складываются два колебания одинакового направления, выражаемые уравнениями $x_1 = A_1\cos\omega(t + \tau_1)$, $x_2 = A_2\cos\omega(t + \tau_2)$, где $A_1 = 1$ см, $A_2 = 2$ см, $\tau_1 = 1/6$ с, $\tau_2 = 1/2$ с, $\omega = \pi$ с⁻¹. Определите начальные фазы $\varphi_1$ и $\varphi_2$ составляющих колебаний, найдите амплитуду $A$ и начальную фазу $\varphi$ результирующего колебания. Напишите уравнение результирующего колебания.</p>`,
  ans: [{ l: R`$\varphi_1$`, v: 30, u: '°' }, { l: R`$\varphi_2$`, v: 90, u: '°' }, { l: R`$A$`, v: 2.65, u: 'см' }, { l: R`$\varphi$`, v: 70.9, u: '°' }],
  hints: [R`$\varphi_i = \omega\tau_i$; $A^2 = A_1^2 + A_2^2 + 2A_1A_2\cos\Delta\varphi$, $\operatorname{tg}\varphi = \dfrac{A_1\sin\varphi_1 + A_2\sin\varphi_2}{A_1\cos\varphi_1 + A_2\cos\varphi_2}$.`],
  sol: [R`$\varphi_1 = \pi/6$, $\varphi_2 = \pi/2$, $\Delta\varphi = \pi/3$.`, R`$A = \sqrt{1 + 4 + 2} = \sqrt7 \approx 2{,}65$ см; $\operatorname{tg}\varphi = \dfrac{0{,}5 + 2}{0{,}866} \approx 2{,}89$, $\varphi \approx 70{,}9° = 0{,}394\pi$.`,
    R`$x = 2{,}65\cos(\pi t + 0{,}394\pi)$ см.`] });

P('Пример 6', { example: true, topic: 'Сложение колебаний', fig: () => traj(t => Math.cos(t), t => 2 * Math.cos(t / 2), 2, { n: 480 }),
  text: R`<p>Материальная точка участвует одновременно в двух взаимно перпендикулярных гармонических колебаниях: $x = A_1\cos\omega t$ и $y = A_2\cos\dfrac\omega2t$, где $A_1 = 1$ см, $A_2 = 2$ см, $\omega = \pi$ с⁻¹. Найдите уравнение траектории точки, постройте траекторию и укажите направление движения точки.</p>`,
  self: { html: R`<p>$y = A_2\sqrt{\tfrac12(1 + x/A_1)}$, т. е. $y^2 = 2(1 + x)$ (см) — парабола с осью вдоль $Ox$, $|x| \le 1$ см, $|y| \le 2$ см. При $t = 0$ точка в $A(1;\,2)$, при $t = 1$ с — в начале координат: движение от $A$ к $D(1;\,-2)$ и обратно.</p>` },
  hints: [R`Используйте $\cos\dfrac\alpha2 = \pm\sqrt{\tfrac12(1 + \cos\alpha)}$.`],
  sol: [R`$\cos\omega t = x/A_1$, поэтому $y = A_2\cos\dfrac{\omega t}{2} = \pm A_2\sqrt{\dfrac{1 + x/A_1}{2}}$.`, R`Это парабола $y^2 = \dfrac{A_2^2}{2}\left(1 + \dfrac{x}{A_1}\right)$.`] });
