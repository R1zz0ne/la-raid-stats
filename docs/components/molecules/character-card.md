# CharacterCard

Компонент карточки персонажа с информацией о рейдах и золоте.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `character` | `Character` | **required** | Данные персонажа |
| `raids` | `CharacterRaid[]` | `[]` | Назначенные рейды |
| `goldSummary` | `GoldSummary` | `{ regular: 0, limited: 0, total: 0 }` | Сводка по золоту |
| `editing` | `boolean` | `false` | Режим редактирования |
| `draggable` | `boolean` | `false` | Разрешить drag-and-drop |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `edit` | `string` | Редактировать персонажа (id) |
| `delete` | `string` | Удалить персонажа (id) |
| `addRaid` | `string` | Добавить рейд (characterId) |
| `toggleRaid` | `string` | Переключить статус рейда (raidId) |
| `removeRaid` | `string` | Удалить рейд (raidId) |
| `toggleGoldRecipient` | `string` | Изменить статус получателя золота |
| `dragStart` | `[DragEvent, number]` | Начало перетаскивания |
| `dragOver` | `[DragEvent, number]` | Над элементом |
| `drop` | `[DragEvent, number]` | Бросок на элемент |

## Usage

```vue
<CharacterCard
  :character="character"
  :raids="characterRaids"
  :gold-summary="goldSummary"
  :editing="isEditing"
  @edit="handleEdit"
  @delete="handleDelete"
/>
```

## Features

- Отображение имени, класса, ГС персонажа
- Список назначенных рейдов с чекбоксами
- Gold recipient toggle (только в режиме редактирования)
- Drag-and-drop для сортировки