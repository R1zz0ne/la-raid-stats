# BaseInput

Базовый компонент текстового поля ввода.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| number` | `''` | Значение input |
| `type` | `'text' \| 'number' \| 'password' \| ...` | `'text'` | HTML тип input |
| `placeholder` | `string` | `''` | Placeholder текст |
| `label` | `string` | `''` | Label над полем |
| `error` | `string` | `''` | Текст ошибки |
| `disabled` | `boolean` | `false` | Отключает поле |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string \| number` | Изменение значения |
| `blur` | `FocusEvent` | Потеря фокуса |
| `focus` | `FocusEvent` | Получение фокуса |

## Usage

```vue
<BaseInput
  v-model="name"
  type="text"
  label="Имя персонажа"
  placeholder="Введите имя"
  :error="nameError"
/>

<BaseInput
  v-model="gearScore"
  type="number"
  label="ГС"
  :min="0"
/>
```

## Validation

Компонент автоматически применяет стиль ошибки при наличии `error` prop.

## Accessibility

- Связывайте `label` с `input` через `for`/`id`
- Используйте `aria-describedby` для ошибок