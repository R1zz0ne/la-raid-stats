// Tests for RaidCard component

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RaidCard from '@/components/organisms/RaidCard.vue'
import type { Raid } from '@/types'

describe('RaidCard', () => {
  const mockRaid: Raid = {
    id: 'test-raid',
    name: 'Test Raid',
    difficulties: [
      { type: 'normal', requiredGearScore: 1500, regularGold: 100, limitedGold: 50 },
      { type: 'heroic', requiredGearScore: 1700, regularGold: 200, limitedGold: 100 },
      { type: 'nightmare', requiredGearScore: 2000, regularGold: 300, limitedGold: 150 },
    ],
  }

  describe('rendering', () => {
    it('renders raid name', () => {
      const wrapper = mount(RaidCard, {
        props: { raid: mockRaid },
      })

      expect(wrapper.find('.raid-card__name').text()).toBe('Test Raid')
    })

    it('renders difficulty badges', () => {
      const wrapper = mount(RaidCard, {
        props: { raid: mockRaid },
      })

      const badges = wrapper.findAll('.difficulty-badge')
      expect(badges).toHaveLength(3)
    })

    it('renders minimum gear score', () => {
      const wrapper = mount(RaidCard, {
        props: { raid: mockRaid },
      })

      expect(wrapper.text()).toContain('1500')
    })
  })

  describe('actions', () => {
    it('renders edit button', () => {
      const wrapper = mount(RaidCard, {
        props: { raid: mockRaid },
      })

      expect(wrapper.text()).toContain('Редактировать')
    })

    it('renders delete button', () => {
      const wrapper = mount(RaidCard, {
        props: { raid: mockRaid },
      })

      expect(wrapper.text()).toContain('Удалить')
    })

    it('emits edit event', async () => {
      const wrapper = mount(RaidCard, {
        props: { raid: mockRaid },
      })

      await wrapper.findAll('button').at(0)?.trigger('click')

      expect(wrapper.emitted('edit')).toBeTruthy()
      expect(wrapper.emitted('edit')[0]).toEqual(['test-raid'])
    })

    it('emits delete event', async () => {
      const wrapper = mount(RaidCard, {
        props: { raid: mockRaid },
      })

      await wrapper.findAll('button').at(1)?.trigger('click')

      expect(wrapper.emitted('delete')).toBeTruthy()
      expect(wrapper.emitted('delete')[0]).toEqual(['test-raid'])
    })
  })

  describe('gold display', () => {
    it('displays gold amounts for each difficulty', () => {
      const wrapper = mount(RaidCard, {
        props: { raid: mockRaid },
      })

      // Regular gold amounts
      expect(wrapper.text()).toContain('100')
      expect(wrapper.text()).toContain('200')
      expect(wrapper.text()).toContain('300')
    })
  })
})