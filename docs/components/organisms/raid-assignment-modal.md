# RaidAssignmentModal

Модальное окно для назначения рейдов персонажу.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `character` | `Character \| null` | **required** | Персонаж для назначения |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `close` | — | Закрытие модального окна |

## Behavior

### Фильтрация рейдов

Рейды фильтруются по:
- Не назначены персонажу
- Доступны по Gear Score персонажа

### Сортировка сложностей

1. Золото по убыванию (больше → меньше)
2. Тип сложности по приоритету:
   - nightmare → heroic → normal → solo

### Выбор

- Один рейд может иметь только одну выбранную сложность
- При выборе другой сложности того же рейда — заменяется
- Badge "✓" показывает что рейд выбран

## Composables Used

- `useRaidSelection` — управление выбором
- `useModalCloseGuard` — защита от случайного закрытия
- `useCharactersStore` — данные персонажей
- `useRaidsStore` — данные рейдов

## Usage

```vue
<RaidAssignmentModal
  :character="selectedCharacter"
  @close="closeModal"
/>
```

## Accessibility

- `Teleport to="body"` для корректного z-index
- Блокировка body scroll при открытии
- Клик по overlay закрывает модал
- `aria-pressed` на кнопках чипов
- Keyboard navigation (Tab + Enter)

## Styles

- **Overlay**: Semi-transparent black, fixed position
- **Animation**: slideUp 300ms
- **Scroll**: max-height 400px с overflow
- **Actions**: Flex с counter слева