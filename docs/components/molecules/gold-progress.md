# GoldProgress

Компонент отображения прогресса сбора золота по всем получателям.

## Описание

Вычисляет общее полученное золото vs максимально возможное для всех персонажей с флагом `isGoldRecipient`.

## Источники данных

- **Characters Store**: Персонажи с `isGoldRecipient = true`
- **Raids Store**: Информация о рейдах (для расчёта maxPossible)

## Computed свойства

### goldStats

```ts
interface GoldStats {
  received: number      // Фактически полученное золото
  maxPossible: number   // Максимально возможное (включая незавершённые)
}
```

### progressPercent

Процент от 0 до 100, вычисляется как:
```
Math.round((received / maxPossible) * 100)
```

## Usage

```vue
<GoldProgress />
```

Компонент автоматически скрывается если `maxPossible === 0`.

## Display

- **Header**: Заголовок + статистика (получено / максимум)
- **Progress Bar**: 8px высота, gradient gold, rounded
- **Transitions**: width transition 300ms

## Styles

- **Container**: padding md, surface background, border, rounded
- **Bar**: Полная ширина, overflow hidden
- **Fill**: Gradient от primary gold к яркому (#fbbf24)
- **Stats**: Золотой цвет, tabular-nums для выравнивания цифр

## Интеграция с Stores

```ts
// charactersStore.getRaidsForCharacter(id) - рейды персонажа
// charactersStore.getGoldSummary(id) - сумма полученного золота
// raidsStore.getRaidById(id) - информация о рейде
```

## Accessibility

- Семантический контейнер `<div>`
- Визуальный прогресс не требует ARIA (это не `<progress>` в строгом смысле)
- Числовые значения читаются с tab order