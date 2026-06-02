// Tests for RaidDifficultyChip component

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RaidDifficultyChip from '@/components/atoms/RaidDifficultyChip.vue'
import type { Difficulty } from '@/types'

describe('RaidDifficultyChip', () => {
  const mockDifficulty: Difficulty = {
    type: 'normal',
    requiredGearScore: 1500,
    regularGold: 100,
    limitedGold: 50,
  }

  describe('rendering', () => {
    it('renders with difficulty prop', () => {
      const wrapper = mount(RaidDifficultyChip, {
        props: {
          difficulty: mockDifficulty,
          isSelected: false,
        },
      })

      expect(wrapper.find('.difficulty-chip').exists()).toBe(true)
    })

    it('renders difficulty badge', () => {
      const wrapper = mount(RaidDifficultyChip, {
        props: {
          difficulty: mockDifficulty,
          isSelected: false,
        },
      })

      expect(wrapper.find('.difficulty-badge').exists()).toBe(true)
    })
  })

  describe('states', () => {
    it('applies selected class when isSelected is true', () => {
      const wrapper = mount(RaidDifficultyChip, {
        props: {
          difficulty: mockDifficulty,
          isSelected: true,
        },
      })

      expect(wrapper.find('.difficulty-chip--selected').exists()).toBe(true)
    })
  })

  describe('interactions', () => {
    it('emits select event on click', async () => {
      const wrapper = mount(RaidDifficultyChip, {
        props: {
          difficulty: mockDifficulty,
          isSelected: false,
        },
      })

      await wrapper.trigger('click')

      expect(wrapper.emitted('select')).toBeTruthy()
    })
  })
})