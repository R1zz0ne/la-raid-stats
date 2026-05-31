# План реализации: Lost Ark Raid Tracker

## 🎯 Проблема
После R&D-анализа и проектирования архитектуры требовался детальный план реализации — пошаговый checklist с задачами, файлами, зависимостями и критериями приёмки.

## ✅ Решение
Создан `spec/04-implementation-plan.md` с 11 этапами реализации.

## 📝 Этапы реализации

**Этап 1: Каркас проекта**
- Инициализация Vite + Vue 3 + TypeScript + Less
- Подключение Pinia + Vue Router
- Структура папок

**Этап 2: Типы данных**
- TypeScript interfaces (Character, Raid, Difficulty, CharacterRaid, AppSettings)

**Этап 3: Утилиты и константы**
- `utils/transliterate.ts` — транслитерация для ID рейдов
- `utils/validators.ts` — валидация форм
- `constants/characterClasses.ts` — 18 классов + custom
- `constants/difficultyTypes.ts` — 4 типа сложности с порядком

**Этап 4: Composables**
- `useLocalStorage.ts` — readonly state + explicit actions
- `useTheme.ts` — применение темы на <html>, provide/inject
- `useDragDrop.ts` — vuedraggable integration

**Этап 5: Pinia Stores**
- `useCharactersStore` — CRUD + cascade delete + gold summary
- `useRaidsStore` — CRUD + getAvailableRaidsForGearScore
- `useSettingsStore` — theme management

**Этап 6: Базовые компоненты (atoms)**
- BaseButton, BaseInput (defineModel), BaseSelect (defineModel), BaseCheckbox (defineModel), BaseTooltip

**Этап 7: Молекулы (molecules)**
- DifficultyBadge, GoldSummary, RaidItem, CharacterCard

**Этап 8: Организмы (organisms)**
- CharacterList (drag-and-drop), CharacterForm, RaidForm, RaidCard, ExportImportPanel

**Этап 9: Views и Templates**
- DashboardView, RaidLibraryView, SettingsView
- AppHeader, ThemeToggle
- Templates для каждого view

**Этап 10: Тестирование**
- Vitest + @vue/test-utils (Unit + Component)
- Playwright (E2E, 12 сценариев)
- Coverage ≥ 80%

**Этап 11: Финализация**
- Проверка требований
- Responsive layout
- Финальное тестирование

## 📝 Изменённые файлы
1. spec/04-implementation-plan.md — План реализации (11 этапов)

## 🚀 Как протестировать
Следовать этапам по порядку. Каждый этап имеет чеклист готовности и критерии приёмки. Все зависимости между этапами задокументированы.

## ⚙️ Важные детали
- Vue Best Practices: `readonly()` state, `defineModel()`, Symbols для provide/inject
- Testing: black-box подход, happy-dom
- Cascade delete: при удалении персонажа/рейда удаляются связанные CharacterRaid
- ID стратегия: персонажи = name, рейды = slug (транслитерация)

## 🎉 Итог
План реализации готов. spec/04-implementation-plan.md содержит все этапы с задачами, файлами, зависимостями и критериями приёмки. Можно начинать реализацию.