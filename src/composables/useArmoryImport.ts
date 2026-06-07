// Lost Ark Raid Tracker - useArmoryImport Composable
// ====================================================

import { ref, computed, onUnmounted, type Ref, type ComputedRef } from 'vue'
import { fetchArmoryCharacters, fetchGearScoresBatch, CharacterNotFoundError, type ArmoryCharacter } from '@/services/lostarkApi'
import { useCharactersStore } from '@/stores/characters'

export interface UseArmoryImportOptions {
  /**
   * Callback fired after successful import
   */
  onImported?: (result: { added: number; updated: number }) => void
}

export interface UseArmoryImportReturn {
  // State
  characterName: Ref<string>
  characters: Ref<ArmoryCharacter[]>
  selectedNames: Ref<Set<string>>
  gearScores: Ref<Map<string, number>>
  loading: Ref<boolean>
  gsLoading: Ref<boolean>
  gsProgress: Ref<{ current: number; total: number }>
  error: Ref<string>

  // UI state
  isOpen: Ref<boolean>

  // Computed
  hasCharacters: ComputedRef<boolean>
  selectedCount: ComputedRef<number>
  canFetch: ComputedRef<boolean>
  canImport: ComputedRef<boolean>
  canFetchGearScores: ComputedRef<boolean>
  selectedCharacters: ComputedRef<ArmoryCharacter[]>

  // Actions
  setCharacterName: (name: string) => void
  fetchCharacters: () => Promise<void>
  fetchGearScores: () => Promise<void>
  toggleCharacter: (name: string) => void
  selectAll: () => void
  selectNone: () => void
  importSelected: () => void
  open: () => void
  close: () => void
  reset: () => void
}

/**
 * Composable for importing characters from Lost Ark Armory (Оружейная)
 * Manages the entire import workflow: search, select, import
 */
export function useArmoryImport(options: UseArmoryImportOptions = {}): UseArmoryImportReturn {
  const charactersStore = useCharactersStore()

  // === State ===
  const characterName = ref('')
  const characters = ref<ArmoryCharacter[]>([])
  const selectedNames = ref<Set<string>>(new Set())
  const gearScores = ref<Map<string, number>>(new Map())
  const loading = ref(false)
  const gsLoading = ref(false)
  const gsProgress = ref({ current: 0, total: 0 })
  const error = ref('')
  const isOpen = ref(false)

  // === Computed ===
  const hasCharacters = computed(() => characters.value.length > 0)

  const selectedCount = computed(() => selectedNames.value.size)

  const canFetch = computed(() => {
    const name = characterName.value.trim()
    return name.length >= 2 && !loading.value
  })

  const canImport = computed(() => {
    return selectedCount.value > 0 && !loading.value
  })

  const canFetchGearScores = computed(() => {
    return selectedCount.value > 0 && !gsLoading.value && !loading.value
  })

  const selectedCharacters = computed(() => {
    return characters.value.filter((c: ArmoryCharacter) => selectedNames.value.has(c.name))
  })

  // === Actions ===
  function setCharacterName(name: string) {
    characterName.value = name
  }

  async function fetchCharacters() {
    const name = characterName.value.trim()
    if (name.length < 2) return

    loading.value = true
    error.value = ''

    try {
      const response = await fetchArmoryCharacters(name)
      characters.value = response.characters
      gearScores.value.clear()

      // Initialize gear scores from main character (already has GS from first request)
      const mainCharName = response.mainCharacter.toLowerCase()
      const mainChar = response.characters.find(c => c.name.toLowerCase() === mainCharName)
      if (mainChar && mainChar.gearScore && mainChar.gearScore > 0) {
        gearScores.value.set(mainChar.name, mainChar.gearScore)
      }

      // Auto-select all characters
      selectedNames.value = new Set(response.characters.map((c: ArmoryCharacter) => c.name))
    } catch (err) {
      // Character not found - show specific message
      if (err instanceof CharacterNotFoundError) {
        error.value = err.message
      } else {
        error.value = err instanceof Error
          ? err.message
          : 'Не удалось загрузить персонажей. Проверьте ник и попробуйте снова.'
      }
      characters.value = []
      selectedNames.value.clear()
    } finally {
      loading.value = false
    }
  }

  async function fetchGearScores() {
    // Filter out characters that already have GS (main character from first request)
    const namesToFetch = selectedCharacters.value
      .filter((c: ArmoryCharacter) => !gearScores.value.has(c.name))
      .map((c: ArmoryCharacter) => c.name)
    
    if (namesToFetch.length === 0) return

    gsLoading.value = true
    gsProgress.value = { current: 0, total: namesToFetch.length }

    try {
      const results = await fetchGearScoresBatch(namesToFetch, (current, total) => {
        gsProgress.value = { current, total }
      })
      
      // Merge results into existing gear scores
      results.forEach((gs, name) => {
        gearScores.value.set(name, gs)
      })
    } finally {
      gsLoading.value = false
    }
  }

  function toggleCharacter(name: string) {
    const newSet = new Set(selectedNames.value)
    if (newSet.has(name)) {
      newSet.delete(name)
    } else {
      newSet.add(name)
    }
    selectedNames.value = newSet
  }

  function selectAll() {
    selectedNames.value = new Set(characters.value.map((c: ArmoryCharacter) => c.name))
  }

  function selectNone() {
    selectedNames.value.clear()
  }

  function importSelected() {
    if (selectedCharacters.value.length === 0) return

    const result = charactersStore.importFromArmory(selectedCharacters.value, gearScores.value)
    options.onImported?.(result)

    close()
    reset()
  }

  function open() {
    isOpen.value = true
    document.body.classList.add('body-no-scroll')
  }

  function close() {
    isOpen.value = false
    document.body.classList.remove('body-no-scroll')
  }

  function reset() {
    characterName.value = ''
    characters.value = []
    selectedNames.value.clear()
    gearScores.value.clear()
    error.value = ''
  }

  // Cleanup on unmount
  onUnmounted(() => {
    document.body.classList.remove('body-no-scroll')
  })

  return {
    // State
    characterName,
    characters,
    selectedNames,
    gearScores,
    loading,
    gsLoading,
    gsProgress,
    error,
    isOpen,

    // Computed
    hasCharacters,
    selectedCount,
    canFetch,
    canImport,
    canFetchGearScores,
    selectedCharacters,

    // Actions
    setCharacterName,
    fetchCharacters,
    fetchGearScores,
    toggleCharacter,
    selectAll,
    selectNone,
    importSelected,
    open,
    close,
    reset,
  }
}