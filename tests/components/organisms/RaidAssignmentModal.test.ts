// Tests for RaidAssignmentModal component

import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import RaidAssignmentModal from '@/components/organisms/RaidAssignmentModal.vue'
import type { Character } from '@/types'

// Mock stores with complete API
vi.mock('@/stores/raids', () => ({
  useRaidsStore: () => ({
    raids: [
      {
        id: 'raid-1',
        name: 'Available Raid',
        difficulties: [{ type: 'normal', requiredGearScore: 1500, regularGold: 100, limitedGold: 50 }],
      },
    ],
    getAvailableRaidsForGearScore: () => [
      {
        id: 'raid-1',
        name: 'Available Raid',
        difficulties: [{ type: 'normal', requiredGearScore: 1500, regularGold: 100, limitedGold: 50 }],
      },
    ],
    getRaidById: vi.fn().mockReturnValue({
      id: 'raid-1',
      name: 'Available Raid',
      difficulties: [{ type: 'normal', requiredGearScore: 1500, regularGold: 100, limitedGold: 50 }],
    }),
  }),
}))

vi.mock('@/stores/characters', () => ({
  useCharactersStore: () => ({
    addCharacterRaid: vi.fn(),
    getRaidsForCharacter: vi.fn().mockReturnValue([]),
    characters: [],
  }),
}))

describe('RaidAssignmentModal', () => {
  const mockCharacter: Character = {
    id: 'test-char',
    name: 'TestChar',
    gearScore: 1700,
    characterClass: 'bard',
    order: 0,
  }

  describe('basic rendering', () => {
    it('renders with character prop', async () => {
      const wrapper = mount(RaidAssignmentModal, {
        props: { character: mockCharacter },
      })
      await flushPromises()

      expect(wrapper.exists()).toBe(true)
    })
  })
})