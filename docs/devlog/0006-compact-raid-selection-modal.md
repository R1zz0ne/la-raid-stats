# Компактизация модального окна выбора рейдов

## 🎯 Проблема
Модальное окно выбора рейдов (`RaidAssignmentModal`) содержало громоздкие карточки с избыточными отступами и дублированием логики выбора в template-секции.

## ✅ Решение

### 1. Composable `useRaidSelection`
Создан новый composable `src/composables/useRaidSelection.ts` для управления состоянием выбора рейдов:
- Инкапсулирует логику toggle/select/clear
- Возвращает readonly state с явными action-методами
- Паттерн "readonly state + explicit actions" (best practice)

### 2. Компонент `RaidDifficultyChip`
Создан атомарный компонент `src/components/atoms/RaidDifficultyChip.vue`:
- Компактная кнопка-чипс с badge, ГС и золотом
- Hover: scale(0.97) + подсветка
- Active: scale(0.94)
- Focus-visible: outline + box-shadow для accessibility
- Keyboard: Tab + Enter/Space навигация
- Tooltip с детальной информацией при наведении

### 3. Рефакторинг `RaidAssignmentModal`
Рефакторинг модального окна:
- Вынесена логика выбора в composable
- Используется RaidDifficultyChip для отображения сложностей
- Упрощён template — логика в script

### 4. Визуальные изменения

| Параметр | Было | Стало |
|----------|------|-------|
| Padding карточки | 16px | 8px |
| Padding сложности | 8px 12px | 4px 8px |
| Gap между сложностями | 8px | 4px |
| Gap между карточками | 16px | 8px |
| Scroll max-height | 400px | 280px |
| Max-width модалки | 600px | 560px |
| Padding модалки | 24px | 16px |
| Gap внутри модалки | 24px | 16px |

## 📝 Изменённые файлы
1. `src/composables/useRaidSelection.ts` — **новый файл**, composable для управления выбором
2. `src/components/atoms/RaidDifficultyChip.vue` — **новый файл**, атомарный компонент чипса
3. `src/components/organisms/RaidAssignmentModal.vue` — рефакторинг + компактизация

## 🚀 Как протестировать
1. Открыть персонажа с кнопкой "+ Рейд"
2. Кликнуть на кнопку — открывается модальное окно
3. Выбрать сложности — убедиться в визуальном фидбеке (hover, active, selected)
4. Проверить keyboard navigation (Tab + Enter)
5. Навести на чипс — tooltip с детальной информацией
6. Подтвердить выбор — рейд добавляется к персонажу

## ⚙️ Важные детали
- DifficultyBadge используется внутри RaidDifficultyChip для консистентности
- composable использует `readonly()` для предотвращения мутации извне
- Все анимации через CSS transitions для производительности
- Атрибут `aria-pressed` для accessibility

## 🎉 Итог
Модальное окно стало компактнее, код чище, UX улучшен с hover/active/focus эффектами и keyboard navigation.