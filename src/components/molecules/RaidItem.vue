<script setup lang="ts">
import { computed } from 'vue'
import type { Raid, DifficultyType } from '@/types'
import BaseCheckbox from '@/components/atoms/BaseCheckbox.vue'
import DifficultyBadge from '@/components/molecules/DifficultyBadge.vue'

const props = defineProps<{
  raid: Raid
  difficultyType: DifficultyType
  isCompleted: boolean
  disabled?: boolean
  disabledReason?: string
  editing?: boolean
}>()

const emit = defineEmits<{
  toggle: []
  remove: []
}>()

const difficulty = computed(() => {
  return props.raid.difficulties.find(d => d.type === props.difficultyType)
})
</script>

<template>
  <div
    class="raid-item"
    :class="{ 'raid-item--completed': isCompleted, 'raid-item--disabled': disabled }"
  >
    <BaseCheckbox
      :model-value="isCompleted"
      :disabled="disabled"
      @update:model-value="emit('toggle')"
    />

    <div class="raid-item__info">
      <span class="raid-item__name">{{ raid.name }}</span>
      <DifficultyBadge :type="difficultyType" />
    </div>

    <div v-if="difficulty" class="raid-item__gold">
      <span v-if="difficulty.regularGold > 0" class="raid-item__gold-item">
        💰 {{ difficulty.regularGold }}
      </span>
      <span v-if="difficulty.limitedGold > 0" class="raid-item__gold-item">
        ✨ {{ difficulty.limitedGold }}
      </span>
    </div>

    <button
      v-if="editing"
      type="button"
      class="raid-item__remove"
      aria-label="Удалить рейд"
      @click="emit('remove')"
    >
      ✕
    </button>
  </div>
</template>

<style scoped>
.raid-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.raid-item--completed {
  opacity: 0.8;
  background-color: var(--color-surface-hover);
}

.raid-item--disabled {
  opacity: 0.6;
}

.raid-item__info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex: 1;
  min-width: 0;
}

.raid-item__name {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.raid-item__gold {
  display: flex;
  gap: var(--spacing-sm);
  flex-shrink: 0;
}

.raid-item__gold-item {
  font-size: var(--text-xs);
  color: var(--color-warning);
  font-weight: 500;
}

.raid-item__remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: var(--radius-sm);
  background-color: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.raid-item__remove:hover:not(:disabled) {
  background-color: var(--color-danger);
  color: white;
}

.raid-item__remove:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* Compact checkbox for raid items */
.raid-item :deep(.base-checkbox__box) {
  width: 16px;
  height: 16px;
}

.raid-item :deep(.base-checkbox__check) {
  width: 10px;
  height: 10px;
}

/* Compact difficulty badge */
.raid-item :deep(.difficulty-badge) {
  padding: 2px 6px;
  font-size: 10px;
  min-height: 16px;
}
</style>