<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Character, CharacterFormData } from '@/types'
import { useCharactersStore } from '@/stores/characters'
import { useModalCloseGuard } from '@/composables/useModalCloseGuard'
import CharacterList from '@/components/organisms/CharacterList.vue'
import CharacterForm from '@/components/organisms/CharacterForm.vue'
import RaidAssignmentModal from '@/components/organisms/RaidAssignmentModal.vue'
import GoldProgress from '@/components/molecules/GoldProgress.vue'

const charactersStore = useCharactersStore()

// Editing state
const isEditingMode = ref(false)
const showCharacterForm = ref(false)
const editingCharacter = ref<Character | undefined>()

// Raid assignment state
const showRaidModal = ref(false)
const selectedCharacter = ref<Character | null>(null)

// Modal close guard to prevent closing when selecting text
const { onOverlayClick: onCharacterFormClick } = useModalCloseGuard(handleCancelForm)

// Lock body scroll when any modal is open
watch([showCharacterForm, showRaidModal], ([formOpen, raidOpen]) => {
  if (formOpen || raidOpen) {
    document.body.classList.add('body-no-scroll')
  } else {
    document.body.classList.remove('body-no-scroll')
  }
}, { immediate: true })

// Handlers
const existingNames = computed(() => charactersStore.characters.map(c => c.name))

function handleAddCharacter() {
  editingCharacter.value = undefined
  showCharacterForm.value = true
}

function handleEditCharacter(id: string) {
  editingCharacter.value = charactersStore.getCharacterById(id)
  showCharacterForm.value = true
}

function handleDeleteCharacter(id: string) {
  if (confirm('Удалить персонажа и все его рейды?')) {
    charactersStore.deleteCharacter(id)
  }
}

function handleSubmitCharacter(data: CharacterFormData) {
  if (editingCharacter.value) {
    charactersStore.updateCharacter(editingCharacter.value.id, {
      gearScore: data.gearScore,
      characterClass: data.characterClass,
      customClassName: data.customClassName,
    })
  } else {
    charactersStore.addCharacter(data)
  }

  showCharacterForm.value = false
  editingCharacter.value = undefined
}

function handleCancelForm() {
  showCharacterForm.value = false
  editingCharacter.value = undefined
}

function handleAddRaid(characterId: string) {
  const character = charactersStore.getCharacterById(characterId)
  if (character) {
    selectedCharacter.value = character
    showRaidModal.value = true
  }
}

function handleCloseRaidModal() {
  showRaidModal.value = false
  selectedCharacter.value = null
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
    <div class="dashboard-view__header">
      <h1>Персонажи ({{ charactersStore.characters.length }})</h1>
      <div class="dashboard-view__header-actions">
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
          {{ isEditingMode ? '✓ Режим редактирования' : 'Редактировать порядок' }}
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
            :existing-names="editingCharacter ? [] : existingNames"
            @submit="handleSubmitCharacter"
            @cancel="handleCancelForm"
          />
        </div>
      </div>
    </Teleport>

    <!-- Raid Assignment Modal -->
    <RaidAssignmentModal
      v-if="showRaidModal"
      :character="selectedCharacter"
      @close="handleCloseRaidModal"
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
  margin-bottom: var(--spacing-lg);
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