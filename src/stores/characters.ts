// Lost Ark Raid Tracker - useCharactersStore
// =========================================

import { defineStore } from 'pinia'
import { reactive, computed } from 'vue'
import type {
  Character,
  CharacterRaid,
  CharacterFormData,
  GoldSummary,
  DifficultyType,
} from '@/types'
import { useRaidsStore } from './raids'

const STORAGE_KEY = 'la-raid-stats-characters'
const STORAGE_KEY_RAIDS = 'la-raid-stats-character-raids'
const MAX_CHARACTERS = 30

export const useCharactersStore = defineStore('characters', () => {
  // State - use reactive for object/array
  const _characters = reactive<Character[]>([])
  const _characterRaids = reactive<CharacterRaid[]>([])

  // Getters
  function getCharacterById(id: string): Character | undefined {
    return _characters.find(c => c.id === id)
  }

  function getRaidsForCharacter(characterId: string): CharacterRaid[] {
    return _characterRaids
      .filter(cr => cr.characterId === characterId)
      .sort((a, b) => b.createdAt - a.createdAt) // Newest first
  }

  // Check if gear score is enough for a specific gear score requirement
  function isCharacterGearScoreEnough(characterId: string, requiredGearScore: number): boolean {
    const character = getCharacterById(characterId)
    if (!character) return false
    return character.gearScore >= requiredGearScore
  }

  // Get gold summary for a character
  function getGoldSummary(characterId: string): GoldSummary {
    const raidsStore = useRaidsStore()
    const characterRaids = getRaidsForCharacter(characterId)

    let regular = 0
    let limited = 0

    for (const cr of characterRaids) {
      if (!cr.isCompleted) continue

      const raid = raidsStore.getRaidById(cr.raidId)
      if (!raid) continue

      const difficulty = raid.difficulties.find(d => d.type === cr.difficultyType)
      if (!difficulty) continue

      regular += difficulty.regularGold
      limited += difficulty.limitedGold
    }

    return {
      regular,
      limited,
      total: regular + limited,
    }
  }

  // Sorted characters (by order, then by creation order)
  const sortedCharacters = computed(() => {
    return [..._characters].sort((a, b) => a.order - b.order)
  })

  // Check if can add more characters
  const canAddCharacter = computed(() => {
    return _characters.length < MAX_CHARACTERS
  })

  // Count gold recipients
  function goldRecipientCount(): number {
    return _characters.filter(c => c.isGoldRecipient).length
  }

  // Actions
  function addCharacter(data: CharacterFormData): Character | null {
    if (!canAddCharacter.value) {
      return null
    }

    // Check for duplicate name
    if (_characters.some(c => c.id === data.name)) {
      return null
    }

    const character: Character = {
      id: data.name, // id equals name (unique)
      name: data.name,
      gearScore: data.gearScore,
      characterClass: data.characterClass,
      customClassName: data.customClassName,
      order: _characters.length,
      // Auto-set gold recipient if less than 6 recipients exist
      isGoldRecipient: goldRecipientCount() < 6,
    }

    _characters.push(character)
    persistToStorage()

    return character
  }

  // Toggle gold recipient status
  function toggleGoldRecipient(id: string): void {
    const index = _characters.findIndex(c => c.id === id)
    if (index === -1) return

    _characters[index].isGoldRecipient = !_characters[index].isGoldRecipient
    persistToStorage()
  }

  function updateCharacter(id: string, data: Partial<Pick<Character, 'gearScore' | 'characterClass' | 'customClassName' | 'isGoldRecipient'>>): void {
    const index = _characters.findIndex(c => c.id === id)
    if (index === -1) return

    const character = _characters[index]

    if (data.gearScore !== undefined) {
      character.gearScore = data.gearScore
    }

    if (data.characterClass !== undefined) {
      character.characterClass = data.characterClass
    }

    if (data.customClassName !== undefined) {
      character.customClassName = data.customClassName
    }

    if (data.isGoldRecipient !== undefined) {
      character.isGoldRecipient = data.isGoldRecipient
    }

    persistToStorage()
  }

  function deleteCharacter(id: string): void {
    const index = _characters.findIndex(c => c.id === id)
    if (index === -1) return

    _characters.splice(index, 1)

    // Cascade delete: remove all characterRaids for this character
    const raidIndices = _characterRaids
      .map((cr, i) => (cr.characterId === id ? i : -1))
      .filter(i => i !== -1)
      .sort((a, b) => b - a) // Sort descending to remove from end

    for (const i of raidIndices) {
      _characterRaids.splice(i, 1)
    }

    // Update order for remaining characters
    _characters.forEach((c, index) => {
      c.order = index
    })

    persistToStorage()
    persistCharacterRaidsToStorage()
  }

  function addCharacterRaid(data: {
    characterId: string
    raidId: string
    difficultyType: DifficultyType
  }): CharacterRaid {
    const characterRaid: CharacterRaid = {
      id: crypto.randomUUID(),
      characterId: data.characterId,
      raidId: data.raidId,
      difficultyType: data.difficultyType,
      isCompleted: false,
      createdAt: Date.now(),
    }

    _characterRaids.push(characterRaid)
    persistCharacterRaidsToStorage()

    return characterRaid
  }

  function updateCharacterRaid(id: string, data: Partial<Pick<CharacterRaid, 'difficultyType'>>): void {
    const index = _characterRaids.findIndex(cr => cr.id === id)
    if (index === -1) return

    const cr = _characterRaids[index]

    if (data.difficultyType !== undefined) {
      cr.difficultyType = data.difficultyType
    }

    persistCharacterRaidsToStorage()
  }

  function deleteCharacterRaid(id: string): void {
    const index = _characterRaids.findIndex(cr => cr.id === id)
    if (index === -1) return

    _characterRaids.splice(index, 1)
    persistCharacterRaidsToStorage()
  }

  function toggleRaidCompleted(id: string): void {
    const index = _characterRaids.findIndex(cr => cr.id === id)
    if (index === -1) return

    _characterRaids[index].isCompleted = !_characterRaids[index].isCompleted
    persistCharacterRaidsToStorage()
  }

  function resetAllRaidsCompleted(): void {
    let hasChanges = false
    for (const cr of _characterRaids) {
      if (cr.isCompleted) {
        cr.isCompleted = false
        hasChanges = true
      }
    }
    if (hasChanges) {
      persistCharacterRaidsToStorage()
    }
  }

  function reorderCharacters(newOrder: Character[]): void {
    // Update order for all characters
    newOrder.forEach((char, index) => {
      const found = _characters.find(c => c.id === char.id)
      if (found) {
        found.order = index
      }
    })

    persistToStorage()
  }

  // Persist to localStorage
  function persistToStorage(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_characters))
  }

  function persistCharacterRaidsToStorage(): void {
    localStorage.setItem(STORAGE_KEY_RAIDS, JSON.stringify(_characterRaids))
  }

  function loadFromStorage(): void {
    // Load characters
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const data = JSON.parse(stored)
        if (Array.isArray(data)) {
          _characters.splice(0, _characters.length, ...data)
        }
      } catch {
        // Invalid JSON, ignore
      }
    }

    // Load characterRaids
    const storedRaids = localStorage.getItem(STORAGE_KEY_RAIDS)
    if (storedRaids) {
      try {
        const data = JSON.parse(storedRaids)
        if (Array.isArray(data)) {
          _characterRaids.splice(0, _characterRaids.length, ...data)
        }
      } catch {
        // Invalid JSON, ignore
      }
    }
  }

  // Import data (full replacement)
  // When importing characters only, allowedRaidIds can be provided to filter out
  // characterRaids that reference raids not in the allowed set
  function importData(
    data: { characters: Character[]; characterRaids: CharacterRaid[] },
    allowedRaidIds?: Set<string>
  ): void {
    _characters.splice(0, _characters.length, ...data.characters)

    // Filter characterRaids to only include those with valid raid references
    const validCharacterRaids = allowedRaidIds
      ? data.characterRaids.filter(cr => allowedRaidIds.has(cr.raidId))
      : data.characterRaids

    _characterRaids.splice(0, _characterRaids.length, ...validCharacterRaids)
    persistToStorage()
    persistCharacterRaidsToStorage()
  }

  // Cascade delete from raids store
  function cascadeDeleteRaid(raidId: string): void {
    // Remove all characterRaids for this raid
    const indices = _characterRaids
      .map((cr, i) => (cr.raidId === raidId ? i : -1))
      .filter(i => i !== -1)
      .sort((a, b) => b - a)

    for (const i of indices) {
      _characterRaids.splice(i, 1)
    }

    persistCharacterRaidsToStorage()
  }

  // Remove characterRaids that reference raids not in the allowed list
  function removeOrphanedRaids(allowedRaidIds: Set<string>): void {
    const indices = _characterRaids
      .map((cr, i) => (!allowedRaidIds.has(cr.raidId) ? i : -1))
      .filter(i => i !== -1)
      .sort((a, b) => b - a)

    for (const i of indices) {
      _characterRaids.splice(i, 1)
    }

    persistCharacterRaidsToStorage()
  }

  return {
    characters: _characters,
    characterRaids: _characterRaids,
    sortedCharacters,
    canAddCharacter,
    goldRecipientCount,
    getCharacterById,
    getRaidsForCharacter,
    getGoldSummary,
    isCharacterGearScoreEnough,
    toggleGoldRecipient,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    addCharacterRaid,
    updateCharacterRaid,
    deleteCharacterRaid,
    toggleRaidCompleted,
    resetAllRaidsCompleted,
    reorderCharacters,
    loadFromStorage,
    importData,
    cascadeDeleteRaid,
    removeOrphanedRaids,
  }
})