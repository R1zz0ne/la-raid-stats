<script setup lang="ts">
/**
 * BaseRadioGroup
 *
 * Radio button group with optional descriptions.
 */
import type { SelectOption } from '@/types'

const model = defineModel<string>({ required: true })

const props = defineProps<{
  options: (SelectOption<string> & { description?: string })[]
  disabled?: boolean
}>()

function handleChange(value: string) {
  model.value = value
}
</script>

<template>
  <div
    class="base-radio-group"
    :class="{ 'base-radio-group--disabled': disabled }"
    role="radiogroup"
  >
    <label
      v-for="option in options"
      :key="option.value"
      class="base-radio-group__option"
      :class="{ 'base-radio-group__option--selected': model === option.value }"
    >
      <input
        type="radio"
        :name="option.value"
        :value="option.value"
        :checked="model === option.value"
        :disabled="disabled"
        class="base-radio-group__input"
        @change="handleChange(option.value)"
      />
      <span class="base-radio-group__radio" />
      <span class="base-radio-group__content">
        <span class="base-radio-group__label">{{ option.label }}</span>
        <span v-if="option.description" class="base-radio-group__description">
          {{ option.description }}
        </span>
      </span>
    </label>
  </div>
</template>

<style scoped>
.base-radio-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.base-radio-group--disabled {
  opacity: 0.5;
  pointer-events: none;
}

.base-radio-group__option {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: border-color var(--transition-fast), background-color var(--transition-fast);
}

.base-radio-group__option:hover {
  border-color: var(--color-border-focus);
}

.base-radio-group__option--selected {
  border-color: var(--color-primary);
  background-color: var(--color-primary-light);
}

.base-radio-group__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.base-radio-group__radio {
  position: relative;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  margin-top: 2px;
  border: 2px solid var(--color-border);
  border-radius: 50%;
  background-color: var(--color-surface);
  transition: border-color var(--transition-fast);
}

.base-radio-group__option--selected .base-radio-group__radio {
  border-color: var(--color-primary);
}

.base-radio-group__radio::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--color-primary);
  transform: translate(-50%, -50%) scale(0);
  transition: transform var(--transition-fast);
}

.base-radio-group__option--selected .base-radio-group__radio::after {
  transform: translate(-50%, -50%) scale(1);
}

.base-radio-group__content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.base-radio-group__label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text);
}

.base-radio-group__description {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  line-height: 1.4;
}
</style>