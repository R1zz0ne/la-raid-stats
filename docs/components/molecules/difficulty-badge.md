# DifficultyBadge

Компонент бейджа уровня сложности рейда.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `type` | `DifficultyType` | ✅ | Тип сложности |

## DifficultyType Values

| Value | Label | Color | Description |
|-------|-------|-------|-------------|
| `solo` | Соло | Серый | Одиночное прохождение |
| `normal` | Обычный | Синий | Стандартная сложность |
| `heroic` | Героический | Фиолетовый | Повышенная сложность |
| `nightmare` | Кошмар | Красный | Максимальная сложность |

## Usage

```vue
<DifficultyBadge type="heroic" />
```

## Colors

Цвета определены в `src/constants/difficultyTypes.ts`:
- Соло: `#6b7280` (серый)
- Обычный: `#3b82f6` (синий)
- Героический: `#a855f7` (фиолетовый)
- Кошмар: `#ef4444` (красный)