<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Raid, DifficultyFormData } from '@/types'
import { useRaidsStore } from '@/stores/raids'
import { useModalCloseGuard } from '@/composables/useModalCloseGuard'
import RaidCard from '@/components/organisms/RaidCard.vue'
import RaidForm from '@/components/organisms/RaidForm.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'

const raidsStore = useRaidsStore()

// Editing mode state
const isEditingMode = ref(false)

// Form state
const showRaidForm = ref(false)
const editingRaid = ref<Raid | undefined>()

// Lock body scroll when modal is open
watch(showRaidForm, (isOpen) => {
  if (isOpen) {
    document.body.classList.add('body-no-scroll')
  } else {
    document.body.classList.remove('body-no-scroll')
  }
}, { immediate: true })

// Modal close guard to prevent closing when selecting text
const { onOverlayClick: onRaidFormClick } = useModalCloseGuard(handleCancelForm)



// Reset to default config
function handleResetToDefault() {
  if (confirm('Сбросить все рейды к стандартному конфигу? Все изменения будут потеряны.')) {
    raidsStore.resetToDefault()
  }
}

// Handlers
function handleAddRaid() {
  editingRaid.value = undefined
  showRaidForm.value = true
}

function handleEditRaid(id: string) {
  editingRaid.value = raidsStore.getRaidById(id)
  showRaidForm.value = true
}

function handleDeleteRaid(id: string) {
  if (confirm('Удалить рейд? Все связанные назначения также будут удалены.')) {
    raidsStore.deleteRaid(id)
  }
}

function handleSubmitRaid(data: { name: string; difficulties: DifficultyFormData[] }) {
  if (editingRaid.value) {
    raidsStore.updateRaid(editingRaid.value.id, {
      name: data.name,
      difficulties: data.difficulties,
    })
  } else {
    raidsStore.addRaid({
      name: data.name,
      difficulties: data.difficulties,
    })
  }

  showRaidForm.value = false
  editingRaid.value = undefined
}

function handleCancelForm() {
  showRaidForm.value = false
  editingRaid.value = undefined
}
</script>

<template>
  <div class="raid-library-view">
    <div class="raid-library-view__header" :class="{ 'raid-library-view__header--sticky': isEditingMode }">
      <div class="raid-library-view__header-left">
        <h1>Библиотека рейдов</h1>
        <BaseButton variant="secondary" @click="handleResetToDefault">
          Сбросить к стандартным
        </BaseButton>
      </div>
      <div class="raid-library-view__header-right">
        <button
          class="raid-library-view__edit-toggle"
          :class="{ 'raid-library-view__edit-toggle--active': isEditingMode }"
          @click="isEditingMode = !isEditingMode"
        >
          {{ isEditingMode ? '✓ Режим редактирования' : 'Режим редактирования' }}
        </button>
        <BaseButton variant="primary" @click="handleAddRaid">
          Добавить рейд
        </BaseButton>
      </div>
    </div>

    <div v-if="raidsStore.raids.length > 0" class="raid-library-view__grid">
      <RaidCard
        v-for="raid in [...raidsStore.raids].reverse()"
        :key="raid.id"
        :raid="raid"
        :editing="isEditingMode"
        @edit="handleEditRaid"
        @delete="handleDeleteRaid"
      />
    </div>

    <div v-else class="raid-library-view__empty">
      <p>Нет рейдов. Добавьте первый!</p>
      <BaseButton variant="primary" @click="handleAddRaid">
        Добавить рейд
      </BaseButton>
    </div>

    <!-- Raid Form Modal -->
    <Teleport to="body">
      <div v-if="showRaidForm" class="modal-overlay">
        <div class="modal-backdrop" @click="onRaidFormClick" />
        <div class="modal-content modal-content--large">
          <RaidForm
            :raid="editingRaid"
            @submit="handleSubmitRaid"
            @cancel="handleCancelForm"
          />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.raid-library-view {
  max-width: 1200px;
  margin: 0 auto;
}

.raid-library-view__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  gap: var(--spacing-md);
}

.raid-library-view__header--sticky {
  position: sticky;
  top: 72px;
  z-index: 50;
  background-color: var(--color-bg);
  box-shadow: 0 0 0 1px var(--color-bg);
}

.raid-library-view__header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.raid-library-view__header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) 0;
}

.raid-library-view__edit-toggle {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.raid-library-view__edit-toggle:hover {
  background-color: var(--color-surface-hover);
}

.raid-library-view__edit-toggle--active {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.raid-library-view__header h1 {
  font-size: var(--text-2xl);
  font-weight: 700;
}

@media (max-width: 640px) {
  .raid-library-view__header-left {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
}

.raid-library-view__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-md);
}

.raid-library-view__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  padding: var(--spacing-2xl);
  background-color: var(--color-surface);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  text-align: center;
}

.raid-library-view__empty p {
  font-size: var(--text-lg);
  color: var(--color-text-muted);
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

.modal-content--large {
  max-width: 700px;
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

@media (max-width: 640px) {
  .raid-library-view__grid {
    grid-template-columns: 1fr;
  }
}
</style>