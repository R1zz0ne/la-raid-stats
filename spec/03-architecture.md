# Архитектура: Lost Ark Raid Tracker

## 1. Обзор архитектуры

**Тип приложения:** SPA (Single Page Application) с клиентским хранением данных

**Стек:**
- Vue 3 (Composition API) + `<script setup lang="ts">`
- TypeScript
- Less (CSS)
- Pinia (state management)
- Vue Router
- Vite (build tool)
- Vitest + @vue/test-utils (testing)
- Playwright (E2E)

**Принципы (Vue Best Practices):**
- Реактивность: `shallowRef()` для примитивов, `reactive()` для state objects
- Компоненты: Props down / Events up, `defineModel()` для v-model
- Composables: `readonly()` state + explicit actions
- Provide/Inject: Symbols для ключей
- SFC: `<script>` → `<template>` → `<style>`, scoped styles, class selectors
- Computed: чистые getters, производные данные — через computed

---

## 2. Структура проекта

```
src/
├── assets/
│   └── styles/
│       ├── _variables.less      # CSS-переменные для тем
│       ├── _mixins.less        # Миксины
│       └── global.less        # Глобальные стили
├── components/
│   ├── atoms/                  # Базовые компоненты
│   │   ├── BaseButton.vue
│   │   ├── BaseInput.vue
│   │   ├── BaseSelect.vue
│   │   ├── BaseCheckbox.vue
│   │   └── BaseTooltip.vue
│   ├── molecules/              # Композиционные компоненты
│   │   ├── CharacterCard.vue
│   │   ├── RaidItem.vue
│   │   ├── DifficultyBadge.vue
│   │   └── GoldSummary.vue
│   ├── organisms/              # Блочные компоненты
│   │   ├── CharacterList.vue
│   │   ├── CharacterForm.vue
│   │   ├── RaidForm.vue
│   │   ├── RaidCard.vue
│   │   └── ExportImportPanel.vue
│   └── templates/              # Шаблоны страниц
│       ├── DashboardTemplate.vue
│       ├── RaidLibraryTemplate.vue
│       └── SettingsTemplate.vue
├── composables/
│   ├── useLocalStorage.ts      # localStorage abstraction
│   ├── useDragDrop.ts          # Drag-and-drop логика
│   └── useTheme.ts             # Управление темой
├── router/
│   └── index.ts                # Vue Router конфиг
├── stores/
│   ├── characters.ts           # Персонажи + CharacterRaid
│   ├── raids.ts                # Библиотека рейдов
│   └── settings.ts             # Настройки (тема)
├── types/
│   └── index.ts                # TypeScript interfaces
├── utils/
│   ├── transliterate.ts        # Транслитерация для ID рейдов
│   └── validators.ts           # Валидация форм
├── views/
│   ├── DashboardView.vue
│   ├── RaidLibraryView.vue
│   └── SettingsView.vue
├── App.vue
└── main.ts
```

---

## 3. Типы данных (TypeScript)

```typescript
// enums
type DifficultyType = 'solo' | 'normal' | 'heroic' | 'nightmare';
type Theme = 'light' | 'dark';

// Character — id равен name (уникальный)
interface Character {
  id: string;                    // равен name
  name: string;
  gearScore: number;
  characterClass: CharacterClass;
  order: number;                 // для drag-and-drop сортировки
}

// CharacterClass
type CharacterClass =
  | 'berserker'
  | 'destroyer'
  | 'warrior'
  | 'holyknight'
  | 'battlemaster'
  | 'infighter'
  | 'soulmaster'
  | 'bard'
  | 'sorceress'
  | 'gunslinger'
  | 'blaster'
  | 'scout'
  | 'assassin'
  | 'shadow'
  | 'demonic'
  | 'summoner'
  | 'archer'
  | 'custom';                    // + отдельное поле customClassName

interface Character {
  id: string;
  name: string;
  gearScore: number;
  characterClass: CharacterClass;
  customClassName?: string;      // если characterClass === 'custom'
  order: number;
}

// Difficulty
interface Difficulty {
  type: DifficultyType;
  requiredGearScore: number;
  regularGold: number;
  limitedGold: number;
}

// Raid — id генерируется транслитерацией name
interface Raid {
  id: string;                    // транслитерация name (slug)
  name: string;
  difficulties: Difficulty[];
}

// CharacterRaid (назначение)
interface CharacterRaid {
  id: string;                    // UUID
  characterId: string;           // id персонажа
  raidId: string;                // id рейда
  difficultyType: DifficultyType;
  isCompleted: boolean;
  createdAt: number;              // timestamp для сортировки
}

// AppSettings
interface AppSettings {
  theme: Theme;
}

// Store state
interface AppState {
  characters: Character[];
  characterRaids: CharacterRaid[];
  raids: Raid[];
  settings: AppSettings;
}
```

---

## 4. Роутинг

```typescript
// router/index.ts
const routes = [
  { path: '/', name: 'dashboard', component: DashboardView },
  { path: '/raids', name: 'raids', component: RaidLibraryView },
  { path: '/settings', name: 'settings', component: SettingsView },
];
```

### Структура навигации

```
AppHeader (навигация по всем страницам)
├── Logo / Название
├── NavLinks: Dashboard | Рейды | Настройки
└── ThemeToggle
```

---

## 5. Pinia Stores

### 5.1 useCharactersStore

```typescript
// State (reactive для мутаций)
const state = reactive({
  characters: [] as Character[],
  characterRaids: [] as CharacterRaid[],
})

// Expose как readonly для предотвращения прямой мутации
const characters = readonly(state.characters)
const characterRaids = readonly(state.characterRaids)

// Getters (computed)
- getCharacterById(id)
- getRaidsForCharacter(characterId)
- getGoldSummary(characterId) → { regular, limited }
- sortedCharacters → computed(() => [...state.characters].sort((a, b) => a.order - b.order))
- isCharacterGearScoreEnough(characterId, requiredGearScore)

// Actions (явные методы)
- addCharacter(data): Character
- updateCharacter(id, data): void
- deleteCharacter(id): void                      // cascade delete characterRaids
- addCharacterRaid(data): CharacterRaid
- updateCharacterRaid(id, data): void
- deleteCharacterRaid(id): void
- toggleRaidCompleted(id): void
- reorderCharacters(newOrder: Character[]): void
- importData(data): void                          // полная замена
```

### 5.2 useRaidsStore

```typescript
// State
const state = reactive({
  raids: [] as Raid[],
})

const raids = readonly(state.raids)

// Getters
- getRaidById(id)
- getAvailableRaidsForGearScore(gearScore)  // computed фильтр

// Actions
- addRaid(data): Raid
- updateRaid(id, data): void
- deleteRaid(id): void                       // cascade delete characterRaids
- importData(data): void
```

### 5.3 useSettingsStore

```typescript
// State (shallowRef для примитива)
const theme = shallowRef<Theme>('light')

// Getters
- isDark = computed(() => theme.value === 'dark')

// Actions
- setTheme(t: Theme): void
- toggleTheme(): void
```

---

## 6. Компоненты

### 6.0 Component API Contracts

Каждый компонент имеет явный контракт `defineProps` / `defineEmits` с TypeScript типами.

**Атомы (atoms/)** — простые UI-примитивы:

| Компонент | Props | Emits |
|-----------|-------|-------|
| BaseButton | `variant`, `disabled`, `loading`, `type` | `click` |
| BaseInput | `modelValue`, `type`, `placeholder`, `error` | `update:modelValue`, `blur`, `focus` |
| BaseSelect | `modelValue`, `options`, `placeholder`, `error` | `update:modelValue`, `change` |
| BaseCheckbox | `modelValue` (boolean) | `update:modelValue` |
| BaseTooltip | `content`, `position`, `disabled` | — |

**Молекулы (molecules/)** — композиционные компоненты:

| Компонент | Props | Emits |
|-----------|-------|-------|
| CharacterCard | `character`, `raids` | `edit`, `delete`, `addRaid` |
| RaidItem | `raid`, `difficultyType`, `isCompleted` | `toggle`, `remove` |
| DifficultyBadge | `type` (DifficultyType) | — |
| GoldSummary | `regular`, `limited` | — |

**Организмы (organisms/)** — бизнес-компоненты:

| Компонент | Props | Emits |
|-----------|-------|-------|
| CharacterList | `characters`, `editing` (boolean) | `reorder`, `edit`, `delete`, `add` |
| CharacterForm | `character?` (для редактирования) | `submit`, `cancel` |
| RaidForm | `raid?` (для редактирования) | `submit`, `cancel` |
| RaidCard | `raid` | `edit`, `delete` |
| ExportImportPanel | — | `export`, `import` |

### 6.1 Атомы (atoms/)

| Компонент | Описание |
|-----------|----------|
| BaseButton | Кнопка с вариантами (primary, secondary, danger) |
| BaseInput | Текстовое поле с валидацией, использует `defineModel()` |
| BaseSelect | Селект с поддержкой опций |
| BaseCheckbox | Чекбокс с лейблом, использует `defineModel()` |
| BaseTooltip | Тултип для подсказок |

### 6.2 Молекулы (molecules/)

| Компонент | Описание |
|-----------|----------|
| CharacterCard | Карточка персонажа: имя, ГС, класс, сводка по рейдам |
| RaidItem | Рейд в списке: название, сложность, статус (чекбокс) |
| DifficultyBadge | Бейдж сложности с цветом |
| GoldSummary | Отображение обычного и лимитированного золота |

### 6.3 Организмы (organisms/)

| Компонент | Описание |
|-----------|----------|
| CharacterList | Список CharacterCard с drag-and-drop сортировкой |
| CharacterForm | Форма добавления/редактирования персонажа |
| RaidForm | Форма создания/редактирования рейда с динамическими Difficulty |
| RaidCard | Карточка рейда в библиотеке |
| ExportImportPanel | Панель экспорта/импорта JSON |

### 6.4 Templates

| Компонент | Описание |
|-----------|----------|
| DashboardTemplate | Лейаут дашборда с CharacterList |
| RaidLibraryTemplate | Лейаут библиотеки рейдов |
| SettingsTemplate | Лейаут настроек |

---

## 7. Composables

> **Паттерн:** Возвращать `readonly()` state + explicit actions. Избегать мутабельных refs наружу.

### 7.1 useLocalStorage

```typescript
// composables/useLocalStorage.ts
function useLocalStorage<T>(key: string, defaultValue: T) {
  const _value = shallowRef<T>(/* read from localStorage */)

  function get(): T { /* ... */ }
  function set(val: T): void { /* ... */ }

  return {
    value: readonly(_value),  // readonly для защиты от мутации
    get,
    set,
  }
}
```

### 7.2 useDragDrop

```typescript
// composables/useDragDrop.ts
// vuedraggable integration
function useDragDrop<T>(
  items: Ref<T[]>,
  options: { onUpdate: (items: T[]) => void; enabled?: Ref<boolean> }
) {
  // drag-and-drop логика
  // enabled — только в режиме редактирования

  return {
    // expose только для шаблона
    listId: string,
    // drag events
  }
}
```

### 7.3 useTheme

```typescript
// composables/useTheme.ts
// применение data-theme на <html>
// синхронизация с useSettingsStore

export const themeKey = Symbol('theme') as InjectionKey<{
  isDark: Readonly<ComputedRef<boolean>>
  toggle: () => void
}>

export function useTheme() {
  const settings = useSettingsStore()

  // Применение темы при изменении
  watch(() => settings.isDark, (dark) => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, { immediate: true })

  return {
    isDark: settings.isDark,
    toggleTheme: settings.toggleTheme,
  }
}
```

---

## 8. Утилиты

### 8.1 transliterate.ts

```typescript
function transliterate(text: string): string {
  // Lost Ark → lost-ark
  // Абиссас → abissas
  // возвращает slug для id рейда
}
```

### 8.2 validators.ts

```typescript
// Валидация CharacterForm
// Валидация RaidForm
// Валидация Difficulty

// Формат JSON для импорта проверять схему
```

---

## 9. Валидация ГС (GearScore)

### Логика:

1. **При фильтрации списка рейдов для персонажа:**
   ```typescript
   // Рейд скрывается если min(difficulty.requiredGearScore) > character.gearScore
   ```

2. **При фильтрации сложностей:**
   ```typescript
   // Сложность disabled если difficulty.requiredGearScore > character.gearScore
   // Показывать tooltip: "Нужен ГС: {requiredGearScore}"
   ```

3. **Computed-фильтрация:**
   ```typescript
   // useRaidsStore.getAvailableRaidsForGearScore(gearScore)
   // возвращает только доступные рейды
   ```

---

## 10. Темы (CSS Variables)

### 10.1 Файл _variables.less

```less
// Light theme (default)
@color-bg: #ffffff;
@color-text: #1a1a1a;
@color-primary: #3b82f6;
@color-border: #e5e7eb;
// ...

// Dark theme
[data-theme="dark"] {
  @color-bg: #1a1a1a;
  @color-text: #ffffff;
  @color-primary: #60a5fa;
  @color-border: #374151;
  // ...
}
```

### 10.2 Применение

```typescript
// composables/useTheme.ts
// Применяет data-theme="dark" на <html>
// localStorage: 'theme'
```

---

## 11. Экспорт/Импорт

### 11.1 Формат JSON

```typescript
interface ExportData {
  version: 1;
  exportedAt: string;             // ISO date
  characters: Character[];
  characterRaids: CharacterRaid[];
  raids: Raid[];
  settings: AppSettings;
}
```

### 11.2 Процесс экспорта

1. Собрать все данные из stores
2. Сформировать ExportData
3. Создать Blob → создать ссылку → trigger download
4. Файл: `lost-ark-raids-{date}.json`

### 11.3 Процесс импорта

1. Пользователь выбирает файл
2. Прочитать FileReader → parse JSON
3. **Валидация схемы** (проверить поля, типы)
4. **Предупреждение**: "Текущие данные будут заменены"
5. Confirm → записать в stores
6. Сохранить в localStorage

---

## 12. Фиксированный список классов

```typescript
const CHARACTER_CLASSES = [
  { value: 'berserker', label: 'Берсеркер' },
  { value: 'destroyer', label: 'Разрушитель' },
  { value: 'warrior', label: 'Воин' },
  { value: 'holyknight', label: 'Паладин' },
  { value: 'battlemaster', label: 'Боевой Мастер' },
  { value: 'infighter', label: 'Борец' },
  { value: 'soulmaster', label: 'Мастер Душ' },
  { value: 'bard', label: 'Бард' },
  { value: 'sorceress', label: 'Ведьма' },
  { value: 'gunslinger', label: 'Стрелок' },
  { value: 'blaster', label: 'Подрывник' },
  { value: 'scout', label: 'Разведчик' },
  { value: 'assassin', label: 'Убийца' },
  { value: 'shadow', label: 'Теневой Клинок' },
  { value: 'demonic', label: 'Демон' },
  { value: 'summoner', label: 'Призыватель' },
  { value: 'archer', label: 'Лучник' },
  { value: 'custom', label: 'Свой вариант' },
];
```

---

## 13. Схема взаимодействий компонентов

```
Views
 └── Templates
      └── Organisms
           ├── CharacterList ────────┐
           │    └── CharacterCard ◄──┼──┐
           │         └── RaidItem ◄──┼──┼──┐
           ├── CharacterForm ◄───────┘  │  │
           ├── RaidForm ◄──────────────┘  │
           └── RaidCard ◄───────────────┘

Stores (Pinia)
 ├── useCharactersStore ◄── CharacterList, CharacterForm
 ├── useRaidsStore ◄─────── RaidForm, RaidCard, CharacterCard
 └── useSettingsStore ◄──── useTheme, ThemeToggle
```

---

## 14. Ограничения реализации (v1)

| Ограничение | Описание |
|-------------|----------|
| localStorage only | Без синхронизации между устройствами |
| Max 30 персонажей | Проверка при добавлении |
| ID персонажей = name | Нельзя менять name после создания (влияет на ID) |
| ID рейдов = slug | Уникальность по транслитерированному name |
| Full replace import | Нет слияния при импорте |
| No иконки классов | Пока только текст/заглушка |

---

## 15. Тестирование

### 15.1 Тестовый стек

| Тип тестов | Фреймворк | Coverage |
|------------|-----------|----------|
| Unit | Vitest | 80%+ |
| Component | Vue Test Utils + Vitest | atoms/, molecules/ |
| E2E | Playwright | 12 сценариев из R&D |

### 15.2 Структура тестов

```
tests/
├── unit/
│   ├── stores/
│   │   ├── characters.test.ts    # CRUD + gold summary + cascade delete
│   │   ├── raids.test.ts         # CRUD + getAvailableRaidsForGearScore
│   │   └── settings.test.ts      # setTheme, toggleTheme
│   └── utils/
│       ├── transliterate.test.ts # English/Russian cases
│       └── validators.test.ts    # Character/Raid/Difficulty validation
├── components/
│   ├── atoms/
│   │   ├── BaseButton.test.ts   # render, props, disabled
│   │   ├── BaseInput.test.ts    # render, input event, validation
│   │   ├── BaseSelect.test.ts   # render, select, options
│   │   ├── BaseCheckbox.test.ts # render, checked state
│   │   └── BaseTooltip.test.ts  # visibility toggle
│   └── molecules/
│       ├── CharacterCard.test.ts # render, props, raid list
│       ├── RaidItem.test.ts      # toggle completed
│       ├── DifficultyBadge.test.ts
│       └── GoldSummary.test.ts
└── e2e/
    └── scenarios.spec.ts        # 12 scenarios from R&D
```

### 15.3 Unit-тесты (Vitest)

**useCharactersStore:**
- `addCharacter` — добавление с корректными данными
- `addCharacter` — ошибка при дублировании name
- `updateCharacter` — обновление полей
- `deleteCharacter` — cascade delete characterRaids
- `addCharacterRaid` — добавление назначения
- `updateCharacterRaid` — смена difficultyType
- `deleteCharacterRaid` — удаление назначения
- `toggleRaidCompleted` — toggle isCompleted
- `getGoldSummary` — подсчёт золота для персонажа
- `reorderCharacters` — изменение order
- `isCharacterGearScoreEnough` — валидация ГС

**useRaidsStore:**
- `addRaid` — добавление с difficulties
- `updateRaid` — обновление полей и difficulties
- `deleteRaid` — cascade delete characterRaids
- `getAvailableRaidsForGearScore` — фильтрация по ГС

**useSettingsStore:**
- `setTheme` — установка темы
- `toggleTheme` — переключение темы

**transliterate:**
- Английские символы → lowercase slug
- Русские символы → транслитерация
- Спецсимволы → удаление
- Пробелы → дефисы

**validators:**
- `validateCharacter` — валидация полей Character
- `validateRaid` — валидация Raid с difficulties
- `validateDifficulty` — валидация Difficulty
- `validateImportData` — валидация JSON для импорта

### 15.4 Component-тесты (Vue Test Utils)

**atoms:**
- BaseButton — рендер, emit click, disabled state, variant
- BaseInput — рендер, emit update:modelValue, validation state
- BaseSelect — рендер options, emit select
- BaseCheckbox — рендер, emit change, checked state
- BaseTooltip — visibility toggle on hover/focus

**molecules:**
- CharacterCard — рендер с пропсами, клик по кнопкам
- RaidItem — toggle completed, рендер статуса
- DifficultyBadge — рендер с цветом по типу сложности
- GoldSummary — форматирование чисел

### 15.5 E2E-тесты (Playwright)

12 сценариев из R&D (раздел 9):
1. Добавить персонажа с корректными данными
2. Добавить персонажа без имени
3. Удалить персонажа
4. Создать рейд с одной сложностью
5. Создать рейд с несколькими сложностями
6. Назначить рейд персонажу
7. Отметить рейд как пройденный
8. Сменить тему на тёмную
9. Экспортировать данные
10. Импортировать валидный JSON
11. Открыть приложение повторно
12. Попытка добавить 31-го персонажа

### 15.6 Конфигурация

**vitest.config.ts:**
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'happy-dom',     // быстрее чем jsdom
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      threshold: {
        lines: 80,
        functions: 80,
        branches: 80,
      },
      exclude: ['node_modules', '**/*.test.ts', '**/*.spec.ts'],
    },
  },
})
```

**playwright.config.ts:**
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:5173',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})
```

**src/test/setup.ts:**
```typescript
// Глобальные mocks и настройки для тестов
import { expect } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'
expect.extend(matchers)
```

### 15.7 Тестовые паттерны (Vue Testing Best Practices)

**Black-box подход для компонентов:**
```typescript
// tests/components/CharacterCard.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CharacterCard from '@/components/molecules/CharacterCard.vue'

describe('CharacterCard', () => {
  it('отображает имя и ГС персонажа', () => {
    const wrapper = mount(CharacterCard, {
      props: {
        character: { id: 'Test', name: 'Test', gearScore: 1700, characterClass: 'bard', order: 0 },
        raids: [],
      },
    })

    expect(wrapper.find('[data-testid="character-name"]').text()).toBe('Test')
    expect(wrapper.find('[data-testid="gear-score"]').text()).toBe('1700')
  })

  it('эмитит событие при клике на редактирование', async () => {
    const wrapper = mount(CharacterCard, {
      props: { /* ... */ },
    })

    await wrapper.find('[data-testid="edit-btn"]').trigger('click')

    expect(wrapper.emitted('edit')).toBeTruthy()
  })
})
```

**Testing Pinia stores:**
```typescript
// tests/stores/characters.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCharactersStore } from '@/stores/characters'

describe('useCharactersStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('добавляет персонажа', () => {
    const store = useCharactersStore()
    const character = store.addCharacter({
      name: 'TestChar',
      gearScore: 1700,
      characterClass: 'bard',
    })

    expect(store.characters).toContainEqual(expect.objectContaining({ name: 'TestChar' }))
  })
})
```

---

---

## 16. План реализации

### Этап 1: Каркас
- [ ] Инициализация Vite + Vue 3 + TypeScript + Less
- [ ] Настройка структуры папок
- [ ] Подключение Pinia + Vue Router
- [ ] Базовые типы (types/index.ts)
- [ ] Глобальные стили + темы

### Этап 2: Infrastructure
- [ ] useLocalStorage composable
- [ ] useTheme composable
- [ ] useSettingsStore
- [ ] Транслитерация (utils/transliterate.ts)

### Этап 3: Stores
- [ ] useRaidsStore
- [ ] useCharactersStore
- [ ] CRUD-методы
- [ ] Cascade delete логика
- [ ] Gold summary computed

### Этап 4: Базовые компоненты
- [ ] atoms/ (BaseButton, BaseInput, BaseSelect, BaseCheckbox, BaseTooltip)
- [ ] Стилизация под тему

### Этап 5: Формы
- [ ] CharacterForm
- [ ] RaidForm с динамическими Difficulty
- [ ] Валидация

### Этап 6: Views & Templates
- [ ] DashboardView + DashboardTemplate
- [ ] RaidLibraryView + RaidLibraryTemplate
- [ ] SettingsView + SettingsTemplate
- [ ] AppHeader + NavLinks + ThemeToggle

### Этап 7: Функциональность
- [ ] CharacterList с drag-and-drop
- [ ] CharacterCard с RaidList
- [ ] Toggle completed
- [ ] GoldSummary

### Этап 8: Export/Import
- [ ] ExportImportPanel
- [ ] JSON валидация
- [ ] Backup before import

### Этап 9: Тестирование
- [ ] Настройка Vitest + Vue Test Utils
- [ ] Unit-тесты stores/utils
- [ ] Component-тесты
- [ ] Настройка Playwright
- [ ] E2E-тесты (12 сценариев)
- [ ] Coverage check (80%+)

### Этап 10: Финализация
- [ ] Проверка всех требований из R&D
- [ ] Responsive layout
- [ ] Финальное тестирование