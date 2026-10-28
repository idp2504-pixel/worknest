NAV=[('index.html','Головна'),('vacancies.html','Вакансії'),('post.html','Роботодавцям'),('saved.html','Обране'),('contacts.html','Контакти')]
def head(title,active):
    nav=''.join(f'<li><a href="{h}" class="{"active" if h==active else ""}">{t}{"<span class=\"saved-count\" hidden>0</span>" if h=="saved.html" else ""}</a></li>' for h,t in NAV)
    return f'''<!DOCTYPE html>
<html lang="uk">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="WorkNest — сайт для пошуку роботи та розміщення вакансій">
<title>{title}</title>
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<header>
  <div class="header-top"><div class="container"><span>Вакансії по всій Україні — щодня нові</span><span>info@worknest.ua · +380 (44) 123-45-67</span></div></div>
  <div class="header-main"><div class="container">
    <a class="logo-link" href="index.html"><i></i><span>Work<b>Nest</b></span></a>
    <nav id="nav"><ul>{nav}</ul></nav>
    <div class="header-cta"><a class="btn" href="post.html">Розмістити вакансію</a><button class="burger" id="burger" aria-label="Меню">☰</button></div>
  </div></div>
</header>
'''
FOOT='''
<footer>
  <div class="container">
    <div class="footer-grid">
      <div><a class="logo-link" href="index.html" style="color:#fff"><i></i><span>Work<b style="color:#8da2ff">Nest</b></span></a><p style="margin-top:12px">Платформа, що поєднує кандидатів і роботодавців: шукайте роботу, відгукуйтесь і розміщуйте вакансії безкоштовно.</p></div>
      <div><h4>Кандидатам</h4><ul><li><a href="vacancies.html">Пошук вакансій</a></li><li><a href="saved.html">Обране</a></li><li><a href="index.html#faq">Запитання</a></li></ul></div>
      <div><h4>Роботодавцям</h4><ul><li><a href="post.html">Розмістити вакансію</a></li><li><a href="contacts.html">Співпраця</a></li></ul></div>
      <div><h4>Контакти</h4><ul><li>м. Біла Церква</li><li>info@worknest.ua</li><li>+380 (44) 123-45-67</li></ul></div>
    </div>
    <p class="copy">© 2026 WorkNest. Навчальний проєкт. Усі компанії та вакансії вигадані.</p>
  </div>
</footer>
<button class="to-top" id="toTop" aria-label="Нагору">↑</button>
<script src="js/data.js"></script>
<script src="js/script.js"></script>
</body>
</html>
'''
def page(name,title,active,body):
    open(name,'w',encoding='utf8').write(head(title,active)+body+FOOT)

page('index.html','WorkNest — пошук роботи та розміщення вакансій','index.html','''
<main>
<section class="hero" id="hero">
  <div class="container">
    <span class="section-label">Знайдіть роботу мрії</span>
    <h1>Робота, яка підходить <span>саме вам</span></h1>
    <p class="lead">Сотні актуальних вакансій від перевірених роботодавців. Шукайте, зберігайте та відгукуйтесь за кілька кліків.</p>
    <form class="search-box" id="heroForm">
      <input id="hQ" type="search" placeholder="Посада або компанія" aria-label="Пошук">
      <select id="hCat" aria-label="Категорія"></select>
      <button class="btn" type="submit">Знайти</button>
    </form>
    <div class="hero-tags">Популярне:
      <a href="vacancies.html?q=розробник">Розробник</a><a href="vacancies.html?q=менеджер">Менеджер</a><a href="vacancies.html?q=бухгалтер">Бухгалтер</a><a href="vacancies.html?cat=hor">Сервіс</a>
    </div>
  </div>
</section>

<section class="stats" id="statistics"><div class="container"><div class="stats-grid">
  <div class="stat"><b data-count="1240">0</b><span>активних вакансій</span></div>
  <div class="stat"><b data-count="380">0</b><span>компаній-партнерів</span></div>
  <div class="stat"><b data-count="9500">0</b><span>кандидатів на платформі</span></div>
  <div class="stat"><b data-count="2700">0</b><span>успішних працевлаштувань</span></div>
</div></div></section>

<section id="categories"><div class="container">
  <span class="section-label">Категорії</span><h2 class="section-title">Оберіть напрям діяльності</h2>
  <p class="section-sub">Вакансії згруповано за професійними напрямами, щоб ви швидко знайшли потрібне.</p>
  <div class="cat-grid" id="catGrid"></div>
</div></section>

<section id="featured" style="background:#fff"><div class="container">
  <span class="section-label">Свіжі пропозиції</span><h2 class="section-title">Нові вакансії</h2>
  <p class="section-sub">Найновіші вакансії, розміщені роботодавцями за останні дні.</p>
  <div class="grid" id="topGrid"></div>
  <p class="more-wrap"><a class="btn ghost" href="vacancies.html">Усі вакансії →</a></p>
</div></section>

<section id="how"><div class="container">
  <span class="section-label">Як це працює</span><h2 class="section-title">Три прості кроки</h2>
  <div class="tabs"><button class="tab active" data-tab="cand">Для кандидатів</button><button class="tab" data-tab="emp">Для роботодавців</button></div>
  <div class="steps" data-tab="cand">
    <div class="step"><h3>Знайдіть вакансію</h3><p>Скористайтеся пошуком і фільтрами за містом, зарплатою та типом зайнятості.</p></div>
    <div class="step"><h3>Збережіть обране</h3><p>Позначайте цікаві пропозиції сердечком, щоб повернутися до них пізніше.</p></div>
    <div class="step"><h3>Відгукніться</h3><p>Заповніть коротку форму — роботодавець отримає ваші контакти.</p></div>
  </div>
  <div class="steps" data-tab="emp" hidden>
    <div class="step"><h3>Опишіть вакансію</h3><p>Вкажіть посаду, зарплату, обов’язки та вимоги в простій формі.</p></div>
    <div class="step"><h3>Перегляньте попередньо</h3><p>Картка вакансії оновлюється відразу, поки ви вводите дані.</p></div>
    <div class="step"><h3>Опублікуйте</h3><p>Вакансія одразу з’являється в загальному списку для всіх кандидатів.</p></div>
  </div>
</div></section>

<section class="quote" id="quote"><div class="container">
  <blockquote>«Вибирайте роботу до душі — і вам не доведеться працювати жодного дня.»</blockquote>
  <cite>— Конфуцій</cite>
</div></section>

<section id="information"><div class="container">
  <span class="section-label">Ринок праці</span><h2 class="section-title">Середня зарплата за напрямами</h2>
  <p class="section-sub">Орієнтовні показники на основі вакансій, представлених на платформі.</p>
  <table class="info-table">
    <thead><tr><th>Напрям</th><th>Середня зарплата, грн</th><th>Найпопулярніша посада</th></tr></thead>
    <tbody>
      <tr><td>IT і розробка</td><td>40 000</td><td>Frontend-розробник</td></tr>
      <tr><td>Фінанси та облік</td><td>32 000</td><td>Бухгалтер</td></tr>
      <tr><td>Маркетинг</td><td>27 000</td><td>SMM-менеджер</td></tr>
      <tr><td>Продажі</td><td>28 000</td><td>Менеджер із продажу</td></tr>
      <tr><td>Сервіс і HoReCa</td><td>21 000</td><td>Бариста</td></tr>
    </tbody>
  </table>
</div></section>

<section id="faq" style="background:#fff"><div class="container" style="max-width:820px">
  <span class="section-label">FAQ</span><h2 class="section-title">Часті запитання</h2>
  <div class="faq-item"><button class="faq-q">Чи платний пошук роботи?</button><div class="faq-a">Ні, пошук вакансій і відгуки для кандидатів повністю безкоштовні.</div></div>
  <div class="faq-item"><button class="faq-q">Як розмістити вакансію?</button><div class="faq-a">Відкрийте сторінку «Роботодавцям», заповніть форму та натисніть «Опублікувати».</div></div>
  <div class="faq-item"><button class="faq-q">Де зберігаються мої збережені вакансії?</button><div class="faq-a">У пам’яті вашого браузера (localStorage), тому вони доступні без реєстрації.</div></div>
  <div class="faq-item"><button class="faq-q">Чи можна працювати віддалено?</button><div class="faq-a">Так, у фільтрах є опція «Віддалена робота» — вона показує лише такі вакансії.</div></div>
</div></section>

<section id="newsletter"><div class="container"><div class="newsletter">
  <h2>Отримуйте нові вакансії на пошту</h2><p>Підпишіться — і ми надсилатимемо добірку свіжих пропозицій.</p>
  <form id="subForm" novalidate><input id="sEmail" type="email" placeholder="Ваш email"><button class="btn accent" type="submit">Підписатися</button></form>
  <span class="err" id="sEmailErr"></span>
</div></div></section>
</main>
''')

page('vacancies.html','Вакансії — WorkNest','vacancies.html','''
<div class="page-head"><div class="container"><h1>Пошук вакансій</h1><p>Використовуйте пошук і фільтри, щоб знайти найкращу пропозицію.</p></div></div>
<main class="container layout">
  <aside class="form-card filters"><form id="filters">
    <div class="field"><label for="fQ">Посада або компанія</label><input id="fQ" type="search" placeholder="Наприклад, бухгалтер"></div>
    <div class="field"><label for="fCat">Категорія</label><select id="fCat"></select></div>
    <div class="field"><label for="fCity">Місто</label><select id="fCity"></select></div>
    <div class="field"><label for="fType">Зайнятість</label><select id="fType"></select></div>
    <div class="field"><label for="fSalary">Зарплата від, грн</label><input id="fSalary" type="number" min="0" step="1000" placeholder="0"></div>
    <div class="field"><label class="check"><input id="fRemote" type="checkbox"> Лише віддалена робота</label></div>
    <button class="btn ghost" type="button" id="reset" style="width:100%">Скинути фільтри</button>
  </form></aside>
  <div>
    <div class="results-bar"><strong id="count"></strong>
      <select id="fSort" aria-label="Сортування" style="padding:9px 12px;border-radius:10px;border:1.5px solid var(--line);font-family:inherit">
        <option value="new">Спочатку нові</option><option value="high">Зарплата: за спаданням</option><option value="low">Зарплата: за зростанням</option><option value="name">За назвою</option>
      </select></div>
    <div class="grid" id="grid"></div>
    <div class="more-wrap"><button class="btn ghost" id="more">Показати ще</button></div>
  </div>
</main>
''')

page('vacancy.html','Вакансія — WorkNest','vacancies.html','''
<main class="container detail-wrap"><div class="detail" id="detail"></div></main>
<div class="modal" id="applyModal"><div class="modal-box">
  <button class="close" data-close aria-label="Закрити">×</button>
  <h2 id="applyTitle">Відгук на вакансію</h2>
  <form id="applyForm" novalidate>
    <div class="field"><label for="aName">Ім’я та прізвище</label><input id="aName" type="text"><span class="err" id="aNameErr"></span></div>
    <div class="field"><label for="aEmail">Email</label><input id="aEmail" type="email"><span class="err" id="aEmailErr"></span></div>
    <div class="field"><label for="aPhone">Телефон</label><input id="aPhone" type="tel" placeholder="+380..."><span class="err" id="aPhoneErr"></span></div>
    <div class="field"><label for="aLetter">Супровідний лист (необов’язково)</label><textarea id="aLetter" rows="3"></textarea></div>
    <button class="btn" type="submit" style="width:100%">Надіслати відгук</button>
  </form>
</div></div>
''')

page('post.html','Розмістити вакансію — WorkNest','post.html','''
<div class="page-head"><div class="container"><h1>Розмістити вакансію</h1><p>Заповніть форму — вакансія з’явиться в загальному списку відразу після публікації.</p></div></div>
<main class="container post-grid">
  <form class="form-card" id="postForm" novalidate>
    <div class="row2">
      <div class="field"><label for="pTitle">Назва посади *</label><input id="pTitle" type="text"><span class="err" id="pTitleErr"></span></div>
      <div class="field"><label for="pCompany">Компанія *</label><input id="pCompany" type="text"><span class="err" id="pCompanyErr"></span></div>
    </div>
    <div class="row2">
      <div class="field"><label for="pCat">Категорія</label><select id="pCat"></select></div>
      <div class="field"><label for="pCity">Місто *</label><input id="pCity" type="text"><span class="err" id="pCityErr"></span></div>
    </div>
    <div class="row2">
      <div class="field"><label for="pType">Тип зайнятості</label><select id="pType"><option>Повна зайнятість</option><option>Часткова зайнятість</option><option>Стажування</option><option>Проєктна робота</option></select></div>
      <div class="field"><label for="pExp">Досвід</label><select id="pExp"><option>Без досвіду</option><option>Від 1 року</option><option>Від 2 років</option></select></div>
    </div>
    <div class="row2">
      <div class="field"><label for="pFrom">Зарплата від, грн</label><input id="pFrom" type="number" min="0"></div>
      <div class="field"><label for="pTo">Зарплата до, грн</label><input id="pTo" type="number" min="0"><span class="err" id="pToErr"></span></div>
    </div>
    <div class="field"><label class="check"><input id="pRemote" type="checkbox"> Можлива віддалена робота</label></div>
    <div class="field"><label for="pDesc">Опис вакансії *</label><textarea id="pDesc" rows="4"></textarea><span class="err" id="pDescErr"></span></div>
    <div class="row2">
      <div class="field"><label for="pTasks">Обов’язки (кожен з нового рядка)</label><textarea id="pTasks" rows="3"></textarea></div>
      <div class="field"><label for="pReqs">Вимоги (кожна з нового рядка)</label><textarea id="pReqs" rows="3"></textarea></div>
    </div>
    <div class="field"><label for="pEmail">Контактний email *</label><input id="pEmail" type="email"><span class="err" id="pEmailErr"></span></div>
    <button class="btn" type="submit">Опублікувати вакансію</button>
    <p class="success" id="postDone" hidden></p>
  </form>
  <aside class="sticky"><h3 style="margin-bottom:12px">Попередній перегляд</h3><div id="preview"></div>
    <p class="section-sub" style="margin-top:14px;font-size:14px">Так вашу вакансію побачать кандидати. Картка оновлюється під час введення.</p></aside>
</main>
''')

page('saved.html','Обране — WorkNest','saved.html','''
<div class="page-head"><div class="container"><h1>Обране та мої відгуки</h1><p>Тут зберігаються вакансії, які вас зацікавили, та надіслані відгуки.</p></div></div>
<main class="container" style="padding:34px 20px 70px">
  <h2 style="margin-bottom:16px">Збережені вакансії</h2>
  <div class="grid" id="savedList"></div>
  <h2 style="margin:44px 0 16px">Надіслані відгуки</h2>
  <table class="info-table"><thead><tr><th>Вакансія</th><th>Компанія</th><th>Дата</th><th></th></tr></thead><tbody id="appBody"></tbody></table>
</main>
''')

page('contacts.html','Контакти — WorkNest','contacts.html','''
<div class="page-head"><div class="container"><h1>Контакти</h1><p>Маєте запитання або пропозиції щодо співпраці? Напишіть нам.</p></div></div>
<main class="container contact-grid">
  <div class="form-card"><h2 style="margin-bottom:12px">Як з нами зв’язатися</h2>
    <ul class="contact-list"><li><b>Адреса</b>м. Біла Церква, вул. Соборна, 1</li><li><b>Телефон</b>+380 (44) 123-45-67</li><li><b>Email</b>info@worknest.ua</li><li><b>Графік роботи</b>Пн–Пт, 9:00–18:00</li></ul></div>
  <form class="form-card" id="contactForm" novalidate>
    <h2 style="margin-bottom:16px">Форма зворотного зв’язку</h2>
    <div class="field"><label for="cName">Ім’я</label><input id="cName" type="text"><span class="err" id="cNameErr"></span></div>
    <div class="field"><label for="cEmail">Email</label><input id="cEmail" type="email"><span class="err" id="cEmailErr"></span></div>
    <div class="field"><label for="cMsg">Повідомлення</label><textarea id="cMsg" rows="5"></textarea><span class="err" id="cMsgErr"></span></div>
    <button class="btn" type="submit">Надіслати</button>
    <p class="success" id="cStatus" style="background:none;padding:0"></p>
  </form>
</main>
''')
