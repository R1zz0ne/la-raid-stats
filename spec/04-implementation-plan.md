# План реализации: Lost Ark Raid Tracker

## Обзор

Данный план описывает пошаговую реализацию приложения на основе архитектуры `spec/03-architecture.md`. Каждый этап самодостаточен и может быть протестирован отдельно.

---

## Этап 1: Каркас проекта

### Задачи
- [ ] Инициализация Vite + Vue 3 + TypeScript
- [ ] Подключение Less
- [ ] Настройка структуры папок согласно архитектуре
- [ ] Подключение Pinia + Vue Router
- [ ] Настройка алиасов путей (`@/` → `src/`)

### Файлы
```
src/
├── main.ts                    # Создать
├── App.vue                    # Создать
├── router/index.ts            # Создать
├── types/index.ts             # Создать
├── assets/styles/
│   ├── _variables.less        # Создать
│   ├── _mixins.less           # Создать
│   └── global.less            # Создать
```

### Чеклист готовности
- [ ] `npm run dev` запускает приложение
- [ ] Типы TypeScript компилируются без ошибок
- [ ] Vue Router работает с 3 маршрутами
- [ ] Less стили применяются

### Критерии приёмки
- Приложение открывается на `http://localhost:5173`
- Навигация между `/`, `/raids`, `/settings` работает
- Тема light применяется по умолчанию

---

## Этап 2: Типы данных

### Задачи
- [ ] Определить все TypeScript interfaces в `types/index.ts`

### Файлы
```
src/types/index.ts
```

### Interfaces
```typescript
// DifficultyType enum
type DifficultyType = 'solo' | 'normal' | 'heroic' | 'nightmare'

// CharacterClass enum
type CharacterClass =
  | 'berserker' | 'destroyer' | 'warrior' | 'holyknight'
  | 'battlemaster' | 'infighter' | 'soulmaster' | 'bard'
  | 'sorceress' | 'gunslinger' | 'blaster' | 'scout'
  | 'assassin' | 'shadow' | 'demonic' | 'summoner' | 'archer'
  | 'custom'

// Character
interface Character {
  id: string                    // равен name
  name: string
  gearScore: number
  characterClass: CharacterClass
  customClassName?: string
  order: number
}

// Difficulty
interface Difficulty {
  type: DifficultyType
  requiredGearScore: number
  regularGold: number
  limitedGold: number
}

// Raid
interface Raid {
  id: string                    // транслитерация name
  name: string
  difficulties: Difficulty[]
}

// CharacterRaid
interface CharacterRaid {
  id: string
  characterId: string
  raidId: string
  difficultyType: DifficultyType
  isCompleted: boolean
  createdAt: number
}

// AppSettings
interface AppSettings {
  theme: Theme
}
type Theme = 'light' | 'dark'

// Export format
interface ExportData {
  version: 1
  exportedAt: string
  characters: Character[]
  characterRaids: CharacterRaid[]
  raids: Raid[]
  settings: AppSettings
}
```

### Чеклист готовности
- [ ] Все interfaces экспортируются
- [ ] TypeScript проверяет типы без ошибок

---

## Этап 3: Утилиты и константы

### Задачи
- [ ] Создать `utils/transliterate.ts`
- [ ] Создать `utils/validators.ts`
- [ ] Создать `constants/characterClasses.ts`
- [ ] Создать `constants/difficultyTypes.ts`

### Файлы
```
src/utils/transliterate.ts
src/utils/validators.ts
src/constants/characterClasses.ts
src/constants/difficultyTypes.ts
```

### transliterate.ts
```typescript
export function transliterate(text: string): string {
  // Lost Ark → lost-ark
  // Абиссас → abissas
  // Спецсимволы → удаление
  // Пробелы → дефисы
  // Все в lowercase
}
```

### validators.ts
```typescript
export function validateCharacter(data: unknown): { valid: boolean; errors: string[] }
export function validateRaid(data: unknown): { valid: boolean; errors: string[] }
export function validateDifficulty(data: unknown): { valid: boolean; errors: string[] }
export function validateImportData(data: unknown): { valid: boolean; errors: string[] }
```

### characterClasses.ts
```typescript
export const CHARACTER_CLASSES = [
  { value: 'berserker', label: 'Берсеркер' },
  { value: 'destroyer', label: 'Разрушитель' },
  // ... все 17 + custom
] as const

export type CharacterClassValue = typeof CHARACTER_CLASSES[number]['value']
```

### difficultyTypes.ts
```typescript
export const DIFFICULTY_TYPES = [
  { value: 'nightmare', label: 'Кошмар', order: 1 },
  { value: 'heroic', label: 'Героический', order: 2 },
  { value: 'normal', label: 'Обычный', order: 3 },
  { value: 'solo', label: 'Одиночный', order: 4 },
] as const

export type DifficultyTypeValue = typeof DIFFICULTY_TYPES[number]['value']
```

### Чеклист готовности
- [ ] `transliterate('Lost Ark')` → `'lost-ark'`
- [ ] `transliterate('Абиссас')` → `'abissas'`
- [ ] Валидаторы возвращают `{ valid, errors }`
- [ ] CHARACTER_CLASSES содержит 18 записей

---

## Этап 4: Composables

### Задачи
- [ ] Создать `composables/useLocalStorage.ts`
- [ ] Создать `composables/useTheme.ts`
- [ ] Создать `composables/useDragDrop.ts`

### Файлы
```
src/composables/useLocalStorage.ts
src/composables/useTheme.ts
src/composables/useDragDrop.ts
```

### useLocalStorage.ts
```typescript
// composables/useLocalStorage.ts
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const _value = shallowRef<T>(defaultValue)

  // Чтение из localStorage при инициализации
  // Запись в localStorage при изменении

  return {
    value: readonly(_value),  // readonly для защиты
    get,
    set,
  }
}
```

### useTheme.ts
```typescript
// composables/useTheme.ts
// export const themeKey = Symbol('theme') as InjectionKey<...>

export function useTheme() {
  const settings = useSettingsStore()

  // Применение data-theme на <html>
  // Синхронизация с localStorage

  return {
    isDark: settings.isDark,
    toggleTheme: settings.toggleTheme,
  }
}
```

### useDragDrop.ts
```typescript
// composables/useDragDrop.ts
// vuedraggable integration
export function useDragDrop<T>(
  items: Ref<T[]>,
  options: { onUpdate: (items: T[]) => void; enabled?: Ref<boolean> }
) {
  // Реализация drag-and-drop
  // enabled — только в режиме редактирования
}
```

### Чеклист готовности
- [ ] `useLocalStorage` читает/записывает в localStorage
- [ ] `useTheme` применяет тему на `<html>`
- [ ] `useDragDrop` работает с vuedraggable

---

## Этап 5: Pinia Stores

### Задачи
- [ ] Создать `stores/characters.ts`
- [ ] Создать `stores/raids.ts`
- [ ] Создать `stores/settings.ts`

### Файлы
```
src/stores/characters.ts
src/stores/raids.ts
src/stores/settings.ts
src/stores/index.ts
```

### settings.ts
```typescript
// stores/settings.ts
export const useSettingsStore = defineStore('settings', () => {
  const _theme = shallowRef<Theme>('light')

  const isDark = computed(() => _theme.value === 'dark')

  function setTheme(t: Theme) { _theme.value = t }
  function toggleTheme() { _theme.value = _theme.value === 'light' ? 'dark' : 'light' }

  // Persist to localStorage

  return {
    theme: readonly(_theme),
    isDark,
    setTheme,
    toggleTheme,
  }
})
```

### characters.ts
```typescript
// stores/characters.ts
export const useCharactersStore = defineStore('characters', () => {
  const _characters = reactive<Character[]>([])
  const _characterRaids = reactive<CharacterRaid[]>([])

  const characters = readonly(_characters)
  const characterRaids = readonly(_characterRaids)

  // Getters
  const sortedCharacters = computed(() => [..._characters].sort((a, b) => a.order - b.order))

  function getCharacterById(id: string) { /* ... */ }
  function getRaidsForCharacter(characterId: string) { /* ... */ }
  function getGoldSummary(characterId: string) { /* ... */ }
  function isCharacterGearScoreEnough(characterId: string, requiredGearScore: number) { /* ... */ }

  // Actions
  function addCharacter(data: Omit<Character, 'id' | 'order'>): Character { /* ... */ }
  function updateCharacter(id: string, data: Partial<Character>) { /* ... */ }
  function deleteCharacter(id: string) { /* cascade delete */ }
  function addCharacterRaid(data: Omit<CharacterRaid, 'id' | 'createdAt'>): CharacterRaid { /* ... */ }
  function updateCharacterRaid(id: string, data: Partial<CharacterRaid>) { /* ... */ }
  function deleteCharacterRaid(id: string) { /* ... */ }
  function toggleRaidCompleted(id: string) { /* ... */ }
  function reorderCharacters(newOrder: Character[]) { /* ... */ }
  function importData(data: { characters: Character[]; characterRaids: CharacterRaid[] }) { /* ... */ }

  return {
    characters,
    characterRaids,
    sortedCharacters,
    getCharacterById,
    getRaidsForCharacter,
    getGoldSummary,
    isCharacterGearScoreEnough,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    addCharacterRaid,
    updateCharacterRaid,
    deleteCharacterRaid,
    toggleRaidCompleted,
    reorderCharacters,
    importData,
  }
})
```

### raids.ts
```typescript
// stores/raids.ts
export const useRaidsStore = defineStore('raids', () => {
  const _raids = reactive<Raid[]>([])

  const raids = readonly(_raids)

  // Getters
  function getRaidById(id: string) { /* ... */ }
  const getAvailableRaidsForGearScore = computed(() => /* фильтр */)

  // Actions
  function addRaid(data: Omit<Raid, 'id'>): Raid { /* ... */ }
  function updateRaid(id: string, data: Partial<Raid>) { /* ... */ }
  function deleteRaid(id: string) { /* cascade delete */ }
  function importData(data: { raids: Raid[] }) { /* ... */ }

  return {
    raids,
    getRaidById,
    getAvailableRaidsForGearScore,
    addRaid,
    updateRaid,
    deleteRaid,
    importData,
  }
})
```

### Чеклист готовности
- [ ] Все CRUD операции работают
- [ ] Cascade delete удаляет связанные CharacterRaid
- [ ] `getGoldSummary` возвращает `{ regular, limited }`
- [ ] `getAvailableRaidsForGearScore` фильтрует по ГС
- [ ] Данные persist в localStorage

---

## Этап 6: Базовые компоненты (atoms)

### Задачи
- [ ] Создать `BaseButton.vue`
- [ ] Создать `BaseInput.vue`
- [ ] Создать `BaseSelect.vue`
- [ ] Создать `BaseCheckbox.vue`
- [ ] Создать `BaseTooltip.vue`

### Файлы
```
src/components/atoms/BaseButton.vue
src/components/atoms/BaseInput.vue
src/components/atoms/BaseSelect.vue
src/components/atoms/BaseCheckbox.vue
src/components/atoms/BaseTooltip.vue
```

### BaseButton.vue
```vue
<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
}>()

const emit = defineEmits<{ click: [event: MouseEvent] }>()
</script>
```

### BaseInput.vue
```vue
<script setup lang="ts">
// Использует defineModel() для v-model
const model = defineModel<string>({ required: true })

defineProps<{
  type?: 'text' | 'number' | 'password'
  placeholder?: string
  error?: string
}>()

const emit = defineEmits<{
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()
</script>
```

### BaseCheckbox.vue
```vue
<script setup lang="ts">
// Использует defineModel() для v-model
const model = defineModel<boolean>({ required: true })
</script>
```

### BaseSelect.vue
```vue
<script setup lang="ts">
// Использует defineModel() для v-model
const model = defineModel<string | number | null>({ required: true })

defineProps<{
  options: Array<{ value: string | number; label: string }>
  placeholder?: string
  error?: string
}>()
</script>
```

### BaseTooltip.vue
```vue
<script setup lang="ts">
defineProps<{
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  disabled?: boolean
}>()
</script>
```

### Чеклист готовности
- [ ] Все компоненты рендерятся
- [ ] BaseInput/BaseSelect показывают error state
- [ ] BaseTooltip показывает подсказку при hover
- [ ] Все стили адаптируются под тему

---

## Этап 7: Молекулы (molecules)

### Задачи
- [ ] Создать `DifficultyBadge.vue`
- [ ] Создать `GoldSummary.vue`
- [ ] Создать `RaidItem.vue`
- [ ] Создать `CharacterCard.vue`

### Файлы
```
src/components/molecules/DifficultyBadge.vue
src/components/molecules/GoldSummary.vue
src/components/molecules/RaidItem.vue
src/components/molecules/CharacterCard.vue
```

### DifficultyBadge.vue
```vue
<script setup lang="ts">
import { DIFFICULTY_TYPES } from '@/constants/difficultyTypes'

const props = defineProps<{
  type: DifficultyTypeValue
}>()

const config = computed(() => DIFFICULTY_TYPES.find(d => d.value === props.type))
</script>
```

### GoldSummary.vue
```vue
<script setup lang="ts">
const props = defineProps<{
  regular: number
  limited: number
}>()

const formattedRegular = computed(() => /* форматирование */)
const formattedLimited = computed(() => /* форматирование */)
</script>
```

### RaidItem.vue
```vue
<script setup lang="ts">
const props = defineProps<{
  raid: Raid
  difficultyType: DifficultyTypeValue
  isCompleted: boolean
  disabled?: boolean
  disabledReason?: string
}>()

const emit = defineEmits<{
  toggle: []
  remove: []
}>()
</script>
```

### CharacterCard.vue
```vue
<script setup lang="ts">
const props = defineProps<{
  character: Character
  raids: CharacterRaidWithDetails[]
}>()

const emit = defineEmits<{
  edit: [id: string]
  delete: [id: string]
  addRaid: [id: string]
}>()

const goldSummary = computed(() => /* сумма золота */)
</script>
```

### Чеклист готовности
- [ ] DifficultyBadge отображает цвет по типу сложности
- [ ] GoldSummary форматирует числа
- [ ] RaidItem показывает disabled state с tooltip
- [ ] CharacterCard показывает сводку по рейдам

---

## Этап 8: Организмы (organisms)

### Задачи
- [ ] Создать `CharacterList.vue`
- [ ] Создать `CharacterForm.vue`
- [ ] Создать `RaidForm.vue`
- [ ] Создать `RaidCard.vue`
- [ ] Создать `ExportImportPanel.vue`

### Файлы
```
src/components/organisms/CharacterList.vue
src/components/organisms/CharacterForm.vue
src/components/organisms/RaidForm.vue
src/components/organisms/RaidCard.vue
src/components/organisms/ExportImportPanel.vue
```

### CharacterList.vue
```vue
<script setup lang="ts">
const props = defineProps<{
  characters: Character[]
  editing: boolean  // режим редактирования для drag-and-drop
}>()

const emit = defineEmits<{
  reorder: [characters: Character[]]
  edit: [id: string]
  delete: [id: string]
  add: []
}>()

// Drag-and-drop с vuedraggable
// useDragDrop composable
</script>
```

### CharacterForm.vue
```vue
<script setup lang="ts">
const props = defineProps<{
  character?: Character  // null для создания, Character для редактирования
}>()

const emit = defineEmits<{
  submit: [data: CharacterFormData]
  cancel: []
}>()

// Валидация с validators.ts
// CHARACTER_CLASSES для селекта
</script>
```

### RaidForm.vue
```vue
<script setup lang="ts">
const props = defineProps<{
  raid?: Raid
}>()

const emit = defineEmits<{
  submit: [data: RaidFormData]
  cancel: []
}>()

// Динамическое добавление/удаление difficulties
// DIFFICULTY_TYPES для выбора сложности
</script>
```

### RaidCard.vue
```vue
<script setup lang="ts">
const props = defineProps<{
  raid: Raid
}>()

const emit = defineEmits<{
  edit: [id: string]
  delete: [id: string]
}>()
</script>
```

### ExportImportPanel.vue
```vue
<script setup lang="ts">
// Экспорт: собрать данные → ExportData → Blob → download
// Импорт: FileReader → validate → confirm → importData

const emit = defineEmits<{
  export: []
  import: []
}>()
</script>
```

### Чеклист готовности
- [ ] CharacterList поддерживает drag-and-drop в режиме editing
- [ ] CharacterForm валидирует данные
- [ ] RaidForm позволяет добавлять несколько difficulties
- [ ] ExportImportPanel работает с JSON
- [ ] Backup сохраняется перед импортом

---

## Этап 9: Views и Templates

### Задачи
- [ ] Создать `DashboardView.vue` + `DashboardTemplate.vue`
- [ ] Создать `RaidLibraryView.vue` + `RaidLibraryTemplate.vue`
- [ ] Создать `SettingsView.vue` + `SettingsTemplate.vue`
- [ ] Создать `AppHeader.vue` + `ThemeToggle.vue`

### Файлы
```
src/views/DashboardView.vue
src/views/RaidLibraryView.vue
src/views/SettingsView.vue
src/components/templates/DashboardTemplate.vue
src/components/templates/RaidLibraryTemplate.vue
src/components/templates/SettingsTemplate.vue
src/components/AppHeader.vue
src/components/ThemeToggle.vue
```

### Структура
```
App.vue
└── AppHeader (NavLinks + ThemeToggle)
    └── RouterView
        ├── DashboardView → DashboardTemplate → CharacterList
        ├── RaidLibraryView → RaidLibraryTemplate → RaidCard[]
        └── SettingsView → SettingsTemplate → ExportImportPanel + ThemeToggle
```

### Чеклист готовности
- [ ] DashboardView показывает список персонажей
- [ ] RaidLibraryView показывает библиотеку рейдов
- [ ] SettingsView показывает настройки темы и экспорт/импорт
- [ ] AppHeader навигирует между страницами
- [ ] ThemeToggle переключает тему

---

## Этап 10: Тестирование

### Задачи
- [ ] Настроить Vitest + @vue/test-utils
- [ ] Создать `src/test/setup.ts`
- [ ] Написать Unit-тесты для stores
- [ ] Написать Unit-тесты для utils
- [ ] Написать Component-тесты для atoms
- [ ] Написать Component-тесты для molecules
- [ ] Настроить Playwright
- [ ] Написать E2E-тесты

### Файлы
```
vitest.config.ts
playwright.config.ts
src/test/setup.ts
tests/
├── unit/
│   ├── stores/
│   │   ├── characters.test.ts
│   │   ├── raids.test.ts
│   │   └── settings.test.ts
│   └── utils/
│       ├── transliterate.test.ts
│       └── validators.test.ts
├── components/
│   ├── atoms/
│   │   ├── BaseButton.test.ts
│   │   ├── BaseInput.test.ts
│   │   ├── BaseSelect.test.ts
│   │   ├── BaseCheckbox.test.ts
│   │   └── BaseTooltip.test.ts
│   └── molecules/
│       ├── CharacterCard.test.ts
│       ├── RaidItem.test.ts
│       ├── DifficultyBadge.test.ts
│       └── GoldSummary.test.ts
└── e2e/
    └── scenarios.spec.ts
```

### Unit-тесты (stores/characters.ts)
```typescript
describe('useCharactersStore', () => {
  it('добавляет персонажа', () => {
    const store = useCharactersStore()
    const character = store.addCharacter({
      name: 'TestChar',
      gearScore: 1700,
      characterClass: 'bard',
    })
    expect(store.characters).toContainEqual(expect.objectContaining({ name: 'TestChar' }))
  })

  it('генерирует id равным name', () => {
    const store = useCharactersStore()
    const character = store.addCharacter({ name: 'MyChar', gearScore: 1700, characterClass: 'bard' })
    expect(character.id).toBe('MyChar')
  })

  it('cascade delete удаляет characterRaids', () => {
    const store = useCharactersStore()
    const character = store.addCharacter({ name: 'Test', gearScore: 1700, characterClass: 'bard' })
    store.addCharacterRaid({ characterId: 'Test', raidId: 'raid1', difficultyType: 'normal', isCompleted: false })
    store.deleteCharacter('Test')
    expect(store.characterRaids).toHaveLength(0)
  })

  it('getGoldSummary суммирует золото', () => {
    // ... тест
  })
})
```

### Component-тесты (atoms/BaseInput.test.ts)
```typescript
describe('BaseInput', () => {
  it('рендерит input', () => {
    const wrapper = mount(BaseInput, { props: { modelValue: '' } })
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('эмитит update:modelValue', async () => {
    const wrapper = mount(BaseInput, { props: { modelValue: '' } })
    await wrapper.find('input').setValue('test')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('показывает error state', () => {
    const wrapper = mount(BaseInput, { props: { modelValue: '', error: 'Required' } })
    expect(wrapper.find('.error').exists()).toBe(true)
  })
})
```

### E2E-тесты (scenarios.spec.ts)
```typescript
describe('Lost Ark Raid Tracker', () => {
  it('добавить персонажа с корректными данными', async ({ page }) => {
    await page.goto('/')
    await page.click('[data-testid="add-character-btn"]')
    await page.fill('[data-testid="character-name-input"]', 'TestChar')
    await page.fill('[data-testid="gear-score-input"]', '1700')
    await page.selectOption('[data-testid="class-select"]', 'bard')
    await page.click('[data-testid="submit-btn"]')
    expect(await page.locator('[data-testid="character-name"]').text()).toBe('TestChar')
  })
})
```

### Чеклист готовности
- [ ] `npm run test` запускает все тесты
- [ ] `npm run test:coverage` показывает coverage ≥ 80%
- [ ] `npm run test:e2e` запускает Playwright тесты
- [ ] Все 12 E2E сценариев проходят

---

## Этап 11: Финализация

### Задачи
- [ ] Проверить все требования из spec/02-rnd.md
- [ ] Responsive layout для 320px - 1920px
- [ ] Проверить accessibility
- [ ] Финальное ручное тестирование

### Чеклист готовности
- [ ] Все F-требования (F-01...F-13) реализованы
- [ ] Все NF-требования (NF-01...NF-05) выполнены
- [ ] Интерфейс адаптивен
- [ ] Приложение готово к использованию

---

## Зависимости между этапами

```
Этап 1 (Каркас)
    ↓
Этап 2 (Типы)
    ↓
Этап 3 (Утилиты)
    ↓
Этап 4 (Composables)
    ↓
Этап 5 (Stores) ←── Этап 3, Этап 4
    ↓
Этап 6 (atoms) ←── Этап 5
    ↓
Этап 7 (molecules) ←── Этап 6
    ↓
Этап 8 (organisms) ←── Этап 6, Этап 7
    ↓
Этап 9 (Views) ←── Этап 8
    ↓
Этап 10 (Тесты) ←── Этап 5, Этап 6, Этап 7, Этап 9
    ↓
Этап 11 (Финализация) ←── Этап 10
```

---

## Команды

```bash
# Разработка
npm run dev

# Тесты
npm run test          # Запустить все тесты (watch)
npm run test:run      # Запустить все тесты (one-time)
npm run test:coverage # Coverage report

# E2E
npm run test:e2e      # Playwright тесты

# Сборка
npm run build         # Production build
npm run preview       # Preview production build
```

---

## Definition of Done

Приложение считается готовым когда:
- [ ] Все этапы реализации завершены
- [ ] Coverage ≥ 80%
- [ ] Все 12 E2E сценариев проходят
- [ ] Нет TypeScript ошибок
- [ ] Приложение запускается и работает без ошибок