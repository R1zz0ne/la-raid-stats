<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCharactersStore } from '@/stores/characters'
import { useSettingsStore } from '@/stores/settings'
import { useModalManager } from '@/composables/useModalManager'
import { useModalCloseGuard } from '@/composables/useModalCloseGuard'
import { setToastAPI, useGearScoreRefresh } from '@/composables/useGearScoreRefresh'
import CharacterList from '@/components/organisms/CharacterList.vue'
import CharacterForm from '@/components/organisms/CharacterForm.vue'
import RaidAssignmentModal from '@/components/organisms/RaidAssignmentModal.vue'
import ImportFromArmoryModal from '@/components/organisms/ImportFromArmoryModal.vue'
import GearScoreRefreshModal from '@/components/organisms/GearScoreRefreshModal.vue'
import ToastContainer from '@/components/molecules/ToastContainer.vue'
import GoldProgress from '@/components/molecules/GoldProgress.vue'
import ViewModeToggle from '@/components/molecules/ViewModeToggle.vue'

const charactersStore = useCharactersStore()
const settingsStore = useSettingsStore()

// Toast ref
const toastRef = ref<InstanceType<typeof ToastContainer> | null>(null)

// Initialize toast API
onMounted(() => {
  if (toastRef.value) {
    setToastAPI(toastRef.value)
  }
})

// Editing state
const isEditingMode = ref(false)

// Gear score refresh state
const { isRefreshing: isGsRefreshing } = useGearScoreRefresh()

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

// Import from armory modal state
const showImportModal = ref(false)

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

// Gear score refresh modal
const showGearScoreRefreshModal = ref(false)

function openGearScoreRefreshModal() {
  showGearScoreRefreshModal.value = true
}

function closeGearScoreRefreshModal() {
  showGearScoreRefreshModal.value = false
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
          v-if="isEditingMode"
          class="dashboard-view__import-toggle"
          @click="showImportModal = true"
        >
          <svg class="dashboard-view__import-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Импорт из Оружейной
          <span class="dashboard-view__beta-badge">Бета</span>
        </button>
        <button
          v-if="!isEditingMode"
          class="dashboard-view__gs-refresh-toggle"
          :disabled="isGsRefreshing"
          @click="openGearScoreRefreshModal"
        >
          <svg class="dashboard-view__gs-refresh-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          Обновить ГС
          <span class="dashboard-view__beta-badge">Бета</span>
        </button>
        <button
          class="dashboard-view__reset-toggle"
          @click="handleResetAllRaids"
        >
          Недельный сброс
        </button>
        <button
          v-if="isEditingMode"
          class="dashboard-view__add-toggle"
          @click="handleAddCharacter"
        >
          Добавить персонажа
        </button>
        <button
          class="dashboard-view__edit-toggle"
          :class="{ 'dashboard-view__edit-toggle--active': isEditingMode }"
          @click="isEditingMode = !isEditingMode"
        >
          {{ isEditingMode ? '✓ Режим редактирования' : 'Режим редактирования' }}
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

    <!-- Import From Armory Modal -->
    <ImportFromArmoryModal
      v-if="showImportModal"
      :existing-names="existingNames"
      @close="showImportModal = false"
      @imported="() => { showImportModal = false }"
    />

    <!-- Gear Score Refresh Modal -->
    <GearScoreRefreshModal
      v-if="showGearScoreRefreshModal"
      @close="closeGearScoreRefreshModal"
    />

    <!-- Toast notifications -->
    <ToastContainer ref="toastRef" />
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
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.dashboard-view__add-toggle:hover {
  background-color: var(--color-surface-hover);
}

.dashboard-view__import-toggle {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.dashboard-view__import-toggle:hover {
  background-color: var(--color-surface-hover);
}

.dashboard-view__import-icon {
  width: 16px;
  height: 16px;
}

.dashboard-view__gs-refresh-toggle {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.dashboard-view__gs-refresh-toggle:hover:not(:disabled) {
  background-color: var(--color-surface-hover);
}

.dashboard-view__gs-refresh-toggle:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.dashboard-view__gs-refresh-icon {
  width: 16px;
  height: 16px;
}

.dashboard-view__beta-badge {
  position: absolute;
  top: -8px;
  right: 12px;
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  background-color: var(--color-warning);
  color: var(--color-bg);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border-radius: 4px;
  line-height: 1.2;
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