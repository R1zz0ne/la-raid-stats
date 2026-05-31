// Component tests for DifficultyBadge

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DifficultyBadge from '@/components/molecules/DifficultyBadge.vue'

describe('DifficultyBadge', () => {
  it('renders difficulty type', () => {
    const wrapper = mount(DifficultyBadge, {
      props: { type: 'normal' },
    })

    expect(wrapper.text()).toContain('Обычный')
  })

  it('renders nightmare difficulty', () => {
    const wrapper = mount(DifficultyBadge, {
      props: { type: 'nightmare' },
    })

    expect(wrapper.text()).toContain('Кошмар')
  })

  it('renders heroic difficulty', () => {
    const wrapper = mount(DifficultyBadge, {
      props: { type: 'heroic' },
    })

    expect(wrapper.text()).toContain('Героический')
  })

  it('renders solo difficulty', () => {
    const wrapper = mount(DifficultyBadge, {
      props: { type: 'solo' },
    })

    expect(wrapper.text()).toContain('Одиночный')
  })
})