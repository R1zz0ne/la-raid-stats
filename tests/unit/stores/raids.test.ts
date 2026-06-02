// Tests for useRaidsStore

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRaidsStore } from '@/stores/raids'
import type { Raid, Difficulty } from '@/types'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
vi.stubGlobal('localStorage', localStorageMock)

// Mock useDefaultRaidsConfig
vi.mock('@/composables/useDefaultRaidsConfig', () => ({
  useDefaultRaidsConfig: () => ({
    getInitialRaids: () => [],
    resetToDefault: () => [],
    updateConfig: vi.fn(),
    hasCustomConfig: { value: false },
  }),
}))

// Mock useCharactersStore
vi.mock('@/stores/characters', () => ({
  useCharactersStore: () => ({
    cascadeDeleteRaid: vi.fn(),
    removeOrphanedRaids: vi.fn(),
  }),
}))

describe('useRaidsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorageMock.getItem.mockReturnValue(null)
    localStorageMock.setItem.mockClear()
  })

  describe('addRaid', () => {
    it('adds a raid with difficulties', () => {
      const store = useRaidsStore()

      const difficulties: Difficulty[] = [
        { type: 'normal', requiredGearScore: 1500, regularGold: 100, limitedGold: 50 },
        { type: 'heroic', requiredGearScore: 1700, regularGold: 200, limitedGold: 100 },
      ]

      const raid = store.addRaid({
        name: 'Test Raid',
        difficulties,
      })

      expect(raid).not.toBeNull()
      expect(raid.name).toBe('Test Raid')
      expect(raid.difficulties).toHaveLength(2)
      expect(store.raids).toHaveLength(1)
    })

    it('generates unique slug for duplicate names', () => {
      const store = useRaidsStore()

      store.addRaid({ name: 'Test Raid', difficulties: [] })

      const raid2 = store.addRaid({ name: 'Test Raid', difficulties: [] })

      expect(store.raids).toHaveLength(2)
      expect(raid2.id).not.toBe(store.raids[0].id)
      expect(raid2.id).toContain('test-raid')
    })
  })

  describe('updateRaid', () => {
    it('updates raid name', () => {
      const store = useRaidsStore()

      const raid = store.addRaid({
        name: 'Original Name',
        difficulties: [
          { type: 'normal', requiredGearScore: 1500, regularGold: 100, limitedGold: 50 },
        ],
      })

      store.updateRaid(raid.id, { name: 'Updated Name' })

      const updated = store.getRaidById(raid.id)
      expect(updated?.name).toBe('Updated Name')
    })

    it('updates raid difficulties', () => {
      const store = useRaidsStore()

      const raid = store.addRaid({
        name: 'Test Raid',
        difficulties: [
          { type: 'normal', requiredGearScore: 1500, regularGold: 100, limitedGold: 50 },
        ],
      })

      const newDifficulties: Difficulty[] = [
        { type: 'normal', requiredGearScore: 1500, regularGold: 150, limitedGold: 75 },
        { type: 'heroic', requiredGearScore: 1700, regularGold: 250, limitedGold: 125 },
      ]

      store.updateRaid(raid.id, { difficulties: newDifficulties })

      const updated = store.getRaidById(raid.id)
      expect(updated?.difficulties).toHaveLength(2)
    })
  })

  describe('deleteRaid', () => {
    it('deletes raid and cascades characterRaids', () => {
      const store = useRaidsStore()

      const raid = store.addRaid({
        name: 'Test Raid',
        difficulties: [
          { type: 'normal', requiredGearScore: 1500, regularGold: 100, limitedGold: 50 },
        ],
      })

      expect(store.raids).toHaveLength(1)

      store.deleteRaid(raid.id)

      expect(store.raids).toHaveLength(0)
    })
  })

  describe('getRaidById', () => {
    it('returns raid by id', () => {
      const store = useRaidsStore()

      const raid = store.addRaid({
        name: 'Test Raid',
        difficulties: [
          { type: 'normal', requiredGearScore: 1500, regularGold: 100, limitedGold: 50 },
        ],
      })

      const found = store.getRaidById(raid.id)

      expect(found).not.toBeNull()
      expect(found?.name).toBe('Test Raid')
    })

    it('returns undefined for non-existent raid', () => {
      const store = useRaidsStore()

      const found = store.getRaidById('non-existent')

      expect(found).toBeUndefined()
    })
  })

  describe('getMinGearScore', () => {
    it('returns minimum gear score from difficulties', () => {
      const store = useRaidsStore()

      const raid = store.addRaid({
        name: 'Test Raid',
        difficulties: [
          { type: 'solo', requiredGearScore: 1000, regularGold: 50, limitedGold: 25 },
          { type: 'normal', requiredGearScore: 1500, regularGold: 100, limitedGold: 50 },
          { type: 'heroic', requiredGearScore: 1700, regularGold: 200, limitedGold: 100 },
        ],
      })

      expect(store.getMinGearScore(raid)).toBe(1000)
    })

    it('returns 0 for raid with no difficulties', () => {
      const store = useRaidsStore()

      const raid = store.addRaid({
        name: 'Empty Raid',
        difficulties: [],
      })

      expect(store.getMinGearScore(raid)).toBe(0)
    })
  })

  describe('getAvailableRaidsForGearScore', () => {
    it('filters raids by gear score', () => {
      const store = useRaidsStore()

      store.addRaid({
        name: 'Low Raid',
        difficulties: [{ type: 'solo', requiredGearScore: 1000, regularGold: 50, limitedGold: 25 }],
      })

      store.addRaid({
        name: 'High Raid',
        difficulties: [{ type: 'normal', requiredGearScore: 2000, regularGold: 200, limitedGold: 100 }],
      })

      const available = store.getAvailableRaidsForGearScore(1500)

      expect(available).toHaveLength(1)
      expect(available[0].name).toBe('Low Raid')
    })

    it('returns all raids when gear score is high enough', () => {
      const store = useRaidsStore()

      store.addRaid({
        name: 'Low Raid',
        difficulties: [{ type: 'solo', requiredGearScore: 1000, regularGold: 50, limitedGold: 25 }],
      })

      store.addRaid({
        name: 'High Raid',
        difficulties: [{ type: 'normal', requiredGearScore: 2000, regularGold: 200, limitedGold: 100 }],
      })

      const available = store.getAvailableRaidsForGearScore(2500)

      expect(available).toHaveLength(2)
    })
  })

  describe('resetToDefault', () => {
    it('resets raids to default configuration', () => {
      const store = useRaidsStore()

      // Add custom raid
      store.addRaid({
        name: 'Custom Raid',
        difficulties: [
          { type: 'normal', requiredGearScore: 1500, regularGold: 100, limitedGold: 50 },
        ],
      })

      expect(store.raids).toHaveLength(1)

      store.resetToDefault()

      // After reset, should have default raids (which are empty in mock)
      expect(store.raids).toHaveLength(0)
    })
  })

  describe('importData', () => {
    it('imports raids', () => {
      const store = useRaidsStore()

      const raids: Raid[] = [
        {
          id: 'raid-1',
          name: 'Imported Raid 1',
          difficulties: [
            { type: 'normal', requiredGearScore: 1500, regularGold: 100, limitedGold: 50 },
          ],
        },
        {
          id: 'raid-2',
          name: 'Imported Raid 2',
          difficulties: [
            { type: 'heroic', requiredGearScore: 1700, regularGold: 200, limitedGold: 100 },
          ],
        },
      ]

      store.importData({ raids })

      expect(store.raids).toHaveLength(2)
      expect(store.raids[0].name).toBe('Imported Raid 1')
      expect(store.raids[1].name).toBe('Imported Raid 2')
    })
  })
})