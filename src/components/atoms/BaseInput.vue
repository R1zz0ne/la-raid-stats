<script setup lang="ts">
import { watch } from 'vue'

const model = defineModel<string>({ required: true })

const props = defineProps<{
  type?: 'text' | 'number' | 'password' | 'email'
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
  id?: string
  min?: number | string
}>()

const emit = defineEmits<{
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

// Prevent negative values for number inputs
watch(model, (newValue) => {
  if (props.type === 'number' && props.min !== undefined) {
    const minValue = typeof props.min === 'string' ? Number(props.min) : props.min
    const numValue = Number(newValue)
    if (!isNaN(numValue) && numValue < minValue) {
      model.value = String(minValue)
    }
  }
})
</script>

<template>
  <div class="base-input" :class="{ 'base-input--error': error, 'base-input--disabled': disabled }">
    <label v-if="label" :for="id" class="base-input__label">
      {{ label }}
    </label>
    <div class="base-input__wrapper">
      <input
        :id="id"
        v-model="model"
        class="base-input__field"
        :type="type ?? 'text'"
        :placeholder="placeholder"
        :disabled="disabled"
        :data-testid="`input-${id}`"
        @blur="emit('blur', $event)"
        @focus="emit('focus', $event)"
      />
    </div>
    <div v-if="error" class="base-input__error">
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
.base-input {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.base-input__label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text);
}

.base-input__wrapper {
  position: relative;
}

.base-input__field {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: var(--text-base);
  color: var(--color-text);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.base-input__field::placeholder {
  color: var(--color-text-muted);
}

.base-input__field:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.base-input--error .base-input__field {
  border-color: var(--color-danger);
}

.base-input--error .base-input__field:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}

.base-input--disabled .base-input__field {
  opacity: 0.5;
  cursor: not-allowed;
}

.base-input__error {
  font-size: var(--text-sm);
  color: var(--color-danger);
}
</style>