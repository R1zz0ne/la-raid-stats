// Tests for BaseInput component

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseInput from '@/components/atoms/BaseInput.vue'

describe('BaseInput', () => {
  describe('rendering', () => {
    it('renders with default props', () => {
      const wrapper = mount(BaseInput)

      expect(wrapper.find('input').exists()).toBe(true)
    })

    it('renders with label', () => {
      const wrapper = mount(BaseInput, {
        props: { label: 'Test Label' },
      })

      expect(wrapper.find('label').text()).toBe('Test Label')
    })

    it('renders placeholder text', () => {
      const wrapper = mount(BaseInput, {
        props: { placeholder: 'Enter value' },
      })

      expect(wrapper.find('input').attributes('placeholder')).toBe('Enter value')
    })

    it('renders with error message', () => {
      const wrapper = mount(BaseInput, {
        props: { error: 'This field is required' },
      })

      expect(wrapper.text()).toContain('This field is required')
    })
  })

  describe('v-model', () => {
    it('emits update:modelValue on input', async () => {
      const wrapper = mount(BaseInput)

      await wrapper.find('input').setValue('test value')

      expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
      expect(wrapper.emitted('update:modelValue')[0]).toEqual(['test value'])
    })

    it('displays bound value', () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: 'initial' },
      })

      expect(wrapper.find('input').element.value).toBe('initial')
    })
  })

  describe('events', () => {
    it('emits blur event', async () => {
      const wrapper = mount(BaseInput)

      await wrapper.find('input').trigger('blur')

      expect(wrapper.emitted('blur')).toBeTruthy()
    })

    it('emits focus event', async () => {
      const wrapper = mount(BaseInput)

      await wrapper.find('input').trigger('focus')

      expect(wrapper.emitted('focus')).toBeTruthy()
    })
  })

  describe('states', () => {
    it('is disabled when disabled prop is true', () => {
      const wrapper = mount(BaseInput, {
        props: { disabled: true },
      })

      expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    })

    it('has error class when error prop is set', () => {
      const wrapper = mount(BaseInput, {
        props: { error: 'Error message' },
      })

      expect(wrapper.find('.base-input--error').exists()).toBe(true)
    })
  })

  describe('type prop', () => {
    it('renders as number input', () => {
      const wrapper = mount(BaseInput, {
        props: { type: 'number' },
      })

      expect(wrapper.find('input').attributes('type')).toBe('number')
    })

    it('renders as text input by default', () => {
      const wrapper = mount(BaseInput)

      expect(wrapper.find('input').attributes('type')).toBe('text')
    })
  })
})