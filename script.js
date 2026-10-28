/* ===== Допоміжні функції ===== */
let io; // спостерігач для анімації появи блоків
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const store = {
  get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v === null ? d : v; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};

/* ===== «База даних» у браузері ===== */
let saved = store.get('saved', []);              // id збережених вакансій
let applications = store.get('applications', []); // надіслані відгуки
let myVacancies = store.get('myVacancies', []);   // вакансії, розміщені роботодавцем
const allVacancies = () => [...myVacancies, ...VACANCIES];
const findVacancy = id => allVacancies().find(v => String(v.id) === String(id));

const fmt = n => Number(n).toLocaleString('uk-UA');
function salaryText(v) {
  if (v.from && v.to) return `${fmt(v.from)} – ${fmt(v.to)} ${v.unit}`;
  if (v.from) return `від ${fmt(v.from)} ${v.unit}`;
  return 'за домовленістю';
}
function agoText(d) {
  if (d === 0) return 'сьогодні';
  if (d === 1) return 'вчора';
  return `${d} дн. тому`;
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function toast(text) {
  let t = $('#toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = text; t.classList.add('show');
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ===== Картка вакансії ===== */
function cardHTML(v) {
  const on = saved.includes(String(v.id));
  const logo = esc(v.company.replace(/[«»"]/g, '').trim().charAt(0).toUpperCase());
  return `<article class="vcard reveal">
    <div class="vcard-top">
      <div class="logo">${logo}</div>
      <div><h3><a href="vacancy.html?id=${v.id}">${esc(v.title)}</a></h3><p class="company">${esc(v.company)}</p></div>
      <button class="heart ${on ? 'on' : ''}" data-save="${v.id}" aria-label="Зберегти вакансію" title="Зберегти">♥</button>
    </div>
    <div class="salary">${salaryText(v)}</div>
    <ul class="tags">
      <li>${esc(v.city)}</li><li>${esc(v.type)}</li>${v.remote ? '<li class="remote">Віддалено</li>' : ''}<li>${esc(v.exp)}</li>
    </ul>
    <div class="vcard-bottom"><span>${CATEGORIES[v.cat] || 'Інше'}</span><span>${agoText(v.days)}</span></div>
  </article>`;
}
function renderList(list, el) {
  el.innerHTML = list.length ? list.map(cardHTML).join('') : '<p class="empty">За вашим запитом вакансій не знайдено. Спробуйте змінити фільтри.</p>';
  observeReveal();
}

/* ===== Збережені вакансії ===== */
function updateBadge() {
  $$('.saved-count').forEach(b => { b.textContent = saved.length; b.hidden = saved.length === 0; });
  store.set('saved', saved);
}
function toggleSave(id) {
  id = String(id);
  const i = saved.indexOf(id);
  if (i >= 0) { saved.splice(i, 1); toast('Вакансію видалено зі збережених'); }
  else { saved.push(id); toast('Вакансію збережено'); }
  updateBadge();
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-save]');
  if (!b) return;
  toggleSave(b.dataset.save);
  b.classList.toggle('on', saved.includes(String(b.dataset.save)));
  if ($('#savedList')) renderSaved();
});

/* ===== Головна: топ-вакансії, категорії, пошук ===== */
if ($('#topGrid')) {
  renderList([...allVacancies()].sort((a, b) => a.days - b.days).slice(0, 6), $('#topGrid'));
}
if ($('#catGrid')) {
  $('#catGrid').innerHTML = Object.entries(CATEGORIES).map(([k, name]) => {
    const n = allVacancies().filter(v => v.cat === k).length;
    return `<a class="cat reveal" href="vacancies.html?cat=${k}"><span class="cat-name">${name}</span><span class="cat-n">${n} вакансій</span></a>`;
  }).join('');
}
if ($('#heroForm')) {
  $('#hCat').innerHTML = '<option value="">Усі категорії</option>' + Object.entries(CATEGORIES).map(([k, n]) => `<option value="${k}">${n}</option>`).join('');
  $('#heroForm').addEventListener('submit', e => {
    e.preventDefault();
    const p = new URLSearchParams();
    if ($('#hQ').value.trim()) p.set('q', $('#hQ').value.trim());
    if ($('#hCat').value) p.set('cat', $('#hCat').value);
    location.href = 'vacancies.html' + (p.toString() ? '?' + p : '');
  });
}

/* ===== Каталог вакансій: пошук, фільтри, сортування ===== */
if ($('#grid')) {
  const params = new URLSearchParams(location.search);
  const cities = [...new Set(allVacancies().map(v => v.city))].sort();
  const types = [...new Set(allVacancies().map(v => v.type))];
  $('#fCat').innerHTML = '<option value="">Усі категорії</option>' + Object.entries(CATEGORIES).map(([k, n]) => `<option value="${k}">${n}</option>`).join('');
  $('#fCity').innerHTML = '<option value="">Усі міста</option>' + cities.map(c => `<option>${c}</option>`).join('');
  $('#fType').innerHTML = '<option value="">Будь-яка зайнятість</option>' + types.map(t => `<option>${t}</option>`).join('');
  $('#fQ').value = params.get('q') || '';
  $('#fCat').value = params.get('cat') || '';

  let shown = 9, current = [];
  const apply = () => {
    const q = $('#fQ').value.trim().toLowerCase();
    const min = Number($('#fSalary').value) || 0;
    current = allVacancies().filter(v =>
      (!q || (v.title + ' ' + v.company).toLowerCase().includes(q)) &&
      (!$('#fCat').value || v.cat === $('#fCat').value) &&
      (!$('#fCity').value || v.city === $('#fCity').value) &&
      (!$('#fType').value || v.type === $('#fType').value) &&
      (!$('#fRemote').checked || v.remote) &&
      (!min || (v.to || v.from) >= min));
    const s = $('#fSort').value;
    if (s === 'new') current.sort((a, b) => a.days - b.days);
    if (s === 'high') current.sort((a, b) => (b.to || 0) - (a.to || 0));
    if (s === 'low') current.sort((a, b) => (a.from || 0) - (b.from || 0));
    if (s === 'name') current.sort((a, b) => a.title.localeCompare(b.title, 'uk'));
    draw();
  };
  const draw = () => {
    renderList(current.slice(0, shown), $('#grid'));
    $('#count').textContent = `Знайдено вакансій: ${current.length}`;
    $('#more').hidden = current.length <= shown;
  };
  ['fQ', 'fCat', 'fCity', 'fType', 'fRemote', 'fSalary', 'fSort'].forEach(id => $('#' + id).addEventListener('input', () => { shown = 9; apply(); }));
  $('#more').addEventListener('click', () => { shown += 9; draw(); });
  $('#reset').addEventListener('click', () => { $('#filters').reset(); shown = 9; apply(); });
  $('#filters').addEventListener('submit', e => e.preventDefault());
  apply();
}

/* ===== Сторінка вакансії та відгук ===== */
if ($('#detail')) {
  const v = findVacancy(new URLSearchParams(location.search).get('id'));
  if (!v) { $('#detail').innerHTML = '<p class="empty">Вакансію не знайдено. <a href="vacancies.html">До списку вакансій</a></p>'; }
  else {
    document.title = v.title + ' — WorkNest';
    const li = a => a.map(x => `<li>${esc(x)}</li>`).join('');
    $('#detail').innerHTML = `
      <div class="detail-head">
        <div><p class="crumbs"><a href="vacancies.html">Вакансії</a> / ${CATEGORIES[v.cat] || 'Інше'}</p>
        <h1>${esc(v.title)}</h1><p class="company">${esc(v.company)} · ${esc(v.city)}</p></div>
        <div class="detail-actions"><div class="salary big">${salaryText(v)}</div>
        <button class="btn" id="apply">Відгукнутись</button>
        <button class="btn ghost" data-save="${v.id}">Зберегти</button></div>
      </div>
      <ul class="tags"><li>${esc(v.type)}</li>${v.remote ? '<li class="remote">Віддалено</li>' : ''}<li>${esc(v.exp)}</li><li>Опубліковано: ${agoText(v.days)}</li></ul>
      <h2>Про вакансію</h2><p>${esc(v.desc)}</p>
      <h2>Обов’язки</h2><ul class="list">${li(v.tasks)}</ul>
      <h2>Вимоги</h2><ul class="list">${li(v.reqs)}</ul>
      <h2>Ми пропонуємо</h2><ul class="list">${li(v.offer)}</ul>`;
    $('#apply').addEventListener('click', () => $('#applyModal').classList.add('open'));
    $('#applyTitle').textContent = `Відгук на вакансію «${v.title}»`;
    $('#applyForm').addEventListener('submit', e => {
      e.preventDefault();
      const ok = validate([
        ['aName', $('#aName').value.trim().length >= 2, 'Введіть ім’я (мінімум 2 символи)'],
        ['aEmail', /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test($('#aEmail').value), 'Введіть коректний email'],
        ['aPhone', /^[+\d\s()-]{10,}$/.test($('#aPhone').value), 'Введіть телефон (мінімум 10 цифр)']
      ]);
      if (!ok) return;
      applications.push({ vid: v.id, title: v.title, company: v.company, name: $('#aName').value.trim(), date: new Date().toLocaleDateString('uk-UA') });
      store.set('applications', applications);
      $('#applyModal').classList.remove('open'); $('#applyForm').reset();
      toast('Відгук надіслано. Роботодавець зв’яжеться з вами.');
    });
  }
}
$$('.modal').forEach(m => m.addEventListener('click', e => { if (e.target === m || e.target.dataset.close !== undefined) m.classList.remove('open'); }));
document.addEventListener('keydown', e => { if (e.key === 'Escape') $$('.modal.open').forEach(m => m.classList.remove('open')); });

/* ===== Перевірка форм ===== */
function validate(rules) {
  let ok = true;
  rules.forEach(([id, cond, msg]) => {
    const err = $('#' + id + 'Err');
    if (err) err.textContent = cond ? '' : msg;
    $('#' + id).classList.toggle('invalid', !cond);
    if (!cond) ok = false;
  });
  return ok;
}

/* ===== Розміщення вакансії ===== */
if ($('#postForm')) {
  $('#pCat').innerHTML = Object.entries(CATEGORIES).map(([k, n]) => `<option value="${k}">${n}</option>`).join('');
  const preview = () => {
    const v = readPost();
    $('#preview').innerHTML = cardHTML(v).replace('reveal', 'reveal visible');
  };
  const readPost = () => ({
    id: 'my' + Date.now(), title: $('#pTitle').value.trim() || 'Назва посади', company: $('#pCompany').value.trim() || 'Назва компанії',
    cat: $('#pCat').value, city: $('#pCity').value.trim() || 'Місто', type: $('#pType').value, remote: $('#pRemote').checked,
    from: Number($('#pFrom').value) || 0, to: Number($('#pTo').value) || 0, unit: 'грн/міс', exp: $('#pExp').value, days: 0,
    desc: $('#pDesc').value.trim() || 'Опис вакансії з’явиться тут.',
    tasks: $('#pTasks').value.split('\n').map(s => s.trim()).filter(Boolean),
    reqs: $('#pReqs').value.split('\n').map(s => s.trim()).filter(Boolean),
    offer: ['умови обговорюються під час співбесіди'], email: $('#pEmail').value.trim()
  });
  $$('#postForm input, #postForm select, #postForm textarea').forEach(el => el.addEventListener('input', preview));
  preview();
  $('#postForm').addEventListener('submit', e => {
    e.preventDefault();
    const from = Number($('#pFrom').value), to = Number($('#pTo').value);
    const ok = validate([
      ['pTitle', $('#pTitle').value.trim().length >= 3, 'Введіть назву посади (мінімум 3 символи)'],
      ['pCompany', $('#pCompany').value.trim().length >= 2, 'Введіть назву компанії'],
      ['pCity', $('#pCity').value.trim().length >= 2, 'Вкажіть місто'],
      ['pTo', !to || !from || to >= from, 'Максимум зарплати має бути не меншим за мінімум'],
      ['pDesc', $('#pDesc').value.trim().length >= 20, 'Опишіть вакансію (мінімум 20 символів)'],
      ['pEmail', /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test($('#pEmail').value), 'Введіть коректний email']
    ]);
    if (!ok) return;
    const v = readPost();
    myVacancies.unshift(v); store.set('myVacancies', myVacancies);
    $('#postForm').reset(); preview();
    $('#postDone').innerHTML = `Вакансію «${esc(v.title)}» опубліковано! <a href="vacancy.html?id=${v.id}">Переглянути</a>`;
    $('#postDone').hidden = false;
  });
}

/* ===== Збережене та мої відгуки ===== */
function renderSaved() {
  const list = saved.map(findVacancy).filter(Boolean);
  renderList(list, $('#savedList'));
  if (!list.length) $('#savedList').innerHTML = '<p class="empty">Ви ще не зберегли жодної вакансії. <a href="vacancies.html">Перейти до пошуку</a></p>';
}
if ($('#savedList')) {
  renderSaved();
  const rows = applications.map((a, i) => `<tr><td>${esc(a.title)}</td><td>${esc(a.company)}</td><td>${esc(a.date)}</td><td><button class="link-btn" data-del="${i}">Видалити</button></td></tr>`).join('');
  $('#appBody').innerHTML = rows || '<tr><td colspan="4">Відгуків поки немає</td></tr>';
  $('#appBody').addEventListener('click', e => {
    if (e.target.dataset.del === undefined) return;
    applications.splice(Number(e.target.dataset.del), 1); store.set('applications', applications); location.reload();
  });
}

/* ===== Контакти та розсилка ===== */
if ($('#contactForm')) $('#contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const ok = validate([
    ['cName', $('#cName').value.trim().length >= 2, 'Введіть ім’я (мінімум 2 символи)'],
    ['cEmail', /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test($('#cEmail').value), 'Введіть коректний email'],
    ['cMsg', $('#cMsg').value.trim().length >= 10, 'Повідомлення — мінімум 10 символів']
  ]);
  if (ok) { $('#cStatus').textContent = 'Дякуємо! Повідомлення надіслано.'; $('#contactForm').reset(); }
});
if ($('#subForm')) $('#subForm').addEventListener('submit', e => {
  e.preventDefault();
  const ok = validate([['sEmail', /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test($('#sEmail').value), 'Введіть коректний email']]);
  if (ok) { toast('Ви підписалися на нові вакансії'); $('#subForm').reset(); }
});

/* ===== Інтерфейс: бургер, FAQ, «нагору», анімації ===== */
if ($('#burger')) $('#burger').addEventListener('click', () => $('#nav').classList.toggle('open'));
$$('.faq-q').forEach(q => q.addEventListener('click', () => q.parentElement.classList.toggle('open')));
const up = $('#toTop');
if (up) {
  window.addEventListener('scroll', () => up.classList.toggle('show', scrollY > 500));
  up.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
}
function observeReveal() {
  if (!('IntersectionObserver' in window)) { $$('.reveal').forEach(el => el.classList.add('visible')); return; }
  io = io || new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); } }), { threshold: 0.1 });
  $$('.reveal:not(.visible)').forEach(el => io.observe(el));
}
$$('[data-count]').forEach(el => {
  const end = Number(el.dataset.count); let n = 0;
  const step = () => { n += Math.ceil(end / 60); if (n >= end) n = end; el.textContent = fmt(n); if (n < end) requestAnimationFrame(step); };
  new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { step(); o.disconnect(); } }).observe(el);
});
$$('.tab').forEach(t => t.addEventListener('click', () => {
  $$('.tab').forEach(x => x.classList.toggle('active', x === t));
  $$('.steps').forEach(s => s.hidden = s.dataset.tab !== t.dataset.tab);
}));
updateBadge();
observeReveal();
