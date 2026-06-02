# ExportImportPanel

Панель для экспорта и импорта данных приложения.

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `export` | — | Успешный экспорт |
| `import` | — | Успешный импорт |

## Export

1. Собирает все данные в `ExportData`
2. Создаёт Blob с JSON
3. Скачивает файл `lost-ark-raids-YYYY-MM-DD.json`

### ExportData

```ts
interface ExportData {
  version: 1
  exportedAt: string  // ISO date
  characters: Character[]
  characterRaids: CharacterRaid[]
  raids: Raid[]
  settings: { theme: 'light' | 'dark' }
}
```

## Import

1. Открывает file picker (.json)
2. Валидирует JSON структуру
3. Показывает `ImportOptionsModal` для выбора scope

### ImportScope

```ts
type ImportScope = 'all' | 'characters' | 'raids'
```

### Backup

При импорте автоматически создаётся backup в `localStorage`:
- Key: `la-raid-stats-backup`
- Содержит текущее состояние

## Error Handling

- `importError` отображается под формой
- Ошибки валидации JSON
- Ошибки импорта данных

## Usage

```vue
<ExportImportPanel
  @export="handleExport"
  @import="handleImport"
/>
```

## Dependencies

- `BaseButton` — кнопки действий
- `ImportOptionsModal` — модал выбора scope
- `validateImportData()` — валидация
- Stores: characters, raids, settings