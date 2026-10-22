# Как выложить книги на GitHub Pages

Книги в `site/` — это обычные статические страницы (HTML, JS, CSS) без сборки и без внешних библиотек, поэтому GitHub Pages отдаёт их как есть. Ниже — публикация через GitHub Actions: она выкладывает только папку `site/`, а исходники (`books/`, `content/`, `tools/`) остаются в репозитории.

После публикации книги будут по адресам:

```
https://<логин>.github.io/<репозиторий>/            ← полка (её создаём на шаге 2)
https://<логин>.github.io/<репозиторий>/feynman1/
https://<логин>.github.io/<репозиторий>/feynman2/
https://<логин>.github.io/<репозиторий>/feynman4/
```

## 0. Что нужно

- Аккаунт на GitHub. На бесплатном тарифе Pages работает только для **публичного** репозитория; для приватного нужен платный план.
- `git` и `gh` (GitHub CLI) — на этой машине оба уже установлены. Один раз войдите в `gh`:

```bash
gh auth login
```

> **Права.** Сканы (`*.pdf`) и картинки страниц (`books/*/pages/`) уже исключены в `.gitignore` и в репозиторий не попадут. Но и сама книга — производная работа по переводу издательства «Мир». Для учебного использования в группе это обычно нормально, а широкая публичная раздача — на ваше усмотрение.

## 1. Проверьте `.gitignore`

В корне `D:\book` должно быть как минимум:

```
*.pdf
books/*/pages/
```

Локальные настройки Claude (в `launch.json` есть пути вашей машины) тоже лучше не публиковать — допишите строку:

```
.claude/
```

## 2. Полка — главная страница сайта

У `site/` пока нет своего `index.html`, поэтому адрес `https://<логин>.github.io/<репозиторий>/` откроется с ошибкой 404. Создайте файл `site/index.html`:

```html
<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Фейнмановские лекции</title>
<style>
  body { margin: 0; min-height: 100vh; background: #1d2b27; color: #ece8dc; font: 18px/1.5 "Segoe UI", Arial, sans-serif;
         display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 16px; }
  h1 { font: 500 40px Georgia, serif; margin: 0 0 12px; }
  a { display: block; width: min(420px, 100%); padding: 16px 20px; border-radius: 14px; background: #22322d;
      border: 1.5px solid #3a5047; color: inherit; text-decoration: none; }
  a:hover { border-color: #f0b45a; }
  small { color: #9aaba3; }
</style>
</head>
<body>
  <h1>Фейнмановские лекции</h1>
  <a href="feynman1/">Том 1 <small>· главы 1–14</small></a>
  <a href="feynman2/">Том 2 <small>· пространство, время, движение · главы 15–25</small></a>
  <a href="feynman4/">Том 4 <small>· кинетика, теплота, звук · главы 39–52</small></a>
</body>
</html>
```

Все ссылки в книгах относительные (`../lib/`, `ch40/`), так что они работают и на `localhost:8765`, и внутри `/<репозиторий>/` на GitHub.

## 3. Workflow публикации

Создайте файл `.github/workflows/pages.yml`:

```yaml
name: Publish books to GitHub Pages

on:
  push:
    branches: [main]
    paths: ['site/**', '.github/workflows/pages.yml']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: site
      - id: deployment
        uses: actions/deploy-pages@v4
```

Он запускается при каждом push в `main`, если изменилось что-то в `site/`. Вручную его можно запустить на вкладке **Actions** (кнопка *Run workflow*).

## 4. Создайте репозиторий и отправьте файлы

В терминале, в папке `D:\book`:

```bash
git init -b main
```

```bash
git add .
```

Перед коммитом убедитесь, что PDF и страницы сканов не попали в список:

```bash
git status --short
```

```bash
git commit -m "Feynman lectures: interactive books"
```

Создайте публичный репозиторий на GitHub и отправьте в него код (имя `feynman-books` замените на своё):

```bash
gh repo create feynman-books --public --source . --push
```

## 5. Включите Pages

1. Откройте репозиторий на GitHub → **Settings** → **Pages**.
2. В **Build and deployment → Source** выберите **GitHub Actions**.
3. Перейдите на вкладку **Actions** и дождитесь зелёной галочки у запуска «Publish books to GitHub Pages» (обычно меньше минуты). Если запуск упал до включения Pages, нажмите **Re-run jobs**.

Адрес сайта появится в **Settings → Pages** и в итогах запуска.

## 6. Как обновлять

Исправили главу, добавили том или озвучку — просто закоммитьте и отправьте изменения, сайт пересоберётся сам:

```bash
git add .
```

```bash
git commit -m "Обновил главу 40"
```

```bash
git push
```

## Полезно знать

- **Прогресс читателя** хранится в `localStorage` браузера отдельно для каждого адреса. Отметки, сделанные на `localhost:8765`, на GitHub не переносятся.
- **Новый том** — это новая папка `site/<slug>/` и ещё одна ссылка в `site/index.html`.
- **Озвучка.** Когда появятся MP3 (`site/<book>/chNN/audio/ru/*.mp3`), они опубликуются тем же workflow. Лимит GitHub — 100 МБ на файл и около 1 ГБ на сайт; озвучка трёх томов в него укладывается.
- **Своё доменное имя** настраивается в **Settings → Pages → Custom domain**.
- **Если страница 404** — проверьте, что в адресе есть косая черта в конце (`/feynman4/`) и что в **Settings → Pages** выбран источник **GitHub Actions**.
