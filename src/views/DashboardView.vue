<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCharactersStore } from '@/stores/characters'
import { useSettingsStore } from '@/stores/settings'
import { useModalManager } from '@/composables/useModalManager'
import { useModalCloseGuard } from '@/composables/useModalCloseGuard'
import CharacterList from '@/components/organisms/CharacterList.vue'
import CharacterForm from '@/components/organisms/CharacterForm.vue'
import RaidAssignmentModal from '@/components/organisms/RaidAssignmentModal.vue'
import GoldProgress from '@/components/molecules/GoldProgress.vue'
import ViewModeToggle from '@/components/molecules/ViewModeToggle.vue'

const charactersStore = useCharactersStore()
const settingsStore = useSettingsStore()

// Editing state
const isEditingMode = ref(false)

// Modal manager
const {
  showCharacterForm,
  editingCharacter,
  showRaidModal,
  selectedCharacter,
  openCharacterForm,
  closeCharacterForm,
  submitCharacterForm,
  openRaidModal,
  closeRaidModal,
} = useModalManager()

// Modal close guard
const { onOverlayClick: onCharacterFormClick } = useModalCloseGuard(closeCharacterForm)

// Computed
const existingNames = computed(() => charactersStore.characters.map(c => c.name))

// Handlers
function handleAddCharacter() {
  openCharacterForm()
}

function handleEditCharacter(id: string) {
  const character = charactersStore.getCharacterById(id)
  if (character) {
    openCharacterForm(character)
  }
}

function handleDeleteCharacter(id: string) {
  if (confirm('Удалить персонажа и все его рейды?')) {
    charactersStore.deleteCharacter(id)
  }
}

function handleAddRaid(characterId: string) {
  const character = charactersStore.getCharacterById(characterId)
  if (character) {
    openRaidModal(character)
  }
}

function handleToggleRaid(raidId: string) {
  charactersStore.toggleRaidCompleted(raidId)
}

function handleRemoveRaid(raidId: string) {
  charactersStore.deleteCharacterRaid(raidId)
}

function handleToggleGoldRecipient(characterId: string) {
  charactersStore.toggleGoldRecipient(characterId)
}

function handleResetAllRaids() {
  if (confirm('Сбросить все чек-боксы рейдов? Все отмеченные рейды будут сняты.')) {
    charactersStore.resetAllRaidsCompleted()
  }
}
</script>

<template>
  <div class="dashboard-view">
    <div class="dashboard-view__header" :class="{ 'dashboard-view__header--sticky': isEditingMode }">
      <h1>Персонажи ({{ charactersStore.characters.length }})</h1>
      <div class="dashboard-view__header-actions">
        <ViewModeToggle v-model="settingsStore.viewMode" />
        <button
          class="dashboard-view__reset-toggle"
          @click="handleResetAllRaids"
        >
          Недельный сброс
        </button>
        <button
          class="dashboard-view__edit-toggle"
          :class="{ 'dashboard-view__edit-toggle--active': isEditingMode }"
          @click="isEditingMode = !isEditingMode"
        >
          {{ isEditingMode ? '✓ Режим редактирования' : 'Режим редактирования' }}
        </button>
        <button
          class="dashboard-view__add-toggle"
          @click="handleAddCharacter"
        >
          + Добавить персонажа
        </button>
      </div>
    </div>

    <GoldProgress />

    <CharacterList
      :characters="charactersStore.sortedCharacters"
      :editing="isEditingMode"
      :view-mode="settingsStore.viewMode"
      @add-character="handleAddCharacter"
      @edit-character="handleEditCharacter"
      @delete-character="handleDeleteCharacter"
      @add-raid="handleAddRaid"
      @toggle-raid="handleToggleRaid"
      @remove-raid="handleRemoveRaid"
      @toggle-gold-recipient="handleToggleGoldRecipient"
    />

    <!-- Character Form Modal -->
    <Teleport to="body">
      <div v-if="showCharacterForm" class="modal-overlay">
        <!-- Clickable background layer -->
        <div class="modal-backdrop" @click="onCharacterFormClick" />
        <div class="modal-content">
          <CharacterForm
            :character="editingCharacter"
            :existing-names="existingNames"
            @submit="submitCharacterForm"
            @cancel="closeCharacterForm"
          />
        </div>
      </div>
    </Teleport>

    <!-- Raid Assignment Modal -->
    <RaidAssignmentModal
      v-if="showRaidModal"
      :character="selectedCharacter"
      @close="closeRaidModal"
    />
  </div>
</template>

<style scoped>
.dashboard-view {
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-view__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-sm);
  padding-bottom: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.dashboard-view__header--sticky {
  position: sticky;
  top: 72px;
  z-index: 50;
  background-color: var(--color-bg);
  box-shadow: 0 0 0 1px var(--color-bg);
}

.dashboard-view__header h1 {
  font-size: var(--text-2xl);
  font-weight: 700;
}

.dashboard-view__edit-toggle {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.dashboard-view__edit-toggle:hover {
  background-color: var(--color-surface-hover);
}

.dashboard-view__edit-toggle--active {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.dashboard-view__add-toggle {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-primary);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-md);
  color: white;
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.dashboard-view__add-toggle:hover {
  background-color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

.dashboard-view__header-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.dashboard-view__reset-toggle {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.dashboard-view__reset-toggle:hover {
  background-color: var(--color-surface-hover);
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-md);
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: relative;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp var(--transition-normal) ease-out;
  z-index: 1;
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
</style>