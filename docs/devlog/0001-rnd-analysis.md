# R&D + Архитектура для Lost Ark Raid Tracker

## 🎯 Проблема
Перед началом разработки frontend-приложения для учёта рейдов Lost Ark требовалось:
1. Провести R&D-анализ требований
2. Спроектировать архитектуру
3. Определить тестовый стек

## ✅ Решение
- Проведён R&D-анализ → `spec/02-rnd.md`
- Спроектирована архитектура → `spec/03-architecture.md`
- Определён тестовый стек: Vitest (Unit + Component) + Playwright (E2E), coverage 80%+

## 📝 Ключевые решения

**Модель данных:**
- Character: id (name), gearScore, characterClass, order
- Raid: id (slug), name, difficulties[]
- Difficulty: type, requiredGearScore, regularGold, limitedGold
- CharacterRaid: characterId, raidId, difficultyType, isCompleted, createdAt

**ID стратегия:**
- Персонажи: id = name (уникальный)
- Рейды: id = транслитерация name (slug)

**Экраны:**
- DashboardView (главный)
- RaidLibraryView (управление рейдами)
- SettingsView (тема, экспорт/импорт)

**Pinia Stores:**
- useCharactersStore — персонажи + CharacterRaid
- useRaidsStore — библиотека рейдов
- useSettingsStore — тема

**Тесты:**
- Unit: Vitest (stores, utils), coverage 80%+
- Component: Vue Test Utils (atoms, molecules)
- E2E: Playwright (12 сценариев из R&D)

## 📝 Изменённые файлы
1. spec/02-rnd.md — R&D-документ
2. spec/03-architecture.md — Архитектура + тестирование

## 🚀 Как протестировать
Документы предназначены для использования разработчиками. Проверить соответствие spec/01-prd.md.

## ⚙️ Важные детали
- Сложность — enum: solo, normal, heroic, nightmare
- Золото — целые числа
- Лимит персонажей — 30
- ID перс. = name (нельзя менять после создания)
- ID рейдов = slug (транслитерация)
- Экспорт/импорт — JSON, полная замена
- Drag-and-drop — только в режиме редактирования
- Валидация ГС: рейд скрывается, сложность disabled с tooltip

## 🎉 Итог
R&D и архитектура завершены. spec/02-rnd.md и spec/03-architecture.md готовы к реализации.