// Tests for BaseRadioGroup component

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseRadioGroup from '@/components/atoms/BaseRadioGroup.vue'

describe('BaseRadioGroup', () => {
  const options = [
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' },
    { value: 'opt3', label: 'Option 3' },
  ]

  describe('rendering', () => {
    it('renders all options', () => {
      const wrapper = mount(BaseRadioGroup, {
        props: { options },
      })

      const radioInputs = wrapper.findAll('input[type="radio"]')
      expect(radioInputs).toHaveLength(3)
    })

    it('renders option labels', () => {
      const wrapper = mount(BaseRadioGroup, {
        props: { options },
      })

      expect(wrapper.text()).toContain('Option 1')
      expect(wrapper.text()).toContain('Option 2')
      expect(wrapper.text()).toContain('Option 3')
    })

    it('renders with description', () => {
      const optionsWithDesc = [
        { value: 'opt1', label: 'Option 1', description: 'Description 1' },
        { value: 'opt2', label: 'Option 2', description: 'Description 2' },
      ]

      const wrapper = mount(BaseRadioGroup, {
        props: { options: optionsWithDesc },
      })

      expect(wrapper.text()).toContain('Description 1')
      expect(wrapper.text()).toContain('Description 2')
    })
  })

  describe('v-model', () => {
    it('displays selected value', () => {
      const wrapper = mount(BaseRadioGroup, {
        props: { options, modelValue: 'opt2' },
      })

      const opt2Radio = wrapper.find('input[value="opt2"]')
      expect((opt2Radio.element as HTMLInputElement).checked).toBe(true)
    })

    it('emits update:modelValue on selection', async () => {
      const wrapper = mount(BaseRadioGroup, {
        props: { options, modelValue: '' },
      })

      await wrapper.find('input[value="opt2"]').setValue()

      expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
      expect(wrapper.emitted('update:modelValue')[0]).toEqual(['opt2'])
    })
  })

  describe('states', () => {
    it('disables options when disabled prop is true', () => {
      const wrapper = mount(BaseRadioGroup, {
        props: { options, disabled: true },
      })

      const radioInputs = wrapper.findAll('input[type="radio"]')
      radioInputs.forEach(input => {
        expect(input.attributes('disabled')).toBeDefined()
      })
    })
  })
})