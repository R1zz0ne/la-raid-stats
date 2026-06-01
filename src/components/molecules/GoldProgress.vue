<script setup lang="ts">
import { computed } from 'vue'
import { useCharactersStore } from '@/stores/characters'
import { useRaidsStore } from '@/stores/raids'

const charactersStore = useCharactersStore()
const raidsStore = useRaidsStore()

const goldStats = computed(() => {
  const goldRecipients = charactersStore.characters.filter(c => c.isGoldRecipient)
  let received = 0
  let maxPossible = 0

  for (const character of goldRecipients) {
    const raids = charactersStore.getRaidsForCharacter(character.id)
    const goldSummary = charactersStore.getGoldSummary(character.id)

    // Add completed gold
    received += goldSummary.total

    // Add max possible gold (including incomplete raids)
    for (const cr of raids) {
      const raidInfo = raidsStore.getRaidById(cr.raidId)
      if (raidInfo) {
        const difficulty = raidInfo.difficulties.find(d => d.type === cr.difficultyType)
        if (difficulty) {
          maxPossible += difficulty.regularGold + difficulty.limitedGold
        }
      }
    }
  }

  return { received, maxPossible }
})

const progressPercent = computed(() => {
  if (goldStats.value.maxPossible === 0) return 0
  return Math.round((goldStats.value.received / goldStats.value.maxPossible) * 100)
})
</script>

<template>
  <div v-if="goldStats.maxPossible > 0" class="gold-progress">
    <div class="gold-progress__header">
      <span class="gold-progress__title">Прогресс золота</span>
      <span class="gold-progress__stats">
        {{ goldStats.received.toLocaleString('ru-RU') }} / {{ goldStats.maxPossible.toLocaleString('ru-RU') }}
      </span>
    </div>
    <div class="gold-progress__bar">
      <div
        class="gold-progress__fill"
        :style="{ width: `${progressPercent}%` }"
      />
    </div>
  </div>
</template>

<style scoped>
.gold-progress {
  padding: var(--spacing-md);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-lg);
}

.gold-progress__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.gold-progress__title {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text);
}

.gold-progress__stats {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-gold);
  font-variant-numeric: tabular-nums;
}

.gold-progress__bar {
  height: 8px;
  background-color: var(--color-surface-hover);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.gold-progress__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-gold) 0%, #fbbf24 100%);
  border-radius: var(--radius-full);
  transition: width var(--transition-normal);
}
</style>