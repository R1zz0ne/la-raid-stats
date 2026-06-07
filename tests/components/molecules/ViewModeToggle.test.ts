// Tests for ViewModeToggle component

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ViewModeToggle from '@/components/molecules/ViewModeToggle.vue'
import type { ViewMode } from '@/types'

describe('ViewModeToggle', () => {
  describe('rendering', () => {
    it('renders two toggle buttons', () => {
      const wrapper = mount(ViewModeToggle, {
        props: { modelValue: 'cards' },
      })

      const buttons = wrapper.findAll('button')
      expect(buttons).toHaveLength(2)
    })

    it('renders cards and table icons', () => {
      const wrapper = mount(ViewModeToggle, {
        props: { modelValue: 'cards' },
      })

      expect(wrapper.text()).toContain('▦')
      expect(wrapper.text()).toContain('☰')
    })

    it('renders with role group', () => {
      const wrapper = mount(ViewModeToggle, {
        props: { modelValue: 'cards' },
      })

      expect(wrapper.find('[role="group"]').exists()).toBe(true)
      expect(wrapper.find('[aria-label="Вид отображения"]').exists()).toBe(true)
    })
  })

  describe('states', () => {
    it('marks cards button as active when viewMode is cards', () => {
      const wrapper = mount(ViewModeToggle, {
        props: { modelValue: 'cards' },
      })

      const buttons = wrapper.findAll('button')
      expect(buttons[0].classes()).toContain('view-mode-toggle__btn--active')
      expect(buttons[1].classes()).not.toContain('view-mode-toggle__btn--active')
    })

    it('marks table button as active when viewMode is table', () => {
      const wrapper = mount(ViewModeToggle, {
        props: { modelValue: 'table' },
      })

      const buttons = wrapper.findAll('button')
      expect(buttons[0].classes()).not.toContain('view-mode-toggle__btn--active')
      expect(buttons[1].classes()).toContain('view-mode-toggle__btn--active')
    })
  })

  describe('events', () => {
    it('emits update:modelValue with cards when clicking cards button', async () => {
      const wrapper = mount(ViewModeToggle, {
        props: { modelValue: 'table' },
      })

      const buttons = wrapper.findAll('button')
      await buttons[0].trigger('click')

      const emitted = wrapper.emitted<[ViewMode][]>('update:modelValue')
      expect(emitted).toBeTruthy()
      expect(emitted?.[0][0]).toBe('cards')
    })

    it('emits update:modelValue with table when clicking table button', async () => {
      const wrapper = mount(ViewModeToggle, {
        props: { modelValue: 'cards' },
      })

      const buttons = wrapper.findAll('button')
      await buttons[1].trigger('click')

      const emitted = wrapper.emitted<[ViewMode][]>('update:modelValue')
      expect(emitted).toBeTruthy()
      expect(emitted?.[0][0]).toBe('table')
    })
  })

  describe('accessibility', () => {
    it('sets aria-pressed on cards button', () => {
      const wrapper = mount(ViewModeToggle, {
        props: { modelValue: 'cards' },
      })

      const buttons = wrapper.findAll('button')
      expect(buttons[0].attributes('aria-pressed')).toBe('true')
      expect(buttons[1].attributes('aria-pressed')).toBe('false')
    })

    it('sets aria-pressed on table button', () => {
      const wrapper = mount(ViewModeToggle, {
        props: { modelValue: 'table' },
      })

      const buttons = wrapper.findAll('button')
      expect(buttons[0].attributes('aria-pressed')).toBe('false')
      expect(buttons[1].attributes('aria-pressed')).toBe('true')
    })

    it('has title for each button', () => {
      const wrapper = mount(ViewModeToggle, {
        props: { modelValue: 'cards' },
      })

      const buttons = wrapper.findAll('button')
      expect(buttons[0].attributes('title')).toBe('Карточки')
      expect(buttons[1].attributes('title')).toBe('Таблица')
    })
  })
})