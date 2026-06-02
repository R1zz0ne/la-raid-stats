# RaidCard

Карточка рейда для отображения в библиотеке рейдов.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `raid` | `Raid` | **required** | Объект рейда |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `edit` | `id: string` | Запрос на редактирование |
| `delete` | `id: string` | Запрос на удаление |

## Usage

```vue
<RaidCard
  :raid="raid"
  @edit="handleEdit"
  @delete="handleDelete"
/>
```

## Display Structure

1. **Header**: Название + кнопки действий
2. **Badges**: DifficultyBadge для каждого типа сложности
3. **Details**: Таблица с деталями каждой сложности
   - ГС (Gear Score)
   - Обычное золото (💰)
   - Лимитированное золото (✨)

## Styles

- **Container**: Surface background, border, rounded-lg
- **Badges**: Flex wrap с gap
- **Details**: Flex column с gap
- **Gold text**: Цвет warning для золота
- **GS text**: Цвет primary для gear score