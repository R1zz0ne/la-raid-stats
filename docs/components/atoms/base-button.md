# BaseButton

Базовый компонент кнопки с поддержкой вариантов и состояний.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'danger'` | `'primary'` | Визуальный стиль кнопки |
| `disabled` | `boolean` | `false` | Отключает кнопку |
| `loading` | `boolean` | `false` | Показывает индикатор загрузки |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML тип кнопки |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | `MouseEvent` | Клик по кнопке |

## Usage

```vue
<BaseButton variant="primary" @click="handleClick">
  Нажми меня
</BaseButton>

<BaseButton variant="danger" :loading="isLoading" :disabled="isDisabled">
  Удалить
</BaseButton>
```

## Styles

- **primary**: Синяя кнопка с белым текстом
- **secondary**: Прозрачная кнопка с границей
- **danger**: Красная кнопка для опасных действий

## Accessibility

- Используйте `aria-label` для кнопок без текста
- Кнопка автоматически получает `disabled` атрибут