<script setup lang="ts">
/**
 * GearScoreRefreshModal
 *
 * Modal for selecting characters to refresh their gear score from the Armory.
 * Features:
 * - Character selection list
 * - Select all/none
 * - Starts refresh and closes immediately
 * - Progress shown via toast notification
 */
import { onMounted, onUnmounted } from 'vue'
import { useGearScoreRefresh } from '@/composables/useGearScoreRefresh'
import { useCharactersStore } from '@/stores/characters'
import BaseButton from '@/components/atoms/BaseButton.vue'

const emit = defineEmits<{
  close: []
}>()

const charactersStore = useCharactersStore()
const {
  selectedNames,
  selectedCount,
  canRefresh,
  toggleSelection,
  selectAll,
  selectNone,
  refreshGearScores,
  reset,
} = useGearScoreRefresh()

// Lock body scroll
onMounted(() => {
  document.body.classList.add('body-no-scroll')
})

onUnmounted(() => {
  document.body.classList.remove('body-no-scroll')
})

// Handle close
function handleClose() {
  reset()
  emit('close')
}

// Handle refresh - starts and closes immediately
async function handleRefresh() {
  emit('close')
  // Start refresh in background
  refreshGearScores()
}

// Check if character is selected
function isSelected(name: string): boolean {
  return selectedNames.value.has(name)
}
</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay" @click="handleClose">
      <div class="modal-content" @click.stop>
        <div class="gs-refresh-modal">
          <!-- Header -->
          <header class="gs-refresh-modal__header">
            <h3 class="gs-refresh-modal__title">
              <svg class="gs-refresh-modal__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Обновление ГС
            </h3>
            <button
              class="gs-refresh-modal__close"
              @click="handleClose"
              aria-label="Закрыть"
              :disabled="isRefreshing"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </header>

          <!-- Selection controls -->
          <div class="gs-refresh-modal__controls">
            <BaseButton
              variant="secondary"
              size="small"
              @click="selectAll"
              :disabled="isRefreshing"
            >
              Выбрать всех
            </BaseButton>
            <BaseButton
              variant="secondary"
              size="small"
              @click="selectNone"
              :disabled="isRefreshing"
            >
              Снять выбор
            </BaseButton>
            <span class="gs-refresh-modal__count">
              {{ selectedCount }} из {{ charactersStore.characters.length }}
            </span>
          </div>

          <!-- Character list -->
          <div class="gs-refresh-modal__list">
            <label
              v-for="character in charactersStore.sortedCharacters"
              :key="character.id"
              class="gs-refresh-modal__item"
              :class="{ 'gs-refresh-modal__item--selected': isSelected(character.name) }"
            >
              <input
                type="checkbox"
                :checked="isSelected(character.name)"
                :disabled="isRefreshing"
                @change="toggleSelection(character.name)"
              />
              <span class="gs-refresh-modal__item-name">{{ character.name }}</span>
              <span class="gs-refresh-modal__item-gs">{{ character.gearScore.toLocaleString('ru-RU') }}</span>
            </label>
          </div>

          <!-- Footer -->
          <footer class="gs-refresh-modal__footer">
            <BaseButton
              variant="secondary"
              @click="handleClose"
            >
              Отмена
            </BaseButton>
            <BaseButton
              variant="primary"
              @click="handleRefresh"
              :disabled="!canRefresh"
            >
              Обновить ГС
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
  max-width: 400px;
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

.gs-refresh-modal {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.gs-refresh-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.gs-refresh-modal__title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin: 0;
  font-size: var(--text-base);
  font-weight: 600;
}

.gs-refresh-modal__icon {
  width: 20px;
  height: 20px;
  color: var(--color-primary);
}

.gs-refresh-modal__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.gs-refresh-modal__close:hover:not(:disabled) {
  background-color: var(--color-surface-hover);
  color: var(--color-text);
}

.gs-refresh-modal__close:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.gs-refresh-modal__close svg {
  width: 20px;
  height: 20px;
}

.gs-refresh-modal__controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.gs-refresh-modal__count {
  margin-left: auto;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.gs-refresh-modal__list {
  max-height: 300px;
  overflow-y: auto;
  padding: var(--spacing-sm);
}

.gs-refresh-modal__item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.gs-refresh-modal__item:hover {
  background-color: var(--color-surface-hover);
}

.gs-refresh-modal__item--selected {
  background-color: var(--color-primary-light);
}

.gs-refresh-modal__item input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.gs-refresh-modal__item-name {
  flex: 1;
  font-size: var(--text-sm);
}

.gs-refresh-modal__item-gs {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.gs-refresh-modal__progress {
  padding: var(--spacing-md);
  background-color: var(--color-surface-hover);
  border-top: 1px solid var(--color-border);
}

.gs-refresh-modal__progress p {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--text-sm);
}

.gs-refresh-modal__progress-detail {
  color: var(--color-text-muted);
}

.gs-refresh-modal__progress-bar {
  height: 4px;
  background-color: var(--color-border);
  border-radius: 2px;
  overflow: hidden;
  margin-top: var(--spacing-sm);
}

.gs-refresh-modal__progress-fill {
  height: 100%;
  background-color: var(--color-primary);
  transition: width var(--transition-fast);
}

.gs-refresh-modal__results {
  padding: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

.gs-refresh-modal__results p {
  margin: 0;
  font-size: var(--text-sm);
}

.gs-refresh-modal__results-success {
  color: var(--color-success);
}

.gs-refresh-modal__results-failed {
  color: var(--color-danger);
}

.gs-refresh-modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}
</style>