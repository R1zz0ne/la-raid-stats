<script setup lang="ts">
/**
 * RaidDifficultyChip
 * 
 * Compact chip component for displaying a single raid difficulty option.
 * Features:
 * - Compact layout with badge, gear score, and gold info
 * - Click/tap interaction with visual feedback
 * - Hover and focus states for accessibility
 * - Keyboard navigation support (Tab + Enter)
 */
import { computed } from 'vue'
import type { Difficulty } from '@/types'
import DifficultyBadge from '@/components/molecules/DifficultyBadge.vue'

const props = defineProps<{
  difficulty: Difficulty
  isSelected: boolean
}>()

const emit = defineEmits<{
  select: []
}>()

// Total gold display
const totalGold = computed(() => {
  return props.difficulty.regularGold + props.difficulty.limitedGold
})

// Compact gold display
const goldDisplay = computed(() => {
  if (totalGold.value === 0) return null
  
  const parts: string[] = []
  if (props.difficulty.regularGold > 0) {
    parts.push(`${props.difficulty.regularGold}`)
  }
  if (props.difficulty.limitedGold > 0) {
    parts.push(`✨${props.difficulty.limitedGold}`)
  }
  return parts.join(' ')
})

// Tooltip text for hover
const tooltipText = computed(() => {
  const parts = [`ГС: ${props.difficulty.requiredGearScore}`]
  if (props.difficulty.regularGold > 0) {
    parts.push(`Обычное золото: ${props.difficulty.regularGold}`)
  }
  if (props.difficulty.limitedGold > 0) {
    parts.push(`Лимитированное золото: ${props.difficulty.limitedGold}`)
  }
  return parts.join('\n')
})

function handleClick() {
  emit('select')
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    emit('select')
  }
}
</script>

<template>
  <button
    type="button"
    class="difficulty-chip"
    :class="{ 'difficulty-chip--selected': isSelected }"
    :aria-pressed="isSelected"
    :title="tooltipText"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <DifficultyBadge :type="difficulty.type" />
    
    <span class="difficulty-chip__gs">
      {{ difficulty.requiredGearScore.toLocaleString('ru-RU') }}
    </span>
    
    <span v-if="goldDisplay" class="difficulty-chip__gold">
      {{ goldDisplay }}
    </span>
  </button>
</template>

<style scoped>
.difficulty-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--color-surface-hover);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: 
    transform var(--transition-fast),
    background-color var(--transition-fast),
    border-color var(--transition-fast),
    box-shadow var(--transition-fast);
  font-family: inherit;
  font-size: var(--text-xs);
  color: var(--color-text);
  line-height: 1;
}

.difficulty-chip:hover {
  transform: scale(0.97);
  background-color: var(--color-primary-light);
  border-color: var(--color-primary);
}

.difficulty-chip:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.difficulty-chip:active {
  transform: scale(0.94);
}

.difficulty-chip--selected {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  box-shadow: 0 2px 8px rgba(var(--color-primary-rgb), 0.3);
}

.difficulty-chip--selected:hover {
  background-color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
  transform: scale(0.97);
}

.difficulty-chip--selected:focus-visible {
  outline-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.difficulty-chip--selected .difficulty-chip__gs,
.difficulty-chip--selected .difficulty-chip__gold {
  color: white;
}

.difficulty-chip__gs {
  color: var(--color-text-muted);
  font-weight: 500;
}

.difficulty-chip__gold {
  color: var(--color-warning);
  font-weight: 600;
  margin-left: var(--spacing-xs);
}
</style>