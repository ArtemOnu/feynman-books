// Interactive problem book: one section per page. A section page defines SECTION and calls P(id, problem) for each problem,
// then boot(). Problem fields: topic, text (HTML with $TeX$), fig (() => svg body | {w, h, body}), ans (fields), self (reference
// answer for problems checked by the student), hints [], sol [] (strings or {fig, w, h}), traps [{i, v, m}], note, example.
// Numeric field: {l, v, u, tol = 0.02 relative, abs}. Choice field: {l, choices: [...], c}.
'use strict';
const PROBLEMS = [];
const P = (id, o) => PROBLEMS.push({ id, ...o });
const $ = s => document.querySelector(s);
const KEY = () => 'chertov:progress:' + (typeof SECTION !== 'undefined' ? SECTION.id : '');
let STATE = {};
const load = () => { try { const s = JSON.parse(localStorage.getItem(KEY()) || '{}'); if (s && typeof s === 'object' && !Array.isArray(s)) STATE = s; } catch {} };
const save = () => { try { localStorage.setItem(KEY(), JSON.stringify(STATE)); } catch {} };
const st = id => (STATE[id] ||= { status: '', tries: 0 });

function tex(el) {
  if (window.renderMathInElement) renderMathInElement(el, { delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }], throwOnError: false });
}
const figSvg = f => { if (!f) return ''; const r = f(); return typeof r === 'string' ? F.svg(r) : F.svg(r.body, r.w, r.h); };
// Russian-style number: decimal comma.
const ru = v => String(+(+v).toPrecision(4)).replace('.', ',').replace('-', '−');
function parseNum(s) {
  s = String(s).trim().replace(/\s/g, '').replace(/[−–]/g, '-').replace(/,/g, '.').replace(/·10\^?/g, 'e').replace(/×10\^?/g, 'e');
  if (!s) return NaN;
  if (/^-?\d+(\.\d+)?\/\d+(\.\d+)?$/.test(s)) { const [a, b] = s.split('/'); return +a / +b; }
  return /^-?(\d+\.?\d*|\.\d+)(e-?\d+)?$/i.test(s) ? +s : NaN;
}
const close = (x, f) => Math.abs(x - f.v) <= Math.max((f.tol ?? .02) * Math.abs(f.v), f.abs ?? 1e-9);

let cur = 0, view = {};

function render(i) {
  cur = Math.max(0, Math.min(PROBLEMS.length - 1, i));
  const p = PROBLEMS[cur], s = st(p.id);
  if (location.hash !== '#' + p.id) history.replaceState(null, '', '#' + p.id);
  view = { hint: 0, choice: {} };
  const fields = (p.ans || []).map((f, k) => f.choices
    ? `<div class="field" data-k="${k}"><span class="lab">${f.l}</span><span class="opts">${f.choices.map((c, j) => `<button type="button" data-j="${j}">${c}</button>`).join('')}</span><span class="mark"></span></div>`
    : `<div class="field" data-k="${k}"><label class="lab" for="in${k}">${f.l} =</label><input id="in${k}" inputmode="decimal" autocomplete="off"><span class="unit">${f.u || ''}</span><span class="mark"></span></div>`).join('');
  const badge = { solved: 'решено', helped: 'решено с подсказкой', tried: 'есть ошибки' }[s.status] || (p.example ? 'пример с решением' : 'не решено');
  $('#task').innerHTML = `<div class="card">
    <div class="head"><span class="num">${p.example ? p.id : 'Задача ' + p.id}</span><span class="topic">${p.topic || ''}</span><span class="badge ${s.status}">${badge}</span></div>
    ${p.fig ? `<div class="fig">${figSvg(p.fig)}</div>` : ''}
    <div class="text">${p.text}</div>
    <div class="form">
      <h4>${p.ans ? 'Ваш ответ' : 'Решите задачу на бумаге и сравните с ответом'}</h4>
      ${fields}
      <div class="actions">
        ${p.ans ? '<button class="btn go" id="check">Проверить<kbd>Enter</kbd></button>' : '<button class="btn go" id="showself">Показать ответ</button>'}
        ${p.hints?.length ? '<button class="btn" id="hint">Подсказка<kbd>H</kbd></button>' : ''}
        <button class="btn" id="solve">Решение<kbd>S</kbd></button>
        ${p.ans ? '<button class="btn" id="reveal" hidden>Показать ответ</button>' : ''}
      </div>
      <div class="fb" id="fb"></div>
      <div class="hints" id="hints"><h4>Подсказки</h4><ol></ol></div>
      <div class="answer" id="answer"><h4>Ответ</h4>${answerHtml(p)}</div>
      <div class="sol" id="sol"><h4>Решение</h4><ol>${(p.sol || []).map(x => typeof x === 'string' ? `<li>${x}</li>` : `<div class="figs">${figSvg(x.fig)}</div>`).join('')}</ol></div>
    </div>
    <div class="pager"><button class="btn" id="prev">← ${cur ? PROBLEMS[cur - 1].id : ''}</button><button class="btn" id="next">${cur < PROBLEMS.length - 1 ? PROBLEMS[cur + 1].id : ''} →</button></div>
    <div class="keys">Ввод: десятичная запятая или точка, дробь 3/4, степень 1,2·10^3 или 1.2e3. ← / → — соседние задачи.</div>
  </div>`;
  $('#prev').disabled = !cur; $('#next').disabled = cur === PROBLEMS.length - 1;
  $('#prev').onclick = () => render(cur - 1); $('#next').onclick = () => render(cur + 1);
  $('#check') && ($('#check').onclick = check);
  $('#hint') && ($('#hint').onclick = nextHint);
  $('#solve').onclick = showSolution;
  $('#reveal') && ($('#reveal').onclick = () => { $('#answer').classList.add('show'); markHelped(); });
  $('#showself') && ($('#showself').onclick = showSelf);
  document.querySelectorAll('.opts').forEach(o => o.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const k = +o.closest('.field').dataset.k;
    o.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); view.choice[k] = +b.dataset.j;
  }));
  document.querySelectorAll('.field input').forEach(inp => inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); check(); } }));
  if (p.example) { $('#sol').classList.add('show'); }
  tex($('#task'));
  nav();
  const first = $('.field input'); if (first && matchMedia('(min-width: 861px)').matches) first.focus({ preventScroll: true });
  window.scrollTo({ top: 0 });
}

function answerHtml(p) {
  let h = (p.ans || []).map(f => `<div class="ansline">${f.l} = ${f.choices ? f.choices[f.c] : ru(f.v) + (f.u ? ' ' + f.u : '')}</div>`).join('');
  if (p.self) h += `<div>${p.self.html || ''}</div>${p.self.fig ? `<div class="figs sol">${figSvg(p.self.fig)}</div>` : ''}`;
  if (p.note) h += `<p class="note" style="color:var(--dim);font-size:15px">${p.note}</p>`;
  return h;
}

function check() {
  const p = PROBLEMS[cur], s = st(p.id);
  let ok = true, msgs = [];
  (p.ans || []).forEach((f, k) => {
    const el = document.querySelector(`.field[data-k="${k}"]`);
    let good;
    if (f.choices) good = view.choice[k] === f.c;
    else {
      const x = parseNum(el.querySelector('input').value);
      good = !isNaN(x) && close(x, f);
      if (!good && !isNaN(x)) {
        for (const t of p.traps || []) if (t.i === k && close(x, { v: t.v, tol: t.tol ?? .02 })) msgs.push(t.m);
        if (!msgs.length && !isNaN(x) && close(-x, f)) msgs.push('Почти: проверьте знак.');
        if (!msgs.length && [10, 100, 1000, 3.6, 60].some(m => close(x * m, f) || close(x / m, f))) msgs.push('Число похоже на правильное, но в других единицах — проверьте перевод единиц.');
      }
      if (isNaN(x)) msgs.push(`Не понимаю запись в поле «${f.l.replace(/\$/g, '')}».`);
    }
    el.classList.toggle('ok', good); el.classList.toggle('no', !good);
    el.querySelector('.mark').textContent = good ? '✓' : '✗';
    ok &&= good;
  });
  const fb = $('#fb');
  fb.className = 'fb show ' + (ok ? 'ok' : 'no');
  if (ok) {
    if (!s.status || s.status === 'tried') s.status = s.helped ? 'helped' : 'solved';
    fb.innerHTML = '<b>Верно!</b> ' + (p.sol?.length ? 'Сравните ход решения с разбором — кнопка «Решение».' : '');
  } else {
    s.tries++; if (!s.status) s.status = 'tried';
    const more = p.hints && view.hint < p.hints.length;
    fb.innerHTML = '<b>Пока неверно.</b> ' + (msgs.join(' ') || (more ? 'Вот подсказка ниже.' : 'Посмотрите решение.'));
    if (more) nextHint(true);
    if (s.tries >= 2 || !more) { $('#reveal') && ($('#reveal').hidden = false); $('#solve').classList.add('hot'); }
  }
  tex(fb); save(); nav(); badgeUpdate();
}

function nextHint(auto) {
  const p = PROBLEMS[cur];
  if (!p.hints || view.hint >= p.hints.length) return;
  const li = document.createElement('li'); li.innerHTML = p.hints[view.hint++];
  $('#hints ol').append(li); $('#hints').classList.add('show'); tex(li);
  if (auto !== true) { const s = st(p.id); s.helped = true; save(); }
  if (view.hint >= p.hints.length) $('#hint') && ($('#hint').disabled = true);
}
function markHelped() { const s = st(PROBLEMS[cur].id); s.helped = true; if (s.status !== 'solved') s.status = s.status || 'tried'; save(); nav(); }
function showSolution() {
  $('#sol').classList.add('show'); $('#answer').classList.add('show');
  const p = PROBLEMS[cur]; if (!p.example) markHelped();
  $('#sol').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function showSelf() {
  $('#answer').classList.add('show');
  const box = document.createElement('div'); box.className = 'self';
  box.innerHTML = '<button class="btn go" data-r="1">У меня так же</button><button class="btn" data-r="0">Не получилось</button>';
  $('#answer').append(box);
  box.onclick = e => { const b = e.target.closest('button'); if (!b) return; const s = st(PROBLEMS[cur].id);
    s.status = b.dataset.r === '1' ? (s.helped ? 'helped' : 'solved') : 'tried'; if (b.dataset.r === '0') showSolution(); box.remove(); save(); nav(); badgeUpdate(); };
  $('#showself').disabled = true;
}
function badgeUpdate() {
  const s = st(PROBLEMS[cur].id), b = $('.head .badge');
  b.className = 'badge ' + s.status; b.textContent = { solved: 'решено', helped: 'решено с подсказкой', tried: 'есть ошибки' }[s.status] || 'не решено';
}

function nav() {
  const groups = [];
  PROBLEMS.forEach((p, i) => { const g = p.example ? 'Примеры решения' : p.topic; if (!groups.length || groups.at(-1)[0] !== g) groups.push([g, []]); groups.at(-1)[1].push(i); });
  $('#list').innerHTML = groups.map(([g, ids]) => `<h3>${g}</h3><div class="grid">${ids.map(i => {
    const p = PROBLEMS[i], s = STATE[p.id]?.status || '';
    return `<a href="#${p.id}" class="${p.example ? 'ex ' : ''}${s}${i === cur ? ' cur' : ''}" data-i="${i}">${p.example ? p.id : p.id.split('-')[1]}</a>`;
  }).join('')}</div>`).join('') +
    '<div class="legend"><i style="border-color:var(--good);background:#24453a"></i>решено<br><i style="border-color:#c9b25a;background:#3b3a28"></i>с подсказкой или решением<br><i style="border-color:var(--bad)"></i>были ошибки</div>';
  $('#mob').innerHTML = PROBLEMS.map((p, i) => `<option value="${i}"${i === cur ? ' selected' : ''}>${p.example ? p.id : 'Задача ' + p.id} · ${p.topic || ''}</option>`).join('');
  const tasks = PROBLEMS.filter(p => !p.example), done = tasks.filter(p => ['solved', 'helped'].includes(STATE[p.id]?.status)).length;
  $('#progtxt').textContent = `${done} из ${tasks.length}`; $('#progbar').style.width = (100 * done / tasks.length) + '%';
}

function boot() {
  load();
  document.body.insertAdjacentHTML('afterbegin', `<header class="top"><a class="home" href="../">Задачник <i>Чертова</i></a><span class="sec">${SECTION.title}</span>
    <span class="prog"><span id="progtxt"></span><span class="bar"><b id="progbar"></b></span></span></header>
    <div class="wrap"><nav class="list" id="list"></nav><main class="task"><select class="mob" id="mob"></select><div id="task"></div></main></div>`);
  $('#list').addEventListener('click', e => { const a = e.target.closest('a[data-i]'); if (a) { e.preventDefault(); render(+a.dataset.i); } });
  $('#mob').onchange = e => render(+e.target.value);
  addEventListener('keydown', e => {
    if (e.target.closest('input, select, textarea') || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'ArrowLeft') render(cur - 1); else if (e.key === 'ArrowRight') render(cur + 1);
    else if (e.key === 'h' || e.key === 'р') nextHint(); else if (e.key === 's' || e.key === 'ы') showSolution();
  });
  addEventListener('hashchange', () => { const i = PROBLEMS.findIndex(p => '#' + p.id === decodeURIComponent(location.hash)); if (i >= 0 && i !== cur) render(i); });
  const i = PROBLEMS.findIndex(p => '#' + p.id === decodeURIComponent(location.hash));
  render(i >= 0 ? i : 0);
}
