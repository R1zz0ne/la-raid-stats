# BaseCheckbox

Компонент флажка (checkbox) с кастомным дизайном.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Текстовая метка рядом с флажком |
| `disabled` | `boolean` | `false` | Отключает флажок |
| `id` | `string` | — | ID для связи label с input |

## v-model

Поддерживает `v-model` для двустороннего связывания значения:

```ts
const isChecked = defineModel<boolean>({ required: true })
```

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `boolean` | Изменение состояния |

## Usage

```vue
<BaseCheckbox v-model="agreeTerms" label="Согласен с условиями" />

<BaseCheckbox v-model="notifyEnabled" label="Включить уведомления" :disabled="isLoading" />
```

## Styles

- **Box**: 20x20px квадратная рамка с border
- **Check**: SVG галочка 12x12px внутри box
- **States**: default, hover, checked, disabled, focus-visible
- **Transitions**: плавные переходы для всех состояний

## Accessibility

- Скрытый input для доступности клавиатуры
- Label связан через `for`/`id`
- Поддержка фокуса через Tab
- `focus-visible` с outline для keyboard navigation
- Отключённое состояние визуально показано opacity + cursor