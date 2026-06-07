// Lost Ark Raid Tracker - useRaidSelection Composable
// =====================================================

import { ref, computed, readonly } from 'vue'
import type { DifficultyType } from '@/types'

/**
 * Manages raid difficulty selection state.
 * 
 * One raid can have only one difficulty selected at a time.
 * Selecting a different difficulty replaces the previous one for that raid.
 * Supports optional max selection limit.
 * 
 * @example
 * ```ts
 * const { selectedRaids, toggleSelection, isSelected, clearSelection, confirmSelection } = useRaidSelection()
 * ```
 */
export function useRaidSelection(maxSelection?: number) {
  // Private source of truth
  const _selectedRaids = ref<Array<{ raidId: string; difficultyType: DifficultyType }>>([])

  // Public readonly selection count
  const selectedCount = computed(() => _selectedRaids.value.length)

  // Public readonly selections (derived for read-only access)
  const selectedRaids = computed(() => _selectedRaids.value.map(r => ({ ...r })))

  // Check if selection limit reached
  const isLimitReached = computed(() => {
    if (maxSelection === undefined) return false
    return _selectedRaids.value.length >= maxSelection
  })

  // Check if a specific raid+difficulty combination is selected
  function isSelected(raidId: string, difficultyType: DifficultyType): boolean {
    return _selectedRaids.value.some(
      r => r.raidId === raidId && r.difficultyType === difficultyType
    )
  }

  /**
   * Toggle selection for a raid+difficulty.
   * - If already selected: deselect it
   * - If not selected: replace any existing selection for this raid and add new one
   * - Respects maxSelection limit if provided
   */
  function toggleSelection(raidId: string, difficultyType: DifficultyType) {
    const existingIndex = _selectedRaids.value.findIndex(
      r => r.raidId === raidId && r.difficultyType === difficultyType
    )

    if (existingIndex >= 0) {
      // Clicking already selected difficulty - deselect it
      _selectedRaids.value.splice(existingIndex, 1)
    } else {
      // Check if this raid is already selected (switching difficulty)
      const existingRaidIndex = _selectedRaids.value.findIndex(
        r => r.raidId === raidId
      )

      if (existingRaidIndex >= 0) {
        // Raid already selected - just switch difficulty (doesn't add new raid)
        _selectedRaids.value.splice(existingRaidIndex, 1)
        _selectedRaids.value.push({ raidId, difficultyType })
      } else if (isLimitReached.value) {
        // Selection limit reached - do nothing
        return
      } else {
        // Add new raid selection
        _selectedRaids.value.push({ raidId, difficultyType })
      }
    }
  }

  /**
   * Clear all selections
   */
  function clearSelection() {
    _selectedRaids.value = []
  }

  /**
   * Get the selected difficulty type for a raid (if any)
   */
  function getSelectedDifficulty(raidId: string): DifficultyType | undefined {
    const selection = _selectedRaids.value.find(r => r.raidId === raidId)
    return selection?.difficultyType
  }

  /**
   * Get all selections as readonly array (for persisting)
   */
  function getSelectionsForConfirm(): ReadonlyArray<{ raidId: string; difficultyType: DifficultyType }> {
    return readonly(_selectedRaids).value
  }

  return {
    // State (readonly for external access)
    selectedRaids,
    selectedCount,
    isLimitReached,

    // Actions
    isSelected,
    toggleSelection,
    clearSelection,
    getSelectedDifficulty,
    getSelectionsForConfirm,
  }
}