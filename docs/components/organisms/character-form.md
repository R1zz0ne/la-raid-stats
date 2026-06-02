# CharacterForm

Форма создания/редактирования персонажа.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `character` | `Character` | — | Персонаж для редактирования (undefined = создание) |
| `existingNames` | `string[]` | — | Список имён для проверки дубликатов |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `submit` | `CharacterFormData` | Отправка формы |
| `cancel` | — | Отмена изменений |

## CharacterFormData

```ts
interface CharacterFormData {
  name: string
  gearScore: number
  characterClass: string
  customClassName?: string
}
```

## Behavior

- **Create mode**: Имя редактируемое, все поля пустые
- **Edit mode**: Имя заблокировано, поля заполнены данными
- **Validation**: Валидация при отправке, показ ошибок после touch
- **Class selection**: При выборе "custom" появляется поле для ввода

## Usage

```vue
<CharacterForm
  :existing-names="['Игрок1', 'Игрок2']"
  @submit="handleSubmit"
  @cancel="handleCancel"
/>

<CharacterForm
  :character="existingCharacter"
  @submit="handleUpdate"
  @cancel="handleCancel"
/>
```

## Dependencies

- `BaseInput` — поля ввода
- `BaseSelect` — выбор класса (с поиском)
- `BaseButton` — кнопки действия
- `validateCharacter()` — валидация
- `CHARACTER_CLASSES` — константы классов

## Accessibility

- Форма с `@submit.prevent`
- Привязанные label через id
- Error messages визуально связаны с полями