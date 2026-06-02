// Тесты для непокрытых методов characters store

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCharactersStore } from '@/stores/characters'
import { MAX_GOLD_RECIPIENTS } from '@/constants'
import type { Character, CharacterRaid } from '@/types'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}

vi.stubGlobal('localStorage', localStorageMock)

// Mock crypto.randomUUID
let mockIdCounter = 0
vi.stubGlobal('crypto', { randomUUID: vi.fn(() => `test-uuid-${++mockIdCounter}`) })

describe('useCharactersStore - дополнительные тесты', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockIdCounter = 0
    localStorageMock.getItem.mockReturnValue(null)
    localStorageMock.setItem.mockClear()
    vi.clearAllMocks()
  })

  describe('goldRecipientCount', () => {
    it('returns 0 initially', () => {
      const store = useCharactersStore()
      expect(store.goldRecipientCount()).toBe(0)
    })

    it('counts gold recipients', () => {
      const store = useCharactersStore()
      store.addCharacter({ name: 'Char1', gearScore: 1500, characterClass: 'bard' })
      store.addCharacter({ name: 'Char2', gearScore: 1500, characterClass: 'bard' })
      
      expect(store.goldRecipientCount()).toBe(2)
    })

    it('respects max limit', () => {
      const store = useCharactersStore()
      for (let i = 0; i < MAX_GOLD_RECIPIENTS + 2; i++) {
        store.addCharacter({ name: `Char${i}`, gearScore: 1500, characterClass: 'bard' })
      }
      
      expect(store.goldRecipientCount()).toBeLessThanOrEqual(MAX_GOLD_RECIPIENTS)
    })
  })

  describe('resetAllRaidsCompleted', () => {
    it('resets all completed raids to not completed', () => {
      const store = useCharactersStore()
      const char = store.addCharacter({ name: 'TestChar', gearScore: 1500, characterClass: 'bard' })
      
      const cr1 = store.addCharacterRaid({ characterId: char!.id, raidId: 'raid-1', difficultyType: 'normal' })
      const cr2 = store.addCharacterRaid({ characterId: char!.id, raidId: 'raid-2', difficultyType: 'normal' })
      
      // CharacterRaids start with isCompleted: false, toggle once to set to true
      store.toggleRaidCompleted(cr1.id)
      store.toggleRaidCompleted(cr2.id)
      
      // Verify both are completed
      const cr1sAfterToggle = store.characterRaids.find(cr => cr.id === cr1.id)
      const cr2sAfterToggle = store.characterRaids.find(cr => cr.id === cr2.id)
      expect(cr1sAfterToggle?.isCompleted).toBe(true)
      expect(cr2sAfterToggle?.isCompleted).toBe(true)
      
      store.resetAllRaidsCompleted()
      
      // Verify both are not completed
      const cr1sAfterReset = store.characterRaids.find(cr => cr.id === cr1.id)
      const cr2sAfterReset = store.characterRaids.find(cr => cr.id === cr2.id)
      expect(cr1sAfterReset?.isCompleted).toBe(false)
      expect(cr2sAfterReset?.isCompleted).toBe(false)
    })

    it('does not persist if no changes', () => {
      const store = useCharactersStore()
      store.addCharacter({ name: 'TestChar', gearScore: 1500, characterClass: 'bard' })
      
      // CharacterRaid starts with isCompleted: false, so resetting should not trigger persist
      localStorageMock.setItem.mockClear()
      vi.clearAllMocks()
      
      store.resetAllRaidsCompleted()
      
      // Verify no persist calls were made when there are no completed raids
      const characterRaidsCalls = localStorageMock.setItem.mock.calls.filter(
        call => typeof call[0] === 'string' && call[0].includes('character-raids')
      )
      expect(characterRaidsCalls).toHaveLength(0)
    })
  })

  describe('reorderCharacters', () => {
    it('updates order for all characters', () => {
      const store = useCharactersStore()
      const char1 = store.addCharacter({ name: 'Char1', gearScore: 1500, characterClass: 'bard' })
      const char2 = store.addCharacter({ name: 'Char2', gearScore: 1500, characterClass: 'bard' })
      const char3 = store.addCharacter({ name: 'Char3', gearScore: 1500, characterClass: 'bard' })
      
      // Reorder: char3, char1, char2
      store.reorderCharacters([char3!, char1!, char2!])
      
      const sorted = store.sortedCharacters
      expect(sorted[0].name).toBe('Char3')
      expect(sorted[1].name).toBe('Char1')
      expect(sorted[2].name).toBe('Char2')
      
      expect(sorted[0].order).toBe(0)
      expect(sorted[1].order).toBe(1)
      expect(sorted[2].order).toBe(2)
    })

    it('ignores non-existent characters', () => {
      const store = useCharactersStore()
      const char1 = store.addCharacter({ name: 'Char1', gearScore: 1500, characterClass: 'bard' })
      
      // Pass non-existent character
      store.reorderCharacters([char1!, { id: 'nonexistent', name: 'Ghost', gearScore: 0, characterClass: 'bard', order: 0 }])
      
      // Char1 should still be at order 0
      expect(store.sortedCharacters[0].order).toBe(0)
    })
  })

  describe('loadFromStorage', () => {
    it('loads characters from localStorage', () => {
      const mockData = JSON.stringify([{ id: 'stored', name: 'StoredChar', gearScore: 1500, characterClass: 'bard', order: 0 }])
      localStorageMock.getItem.mockImplementation((key: string) => {
        if (key?.includes('characters')) return mockData
        return null
      })
      
      const store = useCharactersStore()
      store.loadFromStorage()
      
      expect(store.characters).toHaveLength(1)
      expect(store.getCharacterById('stored')?.name).toBe('StoredChar')
    })

    it('handles invalid JSON gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json')
      
      const store = useCharactersStore()
      
      expect(() => store.loadFromStorage()).not.toThrow()
      expect(store.characters).toHaveLength(0)
    })

    it('ignores non-array data', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({ name: 'not-an-array' }))
      
      const store = useCharactersStore()
      store.loadFromStorage()
      
      expect(store.characters).toHaveLength(0)
    })

    it('loads characterRaids from localStorage', () => {
      const mockRaid = { id: 'cr1', characterId: 'Char1', raidId: 'raid-1', difficultyType: 'normal', isCompleted: false, createdAt: Date.now() }
      
      localStorageMock.getItem.mockImplementation((key: string) => {
        if (key?.includes('character-raids')) return JSON.stringify([mockRaid])
        return null
      })
      
      const store = useCharactersStore()
      store.loadFromStorage()
      
      expect(store.characterRaids).toHaveLength(1)
    })
  })

  describe('importData', () => {
    it('replaces all data', () => {
      const store = useCharactersStore()
      
      const character: Character = {
        id: 'imported',
        name: 'ImportedChar',
        gearScore: 1700,
        characterClass: 'sorceress',
        order: 0,
      }
      
      const characterRaid: CharacterRaid = {
        id: 'cr1',
        characterId: 'imported',
        raidId: 'raid-1',
        difficultyType: 'normal',
        isCompleted: true,
        createdAt: Date.now(),
      }
      
      store.importData({ characters: [character], characterRaids: [characterRaid] })
      
      expect(store.characters).toHaveLength(1)
      expect(store.characterRaids).toHaveLength(1)
    })

    it('filters raids with allowedRaidIds', () => {
      const store = useCharactersStore()
      const char1 = store.addCharacter({ name: 'Char1', gearScore: 1500, characterClass: 'bard' })
      
      store.addCharacterRaid({ characterId: char1!.id, raidId: 'allowed-raid', difficultyType: 'normal' })
      store.addCharacterRaid({ characterId: char1!.id, raidId: 'disallowed-raid', difficultyType: 'normal' })
      
      store.importData(
        {
          characters: [...store.characters],
          characterRaids: [...store.characterRaids],
        },
        new Set(['allowed-raid'])
      )
      
      expect(store.characterRaids).toHaveLength(1)
      expect(store.characterRaids[0].raidId).toBe('allowed-raid')
    })
  })

  describe('cascadeDeleteRaid', () => {
    it('removes all characterRaids for a raid', () => {
      const store = useCharactersStore()
      const char1 = store.addCharacter({ name: 'Char1', gearScore: 1500, characterClass: 'bard' })
      
      store.addCharacterRaid({ characterId: char1!.id, raidId: 'raid-1', difficultyType: 'normal' })
      store.addCharacterRaid({ characterId: char1!.id, raidId: 'raid-2', difficultyType: 'normal' })
      store.addCharacterRaid({ characterId: char1!.id, raidId: 'raid-1', difficultyType: 'heroic' })
      
      expect(store.characterRaids).toHaveLength(3)
      
      store.cascadeDeleteRaid('raid-1')
      
      expect(store.characterRaids).toHaveLength(1)
      expect(store.characterRaids[0].raidId).toBe('raid-2')
    })
  })

  describe('removeOrphanedRaids', () => {
    it('removes characterRaids referencing no longer existing raids', () => {
      const store = useCharactersStore()
      const char1 = store.addCharacter({ name: 'Char1', gearScore: 1500, characterClass: 'bard' })
      
      store.addCharacterRaid({ characterId: char1!.id, raidId: 'old-raid', difficultyType: 'normal' })
      store.addCharacterRaid({ characterId: char1!.id, raidId: 'valid-raid', difficultyType: 'normal' })
      
      expect(store.characterRaids).toHaveLength(2)
      
      store.removeOrphanedRaids(new Set(['valid-raid']))
      
      expect(store.characterRaids).toHaveLength(1)
      expect(store.characterRaids[0].raidId).toBe('valid-raid')
    })
  })

  describe('updateCharacterRaid', () => {
    it('updates raid difficulty', () => {
      const store = useCharactersStore()
      const char = store.addCharacter({ name: 'TestChar', gearScore: 1500, characterClass: 'bard' })
      
      const cr = store.addCharacterRaid({ characterId: char!.id, raidId: 'raid-1', difficultyType: 'normal' })
      
      store.updateCharacterRaid(cr.id, { difficultyType: 'heroic' })
      
      expect(store.characterRaids[0].difficultyType).toBe('heroic')
    })

    it('does nothing for non-existent raid', () => {
      const store = useCharactersStore()
      
      expect(() => {
        store.updateCharacterRaid('non-existent', { difficultyType: 'heroic' })
      }).not.toThrow()
    })
  })
})