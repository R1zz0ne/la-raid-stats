# RaidDifficultyChip

Компактный чип для отображения одной сложности рейда.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `difficulty` | `Difficulty` | **required** | Объект сложности рейда |
| `isSelected` | `boolean` | **required** | Состояние выбора |

### Difficulty

```ts
interface Difficulty {
  type: 'normal' | 'hard' | 'hell' | 'inferno'
  requiredGearScore: number
  regularGold: number
  limitedGold: number
}
```

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `select` | — | Клик по чипу |

## Usage

```vue
<RaidDifficultyChip
  :difficulty="{ type: 'hard', requiredGearScore: 1580, regularGold: 5000, limitedGold: 2000 }"
  :is-selected="true"
  @select="handleSelect"
/>
```

## Display

- **DifficultyBadge**: Цветовой индикатор типа сложности
- **Gear Score**: Требуемый ГС с форматированием (1 580)
- **Gold**: Формула `regularGold + limitedGold` (✨ для лимитированного)

## Tooltip

При наведении показывается детальная информация:
```
ГС: 1,580
Обычное золото: 5000
Лимитированное золото: 2000
```

## Styles

- **Compact**: Горизонтальный layout, small padding
- **States**: default, hover (scale 0.97), active (scale 0.94), selected
- **Selected**: Primary color background, box-shadow
- **Transitions**: transform, background-color, border-color

## Accessibility

- `type="button"` для семантики
- `aria-pressed="isSelected"` для состояния
- Keyboard: Tab + Enter/Space для активации
- `focus-visible` outline для keyboard navigation
- `title` атрибут для нативного tooltip