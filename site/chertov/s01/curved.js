// § 1. Задачи 1-26 … 1-49: криволинейное движение.
'use strict';
const T2 = 'Криволинейное движение';
const circleFig = (R, extra = '', { cx = 230, cy = 150, r = 110 } = {}) =>
  F.circle(cx, cy, r, { c: C.dim }) + F.dot(cx, cy, { c: C.dim, r: 4 }) + F.line(cx, cy, cx + r, cy, { c: C.dim, w: 1.5, dash: '5 5' }) +
  F.text(cx + r / 2, cy - 8, R, { c: C.dim, it: true, anchor: 'middle' }) + F.runner(`M${cx + r} ${cy}A${r} ${r} 0 1 0 ${cx - r} ${cy}A${r} ${r} 0 1 0 ${cx + r} ${cy}`, { dur: 5 }) + extra;
// Projectile path from (x0, y0) with pixel velocity (vx, vy) and pixel gravity g, until y reaches yEnd.
const proj = (x0, y0, vx, vy, g, yEnd) => { let d = `M${x0} ${y0}`; for (let t = 0; t < 60; t += .05) { const x = x0 + vx * t, y = y0 - vy * t + g * t * t / 2; d += `L${x.toFixed(1)} ${y.toFixed(1)}`; if (t > 0 && y >= yEnd) break; } return d; };

P('1-26', { topic: T2,
  fig: () => F.arrow(80, 260, 560, 260, { c: C.dim, w: 2 }) + F.arrow(80, 260, 80, 30, { c: C.dim, w: 2 }) + F.text(552, 282, 'x', { c: C.dim, it: true }) + F.text(92, 40, 'y', { c: C.dim, it: true }) +
    F.path(proj(80, 260, 0, 0, 0, 0).slice(0, 0) + (() => { let d = 'M80 260'; for (let t = 0; t <= 1.5; t += .02) d += `L${80 + 120 * t ** 3} ${260 - 90 * t * t}`; return d; })(), { c: C.task, w: 3 }) +
    F.text(330, 230, 'r = iAt³ + jBt²', { c: C.chalk, size: 19 }),
  text: R`<p>Материальная точка движется по плоскости согласно уравнению $\mathbf r(t) = \mathbf iAt^3 + \mathbf jBt^2$. Напишите зависимости: 1) $\mathbf v(t)$; 2) $\mathbf a(t)$.</p>`,
  ans: [{ l: R`$\mathbf v(t)$`, choices: [R`$\mathbf i\,3At^2 + \mathbf j\,2Bt$`, R`$\mathbf i\,At^2 + \mathbf j\,Bt$`, R`$\mathbf i\,3At + \mathbf j\,2B$`], c: 0 },
    { l: R`$\mathbf a(t)$`, choices: [R`$\mathbf i\,3At + \mathbf j\,2B$`, R`$\mathbf i\,6At + \mathbf j\,2B$`, R`$\mathbf i\,6At^2 + \mathbf j\,2Bt$`], c: 1 }],
  hints: [R`Дифференцируйте каждую проекцию отдельно: $(t^n)' = nt^{n-1}$.`],
  sol: [R`$\mathbf v = \dfrac{d\mathbf r}{dt} = \mathbf i\,3At^2 + \mathbf j\,2Bt$.`, R`$\mathbf a = \dfrac{d\mathbf v}{dt} = \mathbf i\,6At + \mathbf j\,2B$.`] });

P('1-27', { topic: T2,
  fig: () => circleFig('A', F.arrow(230, 150, 300, 64, { c: C.good, w: 2, label: 'r', lx: 10, ly: 0 }) + F.text(400, 120, 'r = A(i cos ωt + j sin ωt)', { c: C.chalk, size: 17 })),
  text: R`<p>Движение материальной точки задано уравнением $\mathbf r(t) = A(\mathbf i\cos\omega t + \mathbf j\sin\omega t)$, где $A = 0{,}5$ м, $\omega = 5$ рад/с. Начертите траекторию точки. Определите модуль скорости $|\mathbf v|$ и модуль нормального ускорения $|\mathbf a_n|$.</p>`,
  ans: [{ l: R`$|\mathbf v|$`, v: 2.5, u: 'м/с' }, { l: R`$|\mathbf a_n|$`, v: 12.5, u: 'м/с²' }],
  hints: [R`Траектория — окружность радиусом $A$; движение равномерное.`],
  sol: [R`$x^2 + y^2 = A^2$ — окружность радиусом $A$.`, R`$\mathbf v = A\omega(-\mathbf i\sin\omega t + \mathbf j\cos\omega t)$, $|\mathbf v| = A\omega = 2{,}5$ м/с.`,
    R`$|\mathbf a| = A\omega^2 = 12{,}5$ м/с²; ускорение направлено к центру, так что $a_n = 12{,}5$ м/с², $a_\tau = 0$.`] });

P('1-28', { topic: T2,
  fig: () => F.graph({ x: 90, y: 270, w: 440, h: 230, xr: [-25, 12], yr: [0, 32], xt: [-20, -10, 10], yt: [10, 20, 30], xl: 'x, м', yl: 'y, м',
    series: [{ f: y => y, r: [0, 0] }].slice(1).concat([{ pts: Array.from({ length: 61 }, (_, k) => { const t = k / 20; return [10 - 5 * t * t, 10 * t]; }), c: C.task }]),
    marks: (X, Y) => F.dot(X(5), Y(10), { c: C.good }) + F.text(X(5) + 10, Y(10) - 8, 't = 1 с', { c: C.good, size: 14 }) }),
  text: R`<p>Движение материальной точки задано уравнением $\mathbf r(t) = \mathbf i(A + Bt^2) + \mathbf jCt$, где $A = 10$ м, $B = -5$ м/с², $C = 10$ м/с. Начертите траекторию. Найдите выражения $\mathbf v(t)$ и $\mathbf a(t)$. Для момента $t = 1$ с вычислите: 1) $|\mathbf v|$; 2) $|\mathbf a|$; 3) $|\mathbf a_\tau|$; 4) $|\mathbf a_n|$.</p>`,
  ans: [{ l: R`$|\mathbf v|$`, v: 14.1, u: 'м/с' }, { l: R`$|\mathbf a|$`, v: 10, u: 'м/с²' }, { l: R`$|\mathbf a_\tau|$`, v: 7.07, u: 'м/с²' }, { l: R`$|\mathbf a_n|$`, v: 7.07, u: 'м/с²' }],
  hints: [R`$\mathbf v = \mathbf i\,2Bt + \mathbf jC$, $\mathbf a = \mathbf i\,2B$.`, R`Тангенциальная составляющая — проекция $\mathbf a$ на направление $\mathbf v$: $a_\tau = \dfrac{\mathbf a\cdot\mathbf v}{v}$; $a_n = \sqrt{a^2 - a_\tau^2}$.`],
  sol: [R`Траектория: $x = A + B(y/C)^2 = 10 - 0{,}05y^2$ — парабола.`, R`$\mathbf v = \mathbf i\,2Bt + \mathbf jC = (-10t;\ 10)$, при $t = 1$ с $|\mathbf v| = 10\sqrt2 \approx 14{,}1$ м/с.`,
    R`$\mathbf a = (2B;\ 0) = (-10;\ 0)$, $|\mathbf a| = 10$ м/с².`, R`$a_\tau = \dfrac{\mathbf a\cdot\mathbf v}{v} = \dfrac{100}{14{,}14} \approx 7{,}07$ м/с², $a_n = \sqrt{100 - 50} \approx 7{,}07$ м/с².`] });

P('1-29', { topic: T2,
  fig: () => F.path('M60 250C200 250 260 80 420 90S560 200 570 210', { c: C.dim, w: 3 }) + F.dot(330, 110) +
    F.arrow(330, 110, 420, 90, { c: C.good, label: 'aτ', lx: 12 }) + F.arrow(330, 110, 350, 200, { c: C.blue, label: 'aₙ', lx: 14, ly: 4 }) + F.arrow(330, 110, 440, 180, { c: C.task, label: 'a', lx: 12, ly: 6 }) +
    F.text(200, 60, 'R = 3 м, v = 2 м/с', { c: C.dim }),
  text: R`<p>Точка движется по кривой с постоянным тангенциальным ускорением $a_\tau = 0{,}5$ м/с². Определите полное ускорение $a$ точки на участке кривой с радиусом кривизны $R = 3$ м, если точка движется на этом участке со скоростью $v = 2$ м/с.</p>`,
  ans: [{ l: R`$a$`, v: 1.42, u: 'м/с²' }],
  hints: [R`$a_n = v^2/R$, а полное ускорение — гипотенуза: $a = \sqrt{a_\tau^2 + a_n^2}$.`],
  traps: [{ i: 0, v: 1.833, m: 'Ускорения складываются как перпендикулярные векторы, а не как числа.' }],
  sol: [R`$a_n = v^2/R = 4/3 \approx 1{,}33$ м/с².`, R`$a = \sqrt{0{,}25 + 1{,}78} \approx 1{,}42$ м/с².`] });

P('1-30', { topic: T2,
  fig: () => {
    const cx = 230, cy = 150, r = 110, a = 2 * 57.3;
    const x2 = cx + r * Math.cos(a * Math.PI / 180), y2 = cy - r * Math.sin(a * Math.PI / 180);
    return F.circle(cx, cy, r, { c: C.dim }) + F.path(`M${cx + r} ${cy}A${r} ${r} 0 0 0 ${x2} ${y2}`, { c: C.task, w: 5 }) + F.arrow(cx + r, cy, x2, y2, { c: C.good, w: 2.5 }) +
      F.line(cx, cy, cx + r, cy, { c: C.dim, w: 1.5 }) + F.line(cx, cy, x2, y2, { c: C.dim, w: 1.5 }) + F.angle(cx, cy, 30, 0, a, { label: 'φ' }) +
      F.text(cx + 60, cy + 70, 'Δr', { c: C.good, it: true }) + F.text(cx + 90, cy - 105, 's', { c: C.task, it: true }) +
      F.text(400, 100, 'R = 4 м', { c: C.dim }) + F.text(400, 130, 'v₀ = 3 м/с, aτ = 1 м/с²', { c: C.dim }) + F.text(400, 160, 't = 2 с', { c: C.dim });
  },
  text: R`<p>Точка движется по окружности радиусом $R = 4$ м. Начальная скорость $v_0$ точки равна 3 м/с, тангенциальное ускорение $a_\tau = 1$ м/с². Для момента времени $t = 2$ с определите: 1) длину пути $s$, пройденного точкой; 2) модуль перемещения $|\Delta\mathbf r|$; 3) среднюю путевую скорость $\langle v\rangle$; 4) модуль вектора средней скорости $|\langle\mathbf v\rangle|$.</p>`,
  ans: [{ l: R`$s$`, v: 8, u: 'м' }, { l: R`$|\Delta\mathbf r|$`, v: 6.73, u: 'м' }, { l: R`$\langle v\rangle$`, v: 4, u: 'м/с' }, { l: R`$|\langle\mathbf v\rangle|$`, v: 3.37, u: 'м/с' }],
  hints: [R`$s = v_0t + a_\tau t^2/2$. Центральный угол $\varphi = s/R$, хорда $|\Delta\mathbf r| = 2R\sin(\varphi/2)$.`],
  sol: [R`$s = 6 + 2 = 8$ м.`, R`$\varphi = s/R = 2$ рад, $|\Delta\mathbf r| = 2R\sin 1 = 8\cdot 0{,}841 \approx 6{,}73$ м.`, R`$\langle v\rangle = s/t = 4$ м/с.`, R`$|\langle\mathbf v\rangle| = |\Delta\mathbf r|/t \approx 3{,}37$ м/с (в задачнике 3,36).`] });

P('1-31', { topic: T2,
  fig: () => circleFig('R = 5 м', F.text(400, 120, 'v = 5 м/с', { c: C.chalk }) + F.text(400, 150, 's(t), |Δr(t)| — ?', { c: C.task })),
  text: R`<p>По окружности радиусом $R = 5$ м равномерно движется материальная точка со скоростью $v = 5$ м/с. Постройте графики зависимости длины пути $s$ и модуля перемещения $|\Delta\mathbf r|$ от времени $t$ (при $t = 0$ $s = 0$ и $|\Delta\mathbf r| = 0$). Для проверки найдите наибольшее значение $|\Delta\mathbf r|_{\max}$ и период $T$, через который $|\Delta\mathbf r|$ снова обращается в ноль.</p>`,
  ans: [{ l: R`$|\Delta\mathbf r|_{\max}$`, v: 10, u: 'м' }, { l: R`$T$`, v: 6.28, u: 'с' }],
  hints: [R`$s = vt$, а перемещение — хорда: $|\Delta\mathbf r| = 2R\left|\sin\dfrac{vt}{2R}\right|$.`],
  sol: [R`$s = vt$ — прямая.`, R`$|\Delta\mathbf r| = 2R|\sin(vt/2R)|$ — «арки» высотой $2R = 10$ м; ноль через каждый оборот $T = 2\pi R/v \approx 6{,}28$ с.`,
    { fig: () => F.graph({ x: 70, y: 260, w: 470, h: 220, xr: [0, 20], yr: [0, 60], xt: [6.28, 12.57, 18.85].map(v => +v.toFixed(1)), yt: [10, 30, 50], xl: 't, с', yl: 's, |Δr|, м',
      series: [{ f: t => 5 * t, r: [0, 12], c: C.task, label: 's(t)', lp: [10, 52] }, { f: t => 10 * Math.abs(Math.sin(t / 2)), c: C.good, label: '|Δr(t)|', lp: [14, 12] }] }) },
    R`<span class="note">В ответах задачника график нарисован с другим масштабом времени; расчёт по условию даёт период 6,28 с.</span>`] });

P('1-32', { topic: T2,
  fig: () => { const cx = 230, cy = 160, r = 100; return F.circle(cx, cy, r, { c: C.dim, dash: '4 6' }) + F.path(`M${cx + r} ${cy}A${r} ${r} 0 0 0 ${cx - r} ${cy}`, { c: C.task, w: 5 }) +
    F.arrow(cx + r, cy, cx - r, cy, { c: C.good }) + F.text(cx, cy + 26, '|Δr| = 2R', { c: C.good, anchor: 'middle' }) + F.text(400, 110, 'R = 0,8 м', { c: C.dim }) + F.text(400, 140, 'полокружности за 6 с', { c: C.dim }); },
  text: R`<p>За время $t = 6$ с точка прошла путь, равный половине длины окружности радиусом $R = 0{,}8$ м. Определите среднюю путевую скорость $\langle v\rangle$ за это время и модуль вектора средней скорости $|\langle\mathbf v\rangle|$.</p>`,
  ans: [{ l: R`$\langle v\rangle$`, v: .419, u: 'м/с' }, { l: R`$|\langle\mathbf v\rangle|$`, v: .267, u: 'м/с' }],
  hints: [R`Путь — полуокружность $\pi R$, перемещение — диаметр $2R$.`],
  traps: [{ i: 0, v: .837, m: R`Такой ответ (0,837) напечатан в задачнике, но это опечатка: $\pi R/t = \pi\cdot 0{,}8/6 \approx 0{,}419$ м/с.` }],
  note: 'В ответах задачника для ⟨v⟩ напечатано 0,837 м/с — это вдвое больше правильного значения πR/t.',
  sol: [R`$\langle v\rangle = \dfrac{\pi R}{t} = \dfrac{2{,}513}{6} \approx 0{,}419$ м/с.`, R`$|\langle\mathbf v\rangle| = \dfrac{2R}{t} = \dfrac{1{,}6}{6} \approx 0{,}267$ м/с.`] });

P('1-33', { topic: T2,
  fig: () => circleFig('R = 4 м', F.text(400, 120, 'ξ = A + Bt + Ct²', { c: C.chalk }) + F.text(400, 150, 't = 2 с', { c: C.dim })),
  text: R`<p>Движение точки по окружности радиусом $R = 4$ м задано уравнением $\xi = A + Bt + Ct^2$, где $A = 10$ м, $B = -2$ м/с, $C = 1$ м/с² ($\xi$ — криволинейная координата). Найдите тангенциальное $a_\tau$, нормальное $a_n$ и полное $a$ ускорения точки в момент $t = 2$ с.</p>`,
  ans: [{ l: R`$a_\tau$`, v: 2, u: 'м/с²' }, { l: R`$a_n$`, v: 1, u: 'м/с²' }, { l: R`$a$`, v: 2.24, u: 'м/с²' }],
  hints: [R`$v = B + 2Ct$, $a_\tau = 2C$, $a_n = v^2/R$.`],
  sol: [R`$v = -2 + 2\cdot 2 = 2$ м/с; $a_\tau = 2C = 2$ м/с².`, R`$a_n = 4/4 = 1$ м/с², $a = \sqrt{4 + 1} \approx 2{,}24$ м/с².`] });

P('1-34', { topic: T2,
  fig: () => { const cx = 200, cy = 250, r = 190, th = 70 * Math.PI / 180, px = cx + r * Math.cos(th), py = cy - r * Math.sin(th);
    const nx = (cx - px) / r, ny = (cy - py) / r, tx = -ny, ty = nx, k = 75;   // unit normal (to centre) and tangent
    const ax = nx * Math.cos(Math.PI / 3) + tx * Math.sin(Math.PI / 3), ay = ny * Math.cos(Math.PI / 3) + ty * Math.sin(Math.PI / 3);
    return F.path(`M${cx + r} ${cy}A${r} ${r} 0 0 0 ${cx - r * .2} ${cy - r * .98}`, { c: C.dim, w: 3 }) + F.dot(cx, cy, { c: C.dim, r: 4 }) + F.line(cx, cy, px, py, { c: C.dim, w: 1, dash: '4 6' }) + F.dot(px, py) +
      F.arrow(px, py, px + nx * k, py + ny * k, { c: C.blue, label: 'aₙ', lx: 18, ly: 4 }) + F.arrow(px, py, px + tx * k * 1.73, py + ty * k * 1.73, { c: C.good, label: 'aτ', lx: 0, ly: -10 }) +
      F.arrow(px, py, px + ax * k * 2, py + ay * k * 2, { c: C.task, label: 'a', lx: -6, ly: 18 }) +
      F.angle(px, py, 34, -Math.atan2(ny, nx) * 180 / Math.PI, -Math.atan2(ay, ax) * 180 / Math.PI, { label: '60°', c: C.chalk, size: 14, lr: 1.7 }) +
      F.text(400, 110, 'R = 10 м', { c: C.dim }) + F.text(400, 140, 'aₙ = 4,9 м/с²', { c: C.dim }); },
  text: R`<p>По дуге окружности радиусом $R = 10$ м движется точка. В некоторый момент времени нормальное ускорение точки $a_n = 4{,}9$ м/с²; в этот момент векторы полного и нормального ускорений образуют угол $\varphi = 60°$. Найдите скорость $v$ и тангенциальное ускорение $a_\tau$ точки.</p>`,
  ans: [{ l: R`$v$`, v: 7, u: 'м/с' }, { l: R`$a_\tau$`, v: 8.49, u: 'м/с²' }],
  hints: [R`$a_n = v^2/R$; из прямоугольного треугольника ускорений $\mathrm{tg}\,\varphi = a_\tau/a_n$.`],
  traps: [{ i: 1, v: 2.83, m: R`Вы взяли $\mathrm{tg}\,30°$. Угол $60°$ — между $\mathbf a$ и $\mathbf a_n$, так что $a_\tau = a_n\,\mathrm{tg}\,60°$.` }],
  sol: [R`$v = \sqrt{a_nR} = \sqrt{49} = 7$ м/с.`, R`$a_\tau = a_n\,\mathrm{tg}\,60° = 4{,}9\cdot 1{,}732 \approx 8{,}49$ м/с².`] });

P('1-35', { topic: T2,
  fig: () => circleFig('R = 2 м', F.text(400, 120, 'ξ = At³, A = 2 м/с³', { c: C.chalk }) + F.text(400, 150, 'aₙ = aτ — когда?', { c: C.task })),
  text: R`<p>Точка движется по окружности радиусом $R = 2$ м согласно уравнению $\xi = At^3$, где $A = 2$ м/с³. В какой момент времени $t$ нормальное ускорение $a_n$ точки будет равно тангенциальному $a_\tau$? Определите полное ускорение $a$ в этот момент.</p>`,
  ans: [{ l: R`$t$`, v: .874, u: 'с' }, { l: R`$a$`, v: 14.8, u: 'м/с²' }],
  hints: [R`$v = 3At^2$, $a_\tau = 6At$, $a_n = v^2/R = 9A^2t^4/R$.`],
  sol: [R`$\dfrac{9A^2t^4}{R} = 6At$ ⇒ $t^3 = \dfrac{2R}{3A} = \dfrac23$, $t \approx 0{,}874$ с (в задачнике 0,872).`, R`$a = \sqrt2\,a_\tau = \sqrt2\cdot 6At \approx 14{,}8$ м/с².`] });

P('1-36', { topic: T2,
  fig: () => F.graph({ x: 80, y: 270, w: 450, h: 230, xr: [0, 1.6], yr: [0, 3.4], xt: [.5, 1, 1.5], yt: [1, 2, 3], xl: 'x, м', yl: 'y, м',
    series: [{ pts: Array.from({ length: 47 }, (_, k) => { const t = k / 40; return [t ** 3, 2 * t]; }), c: C.task }],
    marks: (X, Y) => F.dot(X(.512), Y(1.6), { c: C.good }) + F.text(X(.512) + 10, Y(1.6) + 4, 't = 0,8 с', { c: C.good, size: 14 }) }),
  text: R`<p>Движение точки по кривой задано уравнениями $x = A_1t^3$ и $y = A_2t$, где $A_1 = 1$ м/с³, $A_2 = 2$ м/с. Найдите уравнение траектории точки, её скорость $v$ и полное ускорение $a$ в момент $t = 0{,}8$ с.</p>`,
  ans: [{ l: 'траектория', choices: [R`$y^3 - 8x = 0$`, R`$y^2 = 4x$`, R`$y = 2x^3$`], c: 0 }, { l: R`$v$`, v: 2.77, u: 'м/с' }, { l: R`$a$`, v: 4.8, u: 'м/с²' }],
  hints: [R`Исключите $t$: $t = y/A_2$.`, R`$v_x = 3A_1t^2$, $v_y = A_2$; $a_x = 6A_1t$, $a_y = 0$.`],
  sol: [R`$t = y/2$ ⇒ $x = y^3/8$, то есть $y^3 - 8x = 0$.`, R`$v = \sqrt{(3t^2)^2 + 2^2} = \sqrt{1{,}92^2 + 4} \approx 2{,}77$ м/с.`, R`$a = 6t = 4{,}8$ м/с².`] });

const fig18 = () => circleFig('R', F.dot(230, 40, { c: C.good }) + F.text(240, 30, 'A', { c: C.good, it: true }) + F.arrow(240, 40, 300, 40, { c: C.good, label: 'v', ly: -8 }) +
  F.arrow(80, 150, 390, 150, { c: C.dim, w: 1.5 }) + F.text(392, 170, 'x', { c: C.dim, it: true }) + F.arrow(230, 290, 230, 20, { c: C.dim, w: 1.5 }) + F.text(214, 26, 'y', { c: C.dim, it: true }) + F.text(214, 168, 'O', { c: C.dim }));
P('1-37', { topic: T2, fig: fig18,
  text: R`<p>Точка $A$ движется равномерно со скоростью $v$ по окружности радиусом $R$. Начальное положение точки и направление движения указаны на рисунке. Напишите кинематическое уравнение движения проекции точки $A$ на ось $x$.</p>`,
  ans: [{ l: R`$x(t)$`, choices: [R`$R\sin\dfrac{vt}{R}$`, R`$R\cos\dfrac{vt}{R}$`, R`$-R\sin\dfrac{vt}{R}$`], c: 0 }],
  hints: [R`При $t = 0$ точка наверху, значит $x(0) = 0$; затем она движется вправо — $x$ растёт.`],
  sol: [R`Угол, отсчитанный от вертикали по ходу движения, $\varphi = vt/R$.`, R`Проекция на ось $x$: $x = R\sin(vt/R)$.`] });

P('1-38', { topic: T2, fig: fig18,
  text: R`<p>Точка движется равномерно со скоростью $v$ по окружности радиусом $R$ и в момент $t = 0$ занимает положение, указанное на рисунке. Напишите кинематические уравнения движения точки: 1) в декартовой системе координат; 2) в полярной системе (ось $x$ — полярная ось).</p>`,
  ans: [{ l: R`$y(t)$`, choices: [R`$R\cos\dfrac{vt}{R}$`, R`$R\sin\dfrac{vt}{R}$`, R`$-R\cos\dfrac{vt}{R}$`], c: 0 }, { l: R`$\varphi(t)$`, choices: [R`$\dfrac{vt}{R}$`, R`$\dfrac{\pi}{2} - \dfrac{vt}{R}$`, R`$\dfrac{\pi}{2} + \dfrac{vt}{R}$`], c: 1 }],
  hints: [R`Точка начинает сверху ($\varphi = \pi/2$) и идёт по часовой стрелке — полярный угол убывает.`],
  sol: [R`Декартовы: $x = R\sin(vt/R)$, $y = R\cos(vt/R)$.`, R`Полярные: $r = R$, $\varphi = \dfrac{\pi}{2} - \dfrac{vt}{R}$.`] });

P('1-39', { topic: T2,
  fig: () => {
    const cell = (ox, oy, lab, aStart, ang, sOff) => {
      let s = F.arrow(ox + 20, oy, ox + 250, oy, { c: C.dim, w: 1.5, head: 8 }) + F.arrow(ox + 30, oy + 10, ox + 30, oy - 110, { c: C.dim, w: 1.5, head: 8 }) +
        F.text(ox + 246, oy + 16, 'x', { c: C.dim, it: true, size: 14 }) + F.text(ox + 36, oy - 104, 'y', { c: C.dim, it: true, size: 14 }) + F.text(ox + 16, oy + 16, 'O', { c: C.dim, size: 13 });
      const Ax = ox + 30 + sOff, Ay = aStart ? oy - 80 : oy - 80;
      s += F.dot(Ax, Ay) + F.text(Ax - 10, Ay - 10, 'A', { c: C.task, it: true, size: 14 }) + F.arrow(Ax, Ay, Ax + 50 * Math.cos(ang), Ay - 50 * Math.sin(ang), { c: C.good, w: 2.5, head: 9 }) +
        F.arrow(ox + 230, oy - 100, ox + 230, oy - 60, { c: C.bad, w: 2.5, head: 9 }) + F.text(ox + 240, oy - 70, 'g', { c: C.bad, it: true, size: 14 }) +
        F.text(ox, oy - 120, lab, { c: C.dim }) + (sOff ? F.text(ox + 30 + sOff / 2, oy + 16, 's', { c: C.dim, it: true, size: 14, anchor: 'middle' }) : '') + F.text(ox + 20, oy - 40, 'h', { c: C.dim, it: true, size: 14, anchor: 'end' });
      return s;
    };
    return F.svg ? { w: 600, h: 300, body: cell(0, 130, 'а)', 1, 0, 0) + cell(300, 130, 'б)', 1, .5, 0) + cell(0, 280, 'в)', 1, 0, 60) + cell(300, 280, 'г)', 1, -.5, 60) } : '';
  },
  text: R`<p>Напишите для четырёх случаев, представленных на рисунке: 1) кинематические уравнения движения $x = f_1(t)$ и $y = f_2(t)$; 2) уравнение траектории $y = \varphi(x)$. На каждой позиции — координатные оси, начальное положение точки $A$ (на высоте $h$, в случаях «в» и «г» — на расстоянии $s$ по горизонтали), её начальная скорость $\mathbf v_0$ (горизонтально или под углом $\alpha$) и ускорение $\mathbf g$.</p>`,
  self: { html: R`<p>а) $x = v_0t$, $y = h - gt^2/2$; $y = h - \dfrac{gx^2}{2v_0^2}$.</p>
    <p>б) $x = v_0t\cos\alpha$, $y = h + v_0t\sin\alpha - gt^2/2$; $y = h + x\,\mathrm{tg}\,\alpha - \dfrac{gx^2}{2v_0^2\cos^2\alpha}$.</p>
    <p>в) $x = s + v_0t$, $y = h - gt^2/2$; $y = h - \dfrac{g(x - s)^2}{2v_0^2}$.</p>
    <p>г) $x = s + v_0t\cos\alpha$, $y = h - v_0t\sin\alpha - gt^2/2$; $y = h - (x - s)\,\mathrm{tg}\,\alpha - \dfrac{g(x - s)^2}{2v_0^2\cos^2\alpha}$.</p>
    <p class="note">Знаки зависят от того, куда направлены оси. Если на вашем рисунке ось $y$ направлена вниз или начало координат в точке $A$, уравнения будут отличаться сдвигом и знаками — это тоже верно.</p>` },
  hints: [R`По горизонтали движение равномерное: $x = x_0 + v_{0x}t$; по вертикали — равноускоренное: $y = y_0 + v_{0y}t - gt^2/2$.`, R`Чтобы получить траекторию, выразите $t$ из уравнения для $x$ и подставьте в $y$.`],
  sol: [R`Для каждого случая задайте начальные координаты $(x_0;\,y_0)$ и проекции скорости $v_{0x}$, $v_{0y}$, затем подставьте их в $x = x_0 + v_{0x}t$, $y = y_0 + v_{0y}t - gt^2/2$. Ответы — в блоке «Ответ».`] });

P('1-40', { topic: T2,
  fig: () => F.ground(40, 570, 270) + F.tower(90, 270, 180) + F.ball(110, 90, 9) + F.arrow(110, 90, 175, 90, { c: C.good, label: 'v₀', ly: -8 }) +
    F.path(proj(110, 90, 160, 0, 90, 270), { c: C.task, w: 2.5, dash: '6 6' }) + F.runner(proj(110, 90, 160, 0, 90, 270), { dur: 2 }) +
    F.line(90, 290, 430, 290, { c: C.dim, w: 1.5 }) + F.text(260, 288 + 0, 's = 40 м', { c: C.dim, anchor: 'middle', size: 14 }) + F.text(420, 120, 't = 2 с', { c: C.dim }),
  text: R`<p>С вышки бросили камень в горизонтальном направлении. Через промежуток времени $t = 2$ с камень упал на землю на расстоянии $s = 40$ м от основания вышки. Определите начальную $v_0$ и конечную $v$ скорости камня.</p>`,
  ans: [{ l: R`$v_0$`, v: 20, u: 'м/с' }, { l: R`$v$`, v: 28, u: 'м/с' }],
  hints: [R`По горизонтали скорость постоянна: $v_0 = s/t$. В конце вертикальная составляющая $v_y = gt$.`],
  traps: [{ i: 1, v: 19.6, m: R`Это только вертикальная составляющая. Конечная скорость — $\sqrt{v_0^2 + (gt)^2}$.` }],
  sol: [R`$v_0 = s/t = 20$ м/с.`, R`$v_y = gt = 19{,}6$ м/с, $v = \sqrt{400 + 385} \approx 28$ м/с.`] });

P('1-41', { topic: T2,
  fig: () => F.ground(40, 570, 270) + F.tower(90, 270, 150) + F.ball(110, 120, 9) + F.arrow(110, 120, 175, 120, { c: C.good, label: 'v = 20 м/с', lx: 30, ly: -8 }) +
    F.path(proj(110, 120, 190, 0, 125, 270), { c: C.task, w: 2.5, dash: '6 6' }) + F.runner(proj(110, 120, 190, 0, 125, 270), { dur: 2 }) +
    F.text(60, 200, 'h', { c: C.dim, it: true }) + F.text(250, 292, 's = 2h', { c: C.dim, anchor: 'middle' }),
  text: R`<p>Тело, брошенное с башни в горизонтальном направлении со скоростью $v = 20$ м/с, упало на землю на расстоянии $s$ от основания башни, вдвое большем высоты $h$ башни. Найдите высоту башни.</p>`,
  ans: [{ l: R`$h$`, v: 20.4, u: 'м' }],
  hints: [R`$s = vt$, $h = gt^2/2$, и по условию $s = 2h$.`],
  sol: [R`$t = \sqrt{2h/g}$, $s = v\sqrt{2h/g} = 2h$.`, R`Возводя в квадрат: $v^2\cdot 2h/g = 4h^2$ ⇒ $h = \dfrac{v^2}{2g} = \dfrac{400}{19{,}6} \approx 20{,}4$ м.`] });

P('1-42', { topic: T2,
  fig: () => F.line(140, 60, 140, 260, { c: C.chalk, w: 5 }) + F.line(460, 60, 460, 260, { c: C.chalk, w: 5 }) + F.path('M40 120L140 120Q300 125 460 150', { c: C.task, w: 2.5, dash: '6 6' }) +
    F.dot(140, 120, { c: C.bad, r: 5 }) + F.dot(460, 150, { c: C.bad, r: 5 }) + F.arrow(40, 120, 110, 120, { c: C.good, label: 'v', ly: -8 }) +
    F.text(300, 290, 'l = 30 м', { c: C.dim, anchor: 'middle' }) + F.line(140, 275, 460, 275, { c: C.dim, w: 1.5 }) + F.text(475, 140, 'h = 10 см ниже', { c: C.bad, size: 14 }),
  text: R`<p>Пистолетная пуля пробила два вертикально закреплённых листа бумаги, расстояние $l$ между которыми равно 30 м. Пробоина во втором листе оказалась на $h = 10$ см ниже, чем в первом. Определите скорость $v$ пули, если к первому листу она подлетела, двигаясь горизонтально. Сопротивлением воздуха пренебречь.</p>`,
  ans: [{ l: R`$v$`, v: 210, u: 'м/с' }],
  hints: [R`Время полёта между листами $t = l/v$, за это время пуля опустится на $h = gt^2/2$.`],
  sol: [R`$h = \dfrac{g}{2}\left(\dfrac lv\right)^2$ ⇒ $v = l\sqrt{\dfrac{g}{2h}} = 30\sqrt{49{,}05} \approx 210$ м/с.`] });

P('1-43', { topic: T2,
  fig: () => F.ground(40, 570, 270) + `<g transform="translate(110 60)"><path d="M-40 0H40L50 -8H-30Z M-10 0L-25 14H5Z M30 -6L44 -20H52L46 -6" fill="${C.blue}"/></g>` +
    F.path(proj(110, 66, 170, 0, 70, 270), { c: C.task, w: 2.5, dash: '6 6' }) + F.runner(proj(110, 66, 170, 0, 70, 270), { dur: 2.5 }) +
    F.text(70, 170, 'h = 2940 м', { c: C.dim, anchor: 'middle', size: 14 }) + F.text(420, 290, 'цель', { c: C.bad, anchor: 'middle', size: 14 }) + F.dot(510, 268, { c: C.bad }) +
    F.line(110, 288, 505, 288, { c: C.dim, w: 1.5 }) + F.text(300, 300, 's — ?', { c: C.dim, size: 13, anchor: 'middle' }),
  text: R`<p>Самолёт, летевший на высоте $h = 2940$ м со скоростью $v = 360$ км/ч, сбросил бомбу. За какое время $t$ до прохождения над целью и на каком расстоянии $s$ от неё должен самолёт сбросить бомбу, чтобы попасть в цель? Сопротивлением воздуха пренебречь.</p>`,
  ans: [{ l: R`$t$`, v: 24.5, u: 'с' }, { l: R`$s$`, v: 2450, u: 'м' }],
  hints: [R`Бомба летит по горизонтали с той же скоростью, что и самолёт, — переведите 360 км/ч в м/с.`],
  traps: [{ i: 1, v: 8820, m: 'Скорость нужно перевести в м/с: 360 км/ч = 100 м/с.' }],
  sol: [R`$t = \sqrt{2h/g} = \sqrt{600} \approx 24{,}5$ с.`, R`$s = vt = 100\cdot 24{,}5 \approx 2450$ м.`] });

P('1-44', { topic: T2,
  fig: () => F.ground(40, 570, 260) + F.path(proj(80, 258, 100, 100, 50, 258), { c: C.task, w: 3 }) + F.runner(proj(80, 258, 100, 100, 50, 258), { dur: 2.5 }) +
    F.angle(80, 258, 40, 0, 45, { label: 'α' }) + F.line(80, 282, 480, 282, { c: C.dim, w: 1.5 }) + F.text(280, 300, 's = 4H', { c: C.dim, anchor: 'middle', size: 15 }) +
    F.line(280, 158, 280, 258, { c: C.good, w: 2, dash: '5 5' }) + F.text(292, 215, 'H', { c: C.good, it: true }),
  text: R`<p>Тело брошено под некоторым углом $\alpha$ к горизонту. Найдите величину этого угла, если горизонтальная дальность $s$ полёта тела в четыре раза больше максимальной высоты $H$ траектории.</p>`,
  ans: [{ l: R`$\alpha$`, v: 45, u: '°' }],
  hints: [R`$s = \dfrac{v_0^2\sin 2\alpha}{g}$, $H = \dfrac{v_0^2\sin^2\alpha}{2g}$. Поделите одно на другое.`],
  sol: [R`$\dfrac sH = \dfrac{2\sin 2\alpha}{\sin^2\alpha} = 4\,\mathrm{ctg}\,\alpha$.`, R`$4\,\mathrm{ctg}\,\alpha = 4$ ⇒ $\alpha = 45°$.`] });

P('1-45', { topic: T2,
  fig: () => F.ground(30, 580, 275) + F.path('M30 275V215H120V275', { c: C.dim, w: 2.5 }) + F.text(20, 250, 'h = 40 м', { c: C.dim, size: 13 }) +
    F.path(proj(100, 210, 50, 90, 34, 275), { c: C.task, w: 3 }) + F.runner(proj(100, 210, 50, 90, 34, 275), { dur: 3.5 }) +
    F.angle(100, 210, 35, 0, 60, { label: 'α' }) + F.text(420, 70, 'v₀ = 50 м/с', { c: C.good }),
  text: R`<p>Миномёт установлен под углом $\alpha = 60°$ к горизонту на крыше здания высотой $h = 40$ м. Начальная скорость мины $v_0 = 50$ м/с. 1) Напишите кинематические уравнения движения и уравнение траектории. 2) Определите время $\tau$ полёта мины, максимальную высоту $H$ её подъёма (над землёй), горизонтальную дальность $s$ полёта, скорость $v$ в момент падения. Сопротивлением воздуха пренебречь. Начало координат — на поверхности земли под миномётом.</p>`,
  ans: [{ l: R`$\tau$`, v: 9.67, u: 'с' }, { l: R`$H$`, v: 136, u: 'м' }, { l: R`$s$`, v: 242, u: 'м' }, { l: R`$v$`, v: 57.3, u: 'м/с' }],
  hints: [R`$x = v_0t\cos\alpha$, $y = h + v_0t\sin\alpha - gt^2/2$. Время полёта — положительный корень уравнения $y = 0$.`, R`$H = h + \dfrac{v_0^2\sin^2\alpha}{2g}$; скорость при падении — из закона сохранения энергии: $v = \sqrt{v_0^2 + 2gh}$.`],
  traps: [{ i: 0, v: 9.28, m: 'Это значение напечатано в ответах задачника, но оно не согласуется с его же дальностью $s = 242$ м. Правильное время — около 9,67 с.' }],
  note: 'В ответах задачника время полёта напечатано как 9,28 с, но тогда s = v₀τ cos α = 232 м ≠ 242 м. Верное значение τ ≈ 9,67 с.',
  sol: [R`Уравнения: $x = v_0t\cos\alpha$, $y = h + v_0t\sin\alpha - gt^2/2$; траектория $y = h + x\,\mathrm{tg}\,\alpha - \dfrac{gx^2}{2v_0^2\cos^2\alpha}$.`,
    R`$H = 40 + \dfrac{2500\cdot 0{,}75}{19{,}62} \approx 136$ м.`, R`Подъём $t_1 = v_0\sin\alpha/g \approx 4{,}41$ с, падение с 136 м: $t_2 = \sqrt{2H/g} \approx 5{,}26$ с; $\tau \approx 9{,}67$ с.`,
    R`$s = v_0\cos\alpha\cdot\tau = 25\cdot 9{,}67 \approx 242$ м.`, R`$v = \sqrt{v_0^2 + 2gh} = \sqrt{2500 + 785} \approx 57{,}3$ м/с.`] });

P('1-46', { topic: T2,
  fig: () => F.ground(30, 580, 275) + F.path(proj(50, 270, 120, 69.3, 32, 272), { c: C.task, w: 3 }) + F.runner(proj(50, 270, 120, 69.3, 32, 272), { dur: 4 }) +
    F.line(30, 229, 580, 229, { c: C.good, w: 1.5, dash: '6 6' }) + F.dot(137, 229, { c: C.good }) + F.dot(483, 229, { c: C.good }) +
    F.text(137, 215, 't₁ = 10 с', { c: C.good, anchor: 'middle', size: 14 }) + F.text(483, 215, 't₂ = 50 с', { c: C.good, anchor: 'middle', size: 14 }) +
    F.text(570, 250, 'h', { c: C.good, it: true }) + F.angle(50, 270, 40, 0, 30, { label: 'α' }) + F.text(300, 120, 'α = 30°', { c: C.dim }),
  text: R`<p>Снаряд, выпущенный из орудия под углом $\alpha = 30°$ к горизонту, дважды был на одной и той же высоте $h$: спустя время $t_1 = 10$ с и $t_2 = 50$ с после выстрела. Определите начальную скорость $v_0$ и высоту $h$.</p>`,
  ans: [{ l: R`$v_0$`, v: 588, u: 'м/с' }, { l: R`$h$`, v: 2450, u: 'м' }],
  hints: [R`$t_1$ и $t_2$ — корни уравнения $h = v_0t\sin\alpha - gt^2/2$. По теореме Виета: $t_1 + t_2 = \dfrac{2v_0\sin\alpha}{g}$, $t_1t_2 = \dfrac{2h}{g}$.`],
  sol: [R`$v_0 = \dfrac{g(t_1 + t_2)}{2\sin\alpha} = \dfrac{9{,}81\cdot 60}{1} \approx 588$ м/с.`, R`$h = \dfrac{gt_1t_2}{2} = \dfrac{9{,}81\cdot 500}{2} \approx 2450$ м.`] });

P('1-47', { topic: T2,
  fig: () => F.ground(30, 580, 275) + F.path(proj(60, 270, 120, 208, 100, 272), { c: C.task, w: 3 }) + F.runner(proj(60, 270, 120, 208, 100, 272), { dur: 3.5 }) +
    F.angle(60, 270, 35, 0, 60, { label: 'α' }) + F.arrow(310, 54, 400, 54, { c: C.good, label: 'v в вершине', lx: 60, ly: 5 }) + F.arrow(310, 54, 310, 110, { c: C.bad, label: 'g', lx: 12 }) +
    F.line(310, 110, 310, 270, { c: C.dim, w: 1.5, dash: '5 5' }) + F.text(320, 190, 'H', { c: C.dim, it: true }),
  text: R`<p>Пуля пущена с начальной скоростью $v_0 = 200$ м/с под углом $\alpha = 60°$ к горизонту. Определите максимальную высоту $H$ подъёма, дальность $s$ полёта и радиус $R$ кривизны траектории пули в её наивысшей точке. Сопротивлением воздуха пренебречь.</p>`,
  ans: [{ l: R`$H$`, v: 1530, u: 'м' }, { l: R`$s$`, v: 3530, u: 'м' }, { l: R`$R$`, v: 1020, u: 'м' }],
  hints: [R`В наивысшей точке скорость горизонтальна ($v = v_0\cos\alpha$), а ускорение $g$ — нормальное: $g = v^2/R$.`],
  sol: [R`$H = \dfrac{v_0^2\sin^2\alpha}{2g} = \dfrac{40000\cdot 0{,}75}{19{,}62} \approx 1{,}53$ км.`, R`$s = \dfrac{v_0^2\sin 2\alpha}{g} \approx 3{,}53$ км.`, R`$R = \dfrac{(v_0\cos\alpha)^2}{g} = \dfrac{10000}{9{,}81} \approx 1{,}02$ км.`] });

P('1-48', { topic: T2,
  fig: () => { const x = 290, y = 144.7, ux = .812, uy = .584;
    return F.ground(40, 570, 280) + F.tower(90, 280, 200) + F.path(proj(110, 80, 90, 0, 32.34, 280), { c: C.task, w: 2.5, dash: '6 6' }) + F.ball(x, y, 9) +
      F.arrow(x, y, x + ux * 80, y + uy * 80, { c: C.good, label: 'v', lx: 12, ly: 6 }) + F.arrow(x, y, x - uy * 60, y + ux * 60, { c: C.blue, label: 'aₙ', lx: -16, ly: 6 }) +
      F.arrow(x, y, x + ux * 45, y + uy * 45, { c: C.task, w: 4, head: 12 }) + F.text(x + 50, y + 10, 'aτ', { c: C.task, it: true, size: 16 }) +
      F.arrow(x, y, x, y + 75, { c: C.bad, label: 'g', lx: 12 }) + F.text(420, 80, 't = 2 с', { c: C.dim }) + F.arrow(110, 80, 160, 80, { c: C.good, label: 'v₀', ly: -8 }); },
  text: R`<p>Камень брошен с вышки в горизонтальном направлении с начальной скоростью $v_0 = 30$ м/с. Определите скорость $v$, тангенциальное $a_\tau$ и нормальное $a_n$ ускорения камня в конце второй секунды после начала движения.</p>`,
  ans: [{ l: R`$v$`, v: 35.8, u: 'м/с' }, { l: R`$a_\tau$`, v: 5.37, u: 'м/с²' }, { l: R`$a_n$`, v: 8.21, u: 'м/с²', tol: .025 }],
  hints: [R`Полное ускорение равно $g$. Разложите его на составляющие вдоль скорости и поперёк: $a_\tau = g\,v_y/v$, $a_n = g\,v_x/v$.`],
  sol: [R`$v_y = gt = 19{,}6$ м/с, $v = \sqrt{900 + 385} \approx 35{,}8$ м/с.`, R`$a_\tau = g\dfrac{v_y}{v} = 9{,}81\cdot\dfrac{19{,}6}{35{,}8} \approx 5{,}37$ м/с².`, R`$a_n = g\dfrac{v_0}{v} = 9{,}81\cdot\dfrac{30}{35{,}8} \approx 8{,}21$ м/с² (в задачнике 8,22).`] });

P('1-49', { topic: T2,
  fig: () => F.ground(40, 570, 270) + F.path(proj(120, 268, 170, 98, 40, 270), { c: C.dim, w: 2, dash: '6 6' }) +
    F.arrow(120, 268, 120 + 110 * .866, 268 - 110 * .5, { c: C.good, label: 'v₀', lx: 12 }) + F.angle(120, 268, 40, 0, 30, { label: 'α' }) +
    F.arrow(330, 70, 330, 140, { c: C.bad, label: 'g', lx: 12 }) + F.text(360, 110, 'aτ, aₙ при t = 0 — ?', { c: C.task, size: 16 }),
  text: R`<p>Тело брошено под углом $\alpha = 30°$ к горизонту. Найдите тангенциальное $a_\tau$ и нормальное $a_n$ ускорения в начальный момент движения.</p>`,
  ans: [{ l: R`$|a_\tau|$`, v: 4.9, u: 'м/с²' }, { l: R`$a_n$`, v: 8.5, u: 'м/с²' }],
  hints: [R`Ускорение $\mathbf g$ направлено вниз, скорость — под углом $30°$ к горизонту. Угол между ними $120°$.`],
  traps: [{ i: 1, v: 4.9, m: R`Это составляющая вдоль скорости. Поперёк скорости — $g\cos\alpha$.` }],
  sol: [R`$a_\tau = -g\sin\alpha = -4{,}9$ м/с² (тело тормозит), по модулю 4,9 м/с².`, R`$a_n = g\cos\alpha = 9{,}81\cdot 0{,}866 \approx 8{,}5$ м/с² (в задачнике 8,55).`] });
