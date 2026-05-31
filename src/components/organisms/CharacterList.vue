<script setup lang="ts">
import { computed } from 'vue'
import type { Character, CharacterRaid, GoldSummary } from '@/types'
import { useCharactersStore } from '@/stores/characters'
import { useDragDrop } from '@/composables/useDragDrop'
import CharacterCard from '@/components/molecules/CharacterCard.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'

const props = defineProps<{
  characters: Character[]
  editing: boolean
}>()

const emit = defineEmits<{
  editCharacter: [id: string]
  deleteCharacter: [id: string]
  addCharacter: []
  addRaid: [characterId: string]
  toggleRaid: [raidId: string]
  removeRaid: [raidId: string]
}>()

const charactersStore = useCharactersStore()

// Compute raid data for each character
function getRaidsForCharacter(characterId: string): CharacterRaid[] {
  return charactersStore.getRaidsForCharacter(characterId)
}

function getGoldSummary(characterId: string): GoldSummary {
  return charactersStore.getGoldSummary(characterId)
}

// Drag and drop
const charactersRef = computed(() => props.characters)

const { isDragging, handleDragStart, handleDragOver, handleDrop } = useDragDrop(
  charactersRef,
  {
    onUpdate: (newOrder) => {
      charactersStore.reorderCharacters(newOrder)
    },
    enabled: computed(() => props.editing),
  },
)



function onDragStart(event: DragEvent, index: number) {
  handleDragStart(event, index)
}

function onDragOver(event: DragEvent, index: number) {
  handleDragOver(event, index)
}

function onDrop(event: DragEvent, index: number) {
  handleDrop(event, index)
}
</script>

<template>
  <div class="character-list">
    <div class="character-list__header">
      <h2>Персонажи ({{ characters.length }})</h2>
      <BaseButton
        v-if="charactersStore.canAddCharacter"
        variant="primary"
        @click="emit('addCharacter')"
      >
        + Добавить персонажа
      </BaseButton>
      <span v-else class="character-list__limit">
        Достигнут лимит ({{ characters.length }}/30)
      </span>
    </div>

    <div
      class="character-list__grid"
      :class="{ 'character-list__grid--editing': editing, 'character-list__grid--dragging': isDragging }"
    >
      <CharacterCard
        v-for="(character, index) in characters"
        :key="character.id"
        :character="character"
        :raids="getRaidsForCharacter(character.id)"
        :gold-summary="getGoldSummary(character.id)"
        :editing="editing"
        :draggable="editing"
        @edit="emit('editCharacter', $event)"
        @delete="emit('deleteCharacter', $event)"
        @add-raid="emit('addRaid', $event)"
        @toggle-raid="emit('toggleRaid', $event)"
        @remove-raid="emit('removeRaid', $event)"
        @drag-start="onDragStart($event, index)"
        @drag-over="onDragOver($event, index)"
        @drop="onDrop($event, index)"
      />
    </div>

    <div v-if="characters.length === 0" class="character-list__empty">
      <p>Нет персонажей. Добавьте первого!</p>
      <BaseButton variant="primary" @click="emit('addCharacter')">
        + Добавить персонажа
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.character-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.character-list__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.character-list__header h2 {
  font-size: var(--text-xl);
  font-weight: 600;
}

.character-list__limit {
  font-size: var(--text-sm);
  color: var(--color-warning);
}

.character-list__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-md);
}

.character-list__grid--editing .character-card {
  cursor: grab;
}

.character-list__grid--editing .character-card:active {
  cursor: grabbing;
}

.character-list__grid--dragging .character-card:not(.dragging) {
  opacity: 0.5;
}

.character-list__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  padding: var(--spacing-2xl);
  background-color: var(--color-surface);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  text-align: center;
}

.character-list__empty p {
  font-size: var(--text-lg);
  color: var(--color-text-muted);
}

@media (max-width: 640px) {
  .character-list__grid {
    grid-template-columns: 1fr;
  }
}
</style>