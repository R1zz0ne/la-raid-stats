// Tests for useCharactersStore

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCharactersStore } from '@/stores/characters'
import type { CharacterFormData } from '@/types'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
vi.stubGlobal('localStorage', localStorageMock)

describe('useCharactersStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorageMock.getItem.mockReturnValue(null)
    localStorageMock.setItem.mockClear()
  })

  describe('addCharacter', () => {
    it('adds a character with valid data', () => {
      const store = useCharactersStore()

      const formData: CharacterFormData = {
        name: 'TestChar',
        gearScore: 1700,
        characterClass: 'bard',
      }

      const character = store.addCharacter(formData)

      expect(character).not.toBeNull()
      expect(character?.name).toBe('TestChar')
      expect(character?.gearScore).toBe(1700)
      expect(character?.characterClass).toBe('bard')
      expect(store.characters).toHaveLength(1)
    })

    it('returns null when max characters reached', () => {
      const store = useCharactersStore()

      // Add 30 characters
      for (let i = 0; i < 30; i++) {
        store.addCharacter({
          name: `Char${i}`,
          gearScore: 1500,
          characterClass: 'bard',
        })
      }

      expect(store.characters).toHaveLength(30)
      expect(store.canAddCharacter).toBe(false)

      const result = store.addCharacter({
        name: 'NewChar',
        gearScore: 1600,
        characterClass: 'bard',
      })

      expect(result).toBeNull()
    })

    it('returns null for duplicate name', () => {
      const store = useCharactersStore()

      store.addCharacter({
        name: 'Duplicate',
        gearScore: 1500,
        characterClass: 'bard',
      })

      const result = store.addCharacter({
        name: 'Duplicate',
        gearScore: 1600,
        characterClass: 'bard',
      })

      expect(result).toBeNull()
      expect(store.characters).toHaveLength(1)
    })

    it('auto-sets gold recipient for first 6 characters', () => {
      const store = useCharactersStore()

      for (let i = 0; i < 6; i++) {
        store.addCharacter({
          name: `Char${i}`,
          gearScore: 1500,
          characterClass: 'bard',
        })
      }

      // First 6 should be gold recipients
      store.characters.forEach(c => {
        expect(c.isGoldRecipient).toBe(true)
      })

      // 7th should not be gold recipient
      store.addCharacter({
        name: 'Char6',
        gearScore: 1500,
        characterClass: 'bard',
      })

      const char6 = store.characters.find(c => c.name === 'Char6')
      expect(char6?.isGoldRecipient).toBe(false)
    })

    it('sets order based on character count', () => {
      const store = useCharactersStore()

      store.addCharacter({
        name: 'First',
        gearScore: 1500,
        characterClass: 'bard',
      })

      store.addCharacter({
        name: 'Second',
        gearScore: 1600,
        characterClass: 'bard',
      })

      expect(store.sortedCharacters[0].order).toBe(0)
      expect(store.sortedCharacters[1].order).toBe(1)
    })
  })

  describe('updateCharacter', () => {
    it('updates gear score', () => {
      const store = useCharactersStore()

      const character = store.addCharacter({
        name: 'TestChar',
        gearScore: 1500,
        characterClass: 'bard',
      })

      store.updateCharacter(character!.id, { gearScore: 1700 })

      const updated = store.getCharacterById(character!.id)
      expect(updated?.gearScore).toBe(1700)
    })

    it('updates character class', () => {
      const store = useCharactersStore()

      const character = store.addCharacter({
        name: 'TestChar',
        gearScore: 1500,
        characterClass: 'bard',
      })

      store.updateCharacter(character!.id, { characterClass: 'sorceress' })

      const updated = store.getCharacterById(character!.id)
      expect(updated?.characterClass).toBe('sorceress')
    })

    it('does nothing for non-existent character', () => {
      const store = useCharactersStore()

      expect(() => {
        store.updateCharacter('non-existent', { gearScore: 1700 })
      }).not.toThrow()
    })
  })

  describe('deleteCharacter', () => {
    it('deletes character and cascades characterRaids', () => {
      const store = useCharactersStore()

      const character = store.addCharacter({
        name: 'TestChar',
        gearScore: 1500,
        characterClass: 'bard',
      })

      store.addCharacterRaid({
        characterId: character!.id,
        raidId: 'test-raid',
        difficultyType: 'normal',
      })

      expect(store.characterRaids).toHaveLength(1)

      store.deleteCharacter(character!.id)

      expect(store.characters).toHaveLength(0)
      expect(store.characterRaids).toHaveLength(0)
    })

    it('updates order for remaining characters', () => {
      const store = useCharactersStore()

      const char1 = store.addCharacter({ name: 'Char1', gearScore: 1500, characterClass: 'bard' })
      const char2 = store.addCharacter({ name: 'Char2', gearScore: 1500, characterClass: 'bard' })
      const char3 = store.addCharacter({ name: 'Char3', gearScore: 1500, characterClass: 'bard' })

      store.deleteCharacter(char2!.id)

      expect(store.characters[0].name).toBe('Char1')
      expect(store.characters[0].order).toBe(0)
      expect(store.characters[1].name).toBe('Char3')
      expect(store.characters[1].order).toBe(1)
    })
  })

  describe('goldRecipientCount', () => {
    it('returns correct count', () => {
      const store = useCharactersStore()

      store.addCharacter({ name: 'Char1', gearScore: 1500, characterClass: 'bard' })
      store.addCharacter({ name: 'Char2', gearScore: 1500, characterClass: 'bard' })
      store.addCharacter({ name: 'Char3', gearScore: 1500, characterClass: 'bard' })

      expect(store.goldRecipientCount()).toBe(3)

      store.toggleGoldRecipient('Char1')
      expect(store.goldRecipientCount()).toBe(2)
    })
  })

  describe('toggleGoldRecipient', () => {
    it('toggles gold recipient status', () => {
      const store = useCharactersStore()

      const character = store.addCharacter({
        name: 'TestChar',
        gearScore: 1500,
        characterClass: 'bard',
      })

      expect(character?.isGoldRecipient).toBe(true)

      store.toggleGoldRecipient(character!.id)
      expect(store.getCharacterById(character!.id)?.isGoldRecipient).toBe(false)

      store.toggleGoldRecipient(character!.id)
      expect(store.getCharacterById(character!.id)?.isGoldRecipient).toBe(true)
    })
  })

  describe('addCharacterRaid', () => {
    it('adds raid assignment for character', () => {
      const store = useCharactersStore()

      const character = store.addCharacter({
        name: 'TestChar',
        gearScore: 1500,
        characterClass: 'bard',
      })

      const characterRaid = store.addCharacterRaid({
        characterId: character!.id,
        raidId: 'test-raid',
        difficultyType: 'normal',
      })

      expect(characterRaid).not.toBeNull()
      expect(characterRaid.raidId).toBe('test-raid')
      expect(characterRaid.difficultyType).toBe('normal')
      expect(characterRaid.isCompleted).toBe(false)
    })
  })

  describe('toggleRaidCompleted', () => {
    it('toggles raid completion status', () => {
      const store = useCharactersStore()

      const character = store.addCharacter({
        name: 'TestChar',
        gearScore: 1500,
        characterClass: 'bard',
      })

      const characterRaid = store.addCharacterRaid({
        characterId: character!.id,
        raidId: 'test-raid',
        difficultyType: 'normal',
      })

      expect(characterRaid.isCompleted).toBe(false)

      store.toggleRaidCompleted(characterRaid.id)
      expect(store.characterRaids[0].isCompleted).toBe(true)

      store.toggleRaidCompleted(characterRaid.id)
      expect(store.characterRaids[0].isCompleted).toBe(false)
    })
  })

  describe('resetAllRaidsCompleted', () => {
    it('resets all raids to not completed', () => {
      const store = useCharactersStore()

      const char = store.addCharacter({
        name: 'TestChar',
        gearScore: 1500,
        characterClass: 'bard',
      })

      store.addCharacterRaid({ characterId: char!.id, raidId: 'raid1', difficultyType: 'normal' })
      store.addCharacterRaid({ characterId: char!.id, raidId: 'raid2', difficultyType: 'heroic' })

      store.toggleRaidCompleted(store.characterRaids[0].id)
      store.toggleRaidCompleted(store.characterRaids[1].id)

      expect(store.characterRaids.every(cr => cr.isCompleted)).toBe(true)

      store.resetAllRaidsCompleted()

      expect(store.characterRaids.every(cr => !cr.isCompleted)).toBe(true)
    })
  })

  describe('getRaidsForCharacter', () => {
    it('returns raids for specific character', () => {
      const store = useCharactersStore()

      const char1 = store.addCharacter({ name: 'Char1', gearScore: 1500, characterClass: 'bard' })
      const char2 = store.addCharacter({ name: 'Char2', gearScore: 1500, characterClass: 'bard' })

      store.addCharacterRaid({ characterId: char1!.id, raidId: 'raid1', difficultyType: 'normal' })
      store.addCharacterRaid({ characterId: char2!.id, raidId: 'raid2', difficultyType: 'normal' })

      const char1Raids = store.getRaidsForCharacter(char1!.id)
      const char2Raids = store.getRaidsForCharacter(char2!.id)

      expect(char1Raids).toHaveLength(1)
      expect(char1Raids[0].raidId).toBe('raid1')
      expect(char2Raids).toHaveLength(1)
      expect(char2Raids[0].raidId).toBe('raid2')
    })
  })

  describe('isCharacterGearScoreEnough', () => {
    it('returns true when gear score is sufficient', () => {
      const store = useCharactersStore()

      const character = store.addCharacter({
        name: 'TestChar',
        gearScore: 1700,
        characterClass: 'bard',
      })

      expect(store.isCharacterGearScoreEnough(character!.id, 1600)).toBe(true)
    })

    it('returns false when gear score is insufficient', () => {
      const store = useCharactersStore()

      const character = store.addCharacter({
        name: 'TestChar',
        gearScore: 1500,
        characterClass: 'bard',
      })

      expect(store.isCharacterGearScoreEnough(character!.id, 1600)).toBe(false)
    })

    it('returns false for non-existent character', () => {
      const store = useCharactersStore()

      expect(store.isCharacterGearScoreEnough('non-existent', 1600)).toBe(false)
    })
  })

  describe('reorderCharacters', () => {
    it('updates order based on new array order', () => {
      const store = useCharactersStore()

      const char1 = store.addCharacter({ name: 'Char1', gearScore: 1500, characterClass: 'bard' })
      const char2 = store.addCharacter({ name: 'Char2', gearScore: 1500, characterClass: 'bard' })
      const char3 = store.addCharacter({ name: 'Char3', gearScore: 1500, characterClass: 'bard' })

      // Reorder: char3, char1, char2
      store.reorderCharacters([char3!, char1!, char2!])

      expect(store.sortedCharacters[0].name).toBe('Char3')
      expect(store.sortedCharacters[0].order).toBe(0)
      expect(store.sortedCharacters[1].name).toBe('Char1')
      expect(store.sortedCharacters[1].order).toBe(1)
      expect(store.sortedCharacters[2].name).toBe('Char2')
      expect(store.sortedCharacters[2].order).toBe(2)
    })
  })

  describe('importData', () => {
    it('imports characters and characterRaids', () => {
      const store = useCharactersStore()

      const importData = {
        characters: [
          { id: 'Char1', name: 'Char1', gearScore: 1500, characterClass: 'bard' as const, order: 0, isGoldRecipient: true },
          { id: 'Char2', name: 'Char2', gearScore: 1600, characterClass: 'bard' as const, order: 1, isGoldRecipient: false },
        ],
        characterRaids: [
          { id: 'cr1', characterId: 'Char1', raidId: 'raid1', difficultyType: 'normal' as const, isCompleted: false, createdAt: Date.now() },
        ],
      }

      store.importData(importData)

      expect(store.characters).toHaveLength(2)
      expect(store.characterRaids).toHaveLength(1)
    })

    it('filters out characterRaids with non-existent raid references', () => {
      const store = useCharactersStore()

      const importData = {
        characters: [
          { id: 'Char1', name: 'Char1', gearScore: 1500, characterClass: 'bard' as const, order: 0, isGoldRecipient: true },
        ],
        characterRaids: [
          { id: 'cr1', characterId: 'Char1', raidId: 'existing-raid', difficultyType: 'normal' as const, isCompleted: false, createdAt: Date.now() },
          { id: 'cr2', characterId: 'Char1', raidId: 'non-existent-raid', difficultyType: 'normal' as const, isCompleted: false, createdAt: Date.now() },
        ],
      }

      store.importData(importData, new Set(['existing-raid']))

      expect(store.characterRaids).toHaveLength(1)
      expect(store.characterRaids[0].raidId).toBe('existing-raid')
    })
  })

  describe('persistence', () => {
    it('saves to localStorage on state change', () => {
      const store = useCharactersStore()

      store.addCharacter({
        name: 'TestChar',
        gearScore: 1500,
        characterClass: 'bard',
      })

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'la-raid-stats-characters',
        expect.any(String)
      )
    })
  })
})