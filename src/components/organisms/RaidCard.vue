<script setup lang="ts">
import type { Raid } from '@/types'
import BaseButton from '@/components/atoms/BaseButton.vue'
import DifficultyBadge from '@/components/molecules/DifficultyBadge.vue'

defineProps<{
  raid: Raid
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
      <div class="raid-card__actions">
        <BaseButton variant="secondary" size="sm" @click="emit('edit', raid.id)">
          Редактировать
        </BaseButton>
        <BaseButton variant="danger" size="sm" @click="emit('delete', raid.id)">
          Удалить
        </BaseButton>
      </div>
    </div>

    <div class="raid-card__difficulties">
      <DifficultyBadge
        v-for="diff in raid.difficulties"
        :key="diff.type"
        :type="diff.type"
      />
    </div>

    <div class="raid-card__details">
      <div v-for="diff in raid.difficulties" :key="diff.type" class="raid-card__detail">
        <span class="raid-card__detail-label">{{ diff.type }}:</span>
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

.raid-card__actions {
  display: flex;
  gap: var(--spacing-sm);
}

.raid-card__difficulties {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.raid-card__details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.raid-card__detail {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.raid-card__detail-label {
  text-transform: capitalize;
  min-width: 80px;
}

.raid-card__detail-gs {
  color: var(--color-primary);
}

.raid-card__detail-gold {
  color: var(--color-warning);
}
</style>