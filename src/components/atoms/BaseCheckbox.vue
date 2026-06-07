<script setup lang="ts">
const model = defineModel<boolean>({ required: true })

defineProps<{
  label?: string
  disabled?: boolean
  id?: string
  variant?: 'checkbox' | 'toggle'
}>()
</script>

<template>
  <label
    class="base-checkbox"
    :class="{
      'base-checkbox--disabled': disabled,
      'base-checkbox--toggle': variant === 'toggle'
    }"
  >
    <input
      :id="id"
      v-model="model"
      type="checkbox"
      class="base-checkbox__input"
      :disabled="disabled"
    />
    <span v-if="variant !== 'toggle'" class="base-checkbox__box">
      <svg class="base-checkbox__check" viewBox="0 0 12 12" fill="none">
        <path d="M2 6l3 3 5-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
    <span v-else class="base-checkbox__toggle">
      <span class="base-checkbox__toggle-thumb" />
    </span>
    <span v-if="label" class="base-checkbox__label">{{ label }}</span>
  </label>
</template>

<style scoped>
.base-checkbox {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  user-select: none;
}

.base-checkbox--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.base-checkbox__input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.base-checkbox__box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background-color: var(--color-bg);
  border: 2px solid var(--color-checkbox-border);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.base-checkbox__check {
  width: 12px;
  height: 12px;
  color: transparent;
}

.base-checkbox__input:checked + .base-checkbox__box {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.base-checkbox__input:checked + .base-checkbox__box .base-checkbox__check {
  color: white;
}

.base-checkbox__input:focus-visible + .base-checkbox__box {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}

.base-checkbox__label {
  font-size: var(--text-sm);
  color: var(--color-text);
}

/* Toggle variant */
.base-checkbox__toggle {
  display: flex;
  align-items: center;
  width: 36px;
  height: 20px;
  background-color: var(--color-checkbox-border);
  border-radius: 10px;
  transition: background-color var(--transition-fast);
  flex-shrink: 0;
}

.base-checkbox__toggle-thumb {
  width: 16px;
  height: 16px;
  background-color: white;
  border-radius: 50%;
  margin-left: 2px;
  transition: transform var(--transition-fast);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.base-checkbox__input:checked + .base-checkbox__toggle {
  background-color: var(--color-gold, #f59e0b);
}

.base-checkbox__input:checked + .base-checkbox__toggle .base-checkbox__toggle-thumb {
  transform: translateX(16px);
}

.base-checkbox__input:focus-visible + .base-checkbox__toggle {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}
</style>