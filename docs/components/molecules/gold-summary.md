# GoldSummary

Компонент отображения сводки по золоту.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `regular` | `number` | **required** | Обычное золото |
| `limited` | `number` | **required** | Лимитированное золото |

## Computed

- `total` = `regular` + `limited`

## Usage

```vue
<GoldSummary
  :regular="100"
  :limited="50"
/>
```

## Features

- Форматирование чисел с разделителями (100 000)
- Отображение обычного золота (💰)
- Отображение лимитированного золота (✨)
- Отображение итоговой суммы (🏆)