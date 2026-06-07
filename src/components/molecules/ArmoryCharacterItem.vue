<script setup lang="ts">
/**
 * ArmoryCharacterItem
 * 
 * A single character row in the import list.
 * Displays character info with checkbox selection.
 */
import { computed } from 'vue'
import type { ArmoryCharacter } from '@/services/lostarkApi'
import { CHARACTER_CLASSES } from '@/constants/characterClasses'

const props = defineProps<{
  character: ArmoryCharacter
  isSelected: boolean
  isDuplicate: boolean
  gearScore?: number
}>()

const emit = defineEmits<{
  toggle: [name: string]
}>()

// Get class label for display
const classLabel = computed(() => {
  const found = CHARACTER_CLASSES.find(c => c.value === props.character.characterClass)
  return found?.label ?? props.character.characterClass
})

// Format gear score for display
const formattedGearScore = computed(() => {
  const gs = props.gearScore ?? props.character.gearScore
  if (!gs || gs <= 0) return null
  return gs.toFixed(2)
})

// Class icon URL from CDN
// NOTE: valkyrie uses holyknight_female.png (alt="Храмовница" on armory)
const classIconUrl = computed(() => {
  const iconMap: Record<string, string> = {
    berserker: 'https://static.monopoly.la.gmru.net/2018/obt/assets/images/common/thumb/berserker.png',
    destroyer: 'https://static.monopoly.la.gmru.net/2018/obt/assets/images/common/thumb/destroyer.png',
    gunlancer: 'https://static.monopoly.la.gmru.net/2018/obt/assets/images/common/thumb/gunlancer.png',
    paladin: 'https://static.monopoly.la.gmru.net/2018/obt/assets/images/common/thumb/paladin.png',
    slayer: 'https://static.monopoly.la.gmru.net/2018/obt/assets/images/common/thumb/slayer.png',
    valkyrie: 'https://static.monopoly.la.gmru.net/2018/obt/assets/images/common/thumb/holyknight_female.png',
    arcanist: 'https://static.monopoly.la.gmru.net/2018/obt/assets/images/common/thumb/arcanist.png',
    summoner: 'https://static.monopoly.la.gmru.net/2018/obt/assets/images/common/thumb/summoner.png',
    bard: 'https://static.monopoly.la.gmru.net/2018/obt/assets/images/common/thumb/bard.png',
    sorceress: 'https://static.monopoly.la.gmru.net/2018/obt/assets/images/common/thumb/sorceress.png',
    wardancer: 'https://static.monopoly.la.gmru.net/2018/obt/assets/images/common/thumb/battle_master.png',
    scrapper: 'https://static.monopoly.la.gmru.net/2018/obt/assets/images/common/thumb/scrapper.png',
    soulfist: 'https://static.monopoly.la.gmru.net/2018/obt/assets/images/common/thumb/force_master.png',
    glaivier: 'https://static.monopoly.la.gmru.net/2018/obt/assets/images/common/thumb/glaivier.png',
    striker: 'https://static.monopoly.la.gmru.net/2018/obt/assets/images/common/thumb/striker.png',
    breaker: 'https://static.monopoly.la.gmru.net/2018/obt/assets/images/common/thumb/breaker.png',
    sharpshooter: 'https://static.monopoly.la.gmru.net/2018/obt/assets/images/common/thumb/hawk_eye.png',
    deadeye: 'https://static.monopoly.la.gmru.net/2018/obt/assets/images/common/thumb/deadeye.png',
    artillerist: 'https://static.monopoly.la.gmru.net/2018/obt/assets/images/common/thumb/artillerist.png',
    machinist: 'https://static.monopoly.la.gmru.net/2018/obt/assets/images/common/thumb/machinist.png',
    gunslinger: 'https://static.monopoly.la.gmru.net/2018/obt/assets/images/common/thumb/gunslinger.png',
    deathblade: 'https://static.monopoly.la.gmru.net/2018/obt/assets/images/common/thumb/blade.png',
    shadowhunter: 'https://static.monopoly.la.gmru.net/2018/obt/assets/images/common/thumb/shadowhunter.png',
    reaper: 'https://static.monopoly.la.gmru.net/2018/obt/assets/images/common/thumb/reaper.png',
    souleater: 'https://static.monopoly.la.gmru.net/2018/obt/assets/images/common/thumb/soul_eater.png',
    artist: 'https://static.monopoly.la.gmru.net/2018/obt/assets/images/common/thumb/yinyangshi.png',
    aeromancer: 'https://static.monopoly.la.gmru.net/2018/obt/assets/images/common/thumb/aeromancer.png',
    wildsoul: 'https://static.monopoly.la.gmru.net/2018/obt/assets/images/common/thumb/alchemist.png',
    guardianknight: 'https://static.monopoly.la.gmru.net/2018/obt/assets/images/common/thumb/guardianknight.png',
  }
  return iconMap[props.character.characterClass] ?? iconMap.berserker
})

function handleToggle() {
  emit('toggle', props.character.name)
}
</script>

<template>
  <label
    class="armory-character-item"
    :class="{
      'armory-character-item--selected': isSelected,
      'armory-character-item--duplicate': isDuplicate,
    }"
  >
    <input
      type="checkbox"
      class="armory-character-item__checkbox"
      :checked="isSelected"
      @change="handleToggle"
      @click.stop
    />

    <img
      :src="classIconUrl"
      :alt="classLabel"
      class="armory-character-item__icon"
    />

    <div class="armory-character-item__info">
      <span class="armory-character-item__name">{{ character.name }}</span>
      <span class="armory-character-item__meta">
        <span class="armory-character-item__class">{{ classLabel }}</span>
        <span v-if="character.server" class="armory-character-item__server">{{ character.server }}</span>
      </span>
    </div>

    <span v-if="formattedGearScore" class="armory-character-item__gs">
      {{ formattedGearScore }}
    </span>

    <span v-if="isDuplicate" class="armory-character-item__badge">
      Уже есть
    </span>
  </label>
</template>

<style scoped>
.armory-character-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  user-select: none;
}

.armory-character-item:hover {
  border-color: var(--color-primary);
  background-color: var(--color-surface-hover);
}

.armory-character-item--selected {
  border-color: var(--color-primary);
  background-color: var(--color-primary-light);
}

.armory-character-item--duplicate {
  opacity: 0.85;
}

.armory-character-item__checkbox {
  width: 18px;
  height: 18px;
  accent-color: var(--color-primary);
  cursor: pointer;
  flex-shrink: 0;
}

.armory-character-item__icon {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  object-fit: contain;
  flex-shrink: 0;
}

.armory-character-item__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.armory-character-item__name {
  font-weight: 600;
  font-size: var(--text-sm);
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.armory-character-item__meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.armory-character-item__class {
  color: var(--color-text-secondary);
}

.armory-character-item__level {
  color: var(--color-primary);
  font-weight: 500;
}

.armory-character-item__server {
  color: var(--color-text-muted);
  padding-left: var(--spacing-xs);
  border-left: 1px solid var(--color-border);
}

.armory-character-item__gs {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-primary);
  flex-shrink: 0;
}

.armory-character-item__badge {
  font-size: var(--text-xs);
  color: var(--color-warning);
  background-color: var(--color-warning-light);
  padding: 2px var(--spacing-xs);
  border-radius: var(--radius-sm);
  font-weight: 500;
  flex-shrink: 0;
}
</style>