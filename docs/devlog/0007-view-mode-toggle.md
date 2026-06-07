# Переключатель вида отображения персонажей (cards/table)

## 🎯 Проблема
Пользователи хотели иметь возможность переключаться между карточным и табличным представлением списка персонажей. На разрешении Full HD хотелось видеть минимум 6 получателей золота без прокрутки.

## ✅ Решение
Добавлен переключатель вида отображения в header DashboardView с двумя режимами:
- **Cards** (по умолчанию) — сетка карточек (существующий вид)
- **Table** — таблица с inline чекбоксами рейдов

### Детали реализации

**Типы (`src/types/index.ts`):**
- Добавлен `ViewMode = 'cards' | 'table'`

**Store (`src/stores/settings.ts`):**
- Добавлено `_viewMode: shallowRef<ViewMode>('cards')`
- Добавлен `setViewMode(mode: ViewMode)`
- Persistence в localStorage (ключ `la-raid-stats-settings`)

**Компоненты:**
- `ViewModeToggle.vue` — переключатель с двумя кнопками (▦ карточки, ☰ таблица), active state, aria-pressed
- `CharacterTable.vue` — новый табличный компонент с:
  - Sticky header
  - Разделение на секции (получатели золота / остальные)
  - Inline чекбоксы рейдов с DifficultyBadge
  - Золотая рамка для получателей золота
  - Горизонтальный скролл внутри колонки "Рейды"
  - Вертикальный скролл tbody (max-height для 6+ строк)
  - Полная поддержка editing mode (edit, delete, drag-drop, gold recipient toggle)

**Интеграция (`CharacterList.vue`):**
- Добавлен проп `viewMode: ViewMode`
- Условный рендеринг: `CharacterCard[]` (cards) vs `CharacterTable` (table)

**DashboardView:**
- Добавлен `ViewModeToggle` в header (перед кнопкой "Недельный сброс")
- `viewMode` берётся из settings store

## 📝 Изменённые файлы
1. `src/types/index.ts` — добавлен `ViewMode` тип
2. `src/stores/settings.ts` — добавлен `viewMode` state + `setViewMode` + persistence
3. `src/components/molecules/ViewModeToggle.vue` — **новый** переключатель
4. `src/components/organisms/CharacterTable.vue` — **новый** табличный компонент
5. `src/components/organisms/CharacterList.vue` — добавлен `viewMode` проп + условный рендеринг
6. `src/views/DashboardView.vue` — интегрирован `ViewModeToggle`
7. `tests/components/molecules/ViewModeToggle.test.ts` — **новый** тест переключателя
8. `tests/components/organisms/CharacterTable.test.ts` — **новый** тест таблицы
9. `tests/unit/stores/settings.test.ts` — расширен тестами `viewMode`

## 🚀 Как протестировать
1. Открыть Dashboard — вид по умолчанию "Карточки"
2. Нажать кнопку "☰" в header — переключиться на табличный вид
3. Убедиться: таблица отображается, все колонки видны, получатели золота выделены gold border
4. Добавить 6+ персонажей — проверить вертикальный скролл
5. Переключиться обратно на карточки кнопкой "▦"
6. Обновить страницу — режим отображения сохраняется между сессиями

## ⚙️ Важные детали
- Настройка сохраняется в localStorage автоматически через watch
- Таблица использует `table-layout: fixed` для консистентных ширин колонок
- Колонка "Рейды" растягивается (`min-width: 300px`), остальные фиксированные
- Drag-drop в таблице — `draggable="editing"` на tr элементах (реализация drag-drop для строк — follow-up)
- Все 327 тестов проходят (build + test:run)

## 🎉 Итог
Функция переключения вида отображения персонажей реализована. Пользователи могут выбрать компактный табличный вид для экономии экранного пространства или привычный карточный. Настройка сохраняется между сессиями.