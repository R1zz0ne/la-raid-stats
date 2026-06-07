<script setup lang="ts">
import { computed } from 'vue'
import type { DifficultyType } from '@/types'
import { getDifficultyConfig } from '@/constants/difficultyTypes'

const props = defineProps<{
  type: DifficultyType
}>()

const config = computed(() => getDifficultyConfig(props.type))

const badgeStyle = computed(() => {
  switch (props.type) {
    case 'solo':
      return {
        '--badge-bg': 'var(--color-difficulty-solo-bg)',
        '--badge-text': 'var(--color-difficulty-solo-text)',
      }
    case 'normal':
      return {
        '--badge-bg': 'var(--color-difficulty-normal-bg)',
        '--badge-text': 'var(--color-difficulty-normal-text)',
      }
    case 'heroic':
      return {
        '--badge-bg': 'var(--color-difficulty-heroic-bg)',
        '--badge-text': 'var(--color-difficulty-heroic-text)',
      }
    case 'nightmare':
      return {
        '--badge-bg': 'var(--color-difficulty-nightmare-bg)',
        '--badge-text': 'var(--color-difficulty-nightmare-text)',
      }
    default:
      return {
        '--badge-bg': 'var(--color-secondary)',
        '--badge-text': '#ffffff',
      }
  }
})
</script>

<template>
  <span
    class="difficulty-badge"
    :style="badgeStyle"
  >
    {{ config?.label ?? type }}
  </span>
</template>

<style scoped>
.difficulty-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3px var(--spacing-sm);
  background-color: var(--badge-bg);
  color: var(--badge-text);
  font-size: var(--text-xs);
  font-weight: 600;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1.2;
  min-height: 18px;
  box-sizing: border-box;
  text-align: center;
}
</style>