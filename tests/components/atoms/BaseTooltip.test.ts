// Tests for BaseTooltip component

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseTooltip from '@/components/atoms/BaseTooltip.vue'

describe('BaseTooltip', () => {
  describe('rendering', () => {
    it('renders slot content', () => {
      const wrapper = mount(BaseTooltip, {
        slots: { default: 'Hover me' },
      })

      expect(wrapper.text()).toContain('Hover me')
    })

    it('renders with content prop', () => {
      const wrapper = mount(BaseTooltip, {
        props: { content: 'Tooltip text' },
        slots: { default: 'Hover me' },
      })

      expect(wrapper.text()).toContain('Hover me')
    })
  })

  describe('visibility', () => {
    it('hides tooltip by default', () => {
      const wrapper = mount(BaseTooltip, {
        props: { content: 'Tooltip' },
      })

      expect(wrapper.find('.base-tooltip__content').exists()).toBe(false)
    })

    it('shows tooltip on hover', async () => {
      const wrapper = mount(BaseTooltip, {
        props: { content: 'Tooltip' },
      })

      await wrapper.trigger('mouseenter')

      expect(wrapper.find('.base-tooltip__content').exists()).toBe(true)
    })

    it('hides tooltip on mouse leave', async () => {
      const wrapper = mount(BaseTooltip, {
        props: { content: 'Tooltip' },
      })

      await wrapper.trigger('mouseenter')
      await wrapper.trigger('mouseleave')

      expect(wrapper.find('.base-tooltip__content').exists()).toBe(false)
    })

    it('does not show when disabled', async () => {
      const wrapper = mount(BaseTooltip, {
        props: { content: 'Tooltip', disabled: true },
      })

      await wrapper.trigger('mouseenter')

      expect(wrapper.find('.base-tooltip__content').exists()).toBe(false)
    })
  })
})