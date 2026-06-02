# RaidForm

Форма создания/редактирования рейда с несколькими уровнями сложности.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `raid` | `Raid` | — | Рейд для редактирования (undefined = создание) |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `submit` | `{ name: string; difficulties: DifficultyFormData[] }` | Отправка формы |
| `cancel` | — | Отмена изменений |

## DifficultyFormData

```ts
interface DifficultyFormData {
  type: DifficultyType
  requiredGearScore: number
  regularGold: number
  limitedGold: number
}
```

## DifficultyType

```ts
type DifficultyType = 'normal' | 'hard' | 'hell' | 'inferno'
  | 'nightmare' | 'heroic' | 'solo'
```

## Behavior

- **Dynamic difficulties**: Можно добавлять/удалять сложности
- **Auto-exclusion**: Уже добавленные типы недоступны для повторного добавления
- **Grid layout**: Поля сложности в 3 колонки (responsive до 1 колонки)
- **Scroll**: Список сложностей с max-height и scroll

## Usage

```vue
<RaidForm @submit="handleSubmit" @cancel="handleCancel" />

<RaidForm :raid="existingRaid" @submit="handleUpdate" @cancel="handleCancel" />
```

## Dependencies

- `BaseInput` — поля ввода (название, ГС, золото)
- `BaseSelect` — выбор типа сложности
- `BaseButton` — кнопки (добавить, удалить, отмена, сохранить)
- `validateRaid()` — валидация
- `DIFFICULTY_TYPES` — константы типов