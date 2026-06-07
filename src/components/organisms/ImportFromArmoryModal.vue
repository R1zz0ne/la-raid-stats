<script setup lang="ts">
/**
 * ImportFromArmoryModal
 *
 * Modal for importing characters from Lost Ark Armory (Оружейная).
 * Allows searching by character name, previewing the character list,
 * and selecting which characters to import.
 */
import { computed } from 'vue'
import { useArmoryImport } from '@/composables/useArmoryImport'
import { useModalCloseGuard } from '@/composables/useModalCloseGuard'
import { useCharactersStore } from '@/stores/characters'
import type { ArmoryCharacter } from '@/services/lostarkApi'
import ArmoryCharacterItem from '@/components/molecules/ArmoryCharacterItem.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import BaseInput from '@/components/atoms/BaseInput.vue'

const props = defineProps<{
  existingNames?: string[]
}>()

const emit = defineEmits<{
  close: []
  imported: [result: { added: number; updated: number }]
}>()

const charactersStore = useCharactersStore()

// Modal close guard (ESC + overlay click)
const { onOverlayClick, onContentMouseDown, onContentMouseUp } = useModalCloseGuard(() => emit('close'))

// Armory import composable
const {
  characterName,
  characters,
  selectedNames,
  loading,
  gsLoading,
  gsProgress,
  error: fetchError,
  hasCharacters,
  selectedCount,
  canFetch,
  canImport,
  canFetchGearScores,
  setCharacterName,
  fetchCharacters,
  fetchGearScores,
  gearScores,
  toggleCharacter,
  selectAll,
  selectNone,
  importSelected,
  reset,
} = useArmoryImport({
  onImported: (result) => emit('imported', result),
})

// Computed set of existing names for duplicate detection
const existingNamesSet = computed(() => new Set(props.existingNames ?? charactersStore.characters.map(c => c.name)))

// Group characters by server
const groupedCharacters = computed(() => {
  const groups: Record<string, ArmoryCharacter[]> = {}

  for (const char of characters.value) {
    const server = char.server || 'Без сервера'
    if (!groups[server]) {
      groups[server] = []
    }
    groups[server].push(char)
  }

  // Convert to array, sort by server and reverse each group's characters
  return Object.entries(groups)
    .sort(([a], [b]) => {
      // Put empty server at the end
      if (a === 'Без сервера') return 1
      if (b === 'Без сервера') return -1
      return a.localeCompare(b)
    })
    .map(([server, chars]): [string, ArmoryCharacter[]] => [server, [...chars].reverse()])
})

// Handle search
function handleSearch() {
  if (canFetch.value) {
    fetchCharacters()
  }
}

// Handle keydown on input
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && canFetch.value) {
    fetchCharacters()
  }
}

// Handle close
function handleClose() {
  reset()
  emit('close')
}

// Handle import
function handleImport() {
  importSelected()
}

// Select all/none handlers for grouped view
function handleSelectAll() {
  selectAll()
}

function handleSelectNone() {
  selectNone()
}

// Total count
const totalCount = computed(() => characters.value.length)
</script>

<template>
  <Teleport to="body">
    <div v-if="true" class="modal-overlay" @click="onOverlayClick">
      <div class="modal-content" @click.stop @mousedown="onContentMouseDown" @mouseup="onContentMouseUp">
        <div class="import-modal">
          <!-- Header -->
          <header class="import-modal__header">
            <h3 class="import-modal__title">
              <svg class="import-modal__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Импорт из Оружейной
            </h3>
            <button class="import-modal__close" @click="handleClose" aria-label="Закрыть">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </header>

          <!-- Search Section -->
          <div class="import-modal__search">
            <div class="import-modal__search-row">
              <BaseInput
                :model-value="characterName"
                type="text"
                placeholder="Введите имя персонажа"
                label="Имя персонажа на аккаунте"
                id="armory-character-name"
                :disabled="loading"
                @update:model-value="setCharacterName"
                @keydown="handleKeydown"
              />
              <BaseButton
                variant="secondary"
                :disabled="!canFetch"
                @click="handleSearch"
              >
                Найти
              </BaseButton>
            </div>
            <p class="import-modal__hint">
              Введите имя любого персонажа с аккаунта. Система загрузит список всех персонажей.
            </p>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="import-modal__loading">
            <div class="import-modal__spinner"></div>
            <p>Загрузка персонажей...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="fetchError" class="import-modal__error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div class="import-modal__error-content">
              <p>{{ fetchError }}</p>
              <p v-if="fetchError.includes('CORS')" class="import-modal__error-hint">
                Попробуйте открыть приложение через локальный сервер (localhost) или VPN.
              </p>
            </div>
          </div>

          <!-- Characters List -->
          <div v-else-if="hasCharacters" class="import-modal__list">
            <div class="import-modal__list-header">
              <span class="import-modal__count">
                Найдено персонажей: {{ totalCount }}
              </span>
              <div class="import-modal__selection-actions">
                <BaseButton
                  v-if="!gsLoading"
                  variant="secondary"
                  :disabled="!canFetchGearScores"
                  @click="fetchGearScores"
                >
                  Загрузить ГС
                </BaseButton>
                <span v-if="gsLoading" class="import-modal__gs-progress">
                  <span class="import-modal__gs-spinner"></span>
                  {{ gsProgress.current }}/{{ gsProgress.total }}
                </span>
                <button class="import-modal__select-btn" @click="handleSelectAll">
                  Все
                </button>
                <button class="import-modal__select-btn" @click="handleSelectNone">
                  Сброс
                </button>
              </div>
            </div>

            <div class="import-modal__scroll">
              <template v-for="[server, chars] in groupedCharacters" :key="server">
                <div v-if="server !== 'Без сервера'" class="import-modal__server">
                  {{ server }}
                </div>
                <ArmoryCharacterItem
                  v-for="char in chars"
                  :key="char.name"
                  :character="char"
                  :gear-score="gearScores.get(char.name)"
                  :is-selected="selectedNames.has(char.name)"
                  :is-duplicate="existingNamesSet.has(char.name)"
                  @toggle="toggleCharacter"
                />
              </template>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="import-modal__empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <p>Введите имя персонажа и нажмите "Найти"</p>
          </div>

          <!-- Footer -->
          <footer class="import-modal__footer">
            <button class="import-modal__cancel" @click="handleClose">
              Отмена
            </button>
            <BaseButton
              variant="primary"
              :disabled="!canImport"
              @click="handleImport"
            >
              Импортировать ({{ selectedCount }})
            </BaseButton>
          </footer>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-md);
  animation: fadeIn var(--transition-fast) ease-out;
}

.modal-content {
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  animation: slideUp var(--transition-normal) ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.import-modal {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.import-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.import-modal__title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--text-lg);
  font-weight: 600;
  margin: 0;
}

.import-modal__icon {
  width: 24px;
  height: 24px;
  color: var(--color-primary);
}

.import-modal__close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--color-text-muted);
  transition: all var(--transition-fast);
}

.import-modal__close:hover {
  background-color: var(--color-surface-hover);
  color: var(--color-text);
}

.import-modal__close svg {
  width: 20px;
  height: 20px;
}

.import-modal__search {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.import-modal__search-row {
  display: flex;
  gap: var(--spacing-sm);
  align-items: flex-end;
}

.import-modal__search-row > :first-child {
  flex: 1;
}

.import-modal__hint {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin: 0;
}

.import-modal__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
  gap: var(--spacing-md);
  color: var(--color-text-muted);
}

.import-modal__spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.import-modal__error {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  margin: var(--spacing-md);
  background-color: var(--color-error-light);
  border: 1px solid var(--color-error);
  border-radius: var(--radius-md);
  color: var(--color-error);
}

.import-modal__error svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.import-modal__error p {
  margin: 0;
  font-size: var(--text-sm);
}

.import-modal__error-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.import-modal__error-hint {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  padding-top: var(--spacing-xs);
  border-top: 1px solid var(--color-error);
  margin-top: var(--spacing-xs);
}

.import-modal__list {
  display: flex;
  flex-direction: column;
  max-height: 400px;
}

.import-modal__list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
}

.import-modal__count {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
}

.import-modal__selection-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.import-modal__select-btn {
  font-size: var(--text-xs);
  color: var(--color-primary);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: background-color var(--transition-fast);
}

.import-modal__select-btn:hover {
  background-color: var(--color-primary-light);
}

.import-modal__gs-progress {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--text-xs);
  color: var(--color-primary);
  padding: 4px 8px;
  font-weight: 500;
}

.import-modal__gs-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.import-modal__scroll {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-sm);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.import-modal__server {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-text-muted);
  padding: var(--spacing-xs) var(--spacing-sm);
  margin-top: var(--spacing-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.import-modal__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
  gap: var(--spacing-md);
  color: var(--color-text-muted);
  text-align: center;
}

.import-modal__empty svg {
  width: 48px;
  height: 48px;
  opacity: 0.5;
}

.import-modal__empty p {
  margin: 0;
  font-size: var(--text-sm);
}

.import-modal__footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

.import-modal__cancel {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.import-modal__cancel:hover {
  background-color: var(--color-surface-hover);
  border-color: var(--color-text-muted);
}
</style>