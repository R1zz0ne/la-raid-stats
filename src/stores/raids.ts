// Lost Ark Raid Tracker - useRaidsStore
// =====================================

import { defineStore } from 'pinia'
import { reactive, computed } from 'vue'
import type { Raid, Difficulty } from '@/types'
import { generateUniqueSlug } from '@/utils/transliterate'
import { useCharactersStore } from './characters'
import { useDefaultRaidsConfig } from '@/composables/useDefaultRaidsConfig'

export const useRaidsStore = defineStore('raids', () => {
  // Default raids config management
  const defaultConfig = useDefaultRaidsConfig()

  // State - use reactive for object/array
  const _raids = reactive<Raid[]>([])

  // Getters
  function getRaidById(id: string): Raid | undefined {
    return _raids.find(r => r.id === id)
  }

  // Get minimum required gear score for a raid
  function getMinGearScore(raid: Raid): number {
    if (raid.difficulties.length === 0) return 0
    return Math.min(...raid.difficulties.map(d => d.requiredGearScore))
  }

  // Filter raids by gear score
  const getAvailableRaidsForGearScore = computed(() => {
    return (gearScore: number): Raid[] => {
      return _raids.filter(raid => getMinGearScore(raid) <= gearScore)
    }
  })

  // Get existing slugs
  function getExistingSlugs(): string[] {
    return _raids.map(r => r.id)
  }

  // Actions
  function addRaid(data: { name: string; difficulties: Difficulty[] }): Raid {
    const existingSlugs = getExistingSlugs()
    const id = generateUniqueSlug(data.name, existingSlugs)

    const raid: Raid = {
      id,
      name: data.name,
      difficulties: data.difficulties,
    }

    _raids.push(raid)
    persistToStorage()

    return raid
  }

  function updateRaid(id: string, data: Partial<Pick<Raid, 'name' | 'difficulties'>>): void {
    const index = _raids.findIndex(r => r.id === id)
    if (index === -1) return

    const raid = _raids[index]

    if (data.name !== undefined) {
      raid.name = data.name
      // Note: id (slug) is not updated to preserve references
    }

    if (data.difficulties !== undefined) {
      raid.difficulties = data.difficulties
    }

    persistToStorage()
  }

  function deleteRaid(id: string): void {
    const index = _raids.findIndex(r => r.id === id)
    if (index === -1) return

    _raids.splice(index, 1)
    persistToStorage()

    // Cascade delete: remove all characterRaids for this raid
    const charactersStore = useCharactersStore()
    charactersStore.cascadeDeleteRaid(id)
  }

  // Persist to localStorage
  function persistToStorage(): void {
    defaultConfig.updateConfig([..._raids])
  }

  function loadFromStorage(): void {
    // Use default config logic: load from localStorage or init with defaults
    const initialRaids = defaultConfig.getInitialRaids()
    _raids.splice(0, _raids.length, ...initialRaids)

    // Clean up orphaned characterRaids on load
    const charactersStore = useCharactersStore()
    const allowedRaidIds = new Set(initialRaids.map(r => r.id))
    charactersStore.removeOrphanedRaids(allowedRaidIds)
  }

  // Reset to default raids config
  function resetToDefault(): void {
    const defaults = defaultConfig.resetToDefault()
    _raids.splice(0, _raids.length, ...defaults)

    // Remove orphaned characterRaids that reference non-existent raids
    const charactersStore = useCharactersStore()
    const allowedRaidIds = new Set(defaults.map(r => r.id))
    charactersStore.removeOrphanedRaids(allowedRaidIds)
  }

  // Import data (full replacement)
  function importData(data: { raids: Raid[] }): void {
    _raids.splice(0, _raids.length, ...data.raids)
    persistToStorage()
  }

  return {
    raids: _raids,
    getRaidById,
    getMinGearScore,
    getAvailableRaidsForGearScore,
    addRaid,
    updateRaid,
    deleteRaid,
    loadFromStorage,
    importData,
    resetToDefault,
  }
})