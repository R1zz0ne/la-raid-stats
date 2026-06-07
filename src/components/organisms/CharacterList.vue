<script setup lang="ts">
import { computed } from 'vue'
import type { Character, ViewMode } from '@/types'
import { useCharactersStore } from '@/stores/characters'
import { useDragDrop } from '@/composables/useDragDrop'
import CharacterCard from '@/components/molecules/CharacterCard.vue'
import CharacterTable from '@/components/organisms/CharacterTable.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'

const props = defineProps<{
  characters: Character[]
  editing: boolean
  viewMode: ViewMode
}>()

const emit = defineEmits<{
  editCharacter: [id: string]
  deleteCharacter: [id: string]
  addCharacter: []
  addRaid: [characterId: string]
  toggleRaid: [raidId: string]
  removeRaid: [raidId: string]
  toggleGoldRecipient: [id: string]
}>()

const charactersStore = useCharactersStore()

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

// Reorder handler for table view
function handleReorder(fromIndex: number, toIndex: number) {
  const newOrder = [...props.characters]
  const [moved] = newOrder.splice(fromIndex, 1)
  newOrder.splice(toIndex, 0, moved)
  charactersStore.reorderCharacters(newOrder)
}

// Computed properties for gold recipients and other characters
const goldRecipients = computed(() => {
  return props.characters.filter(c => c.isGoldRecipient)
})

const otherCharacters = computed(() => {
  return props.characters.filter(c => !c.isGoldRecipient)
})
</script>

<template>
  <div class="character-list">
    <!-- Cards View -->
    <template v-if="viewMode === 'cards'">
      <!-- Gold Recipients Section -->
      <div v-if="goldRecipients.length > 0" class="character-list__section">
        <div class="character-list__section-header">
          <h3>Получатели золота</h3>
          <span class="character-list__section-badge">{{ goldRecipients.length }}/6</span>
        </div>
        <div
          class="character-list__grid"
          :class="{ 'character-list__grid--editing': editing, 'character-list__grid--dragging': isDragging }"
        >
          <CharacterCard
            v-for="(character, index) in goldRecipients"
            :key="character.id"
            :character="character"
            :raids="charactersStore.getRaidsForCharacter(character.id)"
            :gold-summary="charactersStore.getGoldSummary(character.id)"
            :editing="editing"
            :draggable="editing"
            @edit="emit('editCharacter', $event)"
            @delete="emit('deleteCharacter', $event)"
            @add-raid="emit('addRaid', $event)"
            @toggle-raid="emit('toggleRaid', $event)"
            @remove-raid="emit('removeRaid', $event)"
            @toggle-gold-recipient="emit('toggleGoldRecipient', $event)"
            @drag-start="onDragStart($event, index)"
            @drag-over="onDragOver($event, index)"
            @drop="onDrop($event, index)"
          />
        </div>
      </div>

      <!-- Other Characters Section -->
      <div v-if="otherCharacters.length > 0" class="character-list__section">
        <div v-if="goldRecipients.length > 0" class="character-list__section-header">
          <h3>Остальные персонажи</h3>
          <span class="character-list__section-badge">{{ otherCharacters.length }}</span>
        </div>
        <div
          class="character-list__grid"
          :class="{ 'character-list__grid--editing': editing, 'character-list__grid--dragging': isDragging }"
        >
          <CharacterCard
            v-for="(character, index) in otherCharacters"
            :key="character.id"
            :character="character"
            :raids="charactersStore.getRaidsForCharacter(character.id)"
            :gold-summary="charactersStore.getGoldSummary(character.id)"
            :editing="editing"
            :draggable="editing"
            @edit="emit('editCharacter', $event)"
            @delete="emit('deleteCharacter', $event)"
            @add-raid="emit('addRaid', $event)"
            @toggle-raid="emit('toggleRaid', $event)"
            @remove-raid="emit('removeRaid', $event)"
            @toggle-gold-recipient="emit('toggleGoldRecipient', $event)"
            @drag-start="onDragStart($event, index + goldRecipients.length)"
            @drag-over="onDragOver($event, index + goldRecipients.length)"
            @drop="onDrop($event, index + goldRecipients.length)"
          />
        </div>
      </div>

      <div v-if="characters.length === 0" class="character-list__empty">
        <p>Нет персонажей. Добавьте первого!</p>
        <BaseButton variant="primary" @click="emit('addCharacter')">
          + Добавить персонажа
        </BaseButton>
      </div>
    </template>

    <!-- Table View -->
    <CharacterTable
      v-else
      :characters="characters"
      :editing="editing"
      @edit-character="emit('editCharacter', $event)"
      @delete-character="emit('deleteCharacter', $event)"
      @add-character="emit('addCharacter')"
      @add-raid="emit('addRaid', $event)"
      @toggle-raid="emit('toggleRaid', $event)"
      @remove-raid="emit('removeRaid', $event)"
      @toggle-gold-recipient="emit('toggleGoldRecipient', $event)"
      @reorder="handleReorder"
    />
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
  justify-content: flex-end;
  align-items: center;
}

.character-list__add-btn {
  margin-left: auto;
}

.character-list__header h2 {
  font-size: var(--text-xl);
  font-weight: 600;
}

.character-list__section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.character-list__section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
}

.character-list__section-header h3 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text);
}

.character-list__section-badge {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  background-color: var(--color-surface-hover);
  padding: 2px var(--spacing-sm);
  border-radius: var(--radius-sm);
}

.character-list__limit {
  font-size: var(--text-sm);
  color: var(--color-warning);
}

.character-list__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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

@media (max-width: 1200px) {
  .character-list__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .character-list__grid {
    grid-template-columns: 1fr;
  }
}
</style>