<script setup lang="ts">
import { computed } from 'vue'
import type { Character, CharacterRaid, GoldSummary, Raid } from '@/types'
import { getClassLabel } from '@/constants/characterClasses'
import { MAX_GOLD_RECIPIENTS, MAX_RAIDS_PER_CHARACTER } from '@/constants'
import BaseButton from '@/components/atoms/BaseButton.vue'
import BaseCheckbox from '@/components/atoms/BaseCheckbox.vue'
import GoldSummaryCard from '@/components/molecules/GoldSummary.vue'
import RaidItem from '@/components/molecules/RaidItem.vue'
import { useRaidsStore } from '@/stores/raids'
import { useCharactersStore } from '@/stores/characters'

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
  toggleGoldRecipient: [id: string]
  dragStart: [event: DragEvent, index: number]
  dragOver: [event: DragEvent, index: number]
  drop: [event: DragEvent, index: number]
}>()

const raidsStore = useRaidsStore()
const charactersStore = useCharactersStore()

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
// Filter out raids that no longer exist (orphan protection)
const sortedRaids = computed(() => {
  return props.raids
    .map(cr => ({
      characterRaid: cr,
      raid: getRaidForCharacterRaid(cr),
    }))
    .filter(item => item.raid !== undefined)
    .sort((a, b) => {
      const indexA = raidsStore.raids.findIndex(r => r.id === a.characterRaid.raidId)
      const indexB = raidsStore.raids.findIndex(r => r.id === b.characterRaid.raidId)
      return indexB - indexA
    })
})

const isGoldRecipient = computed({
  get: () => props.character.isGoldRecipient ?? false,
  set: (value: boolean) => {
    if (!value && props.character.isGoldRecipient) {
      emit('toggleGoldRecipient', props.character.id)
    } else if (value && !props.character.isGoldRecipient && charactersStore.goldRecipientCount() < MAX_GOLD_RECIPIENTS) {
      emit('toggleGoldRecipient', props.character.id)
    }
  }
})
</script>

<template>
  <div
    class="character-card"
    :class="{
      'character-card--editing': editing,
      'character-card--gold-recipient': isGoldRecipient
    }"
    :draggable="draggable"
    :data-testid="`character-card-${character.id}`"
    @dragstart="emit('dragStart', $event, 0)"
    @dragover="emit('dragOver', $event, 0)"
    @drop="emit('drop', $event, 0)"
  >
    <div class="character-card__header">
      <div class="character-card__info">
        <div class="character-card__identity">
          <span class="character-card__name" :data-testid="`character-name-${character.id}`">{{ character.name }}</span>
          <span class="character-card__class">{{ displayClass }}</span>
        </div>
        <span class="character-card__gs">ГС: {{ character.gearScore.toLocaleString('ru-RU') }}</span>
      </div>

      <div v-if="editing" class="character-card__actions">
        <BaseCheckbox
          v-model="isGoldRecipient"
          variant="toggle"
          title="Получатель золота"
          :disabled="!isGoldRecipient && charactersStore.goldRecipientCount() >= 6"
        />
        <BaseButton variant="secondary" :data-testid="`edit-btn-${character.id}`" title="Редактировать" @click="emit('edit', character.id)">✎</BaseButton>
        <BaseButton variant="danger" :data-testid="`delete-btn-${character.id}`" title="Удалить" @click="emit('delete', character.id)">✕</BaseButton>
      </div>
    </div>

    <div class="character-card__raids">
      <div v-if="sortedRaids.length > 0" class="character-card__raids-list">
        <RaidItem
          v-for="item in sortedRaids"
          :key="item.characterRaid.id"
          :raid="item.raid!"
          :difficulty-type="item.characterRaid.difficultyType"
          :is-completed="item.characterRaid.isCompleted"
          :editing="editing"
          :compact="true"
          @toggle="emit('toggleRaid', item.characterRaid.id)"
          @remove="emit('removeRaid', item.characterRaid.id)"
        />
        <button
          v-if="editing && raids.length < MAX_RAIDS_PER_CHARACTER"
          type="button"
          class="character-card__add-raid-btn"
          title="Добавить рейд"
          @click="emit('addRaid', character.id)"
        >
          + Добавить рейд
        </button>
      </div>

      <div v-else class="character-card__empty">
        <p>Нет назначенных рейдов</p>
        <button
          v-if="editing && raids.length < MAX_RAIDS_PER_CHARACTER"
          type="button"
          class="character-card__add-raid-btn"
          title="Добавить рейд"
          @click="emit('addRaid', character.id)"
        >
          + Добавить рейд
        </button>
      </div>
    </div>

    <div v-if="isGoldRecipient && !editing" class="character-card__footer">
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
  gap: var(--spacing-sm);
  transition: all var(--transition-fast);
}

.character-card--gold-recipient {
  border-color: var(--color-gold);
  box-shadow: 0 0 0 1px var(--color-gold);
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
  gap: var(--spacing-sm);
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

.character-card__gold-checkbox {
  flex-shrink: 0;
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

.character-card__raids {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  min-height: 60px;
}

.character-card__raids-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background-color: var(--color-border);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.character-card__raids-list > :deep(.raid-item) {
  border: none;
  border-radius: 0;
}

.character-card__raids-list > :deep(.raid-item:first-child) {
  border-top-left-radius: var(--radius-md);
  border-top-right-radius: var(--radius-md);
}

.character-card__raids-list > :deep(.raid-item:last-of-type) {
  border-bottom-left-radius: var(--radius-md);
  border-bottom-right-radius: var(--radius-md);
}

.character-card__add-raid-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--color-surface-hover);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.character-card__add-raid-btn:hover {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.character-card__empty {
  padding: var(--spacing-sm);
  text-align: center;
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  background-color: var(--color-surface-hover);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.character-card__footer {
  margin-top: auto;
}
</style>