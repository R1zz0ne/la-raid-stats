# CharacterList

Контейнерный компонент для отображения списка персонажей с поддержкой drag-and-drop.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `characters` | `Character[]` | **required** | Список персонажей |
| `editing` | `boolean` | **required** | Режим редактирования (включает drag) |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `editCharacter` | `id: string` | Запрос на редактирование |
| `deleteCharacter` | `id: string` | Запрос на удаление |
| `addCharacter` | — | Запрос на создание |
| `addRaid` | `characterId: string` | Открыть выбор рейда |
| `toggleRaid` | `raidId: string` | Переключить рейд |
| `removeRaid` | `raidId: string` | Удалить рейд |
| `toggleGoldRecipient` | `id: string` | Переключить флаг получателя |

## Sections

Компонент автоматически разделяет персонажей на секции:

1. **Получатели золота** (`isGoldRecipient = true`)
   - Badge с счётчиком `N/6`

2. **Остальные персонажи**
   - Все остальные

3. **Empty state**
   - Показывается когда список пуст
   - Кнопка "+ Добавить персонажа"

## Drag and Drop

Использует `useDragDrop` composable:
- Включается только при `editing = true`
- Перетаскивание персонажей между собой
- Индексы корректно считаются для обеих секций

## Usage

```vue
<CharacterList
  :characters="characters"
  :editing="isEditing"
  @edit-character="handleEdit"
  @delete-character="handleDelete"
  @add-character="showAddForm"
  @add-raid="openRaidModal"
/>
```

## Dependencies

- `CharacterCard` — карточка персонажа
- `BaseButton` — кнопка добавления
- `useDragDrop()` — drag-and-drop логика
- `useCharactersStore` — данные