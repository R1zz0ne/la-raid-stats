<script setup lang="ts">
import { computed } from 'vue'
import type { Character, Raid, DifficultyType } from '@/types'
import { useCharactersStore } from '@/stores/characters'
import { useRaidsStore } from '@/stores/raids'
import { useModalCloseGuard } from '@/composables/useModalCloseGuard'
import BaseButton from '@/components/atoms/BaseButton.vue'
import DifficultyBadge from '@/components/molecules/DifficultyBadge.vue'

const props = defineProps<{
  character: Character | null
}>()

const emit = defineEmits<{
  close: []
}>()

const charactersStore = useCharactersStore()
const raidsStore = useRaidsStore()

// Modal close guard to prevent closing when selecting text
const { onOverlayClick } = useModalCloseGuard(() => emit('close'))



// Get already assigned raid IDs for this character
const assignedRaidIds = computed(() => {
  if (!props.character) return new Set<string>()
  return new Set(
    charactersStore.getRaidsForCharacter(props.character.id)
      .map(cr => cr.raidId)
  )
})

// Available raids: 
// 1. Character GS >= min difficulty required GS
// 2. Not already assigned
const availableRaids = computed(() => {
  if (!props.character) return []

  return raidsStore.raids.filter(raid => {
    // Skip if already assigned
    if (assignedRaidIds.value.has(raid.id)) return false
    
    // Raid must have at least one difficulty with requiredGearScore <= character GS
    return raid.difficulties.some(d => d.requiredGearScore <= props.character!.gearScore)
  })
})

// Get available difficulties for a raid (filtered by GS)
function getAvailableDifficulties(raid: Raid) {
  if (!props.character) return []
  return raid.difficulties
    .filter(d => d.requiredGearScore <= props.character!.gearScore)
    .sort((a, b) => a.requiredGearScore - b.requiredGearScore)
}

function assignRaid(raidId: string, difficultyType: DifficultyType) {
  if (!props.character) return

  charactersStore.addCharacterRaid({
    characterId: props.character.id,
    raidId,
    difficultyType,
  })
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="character" class="modal-overlay" @click="onOverlayClick">
      <div class="modal-content" ref="modalContentRef">
        <div class="raid-assignment">
          <h3 class="raid-assignment__title">
            Выберите рейд для {{ character.name }}
          </h3>
          <p class="raid-assignment__gs">
            ГС персонажа: {{ character.gearScore }}
          </p>

          <div v-if="availableRaids.length > 0" class="raid-assignment__list">
            <div
              v-for="raid in [...availableRaids].reverse()"
              :key="raid.id"
              class="raid-assignment__raid"
            >
              <div class="raid-assignment__raid-header">
                <span class="raid-assignment__raid-name">{{ raid.name }}</span>
              </div>
              
              <div class="raid-assignment__difficulties">
                <div
                  v-for="diff in getAvailableDifficulties(raid)"
                  :key="diff.type"
                  class="raid-assignment__difficulty"
                  @click="assignRaid(raid.id, diff.type)"
                >
                  <DifficultyBadge :type="diff.type" />
                  <span class="raid-assignment__dif-gs">ГС: {{ diff.requiredGearScore }}</span>
                  <span v-if="diff.regularGold > 0" class="raid-assignment__dif-gold">
                    💰 {{ diff.regularGold }}
                  </span>
                  <span v-if="diff.limitedGold > 0" class="raid-assignment__dif-gold">
                    ✨ {{ diff.limitedGold }}
                  </span>
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

          <div class="raid-assignment__actions">
            <BaseButton variant="secondary" @click="emit('close')">
              Отмена
            </BaseButton>
          </div>
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
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp var(--transition-normal) ease-out;
}

.raid-assignment {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
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

.raid-assignment__title {
  font-size: var(--text-lg);
  font-weight: 600;
  margin: 0;
}

.raid-assignment__gs {
  color: var(--color-primary);
  font-weight: 500;
  margin: 0;
}

.raid-assignment__list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.raid-assignment__raid {
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.raid-assignment__raid-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.raid-assignment__raid-name {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text);
}

.raid-assignment__difficulties {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.raid-assignment__difficulty {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-surface-hover);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.raid-assignment__difficulty:hover {
  background-color: var(--color-primary-light);
  border-color: var(--color-primary);
}

.raid-assignment__dif-gs {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.raid-assignment__dif-gold {
  font-size: var(--text-xs);
  color: var(--color-warning);
}

.raid-assignment__empty {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-muted);
}

.raid-assignment__empty-hint {
  font-size: var(--text-sm);
  margin-top: var(--spacing-sm);
}

.raid-assignment__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}
</style>