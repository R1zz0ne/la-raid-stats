<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import type { SelectOption } from '@/types'

const model = defineModel<string | number | null>({ required: true })

const props = defineProps<{
  options: SelectOption[]
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
  id?: string
  searchable?: boolean
}>()

const emit = defineEmits<{
  change: [value: string | number]
}>()

const searchQuery = ref('')
const isOpen = ref(false)
const searchRef = ref<HTMLInputElement | null>(null)
const dropdownStyle = ref<Record<string, string>>({})

// Display text in input: selected value when closed, search query when open
const displayText = computed(() => {
  if (isOpen.value) {
    return searchQuery.value
  }
  // Show selected label when closed
  const selected = props.options.find(o => o.value === model.value)
  if (selected && selected.value !== '') {
    return selected.label
  }
  return ''
})

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options
  const query = searchQuery.value.toLowerCase()
  return props.options.filter(opt =>
    opt.label.toLowerCase().includes(query)
  )
})

function updateDropdownPosition() {
  if (!searchRef.value) return

  const rect = searchRef.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight

  // Calculate available space below and above
  const spaceBelow = viewportHeight - rect.bottom
  const spaceAbove = rect.top

  // Dropdown height (max 200px, or available space)
  const dropdownHeight = Math.min(200, Math.max(spaceBelow - 16, spaceAbove - 16, 100))

  if (spaceBelow > 200 + 16 || spaceBelow > spaceAbove) {
    // Position below
    dropdownStyle.value = {
      position: 'fixed',
      top: `${rect.bottom + 4}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      maxHeight: `${dropdownHeight}px`,
    }
  } else {
    // Position above
    dropdownStyle.value = {
      position: 'fixed',
      bottom: `${viewportHeight - rect.top + 4}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      maxHeight: `${dropdownHeight}px`,
    }
  }
}

function handleFocus() {
  if (props.searchable) {
    isOpen.value = true
    searchQuery.value = ''
    nextTick(updateDropdownPosition)
  }
}

function handleBlur() {
  // Delay to allow click on option
  setTimeout(() => {
    isOpen.value = false
    searchQuery.value = ''
  }, 200)
}

function selectOption(option: SelectOption) {
  model.value = option.value
  emit('change', option.value)
  isOpen.value = false
  searchQuery.value = ''
}

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const value = target.value
  emit('change', value)
}

// Listen for scroll/resize events to update position
onMounted(() => {
  document.addEventListener('scroll', updateDropdownPosition, true)
  window.addEventListener('resize', updateDropdownPosition)
})

onUnmounted(() => {
  document.removeEventListener('scroll', updateDropdownPosition, true)
  window.removeEventListener('resize', updateDropdownPosition)
})
</script>

<template>
  <div
    class="base-select"
    :class="{ 'base-select--error': error, 'base-select--disabled': disabled }"
  >
    <label v-if="label" :for="id" class="base-select__label">
      {{ label }}
    </label>

    <div class="base-select__wrapper">
      <!-- Searchable select -->
      <template v-if="searchable">
        <input
          :id="id"
          ref="searchRef"
          :value="displayText"
          class="base-select__search"
          :placeholder="placeholder"
          :disabled="disabled"
          autocomplete="off"
          @input="searchQuery = ($event.target as HTMLInputElement).value"
          @focus="handleFocus"
          @blur="handleBlur"
          @keydown.escape="isOpen = false"
        />
        <div
          v-if="isOpen && filteredOptions.length > 0"
          class="base-select__dropdown"
          :style="dropdownStyle"
        >
          <button
            v-for="option in filteredOptions"
            :key="option.value"
            type="button"
            class="base-select__option"
            :class="{ 'base-select__option--selected': model === option.value }"
            @click="selectOption(option)"
          >
            {{ option.label }}
          </button>
        </div>
        <div
          v-else-if="isOpen && filteredOptions.length === 0"
          class="base-select__dropdown"
          :style="dropdownStyle"
        >
          <div class="base-select__empty">Ничего не найдено</div>
        </div>
      </template>

      <!-- Regular select -->
      <select
        v-else
        :id="id"
        v-model="model"
        class="base-select__field"
        :disabled="disabled"
        @change="handleChange"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </div>

    <div v-if="error" class="base-select__error">
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
.base-select {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  position: relative;
}

.base-select__label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text);
}

.base-select__wrapper {
  position: relative;
}

/* Regular select */
.base-select__field {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: var(--text-base);
  color: var(--color-text);
  cursor: pointer;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M2 4l4 4 4-4'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--spacing-md) center;
  padding-right: calc(var(--spacing-md) * 2 + 12px);
}

.base-select__field:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

/* Searchable input */
.base-select__search {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: var(--text-base);
  color: var(--color-text);
  cursor: text;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.base-select__search::placeholder {
  color: var(--color-text-muted);
}

.base-select__search:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

/* Dropdown - fixed positioning for modal compatibility */
.base-select__dropdown {
  position: fixed;
  overflow-y: auto;
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 9999;
}

.base-select__option {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background: none;
  border: none;
  text-align: left;
  font-family: var(--font-sans);
  font-size: var(--text-base);
  color: var(--color-text);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.base-select__option:hover {
  background-color: var(--color-surface-hover);
}

.base-select__option--selected {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 500;
}

.base-select__empty {
  padding: var(--spacing-md);
  text-align: center;
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}

.base-select--error .base-select__field,
.base-select--error .base-select__search {
  border-color: var(--color-danger);
}

.base-select--error .base-select__field:focus,
.base-select--error .base-select__search:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}

.base-select--disabled .base-select__field,
.base-select--disabled .base-select__search {
  opacity: 0.5;
  cursor: not-allowed;
}

.base-select__error {
  font-size: var(--text-sm);
  color: var(--color-danger);
}
</style>