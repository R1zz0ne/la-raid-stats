// Component tests for BaseButton

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '@/components/atoms/BaseButton.vue'

describe('BaseButton', () => {
  it('renders with default variant', () => {
    const wrapper = mount(BaseButton, {
      slots: { default: 'Click me' },
    })

    expect(wrapper.text()).toContain('Click me')
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('renders with custom text', () => {
    const wrapper = mount(BaseButton, {
      slots: { default: 'Submit' },
    })

    expect(wrapper.text()).toBe('Submit')
  })

  it('emits click event', async () => {
    const wrapper = mount(BaseButton)
    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('is disabled when disabled prop is true', () => {
    const wrapper = mount(BaseButton, {
      props: { disabled: true },
    })

    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('applies variant class', () => {
    const wrapper = mount(BaseButton, {
      props: { variant: 'danger' },
    })

    expect(wrapper.find('.base-button--danger').exists()).toBe(true)
  })

  it('shows loading state', () => {
    const wrapper = mount(BaseButton, {
      props: { loading: true },
    })

    expect(wrapper.find('.base-button--loading').exists()).toBe(true)
    expect(wrapper.find('.base-button__spinner').exists()).toBe(true)
  })
})