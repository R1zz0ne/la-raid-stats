<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  regular: number
  limited: number
}>()

// Format large numbers with separators
function formatNumber(num: number): string {
  return num.toLocaleString('ru-RU')
}

const formattedRegular = computed(() => formatNumber(props.regular))
const formattedLimited = computed(() => formatNumber(props.limited))
const formattedTotal = computed(() => formatNumber(props.regular + props.limited))
</script>

<template>
  <div class="gold-summary">
    <div class="gold-summary__item">
      <span class="gold-summary__label">Обычное:</span>
      <span class="gold-summary__value gold-summary__value--regular">
        💰 {{ formattedRegular }}
      </span>
    </div>
    <div class="gold-summary__item">
      <span class="gold-summary__label">Лимитированное:</span>
      <span class="gold-summary__value gold-summary__value--limited">
        ✨ {{ formattedLimited }}
      </span>
    </div>
    <div class="gold-summary__total">
      <span class="gold-summary__label">Всего:</span>
      <span class="gold-summary__value gold-summary__value--total">
        🏆 {{ formattedTotal }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.gold-summary {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  background-color: var(--color-surface);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.gold-summary__item,
.gold-summary__total {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.gold-summary__total {
  padding-top: var(--spacing-xs);
  border-top: 1px solid var(--color-border);
  margin-top: var(--spacing-xs);
}

.gold-summary__label {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.gold-summary__value {
  font-size: var(--text-sm);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.gold-summary__value--regular {
  color: var(--color-warning);
}

.gold-summary__value--limited {
  color: var(--color-primary);
}

.gold-summary__value--total {
  color: var(--color-text);
  font-size: var(--text-base);
}
</style>