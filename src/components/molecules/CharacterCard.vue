<script setup lang="ts">
import { computed } from 'vue'
import type { Character, CharacterRaid, GoldSummary, Raid } from '@/types'
import { getClassLabel } from '@/constants/characterClasses'
import BaseButton from '@/components/atoms/BaseButton.vue'
import GoldSummaryCard from '@/components/molecules/GoldSummary.vue'
import RaidItem from '@/components/molecules/RaidItem.vue'
import { useRaidsStore } from '@/stores/raids'

const props = defineProps<{
  character: Character
  raids: CharacterRaid[]
  goldSummary: GoldSummary
  editing?: boolean
  draggable?: boolean
}>()

const emit = defineEmits<{
  edit: [id: string]
  delete: [id: string]
  addRaid: [id: string]
  toggleRaid: [raidId: string]
  removeRaid: [raidId: string]
  dragStart: [event: DragEvent, index: number]
  dragOver: [event: DragEvent, index: number]
  drop: [event: DragEvent, index: number]
}>()

const raidsStore = useRaidsStore()

const displayClass = computed(() => {
  if (props.character.characterClass === 'custom' && props.character.customClassName) {
    return props.character.customClassName
  }
  return getClassLabel(props.character.characterClass)
})

function getRaidForCharacterRaid(cr: CharacterRaid): Raid | undefined {
  return raidsStore.getRaidById(cr.raidId)
}

// Sort raids to match library order (newest first, like in RaidLibraryView)
const sortedRaids = computed(() => {
  return [...props.raids].sort((a, b) => {
    const indexA = raidsStore.raids.findIndex(r => r.id === a.raidId)
    const indexB = raidsStore.raids.findIndex(r => r.id === b.raidId)
    return indexB - indexA // Newest raid first (reverse of library order)
  })
})
</script>

<template>
  <div
    class="character-card"
    :class="{ 'character-card--editing': editing }"
    :draggable="draggable"
    @dragstart="emit('dragStart', $event, 0)"
    @dragover="emit('dragOver', $event, 0)"
    @drop="emit('drop', $event, 0)"
  >
    <div class="character-card__header">
      <div class="character-card__info">
        <div class="character-card__identity">
          <span class="character-card__name">{{ character.name }}</span>
          <span class="character-card__class">{{ displayClass }}</span>
        </div>
        <div class="character-card__stats">
          <span class="character-card__gs">ГС: {{ character.gearScore.toLocaleString('ru-RU') }}</span>
        </div>
      </div>

      <div v-if="editing" class="character-card__actions">
        <BaseButton variant="secondary" size="sm" @click="emit('edit', character.id)">
          Редактировать
        </BaseButton>
        <BaseButton variant="danger" size="sm" @click="emit('delete', character.id)">
          Удалить
        </BaseButton>
      </div>

      <BaseButton
        v-else-if="raids.length < 3"
        variant="primary"
        size="sm"
        @click="emit('addRaid', character.id)"
      >
        + Рейд
      </BaseButton>
      <div v-else class="character-card__raid-limit">
        <span>3/3 рейдов</span>
      </div>
    </div>

    <div class="character-card__raids">
      <template v-if="sortedRaids.length > 0">
        <RaidItem
          v-for="cr in sortedRaids"
          :key="cr.id"
          :raid="getRaidForCharacterRaid(cr)!"
          :difficulty-type="cr.difficultyType"
          :is-completed="cr.isCompleted"
          :editing="editing"
          @toggle="emit('toggleRaid', cr.id)"
          @remove="emit('removeRaid', cr.id)"
        />
      </template>

      <div v-else class="character-card__empty">
        <p>Нет назначенных рейдов</p>
      </div>
    </div>

    <div class="character-card__footer">
      <GoldSummaryCard
        :regular="goldSummary.regular"
        :limited="goldSummary.limited"
      />
    </div>
  </div>
</template>

<style scoped>
.character-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  transition: all var(--transition-fast);
}

.character-card--editing {
  cursor: grab;
}

.character-card--editing:active {
  cursor: grabbing;
}

.character-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-md);
}

.character-card__info {
  flex: 1;
  min-width: 0;
}

.character-card__identity {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.character-card__name {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text);
}

.character-card__class {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  padding: 2px var(--spacing-sm);
  background-color: var(--color-surface-hover);
  border-radius: var(--radius-sm);
}

.character-card__stats {
  margin-top: var(--spacing-xs);
}

.character-card__gs {
  font-size: var(--text-sm);
  color: var(--color-primary);
  font-weight: 500;
}

.character-card__actions {
  display: flex;
  gap: var(--spacing-sm);
}

.character-card__raid-limit {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  padding: var(--spacing-sm);
}

.character-card__raids {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.character-card__empty {
  padding: var(--spacing-md);
  text-align: center;
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  background-color: var(--color-surface-hover);
  border-radius: var(--radius-md);
}

.character-card__footer {
  margin-top: auto;
}
</style>