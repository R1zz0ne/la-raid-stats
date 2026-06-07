# Выделение персонажей при закрытии всех рейдов

## Цель
Добавить визуальную индикацию для персонажей-получателей золота, когда все их рейды закрыты (isCompleted = true).

## ✅ Решение
- **Карточки (CharacterCard):** зелёная рамка поверх золотой, когда все рейды закрыты
- **Таблица (CharacterTable):** левый бордер становится зелёным вместо жёлтого, когда все рейды закрыты

## 📝 Изменённые файлы

### `src/components/molecules/CharacterCard.vue`
1. Добавлен computed `isAllCompleted` — проверяет, что все рейды персонажа закрыты
2. Добавлен CSS класс `character-card--all-completed` с зелёной рамкой
3. CSS правило применяется только для gold-recipient персонажей

### `src/components/organisms/CharacterTable.vue`
1. Добавлена функция `isCharacterAllCompleted()` — аналогичная проверка
2. Добавлен CSS класс `character-table__row--all-completed` к строкам gold-персонажей
3. CSS правило `border-left` переопределяется на зелёный для полностью закрытых

## 🎨 CSS правила

**CharacterCard:**
```css
.character-card--gold-recipient.character-card--all-completed {
  border-color: var(--color-success);
  box-shadow: 0 0 0 1px var(--color-success);
}
```

**CharacterTable:**
```css
.character-table__row--gold.character-table__row--all-completed {
  border-left: 3px solid var(--color-success);
}
```

## 🚀 Как протестировать
1. Создать персонажа-получателя золота
2. Добавить ему рейды
3. Закрыть все рейды (отметить галочками)
4. Убедиться, что карточка получила зелёную рамку, а в таблице — зелёный бордер слева
5. Снять одну галочку — рамка/бордер вернутся к золотому цвету

## ⚙️ Важные детали
- Выделение применяется **только** к персонажам со статусом "получатель золота"
- Существующие стили completed для RaidItem не изменялись (по запросу пользователя)
- Переходы анимации работают через существующий `transition: all var(--transition-fast)`