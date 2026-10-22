// § 1. Задачи 1-50 … 1-61: вращение тела вокруг неподвижной оси.
'use strict';
const T3 = 'Вращение тела вокруг оси';
// A spinning disk/wheel with spokes; dur — seconds per turn on screen (negative = clockwise).
const wheelFig = (cx, cy, r, { dur = 3, spokes = 6, c = C.chalk } = {}) => {
  let s = F.circle(cx, cy, r, { c, w: 5 }) + F.circle(cx, cy, 10, { c: C.dim, fill: '#2b3d37' });
  for (let k = 0; k < spokes; k++) { const a = k * 2 * Math.PI / spokes; s += F.line(cx + 10 * Math.cos(a), cy + 10 * Math.sin(a), cx + (r - 3) * Math.cos(a), cy + (r - 3) * Math.sin(a), { c: C.dim, w: 2.5 }); }
  return `<g><animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="${dur > 0 ? -360 : 360} ${cx} ${cy}" dur="${Math.abs(dur)}s" repeatCount="indefinite"/>${s}</g>`;
};

P('1-50', { topic: T3,
  fig: () => { const cx = 200, cy = 150, r = 120, phi = 56 * Math.PI / 180, mx = cx + r * Math.cos(phi), my = cy - r * Math.sin(phi);
    return F.circle(cx, cy, r, { c: C.blue, w: 3 }) + F.line(cx, 10, cx, 290, { c: C.dim, w: 1.5, dash: '6 6' }) + F.line(cx - r, cy, cx + r, cy, { c: C.dim, w: 1.5 }) +
      F.line(cx, cy, mx, my, { c: C.dim, w: 1.5 }) + F.angle(cx, cy, 36, 0, 56, { label: 'φ' }) + F.dot(mx, my, { c: C.task }) + F.text(mx + 10, my - 6, 'Москва', { c: C.task, size: 14 }) +
      F.dot(cx + r, cy, { c: C.good }) + F.text(cx + r + 8, cy + 20, 'экватор', { c: C.good, size: 14 }) + F.line(cx, my, mx, my, { c: C.task, w: 1.5, dash: '4 4' }) +
      F.text(cx + 10, my + 18, 'R cos φ', { c: C.task, size: 13 }) + F.text(400, 120, 'T = 24 ч', { c: C.dim }) + F.text(400, 150, 'R = 6370 км', { c: C.dim }); },
  text: R`<p>Определите линейную скорость $v$ и центростремительное ускорение $a_n$ точек, лежащих на земной поверхности: 1) на экваторе; 2) на широте Москвы ($\varphi = 56°$).</p>`,
  ans: [{ l: R`$v$ (экватор)`, v: 463, u: 'м/с' }, { l: R`$a_n$ (экватор)`, v: 3.37, u: 'см/с²' }, { l: R`$v$ (Москва)`, v: 259, u: 'м/с' }, { l: R`$a_n$ (Москва)`, v: 1.88, u: 'см/с²' }],
  hints: [R`Точка на широте $\varphi$ движется по окружности радиусом $R\cos\varphi$ с периодом $T = 24$ ч.`, R`$v = \dfrac{2\pi R\cos\varphi}{T}$, $a_n = \dfrac{4\pi^2}{T^2}R\cos\varphi$. Ускорение ответа — в см/с².`],
  sol: [R`$\omega = 2\pi/T = 2\pi/86\,400 \approx 7{,}27\cdot 10^{-5}$ рад/с.`, R`Экватор: $v = \omega R \approx 463$ м/с, $a_n = \omega^2R \approx 0{,}0337$ м/с² $= 3{,}37$ см/с².`,
    R`Москва: радиус $R\cos 56° \approx 3560$ км, $v \approx 259$ м/с, $a_n \approx 1{,}88$ см/с².`] });

P('1-51', { topic: T3,
  fig: () => wheelFig(200, 150, 120) + F.dot(320, 150, { c: C.task }) + F.dot(270, 150, { c: C.good }) +
    F.arrow(320, 150, 320, 70, { c: C.task, label: 'v₁ = 3 м/с', lx: 50, ly: 4 }) + F.arrow(270, 150, 270, 97, { c: C.good, label: 'v₂ = 2 м/с', lx: -10, ly: -12 }) +
    F.text(360, 210, 'ΔR = 10 см', { c: C.dim, anchor: 'middle', size: 14 }) + F.line(270, 160, 320, 160, { c: C.dim, w: 1.5 }) + F.text(400, 250, 'n — ?', { c: C.task }),
  text: R`<p>Линейная скорость $v_1$ точек на окружности вращающегося диска равна 3 м/с. Точки, расположенные на $\Delta R = 10$ см ближе к оси, имеют линейную скорость $v_2 = 2$ м/с. Определите частоту вращения $n$ диска.</p>`,
  ans: [{ l: R`$n$`, v: 1.59, u: 'с⁻¹' }],
  hints: [R`$v_1 = \omega R$, $v_2 = \omega(R - \Delta R)$ — вычтите, и радиус $R$ уйдёт.`],
  traps: [{ i: 0, v: 10, m: R`Это угловая скорость $\omega$ в рад/с. Частота $n = \omega/(2\pi)$.` }],
  sol: [R`$v_1 - v_2 = \omega\Delta R$ ⇒ $\omega = \dfrac{1}{0{,}1} = 10$ рад/с.`, R`$n = \dfrac{\omega}{2\pi} \approx 1{,}59$ с⁻¹.`] });

P('1-52', { topic: T3,
  fig: () => F.line(60, 160, 560, 160, { c: C.dim, w: 3 }) +
    `<ellipse cx="200" cy="160" rx="22" ry="110" fill="#2b3d37" stroke="${C.chalk}" stroke-width="3"/><ellipse cx="420" cy="160" rx="22" ry="110" fill="#2b3d37" stroke="${C.chalk}" stroke-width="3"/>` +
    F.path('M40 88L420 90', { c: C.task, w: 2, dash: '6 6' }) + F.dot(200, 88, { c: C.bad, r: 5 }) + F.dot(420, 92, { c: C.bad, r: 5 }) +
    F.text(310, 300, 'd = 30 см', { c: C.dim, anchor: 'middle' }) + F.line(200, 285, 420, 285, { c: C.dim, w: 1.5 }) +
    F.text(470, 70, 'смещение пробоин s = 5 см', { c: C.bad, size: 14 }) + F.text(80, 130, 'r = 12 см', { c: C.dim, size: 14 }) + F.text(470, 250, 'n = 25 с⁻¹', { c: C.dim }),
  text: R`<p>Два бумажных диска насажены на общую горизонтальную ось так, что плоскости их параллельны и отстоят на $d = 30$ см друг от друга. Диски вращаются с частотой $n = 25$ с⁻¹. Пуля, летевшая параллельно оси на расстоянии $r = 12$ см от неё, пробила оба диска. Пробоины смещены друг относительно друга на расстояние $s = 5$ см, считая по дуге окружности. Найдите среднюю путевую скорость $\langle v\rangle$ пули между дисками и оцените смещение $\Delta y$ пробоин по вертикали, вызванное силой тяжести.</p>`,
  ans: [{ l: R`$\langle v\rangle$`, v: 113, u: 'м/с' }, { l: R`$\Delta y$`, v: 35, u: 'мкм', tol: .05 }],
  hints: [R`Пока пуля летит между дисками, они поворачиваются на угол $\varphi = s/r$. Время полёта $t = \varphi/(2\pi n)$.`],
  sol: [R`$\varphi = s/r = 5/12 \approx 0{,}417$ рад; $t = \dfrac{\varphi}{2\pi n} = \dfrac{0{,}417}{157} \approx 2{,}65\cdot 10^{-3}$ с.`,
    R`$\langle v\rangle = d/t = 0{,}3/2{,}65\cdot 10^{-3} \approx 113$ м/с.`, R`$\Delta y = gt^2/2 \approx 3{,}5\cdot 10^{-5}$ м $= 35$ мкм — очень мало.`] });

P('1-53', { topic: T3,
  fig: () => wheelFig(250, 90, 50, { dur: -2.5, spokes: 4 }) + F.line(300, 90, 300, 230, { c: C.chalk, w: 2 }) +
    `<rect x="285" y="230" width="30" height="30" rx="3" fill="${C.task}"><animate attributeName="y" values="150;260;150" dur="5s" repeatCount="indefinite"/></rect>` +
    F.text(340, 200, 'h = 1,5 м за t = 3 с', { c: C.dim }) + F.text(250, 30, 'r = 4 см', { c: C.dim, anchor: 'middle' }) + F.text(340, 240, 'ε — ?', { c: C.task }),
  text: R`<p>На цилиндр, который может вращаться около горизонтальной оси, намотана нить. К концу нити привязали грузик и предоставили ему возможность опускаться. Двигаясь равноускоренно, грузик за время $t = 3$ с опустился на $h = 1{,}5$ м. Определите угловое ускорение $\varepsilon$ цилиндра, если его радиус $r = 4$ см.</p>`,
  ans: [{ l: R`$\varepsilon$`, v: 8.33, u: 'рад/с²' }],
  hints: [R`Ускорение грузика $a = 2h/t^2$ равно тангенциальному ускорению точек обода: $a = \varepsilon r$.`],
  traps: [{ i: 0, v: .0833, m: 'Радиус надо перевести в метры: 4 см = 0,04 м.' }],
  sol: [R`$a = \dfrac{2h}{t^2} = \dfrac{3}{9} \approx 0{,}333$ м/с².`, R`$\varepsilon = \dfrac ar = \dfrac{0{,}333}{0{,}04} \approx 8{,}33$ рад/с².`] });

P('1-54', { topic: T3,
  fig: () => wheelFig(200, 150, 110, { dur: 4 }) + F.dot(310, 150, { c: C.task }) + F.arrow(310, 150, 310, 90, { c: C.good, label: 'aτ', lx: 16 }) + F.arrow(310, 150, 250, 150, { c: C.blue, label: 'aₙ', ly: -10 }) +
    F.text(400, 100, 'r = 10 см', { c: C.dim }) + F.text(400, 130, 'ε = 0,5 рад/с²', { c: C.dim }) + F.text(400, 160, 't = 2 с', { c: C.dim }),
  text: R`<p>Диск радиусом $r = 10$ см, находившийся в состоянии покоя, начал вращаться с постоянным угловым ускорением $\varepsilon = 0{,}5$ рад/с². Найдите тангенциальное $a_\tau$, нормальное $a_n$ и полное $a$ ускорения точек на окружности диска в конце второй секунды после начала вращения.</p>`,
  ans: [{ l: R`$a_\tau$`, v: 5, u: 'см/с²' }, { l: R`$a_n$`, v: 10, u: 'см/с²' }, { l: R`$a$`, v: 11.2, u: 'см/с²', tol: .025 }],
  hints: [R`$a_\tau = \varepsilon r$, $\omega = \varepsilon t$, $a_n = \omega^2r$. Ответ — в см/с².`],
  sol: [R`$a_\tau = \varepsilon r = 0{,}05$ м/с² $= 5$ см/с².`, R`$\omega = \varepsilon t = 1$ рад/с, $a_n = \omega^2r = 10$ см/с².`, R`$a = \sqrt{25 + 100} \approx 11{,}2$ см/с².`] });

P('1-55', { topic: T3,
  fig: () => wheelFig(200, 150, 110, { dur: 1.2 }) + F.text(400, 100, 'r = 20 см', { c: C.dim }) + F.text(400, 130, 'φ = A + Bt + Ct³', { c: C.chalk }) + F.text(400, 160, 't = 10 с', { c: C.dim }),
  text: R`<p>Диск радиусом $r = 20$ см вращается согласно уравнению $\varphi = A + Bt + Ct^3$, где $A = 3$ рад, $B = -1$ рад/с, $C = 0{,}1$ рад/с³. Определите тангенциальное $a_\tau$, нормальное $a_n$ и полное $a$ ускорения точек на окружности диска для момента времени $t = 10$ с.</p>`,
  ans: [{ l: R`$a_\tau$`, v: 1.2, u: 'м/с²' }, { l: R`$a_n$`, v: 168, u: 'м/с²' }, { l: R`$a$`, v: 168, u: 'м/с²' }],
  hints: [R`$\omega = B + 3Ct^2$, $\varepsilon = 6Ct$.`],
  sol: [R`$\omega = -1 + 0{,}3\cdot 100 = 29$ рад/с, $\varepsilon = 6$ рад/с².`, R`$a_\tau = \varepsilon r = 1{,}2$ м/с², $a_n = \omega^2r = 841\cdot 0{,}2 \approx 168$ м/с².`, R`$a = \sqrt{a_\tau^2 + a_n^2} \approx 168$ м/с² — почти целиком нормальное.`] });

P('1-56', { topic: T3,
  fig: () => wheelFig(200, 150, 110, { dur: 2 }) + F.text(400, 100, 'из покоя', { c: C.dim }) + F.text(400, 130, 'за Δt = 10 с', { c: C.dim }) + F.text(400, 160, 'до n = 300 мин⁻¹', { c: C.dim }),
  text: R`<p>Маховик начал вращаться равноускоренно и за промежуток времени $\Delta t = 10$ с достиг частоты вращения $n = 300$ мин⁻¹. Определите угловое ускорение $\varepsilon$ маховика и число $N$ оборотов, которое он сделал за это время.</p>`,
  ans: [{ l: R`$\varepsilon$`, v: 3.14, u: 'рад/с²' }, { l: R`$N$`, v: 25, u: '' }],
  hints: [R`Переведите частоту: 300 мин⁻¹ = 5 с⁻¹, $\omega = 2\pi n$.`, R`Средняя частота при равноускоренном разгоне — $n/2$.`],
  traps: [{ i: 0, v: 188.5, m: 'Частота дана в оборотах в минуту — переведите в с⁻¹.' }],
  sol: [R`$\varepsilon = \dfrac{2\pi n}{\Delta t} = \dfrac{2\pi\cdot 5}{10} \approx 3{,}14$ рад/с².`, R`$N = \dfrac n2\Delta t = 2{,}5\cdot 10 = 25$ оборотов.`] });

P('1-57', { topic: T3,
  fig: () => wheelFig(200, 150, 115, { dur: 1.5, spokes: 16 }) + F.text(400, 110, 'n = 5 с⁻¹', { c: C.dim }) + F.text(400, 140, 'остановилось за 1 мин', { c: C.dim }),
  text: R`<p>Велосипедное колесо вращается с частотой $n = 5$ с⁻¹. Под действием сил трения оно остановилось через интервал времени $\Delta t = 1$ мин. Определите угловое ускорение $\varepsilon$ и число $N$ оборотов, которое сделает колесо за это время.</p>`,
  ans: [{ l: R`$\varepsilon$`, v: -.524, u: 'рад/с²' }, { l: R`$N$`, v: 150, u: '' }],
  hints: [R`$\varepsilon = -\omega_0/\Delta t$, $N = \dfrac{n}{2}\Delta t$.`],
  sol: [R`$\varepsilon = -\dfrac{2\pi n}{\Delta t} = -\dfrac{31{,}4}{60} \approx -0{,}524$ рад/с².`, R`$N = \dfrac{n\Delta t}{2} = \dfrac{5\cdot 60}{2} = 150$.`] });

P('1-58', { topic: T3,
  fig: () => wheelFig(200, 150, 110, { dur: 1 }) + F.text(400, 100, 'N = 50 оборотов', { c: C.dim }) + F.text(400, 130, 'n: 4 → 6 с⁻¹', { c: C.dim }),
  text: R`<p>Колесо автомашины вращается равноускоренно. Сделав $N = 50$ полных оборотов, оно изменило частоту вращения от $n_1 = 4$ с⁻¹ до $n_2 = 6$ с⁻¹. Определите угловое ускорение $\varepsilon$ колеса.</p>`,
  ans: [{ l: R`$\varepsilon$`, v: 1.26, u: 'рад/с²' }],
  hints: [R`$\omega_2^2 - \omega_1^2 = 2\varepsilon\varphi$, $\varphi = 2\pi N$.`],
  sol: [R`$\varepsilon = \dfrac{\omega_2^2 - \omega_1^2}{2\varphi} = \dfrac{\pi(n_2^2 - n_1^2)}{N} = \dfrac{\pi\cdot 20}{50} \approx 1{,}26$ рад/с².`] });

P('1-59', { topic: T3,
  fig: () => wheelFig(200, 150, 110, { dur: 2 }) + F.text(400, 100, 'ε = −2 рад/с²', { c: C.dim }) + F.text(400, 130, 'n: 240 → 90 мин⁻¹', { c: C.dim }),
  text: R`<p>Диск вращается с угловым ускорением $\varepsilon = -2$ рад/с². Сколько оборотов $N$ сделает диск при изменении частоты вращения от $n_1 = 240$ мин⁻¹ до $n_2 = 90$ мин⁻¹? Найдите время $\Delta t$, в течение которого это произойдёт.</p>`,
  ans: [{ l: R`$N$`, v: 21.6, u: '' }, { l: R`$\Delta t$`, v: 7.85, u: 'с' }],
  hints: [R`$n_1 = 4$ с⁻¹, $n_2 = 1{,}5$ с⁻¹. $N = \dfrac{\pi(n_1^2 - n_2^2)}{|\varepsilon|}$.`],
  sol: [R`$N = \dfrac{\pi(16 - 2{,}25)}{2} \approx 21{,}6$.`, R`$\Delta t = \dfrac{2\pi(n_1 - n_2)}{|\varepsilon|} = \dfrac{2\pi\cdot 2{,}5}{2} \approx 7{,}85$ с.`] });

P('1-60', { topic: T3,
  fig: () => { let s = `<g><animateTransform attributeName="transform" type="rotate" from="0 200 150" to="360 200 150" dur="1s" repeatCount="indefinite"/>` +
      F.path('M200 150L200 40M200 150L200 260', { c: C.chalk, w: 9 }) + '</g>' + F.circle(200, 150, 14, { c: C.dim, fill: '#2b3d37' });
    return s + F.arrow(400, 260, 520, 260, { c: C.good, label: 'v = 54 км/ч (сани)', lx: -40, ly: -12 }) + F.text(400, 200, 'R = 1 м', { c: C.dim }) + F.text(400, 230, 'n = 360 мин⁻¹', { c: C.dim }) +
      F.path('M200 40C260 70 300 110 330 100', { c: C.task, w: 2, dash: '5 5' }) + F.text(340, 90, 'конец винта — винтовая линия', { c: C.task, size: 14 }); },
  text: R`<p>Винт аэросаней вращается с частотой $n = 360$ мин⁻¹. Скорость $v$ поступательного движения аэросаней равна 54 км/ч. С какой скоростью $u$ движется один из концов винта, если радиус $R$ винта равен 1 м?</p>`,
  ans: [{ l: R`$u$`, v: 40.6, u: 'м/с' }],
  hints: [R`Скорость конца винта — векторная сумма скорости вращения $2\pi nR$ и скорости саней $v$; они перпендикулярны.`],
  traps: [{ i: 0, v: 52.7, m: 'Векторы перпендикулярны — складывайте их по теореме Пифагора.' }],
  sol: [R`$n = 6$ с⁻¹, скорость вращения $2\pi nR \approx 37{,}7$ м/с; $v = 15$ м/с.`, R`$u = \sqrt{(2\pi nR)^2 + v^2} = \sqrt{1421 + 225} \approx 40{,}6$ м/с.`] });

P('1-61', { topic: T3,
  fig: () => `<rect x="80" y="110" width="400" height="80" rx="8" fill="#3a5047" stroke="${C.chalk}" stroke-width="2.5"/>` +
    F.path('M120 110L130 190M160 110L170 190M200 110L210 190M240 110L250 190', { c: C.dim, w: 1.5 }) +
    `<path d="M300 60L330 60L320 110L310 110Z" fill="${C.task}"><animateTransform attributeName="transform" type="translate" values="0 0;120 0;0 0" dur="6s" repeatCount="indefinite"/></path>` +
    F.text(280, 230, 'd = 60 мм', { c: C.dim, anchor: 'middle' }) + F.text(330, 40, 'резец, подача h = 0,5 мм за оборот', { c: C.task, size: 14 }) +
    F.text(280, 270, 'l = 12 см за Δt = 1 мин', { c: C.dim, anchor: 'middle' }),
  text: R`<p>На токарном станке протачивается вал диаметром $d = 60$ мм. Продольная подача $h$ резца равна 0,5 мм за один оборот. Какова скорость $v$ резания, если за интервал времени $\Delta t = 1$ мин протачивается участок вала длиной $l = 12$ см?</p>`,
  ans: [{ l: R`$v$`, v: .754, u: 'м/с' }],
  hints: [R`Число оборотов за минуту $N = l/h$, отсюда частота $n = N/\Delta t$. Скорость резания — скорость точки поверхности вала: $v = \pi dn$.`],
  sol: [R`$N = \dfrac{120\ \text{мм}}{0{,}5\ \text{мм}} = 240$ оборотов за 60 с, $n = 4$ с⁻¹.`, R`$v = \pi dn = \pi\cdot 0{,}06\cdot 4 \approx 0{,}754$ м/с.`] });
