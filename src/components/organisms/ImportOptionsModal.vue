<script setup lang="ts">
/**
 * ImportOptionsModal
 *
 * Modal for selecting import scope after file selection.
 * Displays available data types and confirms import action.
 */
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useModalCloseGuard } from '@/composables/useModalCloseGuard'
import type { ImportScope } from '@/types'
import BaseButton from '@/components/atoms/BaseButton.vue'
import BaseRadioGroup from '@/components/atoms/BaseRadioGroup.vue'

const props = defineProps<{
  characterCount: number
  raidCount: number
}>()

const emit = defineEmits<{
  close: []
  confirm: [scope: ImportScope]
}>()

// Modal close guard
const { onOverlayClick } = useModalCloseGuard(() => emit('close'))

// Lock body scroll
onMounted(() => {
  document.body.classList.add('body-no-scroll')
})

onUnmounted(() => {
  document.body.classList.remove('body-no-scroll')
})

// Import scope options
const scopeOptions = [
  {
    value: 'all' as ImportScope,
    label: 'Все данные',
    description: `Импортировать ${props.characterCount} персонажей и ${props.raidCount} рейдов`,
  },
  {
    value: 'raids' as ImportScope,
    label: 'Только рейды',
    description: `Импортировать ${props.raidCount} рейдов`,
  },
  {
    value: 'characters' as ImportScope,
    label: 'Только персонажей',
    description: `Импортировать ${props.characterCount} персонажей`,
  },
]

const selectedScope = ref<ImportScope>('all')

const selectedOption = computed(() =>
  scopeOptions.find(opt => opt.value === selectedScope.value)
)

function handleConfirm() {
  emit('confirm', selectedScope.value)
}

function handleClose() {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay" @click="onOverlayClick">
      <div class="modal-content" @click.stop>
        <div class="import-modal">
          <header class="import-modal__header">
            <h3 class="import-modal__title">Выберите что импортировать</h3>
          </header>

          <div class="import-modal__options">
            <BaseRadioGroup
              v-model="selectedScope"
              :options="scopeOptions.map(opt => ({
                value: opt.value,
                label: opt.label,
                description: opt.description,
              }))"
            />
          </div>

          <footer class="import-modal__actions">
            <BaseButton
              variant="secondary"
              @click="handleClose"
            >
              Отмена
            </BaseButton>
            <BaseButton
              variant="primary"
              @click="handleConfirm"
            >
              Импортировать
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-md);
}

.modal-content {
  width: 100%;
  max-width: 400px;
  animation: slideUp var(--transition-normal) ease-out;
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
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.import-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.import-modal__title {
  font-size: var(--text-base);
  font-weight: 600;
  margin: 0;
}

.import-modal__options {
  padding: var(--spacing-sm) 0;
}

.import-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--color-border);
}
</style>