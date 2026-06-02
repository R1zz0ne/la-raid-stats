// Tests for CharacterCard component

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CharacterCard from '@/components/molecules/CharacterCard.vue'
import type { Character, CharacterRaid, GoldSummary } from '@/types'

// Mock stores
vi.mock('@/stores/raids', () => ({
  useRaidsStore: () => ({
    getRaidById: vi.fn().mockImplementation((id) => ({
      id,
      name: 'Test Raid',
      difficulties: [{ type: 'normal', requiredGearScore: 1500, regularGold: 100, limitedGold: 50 }],
    })),
    raids: [],
  }),
}))

vi.mock('@/stores/characters', () => ({
  useCharactersStore: () => ({
    goldRecipientCount: vi.fn().mockReturnValue(1),
  }),
}))

describe('CharacterCard', () => {
  const mockCharacter: Character = {
    id: 'test-char',
    name: 'TestChar',
    gearScore: 1700,
    characterClass: 'bard',
    order: 0,
    isGoldRecipient: true,
  }

  const mockRaids: CharacterRaid[] = []
  const mockGoldSummary: GoldSummary = {
    regular: 100,
    limited: 50,
    total: 150,
  }

  describe('rendering', () => {
    it('renders character name', () => {
      const wrapper = mount(CharacterCard, {
        props: {
          character: mockCharacter,
          raids: mockRaids,
          goldSummary: mockGoldSummary,
        },
      })

      expect(wrapper.text()).toContain('TestChar')
    })

    it('renders class name', () => {
      const wrapper = mount(CharacterCard, {
        props: {
          character: mockCharacter,
          raids: mockRaids,
          goldSummary: mockGoldSummary,
        },
      })

      expect(wrapper.text()).toContain('Менестрель')
    })
  })

  describe('states', () => {
    it('applies gold recipient style when isGoldRecipient is true', () => {
      const wrapper = mount(CharacterCard, {
        props: {
          character: mockCharacter,
          raids: mockRaids,
          goldSummary: mockGoldSummary,
        },
      })

      expect(wrapper.find('.character-card--gold-recipient').exists()).toBe(true)
    })

    it('applies editing style when editing prop is true', () => {
      const wrapper = mount(CharacterCard, {
        props: {
          character: mockCharacter,
          raids: mockRaids,
          goldSummary: mockGoldSummary,
          editing: true,
        },
      })

      expect(wrapper.find('.character-card--editing').exists()).toBe(true)
    })
  })

  describe('events', () => {
    it('emits addRaid event when not editing', async () => {
      const wrapper = mount(CharacterCard, {
        props: {
          character: mockCharacter,
          raids: mockRaids,
          goldSummary: mockGoldSummary,
          editing: false,
        },
      })

      const button = wrapper.find('button')
      await button?.trigger('click')

      expect(wrapper.emitted('addRaid')).toBeTruthy()
    })
  })
})