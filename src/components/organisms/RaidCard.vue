<script setup lang="ts">
import type { Raid } from '@/types'
import BaseButton from '@/components/atoms/BaseButton.vue'
import DifficultyBadge from '@/components/molecules/DifficultyBadge.vue'

defineProps<{
  raid: Raid
  editing?: boolean
}>()

const emit = defineEmits<{
  edit: [id: string]
  delete: [id: string]
}>()
</script>

<template>
  <div class="raid-card">
    <div class="raid-card__header">
      <h3 class="raid-card__name">{{ raid.name }}</h3>
      <div v-if="editing" class="raid-card__header-right">
        <BaseButton variant="secondary" title="Редактировать" @click.stop="emit('edit', raid.id)">✎</BaseButton>
        <BaseButton variant="danger" title="Удалить" @click.stop="emit('delete', raid.id)">✕</BaseButton>
      </div>
    </div>

    <div class="raid-card__details">
      <div v-for="diff in raid.difficulties" :key="diff.type" class="raid-card__detail">
        <div class="raid-card__detail-badge">
          <DifficultyBadge :type="diff.type" />
        </div>
        <span class="raid-card__detail-gs">ГС: {{ diff.requiredGearScore }}</span>
        <span class="raid-card__detail-gold">💰 {{ diff.regularGold }} ✨ {{ diff.limitedGold }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.raid-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.raid-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-md);
}

.raid-card__name {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text);
}

.raid-card__header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.raid-card__details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.raid-card__detail {
  display: grid;
  grid-template-columns: 100px 1fr 1fr;
  gap: var(--spacing-md);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  align-items: center;
}

.raid-card__detail-badge {
  width: 100px;
}

.raid-card__detail {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.raid-card__detail-values {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--spacing-sm) var(--spacing-lg);
  min-width: 200px;
}



.raid-card__detail-gs {
  color: var(--color-primary);
}

.raid-card__detail-gold {
  color: var(--color-warning);
}
</style>