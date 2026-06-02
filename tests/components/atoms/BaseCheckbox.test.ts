// Tests for BaseCheckbox component

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseCheckbox from '@/components/atoms/BaseCheckbox.vue'

describe('BaseCheckbox', () => {
  describe('rendering', () => {
    it('renders checkbox input', () => {
      const wrapper = mount(BaseCheckbox)

      expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
    })

    it('renders label text', () => {
      const wrapper = mount(BaseCheckbox, {
        props: { label: 'Accept terms' },
      })

      expect(wrapper.text()).toContain('Accept terms')
    })

    it('renders without label', () => {
      const wrapper = mount(BaseCheckbox)

      expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
    })
  })

  describe('v-model', () => {
    it('displays checked state', () => {
      const wrapper = mount(BaseCheckbox, {
        props: { modelValue: true },
      })

      expect((wrapper.find('input[type="checkbox"]').element as HTMLInputElement).checked).toBe(true)
    })

    it('displays unchecked state', () => {
      const wrapper = mount(BaseCheckbox, {
        props: { modelValue: false },
      })

      expect((wrapper.find('input[type="checkbox"]').element as HTMLInputElement).checked).toBe(false)
    })

    it('emits update:modelValue on change', async () => {
      const wrapper = mount(BaseCheckbox, {
        props: { modelValue: false },
      })

      await wrapper.find('input[type="checkbox"]').setValue(true)

      expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
      expect(wrapper.emitted('update:modelValue')[0]).toEqual([true])
    })
  })

  describe('states', () => {
    it('is disabled when disabled prop is true', () => {
      const wrapper = mount(BaseCheckbox, {
        props: { disabled: true },
      })

      expect(wrapper.find('input[type="checkbox"]').attributes('disabled')).toBeDefined()
    })
  })
})