# Стартовая сборка проекта

## Команды

Разовая сборка в режиме development
- `gulp dev`

Разовая сборка в режиме production (с оптимизацией картинок)
- `gulp prod`

Активная работа в режиме development (с запуском сервера)
- `gulp dev:watch`

Активная работа в режиме production (с оптимизацией картинок и запуском сервера)
- `gulp prod:watch`

#

## Обрабатываемые файлы

    Основные настройки путей и подключение дополнительных библиотек в файле "gulp/config.js"

1. Шаблоны в формате **.pug**, распределяются по папкам исходя из названия файла

   - `"src/templates/[file-name].pug"` > `"build/[file-name].html"`
   - `"src/templates/ajax/[file-name].pug"` > `"build/ajax/[file-name].html"`
   - `"src/templates/pages/[file-name].pug"` > `"build/[file-name]/index.html"`

2. Стили в формате **.scss** (src/styles)

3. Скрипты в формате **.js** (src/scripts)

4. Шрифты (src/static/fonts)

5. Иконки (src/static/icons)

6. Изображения (src/static/images)

7. SVG иконки (src/static/svg)

8. Видеоролики (src/static/videos)
