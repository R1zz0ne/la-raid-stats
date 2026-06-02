// Tests for RaidItem component

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RaidItem from '@/components/molecules/RaidItem.vue'
import type { Raid } from '@/types'

describe('RaidItem', () => {
  const mockRaid: Raid = {
    id: 'test-raid',
    name: 'Test Raid',
    difficulties: [
      { type: 'normal', requiredGearScore: 1500, regularGold: 100, limitedGold: 50 },
      { type: 'heroic', requiredGearScore: 1700, regularGold: 200, limitedGold: 100 },
    ],
  }

  describe('rendering', () => {
    it('renders raid name', () => {
      const wrapper = mount(RaidItem, {
        props: {
          raid: mockRaid,
          difficultyType: 'normal',
          isCompleted: false,
        },
      })

      expect(wrapper.text()).toContain('Test Raid')
    })

    it('renders difficulty badge', () => {
      const wrapper = mount(RaidItem, {
        props: {
          raid: mockRaid,
          difficultyType: 'normal',
          isCompleted: false,
        },
      })

      expect(wrapper.find('.difficulty-badge').exists()).toBe(true)
    })

    it('renders gold amounts', () => {
      const wrapper = mount(RaidItem, {
        props: {
          raid: mockRaid,
          difficultyType: 'normal',
          isCompleted: false,
        },
      })

      expect(wrapper.text()).toContain('100')
      expect(wrapper.text()).toContain('50')
    })
  })

  describe('states', () => {
    it('applies completed class when isCompleted is true', () => {
      const wrapper = mount(RaidItem, {
        props: {
          raid: mockRaid,
          difficultyType: 'normal',
          isCompleted: true,
        },
      })

      expect(wrapper.find('.raid-item--completed').exists()).toBe(true)
    })

    it('applies disabled class when disabled prop is true', () => {
      const wrapper = mount(RaidItem, {
        props: {
          raid: mockRaid,
          difficultyType: 'normal',
          isCompleted: false,
          disabled: true,
        },
      })

      expect(wrapper.find('.raid-item--disabled').exists()).toBe(true)
    })
  })

  describe('events', () => {
    it('emits toggle event when checkbox changes', async () => {
      const wrapper = mount(RaidItem, {
        props: {
          raid: mockRaid,
          difficultyType: 'normal',
          isCompleted: false,
        },
      })

      // Find checkbox and change its model
      const checkbox = wrapper.findComponent({ name: 'BaseCheckbox' })
      await checkbox.vm.$emit('update:modelValue', true)

      expect(wrapper.emitted('toggle')).toBeTruthy()
    })

    it('emits remove event on remove button click', async () => {
      const wrapper = mount(RaidItem, {
        props: {
          raid: mockRaid,
          difficultyType: 'normal',
          isCompleted: false,
          editing: true,
        },
      })

      await wrapper.find('.raid-item__remove').trigger('click')

      expect(wrapper.emitted('remove')).toBeTruthy()
    })

    it('hides remove button when not editing', () => {
      const wrapper = mount(RaidItem, {
        props: {
          raid: mockRaid,
          difficultyType: 'normal',
          isCompleted: false,
          editing: false,
        },
      })

      expect(wrapper.find('.raid-item__remove').exists()).toBe(false)
    })

    it('shows remove button when editing', () => {
      const wrapper = mount(RaidItem, {
        props: {
          raid: mockRaid,
          difficultyType: 'normal',
          isCompleted: false,
          editing: true,
        },
      })

      expect(wrapper.find('.raid-item__remove').exists()).toBe(true)
    })
  })

  describe('gold display', () => {
    it('does not show gold items when all gold amounts are 0', () => {
      const raidWithNoGold: Raid = {
        id: 'solo-raid',
        name: 'Solo Raid',
        difficulties: [
          { type: 'solo', requiredGearScore: 1000, regularGold: 0, limitedGold: 0 },
        ],
      }

      const wrapper = mount(RaidItem, {
        props: {
          raid: raidWithNoGold,
          difficultyType: 'solo',
          isCompleted: false,
        },
      })

      // Gold container exists but with empty content
      expect(wrapper.find('.raid-item__gold-item').exists()).toBe(false)
    })
  })
})