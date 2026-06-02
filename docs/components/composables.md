# Composables

Reusable composition functions for Vue 3.

---

## useModalManager

Управление модальными окнами DashboardView.

### Returns

| Property | Type | Description |
|----------|------|-------------|
| `showCharacterForm` | `Ref<boolean>` | Показать форму персонажа |
| `editingCharacter` | `Ref<Character \| undefined>` | Персонаж для редактирования |
| `showRaidModal` | `Ref<boolean>` | Показать модал назначения рейдов |
| `selectedCharacter` | `Ref<Character \| null>` | Выбранный персонаж |
| `isModalOpen` | `Ref<boolean>` | Любое модальное окно открыто |

### Actions

| Function | Params | Description |
|----------|--------|-------------|
| `openCharacterForm` | `(character?)` | Открыть форму (create/edit) |
| `closeCharacterForm` | — | Закрыть форму |
| `submitCharacterForm` | `data` | Submit + close + callback |
| `openRaidModal` | `character` | Открыть выбор рейда |
| `closeRaidModal` | — | Закрыть модал рейдов |

### Options

```ts
interface UseModalManagerOptions {
  onCharacterFormSubmit?: (data: CharacterFormData) => void
  onRaidModalClose?: () => void
}
```

### Side Effects

- Блокирует body scroll при открытии модалов
- Очищает body scroll при unmount

---

## useRaidSelection

Управление выбором рейдов в модальном окне назначения.

### Returns

| Property | Type | Description |
|----------|------|-------------|
| `selectedRaids` | `ComputedRef<Array>` | Выбранные рейды (readonly) |
| `selectedCount` | `ComputedRef<number>` | Количество выбранных |

### Actions

| Function | Params | Description |
|----------|--------|-------------|
| `isSelected` | `(raidId, difficultyType)` | Проверить выбор |
| `toggleSelection` | `(raidId, difficultyType)` | Переключить выбор |
| `clearSelection` | — | Очистить все |
| `getSelectedDifficulty` | `(raidId)` | Получить тип сложности |
| `getSelectionsForConfirm` | — | Получить для подтверждения |

### Behavior

- Один рейд = одна сложность
- Повторный клик deselects
- Новая сложность заменяет старую для того же рейда

---

## useModalCloseGuard

Защита от случайного закрытия модала.

### Returns

| Property | Type | Description |
|----------|------|-------------|
| `onOverlayClick` | `() => void` | Обработчик клика по overlay |

### Usage

```vue
<script setup>
import { useModalCloseGuard } from '@/composables/useModalCloseGuard'

const { onOverlayClick } = useModalCloseGuard(() => emit('close'))
</script>

<template>
  <div class="modal-overlay" @click="onOverlayClick">
    <div class="modal-content" @click.stop>
      ...
    </div>
  </div>
</template>
```

### Implementation

Использует CSS pointer-events:
- Overlay под content — клики проходят сквозь него
- Content блокирует pointer-events на overlay под ним
- Клик по видимой области overlay = intentional close

---

## useDefaultRaidsConfig

Управление конфигурацией рейдов по умолчанию.

### Returns

| Property | Type | Description |
|----------|------|-------------|
| `hasCustomConfig` | `readonly Ref<boolean>` | Есть кастомная конфигурация |
| `getInitialRaids` | `() => Raid[]` | Получить начальные рейды |
| `resetToDefault` | `() => Raid[]` | Сброс к дефолту |
| `updateConfig` | `(raids)` | Обновить конфиг |
| `getDefaultRaids` | `() => Raid[]` | Получить дефолтные |

### Storage

- Key: `la-raid-stats-raids-config`
- Structure: `{ version: 1, raids: Raid[] }`

### Behavior

1. При первом запуске: сохраняет дефолтные рейды в localStorage
2. При последующих: загружает из localStorage
3. При изменении: обновляет localStorage

---

## useTheme

Управление темой приложения.

### Returns

| Property | Type | Description |
|----------|------|-------------|
| `isDark` | `ComputedRef<boolean>` | Тёмная тема активна |
| `toggleTheme` | `() => void` | Переключить тему |
| `initTheme` | `() => void` | Применить тему при загрузке |

### Context (for provide/inject)

```ts
export const themeKey = Symbol('theme') as InjectionKey<ThemeContext>
```

### Side Effects

- Применяет `data-theme` атрибут на `<html>`

---

## useDragDrop

Drag-and-drop функциональность для списков.

### Params

```ts
function useDragDrop<T>(
  items: Ref<T[]>,
  options: {
    onUpdate: (items: T[]) => void
    enabled?: Ref<boolean>
  }
)
```

### Returns

| Property | Type | Description |
|----------|------|-------------|
| `listId` | `string` | Уникальный ID списка |
| `isDragging` | `Ref<boolean>` | Идёт перетаскивание |
| `handleDragStart` | `(event, index)` | Начать drag |
| `handleDragOver` | `(event, index)` | Hover над элементом |
| `handleDragEnd` | `()` | Завершить drag |
| `handleDrop` | `(event, toIndex)` | Бросить элемент |

### Behavior

- HTML5 native drag-and-drop API
- Обновляет `order` свойство у элементов при реордере
- Отключаемо через `enabled` ref

---

## useLocalStorage

Reactive синхронизация с localStorage.

### Params

```ts
function useLocalStorage<T>(key: string, defaultValue: T)
```

### Returns

| Property | Type | Description |
|----------|------|-------------|
| `value` | `Ref<T>` | Reactive value |
| `get` | `() => T` | Получить значение |
| `set` | `(val)` | Установить значение |
| `remove` | `()` | Удалить из localStorage |

### Behavior

- Deep watch для вложенных объектов
- JSON serialization/deserialization
- Fallback на defaultValue при отсутствии