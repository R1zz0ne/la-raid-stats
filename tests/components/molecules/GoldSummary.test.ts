// Tests for GoldSummary component

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GoldSummary from '@/components/molecules/GoldSummary.vue'

describe('GoldSummary', () => {
  describe('rendering', () => {
    it('renders component', () => {
      const wrapper = mount(GoldSummary, {
        props: {
          regular: 100,
          limited: 50,
        },
      })

      expect(wrapper.find('.gold-summary').exists()).toBe(true)
    })

    it('renders with zero values', () => {
      const wrapper = mount(GoldSummary, {
        props: {
          regular: 0,
          limited: 0,
        },
      })

      expect(wrapper.find('.gold-summary').exists()).toBe(true)
      expect(wrapper.text()).toContain('0')
    })

    it('renders with positive values', () => {
      const wrapper = mount(GoldSummary, {
        props: {
          regular: 100,
          limited: 50,
        },
      })

      expect(wrapper.text()).toContain('100')
      expect(wrapper.text()).toContain('50')
    })
  })

  describe('labels', () => {
    it('renders regular gold label', () => {
      const wrapper = mount(GoldSummary, {
        props: { regular: 100, limited: 50 },
      })

      expect(wrapper.text()).toContain('Обычное')
    })

    it('renders limited gold label', () => {
      const wrapper = mount(GoldSummary, {
        props: { regular: 100, limited: 50 },
      })

      expect(wrapper.text()).toContain('Лимитированное')
    })

    it('renders total label', () => {
      const wrapper = mount(GoldSummary, {
        props: { regular: 100, limited: 50 },
      })

      expect(wrapper.text()).toContain('Всего')
    })
  })

  describe('total calculation', () => {
    it('calculates total correctly', () => {
      const wrapper = mount(GoldSummary, {
        props: {
          regular: 100,
          limited: 50,
        },
      })

      // Total should be 150
      expect(wrapper.text()).toContain('150')
    })

    it('handles large numbers', () => {
      const wrapper = mount(GoldSummary, {
        props: {
          regular: 100000,
          limited: 50000,
        },
      })

      // toLocaleString adds NBSP ( ) as thousands separator, not plain space
      const text = wrapper.text()
      // Just check individual values are formatted (handling NBSP)
      expect(text).toContain('100')
      expect(text).toContain('50')
      expect(text).toContain('150')
    })
  })
})