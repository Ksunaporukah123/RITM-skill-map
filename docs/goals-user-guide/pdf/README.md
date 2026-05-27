# PDF-руководства: Целеполагание

Комплект сгенерированных руководств пользователя по ролям и разделам.

## Сборка

```bash
npm install md-to-pdf --save-dev
node scripts/build-goals-pdf.mjs
```

Или без установки:

```bash
npx --yes md-to-pdf docs/goals-user-guide/sections/00-obshchee-vvedenie.md
```

## Список файлов

| PDF | Аудитория |
|-----|-----------|
| `00-obshchee-vvedenie.pdf` | Все пользователи |
| `01-rukovoditel-karty-rezultativnosti.pdf` | Руководитель |
| `02-koordinator.pdf` | Координатор |
| `03-metodolog-domrr-drp.pdf` | Методолог ДОМРР / ДРП |
| `04-tablica-pfk-obshchee.pdf` | Работа с таблицей ПФК |
| `05-analitik-plan.pdf` | Аналитик ПЛАН |
| `06-rukovoditel-gc.pdf` | Руководитель ГЦ |
| `07-analitik-fakt.pdf` | Аналитик ФАКТ |
| `08-verifikator.pdf` | Верификатор |
| `09-delegirovanie.pdf` | Делегирование |
| `10-reestr-kpe.pdf` | Реестр КПЭ |

Исходники Markdown: `../sections/`.
