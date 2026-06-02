# Stores

Pinia stores для управления состоянием приложения.

---

## useCharactersStore

Store для управления персонажами и их рейдами.

### State

| Property | Type | Description |
|----------|------|-------------|
| `characters` | `Character[]` | Список персонажей |
| `characterRaids` | `CharacterRaid[]` | Назначения рейдов |

### Getters

| Getter | Returns | Description |
|--------|---------|-------------|
| `sortedCharacters` | `Character[]` | Персонажи отсортированные по order |
| `canAddCharacter` | `boolean` | Можно ли добавить ещё персонажа (лимит 30) |

### Methods

| Method | Params | Returns | Description |
|--------|--------|---------|-------------|
| `getCharacterById` | `id: string` | `Character \| undefined` | Найти персонажа по ID |
| `getRaidsForCharacter` | `characterId: string` | `CharacterRaid[]` | Рейды персонажа (новые первыми) |
| `getGoldSummary` | `characterId: string` | `GoldSummary` | Статистика золота |
| `goldRecipientCount` | — | `number` | Количество получателей золота |
| `addCharacter` | `data: CharacterFormData` | `Character \| null` | Добавить персонажа |
| `updateCharacter` | `id, data` | `void` | Обновить персонажа |
| `deleteCharacter` | `id: string` | `void` | Удалить (cascade удаляет рейды) |
| `toggleGoldRecipient` | `id: string` | `void` | Переключить флаг получателя |
| `addCharacterRaid` | `data` | `CharacterRaid` | Назначить рейд |
| `updateCharacterRaid` | `id, data` | `void` | Обновить назначение |
| `deleteCharacterRaid` | `id: string` | `void` | Удалить назначение |
| `toggleRaidCompleted` | `id: string` | `void` | Переключить статус "выполнен" |
| `resetAllRaidsCompleted` | — | `void` | Сбросить все рейды в невыполненные |
| `reorderCharacters` | `newOrder: Character[]` | `void` | Изменить порядок |
| `importData` | `data, allowedRaidIds?` | `void` | Импорт данных |
| `cascadeDeleteRaid` | `raidId: string` | `void` | Cascade удаление при удалении рейда |

### Storage

- Key: `la-raid-stats-characters`
- Key: `la-raid-stats-character-raids`

---

## useRaidsStore

Store для управления библиотекой рейдов.

### State

| Property | Type | Description |
|----------|------|-------------|
| `raids` | `Raid[]` | Список рейдов |

### Getters

| Getter | Returns | Description |
|--------|---------|-------------|
| `getAvailableRaidsForGearScore` | `(gs) => Raid[]` | Фильтр по Gear Score |

### Methods

| Method | Params | Returns | Description |
|--------|--------|---------|-------------|
| `getRaidById` | `id: string` | `Raid \| undefined` | Найти рейд по ID |
| `getMinGearScore` | `raid: Raid` | `number` | Минимальный ГС рейда |
| `addRaid` | `data` | `Raid` | Добавить рейд |
| `updateRaid` | `id, data` | `void` | Обновить рейд |
| `deleteRaid` | `id: string` | `void` | Удалить (cascade) |
| `importData` | `data` | `void` | Импорт рейдов |
| `resetToDefault` | — | `void` | Сброс к дефолтным |

### Storage

- Key: `la-raid-stats-default-raids` (через useDefaultRaidsConfig)

---

## useSettingsStore

Store для настроек приложения.

### State

| Property | Type | Description |
|----------|------|-------------|
| `theme` | `readonly Theme` | `'light' \| 'dark'` |

### Getters

| Getter | Returns | Description |
|--------|---------|-------------|
| `isDark` | `boolean` | Тёмная тема активна |

### Methods

| Method | Params | Returns | Description |
|--------|--------|---------|-------------|
| `setTheme` | `theme: Theme` | `void` | Установить тему |
| `toggleTheme` | — | `void` | Переключить тему |

### Side Effects

- При изменении темы: обновляет `document.documentElement.setAttribute('data-theme', ...)`
- Автоматически применяется к DOM

### Storage

- Key: `la-raid-stats-settings`