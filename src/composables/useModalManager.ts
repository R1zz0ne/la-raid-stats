// Lost Ark Raid Tracker - useModalManager Composable
// ===================================================

import { ref, watch, type Ref, onUnmounted } from 'vue'
import type { Character, CharacterFormData } from '@/types'
import { useCharactersStore } from '@/stores/characters'

export interface UseModalManagerOptions {
  onCharacterFormSubmit?: (data: CharacterFormData) => void
  onRaidModalClose?: () => void
}

export interface UseModalManagerReturn {
  // Character form state
  showCharacterForm: Ref<boolean>
  editingCharacter: Ref<Character | undefined>

  // Raid modal state
  showRaidModal: Ref<boolean>
  selectedCharacter: Ref<Character | null>

  // Character form actions
  openCharacterForm: (character?: Character) => void
  closeCharacterForm: () => void
  submitCharacterForm: (data: CharacterFormData) => void

  // Raid modal actions
  openRaidModal: (character: Character) => void
  closeRaidModal: () => void

  // Computed
  isModalOpen: Ref<boolean>
}

/**
 * Composable for managing DashboardView modals
 * Handles body scroll lock, character form, and raid assignment modal
 */
export function useModalManager(options: UseModalManagerOptions = {}): UseModalManagerReturn {
  const charactersStore = useCharactersStore()

  // Character form state
  const showCharacterForm = ref(false)
  const editingCharacter = ref<Character | undefined>()

  // Raid modal state
  const showRaidModal = ref(false)
  const selectedCharacter = ref<Character | null>(null)

  // Computed: any modal is open
  const isModalOpen = ref(false)

  // Watch for modal state changes and lock body scroll
  watch([showCharacterForm, showRaidModal], ([formOpen, raidOpen]) => {
    isModalOpen.value = formOpen || raidOpen

    if (formOpen || raidOpen) {
      document.body.classList.add('body-no-scroll')
    } else {
      document.body.classList.remove('body-no-scroll')
    }
  }, { immediate: true })

  // Cleanup on unmount
  onUnmounted(() => {
    document.body.classList.remove('body-no-scroll')
  })

  // Character form actions
  function openCharacterForm(character?: Character): void {
    editingCharacter.value = character
    showCharacterForm.value = true
  }

  function closeCharacterForm(): void {
    showCharacterForm.value = false
    editingCharacter.value = undefined
  }

  function submitCharacterForm(data: CharacterFormData, _oldName?: string): void {
    if (editingCharacter.value) {
      charactersStore.updateCharacter(editingCharacter.value.id, {
        name: data.name,
        gearScore: data.gearScore,
        characterClass: data.characterClass,
        customClassName: data.customClassName,
      })
    } else {
      charactersStore.addCharacter(data)
    }

    closeCharacterForm()
    options.onCharacterFormSubmit?.(data)
  }

  // Raid modal actions
  function openRaidModal(character: Character): void {
    selectedCharacter.value = character
    showRaidModal.value = true
  }

  function closeRaidModal(): void {
    showRaidModal.value = false
    selectedCharacter.value = null
    options.onRaidModalClose?.()
  }

  return {
    // State
    showCharacterForm,
    editingCharacter,
    showRaidModal,
    selectedCharacter,
    isModalOpen,

    // Actions
    openCharacterForm,
    closeCharacterForm,
    submitCharacterForm,
    openRaidModal,
    closeRaidModal,
  }
}