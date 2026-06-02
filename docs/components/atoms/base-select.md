# BaseSelect

Базовый компонент выпадающего списка.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| number` | `''` | Выбранное значение |
| `options` | `SelectOption[]` | `[]` | Массив опций |
| `placeholder` | `string` | `''` | Placeholder |
| `label` | `string` | `''` | Label над полем |
| `error` | `string` | `''` | Текст ошибки |
| `searchable` | `boolean` | `false` | Поиск по опциям |
| `disabled` | `boolean` | `false` | Отключает поле |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string \| number` | Изменение значения |
| `change` | `Event` | Изменение (native) |

## Usage

```vue
<BaseSelect
  v-model="characterClass"
  :options="classOptions"
  label="Класс"
  searchable
/>
```

## Options Format

```typescript
interface SelectOption<T = string> {
  value: T
  label: string
}
```

## Searchable Mode

При `searchable: true` появляется поисковое поле для фильтрации опций.