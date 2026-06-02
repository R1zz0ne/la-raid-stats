// Tests for GoldProgress component

import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import GoldProgress from '@/components/molecules/GoldProgress.vue'

// Mock stores
vi.mock('@/stores/characters', () => ({
  useCharactersStore: () => ({
    characters: [],
    getRaidsForCharacter: vi.fn().mockReturnValue([]),
    getGoldSummary: vi.fn().mockReturnValue({ regular: 0, limited: 0, total: 0 }),
  }),
}))

vi.mock('@/stores/raids', () => ({
  useRaidsStore: () => ({
    getRaidById: vi.fn(),
  }),
}))

describe('GoldProgress', () => {
  describe('basic rendering', () => {
    it('renders component', () => {
      const wrapper = mount(GoldProgress)
      expect(wrapper.exists()).toBe(true)
    })
  })
})