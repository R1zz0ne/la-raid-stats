# Архитектура: Lost Ark Raid Tracker

## 🎯 Проблема
После R&D-анализа требовалось спроектировать полную архитектуру frontend-приложения: структуру проекта, типы данных, stores, компоненты, composables, утилиты, роутинг и тестовый стек. После создания архитектуры — пересмотреть её с учётом vue-best-practices, vue-testing-best-practices и frontend-design скилов.

## ✅ Решение
- Создан `spec/03-architecture.md` с полной архитектурой системы
- После загрузки скилов — обновлён с учётом Vue Best Practices, Testing Best Practices

## 📝 Ключевые решения

**Стек:**
- Vue 3 (Composition API) + `<script setup lang="ts">` + TypeScript + Less + Pinia + Vue Router + Vite
- Тесты: Vitest + @vue/test-utils (Unit + Component) + Playwright (E2E), coverage 80%+

**Vue Best Practices (применены):**
- Реактивность: `shallowRef()` для примитивов, `reactive()` для state objects в stores
- Компоненты: Props down / Events up, `defineModel()` для v-model, `defineProps`/`defineEmits` с типами
- Composables: `readonly()` state + explicit actions
- Provide/Inject: Symbols для ключей
- SFC: `<script>` → `<template>` → `<style>`, scoped styles, class selectors
- Computed: чистые getters, вычисляемые данные — через computed

**Структура проекта:**
```
src/
├── assets/styles/      # _variables.less, _mixins.less, global.less
├── components/
│   ├── atoms/          # BaseButton, BaseInput, BaseSelect, BaseCheckbox, BaseTooltip
│   ├── molecules/      # CharacterCard, RaidItem, DifficultyBadge, GoldSummary
│   ├── organisms/      # CharacterList, CharacterForm, RaidForm, RaidCard, ExportImportPanel
│   └── templates/      # DashboardTemplate, RaidLibraryTemplate, SettingsTemplate
├── composables/        # useLocalStorage, useDragDrop, useTheme
├── router/             # Vue Router (3 routes)
├── stores/             # characters, raids, settings (Pinia)
├── types/              # TypeScript interfaces
├── utils/              # transliterate, validators
├── views/              # DashboardView, RaidLibraryView, SettingsView
├── App.vue, main.ts
```

**Типы данных:**
- `Character`: id (name), name, gearScore, characterClass, customClassName?, order
- `DifficultyType`: solo | normal | heroic | nightmare
- `Difficulty`: type, requiredGearScore, regularGold, limitedGold
- `Raid`: id (slug), name, difficulties[]
- `CharacterRaid`: id, characterId, raidId, difficultyType, isCompleted, createdAt

**ID стратегия:**
- Персонажи: id = name (уникальный, нельзя менять после создания)
- Рейды: id = транслитерация name (slug)

**CharacterClass (17 классов + custom):**
berserker, destroyer, warrior, holyknight, battlemaster, infighter, soulmaster, bard, sorceress, gunslinger, blaster, scout, assassin, shadow, demonic, summoner, archer, custom

**Темы:**
- CSS Variables в _variables.less
- [data-theme="dark"] переопределение переменных
- useTheme composable с provide/inject + Symbols

**Тестовый стек:**
- Unit: Vitest → stores (characters, raids, settings), utils (transliterate, validators)
- Component: Vue Test Utils → atoms (5), molecules (4)
- E2E: Playwright → 12 сценариев из R&D
- Coverage: 80%+ (lines, functions, branches)
- Testing: black-box подход, happy-dom для производительности

**План реализации (10 этапов):**
1. Каркас (Vite, Vue, TypeScript, Less, Pinia, Vue Router)
2. Infrastructure (useLocalStorage, useTheme, useSettingsStore, transliterate)
3. Stores (useRaidsStore, useCharactersStore, CRUD, cascade delete)
4. Базовые компоненты (atoms)
5. Формы (CharacterForm, RaidForm)
6. Views & Templates
7. Функциональность (drag-and-drop, toggle, gold summary)
8. Export/Import
9. Тестирование (Vitest, Vue Test Utils, Playwright, coverage)
10. Финализация

## 📝 Изменённые файлы
1. spec/03-architecture.md — Полная архитектура + Vue Best Practices + тестирование

## 🚀 Как протестировать
Проверить соответствие архитектуры требованиям из spec/01-prd.md и spec/02-rnd.md. Архитектура готова для начала реализации.

## ⚙️ Важные детали
- Cascade delete: при удалении персонажа удаляются CharacterRaid, при удалении рейда — тоже
- Валидация ГС: getAvailableRaidsForGearScore фильтрует недоступные рейды
- Difficulty disabled: requiredGearScore > gearScore → disabled + tooltip
- Export: версия в JSON, backup перед import
- Drag-and-drop: только в режиме редактирования (vuedraggable)
- Max 30 персонажей: проверка при добавлении
- Component API: все контракты прописаны с TypeScript типами

## 🎉 Итог
Архитектура пересмотрена с учётом Vue Best Practices, vue-testing-best-practices. spec/03-architecture.md готов к реализации.