// Tests for useRaidSelection composable

import { describe, it, expect } from 'vitest'
import { useRaidSelection } from '@/composables/useRaidSelection'

describe('useRaidSelection', () => {
  describe('initialization', () => {
    it('creates empty selection', () => {
      const { selectedRaids, selectedCount } = useRaidSelection()
      expect(selectedRaids.value).toHaveLength(0)
      expect(selectedCount.value).toBe(0)
    })

    it('returns all expected methods', () => {
      const selection = useRaidSelection()
      
      expect(typeof selection.toggleSelection).toBe('function')
      expect(typeof selection.clearSelection).toBe('function')
      expect(typeof selection.isSelected).toBe('function')
      expect(typeof selection.getSelectedDifficulty).toBe('function')
      expect(typeof selection.getSelectionsForConfirm).toBe('function')
    })
  })

  describe('toggleSelection', () => {
    it('selects a raid', () => {
      const { toggleSelection, selectedRaids } = useRaidSelection()
      
      toggleSelection('raid-1', 'normal')
      
      expect(selectedRaids.value).toContainEqual({ raidId: 'raid-1', difficultyType: 'normal' })
    })

    it('removes selection when toggling same raid and difficulty', () => {
      const { toggleSelection, selectedRaids } = useRaidSelection()
      
      toggleSelection('raid-1', 'normal')
      expect(selectedRaids.value).toHaveLength(1)
      
      toggleSelection('raid-1', 'normal')
      expect(selectedRaids.value).toHaveLength(0)
    })

    it('replaces difficulty when toggling different difficulty for same raid', () => {
      const { toggleSelection, selectedRaids } = useRaidSelection()
      
      toggleSelection('raid-1', 'normal')
      expect(selectedRaids.value[0].difficultyType).toBe('normal')
      
      toggleSelection('raid-1', 'heroic')
      expect(selectedRaids.value).toHaveLength(1)
      expect(selectedRaids.value[0].difficultyType).toBe('heroic')
    })
  })

  describe('isSelected', () => {
    it('returns true for selected raid', () => {
      const { toggleSelection, isSelected } = useRaidSelection()
      
      toggleSelection('raid-1', 'normal')
      
      expect(isSelected('raid-1', 'normal')).toBe(true)
    })

    it('returns false for non-selected raid', () => {
      const { isSelected } = useRaidSelection()
      
      expect(isSelected('raid-1', 'normal')).toBe(false)
    })

    it('returns false for different difficulty', () => {
      const { toggleSelection, isSelected } = useRaidSelection()
      
      toggleSelection('raid-1', 'normal')
      
      expect(isSelected('raid-1', 'heroic')).toBe(false)
    })
  })

  describe('clearSelection', () => {
    it('clears all selections', () => {
      const { toggleSelection, clearSelection, selectedRaids } = useRaidSelection()
      
      toggleSelection('raid-1', 'normal')
      toggleSelection('raid-2', 'normal')
      expect(selectedRaids.value).toHaveLength(2)
      
      clearSelection()
      
      expect(selectedRaids.value).toHaveLength(0)
    })
  })

  describe('getSelectedDifficulty', () => {
    it('returns selected difficulty for raid', () => {
      const { toggleSelection, getSelectedDifficulty } = useRaidSelection()
      
      toggleSelection('raid-1', 'heroic')
      
      expect(getSelectedDifficulty('raid-1')).toBe('heroic')
    })

    it('returns undefined for non-selected raid', () => {
      const { getSelectedDifficulty } = useRaidSelection()
      
      expect(getSelectedDifficulty('raid-1')).toBeUndefined()
    })
  })
})