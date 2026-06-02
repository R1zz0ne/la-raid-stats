// Tests for BaseSelect component

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseSelect from '@/components/atoms/BaseSelect.vue'

describe('BaseSelect', () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ]

  describe('rendering', () => {
    it('renders select element', () => {
      const wrapper = mount(BaseSelect, {
        props: { options },
      })

      expect(wrapper.find('select').exists()).toBe(true)
    })

    it('renders label', () => {
      const wrapper = mount(BaseSelect, {
        props: { options, label: 'Select Option' },
      })

      expect(wrapper.find('label').text()).toBe('Select Option')
    })

    it('renders all options', () => {
      const wrapper = mount(BaseSelect, {
        props: { options },
      })

      const optionsEls = wrapper.findAll('select option')
      expect(optionsEls).toHaveLength(3)
    })

    it('renders option labels', () => {
      const wrapper = mount(BaseSelect, {
        props: { options },
      })

      expect(wrapper.find('select option:nth-child(1)').text()).toBe('Option 1')
      expect(wrapper.find('select option:nth-child(2)').text()).toBe('Option 2')
    })
  })

  describe('v-model', () => {
    it('displays selected value', () => {
      const wrapper = mount(BaseSelect, {
        props: { options, modelValue: 'option2' },
      })

      expect((wrapper.find('select').element as HTMLSelectElement).value).toBe('option2')
    })

    it('emits update:modelValue on change', async () => {
      const wrapper = mount(BaseSelect, {
        props: { options, modelValue: '' },
      })

      await wrapper.find('select').setValue('option2')

      expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
      expect(wrapper.emitted('update:modelValue')[0]).toEqual(['option2'])
    })
  })

  describe('events', () => {
    it('emits change event', async () => {
      const wrapper = mount(BaseSelect, {
        props: { options },
      })

      await wrapper.find('select').trigger('change')

      expect(wrapper.emitted('change')).toBeTruthy()
    })
  })

  describe('states', () => {
    it('is disabled when disabled prop is true', () => {
      const wrapper = mount(BaseSelect, {
        props: { options, disabled: true },
      })

      expect(wrapper.find('select').attributes('disabled')).toBeDefined()
    })

    it('shows error class when error prop is set', () => {
      const wrapper = mount(BaseSelect, {
        props: { options, error: 'Required field' },
      })

      expect(wrapper.find('.base-select--error').exists()).toBe(true)
    })
  })
})