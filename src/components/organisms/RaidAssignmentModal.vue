<script setup lang="ts">
/**
 * RaidAssignmentModal
 * 
 * Modal for assigning raids to a character.
 * Allows selecting one difficulty per raid from available options.
 * 
 * Features:
 * - Compact chip-based difficulty selection
 * - Uses useRaidSelection composable for state management
 * - Uses RaidDifficultyChip component for compact display
 */
import { computed, onMounted, onUnmounted } from 'vue'
import type { Character, Raid, DifficultyType } from '@/types'
import { useCharactersStore } from '@/stores/characters'
import { useRaidsStore } from '@/stores/raids'
import { useModalCloseGuard } from '@/composables/useModalCloseGuard'
import { useRaidSelection } from '@/composables/useRaidSelection'
import BaseButton from '@/components/atoms/BaseButton.vue'
import RaidDifficultyChip from '@/components/atoms/RaidDifficultyChip.vue'

const props = defineProps<{
  character: Character | null
}>()

const emit = defineEmits<{
  close: []
}>()

const charactersStore = useCharactersStore()
const raidsStore = useRaidsStore()

// Modal close guard
const { onOverlayClick } = useModalCloseGuard(() => emit('close'))

// Lock body scroll
onMounted(() => {
  document.body.classList.add('body-no-scroll')
})

onUnmounted(() => {
  document.body.classList.remove('body-no-scroll')
})

// Raid selection state
const {
  selectedRaids,
  selectedCount,
  isSelected,
  toggleSelection,
  clearSelection,
} = useRaidSelection()

// Get already assigned raid IDs for this character
const assignedRaidIds = computed(() => {
  if (!props.character) return new Set<string>()
  return new Set(
    charactersStore.getRaidsForCharacter(props.character.id)
      .map(cr => cr.raidId)
  )
})

// Available raids: filtered by GS, sorted (newest first)
const availableRaids = computed(() => {
  if (!props.character) return []

  return [...raidsStore.raids].reverse().filter(raid => {
    if (assignedRaidIds.value.has(raid.id)) return false
    return raid.difficulties.some(d => d.requiredGearScore <= props.character!.gearScore)
  })
})

// Get difficulty order for sorting
function getDifficultyOrder(type: DifficultyType): number {
  const orderMap: Record<DifficultyType, number> = {
    nightmare: 1,
    heroic: 2,
    normal: 3,
    solo: 4,
  }
  return orderMap[type] ?? 99
}

// Get available difficulties for a raid (sorted by gold desc then difficulty desc)
function getAvailableDifficulties(raid: Raid) {
  if (!props.character) return []
  return raid.difficulties
    .filter(d => d.requiredGearScore <= props.character!.gearScore)
    .sort((a, b) => {
      const goldA = a.regularGold + a.limitedGold
      const goldB = b.regularGold + b.limitedGold

      if (goldB !== goldA) {
        return goldB - goldA
      }

      return getDifficultyOrder(a.type) - getDifficultyOrder(b.type)
    })
}

// Check if a raid has any selection
function hasSelection(raidId: string): boolean {
  return selectedRaids.value.some(r => r.raidId === raidId)
}

// Confirm and assign all selected raids
function confirmSelection() {
  if (!props.character) return

  for (const selection of selectedRaids.value) {
    charactersStore.addCharacterRaid({
      characterId: props.character.id,
      raidId: selection.raidId,
      difficultyType: selection.difficultyType,
    })
  }

  emit('close')
}

// Reset selection when modal closes
function handleClose() {
  clearSelection()
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="character" class="modal-overlay" @click="onOverlayClick">
      <div class="modal-content" @click.stop>
        <div class="raid-assignment">
          <header class="raid-assignment__header">
            <h3 class="raid-assignment__title">
              Выберите рейд для {{ character.name }}
            </h3>
            <span class="raid-assignment__gs">
              ГС: {{ character.gearScore.toLocaleString('ru-RU') }}
            </span>
          </header>

          <div v-if="availableRaids.length > 0" class="raid-assignment__scroll">
            <div class="raid-assignment__list">
              <div
                v-for="raid in availableRaids"
                :key="raid.id"
                class="raid-assignment__raid"
                :class="{ 'raid-assignment__raid--selected': hasSelection(raid.id) }"
              >
                <div class="raid-assignment__raid-header">
                  <span class="raid-assignment__raid-name">{{ raid.name }}</span>
                  <span 
                    v-if="hasSelection(raid.id)" 
                    class="raid-assignment__selected-badge"
                  >
                    ✓
                  </span>
                </div>

                <div class="raid-assignment__difficulties">
                  <RaidDifficultyChip
                    v-for="diff in getAvailableDifficulties(raid)"
                    :key="diff.type"
                    :difficulty="diff"
                    :is-selected="isSelected(raid.id, diff.type)"
                    @select="toggleSelection(raid.id, diff.type)"
                  />
                </div>
              </div>
            </div>
          </div>

          <div v-else class="raid-assignment__empty">
            <p>Нет доступных рейдов для этого персонажа.</p>
            <p class="raid-assignment__empty-hint">
              Проверьте, что у персонажа достаточно высокий ГС,
              и что рейды созданы в библиотеке.
            </p>
          </div>

          <footer class="raid-assignment__actions">
            <span v-if="selectedCount > 0" class="raid-assignment__selected-info">
              Выбрано: {{ selectedCount }}
            </span>
            <BaseButton
              variant="secondary"
              @click="handleClose"
            >
              Отмена
            </BaseButton>
            <BaseButton
              variant="primary"
              :disabled="selectedCount === 0"
              @click="confirmSelection"
            >
              Добавить ({{ selectedCount }})
            </BaseButton>
          </footer>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-md);
}

.modal-content {
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp var(--transition-normal) ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.raid-assignment {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.raid-assignment__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-sm);
}

.raid-assignment__title {
  font-size: var(--text-base);
  font-weight: 600;
  margin: 0;
}

.raid-assignment__gs {
  font-size: var(--text-sm);
  color: var(--color-primary);
  font-weight: 500;
}

.raid-assignment__list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.raid-assignment__scroll {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm);
}

.raid-assignment__raid {
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  transition: border-color var(--transition-fast);
}

.raid-assignment__raid--selected {
  border-color: var(--color-primary);
}

.raid-assignment__raid-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.raid-assignment__raid-name {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text);
}

.raid-assignment__selected-badge {
  font-size: var(--text-xs);
  color: var(--color-primary);
  background-color: var(--color-primary-light);
  padding: 2px var(--spacing-xs);
  border-radius: var(--radius-sm);
  font-weight: 600;
}

.raid-assignment__difficulties {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.raid-assignment__empty {
  text-align: center;
  padding: var(--spacing-lg);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}

.raid-assignment__empty-hint {
  font-size: var(--text-xs);
  margin-top: var(--spacing-xs);
  line-height: 1.5;
}

.raid-assignment__actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: var(--spacing-sm);
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--color-border);
}

.raid-assignment__selected-info {
  margin-right: auto;
  font-size: var(--text-sm);
  color: var(--color-primary);
  font-weight: 500;
}
</style>