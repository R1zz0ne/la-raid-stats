# BaseTooltip

Компонент всплывающей подсказки с анимацией.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `string` | **required** | Текст подсказки |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Позиция подсказки |
| `disabled` | `boolean` | `false` | Отключает подсказку |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Элемент, при наведении на который показывается подсказка |

## Usage

```vue
<BaseTooltip content="Сохранить изменения" position="top">
  <BaseButton variant="primary">💾</BaseButton>
</BaseTooltip>

<BaseTooltip content="Удалить безвозвратно" position="right">
  <BaseButton variant="danger">🗑️</BaseButton>
</BaseTooltip>
```

## Behavior

- **Show**: При `mouseenter` или `focusin`
- **Hide**: При `mouseleave` или `focusout`
- **Animation**: Fade + slide (4px) в направлении position

## Styles

- **Content**: Чёрный фон, белый текст, border-radius
- **Position**: Расстояние 8px от элемента
- **Z-index**: 1000 для отображения поверх других элементов
- **Pointer-events**: none (не мешает взаимодействию)

## Accessibility

- `role="tooltip"` для семантики
- Не требует keyboard navigation (показывается по hover/focus)
- `aria-describedby` рекомендуется добавить на элемент

## Animations

```css
.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity var(--transition-fast), transform var(--transition-fast);
}
```

- **top/bottom**: Slide вверх/вниз (translateY ±4px)
- **left/right**: Slide влево/вправо (translateX ±4px)