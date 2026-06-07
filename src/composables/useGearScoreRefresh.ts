// Lost Ark Raid Tracker - useGearScoreRefresh Composable
// ======================================================

/**
 * Background gear score refresh composable.
 * Allows updating gear scores for selected characters without blocking the UI.
 */
import { ref, computed, readonly } from 'vue'
import { useCharactersStore } from '@/stores/characters'
import { fetchCharacterGearScore } from '@/services/lostarkApi'

export interface GearScoreRefreshState {
  // Selected character names to refresh
  selectedNames: Set<string>
  // Currently refreshing character name (null if idle)
  currentlyRefreshing: string | null
  // Overall progress
  isRefreshing: boolean
  // Results
  updatedCount: number
  failedCount: number
}

export interface ToastAPI {
  addToast: (item: { message: string; progress?: number; total?: number; status: 'progress' | 'success' | 'error' }) => string
  updateToast: (id: string, updates: Partial<{ message: string; progress: number; total: number; status: 'progress' | 'success' | 'error' }>) => void
  removeToast: (id: string) => void
}

let toastAPI: ToastAPI | null = null

export function setToastAPI(api: ToastAPI) {
  toastAPI = api
}

export function useGearScoreRefresh() {
  const charactersStore = useCharactersStore()

  // State
  const selectedNames = ref<Set<string>>(new Set())
  const currentlyRefreshing = ref<string | null>(null)
  const isRefreshing = ref(false)
  const updatedCount = ref(0)
  const failedCount = ref(0)

  // Computed
  const selectedCount = computed(() => selectedNames.value.size)
  const canRefresh = computed(() => selectedCount.value > 0 && !isRefreshing.value)

  // Toggle selection
  function toggleSelection(characterName: string) {
    const newSet = new Set(selectedNames.value)
    if (newSet.has(characterName)) {
      newSet.delete(characterName)
    } else {
      newSet.add(characterName)
    }
    selectedNames.value = newSet
  }

  // Select all
  function selectAll() {
    selectedNames.value = new Set(charactersStore.characters.map(c => c.name))
  }

  // Select none
  function selectNone() {
    selectedNames.value = new Set()
  }

  // Refresh gear scores in background (non-blocking)
  async function refreshGearScores(): Promise<void> {
    if (!canRefresh.value) {
      return
    }

    isRefreshing.value = true
    updatedCount.value = 0
    failedCount.value = 0

    const names = Array.from(selectedNames.value)
    const total = names.length
    let toastId: string | null = null

    // Show toast
    if (toastAPI) {
      toastId = toastAPI.addToast({
        message: `Обновление ГС: 0/${total}`,
        progress: 0,
        total,
        status: 'progress',
      })
    }

    for (let i = 0; i < names.length; i++) {
      const name = names[i]
      currentlyRefreshing.value = name

      try {
        const newGs = await fetchCharacterGearScore(name)
        if (newGs !== null) {
          charactersStore.updateCharacterGearScore(name, newGs)
          updatedCount.value++
        } else {
          failedCount.value++
        }
      } catch {
        failedCount.value++
      }

      // Update toast progress
      if (toastAPI && toastId) {
        toastAPI.updateToast(toastId, {
          message: `Обновление ГС: ${i + 1}/${total}`,
          progress: i + 1,
        })
      }

      // Small delay to be nice to the API
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    currentlyRefreshing.value = null
    isRefreshing.value = false
    selectedNames.value = new Set()

    // Show completion toast
    if (toastAPI && toastId) {
      toastAPI.updateToast(toastId, {
        message: `ГС обновлён: ${updatedCount.value} | Ошибки: ${failedCount.value}`,
        status: failedCount.value > 0 ? 'error' : 'success',
      })

      // Auto-remove after 3 seconds
      setTimeout(() => {
        if (toastAPI && toastId) {
          toastAPI.removeToast(toastId)
        }
      }, 3000)
    }
  }

  // Reset state
  function reset() {
    selectedNames.value = new Set()
    currentlyRefreshing.value = null
    isRefreshing.value = false
    updatedCount.value = 0
    failedCount.value = 0
  }

  return {
    // State (readonly to prevent mutation)
    selectedNames: readonly(selectedNames),
    currentlyRefreshing: readonly(currentlyRefreshing),
    isRefreshing: readonly(isRefreshing),
    updatedCount: readonly(updatedCount),
    failedCount: readonly(failedCount),
    // Computed
    selectedCount,
    canRefresh,
    // Actions
    toggleSelection,
    selectAll,
    selectNone,
    refreshGearScores,
    reset,
  }
}