<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Character, CharacterRaid, GoldSummary, Raid } from '@/types'
import { getClassLabel } from '@/constants/characterClasses'
import { MAX_GOLD_RECIPIENTS, MAX_RAIDS_PER_CHARACTER } from '@/constants'
import BaseButton from '@/components/atoms/BaseButton.vue'
import BaseCheckbox from '@/components/atoms/BaseCheckbox.vue'
import DifficultyBadge from '@/components/molecules/DifficultyBadge.vue'
import { useRaidsStore } from '@/stores/raids'
import { useCharactersStore } from '@/stores/characters'

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
  toggleGoldRecipient: [id: string]
  reorder: [fromIndex: number, toIndex: number]
}>()

const raidsStore = useRaidsStore()
const charactersStore = useCharactersStore()

// Drag and drop state
const draggedCharacterId = ref<string | null>(null)
const dropTargetCharacterId = ref<string | null>(null)

// Computed sections
const goldRecipients = computed(() =>
  props.characters.filter(c => c.isGoldRecipient),
)

const otherCharacters = computed(() =>
  props.characters.filter(c => !c.isGoldRecipient),
)

// Get global index for a character
function getCharacterIndex(characterId: string): number {
  return props.characters.findIndex(c => c.id === characterId)
}

// Check if drop is allowed (gold only to gold, non-gold only to non-gold)
function canDropTo(targetId: string): boolean {
  if (!draggedCharacterId.value) return false
  const dragged = props.characters.find(c => c.id === draggedCharacterId.value)
  const target = props.characters.find(c => c.id === targetId)
  if (!dragged || !target) return false
  return dragged.isGoldRecipient === target.isGoldRecipient
}

// Drag handlers
function handleDragStart(event: DragEvent, characterId: string): void {
  if (!props.editing) return

  draggedCharacterId.value = characterId
  event.dataTransfer?.setData('text/plain', characterId)
  event.dataTransfer!.effectAllowed = 'move'
}

function handleDragOver(event: DragEvent, targetId: string): void {
  if (!props.editing || !draggedCharacterId.value) return

  event.preventDefault()
  dropTargetCharacterId.value = targetId

  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = canDropTo(targetId) ? 'move' : 'none'
  }
}

function handleDrop(event: DragEvent, targetId: string): void {
  event.preventDefault()

  if (!props.editing || !draggedCharacterId.value) return
  if (!canDropTo(targetId)) return

  const fromIndex = getCharacterIndex(draggedCharacterId.value)
  const toIndex = getCharacterIndex(targetId)

  if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
    emit('reorder', fromIndex, toIndex)
  }

  handleDragEnd()
}

function handleDragEnd(): void {
  draggedCharacterId.value = null
  dropTargetCharacterId.value = null
}

const goldTotalSummary = computed(() => {
  let regular = 0
  let limited = 0
  for (const character of goldRecipients.value) {
    const summary = charactersStore.getGoldSummary(character.id)
    regular += summary.regular
    limited += summary.limited
  }
  return { regular, limited, total: regular + limited }
})

function getRaidsForCharacter(characterId: string): CharacterRaid[] {
  return charactersStore.getRaidsForCharacter(characterId)
}

// Sort raids to match library order (newest first, like in CharacterCard)
// Filter out raids that no longer exist (orphan protection)
function getSortedRaidsForCharacter(characterId: string): CharacterRaid[] {
  return getRaidsForCharacter(characterId)
    .map(cr => ({
      characterRaid: cr,
      raid: raidsStore.getRaidById(cr.raidId),
    }))
    .filter(item => item.raid !== undefined)
    .sort((a, b) => {
      const indexA = raidsStore.raids.findIndex(r => r.id === a.characterRaid.raidId)
      const indexB = raidsStore.raids.findIndex(r => r.id === b.characterRaid.raidId)
      return indexB - indexA
    })
    .map(item => item.characterRaid)
}

function getGoldSummary(characterId: string): GoldSummary {
  return charactersStore.getGoldSummary(characterId)
}

function getRaidById(raidId: string): Raid | undefined {
  return raidsStore.getRaidById(raidId)
}

function isCharacterAllCompleted(characterId: string): boolean {
  const raids = getRaidsForCharacter(characterId)
  return raids.length > 0 && raids.every(r => r.isCompleted)
}

function getDisplayClass(character: Character): string {
  if (character.characterClass === 'custom' && character.customClassName) {
    return character.customClassName
  }
  return getClassLabel(character.characterClass)
}

function getClassIconPath(character: Character): string | undefined {
  if (character.characterClass === 'custom') return undefined
  return `/classes/${character.characterClass}.webp`
}

function isGoldRecipient(character: Character): boolean {
  return character.isGoldRecipient ?? false
}
</script>

<template>
  <div class="character-table">
    <table class="character-table__table">
      <colgroup>
        <col class="character-table__col character-table__col--name" />
        <col class="character-table__col character-table__col--class" />
        <col class="character-table__col character-table__col--gs" />
        <col class="character-table__col character-table__col--raids" />
        <col class="character-table__col character-table__col--gold" :class="{ 'character-table__col--gold-edit': editing }" />
        <col v-if="editing" class="character-table__col character-table__col--actions" />
      </colgroup>

      <thead class="character-table__head">
        <tr>
          <th class="character-table__th">Имя</th>
          <th class="character-table__th">Класс</th>
          <th class="character-table__th">ГС</th>
          <th class="character-table__th">Рейды</th>
          <th class="character-table__th">Золото</th>
          <th v-if="editing" class="character-table__th">Действия</th>
        </tr>
      </thead>

      <tbody class="character-table__body">
        <!-- Gold Recipients Section -->
        <template v-if="goldRecipients.length > 0">
          <tr
            v-for="character in goldRecipients"
            :key="character.id"
            class="character-table__row character-table__row--gold"
            :class="{
              'character-table__row--dragging': draggedCharacterId === character.id,
              'character-table__row--drag-over': dropTargetCharacterId === character.id && canDropTo(character.id),
              'character-table__row--drag-invalid': dropTargetCharacterId === character.id && !canDropTo(character.id),
              'character-table__row--all-completed': isCharacterAllCompleted(character.id)
            }"
            :data-testid="`character-row-${character.id}`"
            @dragover="editing && handleDragOver($event, character.id)"
            @drop="editing && handleDrop($event, character.id)"
          >
            <td class="character-table__td">
              <span class="character-table__name">{{ character.name }}</span>
            </td>
            <td class="character-table__td">
              <template v-if="getClassIconPath(character)">
                <img 
                  :src="getClassIconPath(character)" 
                  :alt="getDisplayClass(character)"
                  :title="getDisplayClass(character)"
                  class="character-table__class-icon"
                />
              </template>
              <span v-else class="character-table__class-badge">{{ getDisplayClass(character) }}</span>
            </td>
            <td class="character-table__td">
              <span class="character-table__gs">{{ character.gearScore.toLocaleString('ru-RU') }}</span>
            </td>
            <td class="character-table__td">
              <div class="character-table__raids-list">
                <div
                  v-for="cr in getSortedRaidsForCharacter(character.id)"
                  :key="cr.id"
                  class="character-table__raid-chip"
                  :class="{ 'character-table__raid-chip--completed': cr.isCompleted }"
                  :title="`${getRaidById(cr.raidId)?.name ?? ''} (${cr.difficultyType})`"
                >
                  <BaseCheckbox
                    :model-value="cr.isCompleted"
                    :disabled="editing"
                    @update:model-value="emit('toggleRaid', cr.id)"
                  />
                  <span class="character-table__raid-label">{{ getRaidById(cr.raidId)?.name ?? '' }}</span>
                  <DifficultyBadge :type="cr.difficultyType" class="character-table__raid-difficulty" />
                  <button
                    v-if="editing"
                    type="button"
                    class="character-table__raid-remove"
                    aria-label="Удалить рейд"
                    @click="emit('removeRaid', cr.id)"
                  >
                    <span class="character-table__raid-remove-icon">×</span>
                  </button>
                </div>
                <button
                  v-if="editing && getSortedRaidsForCharacter(character.id).length < MAX_RAIDS_PER_CHARACTER"
                  type="button"
                  class="character-table__add-raid-btn"
                  @click="emit('addRaid', character.id)"
                >
                  + Рейд
                </button>
              </div>
            </td>
            <td class="character-table__td">
              <template v-if="!editing">
                <div class="character-table__gold-summary character-table__gold-summary--right">
                  <span class="character-table__gold-total">
                    {{ getGoldSummary(character.id).total.toLocaleString('ru-RU') }}
                  </span>
                </div>
              </template>
              <template v-else>
                <div class="character-table__gold-checkbox">
                  <BaseCheckbox
                    :model-value="isGoldRecipient(character)"
                    :disabled="!isGoldRecipient(character) && charactersStore.goldRecipientCount() >= MAX_GOLD_RECIPIENTS"
                    @update:model-value="emit('toggleGoldRecipient', character.id)"
                  />
                </div>
              </template>
            </td>
            <td v-if="editing" class="character-table__td">
              <div class="character-table__actions">
                <button
                  type="button"
                  class="character-table__drag-handle"
                  :draggable="true"
                  aria-label="Перетащить для изменения порядка"
                  title="Перетащите для изменения порядка"
                  @dragstart="handleDragStart($event, character.id)"
                  @dragend="handleDragEnd"
                >⋮⋮</button>
                <BaseButton variant="secondary" @click="emit('editCharacter', character.id)">✎</BaseButton>
                <BaseButton variant="danger" @click="emit('deleteCharacter', character.id)">✕</BaseButton>
              </div>
            </td>
          </tr>

          <!-- Summary row after gold recipients -->
          <tr v-if="!editing" class="character-table__row character-table__row--gold-summary">
            <td class="character-table__td">
              <span class="character-table__summary-label">Итого</span>
            </td>
            <td class="character-table__td character-table__td--summary" colspan="4">
              <div class="character-table__gold-summary character-table__gold-summary--right">
                <span class="character-table__gold-total">
                  💰 {{ goldTotalSummary.regular.toLocaleString('ru-RU') }}
                </span>
                <span class="character-table__gold-separator">/</span>
                <span class="character-table__gold-limited">
                  ✨ {{ goldTotalSummary.limited.toLocaleString('ru-RU') }}
                </span>
                <span class="character-table__gold-sum">
                  / Всего: {{ goldTotalSummary.total.toLocaleString('ru-RU') }}
                </span>
              </div>
            </td>
            <td v-if="editing" class="character-table__td" />
          </tr>
        </template>

        <!-- Other Characters Section -->
        <template v-if="otherCharacters.length > 0">
          <tr
            v-for="character in otherCharacters"
            :key="character.id"
            class="character-table__row"
            :class="{
              'character-table__row--dragging': draggedCharacterId === character.id,
              'character-table__row--drag-over': dropTargetCharacterId === character.id && canDropTo(character.id),
              'character-table__row--drag-invalid': dropTargetCharacterId === character.id && !canDropTo(character.id)
            }"
            :data-testid="`character-row-${character.id}`"
            @dragover="editing && handleDragOver($event, character.id)"
            @drop="editing && handleDrop($event, character.id)"
          >
            <td class="character-table__td">
              <span class="character-table__name">{{ character.name }}</span>
            </td>
            <td class="character-table__td">
              <template v-if="getClassIconPath(character)">
                <img 
                  :src="getClassIconPath(character)" 
                  :alt="getDisplayClass(character)"
                  :title="getDisplayClass(character)"
                  class="character-table__class-icon"
                />
              </template>
              <span v-else class="character-table__class-badge">{{ getDisplayClass(character) }}</span>
            </td>
            <td class="character-table__td">
              <span class="character-table__gs">{{ character.gearScore.toLocaleString('ru-RU') }}</span>
            </td>
            <td class="character-table__td">
              <div class="character-table__raids-list">
                <div
                  v-for="cr in getSortedRaidsForCharacter(character.id)"
                  :key="cr.id"
                  class="character-table__raid-chip"
                  :class="{ 'character-table__raid-chip--completed': cr.isCompleted }"
                >
                  <BaseCheckbox
                    :model-value="cr.isCompleted"
                    :disabled="editing"
                    @update:model-value="emit('toggleRaid', cr.id)"
                  />
                  <span class="character-table__raid-label">{{ getRaidById(cr.raidId)?.name ?? '' }}</span>
                  <DifficultyBadge :type="cr.difficultyType" class="character-table__raid-difficulty" />
                  <button
                    v-if="editing"
                    type="button"
                    class="character-table__raid-remove"
                    aria-label="Удалить рейд"
                    @click="emit('removeRaid', cr.id)"
                  >
                    <span class="character-table__raid-remove-icon">×</span>
                  </button>
                </div>
                <button
                  v-if="editing && getSortedRaidsForCharacter(character.id).length < MAX_RAIDS_PER_CHARACTER"
                  type="button"
                  class="character-table__add-raid-btn"
                  @click="emit('addRaid', character.id)"
                >
                  + Рейд
                </button>
              </div>
            </td>
            <td class="character-table__td">
              <template v-if="!editing">
                <div class="character-table__gold-summary character-table__gold-summary--right">
                  <span class="character-table__gold-total">
                    {{ getGoldSummary(character.id).total.toLocaleString('ru-RU') }}
                  </span>
                </div>
              </template>
              <template v-else>
                <div class="character-table__gold-checkbox">
                  <BaseCheckbox
                    :model-value="isGoldRecipient(character)"
                    :disabled="!isGoldRecipient(character) && charactersStore.goldRecipientCount() >= MAX_GOLD_RECIPIENTS"
                    @update:model-value="emit('toggleGoldRecipient', character.id)"
                  />
                </div>
              </template>
            </td>
            <td v-if="editing" class="character-table__td">
              <div class="character-table__actions">
                <button
                  type="button"
                  class="character-table__drag-handle"
                  :draggable="true"
                  aria-label="Перетащить для изменения порядка"
                  title="Перетащите для изменения порядка"
                  @dragstart="handleDragStart($event, character.id)"
                  @dragend="handleDragEnd"
                >⋮⋮</button>
                <BaseButton variant="secondary" @click="emit('editCharacter', character.id)">✎</BaseButton>
                <BaseButton variant="danger" @click="emit('deleteCharacter', character.id)">✕</BaseButton>
              </div>
            </td>
          </tr>
        </template>

        <!-- Empty State -->
        <tr v-if="characters.length === 0" class="character-table__row character-table__row--empty">
          <td colspan="100" class="character-table__empty">
            <p>Нет персонажей. Добавьте первого!</p>
            <BaseButton variant="primary" @click="emit('addCharacter')">
              + Добавить персонажа
            </BaseButton>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.character-table {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: auto;
  max-height: calc(100vh - 300px);
}

.character-table__table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

/* Column widths via <col> — most reliable for fixed layout */
.character-table__col--name { width: 120px; }
.character-table__col--class { width: 110px; }
.character-table__col--gs { width: 80px; }
.character-table__col--raids { min-width: 200px; width: 100%; }
.character-table__col--gold { width: 110px; }
.character-table__col--gold-edit { width: 70px; }
.character-table__col--actions { width: 150px; }

.character-table__head tr {
  background-color: var(--color-surface-hover);
  border-left: 3px solid var(--color-surface-hover);
}

.character-table__th {
  padding: var(--spacing-sm) var(--spacing-md);
  text-align: left;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-muted);
  background-color: var(--color-surface-hover);
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 1;
}

.character-table__body {
}

.character-table__row {
  border-bottom: 1px solid var(--color-border);
  transition: background-color var(--transition-fast);
  vertical-align: middle;
}

.character-table__row:hover {
  background-color: var(--color-surface-hover);
}

.character-table__row--gold {
  border-left: 3px solid var(--color-gold);
}

.character-table__row--gold.character-table__row--all-completed {
  border-left: 3px solid var(--color-success);
}

.character-table__row--gold-summary {
  background-color: var(--color-surface-hover);
  border-left: 3px solid var(--color-gold);
  border-bottom: 1px solid var(--color-border);
}

.character-table__summary-label {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-text);
  font-style: italic;
}

.character-table__gold-summary {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
}

.character-table__gold-summary--right {
  justify-content: flex-end;
}

.character-table__gold-checkbox {
  display: flex;
  justify-content: center;
}

.character-table__gold-separator,
.character-table__gold-sum {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  font-weight: 600;
}

.character-table__gold-limited {
  font-size: var(--text-sm);
  color: var(--color-primary);
  font-weight: 600;
}

.character-table__td {
  padding: var(--spacing-sm) var(--spacing-md);
  vertical-align: middle;
}

.character-table__name {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text);
}

.character-table__class-badge {
  display: inline-block;
  padding: 2px var(--spacing-sm);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  border-radius: var(--radius-sm);
}

[data-theme="light"] .character-table__class-badge {
  background-color: #94a3b8;
}

[data-theme="dark"] .character-table__class-badge {
  background-color: var(--color-surface-hover);
}

.character-table__class-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
  border-radius: 50%;
  cursor: help;
  vertical-align: middle;
  padding: 3px;
}

[data-theme="light"] .character-table__class-icon {
  background-color: #94a3b8;
}

.character-table__gs {
  font-size: var(--text-sm);
  color: var(--color-primary);
  font-weight: 500;
}

.character-table__raids-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.character-table__raid-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  background-color: var(--color-surface-hover);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
}

.character-table__raid-chip--completed {
  opacity: 0.7;
  background-color: var(--color-surface-darker);
}

/* BaseCheckbox inside chip — compact version */
.character-table__raid-chip :deep(.base-checkbox) {
  gap: 2px;
}

.character-table__raid-chip :deep(.base-checkbox__box) {
  width: 16px;
  height: 16px;
}

.character-table__raid-chip :deep(.base-checkbox__check) {
  width: 10px;
  height: 10px;
}

.character-table__raid-label {
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.character-table__raid-difficulty {
  padding: 1px 4px;
  font-size: 9px;
  min-height: 14px;
}

.character-table__raid-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: none;
  border-radius: var(--radius-sm);
  background-color: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 12px;
  line-height: 1;
  transition: all var(--transition-fast);
}

.character-table__raid-remove-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  margin-top: -1px;
}

.character-table__raid-remove:hover {
  background-color: var(--color-danger);
  color: white;
}

.character-table__add-raid-btn {
  padding: 2px 8px;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-sm);
  background-color: transparent;
  color: var(--color-primary);
  font-size: var(--text-xs);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.character-table__add-raid-btn:hover {
  border-color: var(--color-primary);
  background-color: var(--color-primary-light);
}

.character-table__gold-total {
  font-size: var(--text-sm);
  color: var(--color-warning);
  font-weight: 600;
}

.character-table__actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.character-table__actions :deep(.base-button) {
  min-width: 32px;
  min-height: 32px;
  padding: var(--spacing-xs) var(--spacing-sm);
}

.character-table__drag-handle {
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  min-width: 32px;
  height: 32px;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-surface-hover);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  font-size: 14px;
  line-height: 1;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.character-table__drag-handle:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-light);
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

.character-table__drag-handle:active {
  cursor: grabbing;
  transform: scale(0.95);
}

.character-table__drag-handle:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.character-table__row--dragging {
  opacity: 0.5;
  background: var(--color-surface-hover);
}

.character-table__row--dragging .character-table__drag-handle {
  opacity: 1;
  cursor: grabbing;
}

.character-table__row--drag-over {
  background-color: var(--color-primary-light);
  border-top: 2px solid var(--color-primary);
}

.character-table__row--drag-over .character-table__drag-handle {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-light);
}

.character-table__row--drag-invalid {
  background-color: rgba(239, 68, 68, 0.1);
  border-top: 2px solid var(--color-danger);
}

.character-table__row--drag-invalid .character-table__drag-handle {
  cursor: not-allowed;
  opacity: 0.5;
}

.character-table__row--empty {
}

.character-table__empty {
  padding: var(--spacing-2xl);
  text-align: center;
}

.character-table__empty p {
  font-size: var(--text-lg);
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-md);
}
</style>