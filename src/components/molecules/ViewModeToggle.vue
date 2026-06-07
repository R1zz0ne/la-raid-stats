<script setup lang="ts">
import type { ViewMode } from '@/types'

const model = defineModel<ViewMode>({ required: true })

const modes: { value: ViewMode; label: string; icon: string }[] = [
  { value: 'cards', label: 'Карточки', icon: '▦' },
  { value: 'table', label: 'Таблица', icon: '☰' },
]
</script>

<template>
  <div class="view-mode-toggle" role="group" aria-label="Вид отображения">
    <button
      v-for="mode in modes"
      :key="mode.value"
      type="button"
      class="view-mode-toggle__btn"
      :class="{ 'view-mode-toggle__btn--active': model === mode.value }"
      :aria-pressed="model === mode.value"
      :title="mode.label"
      @click="model = mode.value"
    >
      <span class="view-mode-toggle__icon">{{ mode.icon }}</span>
    </button>
  </div>
</template>

<style scoped>
.view-mode-toggle {
  display: flex;
  gap: 2px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 2px;
}

.view-mode-toggle__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 32px;
  border: none;
  border-radius: calc(var(--radius-md) - 2px);
  background-color: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.view-mode-toggle__btn:hover:not(.view-mode-toggle__btn--active) {
  background-color: var(--color-surface-hover);
  color: var(--color-text);
}

.view-mode-toggle__btn--active {
  background-color: var(--color-primary);
  color: white;
}

.view-mode-toggle__icon {
  font-size: var(--text-base);
  line-height: 1;
}
</style>