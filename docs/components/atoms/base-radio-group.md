# BaseRadioGroup

Компонент группы радио-кнопок с поддержкой описаний для каждой опции.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `(SelectOption<string> & { description?: string })[]` | **required** | Массив опций |
| `disabled` | `boolean` | `false` | Отключает всю группу |

### SelectOption

```ts
interface SelectOption<T> {
  value: T
  label: string
}
```

## v-model

Поддерживает `v-model` для двустороннего связывания:

```ts
const selectedValue = defineModel<string>({ required: true })
```

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Изменение выбранной опции |

## Usage

```vue
<BaseRadioGroup
  v-model="selectedDifficulty"
  :options="[
    { value: 'normal', label: 'Обычный', description: 'Для начинающих' },
    { value: 'hard', label: 'Сложный', description: 'Для опытных игроков' },
    { value: 'hell', label: 'Ад', description: 'Только для профессионалов' }
  ]"
/>
```

## Styles

- **Option**: Карточка с padding, border, border-radius
- **Radio**: Круглый индикатор 18x18px
- **Selected**: Подсвечивается border-color + background
- **States**: default, hover, selected, disabled

## Accessibility

- `role="radiogroup"` для семантики
- Keyboard navigation через Tab
- `aria-pressed` не используется (скрытый input)
- `focus-visible` outline для keyboard-only пользователей