# ImportOptionsModal

Модальное окно выбора области импорта.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `characterCount` | `number` | **required** | Количество персонажей в файле |
| `raidCount` | `number` | **required** | Количество рейдов в файле |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `close` | — | Закрытие модального окна |
| `confirm` | `scope: ImportScope` | Подтверждение выбора |

## ImportScope

```ts
type ImportScope = 'all' | 'characters' | 'raids'
```

### Options

| Value | Label | Description |
|-------|-------|-------------|
| `all` | Все данные | Импортировать всех персонажей и рейды |
| `raids` | Только рейды | Импортировать только рейды |
| `characters` | Только персонажей | Импортировать только персонажей |

## Usage

```vue
<ImportOptionsModal
  :character-count="10"
  :raid-count="5"
  @close="closeModal"
  @confirm="executeImport"
/>
```

## Composables

- `useModalCloseGuard` — защита от случайного закрытия
- `BaseRadioGroup` — выбор опций
- `BaseButton` — кнопки действий

## Behavior

- Default selection: `all`
- Labels динамически показывают количество
- Закрытие по overlay или кнопке "Отмена"

## Accessibility

- `Teleport to="body"`
- Keyboard navigation
- Focus trap рекомендуется (не реализован)