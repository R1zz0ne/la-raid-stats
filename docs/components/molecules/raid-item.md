# RaidItem

Компонент элемента списка рейдов с чекбоксом и информацией о награде.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `raid` | `Raid` | **required** | Данные рейда |
| `difficultyType` | `DifficultyType` | **required** | Тип сложности |
| `isCompleted` | `boolean` | `false` | Рейд пройден |
| `disabled` | `boolean` | `false` | Отключить взаимодействие |
| `disabledReason` | `string` | `''` | Причина недоступности |
| `editing` | `boolean` | `false` | Режим редактирования |

## Events

| Event | Description |
|-------|-------------|
| `toggle` | Переключить статус выполнения |
| `remove` | Удалить рейд из списка |

## Usage

```vue
<RaidItem
  :raid="raid"
  :difficulty-type="cr.difficultyType"
  :is-completed="cr.isCompleted"
  :editing="isEditing"
  @toggle="toggleRaid(cr.id)"
  @remove="removeRaid(cr.id)"
/>
```

## Visual States

- **Default**: Обычный вид
- **Completed**: Затемнённый фон, рейд пройден
- **Disabled**: Сниженная opacity

## Features

- Checkbox для отметки выполнения
- Отображение названия и сложности
- Отображение наград (обычное и лимитированное золото)
- Кнопка удаления в режиме редактирования